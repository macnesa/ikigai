import Consultation from "@/components/home/Consultation";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import Hero from "@/components/home/Hero";
import HomeMotion from "@/components/home/HomeMotion";
import IceBathQuality from "@/components/home/IceBathQuality";
import Process from "@/components/home/Process";
import ProductShowcase from "@/components/home/ProductShowcase";
import ProjectsShowcase from "@/components/home/ProjectsShowcase";
import SaunaQuality from "@/components/home/SaunaQuality";
import SmoothScroll from "@/components/home/SmoothScroll";
import TrustedBy from "@/components/home/TrustedBy";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { cloudinaryAssetUrl } from "@/lib/cloudinary";
import { getHomePageContent } from "@/lib/sanity";
import { getSiteUrl } from "./seo-config";

export async function generateMetadata() {
  const { landingPage, siteSettings } = await getHomePageContent();
  const seo = landingPage.seo || {};
  const socialImage = seo.socialImage || siteSettings.defaultSocialImage;
  const socialImageUrl = cloudinaryAssetUrl(socialImage);
  const socialImageAlt = seo.socialImageAlt || siteSettings.defaultSocialImageAlt;
  const title = seo.title || siteSettings.defaultSeoTitle;
  const description = seo.description || siteSettings.defaultSeoDescription;
  const siteUrl = getSiteUrl();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(siteUrl ? { url: siteUrl } : {}),
      siteName: siteSettings.siteName,
      type: "website",
      ...(socialImageUrl
        ? {
            images: [
              {
                url: socialImageUrl,
                width: socialImage?.width,
                height: socialImage?.height,
                alt: socialImageAlt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(socialImageUrl ? { images: [socialImageUrl] } : {}),
    },
  };
}

export default async function Home() {
  const { landingPage, siteSettings } = await getHomePageContent();

  return (
    <main id="main-content">
      <HomeMotion />
      <SmoothScroll />
      <SiteHeader content={siteSettings} />
      <Hero content={landingPage.hero} />
      <TrustedBy content={landingPage.trustedClients} />
      <ProductShowcase content={landingPage.productShowcase} />
      <SaunaQuality content={landingPage.saunaQuality} />
      <IceBathQuality content={landingPage.iceBathQuality} />
      <Process content={landingPage.process} />
      <ProjectsShowcase content={landingPage.projects} />
      <Consultation content={landingPage.consultation} />
      <FAQ content={landingPage.faq} />
      <FinalCTA content={landingPage.finalCta} />
      <SiteFooter content={siteSettings} />
    </main>
  );
}
