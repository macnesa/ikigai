import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const moduleSource = await readFile(
  new URL("../lib/lead-webhook.js", import.meta.url),
  "utf8",
);
const testableModuleSource = moduleSource.replace('import "server-only";', "");
const webhook = await import(
  `data:text/javascript;base64,${Buffer.from(testableModuleSource).toString("base64")}`
);

const validValues = {
  name: "Test Lead",
  whatsapp: "+62 812-3456-7890",
  propertyType: "Villa",
  location: "Canggu",
  interest: "combined",
  timeline: "ASAP / 0-1 month",
  requestType: "Consultation",
  termsAccepted: true,
  marketingConsent: false,
  eventId: "123e4567-e89b-42d3-a456-426614174000",
};

const validEnvironment = {
  LEAD_WEBHOOK_URL: "https://hook.example.test/lead",
  LEAD_WEBHOOK_TOKEN: "test-token",
};

test("normalizes conservative international phone numbers", () => {
  assert.equal(
    webhook.normalizeInternationalPhone("+62 812-3456-7890"),
    "+6281234567890",
  );
  assert.equal(
    webhook.normalizeInternationalPhone("+6281234567890"),
    "+6281234567890",
  );

  for (const value of [
    "081234567890",
    "81234567890",
    "hello",
    "+0123456789",
    "+62",
    "+1234567890123456",
  ]) {
    assert.equal(webhook.normalizeInternationalPhone(value), "");
  }
});

test("maps campaign and same-origin page attribution safely", () => {
  const requestUrl = "https://go.weareikigai.co/api/consultation";

  assert.deepEqual(
    webhook.getLeadAttribution({
      requestUrl,
      referrer: "https://go.weareikigai.co/?c=bydws",
    }),
    {
      campaign: "bydws",
      pageUrl: "https://go.weareikigai.co/?c=bydws",
    },
  );
  assert.equal(
    webhook.getLeadAttribution({
      requestUrl,
      referrer: "https://go.weareikigai.co/?c=meta_bali_01",
    }).campaign,
    "meta_bali_01",
  );
  assert.equal(
    webhook.getLeadAttribution({
      requestUrl,
      referrer: "https://go.weareikigai.co/",
    }).campaign,
    "bydws",
  );
  assert.equal(
    webhook.getLeadAttribution({
      requestUrl,
      referrer: `https://go.weareikigai.co/?c=${"x".repeat(65)}`,
    }).campaign,
    "bydws",
  );
  assert.deepEqual(
    webhook.getLeadAttribution({
      requestUrl,
      referrer: "https://attacker.example/?c=wrong",
    }),
    {
      campaign: "bydws",
      pageUrl: "https://go.weareikigai.co/",
    },
  );
});

test("builds the exact final payload contract", () => {
  const payload = webhook.buildLeadWebhookPayload({
    values: validValues,
    attribution: {
      campaign: "meta_bali_01",
      pageUrl: "https://go.weareikigai.co/?c=meta_bali_01",
    },
    submittedAt: new Date("2026-09-17T09:05:00.000Z"),
  });

  assert.deepEqual(payload, {
    campaign: "meta_bali_01",
    full_name: "Test Lead",
    phone: "+6281234567890",
    property_type: "Villa",
    location: "Canggu",
    interest: "sauna_ice_bath",
    timeline: "asap_0_1_month",
    request: "consultation",
    terms_accepted: true,
    marketing_consent: false,
    event_id: "123e4567-e89b-42d3-a456-426614174000",
    page_url: "https://go.weareikigai.co/?c=meta_bali_01",
    submitted_at: "2026-09-17T17:05:00.000+08:00",
  });
  assert.deepEqual(Object.keys(payload), [
    "campaign",
    "full_name",
    "phone",
    "property_type",
    "location",
    "interest",
    "timeline",
    "request",
    "terms_accepted",
    "marketing_consent",
    "event_id",
    "page_url",
    "submitted_at",
  ]);
});

test("maps every approved select option to its final webhook value", () => {
  const cases = [
    ["interest", "sauna", "sauna"],
    ["interest", "ice-bath", "ice_bath"],
    ["interest", "combined", "sauna_ice_bath"],
    ["interest", "complete-space", "complete_space"],
    ["interest", "unsure", "not_sure"],
    ["timeline", "ASAP / 0-1 month", "asap_0_1_month"],
    ["timeline", "1-3 months", "1_3_months"],
    ["timeline", "3-6 months", "3_6_months"],
    ["timeline", "Just exploring", "just_exploring"],
    ["requestType", "Catalogue", "catalogue"],
    ["requestType", "Price / Quotation", "quotation"],
    ["requestType", "Consultation", "consultation"],
    ["requestType", "Site Assessment", "site_assessment"],
  ];

  for (const [field, input, expected] of cases) {
    const payload = webhook.buildLeadWebhookPayload({
      values: { ...validValues, [field]: input },
      attribution: {
        campaign: "bydws",
        pageUrl: "https://go.weareikigai.co/?c=bydws",
      },
      submittedAt: new Date("2026-09-17T09:05:00.000Z"),
    });
    const payloadField = field === "requestType" ? "request" : field;

    assert.equal(payload[payloadField], expected);
  }
});

test("rejects missing configuration without making a request", async () => {
  for (const environment of [
    { LEAD_WEBHOOK_TOKEN: "test-token" },
    { LEAD_WEBHOOK_URL: "https://hook.example.test/lead" },
  ]) {
    let requestCount = 0;
    const result = await webhook.deliverLeadWebhook({
      values: validValues,
      requestUrl: "https://go.weareikigai.co/api/consultation",
      referrer: "https://go.weareikigai.co/?c=bydws",
      environment,
      fetchImplementation: async () => {
        requestCount += 1;
        return { status: 200 };
      },
    });

    assert.deepEqual(result, {
      status: "failed",
      category: "configuration",
    });
    assert.equal(requestCount, 0);
  }
});

test("sends one authenticated request and accepts any 2xx response", async () => {
  const calls = [];
  const result = await webhook.deliverLeadWebhook({
    values: validValues,
    requestUrl: "https://go.weareikigai.co/api/consultation",
    referrer: "https://go.weareikigai.co/?c=bydws",
    environment: validEnvironment,
    submittedAt: new Date("2026-09-17T09:05:00.000Z"),
    fetchImplementation: async (...args) => {
      calls.push(args);
      return { status: 202 };
    },
  });

  assert.equal(result.status, "sent");
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], validEnvironment.LEAD_WEBHOOK_URL);
  assert.equal(calls[0][1].headers["x-make-apikey"], "test-token");
  assert.equal(calls[0][1].headers.Authorization, undefined);
  assert.equal(calls[0][1].headers["x-api-key"], undefined);
  assert.equal(JSON.parse(calls[0][1].body).event_id, validValues.eventId);
});

test("rejects webhook non-2xx responses", async () => {
  for (const status of [400, 401, 403, 500]) {
    const result = await webhook.deliverLeadWebhook({
      values: validValues,
      requestUrl: "https://go.weareikigai.co/api/consultation",
      referrer: "https://go.weareikigai.co/?c=bydws",
      environment: validEnvironment,
      fetchImplementation: async () => ({ status }),
    });

    assert.deepEqual(result, {
      status: "failed",
      category: "http-error",
      httpStatus: status,
    });
  }
});

test("reports network failures and bounded timeouts", async () => {
  const networkResult = await webhook.deliverLeadWebhook({
    values: validValues,
    requestUrl: "https://go.weareikigai.co/api/consultation",
    referrer: "https://go.weareikigai.co/?c=bydws",
    environment: validEnvironment,
    fetchImplementation: async () => {
      throw new Error("network unavailable");
    },
  });
  assert.equal(networkResult.category, "network-error");

  const timeoutResult = await webhook.deliverLeadWebhook({
    values: validValues,
    requestUrl: "https://go.weareikigai.co/api/consultation",
    referrer: "https://go.weareikigai.co/?c=bydws",
    environment: validEnvironment,
    timeoutMs: 5,
    fetchImplementation: (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      }),
  });
  assert.equal(timeoutResult.category, "timeout");
});

test("route keeps honeypot and rate limit ahead of external delivery", async () => {
  const routeSource = await readFile(
    new URL("../app/api/consultation/route.js", import.meta.url),
    "utf8",
  );
  const honeypotIndex = routeSource.indexOf("payload.website.trim()");
  const rateLimitIndex = routeSource.indexOf("isRateLimited(getClientIp(request))");
  const webhookIndex = routeSource.indexOf("await deliverLeadWebhook");
  const afterIndex = routeSource.indexOf("after(async () =>");
  const acceptedIndex = routeSource.indexOf("accepted: true");

  assert.ok(honeypotIndex >= 0 && honeypotIndex < webhookIndex);
  assert.ok(rateLimitIndex >= 0 && rateLimitIndex < webhookIndex);
  assert.ok(webhookIndex < afterIndex && afterIndex < acceptedIndex);
  assert.equal(
    routeSource.slice(honeypotIndex, rateLimitIndex).includes("accepted: true"),
    false,
  );
  assert.match(routeSource, /Promise\.allSettled\(\[/);
});

test("client fires one lead event only for an accepted response", async () => {
  const clientSource = await readFile(
    new URL("../components/home/Consultation.jsx", import.meta.url),
    "utf8",
  );

  assert.equal((clientSource.match(/event: "generate_lead"/g) || []).length, 1);
  assert.match(
    clientSource,
    /if \(responseBody\.accepted === true\) \{\s*pushDataLayer\(/,
  );
});
