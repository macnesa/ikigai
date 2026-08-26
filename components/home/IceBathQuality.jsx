import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import TechnicalDetails from "@/components/ui/TechnicalDetails";

const iceBathDetails = [
  {
    id: "ice-insulation",
    title: "Keep the cold in",
    label: "Insulation",
    body: "Getting water cold is half the job. Insulation stops outside heat transferring back in — steadier temperature, less chiller runtime.",
  },
  {
    id: "ice-chilling",
    title: "Get it cold",
    label: "Chilling",
    body: "Sized for water volume, Indonesia’s ambient temperature and expected usage — not left struggling to hold temperature.",
  },
  {
    id: "ice-filtration",
    title: "Keep it clean",
    label: "Filtration",
    body: "Cold water still needs proper filtration. It keeps the water clean and cuts constant draining and refilling.",
  },
  {
    id: "ice-circulation",
    title: "Keep it moving",
    label: "Circulation",
    body: "Water has to move consistently through the system so it actually passes through filtration and chilling.",
  },
  {
    id: "ice-maintenance",
    title: "Keep it easy to own",
    mobileTitle: "Maintenance access",
    label: "Maintenance access",
    body: "Filters change, pumps get checked, chillers get serviced. Technicians must reach the equipment without dismantling the install.",
  },
];

export default function IceBathQuality() {
  return (
    <section
      className="ice-quality light-section"
      id="ice-bath-quality"
      aria-labelledby="ice-title"
    >
      <div className="ice-quality__technical">
        <div className="site-container ice-quality__layout">
          <div className="ice-quality__primary">
            <div className="ice-quality__heading">
              <p className="eyebrow">Ice bath</p>
              <h2 id="ice-title">What’s Underneath Matters More Than You Think</h2>
              <p>
                Two ice baths can look almost identical from the outside. What
                happens underneath determines how efficiently they cool, how clean
                the water stays, and how easy the system is to maintain.
              </p>
            </div>

            <div className="ice-quality__video" data-video-status="pending">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
              />
              <MediaPlaceholder
                className="ice-quality__video-placeholder"
                label="Looping ice bath video pending"
              />
            </div>
          </div>

          <TechnicalDetails items={iceBathDetails} />
        </div>
      </div>

      <div className="ice-quality__bridge">
        <div className="site-container ice-quality__bridge-inner">
          <p>The Difference Isn’t Always Visible from the Outside</p>
          <a className="pill-button pill-button--dark" href="#consultation">
            Book a free consultation
          </a>
        </div>
      </div>
    </section>
  );
}
