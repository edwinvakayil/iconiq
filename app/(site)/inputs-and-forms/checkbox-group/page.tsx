"use client";

import { useMemo } from "react";
import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { CheckboxGroupPlaygroundProvider } from "@/app/(site)/inputs-and-forms/checkbox-group/_components/checkbox-group-playground";
import { checkboxGroupApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const importPath = "@/components/ui/b-checkbox-group";

const usageCode = `"use client";

import { useState } from "react";
import {
  CheckboxGroup,
  CheckboxGroupItem,
} from "${importPath}";

export function CheckboxGroupPreview() {
  const [value, setValue] = useState<string[]>(["email"]);

  return (
    <CheckboxGroup
      aria-label="Notification preferences"
      className="w-[min(100%,28rem)]"
      name="notifications"
      onChange={setValue}
      value={value}
    >
      <CheckboxGroupItem
        description="Release notes and changelog digests."
        label="Email updates"
        value="email"
      />
      <CheckboxGroupItem
        description="Feature launches and roadmap highlights."
        label="Product news"
        value="news"
      />
      <CheckboxGroupItem
        description="Critical patches and account notices."
        label="Security alerts"
        value="security"
      />
    </CheckboxGroup>
  );
}`;

const checkboxGroupExamples: VariantItem[] = [
  {
    title: "Grouped sections",
    code: `"use client";

import { useState } from "react";
import {
  CheckboxGroup,
  CheckboxGroupItem,
  CheckboxGroupSection,
} from "${importPath}";

export function GroupedCheckboxGroupExample() {
  const [value, setValue] = useState<string[]>(["releases"]);

  return (
    <CheckboxGroup
      aria-label="Workspace notifications"
      maxVisible={2}
      onChange={setValue}
      value={value}
    >
      <CheckboxGroupSection label="Product">
        <CheckboxGroupItem
          description="Ship logs and changelog digests."
          label="Release notes"
          value="releases"
        />
        <CheckboxGroupItem
          description="Milestones and beta invitations."
          label="Roadmap updates"
          value="roadmap"
        />
      </CheckboxGroupSection>
      <CheckboxGroupSection label="Account">
        <CheckboxGroupItem
          description="Critical patches and sign-in notices."
          label="Security alerts"
          value="security"
        />
      </CheckboxGroupSection>
      <CheckboxGroupSection label="Community">
        <CheckboxGroupItem
          description="Workshops and contributor calls."
          label="Events"
          value="events"
        />
      </CheckboxGroupSection>
    </CheckboxGroup>
  );
}`,
  },
  {
    title: "Form field",
    code: `"use client";

import { CheckboxGroup, CheckboxGroupItem } from "${importPath}";

export function CheckboxGroupFormExample() {
  return (
    <form className="space-y-4">
      <CheckboxGroup
        aria-label="Consent preferences"
        defaultValue={["terms"]}
        name="consent"
      >
        <CheckboxGroupItem label="I agree to the terms" value="terms" />
        <CheckboxGroupItem label="Send me product updates" value="updates" />
      </CheckboxGroup>
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

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Checkbox Group" },
];

function getDetails(): DetailItem[] {
  return checkboxGroupApiDetails;
}

function handleProviderSelect() {
  return undefined;
}

export default function RadixBaseCheckboxGroupPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <CheckboxGroupPlaygroundProvider importPath={importPath}>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="b-checkbox-group"
          description="Grouped checkboxes for selecting multiple related options."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/checkbox-group/page.tsx`}
          examples={checkboxGroupExamples}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          itemSlug="checkbox-group"
          pageUrl="/inputs-and-forms/checkbox-group"
          preview={preview}
          previewClassName="min-h-[18rem] lg:col-span-8"
          previewDescription="Tune size, grouping, validation, and disabled states from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Checkbox Group"
          railNotes={[
            "Installs a Base UI checkbox group with hidden native inputs for form submission.",
            "Supports controlled and uncontrolled usage, grouped fieldsets, and section collapse when options use group labels.",
            "Compose CheckboxGroup with CheckboxGroupSection and CheckboxGroupItem children, similar to ButtonGroup.",
            "name, form, invalid, and disabled props forward to the underlying Base UI primitives. readOnly is set per CheckboxGroupItem.",
            "Motion for checkmark draw, label fade, and tap feedback honors prefers-reduced-motion automatically.",
            "The generated registry file is /r/b-checkbox-group.json.",
          ]}
          title="Checkbox Group"
          usageCode={usageCode}
          usageDescription="This Base UI install keeps the Iconiq row motion while adding form-field props, size variants, and accessible grouped sections."
          v0PageCode={usageCode}
        />
      )}
    </CheckboxGroupPlaygroundProvider>
  );
}
