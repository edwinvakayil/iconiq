"use client";

import { useMemo, useState } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { autocompleteApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/registry/b-autocomplete";

type Country = {
  code: string;
  name: string;
  region: string;
};

const countries: Country[] = [
  { code: "AR", name: "Argentina", region: "South America" },
  { code: "AU", name: "Australia", region: "Oceania" },
  { code: "BR", name: "Brazil", region: "South America" },
  { code: "CA", name: "Canada", region: "North America" },
  { code: "CL", name: "Chile", region: "South America" },
  { code: "CN", name: "China", region: "Asia" },
  { code: "CO", name: "Colombia", region: "South America" },
  { code: "EG", name: "Egypt", region: "Africa" },
  { code: "ET", name: "Ethiopia", region: "Africa" },
  { code: "FR", name: "France", region: "Europe" },
  { code: "DE", name: "Germany", region: "Europe" },
  { code: "GR", name: "Greece", region: "Europe" },
  { code: "IN", name: "India", region: "Asia" },
  { code: "ID", name: "Indonesia", region: "Asia" },
  { code: "IE", name: "Ireland", region: "Europe" },
  { code: "IT", name: "Italy", region: "Europe" },
  { code: "JP", name: "Japan", region: "Asia" },
  { code: "KE", name: "Kenya", region: "Africa" },
  { code: "MX", name: "Mexico", region: "North America" },
  { code: "NL", name: "Netherlands", region: "Europe" },
  { code: "NZ", name: "New Zealand", region: "Oceania" },
  { code: "NG", name: "Nigeria", region: "Africa" },
  { code: "PK", name: "Pakistan", region: "Asia" },
  { code: "PE", name: "Peru", region: "South America" },
  { code: "PH", name: "Philippines", region: "Asia" },
  { code: "PL", name: "Poland", region: "Europe" },
  { code: "PT", name: "Portugal", region: "Europe" },
  { code: "SA", name: "Saudi Arabia", region: "Asia" },
  { code: "ZA", name: "South Africa", region: "Africa" },
  { code: "KR", name: "South Korea", region: "Asia" },
  { code: "ES", name: "Spain", region: "Europe" },
  { code: "SE", name: "Sweden", region: "Europe" },
  { code: "TH", name: "Thailand", region: "Asia" },
  { code: "GB", name: "United Kingdom", region: "Europe" },
  { code: "US", name: "United States", region: "North America" },
];

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Autocomplete" },
];

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
        <AutocompleteInput placeholder="Search countries..." />
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
          <AutocompleteEmpty>No countries match that search.</AutocompleteEmpty>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
}`;

function CountryAutocomplete() {
  const [query, setQuery] = useState("");

  return (
    <Autocomplete
      items={countries}
      itemToStringValue={(country) => country.name}
      onValueChange={setQuery}
      value={query}
    >
      <AutocompleteInput placeholder="Search countries..." />
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
        <AutocompleteEmpty>No countries match that search.</AutocompleteEmpty>
      </AutocompleteContent>
    </Autocomplete>
  );
}

function getDetails(): DetailItem[] {
  return autocompleteApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react, motion, lucide-react.",
        "This page documents the Base UI install only. Radix UI does not ship a dedicated autocomplete primitive.",
        "The generated registry file is /r/b-autocomplete.json.",
      ],
      registryPath: "b-autocomplete.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function AutocompletePage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="b-autocomplete"
      description="Typeahead input that filters suggestions as you search."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/autocomplete/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="autocomplete"
      pageUrl="/components/autocomplete"
      preview={
        <div className="flex min-h-[280px] w-full items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <CountryAutocomplete />
          </div>
        </div>
      }
      title="Autocomplete"
      usageCode={usageCode}
      usageDescription="This Base UI install filters country suggestions as you type, commits the country name on selection, and uses minimal spring motion on the highlight and popup."
      v0PageCode={usageCode}
    />
  );
}
