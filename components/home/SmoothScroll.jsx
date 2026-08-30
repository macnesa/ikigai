"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./HomeMotion";

const DESKTOP_POINTER_MEDIA =
  "(min-width: 1024px) and (pointer: fine)";
const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)";

export default function SmoothScroll() {
  useEffect(() => {
    const desktopPointer = window.matchMedia(DESKTOP_POINTER_MEDIA);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_MEDIA);
    const connection = navigator.connection;

    let destroyLenis = null;

    const initializeLenis = () => {
      const lenis = new Lenis({
        autoRaf: false,
        anchors: true,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
      });

      const unsubscribeScroll = lenis.on(
        "scroll",
        ScrollTrigger.update,
      );
      const update = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(update);

      return () => {
        gsap.ticker.remove(update);
        unsubscribeScroll();
        lenis.destroy();
      };
    };

    const updateMode = () => {
      const shouldRun =
        desktopPointer.matches &&
        !reducedMotion.matches &&
        connection?.saveData !== true;

      if (shouldRun && !destroyLenis) {
        destroyLenis = initializeLenis();
      } else if (!shouldRun && destroyLenis) {
        destroyLenis();
        destroyLenis = null;
      }
    };

    desktopPointer.addEventListener("change", updateMode);
    reducedMotion.addEventListener("change", updateMode);
    connection?.addEventListener?.("change", updateMode);

    updateMode();

    return () => {
      desktopPointer.removeEventListener("change", updateMode);
      reducedMotion.removeEventListener("change", updateMode);
      connection?.removeEventListener?.("change", updateMode);

      destroyLenis?.();
    };
  }, []);

  return null;
}
