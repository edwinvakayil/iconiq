"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { RadioGroupPlaygroundProvider } from "@/app/(site)/inputs-and-forms/radio-group/_components/radio-group-playground";
import { radioGroupApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseRadioGroup from "@/registry/b-radio-group";
import * as RadixRadioGroup from "@/registry/r-radio-group";

type ProviderConfig = {
  componentName: "b-radio-group" | "r-radio-group";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: typeof BaseRadioGroup | typeof RadixRadioGroup;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
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
    <div className="flex w-full justify-center px-4 py-6">
      <div className="flex w-full max-w-md flex-col gap-2">
        <RadioGroup
          aria-describedby="delivery-help"
          label="Delivery options"
          className="w-full"
          onChange={setValue}
          options={options}
          value={value}
        />
        <p className="text-muted-foreground text-sm" id="delivery-help">
          Pick the delivery speed that fits your timeline.
        </p>
      </div>
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
    <div className="flex w-full justify-center px-4 py-6">
      <div className="flex w-full max-w-md flex-col gap-2">
        <RadioGroup
          aria-describedby="delivery-help"
          label="Delivery options"
          className="w-full"
          onChange={setValue}
          options={options}
          value={value}
        />
        <p className="text-muted-foreground text-sm" id="delivery-help">
          Pick the delivery speed that fits your timeline.
        </p>
      </div>
    </div>
  );
}`,
};

function buildExamples(importPath: string): VariantItem[] {
  return [
    {
      title: "Horizontal",
      code: `"use client";

import { useState } from "react";
import RadioGroup from "${importPath}";

const options = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export function RadioGroupHorizontalExample() {
  const [value, setValue] = useState("monthly");

  return (
    <RadioGroup
      label="Billing cadence"
      className="w-full max-w-md"
      onChange={setValue}
      options={options}
      orientation="horizontal"
      value={value}
    />
  );
}`,
    },
    {
      title: "Disabled option",
      code: `"use client";

import { useState } from "react";
import RadioGroup from "${importPath}";

const options = [
  { value: "standard", label: "Standard delivery" },
  { value: "express", label: "Express", disabled: true },
  { value: "pickup", label: "Pickup point" },
];

export function RadioGroupDisabledOptionExample() {
  const [value, setValue] = useState("standard");

  return (
    <RadioGroup
      label="Delivery options"
      className="w-full max-w-md"
      onChange={setValue}
      options={options}
      value={value}
    />
  );
}`,
    },
    {
      title: "Invalid",
      code: `"use client";

import { useState } from "react";
import RadioGroup from "${importPath}";

const options = [
  { value: "standard", label: "Standard delivery" },
  { value: "express", label: "Express" },
];

export function RadioGroupInvalidExample() {
  const [value, setValue] = useState("standard");

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <RadioGroup
        aria-describedby="delivery-error"
        label="Delivery options"
        invalid
        onChange={setValue}
        options={options}
        value={value}
      />
      <p className="text-destructive text-sm" id="delivery-error">
        Choose a delivery option to continue.
      </p>
    </div>
  );
}`,
    },
    {
      title: "Required form field",
      code: `"use client";

import RadioGroup from "${importPath}";

const options = [
  { value: "standard", label: "Standard delivery" },
  { value: "express", label: "Express" },
];

export function RadioGroupRequiredExample() {
  return (
    <form
      className="flex w-full max-w-md flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <RadioGroup
        label="Delivery options"
        defaultValue="standard"
        name="delivery"
        options={options}
        required
      />
      <button
        className="rounded-md bg-foreground px-3 py-2 text-background text-sm"
        type="submit"
      >
        Continue
      </button>
    </form>
  );
}`,
    },
  ];
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return radioGroupApiDetails.map((item) => {
    if (item.id === "radio-group") {
      return {
        ...item,
        summary: `Single-choice selector with form props and ${provider.libraryLabel} keyboard semantics.`,
      };
    }

    if (item.id === "radio-motion-a11y") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on Base UI RadioGroup and Radio.Root with roving focus, hidden native inputs, and the Iconiq staggered row entrance plus spring-loaded ring and dot animation."
            : "Built on Radix RadioGroup.Root and RadioGroup.Item with roving focus, hidden native inputs, and the Iconiq staggered row entrance plus spring-loaded ring and dot animation.",
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
        importPath: "@/components/ui/b-radio-group",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI radio group with options, value, defaultValue, onChange, disabled, orientation, required, form, and invalid props.",
          "Uses Base UI hidden native inputs under the same animated Iconiq row shell.",
        ],
        ui: BaseRadioGroup,
        usageCode: usageCodeByProvider["b-radio-group"],
      };
    }

    return {
      componentName: "r-radio-group",
      dependencyLabel: "@radix-ui/react-radio-group, motion",
      importPath: "@/components/ui/r-radio-group",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix radio group with the same API as the Base UI version.",
        "Keeps the row entrance and ring-and-dot motion from the original radio group component.",
      ],
      ui: RadixRadioGroup,
      usageCode: usageCodeByProvider["r-radio-group"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);
  const examples = useMemo(
    () => buildExamples(provider.importPath),
    [provider.importPath]
  );

  return (
    <RadioGroupPlaygroundProvider
      importPath={provider.importPath}
      RadioGroupModule={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Single-select option group for mutually exclusive choices with form semantics and reduced-motion support."
          details={details}
          detailsDescription="Pass an options array for the default layout. Use label for a visible field title, or aria-label / aria-labelledby when the label lives elsewhere. Pair aria-describedby with helper or error copy."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/radio-group/page.tsx`}
          examples={examples}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="radio-group"
          pageUrl="/inputs-and-forms/radio-group"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible lg:col-span-8"
          previewDescription="Tune orientation, disabled options, invalid styling, and descriptions from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Radio Group"
          railNotes={[
            `Current install target: ${provider.libraryLabel}.`,
            "Use label with required to show the destructive asterisk above the group.",
            "Disable individual options with disabled on each choice.",
            "Motion respects prefers-reduced-motion for entrance, hover, and ring transitions.",
            "Pair invalid with aria-describedby so assistive tech can read the error copy.",
          ]}
          title="Radio Group"
          usageCode={provider.usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </RadioGroupPlaygroundProvider>
  );
}
