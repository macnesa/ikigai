/* eslint-disable @next/next/no-img-element */

const IMAGEKIT_LOGO_WIDTHS = [192, 288, 384, 480];
const IMAGEKIT_LOGO_QUALITY = 80;
const MARQUEE_REPEAT_COUNT = 4;

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
];

const repeatedLogos = Array.from(
  { length: MARQUEE_REPEAT_COUNT },
  () => trustedByLogos,
).flat();

function getImageKitUrl(src, width) {
  return `${src}?tr=w-${width},q-${IMAGEKIT_LOGO_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return IMAGEKIT_LOGO_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

function LogoSegment({ duplicate = false }) {
  return (
    <div
      className="flex flex-none items-center gap-[3rem] pr-[3rem] md:gap-[5.5rem] md:pr-[5.5rem]"
      aria-hidden="true"
    >
      {repeatedLogos.map(
        ({ name, src, width, height, desktopWidth, mobileWidth }, index) => (
          <div
            key={`${duplicate ? "duplicate" : "primary"}-${name}-${index}`}
            className="flex h-[3.6rem] flex-none items-center justify-center md:h-[5.4rem]"
          >
            <img
              className="block h-auto w-[var(--logo-mobile-width)] max-w-none flex-none object-contain md:w-[var(--logo-desktop-width)]"
              src={getImageKitUrl(src, IMAGEKIT_LOGO_WIDTHS[1])}
              srcSet={getImageKitSrcSet(src)}
              sizes={`(min-width: 48rem) ${desktopWidth}px, ${mobileWidth}px`}
              alt=""
              width={width}
              height={height}
              loading="eager"
              decoding="async"
              draggable="false"
              style={{
                "--logo-desktop-width": `${desktopWidth}px`,
                "--logo-mobile-width": `${mobileWidth}px`,
              }}
            />
          </div>
        ),
      )}
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section
      className="overflow-hidden bg-[var(--night)] text-white"
      aria-labelledby="trusted-by-title"
    >
      <div className="flex h-[8.75rem] flex-col justify-center md:h-[12.3125rem]">
        <p
          id="trusted-by-title"
          className="m-0 mb-[1.2rem] text-center font-display text-[0.7rem] font-normal leading-none text-white/[0.58] md:mb-[1.5rem] md:text-[0.8rem]"
        >
          Trusted by
        </p>

        <ul className="sr-only">
          {trustedByLogos.map(({ name, alt }) => (
            <li key={name}>{alt}</li>
          ))}
        </ul>

        <div className="relative mx-auto w-full max-w-[46rem] px-5 md:max-w-[72rem] md:px-8">
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_7%,black_93%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_7%,black_93%,transparent_100%)] motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:thin]">
            <div className="flex w-max items-center animate-[trusted-marquee_42s_linear_infinite] will-change-transform motion-reduce:animate-none motion-reduce:will-change-auto">
              <LogoSegment />
              <LogoSegment duplicate />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}