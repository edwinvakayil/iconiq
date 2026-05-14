"use client";

import { Coffee } from "lucide-react";
import Script from "next/script";

import { LINK, SITE } from "@/constants";
import { cn } from "@/lib/utils";

const BMC_SLUG = "edwinvakayil";
const WIDGET_SCRIPT_URL =
  "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";

export function BuyMeACoffeeEmbed({ className }: { className?: string }) {
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
        className={cn(
          "inline-flex h-10 items-center justify-center gap-2 rounded-md px-5 font-medium text-sm shadow-sm transition-colors",
          "bg-foreground text-background hover:bg-foreground/90",
          "hover:text-background! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "dark:hover:text-background!",
          className
        )}
        href={LINK.BUYMEACOFFEE}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Coffee aria-hidden className="size-4 shrink-0 opacity-90" strokeWidth={2} />
        Buy a coffee for {SITE.NAME}
      </a>
    </>
  );
}
