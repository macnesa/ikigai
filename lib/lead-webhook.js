import "server-only";

const DEFAULT_CAMPAIGN = "bydws";
const CAMPAIGN_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const INTERNATIONAL_PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;
const MAX_PAGE_URL_LENGTH = 2_048;
const MAX_TOKEN_LENGTH = 4_096;
const WEBHOOK_TIMEOUT_MS = 7_000;

const INTEREST_VALUES = new Map([
  ["sauna", "sauna"],
  ["ice-bath", "ice_bath"],
  ["combined", "sauna_ice_bath"],
  ["complete-space", "complete_space"],
  ["unsure", "not_sure"],
]);

const TIMELINE_VALUES = new Map([
  ["ASAP / 0-1 month", "asap_0_1_month"],
  ["1-3 months", "1_3_months"],
  ["3-6 months", "3_6_months"],
  ["Just exploring", "just_exploring"],
]);

const REQUEST_VALUES = new Map([
  ["Catalogue", "catalogue"],
  ["Price / Quotation", "quotation"],
  ["Consultation", "consultation"],
  ["Site Assessment", "site_assessment"],
]);

function getSafeWebhookUrl(value) {
  if (typeof value !== "string") {
    return "";
  }

  const rawUrl = value.trim();

  if (!rawUrl || rawUrl.length > MAX_PAGE_URL_LENGTH) {
    return "";
  }

  try {
    const url = new URL(rawUrl);

    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password
    ) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

export function getLeadWebhookConfiguration(environment = process.env) {
  const url = getSafeWebhookUrl(environment.LEAD_WEBHOOK_URL);
  const token = environment.LEAD_WEBHOOK_TOKEN?.trim() || "";

  if (
    !url ||
    !token ||
    token.length > MAX_TOKEN_LENGTH ||
    /[\r\n]/.test(token)
  ) {
    return null;
  }

  return { url, token };
}

export function normalizeInternationalPhone(value) {
  if (typeof value !== "string") {
    return "";
  }

  const phone = value.trim();

  if (!/^\+[\d().\-\s]+$/.test(phone)) {
    return "";
  }

  const normalized = `+${phone.slice(1).replace(/[^\d]/g, "")}`;

  return INTERNATIONAL_PHONE_PATTERN.test(normalized) ? normalized : "";
}

function getSafePageUrl(value) {
  if (typeof value !== "string" || value.length > MAX_PAGE_URL_LENGTH) {
    return null;
  }

  try {
    const url = new URL(value);

    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password
    ) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function getPublicRequestOrigin({ requestUrl, requestHost, requestProtocol }) {
  const request = getSafePageUrl(requestUrl);
  const host =
    typeof requestHost === "string"
      ? requestHost.split(",")[0].trim()
      : "";
  const protocol =
    typeof requestProtocol === "string"
      ? requestProtocol.split(",")[0].trim().replace(/:$/, "")
      : "";

  if (
    host &&
    host.length <= 255 &&
    !/[\s/@]/.test(host) &&
    (protocol === "http" || protocol === "https")
  ) {
    const publicUrl = getSafePageUrl(`${protocol}://${host}`);

    if (publicUrl) {
      return publicUrl;
    }
  }

  return request;
}

export function getLeadAttribution({
  requestUrl,
  referrer,
  requestHost,
  requestProtocol,
}) {
  const request = getPublicRequestOrigin({
    requestUrl,
    requestHost,
    requestProtocol,
  });
  const referringPage = getSafePageUrl(referrer);
  const sameOriginReferrer =
    request && referringPage && request.origin === referringPage.origin
      ? referringPage
      : null;
  const page = sameOriginReferrer || (request ? new URL("/", request) : null);
  const campaignCandidate = page?.searchParams.get("c")?.trim() || "";

  return {
    campaign: CAMPAIGN_PATTERN.test(campaignCandidate)
      ? campaignCandidate
      : DEFAULT_CAMPAIGN,
    pageUrl: page?.href || "",
  };
}

export function formatMakassarTimestamp(date = new Date()) {
  const instant = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(instant.getTime())) {
    return "";
  }

  const makassarTime = new Date(instant.getTime() + 8 * 60 * 60 * 1_000);
  return makassarTime.toISOString().replace("Z", "+08:00");
}

export function buildLeadWebhookPayload({ values, attribution, submittedAt }) {
  const phone = normalizeInternationalPhone(values?.whatsapp);
  const interest = INTEREST_VALUES.get(values?.interest);
  const timeline = TIMELINE_VALUES.get(values?.timeline);
  const request = REQUEST_VALUES.get(values?.requestType);
  const timestamp = formatMakassarTimestamp(submittedAt);

  if (
    !values ||
    !phone ||
    !interest ||
    !timeline ||
    !request ||
    values.termsAccepted !== true ||
    typeof values.marketingConsent !== "boolean" ||
    typeof values.name !== "string" ||
    typeof values.propertyType !== "string" ||
    typeof values.location !== "string" ||
    typeof values.eventId !== "string" ||
    !attribution?.pageUrl ||
    !timestamp
  ) {
    return null;
  }

  return {
    campaign: attribution.campaign,
    full_name: values.name,
    phone,
    property_type: values.propertyType,
    location: values.location,
    interest,
    timeline,
    request,
    terms_accepted: values.termsAccepted,
    marketing_consent: values.marketingConsent,
    event_id: values.eventId,
    page_url: attribution.pageUrl,
    submitted_at: timestamp,
  };
}

export async function deliverLeadWebhook({
  values,
  requestUrl,
  referrer,
  requestHost,
  requestProtocol,
  environment = process.env,
  fetchImplementation = fetch,
  submittedAt = new Date(),
  timeoutMs = WEBHOOK_TIMEOUT_MS,
}) {
  const configuration = getLeadWebhookConfiguration(environment);

  if (!configuration) {
    return { status: "failed", category: "configuration" };
  }

  const attribution = getLeadAttribution({
    requestUrl,
    referrer,
    requestHost,
    requestProtocol,
  });
  const payload = buildLeadWebhookPayload({
    values,
    attribution,
    submittedAt,
  });

  if (!payload) {
    return { status: "failed", category: "invalid-payload" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImplementation(configuration.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-make-apikey": configuration.token,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response || response.status < 200 || response.status >= 300) {
      return {
        status: "failed",
        category: "http-error",
        httpStatus: Number.isInteger(response?.status)
          ? response.status
          : undefined,
      };
    }

    return {
      status: "sent",
      pageUrl: payload.page_url,
    };
  } catch (error) {
    return {
      status: "failed",
      category: error?.name === "AbortError" ? "timeout" : "network-error",
    };
  } finally {
    clearTimeout(timeout);
  }
}
