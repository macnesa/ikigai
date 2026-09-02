"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef } from "react";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";

const PROCESS_IMAGE_WIDTHS = [480, 640, 960, 1280, 1600];
const PROCESS_IMAGE_QUALITY = 80;

/*
 * The supplied process photography is naturally very wide.
 * Reference asset: 1600 × 846 ≈ 1.891:1.
 *
 * Desktop deliberately preserves that composition instead of
 * forcing the photographs into 5:4 / 4:3 crops.
 */
const PROCESS_DESKTOP_ASPECT = "1600 / 846";

const processSteps = [
  {
    label: "Assess",
    title: "Understand your space",
    body: "Available space, intended usage, electrical supply, drainage and project requirements.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-51-55.png",
    objectPosition: "center center",
  },
  {
    label: "Recommend & design",
    title: "Determine the right solution",
    body: "Existing design or custom — then adapted around your space, aesthetic and usage.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-52-13.png",
    objectPosition: "center center",
  },
  {
    label: "Engineer",
    title: "Verify the technical details",
    body: "Heater sizing, ventilation, chilling, circulation and filtration reviewed before production.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-52-30.png",
    objectPosition: "center center",
  },
  {
    label: "Build",
    title: "Build for your project",
    body: "Our own team handles production and the technical requirements.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-52-43.png",
    objectPosition: "center center",
  },
  {
    label: "Install",
    title: "Handled by our team",
    body: "We coordinate delivery, installation and commissioning of your wellness equipment.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-52-54.png",
    objectPosition: "center center",
  },
  {
    label: "Maintain",
    title: "We’re still here after installation",
    body: "Include a weekly maintenance for both commercial & residential to make sure it lasts for years to come.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-53-05.png",
    objectPosition: "center center",
  },
];

const processPairs = [
  [processSteps[0], processSteps[1]],
  [processSteps[2], processSteps[3]],
  [processSteps[4], processSteps[5]],
];

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}tr=w-${width},q-${PROCESS_IMAGE_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return PROCESS_IMAGE_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

function DesktopProcessCopy({ step, index, side }) {
  return (
    <article
      className={[
        "process-chapter__copy min-w-0",
        side === "left"
          ? "process-chapter__copy--left"
          : "process-chapter__copy--right",
      ].join(" ")}
    >
      {/* NUMBER + LABEL */}
      <div className="flex items-baseline gap-[0.72rem]">
        <span className="shrink-0 font-display text-[0.9rem] font-medium leading-none tracking-[-0.025em] text-white/[0.62]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <p className="m-0 font-display text-[length:var(--type-small-label)] font-semibold leading-[1.2] tracking-[0.15em] text-white/[0.52] uppercase">
          {step.label}
        </p>
      </div>

      {/* TITLE */}
      <h3 className="mt-[0.78rem] mb-0 max-w-[18rem] font-display text-[length:var(--type-process-title)] font-medium leading-[1.2] tracking-[-0.028em] text-white">
        {step.title}
      </h3>

      {/* BODY */}
      <p className="mt-[0.62rem] mb-0 max-w-[18.75rem] text-[length:var(--type-reading-technical)] leading-[1.62] text-white/[0.6]">
        {step.body}
      </p>
    </article>
  );
}

function DesktopProcessImage({ step, side }) {
  return (
    <div
      className={[
        "process-chapter__media min-w-0 overflow-hidden bg-[#414957]",
        side === "left"
          ? "process-chapter__media--left"
          : "process-chapter__media--right",
      ].join(" ")}
      style={{
        aspectRatio: PROCESS_DESKTOP_ASPECT,
      }}
    >
      <img
        className="process-chapter__image block h-full w-full object-cover will-change-transform"
        src={getImageKitUrl(step.image, PROCESS_IMAGE_WIDTHS[2])}
        srcSet={getImageKitSrcSet(step.image)}
        sizes="(min-width: 105rem) 28rem, (min-width: 80rem) 28vw, 100vw"
        alt=""
        loading="lazy"
        decoding="async"
        draggable="false"
        style={{
          objectPosition: step.objectPosition,
        }}
      />
    </div>
  );
}

export default function Process() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (
        !section ||
        shouldLimitMotion() ||
        navigator.connection?.saveData === true
      ) {
        return;
      }

      const header = section.querySelector(".process__header");
      const heading = section.querySelector(".process__heading");
      const intro = section.querySelector(".process__intro");

      if (!header || !heading || !intro) return;

      const mediaQueries = gsap.matchMedia();

      /*
       * Header motion.
       */
      const addHeaderMotion = (query, values) => {
        mediaQueries.add(query, () => {
          const timeline = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
            scrollTrigger: {
              trigger: header,
              start: values.start,
              once: true,
            },
          });

          timeline
            .fromTo(
              heading,
              {
                autoAlpha: 0,
                y: values.headingY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: values.headingDuration,
              },
              0,
            )
            .fromTo(
              intro,
              {
                autoAlpha: 0,
                y: values.introY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: values.introDuration,
              },
              0.16,
            );

          return () => timeline.kill();
        });
      };

      addHeaderMotion(MOTION_MEDIA.desktop, {
        headingY: 22,
        introY: 9,
        headingDuration: 0.7,
        introDuration: 0.5,
        start: "top 80%",
      });

      addHeaderMotion(MOTION_MEDIA.tablet, {
        headingY: 18,
        introY: 8,
        headingDuration: 0.64,
        introDuration: 0.46,
        start: "top 82%",
      });

      addHeaderMotion(MOTION_MEDIA.mobile, {
        headingY: 14,
        introY: 6,
        headingDuration: 0.58,
        introDuration: 0.42,
        start: "top 84%",
      });

      /*
       * LARGE DESKTOP
       * >= 1280px
       *
       * The architecture stays:
       *
       * LEFT STEP + IMAGE
       * then
       * IMAGE + RIGHT STEP
       *
       * Motion quietly reinforces the reading order:
       * 01 → 02
       * 03 → 04
       * 05 → 06
       *
       * No slide-in.
       * No scrub.
       * No active state.
       * No sticky.
       */
      mediaQueries.add("(min-width: 1280px)", () => {
        const chapters = gsap.utils.toArray(
          section.querySelectorAll(".process-chapter"),
        );

        const timelines = chapters.map((chapter) => {
          const leftCopy = chapter.querySelector(
            ".process-chapter__copy--left",
          );

          const leftMedia = chapter.querySelector(
            ".process-chapter__media--left",
          );

          const rightMedia = chapter.querySelector(
            ".process-chapter__media--right",
          );

          const rightCopy = chapter.querySelector(
            ".process-chapter__copy--right",
          );

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: chapter,
              start: "top 80%",
              once: true,
            },
            defaults: {
              ease: "power3.out",
            },
          });

          /*
           * First stage in the pair.
           */
          timeline
            .fromTo(
              leftCopy,
              {
                autoAlpha: 0,
                y: 8,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.48,
              },
              0,
            )
            .fromTo(
              leftMedia,
              {
                autoAlpha: 0,
                scale: 1.012,
              },
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.58,
              },
              0.04,
            );

          /*
           * Second stage follows only slightly later.
           * Enough to reinforce chronology without feeling choreographed.
           */
          timeline
            .fromTo(
              rightMedia,
              {
                autoAlpha: 0,
                scale: 1.012,
              },
              {
                autoAlpha: 1,
                scale: 1,
                duration: 0.58,
              },
              0.12,
            )
            .fromTo(
              rightCopy,
              {
                autoAlpha: 0,
                y: 8,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.48,
              },
              0.17,
            );

          return timeline;
        });

        return () => {
          timelines.forEach((timeline) => timeline.kill());
        };
      });

      /*
       * < 1280px
       *
       * Sequential editorial chapters.
       */
      mediaQueries.add("(max-width: 1279px)", () => {
        const images = gsap.utils.toArray(
          section.querySelectorAll(".process-step__mobile-image"),
        );

        gsap.set(images, {
          scale: 1.025,
          y: 9,
        });

        let tweens = [];
        const frame = requestAnimationFrame(() => {
          tweens = images.map((image) =>
            gsap.fromTo(
              image,
              {
                scale: 1.025,
                y: 9,
              },
              {
                scale: 1,
                y: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: image,
                  start: "top 92%",
                  end: "center 70%",
                  scrub: 0.75,
                  invalidateOnRefresh: true,
                },
              },
            ),
          );
        });

        return () => {
          cancelAnimationFrame(frame);
          tweens.forEach((tween) => tween.kill());
        };
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
      id="process"
      aria-labelledby="process-title"
      className="process dark-section dark-surface dark-surface--cool bg-[var(--night)] py-[4.25rem] text-white md:py-[5.5rem] xl:py-[clamp(6rem,6.5vw,7.5rem)]"
    >
      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)]">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <header className="process__header mb-[3.25rem] md:mb-[3.75rem] xl:mx-auto xl:mb-[clamp(4.25rem,4.75vw,5.25rem)] xl:flex xl:max-w-[53rem] xl:flex-col xl:items-center xl:text-center">
          <h2
            id="process-title"
            className="process__heading m-0 max-w-[15ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em] xl:mx-auto"
          >
            The Ikigai Process
          </h2>

          <p className="process__intro mt-4 mb-0 max-w-[35rem] text-[length:var(--type-section-intro-standard)] leading-[1.65] text-white/[0.64] md:mt-5 md:leading-[1.62] xl:mt-[1.4rem] xl:max-w-[41rem] xl:leading-[1.65]">
            You tell us about your property and what you’re trying to create. We
            manage the process from assessment through installation and ongoing
            support.
          </p>
        </header>

        {/* =====================================================
            MOBILE + TABLET + SMALL DESKTOP
            < 1280px

            Chronological:
            step → copy → image
        ====================================================== */}
        <div className="grid gap-y-[3.75rem] md:gap-y-[4.25rem] xl:hidden">
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              className="process-step min-w-0"
            >
              <div className="process-step__copy">
                <div className="flex items-baseline gap-[0.8rem]">
                  <span className="shrink-0 font-display text-[0.78rem] font-normal leading-none tracking-[-0.01em] text-white/[0.46]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="m-0 font-display text-[length:var(--type-small-label)] font-semibold leading-[1.2] tracking-[0.15em] text-white/[0.5] uppercase">
                    {step.label}
                  </p>
                </div>

                <h3 className="mt-[0.9rem] mb-0 max-w-[22rem] font-display text-[length:var(--type-process-title)] font-medium leading-[1.22] tracking-[-0.025em] text-white md:max-w-[28rem]">
                  {step.title}
                </h3>

                <p className="mt-[0.62rem] mb-0 max-w-[28rem] text-[length:var(--type-reading-technical)] leading-[1.62] text-white/[0.6] md:max-w-[34rem]">
                  {step.body}
                </p>
              </div>

              <div className="mt-[1.4rem] aspect-[5/3] overflow-hidden bg-[#414957] md:mt-[1.55rem]">
                <img
                  className="process-step__mobile-image block h-full w-full object-cover will-change-transform"
                  src={getImageKitUrl(
                    step.image,
                    PROCESS_IMAGE_WIDTHS[1],
                  )}
                  srcSet={getImageKitSrcSet(step.image)}
                  sizes="calc(100vw - 2 * var(--page-gutter))"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  style={{
                    objectPosition: step.objectPosition,
                  }}
                />
              </div>
            </article>
          ))}
        </div>

        {/* =====================================================
            LARGE DESKTOP
            >= 1280px

            REFINED MIRRORED PROCESS CHAPTERS

            Physical reading model:

            01 COPY ↔ IMAGE 01    IMAGE 02 ↔ 02 COPY

            03 COPY ↔ IMAGE 03    IMAGE 04 ↔ 04 COPY

            05 COPY ↔ IMAGE 05    IMAGE 06 ↔ 06 COPY

            The two halves are mirrored.
            Each step remains physically attached to its own evidence.

            No cards.
            No lines.
            No arrows.
            No timeline.
            No sticky.
            No active state.
            No hover state.
            No CTA.
        ====================================================== */}
        <div className="hidden xl:block">
          {processPairs.map((pair, pairIndex) => {
            const leftIndex = pairIndex * 2;
            const rightIndex = leftIndex + 1;

            return (
              <div
                key={`${pair[0].title}-${pair[1].title}`}
                className={[
                  "process-chapter",
                  "grid grid-cols-2 items-center",
                  /*
                   * Center separation is deliberately a little larger
                   * than the internal copy↔image gap.
                   *
                   * This creates two readable pairs:
                   * [01 + image01] [image02 + 02]
                   */
                  "gap-x-[clamp(1.75rem,2.25vw,2.75rem)]",
                  pairIndex > 0
                    ? "mt-[clamp(3.75rem,4.25vw,4.5rem)]"
                    : "",
                ].join(" ")}
              >
                {/* =============================================
                    LEFT PAIR

                    COPY → IMAGE
                ============================================== */}
                <div className="grid min-w-0 grid-cols-[minmax(0,0.68fr)_minmax(0,1.12fr)] items-center gap-x-[clamp(1rem,1.35vw,1.65rem)]">
                  <DesktopProcessCopy
                    step={pair[0]}
                    index={leftIndex}
                    side="left"
                  />

                  <DesktopProcessImage
                    step={pair[0]}
                    side="left"
                  />
                </div>

                {/* =============================================
                    RIGHT PAIR

                    IMAGE → COPY

                    Mirror of left pair.
                ============================================== */}
                <div className="grid min-w-0 grid-cols-[minmax(0,1.12fr)_minmax(0,0.68fr)] items-center gap-x-[clamp(1rem,1.35vw,1.65rem)]">
                  <DesktopProcessImage
                    step={pair[1]}
                    side="right"
                  />

                  <DesktopProcessCopy
                    step={pair[1]}
                    index={rightIndex}
                    side="right"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
