"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";

const PROCESS_IMAGE_WIDTHS = [480, 640, 960, 1280, 1600];
const PROCESS_IMAGE_QUALITY = 80;

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

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}tr=w-${width},q-${PROCESS_IMAGE_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return PROCESS_IMAGE_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

export default function Process() {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  /*
   * Desktop/tablet active process tracking.
   *
   * The text remains fully scrollable and readable.
   * Crossing the central reading zone changes only the supporting image
   * and subtle emphasis of the active step.
   */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    let observer = null;

    const destroyObserver = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };

    const setupObserver = () => {
      destroyObserver();

      if (!mediaQuery.matches) {
        setActiveStep(0);
        return;
      }

      const steps = Array.from(
        section.querySelectorAll(".process-step--desktop"),
      );

      if (!steps.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) =>
                Math.abs(
                  a.boundingClientRect.top - window.innerHeight * 0.46,
                ) -
                Math.abs(
                  b.boundingClientRect.top - window.innerHeight * 0.46,
                ),
            );

          if (!intersecting.length) return;

          const index = Number(
            intersecting[0].target.dataset.processIndex,
          );

          if (!Number.isNaN(index)) {
            setActiveStep(index);
          }
        },
        {
          root: null,
          rootMargin: "-38% 0px -42% 0px",
          threshold: 0.01,
        },
      );

      steps.forEach((step) => observer.observe(step));
    };

    setupObserver();

    mediaQuery.addEventListener("change", setupObserver);

    return () => {
      destroyObserver();
      mediaQuery.removeEventListener("change", setupObserver);
    };
  }, []);

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

      const addHeaderEntrance = (query, values) => {
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
              0.18,
            );

          return () => timeline.kill();
        });
      };

      addHeaderEntrance(MOTION_MEDIA.desktop, {
        headingY: 24,
        introY: 10,
        headingDuration: 0.72,
        introDuration: 0.5,
        start: "top 78%",
      });

      addHeaderEntrance(MOTION_MEDIA.tablet, {
        headingY: 19,
        introY: 8,
        headingDuration: 0.66,
        introDuration: 0.46,
        start: "top 80%",
      });

      addHeaderEntrance(MOTION_MEDIA.mobile, {
        headingY: 15,
        introY: 7,
        headingDuration: 0.6,
        introDuration: 0.42,
        start: "top 84%",
      });

      /*
       * Mobile keeps the original subtle photographic movement.
       * Desktop no longer moves every image independently because the
       * sticky active-image transition becomes the primary interaction.
       */
      mediaQueries.add(MOTION_MEDIA.mobile, () => {
        const images = gsap.utils.toArray(
          section.querySelectorAll(".process-step__mobile-image"),
        );

        const tweens = images.map((image) =>
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

        return () => {
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
      className="process dark-section bg-[var(--night)] py-[4.25rem] text-white md:py-[clamp(6.5rem,8vw,9.5rem)]"
    >
      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)]">
        <header className="process__header mb-[3.25rem] grid gap-4 md:mb-[clamp(4rem,5vw,5.75rem)] md:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)] md:items-end md:gap-16">
          <h2
            id="process-title"
            className="process__heading m-0 max-w-[15ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em]"
          >
            The IKIGAI Process
          </h2>

          <p className="process__intro m-0 max-w-[35rem] text-[0.82rem] leading-[1.65] text-white/[0.64] md:justify-self-end md:text-[0.9rem] md:leading-[1.6]">
            You tell us about your property and what you’re trying to create. We
            manage the process from assessment through installation and ongoing
            support.
          </p>
        </header>

        {/* MOBILE */}
        <div className="grid gap-y-[3.75rem] md:hidden">
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

                  <p className="m-0 font-display text-[0.62rem] font-semibold leading-[1.2] tracking-[0.15em] text-white/[0.5] uppercase">
                    {step.label}
                  </p>
                </div>

                <h3 className="mt-[0.9rem] mb-0 max-w-[22rem] font-display text-[1.18rem] font-medium leading-[1.22] tracking-[-0.025em] text-white">
                  {step.title}
                </h3>

                <p className="mt-[0.62rem] mb-0 max-w-[28rem] text-[0.8rem] leading-[1.62] text-white/[0.6]">
                  {step.body}
                </p>
              </div>

              <div className="mt-[1.4rem] aspect-[5/3] overflow-hidden bg-[#414957]">
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

        {/* TABLET / DESKTOP */}
        <div className="hidden md:grid md:grid-cols-[minmax(0,1.03fr)_minmax(24rem,0.97fr)] md:items-start md:gap-x-[clamp(3rem,6vw,8rem)]">
          <div className="sticky top-[clamp(5.5rem,8vw,8rem)] self-start">
            <div className="relative aspect-[5/4] overflow-hidden bg-[#414957]">
              {processSteps.map((step, index) => {
                const isActive = activeStep === index;

                return (
                  <img
                    key={step.image}
                    className={`absolute inset-0 block h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                      isActive
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-[1.012] opacity-0"
                    }`}
                    src={getImageKitUrl(
                      step.image,
                      PROCESS_IMAGE_WIDTHS[2],
                    )}
                    srcSet={getImageKitSrcSet(step.image)}
                    sizes="(min-width: 48rem) 48vw, 100vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    aria-hidden={!isActive}
                    style={{
                      objectPosition: step.objectPosition,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/[0.14]">
            {processSteps.map((step, index) => {
              const isActive = activeStep === index;

              return (
                <article
                  key={step.title}
                  data-process-index={index}
                  className={`process-step--desktop grid min-h-[clamp(12.5rem,15vw,15.5rem)] grid-cols-[3.5rem_minmax(0,1fr)] gap-[1rem] border-b border-white/[0.14] py-[clamp(1.65rem,2vw,2.2rem)] transition-opacity duration-300 motion-reduce:transition-none ${
                    isActive ? "opacity-100" : "opacity-[0.52]"
                  }`}
                >
                  <span
                    className={`pt-[0.16rem] font-display text-[1rem] font-normal leading-none tracking-[-0.02em] transition-colors duration-300 motion-reduce:transition-none ${
                      isActive
                        ? "text-white/[0.64]"
                        : "text-white/[0.46]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={`m-0 font-display text-[0.62rem] font-semibold leading-[1.2] tracking-[0.16em] uppercase transition-colors duration-300 motion-reduce:transition-none ${
                        isActive
                          ? "text-white/[0.62]"
                          : "text-white/[0.5]"
                      }`}
                    >
                      {step.label}
                    </p>

                    <h3 className="mt-[0.55rem] mb-0 max-w-[24rem] font-display text-[clamp(1.22rem,1.45vw,1.4rem)] font-medium leading-[1.2] tracking-[-0.028em] text-white">
                      {step.title}
                    </h3>

                    <p className="mt-[0.72rem] mb-0 max-w-[31rem] text-[0.84rem] leading-[1.62] text-white/[0.64]">
                      {step.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}