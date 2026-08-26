/* eslint-disable @next/next/no-img-element */

const LOGO_SRC =
  "https://ik.imagekit.io/ikigaiwellness/ikigai/logo/image_2026-08-27_05-07-12.png?updatedAt=1787782055245";

const navItems = [
  { label: "Saunas", href: "#sauna-quality" },
  { label: "Ice baths", href: "#ice-bath-quality" },
  { label: "Build quality", href: "#sauna-quality" },
  { label: "Process", href: "#process" },
  { label: "Projects", href: "#projects" },
];

export default function SiteHeader() {
  return (
    <header className="site-header absolute inset-x-0 top-0 z-20 h-[5.5rem] text-white md:h-[6.5rem] lg:h-[6.75rem]">
      <div className="site-container mx-auto grid h-full w-full max-w-[105rem] grid-cols-[1fr_auto_1fr] items-center px-[var(--page-gutter)]">
        <a
          href="#main-content"
          aria-label="IKIGAI Wellness home"
          className="justify-self-start"
        >
          <img
            src={LOGO_SRC}
            alt="IKIGAI Wellness"
            className="block h-auto w-[4.2rem] object-contain md:w-[4.8rem] lg:w-[5.15rem]"
            loading="eager"
            decoding="async"
            draggable="false"
          />
        </a>

        <nav
          className="hidden items-center gap-[clamp(1.75rem,2.2vw,2.75rem)] font-display text-[0.875rem] font-medium leading-none text-white/[0.86] lg:flex [&_a]:transition-colors [&_a]:duration-150 [&_a:hover]:text-white"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#consultation"
          className="hidden min-h-[3rem] items-center justify-center justify-self-end rounded-full bg-black px-[1.35rem] py-[0.85rem] font-display text-[0.78rem] font-medium leading-none tracking-[0.01em] text-white transition-[background-color,color] duration-200 hover:bg-white hover:text-black lg:inline-flex"
        >
          BOOK A FREE CONSULTATION
        </a>
      </div>
    </header>
  );
}