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
    <section className="products" id="products" aria-labelledby="products-title">
      <div className="site-container">
        <header className="products__header">
          <div className="products__title-wrap">
            <p className="eyebrow">Existing & custom solutions</p>
            <h2 id="products-title">
              Start With One of Our Designs or Create Your Own
            </h2>
          </div>

          <p className="products__intro">
            Whether one of our existing sauna and ice bath designs fits your
            space or your project needs something custom, our team will help
            you create the right setup.
          </p>
        </header>

        <div className="products__slider">
          <div className="products__viewport" ref={emblaRef}>
            <div className="products__track">
              {products.map((product) => (
                <div className="products__slide" key={product.title}>
                  <article className="product-card">
                    <div className="product-card__media">
                      <img
                        src={getImageKitUrl(
                          product.src,
                          PRODUCT_IMAGE_WIDTHS[1],
                        )}
                        srcSet={getImageKitSrcSet(product.src)}
                        sizes="(min-width: 48rem) clamp(22rem, 28vw, 33rem), 88vw"
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: product.objectPosition }}
                      />
                    </div>
                    <div className="product-card__body">
                      <h3>{product.title}</h3>
                      <p>{product.description}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="products__controls">
            <button
              className="products__control"
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous product"
            >
              <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
            <button
              className="products__control"
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next product"
            >
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <aside
          className="products__consultation"
          aria-labelledby="products-consultation-title"
        >
          <div>
            <h3 id="products-consultation-title">
              Not sure what works best for your space?
            </h3>
            <p>
              You don’t need to know exactly what you need. Tell us about your
              property and we’ll explain what’s possible.
            </p>
          </div>
          <a
            className="pill-button pill-button--light"
            href="#consultation"
          >
            Book a free consultation
          </a>
        </aside>
      </div>
    </section>
  );
}
