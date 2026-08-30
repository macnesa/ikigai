"use client";

import { useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "How do I know which one is right for my property?",
    answer:
      "You don't need to figure it out. We review your space and usage during the free consultation, then recommend.",
  },
  {
    id: "faq-2",
    question: "How does purchasing work?",
    answer:
      "Free consultation, then design and technical setup confirmed, fixed scope and timeline agreed, then production and installation scheduled.",
  },
  {
    id: "faq-3",
    question: "How much does it cost?",
    answer:
      "It depends on product, size, equipment and customisation. We’ll walk through the options in your consultation.",
  },
  {
    id: "faq-4",
    question: "Can you customise the design?",
    answer:
      "Yes — dimensions, layout, materials, finishes. If an existing design already fits, we’ll recommend that instead.",
  },
  {
    id: "faq-5",
    question: "Where do you deliver and install?",
    answer:
      "Throughout Indonesia. For projects outside Bali we confirm logistics during the consultation.",
  },
  {
    id: "faq-6",
    question: "How long does production take?",
    answer:
      "Typically 4–6 weeks. Exact dates confirmed before the project begins.",
  },
  {
    id: "faq-7",
    question: "What does warranty and maintenance look like?",
    answer:
      "Residential installs include one year: bi-weekly visits, filter changes every two weeks, system checks and paint touch-ups.",
  },
  {
    id: "faq-8",
    question: "Do you work with hotels?",
    answer:
      "Yes. Commercial usage is higher, so we build a separate maintenance programme around the property.",
  },
];

export default function FAQ() {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (
        !section ||
        shouldLimitMotion() ||
        navigator.connection?.saveData === true
      ) {
        return;
      }

      const header = section.querySelector(".faq__header");
      const heading = section.querySelector(".faq__heading");
      const intro = section.querySelector(".faq__intro");
      const cta = section.querySelector(".faq__cta");

      if (!header || !heading || !intro || !cta) return;

      const mediaQueries = gsap.matchMedia();

      const addIntro = (query, values) => {
        mediaQueries.add(query, () => {
          const timeline = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
            scrollTrigger: {
              trigger: header,
              start: values.start,
              once: true,
            },
          });

          timeline
            .fromTo(
              heading,
              {
                autoAlpha: 0,
                y: values.headingY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: values.headingDuration,
              },
              0,
            )
            .fromTo(
              intro,
              {
                autoAlpha: 0,
                y: values.introY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: values.secondaryDuration,
              },
              0.18,
            )
            .fromTo(
              cta,
              {
                autoAlpha: 0,
                y: values.ctaY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: values.secondaryDuration,
              },
              0.26,
            );

          return () => timeline.kill();
        });
      };

      addIntro(MOTION_MEDIA.desktop, {
        headingY: 26,
        introY: 12,
        ctaY: 10,
        headingDuration: 0.72,
        secondaryDuration: 0.5,
        start: "top 78%",
      });

      addIntro(MOTION_MEDIA.tablet, {
        headingY: 21,
        introY: 10,
        ctaY: 9,
        headingDuration: 0.68,
        secondaryDuration: 0.48,
        start: "top 80%",
      });

      addIntro(MOTION_MEDIA.mobile, {
        headingY: 16,
        introY: 8,
        ctaY: 7,
        headingDuration: 0.62,
        secondaryDuration: 0.44,
        start: "top 84%",
      });

      return () => mediaQueries.revert();
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-title"
      className="faq bg-[var(--paper-strong)] pt-[4.75rem] pb-[5rem] text-[var(--ink)] md:pt-[clamp(7rem,7vw,8rem)] md:pb-[clamp(5.5rem,6vw,7rem)]"
    >
      <div className="site-container mx-auto grid w-full max-w-[105rem] gap-[2.75rem] px-[var(--page-gutter)] lg:grid-cols-[minmax(17rem,0.72fr)_minmax(34rem,1fr)] lg:items-start lg:gap-[clamp(6.5rem,11vw,13rem)]">
        <header className="faq__header lg:sticky lg:top-[8rem]">
          <h2
            id="faq-title"
            className="faq__heading m-0 max-w-[7ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[0.98] tracking-[-0.045em] md:max-w-[6ch]"
          >
            Ikigai FAQs
          </h2>

          <p className="faq__intro mt-[1.25rem] mb-0 max-w-[20rem] text-[length:var(--type-section-intro-standard)] leading-[1.6] text-[var(--ink-soft)] md:mt-[1.45rem] md:max-w-[18rem] md:leading-[1.55]">
            Common questions about our sauna and ice bath systems, and how they
            fit into your space.
          </p>

          <a
            href="#consultation"
            className="faq__cta mt-[1.75rem] inline-flex min-h-[3.4rem] w-fit min-w-[11.5rem] items-center justify-center rounded-[0.9rem] border border-[var(--ink)] bg-[var(--ink)] px-[1.5rem] py-[0.9rem] font-display text-[0.78rem] font-medium leading-none tracking-[0.01em] text-white transition-[background-color,color,border-color] duration-[160ms] hover:bg-transparent hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] md:mt-[2rem] md:min-h-[3.85rem] md:min-w-[14rem] md:text-[0.86rem]"
          >
            Message Us
          </a>
        </header>

        <div className="faq__list border-t border-[var(--line)]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${item.id}-panel`;

            return (
              <div
                key={item.id}
                className="faq-item border-b border-[var(--line)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex min-h-[4.25rem] w-full items-center justify-between gap-6 border-0 bg-transparent py-[0.25rem] text-left text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)] md:min-h-[4.65rem]"
                >
                  <span className="pr-4 font-display text-[0.92rem] font-semibold leading-[1.3] tracking-[-0.015em] md:text-[1.05rem]">
                    {item.question}
                  </span>

                  <span
                    className={`relative grid size-[1.65rem] shrink-0 place-items-center rounded-full border transition-[border-color,background-color,color] duration-[180ms] ${
                      isOpen
                        ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                        : "border-[var(--line)] text-[var(--ink)]"
                    }`}
                    aria-hidden="true"
                  >
                    <Plus
                      className={`absolute transition-[transform,opacity] duration-[180ms] ease-out ${
                        isOpen
                          ? "rotate-90 opacity-0"
                          : "rotate-0 opacity-100"
                      }`}
                      size={13}
                      strokeWidth={1.5}
                    />

                    <Minus
                      className={`absolute transition-[transform,opacity] duration-[180ms] ease-out ${
                        isOpen
                          ? "rotate-0 opacity-100"
                          : "-rotate-90 opacity-0"
                      }`}
                      size={13}
                      strokeWidth={1.5}
                    />
                  </span>
                </button>

                <div
                  id={panelId}
                  aria-hidden={!isOpen}
                  className={`grid max-w-[42rem] transition-[grid-template-rows,opacity] duration-[220ms] ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className={`m-0 max-w-[40rem] pr-10 text-[length:var(--type-reading-body)] leading-[1.65] text-[var(--ink-soft)] transition-transform duration-[220ms] ease-out md:leading-[1.6] ${
                        isOpen
                          ? "translate-y-0 pt-[0.2rem] pb-[1.65rem]"
                          : "-translate-y-2"
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
