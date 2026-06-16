"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { liquidMarqueeApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { liquidMarqueePreviewCode } from "@/lib/component-v0-pages";
import { LiquidMarquee } from "@/registry/liquid-marquee";

const marqueeItems = [
  "Vercel",
  "Next.js",
  "V0",
  "shadcn/ui",
  "TypeScript",
  "Motion",
  "Radix UI",
  "Base UI",
];

const usageCode = `"use client";

import { LiquidMarquee } from "@/components/ui/liquid-marquee";

const items = [
  "Vercel",
  "Next.js",
  "V0",
  "shadcn/ui",
  "TypeScript",
  "Motion",
  "Radix UI",
  "Base UI",
];

export function LiquidMarqueePreview() {
  return (
    <LiquidMarquee speed={55} pauseOnHover>
      <div className="flex items-center gap-10 px-5">
        {items.map((item) => (
          <span
            key={item}
            className="whitespace-nowrap font-medium text-foreground text-lg tracking-tight"
          >
            {item}
          </span>
        ))}
      </div>
    </LiquidMarquee>
  );
}`;

function LiquidMarqueePreview() {
  return (
    <div className="flex w-full items-center px-4 py-14">
      <LiquidMarquee className="w-full" pauseOnHover speed={55}>
        <div className="flex items-center gap-10 px-5">
          {marqueeItems.map((item) => (
            <span
              className="whitespace-nowrap font-medium text-foreground text-lg tracking-tight"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      </LiquidMarquee>
    </div>
  );
}

export default function LiquidMarqueePage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Display & Content" },
        { label: "Liquid Marquee" },
      ]}
      componentName="liquid-marquee"
      description="Marquee with liquid distortion and edge fades."
      details={liquidMarqueeApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/liquid-marquee/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/liquid-marquee"
      preview={<LiquidMarqueePreview />}
      previewClassName="relative min-h-[12rem] overflow-hidden px-0 md:px-0"
      previewCode={liquidMarqueePreviewCode}
      previewDescription="A horizontal ticker of stack labels with liquid distortion, gradient edge masks, and pause-on-hover."
      title="Liquid Marquee"
      usageCode={usageCode}
      usageDescription="Wrap any row of content in `LiquidMarquee`. Tune `speed` and `direction` for scroll behavior, and set `pauseOnHover` when the strip should stop on pointer hover."
      v0PageCode={liquidMarqueePreviewCode}
    />
  );
}
