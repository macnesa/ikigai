"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import {
  gsap,
  MOTION_MEDIA,
  shouldLimitMotion,
  useGSAP,
} from "./HomeMotion";

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
  const sectionRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      whatsapp: "",
      propertyType: "",
      location: "",
      interest: "",
      termsDraft: false,
      updatesDraft: false,
      website: "",
    },
  });
  const [notice, setNotice] = useState({ type: "", message: "" });

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

      const eyebrow = section.querySelector(".consultation__eyebrow");
      const heading = section.querySelector(".consultation__heading");
      const body = section.querySelector(".consultation__body");
      const checklist = section.querySelector(".consultation__checklist");
      const form = section.querySelector(".consultation__form");

      if (!eyebrow || !heading || !body || !checklist || !form) {
        return;
      }

      const mediaQueries = gsap.matchMedia();

      const addEntrance = (query, values) => {
        mediaQueries.add(query, () => {
          const timeline = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
            scrollTrigger: {
              trigger: section,
              start: values.start,
              once: true,
            },
          });

          timeline
            .fromTo(
              eyebrow,
              {
                autoAlpha: 0,
                y: values.eyebrowY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
              },
              0,
            )
            .fromTo(
              heading,
              {
                autoAlpha: 0,
                y: values.headingY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.82,
              },
              0.08,
            )
            .fromTo(
              body,
              {
                autoAlpha: 0,
                y: values.bodyY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
              },
              0.28,
            )
            .fromTo(
              checklist,
              {
                autoAlpha: 0,
                y: values.checklistY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.66,
              },
              0.42,
            )
            .fromTo(
              form,
              {
                autoAlpha: 0,
                y: values.formY,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.76,
              },
              values.formPosition,
            );

          return () => timeline.kill();
        });
      };

      addEntrance(MOTION_MEDIA.desktop, {
        eyebrowY: 6,
        headingY: 34,
        bodyY: 18,
        checklistY: 20,
        formY: 20,
        formPosition: 0.16,
        start: "top 76%",
      });

      addEntrance(MOTION_MEDIA.tablet, {
        eyebrowY: 5,
        headingY: 28,
        bodyY: 16,
        checklistY: 18,
        formY: 20,
        formPosition: 0.5,
        start: "top 80%",
      });

      addEntrance(MOTION_MEDIA.mobile, {
        eyebrowY: 4,
        headingY: 22,
        bodyY: 13,
        checklistY: 15,
        formY: 18,
        formPosition: 0.5,
        start: "top 84%",
      });

      return () => mediaQueries.revert();
    },
    {
      scope: sectionRef,
    },
  );

  const onSubmit = async (data) => {
    setNotice({
      type: "status",
      message: "Sending your consultation request...",
    });

    const payload = {
      name: data.name.trim(),
      whatsapp: data.whatsapp.trim(),
      propertyType: data.propertyType.trim(),
      location: data.location.trim(),
      interest: data.interest,
      termsAccepted: data.termsDraft === true,
      marketingConsent: data.updatesDraft === true,
      website: data.website.trim(),
    };

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let responseBody = null;

      try {
        responseBody = await response.json();
      } catch {
        responseBody = null;
      }

      if (!response.ok || responseBody?.ok !== true) {
        const serverFieldMap = {
          name: "name",
          whatsapp: "whatsapp",
          propertyType: "propertyType",
          location: "location",
          interest: "interest",
          termsAccepted: "termsDraft",
          marketingConsent: "updatesDraft",
        };

        if (responseBody?.errors && typeof responseBody.errors === "object") {
          for (const [field, message] of Object.entries(responseBody.errors)) {
            const formField = serverFieldMap[field];

            if (formField && typeof message === "string") {
              setError(formField, {
                type: "server",
                message,
              });
            }
          }
        }

        setNotice({
          type: "error",
          message:
            typeof responseBody?.message === "string"
              ? responseBody.message
              : "We couldn't send your request right now. Please try again.",
        });
        return;
      }

      reset();
      setNotice({
        type: "success",
        message: "Thank you. Your consultation request has been sent.",
      });
    } catch {
      setNotice({
        type: "error",
        message: "We couldn't send your request right now. Please try again.",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="consultation"
      aria-labelledby="consultation-title"
      className="consultation dark-surface dark-surface--conversion bg-[var(--night)] py-[4.75rem] text-white md:py-[clamp(7rem,8vw,9.5rem)]"
    >
      <div className="site-container mx-auto grid w-full max-w-[105rem] gap-y-[0.8rem] px-[var(--page-gutter)] lg:grid-cols-[minmax(0,1.08fr)_minmax(32rem,0.92fr)] lg:grid-rows-[auto_1fr] lg:gap-x-[clamp(4.5rem,7vw,9rem)] lg:gap-y-[0.85rem]">
        <p className="eyebrow consultation__eyebrow m-0 font-display text-[0.66rem] font-semibold leading-[1.2] tracking-[0.18em] text-white/[0.62] uppercase lg:col-start-1 lg:row-start-1">
          Free wellness consultation
        </p>

        <div className="lg:col-start-1 lg:row-start-2">
          <h2
            id="consultation-title"
            className="consultation__heading m-0 max-w-[15ch] font-display text-[length:var(--standard-section-heading-size)] font-medium leading-[1.02] tracking-[-0.042em]"
          >
            Planning a Wellness Space? Talk to Our Team
          </h2>

          <p className="consultation__body mt-[1.25rem] mb-0 max-w-[35rem] text-[length:var(--type-section-intro-prominent)] leading-[1.65] text-white/[0.68] md:leading-[1.6]">
            You don&apos;t need to know exactly which sauna, ice bath or
            technical setup you need. Tell us about your property — we&apos;ll
            explain what&apos;s possible and what to do next.
          </p>

          <div className="relative mt-[1.75rem] aspect-[12/5] w-full overflow-hidden bg-[#414957] md:mt-[2rem]">
            <img
              src="https://ik.imagekit.io/ikigaiwellness/ikigai/home/image_2026-08-30_17-21-40.png"
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="consultation__checklist mt-[1.6rem]">
            <p className="m-0 font-display text-[length:var(--type-small-label)] font-semibold leading-[1.2] tracking-[0.18em] text-white/[0.6] uppercase">
              During your consultation we&apos;ll discuss
            </p>

            <ul className="mt-[1rem] mb-0 grid gap-x-[2.5rem] gap-y-[0.72rem] p-0 [list-style:none] sm:grid-cols-2 md:gap-y-[0.6rem]">
              {consultationChecklist.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-[0.65rem] text-[length:var(--type-consultation-checklist)] leading-[1.42] text-white/[0.76]"
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
          className="consultation__form mt-[2.75rem] lg:col-start-2 lg:row-start-2 lg:mt-0"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h3 className="mt-0 mb-[1.8rem] max-w-[22rem] font-display text-[1.5rem] font-medium leading-[1.1] tracking-[-0.03em] md:text-[1.6rem]">
            Book your free wellness consultation
          </h3>

          <div
            className="absolute left-[-9999px] h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="consultation-website">Website</label>
            <input
              id="consultation-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

          <div className="grid gap-y-[1.55rem] md:grid-cols-2 md:gap-x-[1.35rem] md:gap-y-[1.7rem]">
            <label className="grid gap-[0.4rem] font-display text-[length:var(--type-small-label)] font-semibold tracking-[0.14em] text-white/[0.6] uppercase">
              <span>Name</span>

              <input
                className="font-body w-full rounded-none border-0 border-b border-white/[0.2] bg-transparent px-0 py-[0.72rem] text-[0.88rem] font-normal tracking-normal text-white normal-case outline-none transition-colors duration-[160ms] placeholder:text-white/[0.42] focus:border-white/[0.78]"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "consultation-name-error" : undefined}
                {...register("name", {
                  required: "Name is required.",
                  maxLength: {
                    value: 100,
                    message: "Name must be 100 characters or fewer.",
                  },
                  validate: (value) =>
                    value.trim().length > 0 || "Name is required.",
                })}
              />

              {errors.name ? (
                <span
                  id="consultation-name-error"
                  className="font-body text-[0.68rem] font-normal tracking-normal text-[#f4c7c3] normal-case"
                >
                  {errors.name.message}
                </span>
              ) : null}
            </label>

            <label className="grid gap-[0.4rem] font-display text-[length:var(--type-small-label)] font-semibold tracking-[0.14em] text-white/[0.6] uppercase">
              <span>WhatsApp</span>

              <input
                className="font-body w-full rounded-none border-0 border-b border-white/[0.2] bg-transparent px-0 py-[0.72rem] text-[0.88rem] font-normal tracking-normal text-white normal-case outline-none transition-colors duration-[160ms] placeholder:text-white/[0.42] focus:border-white/[0.78]"
                type="tel"
                placeholder="+62 …"
                autoComplete="tel"
                aria-invalid={Boolean(errors.whatsapp)}
                aria-describedby={
                  errors.whatsapp ? "consultation-whatsapp-error" : undefined
                }
                {...register("whatsapp", {
                  required: "WhatsApp number is required.",
                  maxLength: {
                    value: 40,
                    message: "WhatsApp number must be 40 characters or fewer.",
                  },
                  validate: {
                    requiredTrimmed: (value) =>
                      value.trim().length > 0 ||
                      "WhatsApp number is required.",
                    format: (value) => {
                      const normalizedValue = value.trim();
                      const digitCount = (normalizedValue.match(/\d/g) || [])
                        .length;

                      return (
                        (/^[+\d().\-\s]+$/.test(normalizedValue) &&
                          digitCount >= 6) ||
                        "Enter a valid WhatsApp number."
                      );
                    },
                  },
                })}
              />

              {errors.whatsapp ? (
                <span
                  id="consultation-whatsapp-error"
                  className="font-body text-[0.68rem] font-normal tracking-normal text-[#f4c7c3] normal-case"
                >
                  {errors.whatsapp.message}
                </span>
              ) : null}
            </label>

            <label className="grid gap-[0.4rem] font-display text-[length:var(--type-small-label)] font-semibold tracking-[0.14em] text-white/[0.6] uppercase">
              <span>Property / Project type</span>

              <input
                className="font-body w-full rounded-none border-0 border-b border-white/[0.2] bg-transparent px-0 py-[0.72rem] text-[0.88rem] font-normal tracking-normal text-white normal-case outline-none transition-colors duration-[160ms] placeholder:text-white/[0.42] focus:border-white/[0.78]"
                type="text"
                placeholder="Villa, hotel, residence …"
                aria-invalid={Boolean(errors.propertyType)}
                aria-describedby={
                  errors.propertyType
                    ? "consultation-property-type-error"
                    : undefined
                }
                {...register("propertyType", {
                  required: "Property or project type is required.",
                  maxLength: {
                    value: 120,
                    message:
                      "Property or project type must be 120 characters or fewer.",
                  },
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Property or project type is required.",
                })}
              />

              {errors.propertyType ? (
                <span
                  id="consultation-property-type-error"
                  className="font-body text-[0.68rem] font-normal tracking-normal text-[#f4c7c3] normal-case"
                >
                  {errors.propertyType.message}
                </span>
              ) : null}
            </label>

            <label className="grid gap-[0.4rem] font-display text-[length:var(--type-small-label)] font-semibold tracking-[0.14em] text-white/[0.6] uppercase">
              <span>Location</span>

              <input
                className="font-body w-full rounded-none border-0 border-b border-white/[0.2] bg-transparent px-0 py-[0.72rem] text-[0.88rem] font-normal tracking-normal text-white normal-case outline-none transition-colors duration-[160ms] placeholder:text-white/[0.42] focus:border-white/[0.78]"
                type="text"
                placeholder="Canggu, Ubud, Jakarta …"
                autoComplete="address-level2"
                aria-invalid={Boolean(errors.location)}
                aria-describedby={
                  errors.location ? "consultation-location-error" : undefined
                }
                {...register("location", {
                  required: "Location is required.",
                  maxLength: {
                    value: 120,
                    message: "Location must be 120 characters or fewer.",
                  },
                  validate: (value) =>
                    value.trim().length > 0 || "Location is required.",
                })}
              />

              {errors.location ? (
                <span
                  id="consultation-location-error"
                  className="font-body text-[0.68rem] font-normal tracking-normal text-[#f4c7c3] normal-case"
                >
                  {errors.location.message}
                </span>
              ) : null}
            </label>
          </div>

          <fieldset
            className="mt-[1.9rem] border-0 p-0"
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={
              errors.interest ? "consultation-interest-error" : undefined
            }
          >
            <legend className="font-display text-[length:var(--type-small-label)] font-semibold tracking-[0.14em] text-white/[0.6] uppercase">
              What are you interested in?
            </legend>

            <div className="mt-[0.9rem] grid grid-cols-2 gap-2 md:flex md:flex-wrap">
              {interestOptions.map((option) => (
                <label
                  key={option.value}
                  className="relative inline-flex w-full font-display font-medium md:w-auto"
                >
                  <input
                    className="peer absolute opacity-0"
                    type="radio"
                    value={option.value}
                    {...register("interest", {
                      required: "Please select an interest.",
                    })}
                  />

                  <span className="inline-flex min-h-[3rem] w-full items-center justify-center border border-white/[0.2] bg-transparent px-[0.85rem] py-[0.7rem] text-center text-[0.72rem] leading-[1.18] text-white/[0.8] transition-[background-color,color,border-color] duration-[160ms] hover:border-white/[0.44] hover:text-white peer-checked:border-white peer-checked:bg-white peer-checked:text-[var(--ink)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-white md:min-h-[2.65rem] md:w-auto md:px-[1rem] md:text-[0.72rem] md:leading-none">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {errors.interest ? (
              <p
                id="consultation-interest-error"
                className="font-body mt-[0.55rem] mb-0 text-[0.68rem] font-normal tracking-normal text-[#f4c7c3] normal-case"
              >
                {errors.interest.message}
              </p>
            ) : null}
          </fieldset>

          <div className="mt-[1.3rem] grid gap-[0.8rem]">
            <label className="group flex cursor-pointer items-start gap-[0.65rem] text-[0.71rem] leading-[1.48] text-white/[0.52]">
              <span className="relative mt-[0.08rem] flex h-[0.95rem] w-[0.95rem] shrink-0 items-center justify-center">
                <input
                  className="peer absolute inset-0 h-full w-full appearance-none border border-white/[0.42] bg-transparent outline-none transition-[background-color,border-color] checked:border-white checked:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                  type="checkbox"
                  aria-invalid={Boolean(errors.termsDraft)}
                  aria-describedby={
                    errors.termsDraft ? "consultation-terms-error" : undefined
                  }
                  {...register("termsDraft", {
                    required:
                      "You must accept the terms and privacy policy.",
                  })}
                />

                <Check
                  className="pointer-events-none absolute h-[0.7rem] w-[0.7rem] text-[var(--ink)] opacity-0 transition-opacity peer-checked:opacity-100"
                  aria-hidden="true"
                  strokeWidth={2}
                />
              </span>

              <span>
                I agree to the Terms &amp; Conditions and Privacy Policy
              </span>
            </label>

            {errors.termsDraft ? (
              <p
                id="consultation-terms-error"
                className="mt-[-0.35rem] mb-0 pl-[1.6rem] text-[0.68rem] leading-[1.45] text-[#f4c7c3]"
              >
                {errors.termsDraft.message}
              </p>
            ) : null}

            <label className="group flex cursor-pointer items-start gap-[0.65rem] text-[0.71rem] leading-[1.48] text-white/[0.52]">
              <span className="relative mt-[0.08rem] flex h-[0.95rem] w-[0.95rem] shrink-0 items-center justify-center">
                <input
                  className="peer absolute inset-0 h-full w-full appearance-none border border-white/[0.42] bg-transparent outline-none transition-[background-color,border-color] checked:border-white checked:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                  type="checkbox"
                  {...register("updatesDraft")}
                />

                <Check
                  className="pointer-events-none absolute h-[0.7rem] w-[0.7rem] text-[var(--ink)] opacity-0 transition-opacity peer-checked:opacity-100"
                  aria-hidden="true"
                  strokeWidth={2}
                />
              </span>

              <span>
                Send me occasional updates from IKIGAI.{" "}
                <strong className="font-medium text-white/[0.68]">
                  Optional
                </strong>
              </span>
            </label>
          </div>

          <button
            className="pill-button pill-button--standard pill-button--light mt-[1.45rem] inline-flex min-h-[3.5rem] w-full items-center justify-center text-center font-display text-[0.82rem] font-semibold leading-none tracking-[0.025em] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Book my free consultation"}
          </button>

          <p className="mt-[0.9rem] mb-0 max-w-[31rem] text-[0.68rem] leading-[1.55] text-white/[0.52]">
            No obligation. Tell us about your project and we&apos;ll help you
            understand your options.
          </p>

          {notice.message ? (
            <p
              className="mt-[0.7rem] mb-0 text-[0.68rem] leading-[1.55] text-white/[0.52]"
              aria-live="polite"
              role="status"
            >
              {notice.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
