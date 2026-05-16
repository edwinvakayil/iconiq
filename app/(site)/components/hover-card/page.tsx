"use client";

import { hoverCardApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { usageToV0Page } from "@/lib/component-v0-pages";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/hover-card";

const usageCode = `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function HoverCardPreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <HoverCard openDelay={100}>
        <HoverCardTrigger asChild>
          <button
            className="inline-flex items-center text-[15px] font-medium tracking-[-0.02em] text-foreground decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:underline hover:decoration-foreground focus-visible:underline focus-visible:decoration-foreground focus-visible:outline-none"
            type="button"
          >
            View profile
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-[320px]">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-[15px] font-medium text-foreground">
                Edwin Vakayil
              </p>
              <p className="text-[13px] leading-5 text-secondary">
                @edwinvakayil · Design Engineer
              </p>
            </div>
            <p className="text-[14px] leading-6 text-secondary">
              Leading onboarding, motion systems, and dense product surfaces
              across the core workspace.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>

      <p className="max-w-sm text-center text-[13px] leading-6 text-secondary">
        Hover for delayed reveal or focus the trigger to open instantly and
        inspect the positioning.
      </p>
    </div>
  );
}`;

function HoverCardPreview() {
  return (
    <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-5 px-4 py-10">
      <HoverCard openDelay={100}>
        <HoverCardTrigger asChild>
          <button
            className="inline-flex items-center font-medium text-[15px] text-foreground tracking-[-0.02em] decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:underline hover:decoration-foreground focus-visible:underline focus-visible:decoration-foreground focus-visible:outline-none"
            type="button"
          >
            View profile
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-[320px]">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="font-medium text-[15px] text-foreground">
                Edwin Vakayil
              </p>
              <p className="text-[13px] text-secondary leading-5">
                @edwinvakayil · Design Engineer
              </p>
            </div>
            <p className="text-[14px] text-secondary leading-6">
              Leading onboarding, motion systems, and dense product surfaces
              across the core workspace.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>

      <p className="max-w-sm text-center text-[13px] text-secondary leading-6">
        Hover for delayed reveal or focus the trigger to open instantly and
        inspect the positioning.
      </p>
    </div>
  );
}

export default function HoverCardPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Hover Card" },
      ]}
      componentName="hover-card"
      description="Inline hover card with hover-only timing delays, instant focus reveal, collision-aware Popover positioning, and a spring-driven content panel."
      details={hoverCardApiDetails}
      preview={<HoverCardPreview />}
      previewDescription="Hover or focus the trigger to test delayed pointer timing, instant keyboard reveal, and collision-aware positioning."
      title="Hover Card"
      usageCode={usageCode}
      usageDescription="Compose the root, trigger, and content primitives together, then tune hover timing, trigger composition, and collision-aware positioning from the API."
      v0PageCode={usageToV0Page(usageCode)}
    />
  );
}
