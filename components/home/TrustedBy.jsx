/* eslint-disable @next/next/no-img-element */

const IMAGEKIT_LOGO_WIDTHS = [192, 288, 384, 480];
const IMAGEKIT_LOGO_QUALITY = 80;
const MARQUEE_REPEAT_COUNT = 2;

const trustedByLogos = [
  {
    name: "Four Points",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0484_84af68bf00c4be60d84f5ae81513ecd15abaaa08.png",
    alt: "Four Points by Sheraton",
    width: 836,
    height: 156,
    desktopWidth: 205,
    mobileWidth: 138,
  },
  {
    name: "Grand Hyatt",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0546_a41ab206d798293cf77ce791c66cd98301b77f85.png",
    alt: "Grand Hyatt Jakarta",
    width: 428,
    height: 283,
    desktopWidth: 76,
    mobileWidth: 50,
  },
  {
    name: "Marriott",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0549_a6ac5d0ff6f66e10522aabee813b95602c8d140b.png",
    alt: "Marriott",
    width: 1622,
    height: 1274,
    desktopWidth: 66,
    mobileWidth: 44,
  },
  {
    name: "The Apurva Kempinski",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0440_7415c0a6e4d5e728f944e3654d04df0be592b9e9.png",
    alt: "The Apurva Kempinski",
    width: 543,
    height: 676,
    desktopWidth: 46,
    mobileWidth: 31,
  },
  {
    name: "Mandapa",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/image_2026-08-27_03-51-40.png?updatedAt=1787778004117",
    alt: "Mandapa",
    width: 4725,
    height: 4725,
    desktopWidth: 96,
    mobileWidth: 64,
  },
  {
    name: "The Westin",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0549_a6ac5d0ff6f66e10522aabee813b95602c8d140b%20(1).png?updatedAt=1788170623020",
    alt: "The Westin",
    width: 4725,
    height: 4725,
    desktopWidth: 66,
    mobileWidth: 44,
  },
  {
    name: "JSI Resort",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0549_a6ac5d0ff6f66e10522aabee813b95602c8d140b%20(5).png?updatedAt=1788170623158=",
    alt: "JSI Resort",
    width: 4725,
    height: 4725,
    desktopWidth: 66,
    mobileWidth: 44,
  },
  {
    name: "RAW",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0549_a6ac5d0ff6f66e10522aabee813b95602c8d140b%20(4).png?updatedAt=1788170623149",
    alt: "RAW",
    width: 4725,
    height: 4725,
    desktopWidth: 66,
    mobileWidth: 44,
  },
  {
    name: "Hotel Indigo",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0549_a6ac5d0ff6f66e10522aabee813b95602c8d140b%20(6).png?updatedAt=1788170623201",
    alt: "Hotel Indigo",
    width: 4725,
    height: 4725,
    desktopWidth: 80,
    mobileWidth: 54,
  },
  {
    name: "InterContinental Hotels & Resorts",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0549_a6ac5d0ff6f66e10522aabee813b95602c8d140b%20(2).png?updatedAt=1788170623305",
    alt: "InterContinental Hotels & Resorts",
    width: 4725,
    height: 4725,
    desktopWidth: 110,
    mobileWidth: 72,
  },
];

const repeatedLogos = Array.from(
  { length: MARQUEE_REPEAT_COUNT },
  () => trustedByLogos,
).flat();

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";

  return `${src}${separator}tr=w-${width},q-${IMAGEKIT_LOGO_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return IMAGEKIT_LOGO_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
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
        src={getImageKitUrl(src, IMAGEKIT_LOGO_WIDTHS[1])}
        srcSet={getImageKitSrcSet(src)}
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

function LogoSegment({ duplicate = false }) {
  return (
    <div
      className="flex flex-none items-center gap-[2.75rem] pr-[2.75rem] md:gap-[5.25rem] md:pr-[5.25rem]"
      aria-hidden="true"
    >
      {repeatedLogos.map((logo, index) => (
        <LogoItem
          key={`${duplicate ? "duplicate" : "primary"}-${logo.name}-${index}`}
          {...logo}
          eager={!duplicate && index < 4}
        />
      ))}
    </div>
  );
}

function ReducedMotionLogos() {
  return (
    <div className="hidden overflow-x-auto px-5 motion-reduce:block md:px-8 [scrollbar-width:thin]">
      <div className="mx-auto flex w-max min-w-full items-center justify-start gap-[2.75rem] md:justify-center md:gap-[5.25rem]">
        {trustedByLogos.map((logo, index) => (
          <LogoItem key={logo.name} {...logo} eager={index < 4} />
        ))}
      </div>
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section
      className="dark-surface dark-surface--trust overflow-hidden bg-[var(--night)] text-white"
      aria-labelledby="trusted-by-title"
    >
      <div className="flex h-[7.5rem] flex-col justify-center md:h-[9.5rem]">
        <p
          id="trusted-by-title"
          className="m-0 mb-[1rem] text-center font-display text-[0.72rem] font-normal leading-none text-white/[0.68] md:mb-[1.2rem] md:text-[0.8rem]"
        >
          Trusted by
        </p>

        <ul className="sr-only">
          {trustedByLogos.map(({ name, alt }) => (
            <li key={name}>{alt}</li>
          ))}
        </ul>

        <ReducedMotionLogos />

        <div className="relative mx-auto w-full max-w-[105rem] px-5 motion-reduce:hidden md:px-[var(--page-gutter)]">
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_9%,black_91%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_9%,black_91%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]">
            <div className="flex w-max items-center animate-[trusted-marquee_34s_linear_infinite] will-change-transform">
              <LogoSegment />
              <LogoSegment duplicate />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
