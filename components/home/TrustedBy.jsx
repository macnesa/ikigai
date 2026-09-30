/* eslint-disable @next/next/no-img-element */

import { cloudinaryAssetUrl } from "@/lib/cloudinary";

const CLOUDINARY_LOGO_WIDTHS = [192, 288, 384, 480];
const MARQUEE_REPEAT_COUNT = 2;

const LOGO_WIDTHS = {
  "Four Points": { desktopWidth: 205, mobileWidth: 138 },
  "Grand Hyatt": { desktopWidth: 76, mobileWidth: 50 },
  Marriott: { desktopWidth: 66, mobileWidth: 44 },
  "The Apurva Kempinski": { desktopWidth: 46, mobileWidth: 31 },
  Mandapa: { desktopWidth: 96, mobileWidth: 64 },
  "The Westin": { desktopWidth: 66, mobileWidth: 44 },
  "JSI Resort": { desktopWidth: 66, mobileWidth: 44 },
  RAW: { desktopWidth: 66, mobileWidth: 44 },
  "Hotel Indigo": { desktopWidth: 80, mobileWidth: 54 },
  "InterContinental Hotels & Resorts": { desktopWidth: 110, mobileWidth: 72 },
};

function getCloudinaryUrl(src) {
  return src;
}

function getCloudinarySrcSet(src) {
  return CLOUDINARY_LOGO_WIDTHS.map(
    (width) => `${getCloudinaryUrl(src, width)} ${width}w`,
  ).join(", ");
}

function LogoItem({
  name,
  src,
  width,
  height,
  desktopWidth,
  mobileWidth,
  eager = false,
}) {
  return (
    <div className="flex h-[3.25rem] flex-none items-center justify-center md:h-[4.5rem]">
      <img
        className="block h-auto w-[var(--logo-mobile-width)] max-w-none flex-none object-contain md:w-[var(--logo-desktop-width)]"
        src={getCloudinaryUrl(src, CLOUDINARY_LOGO_WIDTHS[1])}
        srcSet={getCloudinarySrcSet(src)}
        sizes={`(min-width: 48rem) ${desktopWidth}px, ${mobileWidth}px`}
        alt=""
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable="false"
        style={{
          "--logo-desktop-width": `${desktopWidth}px`,
          "--logo-mobile-width": `${mobileWidth}px`,
        }}
        data-logo={name}
      />
    </div>
  );
}

function LogoSegment({ logos, duplicate = false }) {
  return (
    <div
      className="flex flex-none items-center gap-[2.75rem] pr-[2.75rem] md:gap-[5.25rem] md:pr-[5.25rem]"
      aria-hidden="true"
    >
      {Array.from({ length: MARQUEE_REPEAT_COUNT }, () => logos)
        .flat()
        .map((logo, index) => (
        <LogoItem
          key={`${duplicate ? "duplicate" : "primary"}-${logo.name}-${index}`}
          {...logo}
          eager={!duplicate && index < 4}
        />
      ))}
    </div>
  );
}

function ReducedMotionLogos({ logos }) {
  return (
    <div className="hidden overflow-x-auto px-5 motion-reduce:block md:px-8 [scrollbar-width:thin]">
      <div className="mx-auto flex w-max min-w-full items-center justify-start gap-[2.75rem] md:justify-center md:gap-[5.25rem]">
        {logos.map((logo, index) => (
          <LogoItem key={logo.name} {...logo} eager={index < 4} />
        ))}
      </div>
    </div>
  );
}

export default function TrustedBy({ content }) {
  const trustedByLogos = (content?.clients || []).map((client) => ({
    name: client.name,
    src: cloudinaryAssetUrl(client.logo),
    alt: client.accessibleLabel,
    width: client.logo?.width,
    height: client.logo?.height,
    ...(LOGO_WIDTHS[client.name] || {}),
  }));

  return (
    <section
      className="dark-surface dark-surface--trust overflow-hidden bg-[var(--night)] text-white"
      aria-labelledby="trusted-by-title"
    >
      <div className="flex h-[6.75rem] -translate-y-[0.125rem] flex-col justify-center md:h-[8.875rem] md:-translate-y-[0.375rem]">
          <p
          id="trusted-by-title"
          className="m-0 mb-[0.4rem] text-center font-display text-[0.72rem] font-normal leading-none text-white/[0.68] md:mb-[0.55rem] md:text-[0.8rem]"
        >
          {content?.eyebrow || ""}
        </p>

        <ul className="sr-only">
          {trustedByLogos.map(({ name, alt }) => (
            <li key={name}>{alt}</li>
          ))}
        </ul>

        <ReducedMotionLogos logos={trustedByLogos} />

        <div className="relative mx-auto w-full max-w-[105rem] px-5 motion-reduce:hidden md:px-[var(--page-gutter)]">
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_9%,black_91%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_9%,black_91%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]">
            <div className="flex w-max items-center animate-[trusted-marquee_34s_linear_infinite] will-change-transform">
              <LogoSegment logos={trustedByLogos} />
              <LogoSegment logos={trustedByLogos} duplicate />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
