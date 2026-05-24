"use client";

import { Orbit, Sparkles, Telescope } from "lucide-react";
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

type SelectOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  group?: string;
};

type SelectModule = {
  Select: ComponentType<{
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    reducedMotion?: boolean;
  }>;
};

type ProviderConfig = {
  componentName: "b-select" | "r-select";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: SelectModule;
  usageCode: string;
};

const demoOptions: SelectOption[] = [
  {
    value: "scout",
    label: "Scout pass",
    icon: <Sparkles className="size-4" />,
  },
  {
    value: "transit",
    label: "Transit window",
    icon: <Orbit className="size-4" />,
  },
  {
    value: "deep",
    label: "Deep field",
    icon: <Telescope className="size-4" />,
  },
];

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Select" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-select": `"use client";

import { Orbit, Sparkles, Telescope } from "lucide-react";
import { useState } from "react";
import { Select, type SelectOption } from "@/components/ui/b-select";

const options: SelectOption[] = [
  { value: "scout", label: "Scout pass", icon: <Sparkles className="size-4" /> },
  { value: "transit", label: "Transit window", icon: <Orbit className="size-4" /> },
  { value: "deep", label: "Deep field", icon: <Telescope className="size-4" /> },
];

export function SelectPreview() {
  const [value, setValue] = useState<string | undefined>("scout");

  return (
    <Select
      className="w-full max-w-sm"
      onChange={setValue}
      options={options}
      placeholder="Plot the trajectory..."
      value={value}
    />
  );
}`,
  "r-select": `"use client";

import { Orbit, Sparkles, Telescope } from "lucide-react";
import { useState } from "react";
import { Select, type SelectOption } from "@/components/ui/r-select";

const options: SelectOption[] = [
  { value: "scout", label: "Scout pass", icon: <Sparkles className="size-4" /> },
  { value: "transit", label: "Transit window", icon: <Orbit className="size-4" /> },
  { value: "deep", label: "Deep field", icon: <Telescope className="size-4" /> },
];

export function SelectPreview() {
  const [value, setValue] = useState<string | undefined>("scout");

  return (
    <Select
      className="w-full max-w-sm"
      onChange={setValue}
      options={options}
      placeholder="Plot the trajectory..."
      value={value}
    />
  );
}`,
};

function SelectPreview({ ui }: { ui: SelectModule }) {
  const { Select } = ui;
  const [value, setValue] = useState<string | undefined>("scout");

  return (
    <div className="flex min-h-[320px] w-full items-center justify-center p-6">
      <Select
        className="w-full max-w-sm"
        onChange={setValue}
        options={demoOptions}
        placeholder="Plot the trajectory..."
        value={value}
      />
    </div>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return selectApiDetails.map((item) => {
    if (item.id === "select") {
      return {
        ...item,
        summary: `Animated single-select listbox with the same Iconiq trigger, row, and panel motion layered over ${provider.libraryLabel} primitives.`,
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
          "Installs a Base UI select with the same public option shape and controlled selection API as the Radix version.",
          "Keeps grouped sections, trigger width matching, keyboard typeahead, and the same trigger and dropdown motion as the core select component.",
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
        "Installs a Radix select with the same public option shape and controlled selection API as the Base UI version.",
        "Keeps grouped sections, trigger width matching, keyboard typeahead, and the same trigger and dropdown motion as the core select component.",
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
      description="Compare the same select API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/select/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="select"
      pageUrl="/components/select"
      preview={<SelectPreview ui={provider.ui} />}
      title="Select"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
