"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";

/* eslint-disable @next/next/no-img-element */

const PROJECT_IMAGE_WIDTHS = [480, 640, 960, 1280];
const PROJECT_IMAGE_QUALITY = 80;

const projects = [
  {
    id: 1,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_12-00-12.png",
    alt: "",
    objectPosition: "center center",
  },
  {
    id: 2,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-59-43.png",
    alt: "",
    objectPosition: "center center",
  },
  {
    id: 3,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-58-47.png",
    alt: "",
    objectPosition: "center center",
  },
  {
    id: 4,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_12-00-20.png",
    alt: "",
    objectPosition: "center center",
  },
  {
    id: 5,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_12-00-02.png",
    alt: "",
    objectPosition: "center center",
  },
  {
    id: 6,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-59-30.png",
    alt: "",
    objectPosition: "center center",
  },
  {
    id: 7,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-59-17.png",
    alt: "",
    objectPosition: "center center",
  },
  {
    id: 8,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-58-32.png",
    alt: "",
    objectPosition: "center center",
  },
  {
    id: 9,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-58-55.png",
    alt: "",
    objectPosition: "center center",
  },
  {
    id: 10,
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-59-02.png",
    alt: "",
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
  const sectionRef = useRef(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

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

      const header = section.querySelector(".projects__header");
      const heading = section.querySelector(".projects__heading");
      const intro = section.querySelector(".projects__intro");

      if (!header || !heading || !intro) return;

      const mediaQueries = gsap.matchMedia();

      const addIntro = (query, values) => {
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
                duration: 0.76,
              },
              0,
            )
            .fromTo(
              intro,
              {
                autoAlpha: 0,
                y: values.copyY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.56,
              },
              0.18,
            );

          return () => timeline.kill();
        });
      };

      addIntro(MOTION_MEDIA.desktop, {
        headingY: 28,
        copyY: 8,
        start: "top 78%",
      });

      addIntro(MOTION_MEDIA.tablet, {
        headingY: 22,
        copyY: 6,
        start: "top 80%",
      });

      addIntro(MOTION_MEDIA.mobile, {
        headingY: 17,
        copyY: 5,
        start: "top 84%",
      });

      return () => mediaQueries.revert();
    },
    {
      scope: sectionRef,
    },
  );

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

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-title"
      className="projects light-section overflow-hidden bg-[var(--paper-strong)] py-20 text-[var(--ink)] md:py-[clamp(4.75rem,5.5vw,6.75rem)]"
    >
      <div className="site-container projects__header mx-auto mb-9 grid w-full max-w-[105rem] gap-4 px-[var(--page-gutter)] md:mb-[clamp(2.5rem,3vw,4rem)] md:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)] md:items-end md:gap-16">
        <h2
          id="projects-title"
          className="projects__heading m-0 max-w-[15ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em]"
        >
          Wellness Spaces We’ve Built
        </h2>

        <p className="projects__intro m-0 max-w-[34rem] text-[0.82rem] leading-[1.65] text-[var(--ink-soft)] md:max-w-[38rem] md:justify-self-end md:text-[0.9rem]">
          From private villas to commercial wellness facilities: spaces
          designed around their environment and requirements.
        </p>
      </div>

      <div className="projects__slider">
        <div
          ref={emblaRef}
          className="projects__viewport cursor-grab overflow-hidden active:cursor-grabbing"
        >
          <div className="projects__track flex pl-[var(--page-offset)] pr-[var(--page-gutter)] [touch-action:pan-y_pinch-zoom]">
            {projects.map((project) => (
              <div
                key={project.id}
                className="projects__slide min-w-0 flex-[0_0_78%] pr-3 md:basis-[clamp(12rem,13.75vw,17rem)] md:pr-[clamp(0.55rem,0.7vw,0.85rem)]"
              >
                <div className="project-card relative">
                  <div className="project-card__media aspect-[9/16] overflow-hidden bg-[var(--placeholder-light)]">
                    <img
                      className="project-card__image block h-full w-full object-cover"
                      src={getImageKitUrl(
                        project.src,
                        PROJECT_IMAGE_WIDTHS[1],
                      )}
                      srcSet={getImageKitSrcSet(project.src)}
                      sizes="(min-width: 48rem) 14vw, 78vw"
                      alt={project.alt}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      style={{
                        objectPosition: project.objectPosition,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="projects__controls site-container mx-auto mt-[1.35rem] hidden w-full max-w-[105rem] justify-end gap-2 px-[var(--page-gutter)] md:flex md:gap-3">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous project"
            className="round-control disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next project"
            className="round-control disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}