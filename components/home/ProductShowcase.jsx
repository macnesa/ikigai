"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

export default function ProductShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
    skipSnaps: false,
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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="products overflow-hidden bg-[var(--paper-strong)] pt-[4.5rem] pb-[5rem] md:py-[clamp(6rem,7vw,8rem)]"
    >
      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)]">
        <header className="products__header mb-[2.25rem] grid gap-3 md:mb-[clamp(3rem,3.8vw,4.5rem)] md:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)] md:grid-rows-[auto_auto] md:gap-x-16 md:gap-y-3">
          <p className="eyebrow m-0 font-display text-[0.66rem] font-semibold leading-[1.2] tracking-[0.18em] uppercase md:col-start-1 md:row-start-1">
            Existing & custom solutions
          </p>

          <h2
            id="products-title"
            className="m-0 max-w-[18ch] font-display text-[clamp(2rem,8.4vw,2.8rem)] font-[450] leading-[1.02] tracking-[-0.042em] md:col-start-1 md:row-start-2 md:text-[clamp(3.2rem,3.8vw,4.5rem)]"
          >
            Start With One of Our Designs or Create Your Own
          </h2>

          <p className="products__intro m-0 mt-2 max-w-[30rem] text-[0.8rem] leading-[1.65] text-[var(--ink-soft)] md:col-start-2 md:row-start-2 md:mt-0 md:self-start md:justify-self-end md:text-[1rem] md:leading-[1.6]">
            Whether one of our existing sauna and ice bath designs fits your
            space or your project needs something custom, our team will help
            you create the right setup.
          </p>
        </header>

        <div className="products__slider relative [--product-card-width:88vw] md:[--product-card-width:clamp(22rem,26vw,31rem)]">
          <div
            ref={emblaRef}
            className="products__viewport w-[calc(100vw-var(--page-offset))] cursor-grab overflow-hidden active:cursor-grabbing"
          >
            <div className="products__track flex items-stretch [touch-action:pan-y_pinch-zoom]">
              {products.map((product) => (
                <div
                  key={product.title}
                  className="products__slide min-w-0 flex-[0_0_88%] pr-[0.8rem] md:flex-[0_0_var(--product-card-width)] md:pr-[clamp(0.9rem,1.2vw,1.4rem)]"
                >
                  <article className="product-card group flex h-full flex-col bg-[var(--paper)]">
                    <div className="product-card__media aspect-[4/3] overflow-hidden bg-[var(--placeholder-light)]">
                      <img
                        className="block h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:scale-[1.02]"
                        src={getImageKitUrl(
                          product.src,
                          PRODUCT_IMAGE_WIDTHS[1],
                        )}
                        srcSet={getImageKitSrcSet(product.src)}
                        sizes="(min-width: 48rem) clamp(22rem, 26vw, 31rem), 88vw"
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: product.objectPosition }}
                      />
                    </div>

                    <div className="product-card__body flex flex-1 flex-col px-4 pt-[1.1rem] pb-[1.35rem] md:px-[1.35rem] md:pt-[1.35rem] md:pb-[1.5rem]">
                      <h3 className="m-0 font-display text-[1.22rem] font-medium leading-[1.15] tracking-[-0.025em] md:text-[1.5rem]">
                        {product.title}
                      </h3>

                      <p className="mt-[0.65rem] mb-0 text-[0.76rem] leading-[1.55] text-[var(--ink-soft)] md:text-[0.85rem] md:leading-[1.58]">
                        {product.description}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="products__controls pointer-events-none absolute top-[calc(var(--product-card-width)*0.375)] z-[4] flex w-full -translate-y-1/2 justify-between md:left-[-1.5rem] md:w-[calc(100%+1.5rem+calc(var(--page-gutter)*0.4))]">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous product"
              className="products__control pointer-events-auto grid aspect-square w-[2.7rem] place-items-center rounded-full border border-[var(--line)] bg-[var(--paper-strong)] text-[var(--ink)] shadow-[0_4px_18px_rgba(0,0,0,0.06)] transition-[opacity,background-color,color,border-color] duration-150 enabled:hover:border-[var(--ink)] enabled:hover:bg-[var(--ink)] enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:w-[3.1rem]"
            >
              <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next product"
              className="products__control pointer-events-auto grid aspect-square w-[2.7rem] place-items-center rounded-full border border-[var(--line)] bg-[var(--paper-strong)] text-[var(--ink)] shadow-[0_4px_18px_rgba(0,0,0,0.06)] transition-[opacity,background-color,color,border-color] duration-150 enabled:hover:border-[var(--ink)] enabled:hover:bg-[var(--ink)] enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-30 md:w-[3.1rem]"
            >
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <aside
          aria-labelledby="products-consultation-title"
          className="products__consultation mt-10 grid gap-6 bg-[var(--night)] px-[1.3rem] py-[1.7rem] text-white md:mt-[clamp(3.5rem,4vw,4.75rem)] md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-[clamp(3rem,7vw,8rem)] md:px-[clamp(2.5rem,3vw,3.5rem)] md:py-[clamp(2.25rem,2.8vw,3rem)]"
        >
          <div>
            <h3
              id="products-consultation-title"
              className="m-0 max-w-[19ch] font-display text-[clamp(1.75rem,7vw,2.15rem)] font-[450] leading-[1.05] tracking-[-0.038em] md:text-[clamp(2.3rem,2.65vw,3.1rem)]"
            >
              Not sure what works best for your space?
            </h3>

            <p className="mt-[0.85rem] mb-0 max-w-[34rem] text-[0.76rem] leading-[1.65] text-white/[0.64] md:text-[0.86rem]">
              You don&apos;t need to know exactly what you need. Tell us about
              your property and we&apos;ll explain what&apos;s possible.
            </p>
          </div>

          <a
            href="#consultation"
            className="pill-button pill-button--light inline-flex min-h-[3.15rem] w-full items-center justify-center rounded-[var(--pill)] border border-transparent bg-[var(--paper-strong)] px-[1.4rem] py-[0.9rem] text-center font-display text-[0.68rem] font-semibold leading-none tracking-[0.07em] text-[var(--ink)] uppercase transition-[background-color,color,border-color] duration-[160ms] hover:border-white/60 hover:bg-transparent hover:text-white md:w-auto md:flex-none"
          >
            Book a free consultation
          </a>
        </aside>
      </div>
    </section>
  );
}