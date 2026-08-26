import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

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

export const metadata = {
  title: "IKIGAI Wellness",
  description:
    "Premium saunas, ice baths, and complete wellness spaces across Indonesia.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${zenMaru.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
