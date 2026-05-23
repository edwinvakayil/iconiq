"use client";

import { useMemo, useState } from "react";

import { ProviderSwitch } from "@/app/(site)/radix-base-ui/_components/provider-switch";
import { comboboxApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Combobox, type ComboboxOption } from "@/registry/b-combobox";

const demoOptions: ComboboxOption[] = [
  {
    value: "scout",
    label: "Scout pass",
    description: "First scan before the sprint opens up",
  },
  {
    value: "transit",
    label: "Transit window",
    description: "Tighter route through the midfield line",
  },
  {
    value: "deep",
    label: "Deep field",
    description: "Longer view with less traffic around it",
  },
  {
    value: "late-run",
    label: "Late run",
    description: "Arrive second and attack the gap late",
  },
];

const usageCode = `"use client";

import { useState } from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/b-combobox";

const options: ComboboxOption[] = [
  {
    value: "scout",
    label: "Scout pass",
    description: "First scan before the sprint opens up",
  },
  {
    value: "transit",
    label: "Transit window",
    description: "Tighter route through the midfield line",
  },
  {
    value: "deep",
    label: "Deep field",
    description: "Longer view with less traffic around it",
  },
  {
    value: "late-run",
    label: "Late run",
    description: "Arrive second and attack the gap late",
  },
];

export function ComboboxPreview() {
  const [value, setValue] = useState("transit");

  return (
    <div className="w-full max-w-xl">
      <Combobox
        className="w-full"
        emptyMessage="No route matches that query."
        onChange={setValue}
        options={options}
        placeholder="Pick a route..."
        value={value}
      />
    </div>
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Radix UI + Base UI" },
  { label: "Combobox" },
];

function getDetails(): DetailItem[] {
  return comboboxApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react, motion, lucide-react.",
        "This page documents the Base UI install only, because Radix UI does not ship a dedicated combobox primitive.",
        "The generated registry file is /r/b-combobox.json.",
      ],
      registryPath: "b-combobox.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function RadixBaseComboboxPage() {
  const [value, setValue] = useState("transit");
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="b-combobox"
      description="Base UI combobox with the same Iconiq filtering, keyboard search, and dropdown motion."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/combobox/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="combobox"
      pageUrl="/radix-base-ui/combobox"
      preview={
        <div className="flex min-h-[280px] w-full items-center justify-center">
          <div className="w-full max-w-xl">
            <Combobox
              className="w-full"
              emptyMessage="No route matches that query."
              onChange={setValue}
              options={demoOptions}
              placeholder="Pick a route..."
              value={value}
            />
          </div>
        </div>
      }
      title="Combobox"
      usageCode={usageCode}
      usageDescription="This Base UI install keeps the same public option shape, filtering rules, keyboard model, clear action, and dropdown motion as the core Iconiq combobox."
      v0PageCode={usageCode}
    />
  );
}
