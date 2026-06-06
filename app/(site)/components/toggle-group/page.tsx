"use client";

import { type ReactNode, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { toggleGroupApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { cn } from "@/lib/utils";
import * as BaseToggleGroup from "@/registry/b-togglegroup";
import * as RadixToggleGroup from "@/registry/r-togglegroup";

type ToggleGroupModule = typeof BaseToggleGroup;

type ProviderConfig = {
  componentName: "b-togglegroup" | "r-togglegroup";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: ToggleGroupModule;
  usageCode: string;
};

type PreviewItem = {
  ariaLabel: string;
  label: ReactNode;
  value: string;
};

const formattingItems: PreviewItem[] = [
  {
    value: "bold",
    ariaLabel: "Bold",
    label: <span className="font-semibold leading-none">B</span>,
  },
  {
    value: "italic",
    ariaLabel: "Italic",
    label: <span className="font-medium italic leading-none">I</span>,
  },
  {
    value: "underline",
    ariaLabel: "Underline",
    label: (
      <span className="leading-none underline decoration-1 underline-offset-2">
        U
      </span>
    ),
  },
];

const previewContentClassName =
  "flex w-full max-w-md flex-col items-start gap-4 text-left";

const previewSentenceClassName =
  "flex flex-wrap items-center justify-start gap-x-2.5 gap-y-2 text-left text-pretty font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

function getEmphasizedTextClassName(value: string[]) {
  return cn(
    "transition-all duration-200",
    value.includes("bold") && "font-bold",
    value.includes("italic") && "italic",
    value.includes("underline") && "underline underline-offset-2",
    value.length > 0
      ? "text-neutral-950 dark:text-neutral-50"
      : "text-neutral-800 dark:text-neutral-100"
  );
}

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Toggle Group" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-togglegroup": `"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ToggleGroup,
  type ToggleGroupItem,
} from "@/components/ui/b-togglegroup";

const items: ToggleGroupItem[] = [
  { value: "bold", ariaLabel: "Bold", label: <span className="font-semibold leading-none">B</span> },
  { value: "italic", ariaLabel: "Italic", label: <span className="font-medium italic leading-none">I</span> },
  {
    value: "underline",
    ariaLabel: "Underline",
    label: <span className="leading-none underline decoration-1 underline-offset-2">U</span>,
  },
];

export function ToggleGroupPreview() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-md flex-col items-start gap-4 text-left">
        <ToggleGroup
          aria-label="Text formatting"
          items={items}
          onValueChange={setValue}
          value={value}
        />
        <p className="flex flex-wrap items-center justify-start gap-x-2.5 gap-y-2 text-left text-pretty font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
          <span>Ship the</span>
          <span
            className={cn(
              "transition-all duration-200",
              value.includes("bold") && "font-bold",
              value.includes("italic") && "italic",
              value.includes("underline") && "underline underline-offset-2",
              value.length > 0
                ? "text-neutral-950 dark:text-neutral-50"
                : "text-neutral-800 dark:text-neutral-100"
            )}
          >
            release notes
          </span>
        </p>
      </div>
    </div>
  );
}`,
  "r-togglegroup": `"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ToggleGroup,
  type ToggleGroupItem,
} from "@/components/ui/r-togglegroup";

const items: ToggleGroupItem[] = [
  { value: "bold", ariaLabel: "Bold", label: <span className="font-semibold leading-none">B</span> },
  { value: "italic", ariaLabel: "Italic", label: <span className="font-medium italic leading-none">I</span> },
  {
    value: "underline",
    ariaLabel: "Underline",
    label: <span className="leading-none underline decoration-1 underline-offset-2">U</span>,
  },
];

export function ToggleGroupPreview() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-md flex-col items-start gap-4 text-left">
        <ToggleGroup
          aria-label="Text formatting"
          items={items}
          onValueChange={setValue}
          value={value}
        />
        <p className="flex flex-wrap items-center justify-start gap-x-2.5 gap-y-2 text-left text-pretty font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
          <span>Ship the</span>
          <span
            className={cn(
              "transition-all duration-200",
              value.includes("bold") && "font-bold",
              value.includes("italic") && "italic",
              value.includes("underline") && "underline underline-offset-2",
              value.length > 0
                ? "text-neutral-950 dark:text-neutral-50"
                : "text-neutral-800 dark:text-neutral-100"
            )}
          >
            release notes
          </span>
        </p>
      </div>
    </div>
  );
}`,
};

function ToggleGroupPreview({ ui }: { ui: ToggleGroupModule }) {
  const { ToggleGroup } = ui;
  const [value, setValue] = useState<string[]>([]);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <div className={previewContentClassName}>
        <ToggleGroup
          aria-label="Text formatting"
          items={formattingItems}
          onValueChange={setValue}
          value={value}
        />
        <p className={previewSentenceClassName}>
          <span>Ship the</span>
          <span className={getEmphasizedTextClassName(value)}>
            release notes
          </span>
        </p>
      </div>
    </div>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return toggleGroupApiDetails.map((item) => {
    if (item.id === "toggle-group") {
      return {
        ...item,
        summary: `Segmented toggle group with the same Iconiq API layered over ${provider.libraryLabel} primitives.`,
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          ...(item.notes ?? []),
          ...provider.notes,
        ],
      };
    }

    if (item.id === "toggle-group-motion") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on Base UI ToggleGroup and Toggle primitives while the accent fill, separators, and tap compression stay under the same Motion shell as the Radix version."
            : "Built on Radix ToggleGroup.Root and ToggleGroup.Item while the accent fill, separators, and tap compression stay under the same Motion shell as the Base UI version.",
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

export default function RadixBaseToggleGroupPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-togglegroup",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI toggle group with the same items, type, value, defaultValue, size, orientation, and reducedMotion API as the Radix version.",
          "Uses Base UI toggle-group semantics underneath the same accent-fill toolbar styling as the Radix version.",
        ],
        ui: BaseToggleGroup,
        usageCode: usageCodeByProvider["b-togglegroup"],
      };
    }

    return {
      componentName: "r-togglegroup",
      dependencyLabel: "@radix-ui/react-toggle-group, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix UI toggle group with the same items, type, value, defaultValue, size, orientation, and reducedMotion API as the Base UI version.",
        "Uses Radix toggle-group semantics underneath the same accent-fill toolbar styling as the Base UI version.",
      ],
      ui: RadixToggleGroup,
      usageCode: usageCodeByProvider["r-togglegroup"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Segmented toggles for single or multi-select states."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/toggle-group/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="toggle-group"
      pageUrl="/components/toggle-group"
      preview={
        <ToggleGroupPreview key={provider.componentName} ui={provider.ui} />
      }
      previewDescription="Formatting toggle group above a sentence that updates as you select B, I, or U."
      title="Toggle Group"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
