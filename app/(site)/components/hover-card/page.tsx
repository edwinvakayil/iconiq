"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { hoverCardApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  HoverCard as BaseHoverCard,
  HoverCardContent as BaseHoverCardContent,
  HoverCardTrigger as BaseHoverCardTrigger,
} from "@/registry/b-hover-card";
import {
  HoverCard as RadixHoverCard,
  HoverCardContent as RadixHoverCardContent,
  HoverCardTrigger as RadixHoverCardTrigger,
} from "@/registry/r-hover-card";

type ProviderConfig = {
  componentName: "b-hover-card" | "r-hover-card";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  preview: ReactNode;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Hover Card" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-hover-card": `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/b-hover-card";

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
    </div>
  );
}`,
  "r-hover-card": `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/r-hover-card";

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
    </div>
  );
}`,
};

function getDetails(provider: ProviderConfig): DetailItem[] {
  return hoverCardApiDetails.map((item) => {
    if (item.id === "hover-card") {
      return {
        ...item,
        notes: [
          "Open state is internal only. This implementation does not expose a controlled open prop or state-change callback.",
          provider.libraryLabel === "Base UI"
            ? "The root keeps the original hover and focus timing, while Base UI Popover handles floating positioning and viewport-aware placement."
            : "The root keeps the original hover and focus timing, while Radix Hover Card handles portal-based positioning and collision-aware placement.",
          "Pending timers are cleared before every new open or close request and again during unmount cleanup.",
        ],
      };
    }

    if (item.id === "hover-card-content") {
      return {
        ...item,
        notes: [
          "Additional motion.div props such as style, role, onClick, aria-*, and data-* are forwarded, but initial, animate, exit, and transition are reserved by the component.",
          provider.libraryLabel === "Base UI"
            ? "The panel is portaled through Base UI popover positioner and popup primitives, while preserving the same spring-driven blur, scale, and directional offset animation."
            : "The panel is portaled through Radix Hover Card content, while preserving the same spring-driven blur, scale, and directional offset animation.",
          "Focus can move from the trigger into interactive content without immediately closing the card.",
          "By default the content is centered below the trigger with a fixed w-72 width and a 12px hover bridge across the trigger-to-panel gap.",
        ],
      };
    }

    if (item.id === "registry" || item.registryPath) {
      return {
        ...item,
        notes: [
          `Dependencies: ${provider.dependencyLabel}.`,
          ...provider.notes,
          `The generated registry file is /r/${provider.componentName}.json.`,
        ],
        registryPath: `${provider.componentName}.json`,
      };
    }

    return item;
  });
}

export default function RadixBaseHoverCardPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-hover-card",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Uses Base UI popover primitives to recreate the same hover-card surface because Base UI does not ship a dedicated hover card primitive.",
          "Preserves the original delayed hover reveal, instant focus open, and spring-driven content motion.",
        ],
        preview: (
          <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-5 px-4 py-10">
            <BaseHoverCard openDelay={100}>
              <BaseHoverCardTrigger asChild>
                <button
                  className="inline-flex items-center font-medium text-[15px] text-foreground tracking-[-0.02em] decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:underline hover:decoration-foreground focus-visible:underline focus-visible:decoration-foreground focus-visible:outline-none"
                  type="button"
                >
                  View profile
                </button>
              </BaseHoverCardTrigger>
              <BaseHoverCardContent className="w-[320px]">
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
                    Leading onboarding, motion systems, and dense product
                    surfaces across the core workspace.
                  </p>
                </div>
              </BaseHoverCardContent>
            </BaseHoverCard>

            <p className="max-w-sm text-center text-[13px] text-secondary leading-6">
              Hover for delayed reveal or focus the trigger to compare the same
              API on a Base UI popover-backed install.
            </p>
          </div>
        ),
        usageCode: usageCodeByProvider["b-hover-card"],
      };
    }

    return {
      componentName: "r-hover-card",
      dependencyLabel:
        "@radix-ui/react-hover-card, @radix-ui/react-slot, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Uses the dedicated Radix Hover Card primitive instead of Radix Popover for the floating surface.",
        "Preserves the original delayed hover reveal, instant focus open, and spring-driven content motion.",
      ],
      preview: (
        <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-5 px-4 py-10">
          <RadixHoverCard openDelay={100}>
            <RadixHoverCardTrigger asChild>
              <button
                className="inline-flex items-center font-medium text-[15px] text-foreground tracking-[-0.02em] decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:underline hover:decoration-foreground focus-visible:underline focus-visible:decoration-foreground focus-visible:outline-none"
                type="button"
              >
                View profile
              </button>
            </RadixHoverCardTrigger>
            <RadixHoverCardContent className="w-[320px]">
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
            </RadixHoverCardContent>
          </RadixHoverCard>

          <p className="max-w-sm text-center text-[13px] text-secondary leading-6">
            Hover for delayed reveal or focus the trigger to compare the same
            API on the dedicated Radix Hover Card primitive.
          </p>
        </div>
      ),
      usageCode: usageCodeByProvider["r-hover-card"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same hover card API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/hover-card/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="hover-card"
      pageUrl="/components/hover-card"
      preview={provider.preview}
      title="Hover Card"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
