"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { MoveHorizontal } from "lucide-react";

const IMAGEKIT_WIDTHS = [640, 960, 1280, 1600];
const IMAGEKIT_QUALITY = 80;

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}tr=w-${width},q-${IMAGEKIT_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return IMAGEKIT_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

function ComparisonImage({ src, after = false }) {
  return (
    <div
      className={`comparison__media absolute inset-0 ${
        after ? "bg-[#777169]" : "bg-[#5f5a52]"
      } text-white/50`}
      aria-hidden="true"
    >
      <img
        className="comparison__image block h-full w-full object-cover object-center"
        src={getImageKitUrl(src, IMAGEKIT_WIDTHS[1])}
        srcSet={getImageKitSrcSet(src)}
        sizes="(min-width: 48rem) 44vw, calc(100vw - 2.5rem)"
        alt=""
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </div>
  );
}

export default function ComparisonSlider({ beforeImage, afterImage }) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className="comparison relative aspect-[16/10] overflow-hidden bg-[var(--placeholder-dark)] text-white md:[grid-area:comparison] md:aspect-[4/3]"
      role="group"
      aria-label="Compare the other sauna with the IKIGAI sauna"
      style={{ "--comparison-position": `${position}%` }}
    >
      <ComparisonImage src={beforeImage} />
      <div
        className="comparison__after absolute inset-0 [clip-path:inset(0_calc(100%_-_var(--comparison-position))_0_0)]"
        aria-hidden="true"
      >
        <ComparisonImage src={afterImage} after />
      </div>

      <span className="comparison__label comparison__label--before absolute top-4 right-4 z-[2] bg-[rgba(20,25,34,0.74)] px-[0.7rem] py-[0.55rem] font-display text-[0.63rem] tracking-[0.08em] uppercase">
        Other Sauna
      </span>
      <span className="comparison__label comparison__label--after absolute top-4 left-4 z-[2] bg-[rgba(20,25,34,0.74)] px-[0.7rem] py-[0.55rem] font-display text-[0.63rem] tracking-[0.08em] uppercase">
        Our Sauna
      </span>

      <div
        className="comparison__divider pointer-events-none absolute inset-y-0 left-[var(--comparison-position)] z-[3] w-px bg-white"
        aria-hidden="true"
      >
        <span className="comparison__handle absolute top-1/2 left-1/2 grid aspect-square w-[2.8rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--ink)]">
          <MoveHorizontal size={18} strokeWidth={1.5} />
        </span>
      </div>

      <input
        className="comparison__input absolute inset-0 z-[4] m-0 h-full w-full cursor-ew-resize opacity-0 [touch-action:pan-y]"
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
