"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function TechnicalDetails({ items, inverse = false }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div
      className={`technical-details${inverse ? " technical-details--inverse" : ""}`}
    >
      <div className="technical-details__desktop">
        {items.map((item, index) => (
          <article className="technical-details__item" key={item.title}>
            <span className="technical-details__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{item.title}</h3>
              {item.label ? <p className="technical-details__label">{item.label}</p> : null}
              <p className="technical-details__body">{item.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="technical-details__mobile">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `technical-panel-${item.id}`;

          return (
            <div className="technical-disclosure" key={item.title}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="technical-disclosure__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.mobileTitle || item.title}</span>
                {isOpen ? (
                  <Minus aria-hidden="true" size={18} strokeWidth={1.4} />
                ) : (
                  <Plus aria-hidden="true" size={18} strokeWidth={1.4} />
                )}
              </button>
              <div
                className={`technical-disclosure__panel${isOpen ? " is-open" : ""}`}
                id={panelId}
                aria-hidden={!isOpen}
              >
                <div>
                  {item.label ? (
                    <p className="technical-details__label">{item.label}</p>
                  ) : null}
                  <p>{item.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
