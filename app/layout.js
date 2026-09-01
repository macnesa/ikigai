import localFont from "next/font/local";
import {
  getIndexingMetadata,
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SOCIAL_IMAGE,
} from "./seo-config";
import "./globals.css";

const zenMaru = localFont({
  src: [
    {
      path: "../assets/fonts/ZenMaruGothic-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/ZenMaruGothic-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/ZenMaruGothic-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-zen-maru",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata = {
  ...(siteUrl
    ? {
        metadataBase: new URL(siteUrl),
        alternates: {
          canonical: siteUrl,
        },
      }
    : {}),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: getIndexingMetadata(siteUrl),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    ...(siteUrl ? { url: siteUrl } : {}),
    siteName: SITE_NAME,
    type: "website",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE.url],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${zenMaru.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
