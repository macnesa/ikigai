import "server-only";

// Route wiring, payload mapping, and token transport await Brahma's final schema.
export function getLeadWebhookConfiguration() {
  const url = process.env.LEAD_WEBHOOK_URL?.trim();
  const token = process.env.LEAD_WEBHOOK_TOKEN?.trim();

  return url && token ? { url, token } : null;
}
