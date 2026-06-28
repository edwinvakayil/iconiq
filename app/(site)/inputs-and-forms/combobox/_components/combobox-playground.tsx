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

type RouteOption = {
  value: string;
  label: string;
  description: string;
};

type ComboboxModule = {
  Combobox: ComponentType<{
    children: ReactNode;
    itemToStringLabel: (item: RouteOption) => string;
    itemToStringValue: (item: RouteOption) => string;
    items: readonly RouteOption[];
    onValueChange: (value: RouteOption | null) => void;
    openOnInputClick?: boolean;
    value: RouteOption | null;
  }>;
  ComboboxContent: ComponentType<{
    children: ReactNode;
    side?: "bottom" | "left" | "right" | "top";
  }>;
  ComboboxEmpty: ComponentType<{ children?: ReactNode }>;
  ComboboxInput: ComponentType<{
    "aria-invalid"?: boolean;
    disabled?: boolean;
    label?: ReactNode;
    placeholder?: string;
    showClear?: boolean;
    showTrigger?: boolean;
    size?: "default" | "sm";
  }>;
  ComboboxItem: ComponentType<{
    children: ReactNode;
    description?: string;
    index: number;
    key?: string;
    value: RouteOption;
  }>;
  ComboboxList: ComponentType<{
    children: (item: RouteOption, index: number) => ReactNode;
  }>;
};

type ComboboxPlaygroundState = {
  disabled: boolean;
  invalid: boolean;
  openOnInputClick: boolean;
  showClear: boolean;
  showLabel: boolean;
  showTrigger: boolean;
  side: "bottom" | "top";
  size: "default" | "sm";
};

const PLAYGROUND_OPTIONS: RouteOption[] = [
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

const DEFAULT_STATE: ComboboxPlaygroundState = {
  disabled: false,
  invalid: false,
  openOnInputClick: false,
  showClear: true,
  showLabel: true,
  showTrigger: true,
  side: "bottom",
  size: "default",
};

const SIDE_OPTIONS: Array<{
  label: string;
  value: ComboboxPlaygroundState["side"];
}> = [
  { label: "Bottom", value: "bottom" },
  { label: "Top", value: "top" },
];

const SIZE_OPTIONS: Array<{
  label: string;
  value: ComboboxPlaygroundState["size"];
}> = [
  { label: "Default", value: "default" },
  { label: "Small", value: "sm" },
];

function generateComboboxCode(
  state: ComboboxPlaygroundState,
  importPath: string
): string {
  const inputLines = [
    state.showLabel ? 'label="Pick a route"' : null,
    'placeholder="Search routes..."',
    state.showClear ? null : "showClear={false}",
    state.showTrigger ? null : "showTrigger={false}",
    state.size !== "default" ? `size="${state.size}"` : null,
    state.disabled ? "disabled" : null,
    state.invalid ? "aria-invalid={true}" : null,
  ].filter(Boolean);

  const rootLines = [
    "itemToStringLabel={(item) => item.label}",
    "itemToStringValue={(item) => item.value}",
    "items={options}",
    "onValueChange={setValue}",
    "value={value}",
    state.openOnInputClick ? "openOnInputClick" : null,
  ].filter(Boolean);

  const contentSide =
    state.side !== "bottom" ? `\n        side="${state.side}"` : "";

  return `"use client";

import { useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "${importPath}";

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

export function ComboboxDemo() {
  const [value, setValue] = useState<RouteOption | null>(options[1]);

  return (
    <div className="w-full max-w-sm">
      <Combobox
        ${rootLines.join("\n        ")}
      >
        <ComboboxInput
          ${inputLines.join("\n          ")}
        />
        <ComboboxContent${contentSide}>
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
}

function ComboboxPlaygroundPreview({
  ComboboxModule,
  state,
}: {
  ComboboxModule: ComboboxModule;
  state: ComboboxPlaygroundState;
}) {
  const {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
  } = ComboboxModule;
  const [value, setValue] = useState<RouteOption | null>(PLAYGROUND_OPTIONS[1]);

  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <Combobox
          items={PLAYGROUND_OPTIONS}
          itemToStringLabel={(item) => item.label}
          itemToStringValue={(item) => item.value}
          onValueChange={setValue}
          openOnInputClick={state.openOnInputClick}
          value={value}
        >
          <ComboboxInput
            aria-invalid={state.invalid || undefined}
            disabled={state.disabled}
            label={state.showLabel ? "Pick a route" : undefined}
            placeholder="Search routes..."
            showClear={state.showClear}
            showTrigger={state.showTrigger}
            size={state.size}
          />
          <ComboboxContent side={state.side}>
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
        <p
          className={cn(
            "mt-3 text-center text-muted-foreground text-xs",
            !value && "opacity-60"
          )}
        >
          {value
            ? `Selected: ${value.label}`
            : "Search and pick a route from the list"}
        </p>
      </div>
    </div>
  );
}

function ComboboxPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ComboboxPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: ComboboxPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Combobox"
    >
      <DocsPlaygroundSelectField
        label="Popup side"
        onChange={(side) => onChange({ side })}
        options={SIDE_OPTIONS}
        value={state.side}
      />
      <DocsPlaygroundSelectField
        label="Input size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
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

type ComboboxPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function ComboboxPlaygroundProvider({
  ComboboxModule,
  importPath,
  children,
}: {
  ComboboxModule: ComboboxModule;
  importPath: string;
  children: (props: ComboboxPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<ComboboxPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<ComboboxPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateComboboxCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <ComboboxPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <ComboboxPlaygroundPreview
        ComboboxModule={ComboboxModule}
        state={state}
      />
    ),
    renderSettings,
  });
}
