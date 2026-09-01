export const SITE_NAME = "IKIGAI Wellness";
export const SITE_TITLE =
  "IKIGAI Wellness | Saunas & Ice Baths in Indonesia";
export const SITE_DESCRIPTION =
  "Premium saunas, ice baths, and complete wellness spaces designed, built, installed, and maintained for homes, villas, and hotels across Indonesia.";

export const SOCIAL_IMAGE = {
  url: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/0566_ad48168e4a93f9aaf727711ea2ff3d488019b1cc.png",
  width: 1672,
  height: 941,
  type: "image/jpeg",
  alt: "IKIGAI Wellness sauna and ice bath installation",
};

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return null;
  }

  try {
    const url = new URL(configuredUrl);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    url.pathname = "/";
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function isIndexableProduction(siteUrl = getSiteUrl()) {
  if (!siteUrl) {
    return false;
  }

  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV === "production";
  }

  return process.env.NODE_ENV === "production";
}

export function getIndexingMetadata(siteUrl = getSiteUrl()) {
  const indexable = isIndexableProduction(siteUrl);

  return {
    index: indexable,
    follow: indexable,
    googleBot: {
      index: indexable,
      follow: indexable,
    },
  };
}
