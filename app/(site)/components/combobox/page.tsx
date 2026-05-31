"use client";

import { useMemo, useState } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { comboboxApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/b-combobox";

type RouteOption = {
  value: string;
  label: string;
  description: string;
};

const demoOptions: RouteOption[] = [
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

function RouteCombobox({
  onValueChange,
  value,
}: {
  onValueChange: (value: RouteOption | null) => void;
  value: RouteOption | null;
}) {
  return (
    <Combobox
      items={demoOptions}
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.value}
      onValueChange={onValueChange}
      value={value}
    >
      <ComboboxInput placeholder="Pick a route..." />
      <ComboboxContent>
        <ComboboxList>
          {(option: RouteOption, index: number) => (
            <ComboboxItem
              description={option.description}
              index={index}
              key={option.value}
              value={option}
            >
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>No route matches that query.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}

const usageCode = `"use client";

import { useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/b-combobox";

type RouteOption = {
  value: string;
  label: string;
  description: string;
};

const options: RouteOption[] = [
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
  const [value, setValue] = useState<RouteOption | null>(options[1]);

  return (
    <div className="w-full max-w-xl">
      <Combobox
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
        items={options}
        onValueChange={setValue}
        value={value}
      >
        <ComboboxInput placeholder="Pick a route..." />
        <ComboboxContent>
          <ComboboxList>
            {(option: RouteOption, index: number) => (
              <ComboboxItem
                description={option.description}
                index={index}
                key={option.value}
                value={option}
              >
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>No route matches that query.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
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
  const [value, setValue] = useState<RouteOption | null>(demoOptions[1]);
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="b-combobox"
      description="Searchable input for filtering and choosing from a list."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/combobox/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="combobox"
      pageUrl="/components/combobox"
      preview={
        <div className="flex min-h-[280px] w-full items-center justify-center">
          <div className="w-full max-w-xl">
            <RouteCombobox onValueChange={setValue} value={value} />
          </div>
        </div>
      }
      title="Combobox"
      usageCode={usageCode}
      usageDescription="This Base UI install exposes compound combobox parts while keeping the same input styling, filtering, clear action, keyboard model, and dropdown motion as the prior Iconiq combobox."
      v0PageCode={usageCode}
    />
  );
}
