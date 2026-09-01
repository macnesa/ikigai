import { Resend } from "resend";

const MAX_REQUEST_BYTES = 10_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_ENTRIES = 5_000;

const ALLOWED_INTERESTS = new Map([
  ["sauna", "Sauna"],
  ["ice-bath", "Ice Bath"],
  ["combined", "Sauna + Ice Bath"],
  ["complete-space", "Complete Wellness Space"],
  ["unsure", "Not Sure Yet"],
]);

const EXPECTED_FIELDS = new Set([
  "name",
  "whatsapp",
  "propertyType",
  "location",
  "interest",
  "termsAccepted",
  "marketingConsent",
  "website",
]);

const rateLimitEntries = new Map();

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim().slice(0, 128);
  }

  return (
    request.headers.get("x-real-ip")?.trim().slice(0, 128) ||
    request.headers.get("cf-connecting-ip")?.trim().slice(0, 128) ||
    ""
  );
}

function isRateLimited(ip) {
  if (!ip) {
    return false;
  }

  const now = Date.now();

  for (const [storedIp, entry] of rateLimitEntries) {
    if (entry.expiresAt <= now) {
      rateLimitEntries.delete(storedIp);
    }
  }

  const currentEntry = rateLimitEntries.get(ip);

  if (!currentEntry) {
    if (rateLimitEntries.size >= RATE_LIMIT_MAX_ENTRIES) {
      const oldestIp = rateLimitEntries.keys().next().value;

      if (oldestIp) {
        rateLimitEntries.delete(oldestIp);
      }
    }

    rateLimitEntries.set(ip, {
      count: 1,
      expiresAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return false;
  }

  if (currentEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  currentEntry.count += 1;
  return false;
}

function validateString(value, field, maxLength, errors) {
  if (typeof value !== "string") {
    errors[field] = "This field is required.";
    return "";
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    errors[field] = "This field is required.";
  } else if (normalizedValue.length > maxLength) {
    errors[field] = `Must be ${maxLength} characters or fewer.`;
  } else if (/\r|\n/.test(normalizedValue)) {
    errors[field] = "Must be a single line of text.";
  }

  return normalizedValue;
}

function validatePayload(payload) {
  const errors = {};

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      errors: { form: "Request body must be a JSON object." },
      values: null,
    };
  }

  const unexpectedFields = Object.keys(payload).filter(
    (field) => !EXPECTED_FIELDS.has(field),
  );

  if (unexpectedFields.length > 0) {
    errors.form = "Request contains unexpected fields.";
  }

  const name = validateString(payload.name, "name", 100, errors);
  const whatsapp = validateString(payload.whatsapp, "whatsapp", 40, errors);
  const propertyType = validateString(
    payload.propertyType,
    "propertyType",
    120,
    errors,
  );
  const location = validateString(payload.location, "location", 120, errors);
  const interest =
    typeof payload.interest === "string" ? payload.interest.trim() : "";

  if (!ALLOWED_INTERESTS.has(interest)) {
    errors.interest = "Please select a valid interest.";
  }

  if (whatsapp) {
    const digitCount = (whatsapp.match(/\d/g) || []).length;

    if (!/^[+\d().\-\s]+$/.test(whatsapp) || digitCount < 6) {
      errors.whatsapp = "Please enter a valid WhatsApp number.";
    }
  }

  if (payload.termsAccepted !== true) {
    errors.termsAccepted = "You must accept the terms and privacy policy.";
  }

  if (typeof payload.marketingConsent !== "boolean") {
    errors.marketingConsent = "Marketing consent must be true or false.";
  }

  if (typeof payload.website !== "string") {
    errors.form = "Request contains an invalid field type.";
  }

  return {
    errors,
    values: {
      name,
      whatsapp,
      propertyType,
      location,
      interest,
      termsAccepted: payload.termsAccepted,
      marketingConsent: payload.marketingConsent,
    },
  };
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildEmailContent(values) {
  const interestLabel = ALLOWED_INTERESTS.get(values.interest);
  const marketingLabel = values.marketingConsent ? "Yes" : "No";
  const submittedAt = new Date().toISOString();
  const safe = {
    name: escapeHtml(values.name),
    whatsapp: escapeHtml(values.whatsapp),
    propertyType: escapeHtml(values.propertyType),
    location: escapeHtml(values.location),
    interest: escapeHtml(interestLabel),
    marketing: escapeHtml(marketingLabel),
    submittedAt: escapeHtml(submittedAt),
  };

  return {
    subject: `New Wellness Consultation — ${values.name.replace(/[\r\n]+/g, " ")}`,
    text: [
      "NEW WELLNESS CONSULTATION",
      "",
      `Name: ${values.name}`,
      `WhatsApp: ${values.whatsapp}`,
      `Property / Project Type: ${values.propertyType}`,
      `Location: ${values.location}`,
      `Interested In: ${interestLabel}`,
      "Terms Accepted: Yes",
      `Marketing Updates: ${marketingLabel}`,
      `Submitted At: ${submittedAt}`,
    ].join("\n"),
    html: `
      <h1>NEW WELLNESS CONSULTATION</h1>
      <p><strong>Name:</strong><br>${safe.name}</p>
      <p><strong>WhatsApp:</strong><br>${safe.whatsapp}</p>
      <p><strong>Property / Project Type:</strong><br>${safe.propertyType}</p>
      <p><strong>Location:</strong><br>${safe.location}</p>
      <p><strong>Interested In:</strong><br>${safe.interest}</p>
      <p><strong>Terms Accepted:</strong><br>Yes</p>
      <p><strong>Marketing Updates:</strong><br>${safe.marketing}</p>
      <p><strong>Submitted At:</strong><br>${safe.submittedAt}</p>
    `.trim(),
  };
}

export async function POST(request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";

  if (!contentType.startsWith("application/json")) {
    return jsonResponse(
      {
        ok: false,
        message: "Please submit the form using a valid request.",
        errors: { form: "Content type must be application/json." },
      },
      400,
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse(
      { ok: false, message: "Request payload is too large." },
      413,
    );
  }

  let bodyText;

  try {
    bodyText = await request.text();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "Please submit the form using a valid request.",
        errors: { form: "Request body could not be read." },
      },
      400,
    );
  }

  if (new TextEncoder().encode(bodyText).length > MAX_REQUEST_BYTES) {
    return jsonResponse(
      { ok: false, message: "Request payload is too large." },
      413,
    );
  }

  let payload;

  try {
    payload = JSON.parse(bodyText);
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "Please submit the form using a valid request.",
        errors: { form: "Request body must be valid JSON." },
      },
      400,
    );
  }

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    typeof payload.website === "string" &&
    payload.website.trim()
  ) {
    return jsonResponse({
      ok: true,
      message: "Your consultation request has been sent.",
    });
  }

  const { errors, values } = validatePayload(payload);

  if (Object.keys(errors).length > 0) {
    return jsonResponse(
      {
        ok: false,
        message: "Please review the highlighted fields.",
        errors,
      },
      400,
    );
  }

  if (isRateLimited(getClientIp(request))) {
    return jsonResponse(
      {
        ok: false,
        message: "Too many requests. Please try again shortly.",
      },
      429,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONSULTATION_TO_EMAIL;
  const fromEmail = process.env.CONSULTATION_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error("Consultation email service configuration is incomplete.");

    return jsonResponse(
      {
        ok: false,
        message: "Consultation service is temporarily unavailable.",
      },
      500,
    );
  }

  const email = buildEmailContent(values);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    if (error) {
      console.error("Consultation email delivery failed.");

      return jsonResponse(
        {
          ok: false,
          message: "We couldn't send your request right now. Please try again.",
        },
        500,
      );
    }
  } catch {
    console.error("Consultation email delivery failed.");

    return jsonResponse(
      {
        ok: false,
        message: "We couldn't send your request right now. Please try again.",
      },
      500,
    );
  }

  return jsonResponse({
    ok: true,
    message: "Your consultation request has been sent.",
  });
}
