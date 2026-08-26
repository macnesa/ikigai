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
    <section className="faq light-section" id="faq" aria-labelledby="faq-title">
      <div className="site-container faq__layout">
        <header>
          <h2 id="faq-title">IKIGAI FAQs</h2>
          <a className="pill-button pill-button--dark faq__message" href="#consultation">
            Message us
          </a>
        </header>

        <div className="faq__list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${item.id}-panel`;

            return (
              <div className="faq-item" key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span>{item.question}</span>
                  {isOpen ? (
                    <Minus aria-hidden="true" size={18} strokeWidth={1.4} />
                  ) : (
                    <Plus aria-hidden="true" size={18} strokeWidth={1.4} />
                  )}
                </button>
                <div
                  className={`faq-item__answer${isOpen ? " is-open" : ""}`}
                  id={panelId}
                  aria-hidden={!isOpen}
                >
                  <div>
                    <p>{item.answer}</p>
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
