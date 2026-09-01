import { getSiteUrl } from "./seo-config";

export default function sitemap() {
  const siteUrl = getSiteUrl();

  if (!siteUrl) {
    return [];
  }

  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
