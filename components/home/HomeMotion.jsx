"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };

export const MOTION_MEDIA = {
  desktop:
    "(prefers-reduced-motion: no-preference) and (min-width: 1024px)",
  tablet:
    "(prefers-reduced-motion: no-preference) and (min-width: 768px) and (max-width: 1023px)",
  mobile:
    "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
};

export function shouldLimitMotion() {
  if (typeof window === "undefined") return true;

  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    navigator.connection?.saveData === true
  );
}

export default function HomeMotion() {
  return null;
}
