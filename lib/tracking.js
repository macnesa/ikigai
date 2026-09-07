const MAX_PAYLOAD_DEPTH = 4;
const MAX_PAYLOAD_KEYS = 50;

function isPlainStructuredValue(value, depth = 0) {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (depth >= MAX_PAYLOAD_DEPTH) {
    return false;
  }

  if (Array.isArray(value)) {
    return (
      value.length <= MAX_PAYLOAD_KEYS &&
      value.every((item) => isPlainStructuredValue(item, depth + 1))
    );
  }

  if (typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  if (prototype !== Object.prototype && prototype !== null) {
    return false;
  }

  const entries = Object.entries(value);

  return (
    entries.length <= MAX_PAYLOAD_KEYS &&
    entries.every(([, item]) => isPlainStructuredValue(item, depth + 1))
  );
}

export function createTrackingEventId() {
  if (typeof window === "undefined") {
    return "";
  }

  if (typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  if (typeof window.crypto?.getRandomValues === "function") {
    const values = new Uint32Array(4);
    window.crypto.getRandomValues(values);

    return `evt_${Date.now().toString(36)}_${Array.from(values, (value) =>
      value.toString(36).padStart(7, "0"),
    ).join("")}`;
  }

  return `evt_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2)
    .padEnd(16, "0")}`;
}

export function getContactMethod(rawHref, baseUrl) {
  if (typeof rawHref !== "string") {
    return null;
  }

  const href = rawHref.trim();

  if (href.toLowerCase().startsWith("tel:")) {
    return "phone";
  }

  try {
    const url = new URL(href, baseUrl);

    if (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.toLowerCase() === "wa.me"
    ) {
      return "whatsapp";
    }
  } catch {
    return null;
  }

  return null;
}

export function pushDataLayer(payload) {
  if (
    typeof window === "undefined" ||
    !payload ||
    Array.isArray(payload) ||
    !isPlainStructuredValue(payload)
  ) {
    return false;
  }

  window.dataLayer = Array.isArray(window.dataLayer)
    ? window.dataLayer
    : [];
  window.dataLayer.push(payload);

  return true;
}
