"use client";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { AutocompletePlaygroundProvider } from "@/app/(site)/inputs-and-forms/autocomplete/_components/autocomplete-playground";
import { autocompleteApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as AutocompleteModule from "@/registry/b-autocomplete";

const usageCode = `"use client";

import { useState } from "react";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/b-autocomplete";

type Country = {
  code: string;
  name: string;
  region: string;
};

const countries: Country[] = [
  { code: "CA", name: "Canada", region: "North America" },
  { code: "FR", name: "France", region: "Europe" },
  { code: "JP", name: "Japan", region: "Asia" },
  { code: "MX", name: "Mexico", region: "North America" },
  { code: "US", name: "United States", region: "North America" },
];

export function AutocompletePreview() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-xl">
      <Autocomplete
        itemToStringValue={(country) => country.name}
        items={countries}
        onValueChange={setQuery}
        value={query}
      >
        <AutocompleteInput
          label="Search countries"
          placeholder="e.g. Canada"
        />
        <AutocompleteContent>
          <AutocompleteList>
            {(country: Country, index: number) => (
              <AutocompleteItem
                description={country.region}
                index={index}
                key={country.code}
                value={country}
              >
                {country.name}
              </AutocompleteItem>
            )}
          </AutocompleteList>
          <AutocompleteEmpty>No country matches that query.</AutocompleteEmpty>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
}`;

const autocompleteExamples: VariantItem[] = [
  {
    title: "With trigger and clear",
    code: `"use client";

import { useState } from "react";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/b-autocomplete";

const cities = ["Berlin", "London", "Paris", "Tokyo", "Toronto"];

export function AutocompleteTriggerExample() {
  const [query, setQuery] = useState("");

  return (
    <Autocomplete
      items={cities}
      onValueChange={setQuery}
      openOnInputClick
      value={query}
    >
      <AutocompleteInput placeholder="Pick a city..." showTrigger />
      <AutocompleteContent>
        <AutocompleteList>
          {(city, index) => (
            <AutocompleteItem index={index} key={city} value={city}>
              {city}
            </AutocompleteItem>
          )}
        </AutocompleteList>
        <AutocompleteEmpty>No city matches that query.</AutocompleteEmpty>
      </AutocompleteContent>
    </Autocomplete>
  );
}`,
  },
  {
    title: "Grouped suggestions",
    code: `"use client";

import { useState } from "react";

import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@/components/ui/b-autocomplete";

const groupedItems = [
  {
    value: "Europe",
    items: ["France", "Germany", "Spain"],
  },
  {
    value: "Americas",
    items: ["Canada", "Mexico", "United States"],
  },
];

export function AutocompleteGroupedExample() {
  const [query, setQuery] = useState("");

  return (
    <Autocomplete items={groupedItems} onValueChange={setQuery} value={query}>
      <AutocompleteInput label="Search regions" placeholder="Type a country" />
      <AutocompleteContent>
        <AutocompleteList>
          {(group) => (
            <AutocompleteGroup items={group.items} key={group.value}>
              <AutocompleteLabel>{group.value}</AutocompleteLabel>
              <AutocompleteCollection>
                {(country, index) => (
                  <AutocompleteItem index={index} key={country} value={country}>
                    {country}
                  </AutocompleteItem>
                )}
              </AutocompleteCollection>
            </AutocompleteGroup>
          )}
        </AutocompleteList>
        <AutocompleteEmpty>No country matches that query.</AutocompleteEmpty>
      </AutocompleteContent>
    </Autocomplete>
  );
}`,
  },
  {
    title: "Async status",
    code: `"use client";

import { useEffect, useState } from "react";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@/components/ui/b-autocomplete";

const allTags = ["Design", "Engineering", "Marketing", "Research", "Support"];

export function AutocompleteAsyncExample() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
    <Autocomplete items={items} onValueChange={setQuery} value={query}>
      <AutocompleteInput label="Search tags" placeholder="Type to search..." />
      <AutocompleteContent>
        <AutocompleteStatus>
          {loading ? "Loading suggestions..." : null}
        </AutocompleteStatus>
        <AutocompleteList>
          {(tag, index) => (
            <AutocompleteItem index={index} key={tag} value={tag}>
              {tag}
            </AutocompleteItem>
          )}
        </AutocompleteList>
        <AutocompleteEmpty>No tag matches that query.</AutocompleteEmpty>
      </AutocompleteContent>
    </Autocomplete>
  );
}`,
  },
];

const details: DetailItem[] = autocompleteApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: @base-ui/react, motion, lucide-react.",
      "This page documents the Base UI install only. Radix UI does not ship a dedicated autocomplete primitive.",
      "Install into components/ui/b-autocomplete.tsx so imports match the usage examples.",
      "The generated registry file is /r/b-autocomplete.json.",
    ],
    registryPath: "b-autocomplete.json",
  };
});

function handleProviderSelect() {
  return undefined;
}

export default function AutocompletePage() {
  return (
    <AutocompletePlaygroundProvider
      AutocompleteModule={AutocompleteModule}
      importPath="@/components/ui/b-autocomplete"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Inputs & Forms" },
            { label: "Autocomplete" },
          ]}
          componentName="b-autocomplete"
          description="Typeahead input that filters suggestions as you search."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/autocomplete/page.tsx`}
          examples={autocompleteExamples}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          itemSlug="autocomplete"
          pageUrl="/inputs-and-forms/autocomplete"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible lg:col-span-8"
          previewDescription="Tune popup side, clear/trigger controls, and validation styling from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Autocomplete"
          railNotes={[
            "AutocompleteEmpty stays visible when filtering returns no matches; the popup no longer auto-closes on empty results.",
            "AutocompleteClear appears while the input has text. Pass showClear={false} to hide it.",
            "Pass aria-invalid to AutocompleteInput for destructive shell styling in form validation flows.",
            "Use AutocompleteStatus for async loading copy that screen readers announce politely.",
            "Popup, item, and highlight motion honor prefers-reduced-motion automatically.",
          ]}
          title="Autocomplete"
          usageCode={usageCode}
          usageDescription="This Base UI install filters suggestions as you type, keeps the popup open for empty results, clears input text with AutocompleteClear, and uses spring motion on the highlight and popup."
          v0PageCode={usageCode}
        />
      )}
    </AutocompletePlaygroundProvider>
  );
}
