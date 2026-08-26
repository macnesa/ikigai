"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";

const consultationChecklist = [
  "Your available space and intended usage",
  "Sauna or ice bath options",
  "Existing vs. custom designs",
  "Electrical, drainage and installation",
  "Estimated budget and next steps",
];

const interestOptions = [
  { value: "sauna", label: "Sauna" },
  { value: "ice-bath", label: "Ice Bath" },
  { value: "combined", label: "Sauna + Ice Bath" },
  {
    value: "complete-space",
    label: "Complete Wellness Space",
  },
  { value: "unsure", label: "Not Sure Yet" },
];

export default function Consultation() {
  const { register, handleSubmit } = useForm();
  const [notice, setNotice] = useState("");

  const handlePendingSubmit = () => {
    setNotice("Form submission is pending final client integration.");
  };

  return (
    <section
      className="consultation dark-section"
      id="consultation"
      aria-labelledby="consultation-title"
    >
      <div className="site-container consultation__layout">
        <div className="consultation__content">
          <p className="eyebrow">Free wellness consultation</p>
          <h2 id="consultation-title">Planning a Wellness Space? Talk to Our Team</h2>
          <p className="consultation__intro">
            You don’t need to know exactly what you need. Tell us about your
            property and we’ll explain what’s possible.
          </p>

          <MediaPlaceholder
            className="consultation__media"
            label="Consultation media pending"
          />

          <ul className="consultation__checklist">
            {consultationChecklist.map((item) => (
              <li key={item}>
                <Check aria-hidden="true" size={14} strokeWidth={1.6} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="consultation-form"
          onSubmit={handleSubmit(handlePendingSubmit)}
          noValidate
        >
          <h3>Book your free wellness consultation</h3>

          <div className="consultation-form__grid">
            <label>
              <span>Name</span>
              <input type="text" placeholder="Your name" {...register("name")} />
            </label>
            <label>
              <span>WhatsApp</span>
              <input type="tel" placeholder="+62 …" {...register("whatsapp")} />
            </label>
            <label>
              <span>Property / Project type</span>
              <input
                type="text"
                placeholder="Villa, hotel, residence …"
                {...register("propertyType")}
              />
            </label>
            <label>
              <span>Location</span>
              <input
                type="text"
                placeholder="Canggu, Ubud, Jakarta …"
                {...register("location")}
              />
            </label>
          </div>

          <fieldset className="consultation-form__interests">
            <legend>What are you interested in?</legend>
            <div>
              {interestOptions.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    value={option.value}
                    {...register("interest")}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="consultation-form__check consultation-form__pending-field">
            <input type="checkbox" {...register("termsDraft")} />
            <span>Terms & Conditions and Privacy Policy consent — final logic pending</span>
          </label>
          <label className="consultation-form__check consultation-form__pending-field">
            <input type="checkbox" {...register("updatesDraft")} />
            <span>Occasional IKIGAI updates — optional wording pending</span>
          </label>

          <button className="consultation-form__submit" type="submit">
            Book my free consultation
          </button>
          <p
            className="consultation-form__notice consultation-form__pending-field"
            aria-live="polite"
          >
            {notice}
          </p>
        </form>
      </div>
    </section>
  );
}
