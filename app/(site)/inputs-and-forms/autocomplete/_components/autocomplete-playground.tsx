"use client";

import { type ComponentType, type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";

type Country = {
  code: string;
  name: string;
  region: string;
};

type AutocompleteModule = {
  Autocomplete: ComponentType<{
    children: ReactNode;
    itemToStringValue: (country: Country) => string;
    items: readonly Country[];
    onValueChange: (value: string) => void;
    openOnInputClick?: boolean;
    value: string;
  }>;
  AutocompleteContent: ComponentType<{
    children: ReactNode;
    side?: "bottom" | "left" | "right" | "top";
  }>;
  AutocompleteEmpty: ComponentType<{ children?: ReactNode }>;
  AutocompleteInput: ComponentType<{
    "aria-invalid"?: boolean;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    showClear?: boolean;
    showTrigger?: boolean;
  }>;
  AutocompleteItem: ComponentType<{
    children: ReactNode;
    description?: string;
    index: number;
    key?: string;
    value: Country;
  }>;
  AutocompleteList: ComponentType<{
    children: (country: Country, index: number) => ReactNode;
  }>;
};

type AutocompletePlaygroundState = {
  disabled: boolean;
  invalid: boolean;
  openOnInputClick: boolean;
  showClear: boolean;
  showLabel: boolean;
  showTrigger: boolean;
  side: "bottom" | "top";
};

const PLAYGROUND_COUNTRIES: Country[] = [
  { code: "CA", name: "Canada", region: "North America" },
  { code: "FR", name: "France", region: "Europe" },
  { code: "JP", name: "Japan", region: "Asia" },
  { code: "MX", name: "Mexico", region: "North America" },
  { code: "US", name: "United States", region: "North America" },
];

const DEFAULT_STATE: AutocompletePlaygroundState = {
  disabled: false,
  invalid: false,
  openOnInputClick: false,
  showClear: true,
  showLabel: true,
  showTrigger: false,
  side: "bottom",
};

const SIDE_OPTIONS: Array<{
  label: string;
  value: AutocompletePlaygroundState["side"];
}> = [
  { label: "Bottom", value: "bottom" },
  { label: "Top", value: "top" },
];

function generateAutocompleteCode(
  state: AutocompletePlaygroundState,
  importPath: string
): string {
  const inputLines = [
    state.showLabel ? 'label="Search countries"' : null,
    'placeholder="e.g. Canada or France"',
    state.showClear ? null : "showClear={false}",
    state.showTrigger ? "showTrigger" : null,
    state.disabled ? "disabled" : null,
    state.invalid ? "aria-invalid={true}" : null,
  ].filter(Boolean);

  const rootLines = [
    "itemToStringValue={(country) => country.name}",
    "items={countries}",
    "onValueChange={setQuery}",
    "value={query}",
    state.openOnInputClick ? "openOnInputClick" : null,
  ].filter(Boolean);

  const contentSide =
    state.side !== "bottom" ? `\n        side="${state.side}"` : "";

  return `"use client";

import { useState } from "react";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "${importPath}";

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

export function AutocompleteDemo() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-sm">
      <Autocomplete
        ${rootLines.join("\n        ")}
      >
        <AutocompleteInput
          ${inputLines.join("\n          ")}
        />
        <AutocompleteContent${contentSide}>
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
}

function AutocompletePlaygroundPreview({
  AutocompleteModule,
  state,
}: {
  AutocompleteModule: AutocompleteModule;
  state: AutocompletePlaygroundState;
}) {
  const {
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteList,
  } = AutocompleteModule;
  const [query, setQuery] = useState("");

  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <Autocomplete
          items={PLAYGROUND_COUNTRIES}
          itemToStringValue={(country) => country.name}
          onValueChange={setQuery}
          openOnInputClick={state.openOnInputClick}
          value={query}
        >
          <AutocompleteInput
            aria-invalid={state.invalid || undefined}
            disabled={state.disabled}
            label={state.showLabel ? "Search countries" : undefined}
            placeholder="e.g. Canada or France"
            showClear={state.showClear}
            showTrigger={state.showTrigger}
          />
          <AutocompleteContent side={state.side}>
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
            <AutocompleteEmpty>
              No country matches that query.
            </AutocompleteEmpty>
          </AutocompleteContent>
        </Autocomplete>
        <p
          className={cn(
            "mt-3 text-center text-muted-foreground text-xs",
            !query && "opacity-60"
          )}
        >
          {query ? `Current query: ${query}` : "Type to filter suggestions"}
        </p>
      </div>
    </div>
  );
}

function AutocompletePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<AutocompletePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: AutocompletePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Autocomplete"
    >
      <DocsPlaygroundSelectField
        label="Popup side"
        onChange={(side) => onChange({ side })}
        options={SIDE_OPTIONS}
        value={state.side}
      />
      <DocsPlaygroundToggleField
        checked={state.showLabel}
        label="Show label"
        onChange={(showLabel) => onChange({ showLabel })}
      />
      <DocsPlaygroundToggleField
        checked={state.showClear}
        label="Show clear"
        onChange={(showClear) => onChange({ showClear })}
      />
      <DocsPlaygroundToggleField
        checked={state.showTrigger}
        label="Show trigger"
        onChange={(showTrigger) => onChange({ showTrigger })}
      />
      <DocsPlaygroundToggleField
        checked={state.openOnInputClick}
        label="Open on input click"
        onChange={(openOnInputClick) => onChange({ openOnInputClick })}
      />
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled"
        onChange={(disabled) => onChange({ disabled })}
      />
      <DocsPlaygroundToggleField
        checked={state.invalid}
        label="Invalid state"
        onChange={(invalid) => onChange({ invalid })}
      />
    </DocsPlaygroundPanel>
  );
}

type AutocompletePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function AutocompletePlaygroundProvider({
  AutocompleteModule,
  importPath,
  children,
}: {
  AutocompleteModule: AutocompleteModule;
  importPath: string;
  children: (props: AutocompletePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<AutocompletePlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<AutocompletePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateAutocompleteCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <AutocompletePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <AutocompletePlaygroundPreview
        AutocompleteModule={AutocompleteModule}
        state={state}
      />
    ),
    renderSettings,
  });
}
