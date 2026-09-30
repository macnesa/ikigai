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
