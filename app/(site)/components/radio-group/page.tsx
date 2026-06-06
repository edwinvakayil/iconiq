"use client";

import { type ComponentType, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { radioGroupApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseRadioGroup from "@/registry/b-radio-group";
import * as RadixRadioGroup from "@/registry/r-radio-group";

type RadioOption = {
  value: string;
  label: string;
  description?: string;
};

type RadioGroupModule = {
  RadioGroup: ComponentType<{
    options: RadioOption[];
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    layoutId?: string;
    name?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
  }>;
};

type ProviderConfig = {
  componentName: "b-radio-group" | "r-radio-group";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: RadioGroupModule;
  usageCode: string;
};

const demoOptions: RadioOption[] = [
  {
    value: "standard",
    label: "Standard delivery",
    description: "Tracked parcel in three to five business days.",
  },
  {
    value: "express",
    label: "Express",
    description: "Handoff next business day where available.",
  },
  {
    value: "pickup",
    label: "Pickup point",
    description: "Collect when convenient — no doorstep drop.",
  },
];

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Radio Group" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-radio-group": `"use client";

import { useState } from "react";
import RadioGroup from "@/components/ui/b-radio-group";

const options = [
  {
    value: "standard",
    label: "Standard delivery",
    description: "Tracked parcel in three to five business days.",
  },
  {
    value: "express",
    label: "Express",
    description: "Handoff next business day where available.",
  },
  {
    value: "pickup",
    label: "Pickup point",
    description: "Collect when convenient — no doorstep drop.",
  },
];

export function RadioGroupPreview() {
  const [value, setValue] = useState("standard");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <RadioGroup
        aria-label="Delivery options"
        className="w-full max-w-md"
        onChange={setValue}
        options={options}
        value={value}
      />
    </div>
  );
}`,
  "r-radio-group": `"use client";

import { useState } from "react";
import RadioGroup from "@/components/ui/r-radio-group";

const options = [
  {
    value: "standard",
    label: "Standard delivery",
    description: "Tracked parcel in three to five business days.",
  },
  {
    value: "express",
    label: "Express",
    description: "Handoff next business day where available.",
  },
  {
    value: "pickup",
    label: "Pickup point",
    description: "Collect when convenient — no doorstep drop.",
  },
];

export function RadioGroupPreview() {
  const [value, setValue] = useState("standard");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <RadioGroup
        aria-label="Delivery options"
        className="w-full max-w-md"
        onChange={setValue}
        options={options}
        value={value}
      />
    </div>
  );
}`,
};

function RadioGroupPreview({ ui }: { ui: RadioGroupModule }) {
  const { RadioGroup } = ui;
  const [value, setValue] = useState("standard");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <RadioGroup
        aria-label="Delivery options"
        className="w-full max-w-md"
        onChange={setValue}
        options={demoOptions}
        value={value}
      />
    </div>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return radioGroupApiDetails.map((item) => {
    if (item.id === "radio-group") {
      return {
        ...item,
        summary: `Single-choice selector with the same Iconiq row motion layered over ${provider.libraryLabel} primitives.`,
      };
    }

    if (item.id === "radio-motion-a11y") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on Base UI RadioGroup and Radio.Root while preserving the same staggered row entrance, shared layout highlight, and spring-loaded ring and dot animation."
            : "Built on Radix RadioGroup.Root and RadioGroup.Item while preserving the same staggered row entrance, shared layout highlight, and spring-loaded ring and dot animation.",
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

export default function RadixBaseRadioGroupPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-radio-group",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI radio group with the same options, value, defaultValue, onChange, name, and layoutId API as the Radix version.",
          "Uses Base UI's built-in roving focus and hidden-input semantics under the same animated Iconiq row shell.",
        ],
        ui: BaseRadioGroup,
        usageCode: usageCodeByProvider["b-radio-group"],
      };
    }

    return {
      componentName: "r-radio-group",
      dependencyLabel: "@radix-ui/react-radio-group, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix radio group with the same options, value, defaultValue, onChange, name, and layoutId API as the Base UI version.",
        "Keeps the exact same row entrance, active highlight, and ring-and-dot motion used by the original radio group component.",
      ],
      ui: RadixRadioGroup,
      usageCode: usageCodeByProvider["r-radio-group"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Single-select option group for mutually exclusive choices."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/radio-group/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="radio-group"
      pageUrl="/components/radio-group"
      preview={<RadioGroupPreview ui={provider.ui} />}
      previewDescription="Delivery options radio group with controlled selection."
      title="Radio Group"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
