import "server-only";

import { createHash } from "node:crypto";

export const META_GRAPH_API_VERSION = "v26.0";

const EVENT_ID_PATTERN = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|evt_[a-z0-9]{8,20}_[a-z0-9]{12,40})$/i;
const DATASET_ID_PATTERN = /^\d{5,32}$/;
const META_COOKIE_PATTERN = /^fb\.\d+\.\d+\.[A-Za-z0-9._~-]{1,200}$/;
const TEST_EVENT_CODE_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;
const META_REQUEST_TIMEOUT_MS = 5_000;

export function isValidMetaEventId(value) {
  return typeof value === "string" && EVENT_ID_PATTERN.test(value.trim());
}

export function normalizePhoneForMeta(value) {
  if (typeof value !== "string") {
    return "";
  }

  const phone = value.trim();

  if (!/^\+[\d().\-\s]+$/.test(phone)) {
    return "";
  }

  const digits = phone.replace(/\D/g, "");

  return digits.length >= 8 && digits.length <= 15 ? digits : "";
}

export function hashMetaValue(value) {
  return createHash("sha256").update(value).digest("hex");
}

function getBoundedSignal(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  const signal = value.trim();

  if (!signal || signal.length > maxLength || /[\r\n]/.test(signal)) {
    return "";
  }

  return signal;
}

function getMetaCookie(value) {
  const cookie = getBoundedSignal(value, 255);

  return META_COOKIE_PATTERN.test(cookie) ? cookie : "";
}

function getEventSourceUrl(value) {
  const sourceUrl = getBoundedSignal(value, 2_048);

  if (!sourceUrl) {
    return "";
  }

  try {
    const url = new URL(sourceUrl);

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

function getMetaConfiguration() {
  const datasetId = process.env.META_DATASET_ID?.trim() || "";
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim() || "";
  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim() || "";

  if (!datasetId || !accessToken) {
    return null;
  }

  if (
    !DATASET_ID_PATTERN.test(datasetId) ||
    accessToken.length > 4_096 ||
    (testEventCode && !TEST_EVENT_CODE_PATTERN.test(testEventCode))
  ) {
    return null;
  }

  return {
    accessToken,
    datasetId,
    testEventCode,
  };
}

export function buildMetaLeadPayload({
  eventId,
  phone,
  sourceUrl,
  clientIpAddress,
  clientUserAgent,
  fbp,
  fbc,
  eventTime = Math.floor(Date.now() / 1_000),
}) {
  if (!isValidMetaEventId(eventId)) {
    return null;
  }

  const userData = {};
  const normalizedPhone = normalizePhoneForMeta(phone);
  const safeIpAddress = getBoundedSignal(clientIpAddress, 128);
  const safeUserAgent = getBoundedSignal(clientUserAgent, 1_024);
  const safeFbp = getMetaCookie(fbp);
  const safeFbc = getMetaCookie(fbc);
  const safeSourceUrl = getEventSourceUrl(sourceUrl);

  if (normalizedPhone) {
    userData.ph = [hashMetaValue(normalizedPhone)];
  }

  if (safeIpAddress) {
    userData.client_ip_address = safeIpAddress;
  }

  if (safeUserAgent) {
    userData.client_user_agent = safeUserAgent;
  }

  if (safeFbp) {
    userData.fbp = safeFbp;
  }

  if (safeFbc) {
    userData.fbc = safeFbc;
  }

  return {
    data: [
      {
        event_name: "Lead",
        event_time: eventTime,
        event_id: eventId.trim(),
        action_source: "website",
        ...(safeSourceUrl ? { event_source_url: safeSourceUrl } : {}),
        user_data: userData,
        custom_data: {
          form_name: "invest_in_it_enquiry",
          lead_type: "b2b_hospitality",
        },
      },
    ],
  };
}

export async function sendMetaLeadEvent(event) {
  const configuration = getMetaConfiguration();

  if (!configuration) {
    return { status: "skipped" };
  }

  const payload = buildMetaLeadPayload(event);

  if (!payload) {
    console.error("Meta CAPI Lead delivery skipped.", {
      eventId: typeof event?.eventId === "string" ? event.eventId.slice(0, 100) : "invalid",
      category: "invalid-event",
    });
    return { status: "failed" };
  }

  if (configuration.testEventCode) {
    payload.test_event_code = configuration.testEventCode;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), META_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${configuration.datasetId}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${configuration.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      console.error("Meta CAPI Lead delivery failed.", {
        eventId: event.eventId,
        status: response.status,
        category: "http-error",
      });
      return { status: "failed" };
    }

    return { status: "sent" };
  } catch (error) {
    console.error("Meta CAPI Lead delivery failed.", {
      eventId: event.eventId,
      category: error?.name === "AbortError" ? "timeout" : "network-error",
    });
    return { status: "failed" };
  } finally {
    clearTimeout(timeout);
  }
}
