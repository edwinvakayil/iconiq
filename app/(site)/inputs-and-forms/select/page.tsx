"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  getSelectUsageCode,
  SelectPlaygroundProvider,
} from "@/app/(site)/inputs-and-forms/select/_components/select-playground";
import { selectApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseSelect from "@/registry/b-select";
import * as RadixSelect from "@/registry/r-select";

type ProviderConfig = {
  componentName: "b-select" | "r-select";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: typeof BaseSelect | typeof RadixSelect;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Select" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-select": getSelectUsageCode("@/components/ui/b-select"),
  "r-select": getSelectUsageCode("@/components/ui/r-select"),
};

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
        importPath: "@/components/ui/b-select",
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
      importPath: "@/components/ui/r-select",
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
    <SelectPlaygroundProvider
      importPath={provider.importPath}
      SelectModule={provider.ui}
    >
      {({ preview, renderSettings }) => (
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
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible lg:col-span-8"
          previewDescription="Tune popup side, label, caption, icons, and disabled states from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Select"
          railNotes={[
            `Current install target: ${provider.libraryLabel}.`,
            "Pass icon on SelectItem to render a leading glyph in both the menu row and selected trigger value.",
            "Use SelectGroup and SelectLabel to separate related options inside the menu.",
            "SelectContent matches trigger width by default and caps height at 320px before scrolling.",
            "Popup, item highlight, and checkmark motion honor prefers-reduced-motion automatically.",
          ]}
          title="Select"
          usageCode={provider.usageCode}
          usageDescription="Load options from an API, map them into SelectItem rows, and control the selected value with useState. Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </SelectPlaygroundProvider>
  );
}
