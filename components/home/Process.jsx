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
    <section className="process dark-section bg-[var(--night)] py-[4.25rem] text-white md:py-[clamp(6.5rem,8vw,9.5rem)]" id="process" aria-labelledby="process-title">
      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)]">
        <header className="process__header mb-10 grid gap-4 md:mb-[clamp(3.5rem,5vw,6rem)] md:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)] md:items-end md:gap-16">
          <h2 className="m-0 font-display text-[clamp(2rem,8.4vw,2.8rem)] font-[450] leading-[1.02] tracking-[-0.042em] md:text-[clamp(3.3rem,4.3vw,5.15rem)]" id="process-title">The IKIGAI Process</h2>
          <p className="m-0 text-[0.78rem] leading-[1.65] text-white/[0.62] md:max-w-[38rem] md:justify-self-end md:text-[0.84rem]">
            You tell us about your property and what you’re trying to create. We
            manage the process from assessment through installation and ongoing
            support.
          </p>
        </header>

        <div className="process__grid grid gap-[1.9rem] md:grid-cols-3 md:gap-x-[clamp(1rem,1.7vw,2rem)] md:gap-y-[clamp(2rem,3vw,3.5rem)]">
          {processSteps.map((step, index) => (
            <article className="process-card" key={step.title}>
              <div className="process-card__media mb-[0.8rem] aspect-[12/5] overflow-hidden bg-[#414957] text-white/[0.46] md:aspect-video">
                <img
                  className="process-card__image block h-full w-full object-cover"
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
              <p className="process-card__meta mt-0 mb-[0.65rem] font-display text-[0.56rem] tracking-[0.15em] text-white/[0.54] uppercase">
                {String(index + 1).padStart(2, "0")} — {step.label}
              </p>
              <h3 className="m-0 font-display text-[1.2rem] font-medium tracking-[-0.025em]">{step.title}</h3>
              <p className="process-card__body mt-2 mb-0 text-[0.72rem] leading-[1.6] text-white/[0.62]">{step.body}</p>
            </article>
          ))}
        </div>

        <a className="pill-button pill-button--light process__cta mt-[2.8rem] inline-flex min-h-[3.15rem] w-full items-center justify-center rounded-[var(--pill)] border border-transparent bg-[var(--paper-strong)] px-[1.4rem] py-[0.9rem] text-center font-display text-[0.68rem] font-semibold leading-none tracking-[0.07em] text-[var(--ink)] uppercase transition-[background-color,color,border-color] duration-[160ms] hover:border-white/60 hover:bg-transparent hover:text-white md:mx-auto md:flex md:w-fit" href="#consultation">
          Book a free consultation
        </a>
      </div>
    </section>
  );
}
