const footerGroups = [
  {
    title: "Products",
    items: [
      { label: "Saunas", href: "#sauna-quality" },
      { label: "Ice baths", href: "#ice-bath-quality" },
      { label: "Custom projects", href: "#projects" },
      { label: "Rental" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Our story" },
      { label: "How it’s made", href: "#process" },
      { label: "Projects", href: "#projects" },
      { label: "Maintenance" },
    ],
  },
  {
    title: "Contact",
    items: [
      { label: "WhatsApp" },
      { label: "Instagram" },
      { label: "TikTok" },
    ],
  },
];

function FooterLink({ item }) {
  if (!item.href) {
    return <span>{item.label}</span>;
  }

  return (
    <a
      href={item.href}
      className="transition-colors duration-150 hover:text-white"
    >
      {item.label}
    </a>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer dark-surface dark-surface--footer bg-[var(--night)] text-white">
      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)] pt-10 pb-10 md:pt-[2.75rem] md:pb-[3.25rem]">
        <div className="grid gap-11 lg:grid-cols-[minmax(15rem,1.35fr)_minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(8rem,0.9fr)] lg:gap-x-[clamp(3rem,5vw,6rem)]">
          <div className="max-w-[16rem]">
            <p className="m-0 text-[0.78rem] leading-[1.65] text-white/[0.56] md:text-[0.8rem]">
              Saunas, ice baths and complete wellness spaces, installed across
              Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:contents">
            {footerGroups.slice(0, 2).map((group) => (
              <section
                key={group.title}
                aria-labelledby={`footer-${group.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <h2
                  id={`footer-${group.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="m-0 mb-[1.05rem] font-display text-[length:var(--type-small-label)] font-semibold leading-none tracking-[0.16em] text-white/[0.4] uppercase"
                >
                  {group.title}
                </h2>

                <ul className="m-0 grid gap-[0.82rem] p-0 text-[0.74rem] leading-[1.35] text-white/[0.62] [list-style:none] md:text-[0.76rem]">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section
            className="border-t border-white/[0.12] pt-6 lg:border-0 lg:pt-0"
            aria-labelledby="footer-contact"
          >
            <h2
              id="footer-contact"
              className="m-0 mb-[1.05rem] font-display text-[length:var(--type-small-label)] font-semibold leading-none tracking-[0.16em] text-white/[0.4] uppercase"
            >
              Contact
            </h2>

            <ul className="m-0 flex flex-wrap gap-x-6 gap-y-[0.82rem] p-0 text-[0.74rem] leading-[1.35] text-white/[0.62] [list-style:none] md:text-[0.76rem] lg:grid">
              {footerGroups[2].items.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)]">
        <div className="border-t border-white/[0.12]" />

        <div className="flex flex-col gap-[0.45rem] pt-6 pb-8 text-[0.64rem] leading-[1.45] text-white/[0.38] md:flex-row md:items-center md:justify-between md:pt-[1.6rem] md:pb-[3rem] md:text-[0.66rem]">
          <span>© 2026 Ikigai Wellness. All rights reserved.</span>
          <span>Handcrafted in Jepara, Indonesia</span>
        </div>
      </div>

      <div className="mobile-booking-bar flex items-center justify-between gap-4 border-t border-[var(--line)] bg-[var(--paper-strong)] px-[var(--page-gutter)] py-[0.85rem] text-[var(--ink)] lg:hidden">
        <strong className="max-w-[13rem] font-display text-[0.72rem] font-medium leading-[1.25] tracking-[-0.01em]">
          Free wellness consultation
        </strong>

        <a
          href="#consultation"
          className="inline-flex min-h-[2.85rem] shrink-0 items-center justify-center rounded-[var(--pill)] bg-[var(--ink)] px-[1.15rem] py-[0.75rem] font-display text-[0.66rem] font-semibold leading-none tracking-[0.05em] text-white uppercase"
        >
          Book now
        </a>
      </div>
    </footer>
  );
}
