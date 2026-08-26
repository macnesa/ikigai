"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";

const IMAGEKIT_WIDTHS = [640, 960, 1280, 1600];
const IMAGEKIT_QUALITY = 80;

const SAUNA_COMPARISON_IMAGES = {
  other:
    "https://ik.imagekit.io/ikigaiwellness/ikigai/home/Screenshot%202026-08-26%20at%2011.35.57.png",
  ours:
    "https://ik.imagekit.io/ikigaiwellness/ikigai/home/Screenshot%202026-08-26%20at%2011.36.12.png",
};

const saunaDetails = [
  {
    id: "sauna-heater",
    title: "The heater needs to match the room",
    mobileTitle: "Heater sizing",
    body: "Sized around sauna volume, glass area and construction. Too small, and the room does not heat properly.",
  },
  {
    id: "sauna-airflow",
    title: "Good heat still needs good airflow",
    mobileTitle: "Ventilation",
    body: "Designed air intake and exhaust. Without it the room feels stuffy and the heat goes uneven.",
  },
  {
    id: "sauna-benches",
    title: "Where you sit changes the experience",
    mobileTitle: "Bench height",
    body: "Heat rises. Benches too low and much of your body stays in the cooler part of the room.",
  },
  {
    id: "sauna-clearances",
    title: "The heater can’t go wherever it looks best",
    mobileTitle: "Heater position & clearances",
    body: "Position and distance from wood, benches and walls must match the heater’s requirements.",
  },
  {
    id: "sauna-insulation",
    title: "The room needs to hold heat",
    mobileTitle: "Insulation & construction",
    body: "Insulation, vapour control and wall construction are designed for repeated heat and humidity. A sauna isn’t just timber on the outside.",
  },
];

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}tr=w-${width},q-${IMAGEKIT_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return IMAGEKIT_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

function ComparisonImage({ src }) {
  return (
    <img
      className="absolute inset-0 block h-full w-full object-cover object-center"
      src={getImageKitUrl(src, IMAGEKIT_WIDTHS[1])}
      srcSet={getImageKitSrcSet(src)}
      sizes="(min-width: 48rem) 48vw, calc(100vw - 2.5rem)"
      alt=""
      loading="lazy"
      decoding="async"
      draggable="false"
      aria-hidden="true"
    />
  );
}

function ComparisonSlider() {
  const [position, setPosition] = useState(50);

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden bg-[#5f5a52] text-white md:aspect-[4/5]"
      role="group"
      aria-label="Compare the other sauna with the IKIGAI sauna"
      style={{ "--comparison-position": `${position}%` }}
    >
      <ComparisonImage src={SAUNA_COMPARISON_IMAGES.ours} />

      <div
        className="absolute inset-0 [clip-path:inset(0_calc(100%_-_var(--comparison-position))_0_0)]"
        aria-hidden="true"
      >
        <ComparisonImage src={SAUNA_COMPARISON_IMAGES.other} />
      </div>

      <span className="pointer-events-none absolute top-4 left-4 z-[2] font-display text-[0.82rem] font-normal leading-none tracking-[-0.02em] text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.35)] md:top-7 md:left-6 md:text-[1.35rem]">
        Other Sauna
      </span>

      <span className="pointer-events-none absolute top-4 right-4 z-[2] font-display text-[0.82rem] font-normal leading-none tracking-[-0.02em] text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.35)] md:top-7 md:right-6 md:text-[1.35rem]">
        Our Sauna
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 left-[var(--comparison-position)] z-[3] w-[2px] -translate-x-1/2 bg-white"
        aria-hidden="true"
      >
        <span className="absolute top-1/2 left-1/2 flex aspect-square w-[2.75rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-[0_4px_20px_rgba(0,0,0,0.16)] md:w-[3.25rem]">
          <ChevronLeft className="-mr-[0.22rem]" size={17} strokeWidth={1.7} />
          <ChevronRight className="-ml-[0.22rem]" size={17} strokeWidth={1.7} />
        </span>
      </div>

      <input
        className="absolute inset-0 z-[4] m-0 h-full w-full cursor-ew-resize opacity-0 [touch-action:pan-y]"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label="Compare the other sauna with the IKIGAI sauna"
      />
    </div>
  );
}

function TechnicalDetails() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <div className="hidden md:block">
        {saunaDetails.map((item, index) => (
          <article
            key={item.id}
            className={`grid grid-cols-[3.4rem_minmax(0,1fr)] gap-4 py-[1.3rem] ${
              index < saunaDetails.length - 1
                ? "border-b border-white/[0.13]"
                : ""
            }`}
          >
            <span className="pt-[0.08rem] font-display text-[1.08rem] font-normal leading-none tracking-[-0.02em] text-white/[0.78]">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <h3 className="m-0 font-display text-[1.02rem] font-medium leading-[1.3] tracking-[-0.015em] text-white/[0.92]">
                {item.title}
              </h3>

              <p className="mt-[0.55rem] mb-0 max-w-[35rem] text-[0.76rem] leading-[1.58] text-white/[0.54]">
                {item.body}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="border-t border-white/[0.15] md:hidden">
        {saunaDetails.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `sauna-technical-panel-${item.id}`;

          return (
            <div key={item.id} className="border-b border-white/[0.15]">
              <button
                className="grid min-h-[4.25rem] w-full grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-[0.65rem] border-0 bg-transparent p-0 text-left text-white"
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="font-display text-[0.74rem] font-normal text-white/[0.52]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="font-display text-[0.9rem] font-medium leading-[1.25] tracking-[-0.015em]">
                  {item.mobileTitle || item.title}
                </span>

                {isOpen ? (
                  <Minus
                    className="shrink-0"
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.4}
                  />
                ) : (
                  <Plus
                    className="shrink-0"
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.4}
                  />
                )}
              </button>

              <div
                id={panelId}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-[180ms] ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p
                    className={`m-0 pl-[2.9rem] pr-8 text-[0.78rem] leading-[1.62] text-white/[0.6] ${
                      isOpen ? "pb-[1.35rem]" : ""
                    }`}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function SaunaQuality() {
  return (
    <section
      id="sauna-quality"
      aria-labelledby="sauna-title"
      className="bg-[var(--night)] py-[4.75rem] text-white md:py-[clamp(4.75rem,5vw,6rem)]"
    >
      <div className="mx-auto grid w-full max-w-[105rem] gap-y-6 px-[var(--page-gutter)] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:grid-rows-[auto_auto_1fr] md:gap-x-[clamp(3rem,5vw,6rem)] md:gap-y-0">
        <div className="grid gap-[0.8rem] md:col-start-2 md:row-start-1">
          <p className="m-0 font-display text-[0.66rem] font-semibold leading-[1.2] tracking-[0.18em] uppercase text-white/[0.62] md:text-right">
            Sauna
          </p>

          <h2
            id="sauna-title"
            className="m-0 font-display text-[clamp(2rem,8.4vw,2.8rem)] font-[450] leading-[1.02] tracking-[-0.042em] md:text-[clamp(3.25rem,3.75vw,4.5rem)]"
          >
            Beautiful Isn’t Always Built Properly
          </h2>
        </div>

        <div className="md:col-start-1 md:row-start-1 md:row-span-3">
          <ComparisonSlider />
        </div>

        <p className="m-0 text-[0.8rem] leading-[1.62] text-white/[0.62] md:col-start-2 md:row-start-2 md:mt-[1rem] md:max-w-[39rem] md:text-[1rem] md:leading-[1.58]">
          Most problems aren’t obvious when an installation is new. They show
          up later: poor performance, higher running costs, uncomfortable use,
          difficult maintenance.
        </p>

        <div className="md:col-start-2 md:row-start-3 md:mt-[1.8rem]">
          <TechnicalDetails />
        </div>
      </div>
    </section>
  );
}