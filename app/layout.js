import localFont from "next/font/local";
import Script from "next/script";
import ContactClickTracking from "@/components/tracking/ContactClickTracking";
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
const configuredGtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "";
const gtmId = /^GTM-[A-Z0-9]{4,20}$/.test(configuredGtmId)
  ? configuredGtmId
  : "";

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
      <head>
        {gtmId ? (
          <Script id="google-tag-manager" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        ) : null}
      </head>

      <body>
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              title="Google Tag Manager"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}

        <ContactClickTracking />
        {children}
      </body>
    </html>
  );
}
