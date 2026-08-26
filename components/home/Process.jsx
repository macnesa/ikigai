/* eslint-disable @next/next/no-img-element */

const PROCESS_IMAGE_WIDTHS = [480, 640, 960, 1280];
const PROCESS_IMAGE_QUALITY = 80;

const processSteps = [
  {
    label: "Assess",
    title: "Understand your space",
    body: "Available space, intended usage, electrical supply, drainage and project requirements.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-51-55.png",
    objectPosition: "center center",
  },
  {
    label: "Recommend & design",
    title: "Determine the right solution",
    body: "Existing design or custom — then adapted around your space, aesthetic and usage.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-52-13.png",
    objectPosition: "center center",
  },
  {
    label: "Engineer",
    title: "Verify the technical details",
    body: "Heater sizing, ventilation, chilling, circulation and filtration reviewed before production.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-52-30.png",
    objectPosition: "center center",
  },
  {
    label: "Build",
    title: "Build for your project",
    body: "Our own team handles production and the technical requirements.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-52-43.png",
    objectPosition: "center center",
  },
  {
    label: "Install",
    title: "Handled by our team",
    body: "We coordinate delivery, installation and commissioning of your wellness equipment.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-52-54.png",
    objectPosition: "center center",
  },
  {
    label: "Maintain",
    title: "We’re still here after installation",
    body: "Include a weekly maintenance for both commercial & residential to make sure it lasts for years to come.",
    image:
      "https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-26_11-53-05.png",
    objectPosition: "center center",
  },
];

function getImageKitUrl(src, width) {
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}tr=w-${width},q-${PROCESS_IMAGE_QUALITY},f-auto`;
}

function getImageKitSrcSet(src) {
  return PROCESS_IMAGE_WIDTHS.map(
    (width) => `${getImageKitUrl(src, width)} ${width}w`,
  ).join(", ");
}

export default function Process() {
  return (
    <section className="process dark-section" id="process" aria-labelledby="process-title">
      <div className="site-container">
        <header className="process__header">
          <h2 id="process-title">The IKIGAI Process</h2>
          <p>
            You tell us about your property and what you’re trying to create. We
            manage the process from assessment through installation and ongoing
            support.
          </p>
        </header>

        <div className="process__grid">
          {processSteps.map((step, index) => (
            <article className="process-card" key={step.title}>
              <div className="process-card__media">
                <img
                  className="process-card__image"
                  src={getImageKitUrl(step.image, PROCESS_IMAGE_WIDTHS[1])}
                  srcSet={getImageKitSrcSet(step.image)}
                  sizes="(min-width: 48rem) 30vw, calc(100vw - 2.5rem)"
                  alt={step.title}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  style={{ objectPosition: step.objectPosition }}
                />
              </div>
              <p className="process-card__meta">
                {String(index + 1).padStart(2, "0")} — {step.label}
              </p>
              <h3>{step.title}</h3>
              <p className="process-card__body">{step.body}</p>
            </article>
          ))}
        </div>

        <a className="pill-button pill-button--light process__cta" href="#consultation">
          Book a free consultation
        </a>
      </div>
    </section>
  );
}
