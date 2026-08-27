"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* eslint-disable @next/next/no-img-element */

const PROJECT_IMAGE_WIDTHS = [480, 640, 960, 1280];
const PROJECT_IMAGE_QUALITY = 80;

const projects = [
  {
    id: 1,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_12-00-12.png",
    alt: "IKIGAI Wellness project 1",
    objectPosition: "center center",
  },
  {
    id: 2,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-59-43.png",
    alt: "IKIGAI Wellness project 2",
    objectPosition: "center center",
  },
  {
    id: 3,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-58-47.png",
    alt: "IKIGAI Wellness project 3",
    objectPosition: "center center",
  },
  {
    id: 4,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_12-00-20.png",
    alt: "IKIGAI Wellness project 4",
    objectPosition: "center center",
  },
  {
    id: 5,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_12-00-02.png",
    alt: "IKIGAI Wellness project 5",
    objectPosition: "center center",
  },
  {
    id: 6,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-59-30.png",
    alt: "IKIGAI Wellness project 6",
    objectPosition: "center center",
  },
  {
    id: 7,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-59-17.png",
    alt: "IKIGAI Wellness project 7",
    objectPosition: "center center",
  },
  {
    id: 8,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-58-32.png",
    alt: "IKIGAI Wellness project 8",
    objectPosition: "center center",
  },
  {
    id: 9,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-58-55.png",
    alt: "IKIGAI Wellness project 9",
    objectPosition: "center center",
  },
  {
    id: 10,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-59-02.png",
    alt: "IKIGAI Wellness project 10",
    objectPosition: "center center",
  },
];

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}tr=w-${width},q-${PROJECT_IMAGE_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return PROJECT_IMAGE_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

export default function ProjectsShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateControls = useCallback((api) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const frame = requestAnimationFrame(() => updateControls(emblaApi));
    emblaApi.on("select", updateControls);
    emblaApi.on("reInit", updateControls);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", updateControls);
      emblaApi.off("reInit", updateControls);
    };
  }, [emblaApi, updateControls]);

  useEffect(() => {
    if (!emblaApi) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const saveData = navigator.connection?.saveData === true;
    let mediaNodes = [];

    const collectMedia = () => {
      mediaNodes = emblaApi
        .slideNodes()
        .map((slide) => slide.querySelector(".project-card__image"));
    };

    const resetMedia = () => {
      mediaNodes.forEach((media) => {
        if (media) media.style.transform = "";
      });
    };

    const updateMedia = () => {
      if (reduceMotion.matches || saveData) {
        resetMedia();
        return;
      }

      const scrollProgress = emblaApi.scrollProgress();
      const scrollSnaps = emblaApi.scrollSnapList();
      const { slideRegistry } = emblaApi.internalEngine();

      mediaNodes.forEach((media) => {
        if (media) media.style.transform = "translate3d(0, 0, 0) scale(1)";
      });

      scrollSnaps.forEach((snap, snapIndex) => {
        const previousGap = Math.abs(snap - scrollSnaps[snapIndex - 1]);
        const nextGap = Math.abs(scrollSnaps[snapIndex + 1] - snap);
        const snapDistance = Math.max(
          0.0001,
          Number.isFinite(previousGap) ? previousGap : nextGap,
          Number.isFinite(nextGap) ? nextGap : previousGap,
        );
        const difference = snap - scrollProgress;
        const proximity = 1 - Math.min(Math.abs(difference) / snapDistance, 1);
        const scale = 1 + proximity * 0.04;
        const translateX = Math.max(-3, Math.min(3, difference * 10));

        slideRegistry[snapIndex]?.forEach((slideIndex) => {
          const media = mediaNodes[slideIndex];

          if (media) {
            media.style.transform = `translate3d(${translateX}px, 0, 0) scale(${scale})`;
          }
        });
      });
    };

    const handleReInit = () => {
      collectMedia();
      updateMedia();
    };

    collectMedia();
    const frame = requestAnimationFrame(updateMedia);

    emblaApi.on("scroll", updateMedia);
    emblaApi.on("select", updateMedia);
    emblaApi.on("reInit", handleReInit);
    reduceMotion.addEventListener?.("change", updateMedia);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("scroll", updateMedia);
      emblaApi.off("select", updateMedia);
      emblaApi.off("reInit", handleReInit);
      reduceMotion.removeEventListener?.("change", updateMedia);
      resetMedia();
    };
  }, [emblaApi]);

  return (
    <section className="projects light-section overflow-hidden bg-[var(--paper-strong)] py-20 text-[var(--ink)] md:py-[clamp(4.75rem,5.5vw,6.75rem)]" id="projects" aria-labelledby="projects-title">
      <div className="site-container projects__header mx-auto mb-9 grid w-full max-w-[105rem] gap-4 px-[var(--page-gutter)] md:mb-[clamp(2.5rem,3vw,4rem)] md:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)] md:items-end md:gap-16">
        <h2 className="m-0 font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em]" id="projects-title">Wellness Spaces We’ve Built</h2>
        <p className="m-0 text-[0.78rem] leading-[1.65] text-[var(--ink-soft)] md:max-w-[38rem] md:justify-self-end md:text-[0.84rem]">
          From private villas to commercial wellness facilities: spaces
          designed around their environment and requirements.
        </p>
      </div>

      <div className="projects__slider">
        <div className="projects__viewport cursor-grab overflow-hidden active:cursor-grabbing" ref={emblaRef}>
          <div className="projects__track flex pl-[var(--page-offset)] [touch-action:pan-y_pinch-zoom]">
            {projects.map((project) => (
              <div className="projects__slide min-w-0 flex-[0_0_78%] pr-3 md:basis-[clamp(10rem,11.5vw,14.5rem)] md:pr-[clamp(0.55rem,0.7vw,0.85rem)]" key={project.id}>
                <article className="project-card relative">
                  <div className="project-card__media aspect-[3/4] overflow-hidden bg-[var(--placeholder-light)] md:aspect-[9/14]">
                    <img
                      className="project-card__image block h-full w-full object-cover"
                      src={getImageKitUrl(project.src, PROJECT_IMAGE_WIDTHS[1])}
                      srcSet={getImageKitSrcSet(project.src)}
                      sizes="(min-width: 48rem) 12vw, 78vw"
                      alt={project.alt}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      style={{ objectPosition: project.objectPosition }}
                    />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="projects__controls site-container mx-auto mt-[1.35rem] flex w-full max-w-[105rem] justify-between px-[var(--page-gutter)] md:justify-end md:gap-3">
          <button
            className="round-control grid aspect-square w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper-strong)] text-[var(--ink)] transition-[opacity,background-color,color] duration-150 enabled:hover:bg-[var(--ink)] enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:w-[2.8rem]"
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous project"
          >
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
          <button
            className="round-control grid aspect-square w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper-strong)] text-[var(--ink)] transition-[opacity,background-color,color] duration-150 enabled:hover:bg-[var(--ink)] enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:w-[2.8rem]"
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next project"
          >
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)]">
        <a className="pill-button pill-button--dark projects__cta mx-auto mt-9 flex min-h-[3.15rem] w-fit items-center justify-center rounded-[var(--pill)] border border-transparent bg-[var(--ink)] px-[1.4rem] py-[0.9rem] text-center font-display text-[0.68rem] font-semibold leading-none tracking-[0.07em] text-white uppercase transition-[background-color,color,border-color] duration-[160ms] hover:border-[var(--ink)] hover:bg-transparent hover:text-[var(--ink)]" href="#consultation">
          Book a free consultation
        </a>
      </div>
    </section>
  );
}
