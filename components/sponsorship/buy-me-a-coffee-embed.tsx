"use client";

import Script from "next/script";
import { LINK, SITE } from "@/constants";

const BMC_SLUG = "edwinvakayil";
const WIDGET_SCRIPT_URL =
  "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";

export function BuyMeACoffeeEmbed() {
  return (
    <>
      <Script
        data-description={`Support ${SITE.NAME} — thank you!`}
        data-id={BMC_SLUG}
        data-message={`Support ${SITE.NAME} and help keep the motion-powered component library free and open-source.`}
        data-name="BMC-Widget"
        src={WIDGET_SCRIPT_URL}
        strategy="afterInteractive"
      />
      <a
        className="dark:!text-black dark:hover:!text-black inline-flex items-center gap-1.5 rounded-md border border-black bg-black px-3.5 py-2 font-medium font-sans text-sm text-white transition-opacity hover:opacity-90 focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-2 sm:text-base dark:border-white dark:bg-white"
        href={LINK.BUYMEACOFFEE}
        rel="noopener noreferrer"
        target="_blank"
      >
        Enjoying {SITE.NAME} ? Fuel the motion<span aria-hidden>⚡️</span>
      </a>
    </>
  );
}
