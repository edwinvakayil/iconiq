"use client";

import { hoverCardApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
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
        Hover or focus the trigger to inspect the local positioning, open and
        close delay, and spring entrance.
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
        Hover or focus the trigger to inspect the local positioning, open and
        close delay, and spring entrance.
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
      description="Inline hover card with delayed open and close timing, Slot-based custom triggers, and a spring-driven content panel."
      details={hoverCardApiDetails}
      preview={<HoverCardPreview />}
      previewDescription="Hover or focus the trigger to test the timing and anchored content behavior."
      title="Hover Card"
      usageCode={usageCode}
      usageDescription="Compose the root, trigger, and content primitives together, then use the API details to tune timing, trigger composition, and panel behavior."
    />
  );
}
