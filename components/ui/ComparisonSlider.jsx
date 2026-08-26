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

function ComparisonImage({ src }) {
  return (
    <div className="comparison__media" aria-hidden="true">
      <img
        className="comparison__image"
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
      className="comparison"
      role="group"
      aria-label="Compare the other sauna with the IKIGAI sauna"
      style={{ "--comparison-position": `${position}%` }}
    >
      <ComparisonImage src={beforeImage} />
      <div className="comparison__after" aria-hidden="true">
        <ComparisonImage src={afterImage} />
      </div>

      <span className="comparison__label comparison__label--before">
        Other Sauna
      </span>
      <span className="comparison__label comparison__label--after">
        Our Sauna
      </span>

      <div className="comparison__divider" aria-hidden="true">
        <span className="comparison__handle">
          <MoveHorizontal size={18} strokeWidth={1.5} />
        </span>
      </div>

      <input
        className="comparison__input"
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
