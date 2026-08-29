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
      const overlay = section.querySelector(".final-cta__overlay");
      const heading = section.querySelector(".final-cta__heading");
      const cta = section.querySelector(".final-cta__cta");

      if (!media || !overlay || !heading || !cta) return;

      const mediaQueries = gsap.matchMedia();

      const addMotion = (query, values) => {
        mediaQueries.add(query, () => {
          const depthTimeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: values.scrub,
              invalidateOnRefresh: true,
            },
          });

          depthTimeline
            .fromTo(
              media,
              {
                yPercent: values.mediaFrom,
              },
              {
                yPercent: values.mediaTo,
                duration: 1,
              },
              0,
            )
            .fromTo(
              overlay,
              {
                opacity: 0.58,
              },
              {
                opacity: 0.48,
                duration: 0.34,
              },
              0,
            );

          const entranceTimeline = gsap.timeline({
            defaults: { ease: "power2.out" },
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
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.92,
              },
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
                duration: 0.64,
              },
              0.4,
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
        headingY: 24,
        ctaY: 10,
        entranceStart: "top 76%",
      });

      addMotion(MOTION_MEDIA.tablet, {
        mediaFrom: 2.35,
        mediaTo: -2.35,
        scrub: 1.45,
        headingY: 20,
        ctaY: 9,
        entranceStart: "top 79%",
      });

      addMotion(MOTION_MEDIA.mobile, {
        mediaFrom: 1.5,
        mediaTo: -1.5,
        scrub: 1.25,
        headingY: 15,
        ctaY: 8,
        entranceStart: "top 83%",
      });

      return () => mediaQueries.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="final-cta relative isolate min-h-[22rem] overflow-hidden bg-[var(--placeholder-dark)] text-white md:min-h-[clamp(36rem,40vw,49rem)]"
      aria-labelledby="final-cta-title"
    >
      <div
        className="final-cta__media absolute inset-x-0 -inset-y-[9%] -z-[3] overflow-hidden bg-[var(--placeholder-dark)]"
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
              FINAL_CTA_IMAGE_WIDTHS[1],
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

      <div
        className="final-cta__overlay pointer-events-none absolute inset-0 -z-[2] opacity-[0.48]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(7, 10, 14, 0.48) 0%,
              rgba(7, 10, 14, 0.34) 34%,
              rgba(7, 10, 14, 0.15) 64%,
              rgba(7, 10, 14, 0.08) 100%
            ),
            linear-gradient(
              180deg,
              rgba(7, 10, 14, 0.08) 0%,
              rgba(7, 10, 14, 0.08) 50%,
              rgba(7, 10, 14, 0.34) 100%
            )
          `,
        }}
      />

      <div className="site-container final-cta__inner mx-auto flex min-h-[inherit] w-full max-w-[105rem] flex-col justify-end gap-[1.5rem] px-[var(--page-gutter)] pt-8 pb-8 md:flex-row md:items-end md:justify-between md:gap-[clamp(3rem,7vw,8rem)] md:pt-[5rem] md:pb-[clamp(7.5rem,8vw,10rem)]">
        <h2
          id="final-cta-title"
          className="final-cta__heading m-0 max-w-[12ch] font-display text-[clamp(2.35rem,10vw,3.1rem)] font-medium leading-[0.98] tracking-[-0.045em] md:max-w-[12.5ch] md:text-[clamp(4rem,5.3vw,6.5rem)]"
        >
          Build a Wellness Space You’ll Be Proud to Own
        </h2>

        <a
          href="#consultation"
          className="final-cta__cta inline-flex min-h-[3.5rem] w-auto self-start shrink-0 items-center justify-center rounded-[0.85rem] border border-black bg-black px-[1.75rem] py-[0.95rem] text-center font-display text-[0.78rem] font-medium leading-none tracking-[0.025em] text-white transition-[background-color,color,border-color] duration-[180ms] hover:border-white hover:bg-white hover:text-black md:min-h-[3.6rem] md:self-auto md:text-[0.82rem]"
        >
          Book my free consultation
        </a>
      </div>
    </section>
  );
}