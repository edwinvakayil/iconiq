"use client";

import { type ComponentType, type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type {
  RadioGroupOrientation,
  RadioGroupProps,
  RadioOption,
} from "@/registry/r-radio-group";

type RadioGroupModule = {
  RadioGroup: ComponentType<RadioGroupProps>;
};

type RadioGroupPattern = "default" | "disabled-option" | "invalid" | "required";

type RadioGroupPlaygroundState = {
  orientation: RadioGroupOrientation;
  pattern: RadioGroupPattern;
  showDescriptions: boolean;
};

const DEFAULT_STATE: RadioGroupPlaygroundState = {
  orientation: "vertical",
  pattern: "default",
  showDescriptions: true,
};

const ORIENTATION_OPTIONS: Array<{
  label: string;
  value: RadioGroupOrientation;
}> = [
  { label: "Vertical", value: "vertical" },
  { label: "Horizontal", value: "horizontal" },
];

const PATTERN_OPTIONS: Array<{ label: string; value: RadioGroupPattern }> = [
  { label: "Default", value: "default" },
  { label: "Disabled option", value: "disabled-option" },
  { label: "Invalid", value: "invalid" },
  { label: "Required", value: "required" },
];

const baseOptions: RadioOption[] = [
  {
    value: "standard",
    label: "Standard delivery",
    description: "Tracked parcel in three to five business days.",
  },
  {
    value: "express",
    label: "Express",
    description: "Handoff next business day where available.",
  },
  {
    value: "pickup",
    label: "Pickup point",
    description: "Collect when convenient — no doorstep drop.",
  },
];

function getPlaygroundOptions(state: RadioGroupPlaygroundState): RadioOption[] {
  return baseOptions.map((option) => ({
    ...option,
    description: state.showDescriptions ? option.description : undefined,
    disabled:
      state.pattern === "disabled-option" && option.value === "express"
        ? true
        : option.disabled,
  }));
}

function formatOptionalFlags(state: RadioGroupPlaygroundState) {
  const flags: string[] = [];

  if (state.pattern === "invalid") {
    flags.push("invalid");
  }

  if (state.pattern === "required") {
    flags.push("required");
  }

  if (state.orientation === "horizontal") {
    flags.push('orientation="horizontal"');
  }

  if (flags.length === 0) {
    return "";
  }

  return `\n        ${flags.join("\n        ")}`;
}

function generateRadioGroupCode(
  state: RadioGroupPlaygroundState,
  importPath: string
) {
  const optionsCode = getPlaygroundOptions(state)
    .map((option) => {
      const lines = [
        `    value: "${option.value}"`,
        `    label: "${option.label}"`,
      ];

      if (option.description) {
        lines.push(`    description: "${option.description}"`);
      }

      if (option.disabled) {
        lines.push("    disabled: true");
      }

      return `  {\n    ${lines.join(",\n    ")},\n  }`;
    })
    .join(",\n");

  return `"use client";

import { useState } from "react";
import RadioGroup from "${importPath}";

const options = [
${optionsCode},
];

export function RadioGroupPreview() {
  const [value, setValue] = useState("standard");

  return (
    <div className="flex w-full justify-center px-4 py-6">
      <div className="flex w-full max-w-md flex-col gap-2">
        <RadioGroup
          aria-describedby="delivery-help"
          className="w-full"
          label="Delivery options"
          onChange={setValue}
          options={options}
          value={value}${formatOptionalFlags(state)}
        />
      </div>
    </div>
  );
}`;
}

function RadioGroupPlaygroundPreview({
  RadioGroup,
  state,
}: {
  RadioGroup: RadioGroupModule["RadioGroup"];
  state: RadioGroupPlaygroundState;
}) {
  const [value, setValue] = useState("standard");
  const options = getPlaygroundOptions(state);

  const sharedProps = {
    "aria-describedby":
      state.pattern === "invalid" ? "delivery-error" : "delivery-help",
    className: "w-full",
    label: "Delivery options",
    onChange: setValue,
    options,
    orientation: state.orientation,
    value,
  } satisfies Partial<RadioGroupProps>;

  return (
    <div className="flex w-full justify-center px-4 py-6">
      <div className="flex w-full max-w-md flex-col gap-2">
        <RadioGroup
          {...sharedProps}
          invalid={state.pattern === "invalid"}
          required={state.pattern === "required"}
        />
        {state.pattern === "invalid" ? (
          <p className="text-destructive text-sm" id="delivery-error">
            Choose a delivery option to continue.
          </p>
        ) : (
          <p className="text-muted-foreground text-sm" id="delivery-help">
            Pick the delivery speed that fits your timeline.
          </p>
        )}
      </div>
    </div>
  );
}

function RadioGroupPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<RadioGroupPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: RadioGroupPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Radio Group"
    >
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) =>
          onChange({ pattern: pattern as RadioGroupPattern })
        }
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      <DocsPlaygroundSelectField
        label="Orientation"
        onChange={(orientation) =>
          onChange({ orientation: orientation as RadioGroupOrientation })
        }
        options={ORIENTATION_OPTIONS}
        value={state.orientation}
      />
      <DocsPlaygroundToggleField
        checked={state.showDescriptions}
        label="Show descriptions"
        onChange={(showDescriptions) => onChange({ showDescriptions })}
      />
    </DocsPlaygroundPanel>
  );
}

type RadioGroupPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function RadioGroupPlaygroundProvider({
  RadioGroupModule,
  importPath,
  children,
}: {
  RadioGroupModule: RadioGroupModule;
  importPath: string;
  children: (props: RadioGroupPlaygroundRenderProps) => ReactNode;
}) {
  const { RadioGroup } = RadioGroupModule;
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<RadioGroupPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<RadioGroupPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateRadioGroupCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <RadioGroupPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <RadioGroupPlaygroundPreview RadioGroup={RadioGroup} state={state} />
    ),
    renderSettings,
  });
}
