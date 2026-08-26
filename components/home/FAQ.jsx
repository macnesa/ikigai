"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

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
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="faq bg-[var(--paper-strong)] pt-[4.75rem] pb-[5rem] text-[var(--ink)] md:pt-[clamp(7rem,7vw,8rem)] md:pb-[clamp(5.5rem,6vw,7rem)]"
    >
      <div className="site-container mx-auto grid w-full max-w-[105rem] gap-[2.75rem] px-[var(--page-gutter)] md:grid-cols-[minmax(17rem,0.72fr)_minmax(34rem,1fr)] md:items-start md:gap-[clamp(8rem,11vw,13rem)]">
        <header className="md:sticky md:top-[8rem]">
          <h2
            id="faq-title"
            className="m-0 max-w-[7ch] font-display text-[clamp(2.7rem,11vw,3.35rem)] font-[450] leading-[0.98] tracking-[-0.045em] md:max-w-[6ch] md:text-[clamp(3.25rem,3.2vw,4rem)]"
          >
            IKIGAI FAQs
          </h2>

          <p className="mt-[1.25rem] mb-0 max-w-[20rem] text-[0.82rem] leading-[1.6] text-[var(--ink-soft)] md:mt-[1.45rem] md:max-w-[18rem] md:text-[0.9rem] md:leading-[1.55]">
            Common questions about our sauna and ice bath systems, and how they
            fit into your space.
          </p>

          <a
            href="#consultation"
            className="mt-[1.75rem] inline-flex min-h-[3.4rem] w-fit min-w-[11.5rem] items-center justify-center rounded-[0.9rem] border border-[var(--ink)] bg-[var(--ink)] px-[1.5rem] py-[0.9rem] font-display text-[0.78rem] font-medium leading-none tracking-[0.01em] text-white transition-[background-color,color,border-color] duration-[160ms] hover:bg-transparent hover:text-[var(--ink)] md:mt-[2rem] md:min-h-[3.85rem] md:min-w-[14rem] md:text-[0.86rem]"
          >
            Message Us
          </a>
        </header>

        <div className="faq__list border-t border-[var(--line)]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${item.id}-panel`;

            return (
              <div key={item.id} className="faq-item border-b border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex min-h-[4.25rem] w-full items-center justify-between gap-6 border-0 bg-transparent py-[0.25rem] text-left text-[var(--ink)] md:min-h-[4.65rem]"
                >
                  <span className="pr-4 font-display text-[0.92rem] font-semibold leading-[1.3] tracking-[-0.015em] md:text-[1.05rem]">
                    {item.question}
                  </span>

                  <span
                    className={`grid size-[1.65rem] shrink-0 place-items-center rounded-full border transition-[border-color,background-color,color] duration-[160ms] ${
                      isOpen
                        ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                        : "border-[var(--line)] text-[var(--ink)]"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <Minus size={13} strokeWidth={1.5} />
                    ) : (
                      <Plus size={13} strokeWidth={1.5} />
                    )}
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
                      className={`m-0 max-w-[40rem] pr-10 text-[0.8rem] leading-[1.65] text-[var(--ink-soft)] md:text-[0.88rem] md:leading-[1.6] ${
                        isOpen ? "pt-[0.2rem] pb-[1.65rem]" : ""
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