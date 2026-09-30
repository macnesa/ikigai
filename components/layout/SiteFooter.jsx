import { WHATSAPP_CTA_URL } from "@/lib/contact-config";

const FOOTER_HREFS = {
  "Products:Saunas": "#sauna-quality",
  "Products:Ice baths": "#ice-bath-quality",
  "Products:Custom projects": "#projects",
  "Company:How it’s made": "#process",
  "Company:Projects": "#projects",
};

function FooterLink({ groupLabel, item }) {
  const href = FOOTER_HREFS[`${groupLabel}:${item.text}`];

  if (!href) {
    return <span>{item.text}</span>;
  }

  return (
    <a
      href={href}
      className="transition-colors duration-150 hover:text-white"
    >
      {item.text}
    </a>
  );
}

export default function SiteFooter({ content }) {
  const footerGroups = content?.footerGroups || [];
  const primaryGroups = footerGroups.slice(0, 2);
  const contactGroup = footerGroups[2];

  return (
    <footer className="site-footer dark-surface dark-surface--footer bg-[var(--night)] text-white">
      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)] pt-10 pb-10 md:pt-[2.75rem] md:pb-[3.25rem]">
        <div className="grid gap-11 lg:grid-cols-[minmax(15rem,1.35fr)_minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(8rem,0.9fr)] lg:gap-x-[clamp(3rem,5vw,6rem)]">
          <div className="max-w-[16rem]">
            <p className="m-0 text-[0.78rem] leading-[1.65] text-white/[0.56] md:text-[0.8rem]">
              {content?.footerDescription || ""}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:contents">
            {primaryGroups.map((group) => (
              <section
                key={group._key}
                aria-labelledby={`footer-${group.label
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <h2
                  id={`footer-${group.label
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="m-0 mb-[1.05rem] font-display text-[length:var(--type-small-label)] font-semibold leading-none tracking-[0.16em] text-white/[0.4] uppercase"
                >
                  {group.label}
                </h2>

                <ul className="m-0 grid gap-[0.82rem] p-0 text-[0.74rem] leading-[1.35] text-white/[0.62] [list-style:none] md:text-[0.76rem]">
                  {(group.items || []).map((item) => (
                    <li key={item._key}>
                      <FooterLink groupLabel={group.label} item={item} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {contactGroup ? <section
            className="border-t border-white/[0.12] pt-6 lg:border-0 lg:pt-0"
            aria-labelledby="footer-contact"
          >
            <h2
              id="footer-contact"
              className="m-0 mb-[1.05rem] font-display text-[length:var(--type-small-label)] font-semibold leading-none tracking-[0.16em] text-white/[0.4] uppercase"
            >
              {contactGroup.label}
            </h2>

            <ul className="m-0 flex flex-wrap gap-x-6 gap-y-[0.82rem] p-0 text-[0.74rem] leading-[1.35] text-white/[0.62] [list-style:none] md:text-[0.76rem] lg:grid">
              {(contactGroup.items || []).map((item) => (
                <li key={item._key}>
                  <FooterLink groupLabel={contactGroup.label} item={item} />
                </li>
              ))}
            </ul>
          </section> : null}
        </div>
      </div>

      <div className="site-container mx-auto w-full max-w-[105rem] px-[var(--page-gutter)]">
        <div className="border-t border-white/[0.12]" />

        <div className="flex flex-col gap-[0.45rem] pt-6 pb-8 text-[0.64rem] leading-[1.45] text-white/[0.38] md:flex-row md:items-center md:justify-between md:pt-[1.6rem] md:pb-[3rem] md:text-[0.66rem]">
          <span>{content?.copyrightText || ""}</span>
          <span>{content?.originText || ""}</span>
        </div>
      </div>

      <div className="mobile-booking-bar flex items-center justify-between gap-4 border-t border-[var(--line)] bg-[var(--paper-strong)] px-[var(--page-gutter)] py-[0.85rem] text-[var(--ink)] lg:hidden">
        <strong className="max-w-[13rem] font-display text-[0.72rem] font-medium leading-[1.25] tracking-[-0.01em]">
          {content?.mobileBookingLabel || ""}
        </strong>

        <a
          href={WHATSAPP_CTA_URL}
          className="inline-flex min-h-[2.85rem] shrink-0 items-center justify-center rounded-[var(--pill)] bg-[var(--ink)] px-[1.15rem] py-[0.75rem] font-display text-[0.66rem] font-semibold leading-none tracking-[0.05em] text-white uppercase"
        >
          {content?.mobileBookingCtaLabel || ""}
        </a>
      </div>
    </footer>
  );
}
