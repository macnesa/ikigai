"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

const ROTATION_INTERVAL_MS = 7000;
const CROSSFADE_DURATION_MS = 900;

const HERO_IMAGES = [
  {
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/0566_ad48168e4a93f9aaf727711ea2ff3d488019b1cc.png",
    mobilePosition: "52% center",
    desktopPosition: "50% center",
  },
  {
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-25_17-51-48.png",
    mobilePosition: "54% center",
    desktopPosition: "52% center",
  },
  {
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-25_17-52-30.png",
    mobilePosition: "58% center",
    desktopPosition: "54% center",
  },
];

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

function getPreloadWidth() {
  const targetWidth = Math.min(
    IMAGEKIT_WIDTHS.at(-1),
    Math.ceil(window.innerWidth * (window.devicePixelRatio || 1)),
  );

  return (
    IMAGEKIT_WIDTHS.find((width) => width >= targetWidth) ||
    IMAGEKIT_WIDTHS.at(-1)
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const failedImagesRef = useRef(new Set());
  const lastShownAtRef = useRef(0);
  const wasRotatingRef = useRef(false);
  const fadeFrameRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextReadyIndex, setNextReadyIndex] = useState(null);
  const [preloadVersion, setPreloadVersion] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [heroVisible, setHeroVisible] = useState(true);
  const [runtimePreferences, setRuntimePreferences] = useState({
    ready: false,
    reducedMotion: false,
    saveData: false,
  });

  const pausePendingTransition = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }

    if (incomingIndex === null) return;

    if (isCrossfading) {
      setCurrentIndex(incomingIndex);
    }

    setIncomingIndex(null);
    setIsCrossfading(false);
    lastShownAtRef.current = Date.now();
  }, [incomingIndex, isCrossfading]);

  const canRotate =
    runtimePreferences.ready &&
    !runtimePreferences.reducedMotion &&
    !runtimePreferences.saveData &&
    pageVisible &&
    heroVisible;

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
        mediaFrom: 1.35,
        mediaTo: -1.35,
        scrub: 1.25,
      });

      addDepth(MOTION_MEDIA.tablet, {
        mediaFrom: 1,
        mediaTo: -1,
        scrub: 1.15,
      });

      addDepth(MOTION_MEDIA.mobile, {
        mediaFrom: 0.55,
        mediaTo: -0.55,
        scrub: 1,
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
      const currentImage = select(".hero__image--current")[0];

      if (currentImage) {
        gsap.fromTo(
          currentImage,
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
          yPercent: 132,
        });

        gsap.set(intro, {
          opacity: 0,
          y: 12,
        });

        gsap.set(proofs, {
          opacity: 1,
          y: 0,
        });

        gsap.set(proofItems, {
          opacity: 0,
          y: 6,
        });

        gsap.set(ctaBlock, {
          opacity: 0,
          y: 12,
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        timeline
          .to(
            mobileTitleLines,
            {
              yPercent: 0,
              duration: 0.74,
              stagger: 0.09,
            },
            0.08,
          )
          .to(
            intro,
            {
              opacity: 1,
              y: 0,
              duration: 0.44,
            },
            "-=0.24",
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
            "-=0.16",
          )
          .to(
            proofItems,
            {
              opacity: 1,
              y: 0,
              duration: 0.34,
              stagger: 0.035,
            },
            "-=0.08",
          );

        return () => timeline.kill();
      });

      mm.add("(min-width: 1024px)", () => {
        gsap.set(desktopTitleLines, {
          yPercent: 132,
        });

        gsap.set(intro, {
          opacity: 0,
          y: 20,
        });

        gsap.set(proofs, {
          opacity: 1,
          y: 0,
        });

        gsap.set(proofItems, {
          opacity: 0,
          y: 8,
        });

        gsap.set(ctaBlock, {
          opacity: 0,
          y: 16,
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        timeline
          .to(
            desktopTitleLines,
            {
              yPercent: 0,
              duration: 0.86,
              stagger: 0.1,
            },
            0.08,
          )
          .to(
            intro,
            {
              opacity: 1,
              y: 0,
              duration: 0.54,
            },
            "-=0.3",
          )
          .to(
            ctaBlock,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
            },
            "-=0.26",
          )
          .to(
            proofItems,
            {
              opacity: 1,
              y: 0,
              duration: 0.38,
              stagger: 0.045,
            },
            "-=0.24",
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

      if (preferences.reducedMotion || preferences.saveData) {
        pausePendingTransition();
      }
    };

    updatePreferences();

    motionQuery.addEventListener?.("change", updatePreferences);
    connection?.addEventListener?.("change", updatePreferences);

    return () => {
      motionQuery.removeEventListener?.("change", updatePreferences);
      connection?.removeEventListener?.("change", updatePreferences);
    };
  }, [pausePendingTransition]);

  useEffect(() => {
    const updateVisibility = () => {
      const isVisible = !document.hidden;

      setPageVisible(isVisible);

      if (!isVisible) {
        pausePendingTransition();
      }
    };

    updateVisibility();

    document.addEventListener("visibilitychange", updateVisibility);

    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, [pausePendingTransition]);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting);

        if (!entry.isIntersecting) {
          pausePendingTransition();
        }
      },
      { threshold: 0 },
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, [pausePendingTransition]);

  useEffect(() => {
    if (
      !runtimePreferences.ready ||
      runtimePreferences.reducedMotion ||
      runtimePreferences.saveData
    ) {
      return;
    }

    let cancelled = false;
    let preloader = null;

    const candidateIndices = Array.from(
      { length: HERO_IMAGES.length - 1 },
      (_, offset) => (currentIndex + offset + 1) % HERO_IMAGES.length,
    ).filter((index) => !failedImagesRef.current.has(index));

    const warmNextImage = async () => {
      for (const candidateIndex of candidateIndices) {
        try {
          await new Promise((resolve, reject) => {
            const image = new window.Image();

            preloader = image;
            image.decoding = "async";
            image.sizes = "100vw";
            image.srcset = getHeroSrcSet(HERO_IMAGES[candidateIndex].src);

            image.onload = async () => {
              try {
                await image.decode();
              } catch {
                // Completed load remains safe to display.
              }

              resolve();
            };

            image.onerror = reject;

            image.src = getImageKitUrl(
              HERO_IMAGES[candidateIndex].src,
              getPreloadWidth(),
            );
          });

          if (!cancelled) {
            setNextReadyIndex(candidateIndex);
          }

          return;
        } catch {
          failedImagesRef.current.add(candidateIndex);
        }
      }

      if (!cancelled) {
        setNextReadyIndex(null);
      }
    };

    warmNextImage();

    return () => {
      cancelled = true;

      if (preloader) {
        preloader.onload = null;
        preloader.onerror = null;
      }
    };
  }, [
    currentIndex,
    preloadVersion,
    runtimePreferences.ready,
    runtimePreferences.reducedMotion,
    runtimePreferences.saveData,
  ]);

  useEffect(() => {
    if (canRotate && !wasRotatingRef.current) {
      lastShownAtRef.current = Date.now();
    }

    wasRotatingRef.current = canRotate;
  }, [canRotate]);

  useEffect(() => {
    if (
      !canRotate ||
      nextReadyIndex === null ||
      nextReadyIndex === currentIndex ||
      incomingIndex !== null
    ) {
      return;
    }

    const elapsed = Date.now() - lastShownAtRef.current;
    const delay = Math.max(0, ROTATION_INTERVAL_MS - elapsed);

    const timer = window.setTimeout(() => {
      setIncomingIndex(nextReadyIndex);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [canRotate, currentIndex, incomingIndex, nextReadyIndex]);

  useEffect(() => {
    if (!isCrossfading || incomingIndex === null) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex(incomingIndex);
      setIncomingIndex(null);
      setIsCrossfading(false);
      lastShownAtRef.current = Date.now();
    }, CROSSFADE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [incomingIndex, isCrossfading]);

  useEffect(
    () => () => {
      if (fadeFrameRef.current !== null) {
        window.cancelAnimationFrame(fadeFrameRef.current);
      }
    },
    [],
  );

  const startCrossfade = () => {
    if (!canRotate || incomingIndex === null) return;

    fadeFrameRef.current = window.requestAnimationFrame(() => {
      fadeFrameRef.current = null;
      setIsCrossfading(true);
    });
  };

  const handleIncomingError = () => {
    if (incomingIndex !== null) {
      failedImagesRef.current.add(incomingIndex);
    }

    setIncomingIndex(null);
    setIsCrossfading(false);
    setNextReadyIndex(null);
    setPreloadVersion((version) => version + 1);
    lastShownAtRef.current = Date.now();
  };

  const currentImage = HERO_IMAGES[currentIndex];
  const incomingImage =
    incomingIndex !== null ? HERO_IMAGES[incomingIndex] : null;

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
        style={{
          "--hero-crossfade-duration": `${CROSSFADE_DURATION_MS}ms`,
        }}
      >
        <img
          className="hero__image hero__image--current absolute inset-0 h-full w-full object-cover [object-position:var(--hero-object-mobile)] will-change-transform lg:[object-position:var(--hero-object-desktop)]"
          style={{
            "--hero-object-mobile": currentImage.mobilePosition,
            "--hero-object-desktop": currentImage.desktopPosition,
          }}
          src={getImageKitUrl(currentImage.src, HERO_FALLBACK_WIDTH)}
          srcSet={getHeroSrcSet(currentImage.src)}
          sizes="100vw"
          alt=""
          loading="eager"
          fetchPriority={currentIndex === 0 ? "high" : "auto"}
          decoding="async"
          draggable="false"
        />

        {incomingImage ? (
          <img
            className={`hero__image hero__image--incoming absolute inset-0 h-full w-full object-cover [object-position:var(--hero-object-mobile)] will-change-[opacity] [transition:opacity_var(--hero-crossfade-duration,900ms)_cubic-bezier(0.22,1,0.36,1)] lg:[object-position:var(--hero-object-desktop)] ${
              isCrossfading ? "is-visible opacity-100" : "opacity-0"
            }`}
            style={{
              "--hero-object-mobile": incomingImage.mobilePosition,
              "--hero-object-desktop": incomingImage.desktopPosition,
            }}
            src={getImageKitUrl(incomingImage.src, HERO_FALLBACK_WIDTH)}
            srcSet={getHeroSrcSet(incomingImage.src)}
            sizes="100vw"
            alt=""
            loading="eager"
            fetchPriority="auto"
            decoding="async"
            draggable="false"
            onLoad={startCrossfade}
            onError={handleIncomingError}
          />
        ) : null}
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
              <span className="gsap-text-clip">
                <span className="hero-title-line--mobile block">
                  Build Your Dream
                </span>
              </span>

              <span className="gsap-text-clip">
                <span className="hero-title-line--mobile block">
                  Wellness Setup with
                </span>
              </span>

              <span className="gsap-text-clip [--gsap-text-clip-offset:0.16em]">
                <span className="hero-title-line--mobile block font-medium">
                  Ikigai Wellness
                </span>
              </span>
            </span>

            {/* ================= DESKTOP TITLE ================= */}
            <span className="hidden lg:block">
              <span className="gsap-text-clip">
                <span className="hero-title-line--desktop block">
                  Build Your Dream
                </span>
              </span>

              <span className="gsap-text-clip">
                <span className="hero-title-line--desktop block">
                  Wellness Setup with
                </span>
              </span>

              <span className="gsap-text-clip [--gsap-text-clip-offset:0.1em]">
                <span className="hero-title-line--desktop block font-medium">
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
