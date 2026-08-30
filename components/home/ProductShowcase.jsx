"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ImageLightbox, {
  useImageLightbox,
} from "../ui/ImageLightbox";
import { gsap, MOTION_MEDIA, useGSAP } from "./HomeMotion";

const PRODUCT_IMAGE_WIDTHS = [640, 960, 1280, 1600];
const PRODUCT_IMAGE_QUALITY = 80;

const products = [
  {
    title: "Classic Ice Bath",
    description:
      "Our classic ice bath is a complete unit. Chiller and filtration inside, no plant room, nothing to plumb in. One footprint, one connection, ready to run.",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-25_23-19-55.png?updatedAt=1787675333277",
    objectPosition: "center center",
  },
  {
    title: "3 Person Saunas",
    description:
      "Bench space for one person to fully lie down, two to sit comfortably, or three together. Compact, without sacrificing the experience of a properly designed sauna.",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/0275_348057fe0d27de6fae3a14e2f8500d6b59108821.jpg?updatedAt=1787675240336",
    objectPosition: "center center",
  },
  {
    title: "Bespoke Ice Bath",
    description:
      "Everything you love about the Classic — made personal. Custom engraving, branding or artwork, for owners who want their ice bath to carry their story.",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/0306_41377ebfdae7bc695f1079fb869aa20bf545561c.jpg?updatedAt=1787675241166",
    objectPosition: "center center",
  },
  {
    title: "6 Person Saunas",
    description:
      "For larger villas, hotels and wellness spaces a sauna that becomes a statement feature, with room for families, guests and groups.",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/0178_0e7909969004bb0b72295d38b7f95ad6008701fb.jpg?updatedAt=1787675241466",
    objectPosition: "center center",
  },
  {
    title: "Custom Saunas",
    description:
      "A specific space, architectural style or vision in mind? We customise dimensions, layout, materials, finishes and technical setup around your property.",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-25_23-26-04.png?updatedAt=1787675351258",
    objectPosition: "center center",
  },
  {
    title: "Custom Ice Bath",
    description:
      "From high volume wellness centres to boutique hotels, we design ice baths around the demand they actually have to handle. Custom chillers, custom filtration, custom baths, built to run all day without water quality or temperature dropping off.",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/home/0036_d44802b6f589894262c3c7434d64cc8452299a41.jpg?updatedAt=1787675240515",
    objectPosition: "center center",
  },
];

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}tr=w-${width},q-${PRODUCT_IMAGE_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return PRODUCT_IMAGE_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

const productLightboxImages = products.map((product) => ({
  src: getImageKitUrl(
    product.src,
    PRODUCT_IMAGE_WIDTHS[PRODUCT_IMAGE_WIDTHS.length - 1],
  ),
  alt: product.title,
}));

export default function ProductShowcase() {
  const sectionRef = useRef(null);
  const imageLightbox = useImageLightbox();

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
            defaults: { ease: "power3.out" },
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
                duration: 0.52,
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
                duration: 0.62,
              },
              0.34,
            );

          return () => timeline.kill();
        });
      };

      addIntro(MOTION_MEDIA.desktop, {
        eyebrowY: 7,
        headingY: 34,
        copyY: 18,
        start: "top 78%",
      });

      addIntro(MOTION_MEDIA.tablet, {
        eyebrowY: 6,
        headingY: 28,
        copyY: 16,
        start: "top 80%",
      });

      addIntro(MOTION_MEDIA.mobile, {
        eyebrowY: 5,
        headingY: 22,
        copyY: 13,
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
            Existing & custom solutions
          </p>

          <h2
            id="products-title"
            className="products__heading gsap-text-clip max-w-[18ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em] md:col-start-1 md:row-start-2"
          >
            Start With One of Our Designs or Create Your Own
          </h2>

          <p className="products__intro m-0 mt-[0.4rem] max-w-[31rem] text-[length:var(--type-section-intro-prominent)] leading-[1.65] text-[var(--ink-soft)] md:col-start-2 md:row-start-2 md:mt-0 md:self-end md:justify-self-end md:leading-[1.6]">
            Whether one of our existing sauna and ice bath designs fits your
            space or your project needs something custom, our team will help
            you create the right setup.
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
                  key={product.title}
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
                          src={getImageKitUrl(
                            product.src,
                            PRODUCT_IMAGE_WIDTHS[1],
                          )}
                          srcSet={getImageKitSrcSet(product.src)}
                          sizes="(min-width: 48rem) clamp(22rem, 26vw, 31rem), 88vw"
                          alt={product.title}
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
              Not sure what works best for your space?
            </h3>

            <p className="mt-[0.8rem] mb-0 max-w-[34rem] text-[0.8rem] leading-[1.62] text-white/[0.66] md:text-[0.86rem]">
              You don&apos;t need to know exactly what you need. Tell us about
              your property and we&apos;ll explain what&apos;s possible.
            </p>
          </div>

          <a
            href="#consultation"
            className="pill-button pill-button--standard pill-button--light inline-flex w-fit flex-none"
          >
            Book a free consultation
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
