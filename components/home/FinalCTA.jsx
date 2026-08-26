const FINAL_CTA_IMAGE_WIDTHS = [640, 960, 1280, 1600, 1920];
const FINAL_CTA_IMAGE_QUALITY = 80;
const FINAL_CTA_DESKTOP_IMAGE =
  "https://ik.imagekit.io/ikigaiwellness/ikigai/home/b3f34f90ef3e371670eab38bea9970cfb08e2992.jpg";
const FINAL_CTA_MOBILE_IMAGE =
  "https://ik.imagekit.io/ikigaiwellness/ikigai/home/19fe447fdd327441430bc112d99ff4dbadc762aa.jpg";

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}tr=w-${width},q-${FINAL_CTA_IMAGE_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return FINAL_CTA_IMAGE_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

export default function FinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta__media" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 47.99rem)"
            srcSet={getImageKitSrcSet(FINAL_CTA_MOBILE_IMAGE)}
            sizes="100vw"
          />
          <img
            className="final-cta__image"
            src={getImageKitUrl(
              FINAL_CTA_DESKTOP_IMAGE,
              FINAL_CTA_IMAGE_WIDTHS[1],
            )}
            srcSet={getImageKitSrcSet(FINAL_CTA_DESKTOP_IMAGE)}
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </picture>
      </div>
      <div className="site-container final-cta__inner">
        <h2 id="final-cta-title">Build a Wellness Space You’ll Be Proud to Own</h2>
        <a className="pill-button pill-button--dark" href="#consultation">
          Book my free consultation
        </a>
      </div>
    </section>
  );
}
