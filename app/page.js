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
import TrustedBy from "@/components/home/TrustedBy";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function Home() {
  return (
    <main id="main-content">
      <HomeMotion />
      <SiteHeader />
      <Hero />
      <TrustedBy />
      <ProductShowcase />
      <SaunaQuality />
      <IceBathQuality />
      <Process />
      <ProjectsShowcase />
      <Consultation />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
