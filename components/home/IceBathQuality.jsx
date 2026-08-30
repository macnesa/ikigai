"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";

const IMAGEKIT_QUALITY = 80;

const MOBILE_ICE_BATH_VISUAL =
  "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-29_17-35-43.png";

const DESKTOP_ICE_BATH_VIDEO =
  "https://ik.imagekit.io/ikigaiwellness/ikigai/home/assamble%20chiller.mp4?updatedAt=1788083800216";

const iceBathDetails = [
  {
    id: "ice-insulation",
    title: "Keep the cold in",
    mobileTitle: "Insulation — keep the cold in",
    label: "Insulation",
    body: "Getting water cold is half the job. Insulation stops outside heat transferring back in — steadier temperature, less chiller runtime.",
  },
  {
    id: "ice-chilling",
    title: "Get it cold",
    mobileTitle: "Chilling — get it cold",
    label: "Chilling",
    body: "Sized for water volume, Indonesia’s ambient temperature and expected usage — not left struggling to hold temperature.",
  },
  {
    id: "ice-filtration",
    title: "Keep it clean",
    mobileTitle: "Filtration — keep it clean",
    label: "Filtration",
    body: "Cold water still needs proper filtration. It keeps the water clean and cuts constant draining and refilling.",
  },
  {
    id: "ice-circulation",
    title: "Keep it moving",
    mobileTitle: "Circulation — keep it moving",
    label: "Circulation",
    body: "Water has to move consistently through the system so it actually passes through filtration and chilling.",
  },
  {
    id: "ice-maintenance",
    title: "Keep it easy to own",
    mobileTitle: "Maintenance access",
    label: "Maintenance access",
    body: "Filters change, pumps get checked, chillers get serviced. Technicians must reach the equipment without dismantling the install.",
  },
];

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}tr=w-${width},q-${IMAGEKIT_QUALITY},f-auto`;
}

function MobileTechnicalDetails() {
  const [activeIndex, setActiveIndex] = useState(0);

  const selectPrinciple = (index) => {
    if (activeIndex === index) {
      return;
    }

    setActiveIndex(index);
  };

  return (
    <div className="ice-quality__mobile-technical">
      <div className="border-t border-white/[0.15]">
        {iceBathDetails.map((item, index) => {
          const isActive = activeIndex === index;
          const triggerId = `${item.id}-mobile-trigger`;
          const panelId = `${item.id}-mobile-detail`;

          return (
            <div key={item.id} className="border-b border-white/[0.15]">
              <button
                id={triggerId}
                type="button"
                onClick={() => selectPrinciple(index)}
                aria-expanded={isActive}
                aria-controls={panelId}
                className="grid min-h-[3.8rem] w-full grid-cols-[2.65rem_minmax(0,1fr)] items-center bg-transparent p-0 text-left outline-none [tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-white/[0.7]"
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
                    isActive ? "text-white" : "text-white/[0.86]"
                  }`}
                >
                  {item.mobileTitle}
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

                    <p className="mt-0 mb-0 max-w-[22rem] pb-[1.5rem] pr-[0.2rem] text-[length:var(--type-reading-technical)] leading-[1.65] text-white/[0.62]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-[2.2rem] mb-0 max-w-[21rem] text-[0.8rem] leading-[1.65] text-white/[0.6]">
        Every IKIGAI ice bath is engineered as a complete system — from
        insulation and chilling to filtration, circulation and service access.
      </p>
    </div>
  );
}

function DesktopTechnicalDetails() {
  return (
    <div className="ice-quality__desktop-technical grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[clamp(2.75rem,3.5vw,4.5rem)]">
      {iceBathDetails.map((item, index) => (
        <article
          key={item.id}
          className="min-h-[11.5rem] border-t border-[var(--line)] pt-[1.35rem] pr-[1rem] pb-[1.75rem]"
        >
          <div className="grid grid-cols-[2.3rem_minmax(0,1fr)] gap-[0.8rem]">
            <span className="pt-[0.05rem] font-display text-[0.78rem] leading-none text-[var(--ink-soft)]">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <h3 className="m-0 font-display text-[1rem] font-medium leading-[1.3] tracking-[-0.018em] text-[var(--ink)]">
                {item.title}
              </h3>

              <p className="mt-[0.48rem] mb-0 font-display text-[length:var(--type-small-label)] leading-[1.2] tracking-[0.16em] text-[var(--ink-soft)] uppercase">
                {item.label}
              </p>

              <p className="mt-[0.65rem] mb-0 max-w-[26rem] text-[length:var(--type-reading-technical)] leading-[1.65] text-[var(--ink-soft)]">
                {item.body}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function IceBathQuality() {
  const sectionRef = useRef(null);
  const [canPlayVideo, setCanPlayVideo] = useState(false);

  useEffect(() => {
    const saveData = navigator.connection?.saveData === true;

    setCanPlayVideo(!saveData && !shouldLimitMotion());
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

      const mediaQueries = gsap.matchMedia();

      mediaQueries.add(MOTION_MEDIA.mobile, () => {
        const stage = section.querySelector(".ice-quality__mobile-stage");
        const eyebrow = section.querySelector(
          ".ice-quality__mobile-eyebrow",
        );
        const heading = section.querySelector(
          ".ice-quality__mobile-heading",
        );
        const body = section.querySelector(".ice-quality__mobile-body");
        const technical = section.querySelector(
          ".ice-quality__mobile-technical",
        );

        if (!stage || !eyebrow || !heading || !body || !technical) {
          return;
        }

        const entrance = gsap.timeline({
          defaults: {
            ease: "power2.out",
          },
          scrollTrigger: {
            trigger: stage,
            start: "top 83%",
            once: true,
          },
        });

        entrance
          .fromTo(
            eyebrow,
            {
              autoAlpha: 0,
              y: 4,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.48,
            },
            0,
          )
          .fromTo(
            heading,
            {
              autoAlpha: 0,
              y: 18,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.82,
              ease: "power3.out",
            },
            0.08,
          )
          .fromTo(
            body,
            {
              autoAlpha: 0,
              y: 10,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.58,
            },
            0.28,
          )
          .fromTo(
            technical,
            {
              opacity: 0.72,
              y: 5,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.58,
            },
            0.42,
          );

        return () => entrance.kill();
      });

      const addDesktopMotion = (query, values) => {
        mediaQueries.add(query, () => {
          const technicalEnvironment = section.querySelector(
            ".ice-quality__desktop",
          );
          const atmosphere = section.querySelector(
            ".ice-quality__desktop-atmosphere",
          );
          const eyebrow = section.querySelector(
            ".ice-quality__desktop-eyebrow",
          );
          const heading = section.querySelector(
            ".ice-quality__desktop-heading",
          );
          const body = section.querySelector(
            ".ice-quality__desktop-body",
          );
          const media = section.querySelector(
            ".ice-quality__desktop-media",
          );
          const technical = section.querySelector(
            ".ice-quality__desktop-technical",
          );

          if (
            !technicalEnvironment ||
            !atmosphere ||
            !eyebrow ||
            !heading ||
            !body ||
            !media ||
            !technical
          ) {
            return;
          }

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
                trigger: technicalEnvironment,
                start: "top bottom",
                end: "bottom top",
                scrub: values.scrub,
                invalidateOnRefresh: true,
              },
            },
          );

          const entrance = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
            scrollTrigger: {
              trigger: technicalEnvironment,
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
              0,
            )
            .fromTo(
              heading,
              {
                autoAlpha: 0,
                y: values.headingY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.82,
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
              media,
              {
                autoAlpha: 0,
                y: values.mediaY,
                scale: values.mediaScale,
              },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.78,
              },
              0.16,
            )
            .fromTo(
              technical,
              {
                opacity: 0.72,
                y: values.technicalY,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.58,
              },
              0.42,
            );

          return () => {
            atmosphereTween.kill();
            entrance.kill();
          };
        });
      };

      addDesktopMotion(MOTION_MEDIA.tablet, {
        fromY: 27,
        toY: -29,
        scale: 1.038,
        fromOpacity: 0.22,
        toOpacity: 0.34,
        scrub: 1.25,
        eyebrowY: 5,
        headingY: 25,
        bodyY: 12,
        mediaY: 15,
        mediaScale: 0.99,
        technicalY: 6,
        entranceStart: "top 79%",
      });

      addDesktopMotion(MOTION_MEDIA.desktop, {
        fromY: 36,
        toY: -36,
        scale: 1.045,
        fromOpacity: 0.2,
        toOpacity: 0.34,
        scrub: 1.4,
        eyebrowY: 6,
        headingY: 30,
        bodyY: 15,
        mediaY: 18,
        mediaScale: 0.988,
        technicalY: 7,
        entranceStart: "top 76%",
      });

      const addBridgeMotion = (query, values) => {
        mediaQueries.add(query, () => {
          const bridge = section.querySelector(".ice-quality__bridge");
          const statement = section.querySelector(
            ".ice-quality__bridge-statement",
          );
          const cta = section.querySelector(".ice-quality__bridge-cta");

          if (!bridge || !statement || !cta) {
            return;
          }

          const entrance = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
            scrollTrigger: {
              trigger: bridge,
              start: values.start,
              once: true,
            },
          });

          entrance
            .fromTo(
              statement,
              {
                autoAlpha: 0,
                y: values.statementY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.76,
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
                duration: 0.54,
              },
              0.2,
            );

          return () => entrance.kill();
        });
      };

      addBridgeMotion(MOTION_MEDIA.mobile, {
        statementY: 18,
        ctaY: 10,
        start: "top 84%",
      });

      addBridgeMotion(MOTION_MEDIA.tablet, {
        statementY: 24,
        ctaY: 12,
        start: "top 82%",
      });

      addBridgeMotion(MOTION_MEDIA.desktop, {
        statementY: 28,
        ctaY: 14,
        start: "top 80%",
      });

      return () => mediaQueries.revert();
    },
    {
      scope: sectionRef,
    },
  );

  const mobileBackgroundUrl = getImageKitUrl(
    MOBILE_ICE_BATH_VISUAL,
    1280,
  );

  return (
    <section
      ref={sectionRef}
      id="ice-bath-quality"
      className="ice-quality bg-[var(--paper-strong)] text-[var(--ink)]"
    >
      {/* MOBILE */}
      <div className="ice-quality__mobile-stage dark-surface dark-surface--ice relative overflow-hidden bg-[#001a36] pb-12 text-white md:hidden">
  <div
    className="absolute inset-x-0 top-0 h-[137vw] bg-[#001a36]"
    style={{
      backgroundImage: `url("${mobileBackgroundUrl}")`,
      backgroundSize: "100% auto",
      backgroundPosition: "top center",
      backgroundRepeat: "no-repeat",
    }}
    aria-hidden="true"
  />

  <div
    className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vw] bg-[linear-gradient(to_bottom,rgba(0,26,54,0)_0%,rgba(0,26,54,0.16)_28%,rgba(0,26,54,0.42)_56%,rgba(0,26,54,0.78)_82%,#001a36_100%)]"
    aria-hidden="true"
  />

  <div className="relative z-[1] min-h-[137vw] px-[var(--page-gutter)] pt-12">
    <p className="ice-quality__mobile-eyebrow m-0 font-display text-[0.66rem] font-semibold leading-[1.2] tracking-[0.18em] text-white/[0.62] uppercase">
      Ice Bath
    </p>

    <h2
      id="ice-bath-title-mobile"
      className="ice-quality__mobile-heading mt-[0.8rem] mb-0 max-w-[18ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em]"
    >
      What’s Underneath Matters More Than You Think
    </h2>

    <p className="ice-quality__mobile-body mt-[1rem] mb-0 max-w-[23rem] text-[length:var(--type-section-intro-standard)] leading-[1.65] text-white/[0.62]">
      Two ice baths can look almost identical from the outside. What
      happens underneath determines how efficiently they cool, how clean
      the water stays, and how easy the system is to maintain.
    </p>
  </div>

  <div className="relative z-[1] px-[var(--page-gutter)]">
    <div>
      <MobileTechnicalDetails />
    </div>
  </div>
</div>

      {/* TABLET / DESKTOP */}
      <div
        className="ice-quality__desktop relative isolate hidden overflow-hidden bg-[var(--paper-strong)] text-[var(--ink)] md:block md:pt-[clamp(7rem,8vw,9.5rem)] md:pb-[clamp(3rem,4vw,4.75rem)]"
        aria-labelledby="ice-bath-title-desktop"
      >
        <div
          className="ice-quality__desktop-atmosphere pointer-events-none absolute -inset-[16%] z-0 bg-[radial-gradient(ellipse_at_72%_38%,rgba(49,126,169,0.26)_0%,rgba(22,72,103,0.11)_42%,transparent_70%)]"
          aria-hidden="true"
        />

        <div className="site-container relative z-[1] mx-auto grid w-full max-w-[105rem] grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] grid-rows-[auto_1fr] gap-x-[clamp(2rem,5vw,8rem)] gap-y-[0.8rem] px-[var(--page-gutter)] lg:grid-cols-[minmax(0,1.05fr)_minmax(32rem,0.95fr)]">
          <p className="ice-quality__desktop-eyebrow m-0 font-display text-[0.66rem] font-semibold leading-[1.2] tracking-[0.18em] uppercase">
            Ice Bath
          </p>

          <div className="col-start-1 row-start-2">
            <h2
              id="ice-bath-title-desktop"
              className="ice-quality__desktop-heading m-0 max-w-[18ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em]"
            >
              What’s Underneath Matters More Than You Think
            </h2>

            <p className="ice-quality__desktop-body mt-[0.8rem] mb-0 max-w-[38rem] text-[length:var(--type-section-intro-standard)] leading-[1.65] text-[var(--ink-soft)]">
              Two ice baths can look almost identical from the outside. What
              happens underneath determines how efficiently they cool, how
              clean the water stays, and how easy the system is to maintain.
            </p>

            <div className="ice-quality__desktop-media relative mt-[1.25rem] aspect-[16/11] overflow-hidden bg-[#174159]">
              <img
                className="absolute inset-0 block h-full w-full object-cover object-center"
                src={getImageKitUrl(MOBILE_ICE_BATH_VISUAL, 1280)}
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
                aria-hidden="true"
              />

              {canPlayVideo ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 hidden h-full w-full object-cover lg:block"
                  aria-hidden="true"
                >
                  <source src={DESKTOP_ICE_BATH_VIDEO} type="video/mp4" />
                </video>
              ) : null}
            </div>
          </div>

          <div className="col-start-2 row-start-2">
            <DesktopTechnicalDetails />
          </div>
        </div>
      </div>

      {/* BRIDGE */}
      <div className="ice-quality__bridge bg-[var(--paper-strong)] text-[var(--ink)]">
        <div className="site-container mx-auto grid w-full max-w-[105rem] gap-[2.35rem] px-[var(--page-gutter)] pt-[3.8rem] pb-[4rem] md:flex md:items-center md:justify-between md:gap-16 md:pt-[2.25rem] md:pb-[clamp(4rem,6vw,7rem)]">
          <p className="ice-quality__bridge-statement mx-auto my-0 w-full max-w-[20rem] text-center font-display text-[clamp(1.72rem,7.2vw,2rem)] font-medium leading-[1.1] tracking-[-0.035em] text-[var(--ink-soft)] md:mx-0 md:max-w-none md:text-left md:text-[1.55rem] md:leading-[1.15] md:tracking-[-0.025em]">
            The Difference Isn’t Always Visible from the Outside
          </p>

          <a
            href="#consultation"
            className="pill-button pill-button--standard pill-button--dark ice-quality__bridge-cta mx-auto inline-flex min-h-[3.65rem] w-[min(100%,19rem)] rounded-[0.95rem] border-[var(--ink)] px-[1.4rem] py-[0.95rem] text-[0.74rem] tracking-[0.045em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] md:mx-0 md:min-h-[3.15rem] md:w-fit md:rounded-[var(--pill)] md:px-[1.4rem] md:py-[0.9rem] md:text-[0.68rem] md:tracking-[0.07em]"
          >
            Book a free consultation
          </a>
        </div>
      </div>
    </section>
  );
}
