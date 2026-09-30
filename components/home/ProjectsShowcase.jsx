"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ImageLightbox, {
  useImageLightbox,
} from "../ui/ImageLightbox";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";
import { cloudinaryAssetUrl } from "@/lib/cloudinary";

/* eslint-disable @next/next/no-img-element */

const PROJECT_IMAGE_WIDTHS = [480, 640, 960, 1280];
const PROJECT_LIGHTBOX_IMAGE_WIDTH = 1600;

function getCloudinaryUrl(src) {
  return src;
}

function getCloudinarySrcSet(src) {
  return PROJECT_IMAGE_WIDTHS.map(
    (width) => `${getCloudinaryUrl(src, width)} ${width}w`,
  ).join(", ");
}

export default function ProjectsShowcase({ content }) {
  const sectionRef = useRef(null);
  const imageLightbox = useImageLightbox();
  const projects = (content?.projects || []).map((project) => ({
    ...project,
    src: cloudinaryAssetUrl(project.image),
    alt: project.imageAlt || "",
    objectPosition: "center center",
  }));
  const projectLightboxImages = projects.map((project) => ({
    src: getCloudinaryUrl(project.src, PROJECT_LIGHTBOX_IMAGE_WIDTH),
    alt: project.alt,
  }));

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
                "--ikigai-mask-progress": "0%",
                "--ikigai-mask-feather": values.headingFeather,
              },
              {
                "--ikigai-mask-progress": "140%",
                duration: values.headingDuration,
                ease: "sine.inOut",
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
                duration: values.copyDuration,
                ease: "sine.out",
              },
              0.18,
            );

          return () => timeline.kill();
        });
      };

      addIntro(MOTION_MEDIA.desktop, {
        headingDuration: 0.86,
        headingFeather: "22%",
        copyY: 3,
        copyDuration: 0.46,
        start: "top 78%",
      });

      addIntro(MOTION_MEDIA.tablet, {
        headingDuration: 0.82,
        headingFeather: "21%",
        copyY: 3,
        copyDuration: 0.45,
        start: "top 80%",
      });

      addIntro(MOTION_MEDIA.mobile, {
        headingDuration: 0.78,
        headingFeather: "20%",
        copyY: 2,
        copyDuration: 0.44,
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
          className="projects__heading ikigai-alpha-mask m-0 max-w-[15ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em]"
        >
          {content?.heading || ""}
        </h2>

        <p className="projects__intro m-0 max-w-[34rem] text-[length:var(--type-section-intro-standard)] leading-[1.65] text-[var(--ink-soft)] md:max-w-[38rem] md:justify-self-end">
          {content?.intro || ""}
        </p>
      </div>

      <div className="projects__slider">
        <div
          ref={emblaRef}
          className="projects__viewport cursor-grab overflow-hidden active:cursor-grabbing"
        >
          <div className="projects__track flex pl-[var(--page-offset)] pr-[var(--page-gutter)] [touch-action:pan-y_pinch-zoom]">
            {projects.map((project, index) => (
              <div
                key={project._key}
                className="projects__slide min-w-0 flex-[0_0_78%] pr-3 md:basis-[clamp(12rem,13.75vw,17rem)] md:pr-[clamp(0.55rem,0.7vw,0.85rem)]"
              >
                <div className="project-card relative">
                  <button
                    type="button"
                    aria-label={`View project ${index + 1} image`}
                    onPointerDown={imageLightbox.handlePointerDown}
                    onPointerMove={imageLightbox.handlePointerMove}
                    onPointerUp={imageLightbox.handlePointerEnd}
                    onPointerCancel={imageLightbox.handlePointerCancel}
                    onClick={(event) =>
                      imageLightbox.openImage(index, event)
                    }
                    className="project-card__media block aspect-[9/16] w-full cursor-zoom-in overflow-hidden border-0 bg-[var(--placeholder-light)] p-0 text-left focus-visible:-outline-offset-2 focus-visible:outline-white"
                  >
                    <img
                      className="project-card__image block h-full w-full object-cover"
                      src={getCloudinaryUrl(
                        project.src,
                        PROJECT_IMAGE_WIDTHS[1],
                      )}
                      srcSet={getCloudinarySrcSet(project.src)}
                      sizes="(min-width: 48rem) 14vw, 78vw"
                      alt={project.alt}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      style={{
                        objectPosition: project.objectPosition,
                      }}
                    />
                  </button>
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

      {imageLightbox.activeIndex !== null && (
        <ImageLightbox
          activeIndex={imageLightbox.activeIndex}
          images={projectLightboxImages}
          label="Project image viewer"
          onClose={imageLightbox.closeImage}
          onIndexChange={imageLightbox.setActiveIndex}
          returnFocusRef={imageLightbox.openerRef}
        />
      )}
    </section>
  );
}
