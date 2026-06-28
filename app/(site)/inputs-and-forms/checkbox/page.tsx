"use client";

import { useMemo, useState } from "react";
import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { CheckboxPlaygroundProvider } from "@/app/(site)/inputs-and-forms/checkbox/_components/checkbox-playground";
import { checkboxApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseCheckbox from "@/registry/b-checkbox";
import * as RadixCheckbox from "@/registry/r-checkbox";

type CheckboxModule = typeof BaseCheckbox;

type ProviderConfig = {
  componentName: "b-checkbox" | "r-checkbox";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: CheckboxModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
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
        description="You can turn this off anytime in account settings."
        id="release-updates"
        label="Email me when the next release ships"
        name="release-updates"
        onCheckedChange={setChecked}
        value="yes"
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
        description="You can turn this off anytime in account settings."
        id="release-updates"
        label="Email me when the next release ships"
        name="release-updates"
        onCheckedChange={setChecked}
        value="yes"
      />
    </div>
  );
}`,
};

const checkboxExamples: VariantItem[] = [
  {
    title: "Indeterminate",
    code: `"use client";

import { Checkbox } from "@/components/ui/b-checkbox";

export function CheckboxIndeterminateExample() {
  return (
    <Checkbox
      checked="indeterminate"
      id="select-all"
      label="Select all notifications"
    />
  );
}`,
  },
  {
    title: "Disabled",
    code: `"use client";

import { Checkbox } from "@/components/ui/b-checkbox";

export function CheckboxDisabledExample() {
  return (
    <Checkbox
      checked
      disabled
      id="locked-preference"
      label="Legacy email digest"
    />
  );
}`,
  },
  {
    title: "Form field",
    code: `"use client";

import { Checkbox } from "@/components/ui/b-checkbox";

export function CheckboxFormExample() {
  return (
    <form className="space-y-4">
      <Checkbox
        id="terms"
        label="I agree to the terms"
        name="terms"
        required
        value="accepted"
      />
      <button className="rounded-md bg-foreground px-3 py-2 text-background text-sm" type="submit">
        Continue
      </button>
    </form>
  );
}`,
  },
];

export default function RadixBaseCheckboxPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-checkbox",
        dependencyLabel: "@base-ui/react, motion",
        importPath: "@/components/ui/b-checkbox",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI checkbox with hidden native input semantics for form submission.",
          "Supports indeterminate, disabled, readOnly, required, invalid, and size variants with the same Iconiq API as the Radix version.",
          "The generated registry file is /r/b-checkbox.json.",
          "Multi-checkbox groups are available separately via b-checkbox-group.",
        ],
        ui: BaseCheckbox,
        usageCode: usageCodeByProvider["b-checkbox"],
      };
    }

    return {
      componentName: "r-checkbox",
      dependencyLabel: "@radix-ui/react-checkbox, motion",
      importPath: "@/components/ui/r-checkbox",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix checkbox with the same controlled and uncontrolled Iconiq API as the Base UI version.",
        "Uses the exact same Motion timing, minus icon for indeterminate state, and label association as b-checkbox.",
        "The generated registry file is /r/r-checkbox.json.",
        "Multi-checkbox groups are currently Base UI only — use b-checkbox-group for grouped selections.",
      ],
      ui: RadixCheckbox,
      usageCode: usageCodeByProvider["r-checkbox"],
    };
  }, [selectedProvider]);

  return (
    <CheckboxPlaygroundProvider
      CheckboxModule={provider.ui}
      importPath={provider.importPath}
      key={provider.componentName}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Single-choice control for binary selections, consent, and form fields."
          details={checkboxApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/checkbox/page.tsx`}
          examples={checkboxExamples}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="checkbox"
          pageUrl="/inputs-and-forms/checkbox"
          preview={preview}
          previewClassName="min-h-[14rem] lg:col-span-8"
          previewDescription="Tune size, validation, indeterminate, disabled, and label layout from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Checkbox"
          railNotes={[
            `Current install target: ${provider.libraryLabel}.`,
            'Pass checked="indeterminate" for select-all or partial selection states.',
            "Label and description render beside the control inside a native label element when text is provided.",
            "name, value, required, and form props forward to the hidden input for native form submission.",
            "Motion for fill, checkmark draw, and label fade honors prefers-reduced-motion automatically.",
            provider.componentName === "r-checkbox"
              ? "Checkbox groups are Base UI only today — install b-checkbox-group for multi-select lists."
              : "Install b-checkbox-group when you need multi-select option lists.",
          ]}
          title="Checkbox"
          usageCode={provider.usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </CheckboxPlaygroundProvider>
  );
}
