"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

const IMAGEKIT_WIDTHS = [640, 960, 1280, 1600, 1920, 2560];
const IMAGEKIT_QUALITY = 80;
const HERO_FALLBACK_WIDTH = 1280;

// Provisional until the authored timing is verified.
const ROTATION_INTERVAL_MS = 5000;
const CROSSFADE_DURATION_MS = 900;

const HERO_IMAGES = [
  "https://ik.imagekit.io/ikigaiwellness/ikigai/home/0566_ad48168e4a93f9aaf727711ea2ff3d488019b1cc.png",
  "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-25_17-51-48.png",
  "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-25_17-52-30.png",
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

    if (isCrossfading) setCurrentIndex(incomingIndex);
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

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
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
      if (!isVisible) pausePendingTransition();
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, [pausePendingTransition]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      setHeroVisible(entry.isIntersecting);
      if (!entry.isIntersecting) pausePendingTransition();
    }, { threshold: 0 });

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
            image.srcset = getHeroSrcSet(HERO_IMAGES[candidateIndex]);
            image.onload = async () => {
              try {
                await image.decode();
              } catch {
                // A completed load is still safe to display when decode is absent.
              }
              resolve();
            };
            image.onerror = reject;
            image.src = getImageKitUrl(
              HERO_IMAGES[candidateIndex],
              getPreloadWidth(),
            );
          });

          if (!cancelled) setNextReadyIndex(candidateIndex);
          return;
        } catch {
          failedImagesRef.current.add(candidateIndex);
        }
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
    const timer = window.setTimeout(
      () => setIncomingIndex(nextReadyIndex),
      delay,
    );

    return () => window.clearTimeout(timer);
  }, [canRotate, currentIndex, incomingIndex, nextReadyIndex]);

  useEffect(() => {
    if (!isCrossfading || incomingIndex === null) return;

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
    if (!canRotate) return;

    fadeFrameRef.current = window.requestAnimationFrame(() => {
      fadeFrameRef.current = null;
      setIsCrossfading(true);
    });
  };

  const handleIncomingError = () => {
    if (incomingIndex !== null) failedImagesRef.current.add(incomingIndex);
    setIncomingIndex(null);
    setIsCrossfading(false);
    setNextReadyIndex(null);
    setPreloadVersion((version) => version + 1);
    lastShownAtRef.current = Date.now();
  };

  return (
    <section
      className="hero"
      id="hero"
      ref={heroRef}
      aria-labelledby="hero-title"
    >
      <div
        className="hero__media"
        aria-hidden="true"
        style={{
          "--hero-crossfade-duration": `${CROSSFADE_DURATION_MS}ms`,
        }}
      >
        <img
          className="hero__image"
          src={getImageKitUrl(HERO_IMAGES[currentIndex], HERO_FALLBACK_WIDTH)}
          srcSet={getHeroSrcSet(HERO_IMAGES[currentIndex])}
          sizes="100vw"
          alt=""
          loading="eager"
          fetchPriority={currentIndex === 0 ? "high" : "auto"}
          decoding="async"
        />

        {incomingIndex !== null ? (
          <img
            className={`hero__image hero__image--incoming${
              isCrossfading ? " is-visible" : ""
            }`}
            src={getImageKitUrl(
              HERO_IMAGES[incomingIndex],
              HERO_FALLBACK_WIDTH,
            )}
            srcSet={getHeroSrcSet(HERO_IMAGES[incomingIndex])}
            sizes="100vw"
            alt=""
            loading="eager"
            fetchPriority="auto"
            decoding="async"
            onLoad={startCrossfade}
            onError={handleIncomingError}
          />
        ) : null}
      </div>

      <div className="site-container hero__inner">
        <div className="hero__copy">
          <h1 id="hero-title">
            <span>Build Your Dream Wellness Setup with</span>
            <strong>IKIGAI WELLNESS</strong>
          </h1>

          <p className="hero__intro">
            Premium saunas, ice baths and complete wellness spaces designed,
            built, installed and maintained by our team across Indonesia.
          </p>
        </div>

        <ul className="hero__proofs" aria-label="IKIGAI service commitments">
          {proofItems.map((item) => (
            <li key={item}>
              <Check aria-hidden="true" size={13} strokeWidth={1.8} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <a
          className="pill-button pill-button--light hero__cta"
          href="#consultation"
        >
          Book a free consultation
        </a>
      </div>
    </section>
  );
}
