"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { WHATSAPP_CTA_URL } from "@/lib/contact-config";
import { cloudinaryAssetUrl } from "@/lib/cloudinary";
import ImageLightbox, {
  useImageLightbox,
} from "../ui/ImageLightbox";
import { gsap, MOTION_MEDIA, useGSAP } from "./HomeMotion";

const PRODUCT_IMAGE_WIDTHS = [640, 960, 1280, 1600];
function getCloudinaryUrl(src) {
  return src;
}

function getCloudinarySrcSet(src) {
  return PRODUCT_IMAGE_WIDTHS.map(
    (width) => `${getCloudinaryUrl(src, width)} ${width}w`,
  ).join(", ");
}

export default function ProductShowcase({ content }) {
  const sectionRef = useRef(null);
  const imageLightbox = useImageLightbox();
  const products = (content?.products || []).map((product) => ({
    ...product,
    src: cloudinaryAssetUrl(product.image),
    objectPosition: "center center",
  }));
  const productLightboxImages = products.map((product) => ({
    src: getCloudinaryUrl(
      product.src,
      PRODUCT_IMAGE_WIDTHS[PRODUCT_IMAGE_WIDTHS.length - 1],
    ),
    alt: product.imageAlt || "",
  }));

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
    skipSnaps: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (
        !section ||
        navigator.connection?.saveData === true ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const eyebrow = section.querySelector(".products__eyebrow");
      const heading = section.querySelector(".products__heading");
      const intro = section.querySelector(".products__intro");
      const header = section.querySelector(".products__header");

      if (!eyebrow || !heading || !intro || !header) return;

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
              eyebrow,
              {
                autoAlpha: 0,
                y: values.eyebrowY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: values.eyebrowDuration,
                ease: "sine.out",
              },
            )
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
              0.08,
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
              0.54,
            );

          return () => timeline.kill();
        });
      };

      addIntro(MOTION_MEDIA.desktop, {
        eyebrowY: 2,
        eyebrowDuration: 0.38,
        headingDuration: 0.9,
        headingFeather: "24%",
        copyY: 3,
        copyDuration: 0.46,
        start: "top 78%",
      });

      addIntro(MOTION_MEDIA.tablet, {
        eyebrowY: 2,
        eyebrowDuration: 0.38,
        headingDuration: 0.86,
        headingFeather: "23%",
        copyY: 3,
        copyDuration: 0.46,
        start: "top 80%",
      });

      addIntro(MOTION_MEDIA.mobile, {
        eyebrowY: 2,
        eyebrowDuration: 0.38,
        headingDuration: 0.82,
        headingFeather: "22%",
        copyY: 3,
        copyDuration: 0.46,
        start: "top 84%",
      });

      return () => mediaQueries.revert();
    },
    { scope: sectionRef },
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

  useEffect(() => {
    if (!emblaApi) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const connection = navigator.connection;

    let saveData = connection?.saveData === true;
    let mediaNodes = [];
    let animationFrame = null;

    const collectMedia = () => {
      mediaNodes = emblaApi
        .slideNodes()
        .map((slide) => slide.querySelector(".product-card__media-motion"));
    };

    const resetMedia = () => {
      mediaNodes.forEach((media) => {
        if (media) {
          media.style.transform = "";
        }
      });
    };

    const updateMedia = () => {
      animationFrame = null;
      saveData = connection?.saveData === true;

      if (reduceMotion.matches || saveData) {
        resetMedia();
        return;
      }

      const scrollProgress = emblaApi.scrollProgress();
      const scrollSnaps = emblaApi.scrollSnapList();
      const { slideRegistry } = emblaApi.internalEngine();

      if (scrollSnaps.length <= 1) {
        resetMedia();
        return;
      }

      mediaNodes.forEach((media) => {
        if (media) {
          media.style.transform = "translate3d(0, 0, 0) scale(1)";
        }
      });

      scrollSnaps.forEach((snap, snapIndex) => {
        const previousSnap = scrollSnaps[snapIndex - 1];
        const nextSnap = scrollSnaps[snapIndex + 1];

        const previousGap = Number.isFinite(previousSnap)
          ? Math.abs(snap - previousSnap)
          : 0;

        const nextGap = Number.isFinite(nextSnap)
          ? Math.abs(nextSnap - snap)
          : 0;

        const snapDistance = Math.max(
          previousGap,
          nextGap,
          0.0001,
        );

        const difference = snap - scrollProgress;

        const proximity =
          1 - Math.min(Math.abs(difference) / snapDistance, 1);

        const scale = 1 + proximity * 0.02;

        const translateX = Math.max(
          -3,
          Math.min(3, -difference * 14),
        );

        slideRegistry[snapIndex]?.forEach((slideIndex) => {
          const media = mediaNodes[slideIndex];

          if (media) {
            media.style.transform = `translate3d(${translateX.toFixed(
              2,
            )}px, 0, 0) scale(${scale.toFixed(4)})`;
          }
        });
      });
    };

    const scheduleMediaUpdate = () => {
      if (animationFrame !== null) return;

      animationFrame = requestAnimationFrame(updateMedia);
    };

    const handleReInit = () => {
      collectMedia();
      scheduleMediaUpdate();
    };

    const handlePreferenceChange = () => {
      scheduleMediaUpdate();
    };

    collectMedia();
    scheduleMediaUpdate();

    emblaApi.on("scroll", scheduleMediaUpdate);
    emblaApi.on("select", scheduleMediaUpdate);
    emblaApi.on("reInit", handleReInit);

    reduceMotion.addEventListener?.("change", handlePreferenceChange);
    connection?.addEventListener?.("change", handlePreferenceChange);

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      emblaApi.off("scroll", scheduleMediaUpdate);
      emblaApi.off("select", scheduleMediaUpdate);
      emblaApi.off("reInit", handleReInit);

      reduceMotion.removeEventListener?.(
        "change",
        handlePreferenceChange,
      );
      connection?.removeEventListener?.(
        "change",
        handlePreferenceChange,
      );

      resetMedia();
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      id="products"
      aria-labelledby="products-title"
      className="products overflow-hidden bg-[var(--paper-strong)] pt-[4.5rem] pb-[5rem] md:py-[clamp(6rem,7vw,8rem)]"
    >
      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)]">
        <header className="products__header mb-[2.5rem] grid gap-3 md:mb-[clamp(3.25rem,4vw,4.75rem)] md:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)] md:grid-rows-[auto_auto] md:gap-x-[clamp(3rem,6vw,7rem)] md:gap-y-3">
          <p className="eyebrow products__eyebrow m-0 font-display text-[0.66rem] font-semibold leading-[1.2] tracking-[0.18em] uppercase md:col-start-1 md:row-start-1">
            {content?.eyebrow || ""}
          </p>

          <h2
            id="products-title"
            className="products__heading gsap-text-clip ikigai-alpha-mask max-w-[18ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em] md:col-start-1 md:row-start-2"
          >
            {content?.heading || ""}
          </h2>

          <p className="products__intro m-0 mt-[0.4rem] max-w-[31rem] text-[length:var(--type-section-intro-prominent)] leading-[1.65] text-[var(--ink-soft)] md:col-start-2 md:row-start-2 md:mt-0 md:self-end md:justify-self-end md:leading-[1.6]">
            {content?.intro || ""}
          </p>
        </header>

        <div className="products__slider relative [--product-card-width:88vw] md:[--product-card-width:clamp(22rem,26vw,31rem)]">
          <div
            ref={emblaRef}
            className="products__viewport w-[calc(100vw-var(--page-offset))] cursor-grab overflow-hidden active:cursor-grabbing"
            role="region"
            aria-roledescription="carousel"
            aria-label="IKIGAI wellness products"
          >
            <div className="products__track flex items-stretch [touch-action:pan-y_pinch-zoom]">
              {products.map((product, index) => (
                <div
                  key={product._key}
                  className="products__slide min-w-0 flex-[0_0_88%] pr-[0.8rem] md:flex-[0_0_var(--product-card-width)] md:pr-[clamp(0.9rem,1.2vw,1.4rem)]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${products.length}`}
                >
                  <article className="product-card group flex h-full flex-col bg-[var(--paper)]">
                    <button
                      type="button"
                      aria-label={`View ${product.title} image`}
                      onPointerDown={imageLightbox.handlePointerDown}
                      onPointerMove={imageLightbox.handlePointerMove}
                      onPointerUp={imageLightbox.handlePointerEnd}
                      onPointerCancel={imageLightbox.handlePointerCancel}
                      onClick={(event) =>
                        imageLightbox.openImage(index, event)
                      }
                      className="product-card__media block aspect-[6/5] w-full cursor-zoom-in overflow-hidden border-0 bg-[var(--placeholder-light)] p-0 text-left focus-visible:-outline-offset-2 focus-visible:outline-white"
                    >
                      <div className="product-card__media-motion h-full w-full origin-center will-change-transform">
                        <img
                          className="block h-full w-full object-cover"
                          src={getCloudinaryUrl(
                            product.src,
                            PRODUCT_IMAGE_WIDTHS[1],
                          )}
                          srcSet={getCloudinarySrcSet(product.src)}
                          sizes="(min-width: 48rem) clamp(22rem, 26vw, 31rem), 88vw"
                          alt={product.imageAlt || ""}
                          loading="lazy"
                          decoding="async"
                          draggable="false"
                          style={{
                            objectPosition: product.objectPosition,
                          }}
                        />
                      </div>
                    </button>

                    <div className="product-card__body flex flex-1 flex-col px-4 pt-[1.15rem] pb-[1.4rem] md:px-[1.35rem] md:pt-[1.4rem] md:pb-[1.55rem]">
                      <h3 className="m-0 font-display text-[1.25rem] font-medium leading-[1.13] tracking-[-0.028em] md:text-[1.5rem] xl:text-[1.6rem]">
                        {product.title}
                      </h3>

                      <p className="mt-[0.7rem] mb-0 text-[length:var(--type-reading-body)] leading-[1.58] text-[var(--ink-soft)] md:leading-[1.6]">
                        {product.description}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="products__controls pointer-events-none absolute top-[calc(var(--product-card-width)*0.416667)] z-[4] hidden w-full -translate-y-1/2 justify-between md:left-[-1.5rem] md:flex md:w-[calc(100%+1.5rem+calc(var(--page-gutter)*0.4))]">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous product"
              className={`products__control round-control pointer-events-auto shadow-[0_4px_18px_rgba(0,0,0,0.06)] transition-[opacity,transform] duration-200 ${
                canScrollPrev
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <ArrowLeft
                aria-hidden="true"
                size={18}
                strokeWidth={1.5}
              />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next product"
              className={`products__control round-control pointer-events-auto shadow-[0_4px_18px_rgba(0,0,0,0.06)] transition-[opacity,transform] duration-200 ${
                canScrollNext
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <ArrowRight
                aria-hidden="true"
                size={18}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        <aside
          aria-labelledby="products-consultation-title"
          className="products__consultation dark-surface dark-surface--inset mt-[3.25rem] grid gap-[1.4rem] bg-[var(--night)] px-[1.3rem] py-[1.5rem] text-white md:mt-[clamp(3.75rem,4.5vw,5rem)] md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-[clamp(3rem,7vw,8rem)] md:px-[clamp(2.25rem,3vw,3.25rem)] md:py-[clamp(1.9rem,2.3vw,2.5rem)]"
        >
          <div>
            <h3
              id="products-consultation-title"
              className="m-0 max-w-[20ch] font-display text-[clamp(1.55rem,6vw,1.9rem)] font-medium leading-[1.06] tracking-[-0.036em] md:text-[clamp(2rem,2.3vw,2.7rem)]"
            >
              {content?.consultationHeading || ""}
            </h3>

            <p className="mt-[0.8rem] mb-0 max-w-[34rem] text-[0.8rem] leading-[1.62] text-white/[0.66] md:text-[0.86rem]">
              {content?.consultationBody || ""}
            </p>
          </div>

          <a
            href={WHATSAPP_CTA_URL}
            className="pill-button pill-button--standard pill-button--light inline-flex w-fit flex-none"
          >
            {content?.consultationCtaLabel || ""}
          </a>
        </aside>
      </div>

      {imageLightbox.activeIndex !== null && (
        <ImageLightbox
          activeIndex={imageLightbox.activeIndex}
          images={productLightboxImages}
          label="Product image viewer"
          onClose={imageLightbox.closeImage}
          onIndexChange={imageLightbox.setActiveIndex}
          returnFocusRef={imageLightbox.openerRef}
        />
      )}
    </section>
  );
}
