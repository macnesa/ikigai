import { getSiteUrl, isIndexableProduction } from "./seo-config";

export default function robots() {
  const siteUrl = getSiteUrl();
  const indexable = isIndexableProduction(siteUrl);

  return {
    rules: {
      userAgent: "*",
      ...(indexable ? { allow: "/" } : { disallow: "/" }),
    },
    ...(indexable
      ? {
          sitemap: `${siteUrl}/sitemap.xml`,
          host: siteUrl,
        }
      : {}),
  };
}
