import ComparisonSlider from "@/components/ui/ComparisonSlider";
import TechnicalDetails from "@/components/ui/TechnicalDetails";

const SAUNA_COMPARISON_IMAGES = {
  other:
    "https://ik.imagekit.io/ikigaiwellness/ikigai/home/Screenshot%202026-08-26%20at%2011.35.57.png",
  ours:
    "https://ik.imagekit.io/ikigaiwellness/ikigai/home/Screenshot%202026-08-26%20at%2011.36.12.png",
};

const saunaDetails = [
  {
    id: "sauna-heater",
    title: "The heater needs to match the room",
    mobileTitle: "Heater sizing",
    body: "Sized around sauna volume, glass area and construction. Too small, and the room does not heat properly.",
  },
  {
    id: "sauna-airflow",
    title: "Good heat still needs good airflow",
    mobileTitle: "Ventilation",
    body: "Designed air intake and exhaust. Without it the room feels stuffy and the heat goes uneven.",
  },
  {
    id: "sauna-benches",
    title: "Where you sit changes the experience",
    mobileTitle: "Bench height",
    body: "Heat rises. Benches too low and much of your body stays in the cooler part of the room.",
  },
  {
    id: "sauna-clearances",
    title: "The heater can’t go wherever it looks best",
    mobileTitle: "Heater position & clearances",
    body: "Position and distance from wood, benches and walls must match the heater’s requirements.",
  },
  {
    id: "sauna-insulation",
    title: "The room needs to hold heat",
    mobileTitle: "Insulation & construction",
    body: "Insulation, vapour control and wall construction are designed for repeated heat and humidity. A sauna isn’t just timber on the outside.",
  },
];

export default function SaunaQuality() {
  return (
    <section
      className="sauna-quality dark-section"
      id="sauna-quality"
      aria-labelledby="sauna-title"
    >
      <div className="site-container sauna-quality__layout">
        <div className="sauna-quality__heading">
          <p className="eyebrow">Sauna</p>
          <h2 id="sauna-title">Beautiful Isn’t Always Built Properly</h2>
        </div>

        <ComparisonSlider
          beforeImage={SAUNA_COMPARISON_IMAGES.other}
          afterImage={SAUNA_COMPARISON_IMAGES.ours}
        />

        <p className="sauna-quality__intro">
          Most problems aren’t obvious when an installation is new. They show
          up later: poor performance, higher running costs, uncomfortable use,
          difficult maintenance.
        </p>

        <TechnicalDetails items={saunaDetails} inverse />
      </div>
    </section>
  );
}
