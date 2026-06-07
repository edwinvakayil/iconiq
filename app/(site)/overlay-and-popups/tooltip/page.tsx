"use client";

import {
  type ComponentType,
  type ReactElement,
  useMemo,
  useState,
} from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { tooltipApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { cn } from "@/lib/utils";
import * as BaseTooltip from "@/registry/b-tooltip";
import * as RadixTooltip from "@/registry/r-tooltip";

type TooltipSide = "top" | "bottom" | "left" | "right";
type TooltipTriggerElement = ReactElement<{
  "aria-describedby"?: string;
}>;

type TooltipModule = {
  Tooltip: ComponentType<{
    children: TooltipTriggerElement;
    content: string;
    side?: TooltipSide;
    delay?: number;
    className?: string;
    reducedMotion?: boolean;
  }>;
};

type ProviderConfig = {
  componentName: "b-tooltip" | "r-tooltip";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: TooltipModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Overlay & Popups" },
  { label: "Tooltip" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-tooltip": `import { Tooltip } from "@/components/ui/b-tooltip";

const triggerClass =
  "rounded-lg px-0.5 font-semibold underline decoration-dotted underline-offset-[5px] transition-colors";

export function TooltipPreview() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-8 px-4 py-8">
      <blockquote className="max-w-lg text-center">
        <p className="text-lg font-medium leading-relaxed tracking-tight dark:text-neutral-100">
          Win the{" "}
          <Tooltip content="Press, recycle, stay compact." delay={0.12} side="top">
            <button
              className={\`\${triggerClass} text-emerald-700 decoration-emerald-500/40 dark:text-emerald-400\`}
              type="button"
            >
              midfield
            </button>
          </Tooltip>
          , then{" "}
          <Tooltip content="One ball behind the line." side="bottom">
            <button
              className={\`\${triggerClass} text-sky-700 decoration-sky-500/40 dark:text-sky-400\`}
              type="button"
            >
              break the last line
            </button>
          </Tooltip>
          — that&apos;s the half in two beats.
        </p>
      </blockquote>

      <p className="max-w-sm text-center text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        Hover the calls or{" "}
        <Tooltip content="Tab in — same note." side="right">
          <button
            className={\`\${triggerClass} text-neutral-700 decoration-neutral-400/70 dark:text-neutral-300\`}
            type="button"
          >
            use the keyboard
          </button>
        </Tooltip>
        .
      </p>
    </div>
  );
}`,
  "r-tooltip": `import { Tooltip } from "@/components/ui/r-tooltip";

const triggerClass =
  "rounded-lg px-0.5 font-semibold underline decoration-dotted underline-offset-[5px] transition-colors";

export function TooltipPreview() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-8 px-4 py-8">
      <blockquote className="max-w-lg text-center">
        <p className="text-lg font-medium leading-relaxed tracking-tight dark:text-neutral-100">
          Win the{" "}
          <Tooltip content="Press, recycle, stay compact." delay={0.12} side="top">
            <button
              className={\`\${triggerClass} text-emerald-700 decoration-emerald-500/40 dark:text-emerald-400\`}
              type="button"
            >
              midfield
            </button>
          </Tooltip>
          , then{" "}
          <Tooltip content="One ball behind the line." side="bottom">
            <button
              className={\`\${triggerClass} text-sky-700 decoration-sky-500/40 dark:text-sky-400\`}
              type="button"
            >
              break the last line
            </button>
          </Tooltip>
          — that&apos;s the half in two beats.
        </p>
      </blockquote>

      <p className="max-w-sm text-center text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        Hover the calls or{" "}
        <Tooltip content="Tab in — same note." side="right">
          <button
            className={\`\${triggerClass} text-neutral-700 decoration-neutral-400/70 dark:text-neutral-300\`}
            type="button"
          >
            use the keyboard
          </button>
        </Tooltip>
        .
      </p>
    </div>
  );
}`,
};

function TooltipPreview({ ui }: { ui: TooltipModule }) {
  const { Tooltip } = ui;
  const triggerClass =
    "rounded-lg px-0.5 font-semibold underline decoration-dotted underline-offset-[5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/60";

  return (
    <div className="flex min-h-[260px] flex-1 flex-col items-center justify-center gap-8 px-4 py-8">
      <blockquote className="max-w-lg text-center">
        <p className="font-medium font-sans text-lg text-neutral-800 leading-relaxed tracking-tight sm:text-xl dark:text-neutral-100">
          Win the{" "}
          <Tooltip
            content="Press, recycle, stay compact."
            delay={0.12}
            side="top"
          >
            <button
              className={cn(
                triggerClass,
                "text-emerald-700 decoration-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
              )}
              type="button"
            >
              midfield
            </button>
          </Tooltip>
          , then{" "}
          <Tooltip content="One ball behind the line." side="bottom">
            <button
              className={cn(
                triggerClass,
                "text-sky-700 decoration-sky-500/40 hover:bg-sky-500/10 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
              )}
              type="button"
            >
              break the last line
            </button>
          </Tooltip>
          — that’s the half in two beats.
        </p>
      </blockquote>
      <p className="max-w-sm text-center font-sans text-[13px] text-neutral-500 leading-relaxed dark:text-neutral-400">
        Hover the calls or{" "}
        <Tooltip content="Tab in — same note." side="right">
          <button
            className={cn(
              triggerClass,
              "text-neutral-700 decoration-neutral-400/70 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            )}
            type="button"
          >
            use the keyboard
          </button>
        </Tooltip>
        .
      </p>
    </div>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return tooltipApiDetails.map((item) => {
    if (item.id === "tooltip") {
      return {
        ...item,
        summary: `Compact hover and focus tooltip with the same Iconiq bubble, arrow, and spring timing layered over ${provider.libraryLabel} primitives.`,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Uses Base UI Tooltip root and trigger primitives to emit open and close requests immediately, then applies the same controlled delay timer as the core tooltip component."
            : "Uses Radix Tooltip root and trigger primitives, but keeps the delay timer in component state so hover and focus timing match the core tooltip implementation.",
          "Development builds warn when tooltip content grows beyond a short single-line hint.",
        ],
      };
    }

    if (item.id === "tooltip-positioning") {
      return {
        ...item,
        summary:
          "The tooltip is portaled through the selected headless library while preserving the same bubble shell, rotated-square arrow, and collision settings.",
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Uses Base UI Tooltip portal, positioner, and popup primitives for placement while keeping the exact Iconiq tooltip surface and arrow shell."
            : "Uses Radix Tooltip portal and content primitives for placement while keeping the exact Iconiq tooltip surface and arrow shell.",
          "The trigger receives an aria-describedby link to the active tooltip bubble.",
          "The popup keeps avoidCollisions with collisionPadding=12 and sideOffset=10.",
          "The arrow is still a rotated square whose placement follows the resolved side data attribute.",
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

export default function RadixBaseTooltipPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-tooltip",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI tooltip with the same public content, side, delay, and reducedMotion API as the Radix version.",
          "Preserves the same tooltip bubble classes, rotated-square arrow, controlled delay semantics, and spring timing as the core Iconiq tooltip component.",
        ],
        ui: BaseTooltip,
        usageCode: usageCodeByProvider["b-tooltip"],
      };
    }

    return {
      componentName: "r-tooltip",
      dependencyLabel: "@radix-ui/react-tooltip, @radix-ui/react-slot, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix tooltip with the same public content, side, delay, and reducedMotion API as the Base UI version.",
        "Preserves the same tooltip bubble classes, rotated-square arrow, controlled delay semantics, and spring timing as the core Iconiq tooltip component.",
      ],
      ui: RadixTooltip,
      usageCode: usageCodeByProvider["r-tooltip"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Small hint surface for labels, shortcuts, and extra context."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/overlay-and-popups/tooltip/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="tooltip"
      pageUrl="/overlay-and-popups/tooltip"
      preview={<TooltipPreview ui={provider.ui} />}
      title="Tooltip"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
