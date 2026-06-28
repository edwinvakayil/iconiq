"use client";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { ComboboxPlaygroundProvider } from "@/app/(site)/inputs-and-forms/combobox/_components/combobox-playground";
import { comboboxApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as ComboboxModule from "@/registry/b-combobox";

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
    <div className="w-full max-w-sm">
      <Combobox
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
        items={options}
        onValueChange={setValue}
        value={value}
      >
        <ComboboxInput label="Pick a route" placeholder="Search routes..." />
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

const comboboxExamples: VariantItem[] = [
  {
    title: "With trigger and clear",
    code: `"use client";

import { useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/b-combobox";

const cities = [
  { value: "berlin", label: "Berlin" },
  { value: "london", label: "London" },
  { value: "paris", label: "Paris" },
  { value: "tokyo", label: "Tokyo" },
];

export function ComboboxTriggerExample() {
  const [value, setValue] = useState(cities[0]);

  return (
    <Combobox
      items={cities}
      itemToStringLabel={(city) => city.label}
      itemToStringValue={(city) => city.value}
      onValueChange={setValue}
      openOnInputClick
      value={value}
    >
      <ComboboxInput placeholder="Pick a city..." showTrigger />
      <ComboboxContent>
        <ComboboxList>
          {(city, index) => (
            <ComboboxItem index={index} key={city.value} value={city}>
              {city.label}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>No city matches that query.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}`,
  },
  {
    title: "Grouped options",
    code: `"use client";

import { useState } from "react";

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/b-combobox";

const groupedItems = [
  {
    value: "Europe",
    items: [
      { value: "fr", label: "France" },
      { value: "de", label: "Germany" },
      { value: "es", label: "Spain" },
    ],
  },
  {
    value: "Americas",
    items: [
      { value: "ca", label: "Canada" },
      { value: "mx", label: "Mexico" },
      { value: "us", label: "United States" },
    ],
  },
];

export function ComboboxGroupedExample() {
  const [value, setValue] = useState<(typeof groupedItems)[0]["items"][0] | null>(
    null
  );

  return (
    <Combobox
      items={groupedItems}
      itemToStringLabel={(item) => item.label}
      itemToStringValue={(item) => item.value}
      onValueChange={setValue}
      value={value}
    >
      <ComboboxInput label="Search countries" placeholder="Type a country" />
      <ComboboxContent>
        <ComboboxList>
          {(group) => (
            <ComboboxGroup items={group.items} key={group.value}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(country, index) => (
                  <ComboboxItem index={index} key={country.value} value={country}>
                    {country.label}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
        <ComboboxEmpty>No country matches that query.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}`,
  },
  {
    title: "Multi-select chips",
    code: `"use client";

import { useState } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/b-combobox";

const tags = ["Design", "Engineering", "Marketing", "Research", "Support"];

export function ComboboxMultiExample() {
  const [value, setValue] = useState<string[]>(["Design"]);

  return (
    <Combobox
      items={tags}
      multiple
      onValueChange={setValue}
      value={value}
    >
      <ComboboxChips>
        <ComboboxValue>
          {(values: string[]) =>
            values.map((tag) => (
              <ComboboxChip key={tag} value={tag}>
                {tag}
              </ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Add tags..." />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxList>
          {(tag, index) => (
            <ComboboxItem index={index} key={tag} value={tag}>
              {tag}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>No tag matches that query.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}`,
  },
  {
    title: "Async status",
    code: `"use client";

import { useEffect, useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
} from "@/components/ui/b-combobox";

const allTags = ["Design", "Engineering", "Marketing", "Research", "Support"];

export function ComboboxAsyncExample() {
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(() => {
      setItems(
        allTags.filter((tag) =>
          tag.toLowerCase().includes(query.trim().toLowerCase())
        )
      );
      setLoading(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <Combobox
      inputValue={query}
      items={items}
      onInputValueChange={setQuery}
      onValueChange={setValue}
      value={value}
    >
      <ComboboxInput label="Search tags" placeholder="Type to search..." />
      <ComboboxContent>
        <ComboboxStatus>
          {loading ? "Loading suggestions..." : null}
        </ComboboxStatus>
        <ComboboxList>
          {(tag, index) => (
            <ComboboxItem index={index} key={tag} value={tag}>
              {tag}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>No tag matches that query.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}`,
  },
];

const details: DetailItem[] = comboboxApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: @base-ui/react, motion, lucide-react.",
      "This page documents the Base UI install only, because Radix UI does not ship a dedicated combobox primitive.",
      "Install into components/ui/b-combobox.tsx so imports match the usage examples.",
      "The generated registry file is /r/b-combobox.json.",
    ],
    registryPath: "b-combobox.json",
  };
});

function handleProviderSelect() {
  return undefined;
}

export default function ComboboxPage() {
  return (
    <ComboboxPlaygroundProvider
      ComboboxModule={ComboboxModule}
      importPath="@/components/ui/b-combobox"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Inputs & Forms" },
            { label: "Combobox" },
          ]}
          componentName="b-combobox"
          description="Searchable input for filtering and choosing from a list."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/combobox/page.tsx`}
          examples={comboboxExamples}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          itemSlug="combobox"
          pageUrl="/inputs-and-forms/combobox"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible lg:col-span-8"
          previewDescription="Tune popup side, clear/trigger controls, size, and validation styling from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Combobox"
          railNotes={[
            "ComboboxClear appears when a value is selected. Pass showClear={false} to hide it.",
            "Pass aria-invalid to ComboboxInput for destructive shell styling in form validation flows.",
            "Use ComboboxStatus for async loading copy that screen readers announce politely.",
            "Keyboard highlight follows itemState.highlighted; pointer hover uses the same spring motion.",
            "Popup, item, and highlight motion honor prefers-reduced-motion automatically.",
          ]}
          title="Combobox"
          usageCode={usageCode}
          usageDescription="This Base UI install exposes compound combobox parts with clear action, rotating trigger, keyboard highlight, optional chips for multi-select, and spring motion on the popup and active row."
          v0PageCode={usageCode}
        />
      )}
    </ComboboxPlaygroundProvider>
  );
}
