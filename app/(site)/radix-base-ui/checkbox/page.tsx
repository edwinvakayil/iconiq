"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/radix-base-ui/_components/provider-switch";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseCheckbox from "@/registry/b-checkbox";
import * as RadixCheckbox from "@/registry/r-checkbox";

type CheckboxModule = typeof BaseCheckbox;

type ProviderConfig = {
  componentName: "b-checkbox" | "r-checkbox";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: CheckboxModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Checkbox" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-checkbox": `"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/b-checkbox";

export function CheckboxPreview() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="w-full max-w-sm">
      <Checkbox
        checked={checked}
        id="release-updates"
        label="Email me when the next release ships"
        onCheckedChange={setChecked}
      />
    </div>
  );
}`,
  "r-checkbox": `"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/r-checkbox";

export function CheckboxPreview() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="w-full max-w-sm">
      <Checkbox
        checked={checked}
        id="release-updates"
        label="Email me when the next release ships"
        onCheckedChange={setChecked}
      />
    </div>
  );
}`,
};

function CheckboxPreview({ ui }: { ui: CheckboxModule }) {
  const { Checkbox } = ui;
  const [checked, setChecked] = useState(true);

  return (
    <div className="w-full max-w-sm">
      <Checkbox
        checked={checked}
        id="release-updates-preview"
        label="Email me when the next release ships"
        onCheckedChange={setChecked}
      />
    </div>
  );
}

export default function RadixBaseCheckboxPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-checkbox",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI checkbox with the same controlled and uncontrolled Iconiq API as the Radix version.",
          "Keeps the same fill spring, press scale, line-drawn checkmark, and label fade used by the original checkbox component.",
          "The generated registry file is /r/b-checkbox.json.",
        ],
        ui: BaseCheckbox,
        usageCode: usageCodeByProvider["b-checkbox"],
      };
    }

    return {
      componentName: "r-checkbox",
      dependencyLabel: "@radix-ui/react-checkbox, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix checkbox with the same controlled and uncontrolled Iconiq API as the Base UI version.",
        "Uses the exact same Motion timing and checkmark draw behavior as the original checkbox component.",
        "The generated registry file is /r/r-checkbox.json.",
      ],
      ui: RadixCheckbox,
      usageCode: usageCodeByProvider["r-checkbox"],
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () => [
      {
        id: "checkbox",
        title: "Checkbox",
        summary:
          "Provider-switchable single checkbox with the same Iconiq API layered over Base UI and Radix UI primitives.",
        fields: [
          {
            name: "checked",
            type: "boolean",
            description:
              "Controlled checked state for the checkbox. Pass this when the parent owns the value.",
          },
          {
            name: "defaultChecked",
            type: "boolean",
            defaultValue: "false",
            description:
              "Initial checked state for uncontrolled usage. The component manages future toggles internally.",
          },
          {
            name: "onCheckedChange",
            type: "(checked: boolean) => void",
            description:
              "Called with the next boolean state whenever the checkbox toggles.",
          },
          {
            name: "label",
            type: "string",
            description:
              "Optional inline label rendered beside the checkbox with the same opacity fade used in the original component.",
          },
          {
            name: "id",
            type: "string",
            description:
              "Optional id forwarded to the underlying primitive control.",
          },
          {
            name: "className",
            type: "string",
            description:
              "Merged onto the outer inline-flex wrapper so you can position the checkbox row in your layout.",
          },
        ],
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          ...provider.notes,
        ],
      },
    ],
    [provider]
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same checkbox API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/checkbox/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="checkbox"
      pageUrl="/radix-base-ui/checkbox"
      preview={<CheckboxPreview ui={provider.ui} />}
      title="Checkbox"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
