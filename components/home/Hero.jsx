"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";

const IMAGEKIT_WIDTHS = [640, 960, 1280, 1600, 1920, 2560];
const IMAGEKIT_QUALITY = 80;
const HERO_FALLBACK_WIDTH = 1280;

const HERO_IMAGE = {
  src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/0566_ad48168e4a93f9aaf727711ea2ff3d488019b1cc.png",
  mobilePosition: "52% center",
  desktopPosition: "50% center",
};

const proofItems = [
  "Existing & custom designs",
  "Made for high-end wellness hotel",
  "Installed across Indonesia",
  "1 year free maintenance & warranty",
];

function getImageKitUrl(src, width) {
  return `${src}?tr=w-${width},q-${IMAGEKIT_QUALITY},f-auto`;
}

function getHeroSrcSet(src) {
  return IMAGEKIT_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

export default function Hero() {
  const heroRef = useRef(null);
  const [runtimePreferences, setRuntimePreferences] = useState({
    ready: false,
    reducedMotion: false,
    saveData: false,
  });

  useGSAP(
    () => {
      const hero = heroRef.current;

      if (!hero || !runtimePreferences.ready || shouldLimitMotion()) {
        return;
      }

      const media = hero.querySelector(".hero__media");

      if (!media) return;

      const mediaQueries = gsap.matchMedia();

      const addDepth = (query, values) => {
        mediaQueries.add(query, () => {
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: values.scrub,
              invalidateOnRefresh: true,
            },
          });

          timeline.fromTo(
            media,
            { yPercent: values.mediaFrom },
            { yPercent: values.mediaTo },
            0,
          );

          return () => timeline.kill();
        });
      };

      addDepth(MOTION_MEDIA.desktop, {
        mediaFrom: 2,
        mediaTo: -2,
        scrub: 1.1,
      });

      addDepth(MOTION_MEDIA.tablet, {
        mediaFrom: 1.25,
        mediaTo: -1.25,
        scrub: 1.05,
      });

      return () => mediaQueries.revert();
    },
    {
      scope: heroRef,
      dependencies: [
        runtimePreferences.ready,
        runtimePreferences.reducedMotion,
        runtimePreferences.saveData,
      ],
      revertOnUpdate: true,
    },
  );

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || navigator.connection?.saveData === true) {
      return;
    }

    const ctx = gsap.context(() => {
      const select = gsap.utils.selector(hero);

      const mobileTitleLines = select(".hero-title-line--mobile");
      const desktopTitleLines = select(".hero-title-line--desktop");
      const intro = select(".hero__intro");
      const ctaBlock = select(".hero__cta-block");
      const proofs = select(".hero__proofs");
      const proofItems = select(".hero__proofs li");
      const heroImage = select(".hero__image")[0];

      if (heroImage) {
        gsap.fromTo(
          heroImage,
          { scale: 1.035 },
          {
            scale: 1,
            duration: 1.8,
            ease: "power2.out",
          },
        );
      }

      const mm = gsap.matchMedia();

      mm.add("(max-width: 1023px)", () => {
        gsap.set(mobileTitleLines, {
          "--ikigai-mask-progress": "0%",
          "--ikigai-mask-feather": "30%",
        });

        gsap.set(intro, {
          opacity: 0,
          y: 3,
        });

        gsap.set(proofs, {
          opacity: 1,
          y: 0,
        });

        gsap.set(proofItems, {
          opacity: 0,
          y: 2,
        });

        gsap.set(ctaBlock, {
          opacity: 0,
          y: 2,
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        timeline
          .to(
            mobileTitleLines,
            {
              "--ikigai-mask-progress": "140%",
              duration: 1.12,
              stagger: 0.095,
              ease: "sine.inOut",
            },
            0.08,
          )
          .to(
            intro,
            {
              opacity: 1,
              y: 0,
              duration: 0.48,
            },
            0.96,
          )
          /*
           * Mobile CTA now comes before proof.
           * Animation order follows visual hierarchy.
           */
          .to(
            ctaBlock,
            {
              opacity: 1,
              y: 0,
              duration: 0.46,
            },
            1.28,
          )
          .to(
            proofItems,
            {
              opacity: 1,
              y: 0,
              duration: 0.34,
              stagger: 0.035,
            },
            1.5,
          );

        return () => timeline.kill();
      });

      mm.add("(min-width: 1024px)", () => {
        gsap.set(desktopTitleLines, {
          "--ikigai-mask-progress": "0%",
          "--ikigai-mask-feather": "32%",
        });

        gsap.set(intro, {
          opacity: 0,
          y: 3,
        });

        gsap.set(proofs, {
          opacity: 1,
          y: 0,
        });

        gsap.set(proofItems, {
          opacity: 0,
          y: 2,
        });

        gsap.set(ctaBlock, {
          opacity: 0,
          y: 2,
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        timeline
          .to(
            desktopTitleLines,
            {
              "--ikigai-mask-progress": "140%",
              duration: 1.26,
              stagger: 0.12,
              ease: "sine.inOut",
            },
            0.08,
          )
          .to(
            intro,
            {
              opacity: 1,
              y: 0,
              duration: 0.52,
            },
            1.12,
          )
          .to(
            ctaBlock,
            {
              opacity: 1,
              y: 0,
              duration: 0.48,
            },
            1.48,
          )
          .to(
            proofItems,
            {
              opacity: 1,
              y: 0,
              duration: 0.36,
              stagger: 0.04,
            },
            1.72,
          );

        return () => timeline.kill();
      });

      return () => mm.revert();
    }, hero);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const connection = navigator.connection;

    const updatePreferences = () => {
      const preferences = {
        ready: true,
        reducedMotion: motionQuery.matches,
        saveData: connection?.saveData === true,
      };

      setRuntimePreferences(preferences);
    };

    updatePreferences();

    motionQuery.addEventListener?.("change", updatePreferences);
    connection?.addEventListener?.("change", updatePreferences);

    return () => {
      motionQuery.removeEventListener?.("change", updatePreferences);
      connection?.removeEventListener?.("change", updatePreferences);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-labelledby="hero-title"
      className="hero relative isolate min-h-[clamp(40rem,78svh,44rem)] overflow-hidden bg-[var(--placeholder-dark)] text-white lg:min-h-[clamp(48rem,56.77vw,56rem)]"
    >
      {/* =====================================================
          MEDIA
      ====================================================== */}
      <div
        aria-hidden="true"
        className="hero__media absolute inset-x-0 -inset-y-[7%] -z-[3] overflow-hidden bg-[var(--placeholder-dark)]"
      >
        <img
          className="hero__image absolute inset-0 h-full w-full object-cover [object-position:var(--hero-object-mobile)] will-change-transform lg:[object-position:var(--hero-object-desktop)]"
          style={{
            "--hero-object-mobile": HERO_IMAGE.mobilePosition,
            "--hero-object-desktop": HERO_IMAGE.desktopPosition,
          }}
          src={getImageKitUrl(HERO_IMAGE.src, HERO_FALLBACK_WIDTH)}
          srcSet={getHeroSrcSet(HERO_IMAGE.src)}
          sizes="100vw"
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable="false"
        />
      </div>

      {/* =====================================================
          MOBILE CONTENT-AWARE OVERLAYS

          Vertical layer stabilizes overall image luminance.
          Left layer specifically protects the text region.

          Desktop treatment remains unchanged below.
      ====================================================== */}
      <div
        aria-hidden="true"
        className="hero__overlay-primary pointer-events-none absolute inset-0 -z-[2] bg-[linear-gradient(180deg,rgba(5,8,12,0.54)_0%,rgba(5,8,12,0.32)_28%,rgba(5,8,12,0.20)_56%,rgba(5,8,12,0.25)_73%,rgba(5,8,12,0.48)_100%)] lg:bg-[rgba(6,9,14,0.18)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[2] bg-[linear-gradient(90deg,rgba(5,8,12,0.48)_0%,rgba(5,8,12,0.41)_42%,rgba(5,8,12,0.22)_70%,rgba(5,8,12,0)_100%)] lg:hidden"
      />

      {/* DESKTOP LEFT SCRIM */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[2] hidden lg:block lg:bg-[linear-gradient(90deg,rgba(5,8,12,0.48)_0%,rgba(5,8,12,0.31)_31%,rgba(5,8,12,0.09)_60%,rgba(5,8,12,0)_82%)]"
      />

      {/* DESKTOP VERTICAL SCRIM */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[2] hidden lg:block lg:bg-[linear-gradient(180deg,rgba(5,8,12,0.10)_0%,rgba(5,8,12,0)_25%,rgba(5,8,12,0)_62%,rgba(5,8,12,0.34)_100%)]"
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="hero__inner mx-auto flex min-h-[inherit] w-full max-w-[105rem] flex-col px-[var(--page-gutter)] pt-[calc(var(--header-height)+2rem)] pb-8 md:pt-[calc(var(--header-height)+3rem)] lg:pt-[clamp(12rem,15.5vw,14.5rem)] lg:pb-0">
        {/* COPY */}
        <div className="hero__copy order-1 max-w-[33rem] md:max-w-[38rem] lg:w-full lg:max-w-[52.9375rem]">
          <h1
            id="hero-title"
            className="m-0 font-display text-[clamp(2.15rem,9vw,2.75rem)] font-normal leading-[0.98] tracking-[-0.038em] md:text-[clamp(2.8rem,6vw,3.8rem)] lg:text-[clamp(4rem,4.75vw,5.75rem)] lg:leading-[0.99] lg:tracking-[-0.025em]"
          >
            {/* ================= MOBILE TITLE ================= */}
            <span className="lg:hidden">
              <span className="hero-title-line--mobile gsap-text-clip ikigai-alpha-mask">
                <span className="block">Build Your Dream</span>
              </span>

              <span className="hero-title-line--mobile gsap-text-clip ikigai-alpha-mask">
                <span className="block">Wellness Setup with</span>
              </span>

              <span className="hero-title-line--mobile gsap-text-clip ikigai-alpha-mask [--gsap-text-clip-offset:0.16em]">
                <span className="block font-medium">
                  Ikigai Wellness
                </span>
              </span>
            </span>

            {/* ================= DESKTOP TITLE ================= */}
            <span className="hidden lg:block">
              <span className="hero-title-line--desktop gsap-text-clip ikigai-alpha-mask">
                <span className="block">Build Your Dream</span>
              </span>

              <span className="hero-title-line--desktop gsap-text-clip ikigai-alpha-mask">
                <span className="block">Wellness Setup with</span>
              </span>

              <span className="hero-title-line--desktop gsap-text-clip ikigai-alpha-mask [--gsap-text-clip-offset:0.1em]">
                <span className="block font-medium">
                  Ikigai Wellness
                </span>
              </span>
            </span>
          </h1>

          <p className="hero__intro mt-[1.15rem] mb-0 max-w-[29rem] text-[0.82rem] leading-[1.55] text-white/[0.82] md:max-w-[32rem] md:text-[0.9rem] lg:mt-[1.25rem] lg:max-w-[38rem] lg:text-[clamp(1rem,1.1vw,1.125rem)] lg:leading-[1.42] lg:text-white/[0.82]">
            Premium saunas, ice baths and complete wellness spaces designed,
            built, installed and maintained by our team across Indonesia.
          </p>
        </div>

        {/* =====================================================
            CTA

            Mobile:
            copy → CTA → proofs

            Desktop:
            same existing copy/CTA relationship, proofs remain
            the structural bottom rail.
        ====================================================== */}
        <div className="hero__cta-block order-2 mt-[1.65rem] w-full lg:mt-[1.8rem]">
          <div className="hero__cta-depth w-auto lg:max-w-none">
            <a
              className="
                hero__cta
                inline-flex
                min-h-[3.25rem]
                w-auto
                items-center
                justify-center
                rounded-[var(--pill)]
                border
                border-white/[0.30]
                bg-[linear-gradient(180deg,rgba(72,63,55,0.72)_0%,rgba(25,23,22,0.82)_100%)]
                px-[1.55rem]
                py-[0.9rem]
                text-center
                font-display
                text-[0.76rem]
                font-semibold
                leading-none
                tracking-[0.035em]
                text-white/[0.96]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_24px_rgba(0,0,0,0.14)]
                backdrop-blur-[10px]
                transition-[background-color,color,border-color,box-shadow]
                duration-[190ms]
                ease-out
                hover:border-white/[0.55]
                hover:bg-[var(--paper-strong)]
                hover:text-[var(--ink)]
                hover:shadow-[inset_0_1px_0_rgba(255,255,255,0),0_8px_24px_rgba(0,0,0,0.10)]
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-white
                lg:min-h-[3.375rem]
                lg:px-[2rem]
                lg:py-[0.95rem]
                lg:text-[clamp(0.82rem,0.9vw,0.95rem)]
                lg:tracking-[0.014em]
              "
              href="#consultation"
            >
              Book a free consultation
            </a>

            <p className="mt-[1rem] hidden max-w-[20.375rem] text-[0.75rem] leading-[1.72] text-white/[0.72] lg:block">
              Tell us about your property and what you&apos;re looking to create.
              Our team will recommend the right setup and next steps.
            </p>
          </div>
        </div>

        {/* =====================================================
            PROOFS

            Mobile:
            moved below CTA
            slightly quieter contrast
            slightly tighter vertical rhythm

            Desktop:
            existing high-authority bottom rail restored.
        ====================================================== */}
        <ul
          className="hero__proofs order-3 mt-[1.8rem] grid max-w-[18rem] list-none grid-cols-1 gap-y-[0.68rem] p-0 md:max-w-[35rem] md:grid-cols-2 md:gap-x-8 md:gap-y-4 lg:mt-auto lg:mb-[2.25rem] lg:w-full lg:max-w-none lg:grid-cols-4 lg:gap-x-[2rem] lg:border-t lg:border-white/[0.22] lg:pt-[1.3rem]"
          aria-label="IKIGAI service commitments"
        >
          {proofItems.map((item) => (
            <li
              className="flex items-start gap-[0.6rem] font-display text-[0.75rem] font-medium leading-[1.38] text-white/[0.84] md:text-[0.82rem] lg:items-center lg:gap-[0.625rem] lg:text-[clamp(0.86rem,0.9vw,0.95rem)] lg:font-semibold lg:leading-[1.25] lg:text-white/[0.94]"
              key={item}
            >
              <Check
                className="mt-[0.05rem] h-[14px] w-[14px] shrink-0 opacity-75 lg:mt-0 lg:h-[1.05rem] lg:w-[1.05rem] lg:opacity-90"
                aria-hidden="true"
                strokeWidth={1.7}
              />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
