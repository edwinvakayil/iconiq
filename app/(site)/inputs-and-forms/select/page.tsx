"use client";

import {
  CalendarDays,
  MessageSquareText,
  Palette,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { type ComponentType, type ReactNode, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { selectApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseSelect from "@/registry/b-select";
import * as RadixSelect from "@/registry/r-select";

type SelectModule = {
  Select: ComponentType<{ children?: ReactNode }>;
  SelectContent: ComponentType<{ children?: ReactNode }>;
  SelectGroup: ComponentType<{ children?: ReactNode }>;
  SelectItem: ComponentType<{
    children?: ReactNode;
    icon?: ReactNode;
    value: string;
  }>;
  SelectLabel: ComponentType<{ children?: ReactNode }>;
  SelectTrigger: ComponentType<{ children?: ReactNode; className?: string }>;
  SelectValue: ComponentType<{ placeholder?: ReactNode }>;
};

type ProviderConfig = {
  componentName: "b-select" | "r-select";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: SelectModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Select" },
];

const previewSentenceClassName =
  "text-pretty text-[13px] text-muted-foreground leading-snug tracking-tight";

const previewContentClassName = "flex w-full max-w-72 flex-col gap-2.5";

const selectUsageCodeTemplate = (importPath: string) => `"use client";

import {
  CalendarDays,
  MessageSquareText,
  Palette,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "${importPath}";

export function SelectDemo() {
  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-72 flex-col gap-2.5">
        <p className="text-pretty text-[13px] text-muted-foreground leading-snug tracking-tight">
          Choose the next workflow step from one compact select.
        </p>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose workflow" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                icon={<Rocket className="size-4 text-muted-foreground" />}
                value="launch"
              >
                Launch plan
              </SelectItem>
              <SelectItem
                icon={<Palette className="size-4 text-muted-foreground" />}
                value="design"
              >
                Design pass
              </SelectItem>
              <SelectItem
                icon={<MessageSquareText className="size-4 text-muted-foreground" />}
                value="review"
              >
                Review notes
              </SelectItem>
              <SelectItem
                icon={<CalendarDays className="size-4 text-muted-foreground" />}
                value="schedule"
              >
                Schedule
              </SelectItem>
              <SelectItem
                icon={<ShieldCheck className="size-4 text-muted-foreground" />}
                value="approve"
              >
                Approvals
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}`;

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-select": selectUsageCodeTemplate("@/components/ui/b-select"),
  "r-select": selectUsageCodeTemplate("@/components/ui/r-select"),
};

function SelectPreview({ ui }: { ui: SelectModule }) {
  const {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } = ui;

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className={previewContentClassName}>
        <p className={previewSentenceClassName}>
          Choose the next workflow step from one compact select.
        </p>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose workflow" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                icon={<Rocket className="size-4 text-muted-foreground" />}
                value="launch"
              >
                Launch plan
              </SelectItem>
              <SelectItem
                icon={<Palette className="size-4 text-muted-foreground" />}
                value="design"
              >
                Design pass
              </SelectItem>
              <SelectItem
                icon={
                  <MessageSquareText className="size-4 text-muted-foreground" />
                }
                value="review"
              >
                Review notes
              </SelectItem>
              <SelectItem
                icon={<CalendarDays className="size-4 text-muted-foreground" />}
                value="schedule"
              >
                Schedule
              </SelectItem>
              <SelectItem
                icon={<ShieldCheck className="size-4 text-muted-foreground" />}
                value="approve"
              >
                Approvals
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return selectApiDetails.map((item) => {
    if (item.id === "select") {
      return {
        ...item,
        summary: `Animated compound single-select with the same Iconiq trigger, row, and panel motion layered over ${provider.libraryLabel} primitives.`,
      };
    }

    if (item.id === "select-overlay") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Uses Base UI Select root, trigger, portal, positioner, popup, list, group, and item primitives for focus management, typeahead, and placement."
            : "Uses Radix Select root, trigger, portal, content, viewport, group, label, and item primitives for focus management, typeahead, and placement.",
          "The visible trigger press, chevron rotation, panel fade/slide, active-row highlight, and checkmark motion match the core Iconiq select component.",
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

export default function RadixBaseSelectPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-select",
        dependencyLabel: "@base-ui/react, motion, lucide-react",
        libraryLabel: "Base UI",
        notes: [
          "Installs compound Base UI select parts with the same exported part names as the Radix version.",
          "Keeps grouped sections, trigger width matching, keyboard typeahead, and the same trigger and dropdown motion as the prior select component.",
        ],
        ui: BaseSelect,
        usageCode: usageCodeByProvider["b-select"],
      };
    }

    return {
      componentName: "r-select",
      dependencyLabel: "@radix-ui/react-select, motion, lucide-react",
      libraryLabel: "Radix UI",
      notes: [
        "Installs compound Radix select parts with the same exported part names as the Base UI version.",
        "Keeps grouped sections, trigger width matching, keyboard typeahead, and the same trigger and dropdown motion as the prior select component.",
      ],
      ui: RadixSelect,
      usageCode: usageCodeByProvider["r-select"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Single-select menu for choosing from a structured list."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/select/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="select"
      pageUrl="/inputs-and-forms/select"
      preview={<SelectPreview ui={provider.ui} />}
      previewDescription="A workflow select with a centered caption above."
      title="Select"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
