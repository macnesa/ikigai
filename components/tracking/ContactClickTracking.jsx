"use client";

import { useEffect } from "react";
import { getContactMethod, pushDataLayer } from "@/lib/tracking";

export default function ContactClickTracking() {
  useEffect(() => {
    const handleClick = (event) => {
      const target =
        event.target instanceof Element
          ? event.target
          : event.target?.parentElement;
      const link = target?.closest("a[href]");

      if (!link) return;

      const contactMethod = getContactMethod(
        link.getAttribute("href"),
        window.location.href,
      );

      if (!contactMethod) return;

      pushDataLayer({
        event: "contact_click",
        contact_method: contactMethod,
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
