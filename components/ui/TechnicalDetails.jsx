"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function TechnicalDetails({ items, inverse = false, className = "" }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div
      className={`technical-details${inverse ? " technical-details--inverse" : ""} ${className}`}
    >
      <div
        className={`technical-details__desktop hidden md:grid ${
          inverse ? "md:grid-cols-1" : "md:grid-cols-2"
        }`}
      >
        {items.map((item, index) => (
          <article
            className={`technical-details__item md:grid md:grid-cols-[2.2rem_1fr] md:gap-[0.8rem] md:border-t ${
              inverse
                ? "md:min-h-0 md:border-[var(--line-inverse)] md:py-5 md:pr-0"
                : "md:min-h-48 md:border-[var(--line)] md:py-6 md:pr-[1.4rem]"
            }`}
            key={item.title}
          >
            <span
              className={`technical-details__number font-display md:text-[0.78rem] ${
                inverse ? "md:text-white/50" : "md:text-[var(--ink-soft)]"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="m-0 font-display text-[0.98rem] font-medium leading-[1.3]">
                {item.title}
              </h3>
              {item.label ? (
                <p className="technical-details__label !mb-[0.45rem] font-display !text-[0.56rem] tracking-[0.16em] uppercase">
                  {item.label}
                </p>
              ) : null}
              <p
                className={`technical-details__body mt-[0.7rem] mb-0 text-[0.7rem] leading-[1.65] ${
                  inverse ? "text-white/[0.58]" : "text-[var(--ink-soft)]"
                }`}
              >
                {item.body}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="technical-details__mobile border-t border-current md:hidden">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `technical-panel-${item.id}`;

          return (
            <div
              className={`technical-disclosure border-b ${
                inverse ? "border-[var(--line-inverse)]" : "border-[var(--line)]"
              }`}
              key={item.title}
            >
              <button
                className="grid min-h-[4.25rem] w-full grid-cols-[2.1rem_1fr_auto] items-center gap-[0.6rem] border-0 bg-transparent p-0 text-left font-display font-medium text-[inherit]"
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="technical-disclosure__number font-display text-[0.72rem] opacity-[0.58]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.mobileTitle || item.title}</span>
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
                className={`technical-disclosure__panel grid transition-[grid-template-rows,opacity] duration-[180ms] ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
                id={panelId}
                aria-hidden={!isOpen}
              >
                <div
                  className={`min-h-0 overflow-hidden px-[2.7rem] ${
                    isOpen ? "pb-[1.35rem]" : ""
                  }`}
                >
                  {item.label ? (
                    <p className="technical-details__label !mb-[0.45rem] font-display !text-[0.56rem] tracking-[0.16em] uppercase">
                      {item.label}
                    </p>
                  ) : null}
                  <p
                    className={`m-0 text-[0.75rem] leading-[1.6] ${
                      inverse ? "text-white/[0.62]" : "text-[var(--ink-soft)]"
                    }`}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
