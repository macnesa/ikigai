"use client";

import { useRef } from "react";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";

const FINAL_CTA_IMAGE_WIDTHS = [640, 960, 1280, 1600, 1920];
const FINAL_CTA_IMAGE_QUALITY = 80;

const FINAL_CTA_DESKTOP_IMAGE =
  "https://ik.imagekit.io/ikigaiwellness/ikigai/home/b3f34f90ef3e371670eab38bea9970cfb08e2992.jpg";

const FINAL_CTA_MOBILE_IMAGE =
  "https://ik.imagekit.io/ikigaiwellness/ikigai/home/19fe447fdd327441430bc112d99ff4dbadc762aa.jpg";

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}tr=w-${width},q-${FINAL_CTA_IMAGE_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return FINAL_CTA_IMAGE_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

export default function FinalCTA() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (
        !section ||
        navigator.connection?.saveData === true ||
        shouldLimitMotion()
      ) {
        return;
      }

      const media = section.querySelector(".final-cta__media");
      const heading = section.querySelector(".final-cta__heading");
      const cta = section.querySelector(".final-cta__cta");

      if (!media || !heading || !cta) return;

      const mediaQueries = gsap.matchMedia();

      const addMotion = (query, values) => {
        mediaQueries.add(query, () => {
          const activeOverlay = section.querySelector(
            values.overlaySelector,
          );

          const depthTimeline = gsap.timeline({
            defaults: {
              ease: "none",
            },
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: values.scrub,
              invalidateOnRefresh: true,
            },
          });

          depthTimeline.fromTo(
            media,
            {
              yPercent: values.mediaFrom,
            },
            {
              yPercent: values.mediaTo,
              duration: 1,
            },
            0,
          );

          if (activeOverlay) {
            depthTimeline.fromTo(
              activeOverlay,
              {
                opacity: values.overlayFrom,
              },
              {
                opacity: values.overlayTo,
                duration: 0.45,
              },
              0,
            );
          }

          const entranceTimeline = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
            scrollTrigger: {
              trigger: section,
              start: values.entranceStart,
              once: true,
            },
          });

          entranceTimeline
            .fromTo(
              heading,
              {
                autoAlpha: 0,
                y: values.headingY,
                clipPath: "inset(0 0 100% 0)",
              },
              {
                autoAlpha: 1,
                y: 0,
                clipPath: "inset(0 0 0% 0)",
                duration: values.headingDuration,
              },
              0,
            )
            .fromTo(
              cta,
              {
                autoAlpha: 0,
                y: values.ctaY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: values.ctaDuration,
                ease: "power2.out",
              },
              values.ctaDelay,
            );

          return () => {
            depthTimeline.kill();
            entranceTimeline.kill();
          };
        });
      };

      addMotion(MOTION_MEDIA.desktop, {
        mediaFrom: 3,
        mediaTo: -3,
        scrub: 1.65,
        headingY: 30,
        headingDuration: 0.9,
        ctaY: 12,
        ctaDuration: 0.58,
        ctaDelay: 0.34,
        entranceStart: "top 76%",
        overlaySelector: ".final-cta__overlay-desktop",
        overlayFrom: 1,
        overlayTo: 0.92,
      });

      addMotion(MOTION_MEDIA.tablet, {
        mediaFrom: 2.35,
        mediaTo: -2.35,
        scrub: 1.45,
        headingY: 24,
        headingDuration: 0.82,
        ctaY: 10,
        ctaDuration: 0.54,
        ctaDelay: 0.32,
        entranceStart: "top 79%",
        overlaySelector: ".final-cta__overlay-desktop",
        overlayFrom: 1,
        overlayTo: 0.93,
      });

      addMotion(MOTION_MEDIA.mobile, {
        mediaFrom: 1.5,
        mediaTo: -1.5,
        scrub: 1.2,
        headingY: 20,
        headingDuration: 0.76,
        ctaY: 9,
        ctaDuration: 0.5,
        ctaDelay: 0.3,
        entranceStart: "top 83%",
        overlaySelector: ".final-cta__overlay-mobile",
        overlayFrom: 1,
        overlayTo: 0.94,
      });

      return () => mediaQueries.revert();
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      className="final-cta relative isolate min-h-[clamp(34rem,78svh,43rem)] overflow-hidden bg-[var(--placeholder-dark)] text-white md:min-h-[clamp(38rem,48vw,54rem)]"
      aria-labelledby="final-cta-title"
    >
      {/* IMAGE */}
      <div
        className="final-cta__media absolute inset-x-0 -inset-y-[8%] -z-[3] overflow-hidden bg-[var(--placeholder-dark)] will-change-transform"
        aria-hidden="true"
      >
        <picture className="block h-full w-full">
          <source
            media="(max-width: 47.99rem)"
            srcSet={getImageKitSrcSet(FINAL_CTA_MOBILE_IMAGE)}
            sizes="100vw"
          />

          <img
            className="final-cta__image block h-full w-full object-cover object-center"
            src={getImageKitUrl(
              FINAL_CTA_DESKTOP_IMAGE,
              FINAL_CTA_IMAGE_WIDTHS[2],
            )}
            srcSet={getImageKitSrcSet(FINAL_CTA_DESKTOP_IMAGE)}
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </picture>
      </div>

      {/* MOBILE READABILITY */}
      <div
        className="final-cta__overlay-mobile pointer-events-none absolute inset-0 -z-[2] md:hidden"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(
              180deg,
              rgba(7, 10, 14, 0.06) 0%,
              rgba(7, 10, 14, 0.05) 25%,
              rgba(7, 10, 14, 0.12) 46%,
              rgba(7, 10, 14, 0.34) 66%,
              rgba(7, 10, 14, 0.68) 86%,
              rgba(7, 10, 14, 0.82) 100%
            )
          `,
        }}
      />

      {/* DESKTOP READABILITY */}
      <div
        className="final-cta__overlay-desktop pointer-events-none absolute inset-0 -z-[2] hidden md:block"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(7, 10, 14, 0.46) 0%,
              rgba(7, 10, 14, 0.28) 30%,
              rgba(7, 10, 14, 0.10) 59%,
              rgba(7, 10, 14, 0.03) 100%
            ),
            linear-gradient(
              180deg,
              rgba(7, 10, 14, 0.03) 0%,
              rgba(7, 10, 14, 0.03) 45%,
              rgba(7, 10, 14, 0.18) 67%,
              rgba(7, 10, 14, 0.6) 100%
            )
          `,
        }}
      />

      {/* CONTENT */}
      <div className="site-container final-cta__inner mx-auto flex min-h-[inherit] w-full max-w-[105rem] items-end px-[var(--page-gutter)] pt-[5rem] pb-[clamp(3.75rem,9vw,5.25rem)] md:pb-[clamp(5.75rem,7vw,8rem)]">
        <div className="flex w-full max-w-[42rem] flex-col items-start">
          <h2
            id="final-cta-title"
            className="final-cta__heading gsap-text-clip max-w-[10.5ch] font-display text-[clamp(2.65rem,11.5vw,3.55rem)] font-medium leading-[0.96] tracking-[-0.047em] md:max-w-[10.5ch] md:text-[clamp(3.9rem,5vw,6.2rem)] md:leading-[0.94] md:tracking-[-0.05em]"
          >
            Build a Wellness Space You’ll Be Proud to Own
          </h2>

          <a
            href="#consultation"
            className="final-cta__cta mt-[1.75rem] inline-flex min-h-[3.35rem] w-auto items-center justify-center rounded-[var(--pill)] border border-white bg-white px-[1.55rem] py-[0.9rem] text-center font-display text-[0.74rem] font-medium leading-none tracking-[0.035em] text-[var(--ink)] transition-[background-color,color,border-color] duration-[180ms] hover:border-black hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:mt-[2rem] md:min-h-[3.5rem] md:px-[1.75rem] md:text-[0.78rem]"
          >
            Book my free consultation
          </a>
        </div>
      </div>
    </section>
  );
}
