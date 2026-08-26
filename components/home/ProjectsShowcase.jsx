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

  return (
    <section className="projects light-section" id="projects" aria-labelledby="projects-title">
      <div className="site-container projects__header">
        <h2 id="projects-title">Wellness Spaces We’ve Built</h2>
        <p>
          From private villas to commercial wellness facilities: spaces
          designed around their environment and requirements.
        </p>
      </div>

      <div className="projects__slider">
        <div className="projects__viewport" ref={emblaRef}>
          <div className="projects__track">
            {projects.map((project) => (
              <div className="projects__slide" key={project.id}>
                <article className="project-card">
                  <div className="project-card__media">
                    <img
                      className="project-card__image"
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

        <div className="projects__controls site-container">
          <button
            className="round-control"
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous project"
          >
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
          <button
            className="round-control"
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next project"
          >
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="site-container">
        <a className="pill-button pill-button--dark projects__cta" href="#consultation">
          Book a free consultation
        </a>
      </div>
    </section>
  );
}
