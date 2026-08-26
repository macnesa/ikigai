const footerGroups = [
  {
    title: "Products",
    items: ["Saunas", "Ice baths", "Custom projects", "Rental"],
  },
  {
    title: "Company",
    items: ["Our story", "How it’s made", "Projects", "Maintenance"],
  },
  {
    title: "Contact",
    items: ["WhatsApp", "Instagram", "TikTok"],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__main">
        <a className="site-wordmark" href="#main-content" aria-label="IKIGAI Wellness home">
          <span className="site-wordmark__mark" aria-hidden="true">
            IK
          </span>
          <span>IKIGAI WELLNESS</span>
        </a>

        <div className="site-footer__groups">
          {footerGroups.map((group) => (
            <section
              className={`site-footer__group${
                group.title === "Contact" ? " site-footer__group--contact" : ""
              }`}
              key={group.title}
              aria-labelledby={`footer-${group.title}`}
            >
              <h2 id={`footer-${group.title}`}>{group.title}</h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="site-container site-footer__meta">
        <span>© 2026 Ikigai Wellness. All rights reserved.</span>
        <span>Handcrafted in Jepara, Indonesia</span>
      </div>

      <div className="mobile-booking-bar">
        <div>
          <strong>Free wellness consultation</strong>
        </div>
        <a href="#consultation">Book now</a>
      </div>
    </footer>
  );
}
