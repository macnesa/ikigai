"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

const consultationChecklist = [
  "Your available space",
  "Sauna or ice bath options",
  "Intended usage and capacity",
  "Estimated budget",
  "What you're looking to create",
  "Existing vs. custom designs",
  "Electrical, drainage, installation",
  "Recommended next steps",
];

const interestOptions = [
  { value: "sauna", label: "Sauna" },
  { value: "ice-bath", label: "Ice Bath" },
  { value: "combined", label: "Sauna + Ice Bath" },
  { value: "complete-space", label: "Complete Wellness Space" },
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
      id="consultation"
      aria-labelledby="consultation-title"
      className="consultation bg-[var(--night)] py-[4.75rem] text-white md:py-[clamp(7rem,8vw,9.5rem)]"
    >
      <div className="site-container mx-auto grid w-full max-w-[105rem] gap-y-[0.8rem] px-[var(--page-gutter)] lg:grid-cols-[minmax(0,1.08fr)_minmax(32rem,0.92fr)] lg:grid-rows-[auto_1fr] lg:gap-x-[clamp(4.5rem,7vw,9rem)] lg:gap-y-[0.85rem]">
        <p className="eyebrow m-0 font-display text-[0.66rem] font-semibold leading-[1.2] tracking-[0.18em] text-white/[0.62] uppercase lg:col-start-1 lg:row-start-1">
          Free wellness consultation
        </p>

        <div className="lg:col-start-1 lg:row-start-2">
          <h2
            id="consultation-title"
            className="m-0 max-w-[15ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em]"
          >
            Planning a Wellness Space? Talk to Our Team
          </h2>

          <p className="mt-[1.25rem] mb-0 max-w-[34rem] text-[0.8rem] leading-[1.65] text-white/[0.68] md:text-[0.9rem] md:leading-[1.6]">
            You don&apos;t need to know exactly which sauna, ice bath or
            technical setup you need. Tell us about your property — we&apos;ll
            explain what&apos;s possible and what to do next.
          </p>

          <div
            className="media-placeholder relative mt-[1.75rem] aspect-[12/5] w-full overflow-hidden bg-[#414957] md:mt-[2rem]"
            aria-hidden="true"
          />

          <div className="mt-[1.6rem]">
            <p className="m-0 font-display text-[0.58rem] font-semibold leading-[1.2] tracking-[0.18em] text-white/[0.58] uppercase">
              During your consultation we&apos;ll discuss
            </p>

            <ul className="mt-[0.95rem] mb-0 grid gap-x-[2.5rem] gap-y-[0.55rem] p-0 [list-style:none] sm:grid-cols-2">
              {consultationChecklist.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-[0.65rem] text-[0.76rem] leading-[1.4] text-white/[0.76]"
                >
                  <Check
                    className="mt-[0.08rem] shrink-0"
                    aria-hidden="true"
                    size={14}
                    strokeWidth={1.7}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form
          className="mt-[2.5rem] lg:col-start-2 lg:row-start-2 lg:mt-0"
          onSubmit={handleSubmit(handlePendingSubmit)}
          noValidate
        >
          <h3 className="mt-0 mb-[1.7rem] font-display text-[1.7rem] font-medium leading-[1.1] tracking-[-0.03em] md:text-[1.85rem]">
            Book your free wellness consultation
          </h3>

          <div className="grid gap-y-[1.5rem] md:grid-cols-2 md:gap-x-[1.35rem] md:gap-y-[1.65rem]">
            <label className="grid gap-[0.4rem] font-display text-[0.56rem] font-semibold tracking-[0.14em] text-white/[0.56] uppercase">
              <span>Name</span>
              <input
                className="font-body w-full rounded-none border-0 border-b border-white/[0.2] bg-transparent px-0 py-[0.72rem] text-[0.86rem] font-normal tracking-normal text-white normal-case outline-none transition-colors placeholder:text-white/[0.42] focus:border-white"
                type="text"
                placeholder="Your name"
                {...register("name")}
              />
            </label>

            <label className="grid gap-[0.4rem] font-display text-[0.56rem] font-semibold tracking-[0.14em] text-white/[0.56] uppercase">
              <span>WhatsApp</span>
              <input
                className="font-body w-full rounded-none border-0 border-b border-white/[0.2] bg-transparent px-0 py-[0.72rem] text-[0.86rem] font-normal tracking-normal text-white normal-case outline-none transition-colors placeholder:text-white/[0.42] focus:border-white"
                type="tel"
                placeholder="+62 …"
                {...register("whatsapp")}
              />
            </label>

            <label className="grid gap-[0.4rem] font-display text-[0.56rem] font-semibold tracking-[0.14em] text-white/[0.56] uppercase">
              <span>Property / Project type</span>
              <input
                className="font-body w-full rounded-none border-0 border-b border-white/[0.2] bg-transparent px-0 py-[0.72rem] text-[0.86rem] font-normal tracking-normal text-white normal-case outline-none transition-colors placeholder:text-white/[0.42] focus:border-white"
                type="text"
                placeholder="Villa, hotel, residence …"
                {...register("propertyType")}
              />
            </label>

            <label className="grid gap-[0.4rem] font-display text-[0.56rem] font-semibold tracking-[0.14em] text-white/[0.56] uppercase">
              <span>Location</span>
              <input
                className="font-body w-full rounded-none border-0 border-b border-white/[0.2] bg-transparent px-0 py-[0.72rem] text-[0.86rem] font-normal tracking-normal text-white normal-case outline-none transition-colors placeholder:text-white/[0.42] focus:border-white"
                type="text"
                placeholder="Canggu, Ubud, Jakarta …"
                {...register("location")}
              />
            </label>
          </div>

          <fieldset className="mt-[1.8rem] border-0 p-0">
            <legend className="font-display text-[0.56rem] font-semibold tracking-[0.14em] text-white/[0.56] uppercase">
              What are you interested in?
            </legend>

            <div className="mt-[0.85rem] flex flex-wrap gap-2">
              {interestOptions.map((option) => (
                <label
                  key={option.value}
                  className="relative inline-flex font-display font-medium"
                >
                  <input
                    className="peer absolute opacity-0"
                    type="radio"
                    value={option.value}
                    {...register("interest")}
                  />
                  <span className="inline-flex min-h-[2.55rem] items-center justify-center border border-white/[0.16] bg-[var(--paper-strong)] px-[1rem] py-[0.65rem] text-center text-[0.72rem] leading-none text-[var(--ink)] transition-[background-color,color,border-color] peer-checked:border-white peer-checked:bg-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-white">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-[1.15rem] grid gap-[0.65rem]">
            <label className="flex cursor-pointer items-start gap-[0.55rem] text-[0.67rem] leading-[1.45] text-white/[0.48]">
              <input
                className="mt-[0.12rem] h-[0.85rem] w-[0.85rem] shrink-0 appearance-none border border-white/[0.42] bg-transparent checked:bg-white"
                type="checkbox"
                {...register("termsDraft")}
              />
              <span>
                I agree to the Terms &amp; Conditions and Privacy Policy
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-[0.55rem] text-[0.67rem] leading-[1.45] text-white/[0.48]">
              <input
                className="mt-[0.12rem] h-[0.85rem] w-[0.85rem] shrink-0 appearance-none border border-white/[0.42] bg-transparent checked:bg-white"
                type="checkbox"
                {...register("updatesDraft")}
              />
              <span>
                Send me occasional updates from IKIGAI.{" "}
                <strong className="font-medium text-white/[0.62]">Optional</strong>
              </span>
            </label>
          </div>

          <button
            className="mt-[1.25rem] min-h-[3.4rem] w-full rounded-[var(--pill)] border border-black bg-black px-[1.5rem] py-[0.9rem] font-display text-[0.82rem] font-medium leading-none tracking-[0.035em] text-white uppercase transition-[background-color,color,border-color] duration-[160ms] hover:border-white hover:bg-transparent"
            type="submit"
          >
            Book my free consultation
          </button>

          <p className="mt-[0.85rem] mb-0 text-[0.65rem] leading-[1.5] text-white/[0.5]">
            No obligation. Tell us about your project and we&apos;ll help you
            understand your options.
          </p>

          {notice ? (
            <p
              className="mt-[0.65rem] mb-0 text-[0.65rem] leading-[1.5] text-white/[0.5]"
              aria-live="polite"
            >
              {notice}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
