"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

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

function TechnicalDetails() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <div className="hidden md:grid md:grid-cols-2 md:gap-x-[clamp(2.75rem,3.5vw,4.5rem)]">
        {iceBathDetails.map((item, index) => (
          <article
            key={item.id}
            className="min-h-[11.5rem] border-t border-[var(--line)] pt-[1.35rem] pr-[1rem] pb-[1.75rem]"
          >
            <div className="grid grid-cols-[2.3rem_minmax(0,1fr)] gap-[0.8rem]">
              <span className="pt-[0.05rem] font-display text-[0.78rem] leading-none text-[var(--ink-soft)]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="m-0 font-display text-[1rem] font-medium leading-[1.3] tracking-[-0.018em] text-[var(--ink)]">
                  {item.title}
                </h3>

                <p className="mt-[0.48rem] mb-0 font-display text-[0.56rem] leading-[1.2] tracking-[0.16em] text-[var(--ink-soft)] uppercase">
                  {item.label}
                </p>

                <p className="mt-[0.65rem] mb-0 max-w-[26rem] text-[0.72rem] leading-[1.65] text-[var(--ink-soft)]">
                  {item.body}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="border-t border-white/[0.16] md:hidden">
        {iceBathDetails.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `ice-technical-panel-${item.id}`;

          return (
            <div key={item.id} className="border-b border-white/[0.16]">
              <button
                type="button"
                className="grid min-h-[4.35rem] w-full grid-cols-[2.15rem_minmax(0,1fr)_auto] items-center gap-[0.65rem] border-0 bg-transparent p-0 text-left text-white"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="font-display text-[0.72rem] text-white/[0.5]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="font-display text-[0.92rem] font-medium leading-[1.25] tracking-[-0.015em]">
                  {item.mobileTitle || item.title}
                </span>

                {isOpen ? (
                  <Minus
                    className="shrink-0"
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.4}
                  />
                ) : (
                  <Plus
                    className="shrink-0"
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.4}
                  />
                )}
              </button>

              <div
                id={panelId}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-[180ms] ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className={`pl-[2.8rem] pr-6 ${isOpen ? "pb-[1.4rem]" : ""}`}>
                    <p className="mt-0 mb-[0.5rem] font-display text-[0.56rem] tracking-[0.16em] text-white/[0.48] uppercase">
                      {item.label}
                    </p>

                    <p className="m-0 text-[0.78rem] leading-[1.62] text-white/[0.62]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function IceBathQuality() {
  return (
    <section
      id="ice-bath-quality"
      aria-labelledby="ice-title"
      className="ice-quality bg-[var(--paper-strong)] text-[var(--ink)]"
    >
      <div className="bg-[#0b2d44] py-20 text-white md:bg-[var(--paper-strong)] md:pt-[clamp(7rem,8vw,9.5rem)] md:pb-[clamp(3rem,4vw,4.75rem)] md:text-[var(--ink)]">
        <div className="site-container mx-auto grid w-full max-w-[105rem] gap-y-[0.8rem] px-[var(--page-gutter)] md:grid-cols-[minmax(0,1.05fr)_minmax(32rem,0.95fr)] md:grid-rows-[auto_1fr] md:gap-x-[clamp(3.5rem,6vw,8rem)] md:gap-y-[0.8rem]">
          <p className="eyebrow m-0 font-display text-[0.66rem] font-semibold leading-[1.2] tracking-[0.18em] uppercase md:col-start-1 md:row-start-1">
            Ice bath
          </p>

          <div className="md:col-start-1 md:row-start-2">
            <h2
              id="ice-title"
              className="m-0 max-w-[18ch] font-display text-[clamp(2rem,8.4vw,2.8rem)] font-[450] leading-[1.02] tracking-[-0.042em] md:text-[clamp(3.3rem,4.3vw,5.15rem)]"
            >
              What’s Underneath Matters More Than You Think
            </h2>

            <p className="mt-[0.8rem] mb-0 max-w-[38rem] text-[0.78rem] leading-[1.65] text-white/[0.68] md:text-[0.84rem] md:text-[var(--ink-soft)]">
              Two ice baths can look almost identical from the outside. What
              happens underneath determines how efficiently they cool, how
              clean the water stays, and how easy the system is to maintain.
            </p>

            <div
              className="relative mt-[2.2rem] aspect-[4/3] overflow-hidden bg-[#174159] md:mt-[1.25rem] md:aspect-[16/11]"
              data-video-status="pending"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 h-full w-full object-cover"
                aria-hidden="true"
              />

              <div
                className="absolute inset-0 h-full w-full bg-[#174159]"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="mt-[2rem] md:col-start-2 md:row-start-2 md:mt-0">
            <TechnicalDetails />
          </div>
        </div>
      </div>

      <div className="bg-[var(--paper-strong)] text-[var(--ink)]">
        <div className="site-container mx-auto grid w-full max-w-[105rem] gap-6 px-[var(--page-gutter)] pt-9 pb-[4.25rem] md:flex md:items-center md:justify-between md:gap-16 md:pt-[2.25rem] md:pb-[clamp(4rem,6vw,7rem)]">
          <p className="m-0 max-w-[22ch] font-display text-[1.35rem] font-[450] leading-[1.15] tracking-[-0.025em] text-[var(--ink-soft)] md:max-w-none md:text-[1.55rem]">
            The Difference Isn’t Always Visible from the Outside
          </p>

          <a
            href="#consultation"
            className="pill-button pill-button--dark inline-flex min-h-[3.5rem] w-fit items-center justify-center rounded-[var(--pill)] border border-transparent bg-[var(--ink)] px-[1.7rem] py-[0.95rem] font-display text-[0.72rem] font-semibold leading-none tracking-[0.07em] text-white uppercase transition-[background-color,color,border-color] duration-[160ms] hover:border-[var(--ink)] hover:bg-transparent hover:text-[var(--ink)]"
          >
            Book a free consultation
          </a>
        </div>
      </div>
    </section>
  );
}