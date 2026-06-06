"use client";

import { Bold } from "lucide-react";
import { type ComponentType, type ReactNode, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { toggleApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { cn } from "@/lib/utils";
import * as BaseToggle from "@/registry/b-toggle";
import * as RadixToggle from "@/registry/r-toggle";

type ToggleModule = {
  Toggle: ComponentType<{
    children: ReactNode;
    className?: string;
    defaultPressed?: boolean;
    disabled?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    pressed?: boolean;
    reducedMotion?: boolean;
    size?: "default" | "sm" | "lg";
    variant?: "default" | "outline";
    "aria-label"?: string;
    "aria-labelledby"?: string;
  }>;
};

type ProviderConfig = {
  componentName: "b-toggle" | "r-toggle";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: ToggleModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Toggle" },
];

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const emphasizedTextClassName = (bold: boolean) =>
  cn(
    "transition-[font-weight,color] duration-200",
    bold
      ? "font-bold text-neutral-950 dark:text-neutral-50"
      : "text-neutral-800 dark:text-neutral-100"
  );

const previewToggleClassName = "size-8 min-h-8 min-w-8 shrink-0 px-2 py-2";

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-toggle": `"use client";

import { Bold } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/b-toggle";

export function TogglePreview() {
  const [bold, setBold] = useState(false);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
        <span>Ship the</span>
        <span
          className={
            bold
              ? "font-bold text-neutral-950 transition-[font-weight,color] duration-200 dark:text-neutral-50"
              : "text-neutral-800 transition-[font-weight,color] duration-200 dark:text-neutral-100"
          }
        >
          release notes
        </span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <Toggle
            aria-label="Toggle bold"
            className="size-8 min-h-8 min-w-8 shrink-0 px-2 py-2"
            onPressedChange={setBold}
            pressed={bold}
            size="sm"
            variant="outline"
          >
            <Bold className="size-4" />
          </Toggle>
        </span>
      </p>
    </div>
  );
}`,
  "r-toggle": `"use client";

import { Bold } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/r-toggle";

export function TogglePreview() {
  const [bold, setBold] = useState(false);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
        <span>Ship the</span>
        <span
          className={
            bold
              ? "font-bold text-neutral-950 transition-[font-weight,color] duration-200 dark:text-neutral-50"
              : "text-neutral-800 transition-[font-weight,color] duration-200 dark:text-neutral-100"
          }
        >
          release notes
        </span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <Toggle
            aria-label="Toggle bold"
            className="size-8 min-h-8 min-w-8 shrink-0 px-2 py-2"
            onPressedChange={setBold}
            pressed={bold}
            size="sm"
            variant="outline"
          >
            <Bold className="size-4" />
          </Toggle>
        </span>
      </p>
    </div>
  );
}`,
};

function TogglePreview({ ui }: { ui: ToggleModule }) {
  const { Toggle } = ui;
  const [bold, setBold] = useState(false);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className={previewSentenceClassName}>
        <span>Ship the</span>
        <span className={emphasizedTextClassName(bold)}>release notes</span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <Toggle
            aria-label="Toggle bold"
            className={previewToggleClassName}
            onPressedChange={setBold}
            pressed={bold}
            size="sm"
            variant="outline"
          >
            <Bold className="size-4" />
          </Toggle>
        </span>
      </p>
    </div>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return toggleApiDetails.map((item) => {
    if (item.id === "toggle") {
      return {
        ...item,
        summary: `Pressed-state toggle with the same shadcn-style shell and motion layered over ${provider.libraryLabel} primitives.`,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Additional Base UI toggle button props such as aria-label, name, value, and type are forwarded through the underlying Toggle primitive surface."
            : "Additional Radix toggle button props such as aria-label, name, value, and type are forwarded through the underlying Toggle.Root surface.",
          provider.libraryLabel === "Base UI"
            ? "The component renders the Base UI Toggle primitive with its render prop internally, then supplies its own motion.button as the visible surface."
            : "The component renders Radix Root with asChild internally, then supplies its own motion.button as the child node.",
          "When you render an icon-only toggle, provide aria-label or aria-labelledby so the control still has a clear accessible name.",
        ],
      };
    }

    if (item.id === "toggle-motion") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on the Base UI Toggle primitive with the same Motion-driven button squash, active-surface transition, and icon choreography as the core toggle."
            : "Built on Radix Toggle.Root with the same Motion-driven button squash, active-surface transition, and icon choreography as the core toggle.",
          ...(item.notes ?? []),
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

export default function RadixBaseTogglePage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-toggle",
        dependencyLabel: "@base-ui/react, class-variance-authority, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI toggle with the same variant, size, pressed, defaultPressed, and reducedMotion API as the Radix version.",
          "Uses the Base UI toggle primitive through its render surface, while preserving the same shadcn-style surface, button squash, and icon motion path.",
        ],
        ui: BaseToggle,
        usageCode: usageCodeByProvider["b-toggle"],
      };
    }

    return {
      componentName: "r-toggle",
      dependencyLabel:
        "@radix-ui/react-toggle, class-variance-authority, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix toggle with the same variant, size, pressed, defaultPressed, and reducedMotion API as the Base UI version.",
        "Keeps the same shadcn-style surface treatment and separate button and icon motion controls as the Base UI version.",
      ],
      ui: RadixToggle,
      usageCode: usageCodeByProvider["r-toggle"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Pressable control for turning a state on or off."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/toggle/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="toggle"
      pageUrl="/components/toggle"
      preview={<TogglePreview ui={provider.ui} />}
      previewDescription="Inline formatting demo where the bold toggle emphasizes release notes in the sentence."
      title="Toggle"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
