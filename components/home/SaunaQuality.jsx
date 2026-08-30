"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";

const IMAGEKIT_WIDTHS = [640, 960, 1280, 1600];
const IMAGEKIT_QUALITY = 80;

const SAUNA_COMPARISON_IMAGES = {
  other:
    "https://ik.imagekit.io/ikigaiwellness/ikigai/home/Screenshot%202026-08-26%20at%2011.35.57.png",
  ours:
    "https://ik.imagekit.io/ikigaiwellness/ikigai/home/Screenshot%202026-08-26%20at%2011.36.12.png",
};

const saunaDetails = [
  {
    id: "sauna-heater",
    title: "The heater needs to match the room",
    mobileTitle: "Heater sizing",
    body: "Sized around sauna volume, glass area and construction. Too small, and the room does not heat properly.",
  },
  {
    id: "sauna-airflow",
    title: "Good heat still needs good airflow",
    mobileTitle: "Ventilation",
    body: "Designed air intake and exhaust. Without it the room feels stuffy and the heat goes uneven.",
  },
  {
    id: "sauna-benches",
    title: "Where you sit changes the experience",
    mobileTitle: "Bench height",
    body: "Heat rises. Benches too low and much of your body stays in the cooler part of the room.",
  },
  {
    id: "sauna-clearances",
    title: "The heater can’t go wherever it looks best",
    mobileTitle: "Heater position & clearances",
    body: "Position and distance from wood, benches and walls must match the heater’s requirements.",
  },
  {
    id: "sauna-insulation",
    title: "The room needs to hold heat",
    mobileTitle: "Insulation & construction",
    body: "Insulation, vapour control and wall construction are designed for repeated heat and humidity. A sauna isn’t just timber on the outside.",
  },
];

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}tr=w-${width},q-${IMAGEKIT_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return IMAGEKIT_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

function ComparisonImage({ src }) {
  return (
    <img
      className="absolute inset-0 block h-full w-full object-cover object-center"
      src={getImageKitUrl(src, IMAGEKIT_WIDTHS[1])}
      srcSet={getImageKitSrcSet(src)}
      sizes="(min-width: 48rem) 48vw, 100vw"
      alt=""
      loading="lazy"
      decoding="async"
      draggable="false"
      aria-hidden="true"
    />
  );
}

function ComparisonSlider() {
  const [position, setPosition] = useState(50);

  return (
    <div
      className="group relative aspect-[4/5] w-full overflow-hidden bg-[#5f5a52] text-white"
      role="group"
      aria-label="Compare the other sauna with the IKIGAI sauna"
      style={{
        "--comparison-position": `${position}%`,
      }}
    >
      <ComparisonImage src={SAUNA_COMPARISON_IMAGES.ours} />

      <div
        className="absolute inset-0 [clip-path:inset(0_calc(100%_-_var(--comparison-position))_0_0)]"
        aria-hidden="true"
      >
        <ComparisonImage src={SAUNA_COMPARISON_IMAGES.other} />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-[var(--comparison-position)] z-[3] w-[2px] -translate-x-1/2 bg-white"
        aria-hidden="true"
      >
        <span className="absolute top-1/2 left-1/2 flex aspect-square w-[2.65rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-[0_4px_18px_rgba(0,0,0,0.14)] transition-[box-shadow,transform] duration-[160ms] group-focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.34),0_4px_18px_rgba(0,0,0,0.17)] md:w-[3rem]">
          <ChevronLeft
            className="-mr-[0.22rem]"
            size={16}
            strokeWidth={1.7}
          />

          <ChevronRight
            className="-ml-[0.22rem]"
            size={16}
            strokeWidth={1.7}
          />
        </span>
      </div>

      <input
        className="absolute inset-0 z-[4] m-0 h-full w-full cursor-ew-resize opacity-0 [touch-action:pan-y]"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label="Compare the other sauna with the IKIGAI sauna"
      />
    </div>
  );
}

function MobileTechnicalDetails() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const hasIntroducedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    if (shouldLimitMotion()) {
      hasIntroducedRef.current = true;
      setActiveIndex(0);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || hasIntroducedRef.current) {
          return;
        }

        hasIntroducedRef.current = true;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setActiveIndex(0);
          });
        });

        observer.disconnect();
      },
      {
        root: null,
        threshold: 0.16,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const selectPrinciple = (index) => {
    hasIntroducedRef.current = true;

    if (activeIndex === index) {
      return;
    }

    setActiveIndex(index);
  };

  return (
    <div
      ref={containerRef}
      className="sauna__technical-focus sauna__technical-mobile md:hidden"
    >
      <div className="border-t border-white/[0.15]">
        {saunaDetails.map((item, index) => {
          const isActive = activeIndex === index;
          const panelId = `${item.id}-mobile-detail`;
          const triggerId = `${item.id}-mobile-trigger`;

          return (
            <div
              key={item.id}
              className="border-b border-white/[0.15]"
            >
              <button
                id={triggerId}
                type="button"
                className="grid min-h-[3.8rem] w-full grid-cols-[2.65rem_minmax(0,1fr)] items-center bg-transparent p-0 text-left outline-none [tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-white/[0.7]"
                aria-expanded={isActive}
                aria-controls={panelId}
                onClick={() => selectPrinciple(index)}
              >
                <span
                  className={`font-display text-[0.9rem] font-normal leading-none transition-colors duration-300 ${
                    isActive
                      ? "text-white/[0.72]"
                      : "text-white/[0.42]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  className={`py-[0.95rem] pr-[0.2rem] font-display text-[1rem] font-medium leading-[1.28] tracking-[-0.018em] transition-colors duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-white/[0.86]"
                  }`}
                >
                  {item.mobileTitle || item.title}
                </span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={`grid transition-[grid-template-rows,opacity] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  isActive
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-[2.65rem_minmax(0,1fr)]">
                    <div aria-hidden="true" />

                    <div className="pb-[1.5rem] pr-[0.2rem]">
                      <h3 className="m-0 max-w-[20rem] font-display text-[0.98rem] font-medium leading-[1.35] tracking-[-0.018em] text-white/[0.94]">
                        {item.title}
                      </h3>

                      <p className="mt-[0.65rem] mb-0 max-w-[22rem] text-[length:var(--type-reading-technical)] leading-[1.65] text-white/[0.62]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-[2.2rem] mb-0 max-w-[21rem] text-[0.82rem] leading-[1.65] text-white/[0.62]">
        Every IKIGAI sauna is engineered as a complete room — from heater
        sizing and ventilation to insulation and construction.
      </p>
    </div>
  );
}

function DesktopTechnicalDetails() {
  return (
    <div className="sauna__technical-focus sauna__technical-desktop hidden md:block">
      {saunaDetails.map((item, index) => (
        <article
          key={item.id}
          className={`grid grid-cols-[3.4rem_minmax(0,1fr)] gap-4 py-[1.35rem] ${
            index < saunaDetails.length - 1
              ? "border-b border-white/[0.13]"
              : ""
          }`}
        >
          <span className="pt-[0.08rem] font-display text-[1.08rem] font-normal leading-none tracking-[-0.02em] text-white/[0.72]">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div>
            <h3 className="m-0 font-display text-[1.04rem] font-medium leading-[1.3] tracking-[-0.015em] text-white/[0.94]">
              {item.title}
            </h3>

            <p className="mt-[0.55rem] mb-0 max-w-[35rem] text-[length:var(--type-reading-technical)] leading-[1.6] text-white/[0.62]">
              {item.body}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function TechnicalDetails() {
  return (
    <>
      <DesktopTechnicalDetails />
      <MobileTechnicalDetails />
    </>
  );
}

export default function SaunaQuality() {
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

      const atmosphere = section.querySelector(".sauna__atmosphere");
      const eyebrow = section.querySelector(".sauna__eyebrow");
      const heading = section.querySelector(".sauna__heading");
      const body = section.querySelector(".sauna__body");
      const comparison = section.querySelector(
        ".sauna__comparison-frame",
      );

      if (!atmosphere || !eyebrow || !heading || !body || !comparison) {
        return;
      }

      const mediaQueries = gsap.matchMedia();

      const addAtmosphere = (query, values) => {
        mediaQueries.add(query, () => {
          const technical = section.querySelector(
            values.technicalSelector,
          );

          const atmosphereTween = gsap.fromTo(
            atmosphere,
            {
              y: values.fromY,
              scale: 1,
              opacity: values.fromOpacity,
            },
            {
              y: values.toY,
              scale: values.scale,
              opacity: values.toOpacity,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: values.scrub,
                invalidateOnRefresh: true,
              },
            },
          );

          const entrance = gsap.timeline({
            defaults: {
              ease: "power2.out",
            },
            scrollTrigger: {
              trigger: section,
              start: values.entranceStart,
              once: true,
            },
          });

          entrance
            .fromTo(
              eyebrow,
              {
                autoAlpha: 0,
                y: values.eyebrowY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.48,
              },
            )
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
                duration: 0.82,
                ease: "power3.out",
              },
              0.08,
            )
            .fromTo(
              body,
              {
                autoAlpha: 0,
                y: values.bodyY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.58,
              },
              0.28,
            )
            .fromTo(
              comparison,
              {
                autoAlpha: 0,
                y: values.frameY,
                scale: values.frameScale,
              },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.78,
              },
              0.16,
            );

          if (technical) {
            entrance.fromTo(
              technical,
              {
                autoAlpha: 0,
                y: values.technicalY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.58,
              },
              0.42,
            );
          }

          return () => {
            atmosphereTween.kill();
            entrance.kill();
          };
        });
      };

      addAtmosphere(MOTION_MEDIA.desktop, {
        fromY: -28,
        toY: 30,
        scale: 1.045,
        fromOpacity: 0.29,
        toOpacity: 0.44,
        scrub: 1.5,
        eyebrowY: 6,
        headingY: 30,
        bodyY: 16,
        frameY: 20,
        frameScale: 0.985,
        technicalY: 7,
        technicalSelector: ".sauna__technical-desktop",
        entranceStart: "top 76%",
      });

      addAtmosphere(MOTION_MEDIA.tablet, {
        fromY: -21,
        toY: 24,
        scale: 1.038,
        fromOpacity: 0.27,
        toOpacity: 0.4,
        scrub: 1.3,
        eyebrowY: 5,
        headingY: 25,
        bodyY: 13,
        frameY: 16,
        frameScale: 0.988,
        technicalY: 6,
        technicalSelector: ".sauna__technical-desktop",
        entranceStart: "top 79%",
      });

      addAtmosphere(MOTION_MEDIA.mobile, {
        fromY: -14,
        toY: 15,
        scale: 1.026,
        fromOpacity: 0.25,
        toOpacity: 0.35,
        scrub: 1.1,
        eyebrowY: 4,
        headingY: 21,
        bodyY: 10,
        frameY: 10,
        frameScale: 1,
        technicalY: 5,
        technicalSelector: ".sauna__technical-mobile",
        entranceStart: "top 83%",
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
      id="sauna-quality"
      aria-labelledby="sauna-title"
      className="dark-surface dark-surface--warm relative isolate overflow-hidden bg-[var(--night)] pt-16 pb-[4.5rem] text-white md:py-[clamp(5.5rem,6vw,7rem)]"
    >
      <div
        className="sauna__atmosphere pointer-events-none absolute -inset-[18%] z-0 bg-[radial-gradient(circle_at_26%_44%,rgba(211,128,56,0.22)_0%,rgba(137,76,35,0.1)_38%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-[1] mx-auto grid w-full max-w-[105rem] px-[var(--page-gutter)] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:grid-rows-[auto_auto_1fr] md:gap-x-[clamp(3rem,5vw,6rem)]">
        <div className="grid gap-[0.8rem] md:col-start-2 md:row-start-1">
          <p className="sauna__eyebrow m-0 font-display text-[0.66rem] font-semibold leading-[1.2] tracking-[0.18em] text-white/[0.62] uppercase">
            Sauna
          </p>

          <h2
            id="sauna-title"
            className="sauna__heading gsap-text-clip font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em]"
          >
            Beautiful Isn’t Always Built Properly
          </h2>
        </div>

        <p className="sauna__body order-2 mt-[1rem] mb-0 text-[length:var(--type-section-intro-standard)] leading-[1.65] text-white/[0.64] md:order-none md:col-start-2 md:row-start-2 md:mt-[1rem] md:max-w-[39rem] md:leading-[1.58]">
          <span className="md:hidden">
            A sauna can look beautiful and still be poorly designed. What
            matters is how the whole room works together.
          </span>

          <span className="hidden md:inline">
            Most problems aren’t obvious when an installation is new. They show
            up later: poor performance, higher running costs, uncomfortable use,
            difficult maintenance.
          </span>
        </p>

        <div className="sauna__comparison-frame order-3 -mx-[var(--page-gutter)] mt-[2rem] w-[calc(100%+2*var(--page-gutter))] md:order-none md:col-start-1 md:row-start-1 md:row-span-3 md:mx-0 md:mt-0 md:w-auto">
          <ComparisonSlider />
        </div>

        <div className="order-4 mt-[2.25rem] md:order-none md:col-start-2 md:row-start-3 md:mt-[1.9rem]">
          <TechnicalDetails />
        </div>
      </div>
    </section>
  );
}
