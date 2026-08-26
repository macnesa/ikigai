const navItems = [
  { label: "Saunas", href: "#sauna-quality" },
  { label: "Ice baths", href: "#ice-bath-quality" },
  { label: "Build quality", href: "#sauna-quality" },
  { label: "Process", href: "#process" },
  { label: "Projects", href: "#projects" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <a
          className="site-wordmark"
          href="#main-content"
          aria-label="IKIGAI Wellness home"
        >
          <span className="site-wordmark__mark" aria-hidden="true">
            IK
          </span>
          <span>IKIGAI WELLNESS</span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="site-header__cta" href="#consultation">
          Book a free consultation
        </a>
      </div>
    </header>
  );
}
