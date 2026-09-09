/* eslint-disable @next/next/no-img-element */

const LOGO_SRC =
  "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/image_2026-08-27_05-07-12.png?updatedAt=1787782055245";

export default function SiteHeader() {
  return (
    <header className="site-header absolute inset-x-0 top-0 z-20 h-[5.5rem] text-white md:h-[6.5rem] lg:h-[6.75rem]">
      <div className="site-container mx-auto grid h-full w-full max-w-[105rem] grid-cols-[1fr_auto] items-center px-[var(--page-gutter)]">
        <a
          href="#main-content"
          aria-label="IKIGAI Wellness home"
          className="justify-self-start"
        >
          <img
            src={LOGO_SRC}
            alt="IKIGAI Wellness"
            className="block h-auto w-[3.35rem] object-contain md:w-[3.85rem] lg:w-[4.05rem]"
            loading="eager"
            decoding="async"
            draggable="false"
          />
        </a>

        <a
          href="#consultation"
          className="inline-flex min-h-[3rem] items-center justify-center justify-self-end rounded-full bg-black px-[1.35rem] py-[0.85rem] font-display text-[0.78rem] font-medium leading-none tracking-[0.01em] text-white uppercase transition-[background-color,color] duration-200 hover:bg-white hover:text-black"
        >
          Book a free consultation
        </a>
      </div>
    </header>
  );
}
