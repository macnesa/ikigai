/* eslint-disable @next/next/no-img-element */

const IMAGEKIT_LOGO_WIDTHS = [192, 288, 384, 480];
const IMAGEKIT_LOGO_QUALITY = 80;

const trustedByLogos = [
  {
    name: "RAW",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0026_d14d412bca7ca0242694e995b8884c1eb936c668.png",
    alt: "RAW",
    width: 78,
    height: 21,
    desktopWidth: 122,
    mobileWidth: 86,
  },
  {
    name: "Four Points",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0484_84af68bf00c4be60d84f5ae81513ecd15abaaa08.png",
    alt: "Four Points by Sheraton",
    width: 836,
    height: 156,
    desktopWidth: 188,
    mobileWidth: 132,
  },
  {
    name: "Hotel Indigo",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0020_cf92c94ad6147fe46043ac3164e92b5654560958.png",
    alt: "Hotel Indigo",
    width: 480,
    height: 270,
    desktopWidth: 125,
    mobileWidth: 88,
  },
  {
    name: "Grand Hyatt",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0546_a41ab206d798293cf77ce791c66cd98301b77f85.png",
    alt: "Grand Hyatt Jakarta",
    width: 428,
    height: 283,
    desktopWidth: 92,
    mobileWidth: 64,
  },
  {
    name: "Marriott",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0549_a6ac5d0ff6f66e10522aabee813b95602c8d140b.png",
    alt: "Marriott",
    width: 1622,
    height: 1274,
    desktopWidth: 82,
    mobileWidth: 58,
  },
  {
    name: "Eastin",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0594_b9b56ddf8d4fc2089b4ded7cf474cbad18306556.png",
    alt: "Eastin Hotels",
    width: 480,
    height: 270,
    desktopWidth: 125,
    mobileWidth: 88,
  },
  {
    name: "COCO Development",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0571_afd80b7a4e27dfd483046cddc3ed86c49ef92d81.png",
    alt: "COCO Development",
    width: 597,
    height: 199,
    desktopWidth: 196,
    mobileWidth: 138,
  },
  {
    name: "The Apurva Kempinski",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0440_7415c0a6e4d5e728f944e3654d04df0be592b9e9.png",
    alt: "The Apurva Kempinski",
    width: 543,
    height: 676,
    desktopWidth: 60,
    mobileWidth: 44,
  },
  {
    name: "Mövenpick",
    src: "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/0573_b1dc0715f92308df9ccc7ac21c60defb24b02141.png",
    alt: "Mövenpick Hotels & Resorts",
    width: 396,
    height: 128,
    desktopWidth: 196,
    mobileWidth: 138,
  },
];

function getImageKitUrl(src, width) {
  return `${src}?tr=w-${width},q-${IMAGEKIT_LOGO_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return IMAGEKIT_LOGO_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

function LogoRow({ duplicate = false }) {
  return (
    <ul className="trusted__list" aria-hidden={duplicate ? "true" : undefined}>
      {trustedByLogos.map(
        ({
          name,
          src,
          alt,
          width,
          height,
          desktopWidth,
          mobileWidth,
        }) => (
          <li
            className="trusted__logo"
            key={`${duplicate ? "duplicate" : "primary"}-${name}`}
          >
            <img
              src={getImageKitUrl(src, IMAGEKIT_LOGO_WIDTHS[1])}
              srcSet={getImageKitSrcSet(src)}
              sizes={`(min-width: 48rem) ${desktopWidth}px, ${mobileWidth}px`}
              alt={duplicate ? "" : alt}
              width={width}
              height={height}
              loading="lazy"
              decoding="async"
              draggable="false"
              style={{
                "--trusted-logo-desktop-width": `${desktopWidth}px`,
                "--trusted-logo-mobile-width": `${mobileWidth}px`,
              }}
            />
          </li>
        ),
      )}
    </ul>
  );
}

export default function TrustedBy() {
  return (
    <section className="trusted" aria-label="Trusted by hospitality partners">
      <div className="site-container trusted__label">
        <p className="eyebrow">Trusted by</p>
      </div>

      <div className="trusted__viewport">
        <div className="trusted__track">
          <LogoRow />
          <LogoRow duplicate />
        </div>
      </div>
    </section>
  );
}
