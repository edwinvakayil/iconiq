"use client";

import { Bold, Italic, type LucideIcon, Underline } from "lucide-react";
import { useMemo, useState } from "react";

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

type FormatOption = {
  icon: LucideIcon;
  label: string;
  value: string;
};

type ToggleGroupModule = typeof BaseToggleGroup | typeof RadixToggleGroup;

type ProviderConfig = {
  componentName: "b-togglegroup" | "r-togglegroup";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: ToggleGroupModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Buttons & Actions" },
  { label: "Toggle Group" },
];

const formatOptions: FormatOption[] = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
];

const itemClassName = "size-8 min-h-8 min-w-8 shrink-0 px-0";

const previewShellClassName =
  "flex min-h-[18rem] w-full items-center justify-center px-4 py-6";

const previewContentClassName = "flex flex-col items-start gap-3";

const sentenceClassName =
  "text-balance text-left font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

function getHeadlineClassName(formats: string[]) {
  return cn(
    "transition-[color,font-style,font-weight,text-decoration-color] duration-200",
    formats.includes("bold") && "font-bold",
    formats.includes("italic") && "italic",
    formats.includes("underline") && "underline underline-offset-4",
    formats.length > 0
      ? "text-neutral-950 dark:text-neutral-50"
      : "text-neutral-800 dark:text-neutral-100"
  );
}

function FormatToolbar({
  ui,
  formats,
  onFormatsChange,
}: {
  ui: ToggleGroupModule;
  formats: string[];
  onFormatsChange: (value: string[]) => void;
}) {
  const { ToggleGroup, ToggleGroupItem } = ui;

  return (
    <ToggleGroup
      aria-label="Text formatting"
      onValueChange={onFormatsChange}
      value={formats}
      variant="outline"
    >
      {formatOptions.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem
          aria-label={label}
          className={itemClassName}
          key={value}
          value={value}
        >
          <Icon className="size-4" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-togglegroup": `"use client";

import { Bold, Italic, Underline } from "lucide-react";
import { useState } from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/b-togglegroup";

const options = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
] as const;

function getHeadlineClassName(formats: string[]) {
  return [
    "transition-[color,font-style,font-weight,text-decoration-color] duration-200",
    formats.includes("bold") ? "font-bold" : "",
    formats.includes("italic") ? "italic" : "",
    formats.includes("underline") ? "underline underline-offset-4" : "",
    formats.length > 0
      ? "text-neutral-950 dark:text-neutral-50"
      : "text-neutral-800 dark:text-neutral-100",
  ]
    .filter(Boolean)
    .join(" ");
}

export function ToggleGroupPreview() {
  const [formats, setFormats] = useState<string[]>(["bold"]);

  return (
    <div className="${previewShellClassName}">
      <div className="${previewContentClassName}">
        <ToggleGroup
          aria-label="Text formatting"
          onValueChange={setFormats}
          value={formats}
          variant="outline"
        >
          {options.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem
              aria-label={label}
              className="${itemClassName}"
              key={value}
              value={value}
            >
              <Icon className="size-4" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="${sentenceClassName}">
          <span>Edit the </span>
          <span className={getHeadlineClassName(formats)}>launch headline</span>
        </p>
      </div>
    </div>
  );
}`,
  "r-togglegroup": `"use client";

import { Bold, Italic, Underline } from "lucide-react";
import { useState } from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/r-togglegroup";

const options = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
] as const;

function getHeadlineClassName(formats: string[]) {
  return [
    "transition-[color,font-style,font-weight,text-decoration-color] duration-200",
    formats.includes("bold") ? "font-bold" : "",
    formats.includes("italic") ? "italic" : "",
    formats.includes("underline") ? "underline underline-offset-4" : "",
    formats.length > 0
      ? "text-neutral-950 dark:text-neutral-50"
      : "text-neutral-800 dark:text-neutral-100",
  ]
    .filter(Boolean)
    .join(" ");
}

export function ToggleGroupPreview() {
  const [formats, setFormats] = useState<string[]>(["bold"]);

  return (
    <div className="${previewShellClassName}">
      <div className="${previewContentClassName}">
        <ToggleGroup
          aria-label="Text formatting"
          onValueChange={setFormats}
          value={formats}
          variant="outline"
        >
          {options.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem
              aria-label={label}
              className="${itemClassName}"
              key={value}
              value={value}
            >
              <Icon className="size-4" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="${sentenceClassName}">
          <span>Edit the </span>
          <span className={getHeadlineClassName(formats)}>launch headline</span>
        </p>
      </div>
    </div>
  );
}`,
};

function ToggleGroupPreview({ ui }: { ui: ToggleGroupModule }) {
  const [formats, setFormats] = useState<string[]>(["bold"]);

  return (
    <div className={previewShellClassName}>
      <div className={previewContentClassName}>
        <FormatToolbar formats={formats} onFormatsChange={setFormats} ui={ui} />
        <p className={sentenceClassName}>
          <span>Edit the </span>
          <span className={getHeadlineClassName(formats)}>launch headline</span>
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
        summary: `Root container for a connected set of toggle buttons with shared variant, size, spacing, and orientation settings, layered over ${provider.libraryLabel} toggle-group primitives.`,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Base UI uses multiple={true} by default with a string array value. Pass multiple={false} for single selection."
            : 'Radix uses type="multiple" by default with a string array value. Pass type="single" for one active item.',
          ...(item.notes ?? []),
        ],
      };
    }

    if (item.id === "toggle-group-item") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Items render as Base UI toggle buttons with the same fluid wipe fill, sheen sweep, and icon press feedback as the standalone toggle."
            : "Items render as Radix toggle-group buttons with the same fluid wipe fill, sheen sweep, and icon press feedback as the standalone toggle.",
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

export default function ToggleGroupPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-togglegroup",
        dependencyLabel: "@base-ui/react, class-variance-authority, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI toggle group with the same fluid motion as the standalone toggle.",
          "Default spacing leaves a 4px gap between each bordered item.",
          "Pass spacing={0} to pack items with no gap.",
        ],
        ui: BaseToggleGroup,
        usageCode: usageCodeByProvider["b-togglegroup"],
      };
    }

    return {
      componentName: "r-togglegroup",
      dependencyLabel: "radix-ui, class-variance-authority, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix toggle group with the same fluid motion as the standalone toggle.",
        "Default spacing leaves a 4px gap between each bordered item.",
        "Pass spacing={0} to pack items with no gap.",
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
      description="Segmented toggle controls for toolbars, filters, and formatting actions."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/buttons-and-actions/toggle-group/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="toggle-group"
      pageUrl="/buttons-and-actions/toggle-group"
      preview={<ToggleGroupPreview ui={provider.ui} />}
      previewClassName="min-h-[18rem] overflow-visible"
      previewDescription="Centered preview with formatting toggles above left-aligned copy. Bold, italic, and underline stack on “launch headline.”"
      title="Toggle Group"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
