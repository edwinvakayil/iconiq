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
  CheckboxCheckedState,
  CheckboxProps,
  CheckboxSize,
} from "@/registry/b-checkbox";

type CheckboxModule = {
  Checkbox: ComponentType<CheckboxProps>;
};

type CheckboxPattern =
  | "default"
  | "disabled"
  | "indeterminate"
  | "invalid"
  | "readonly";

type CheckboxPlaygroundState = {
  checked: boolean;
  pattern: CheckboxPattern;
  required: boolean;
  showDescription: boolean;
  showLabel: boolean;
  size: CheckboxSize;
};

const DEFAULT_STATE: CheckboxPlaygroundState = {
  checked: true,
  pattern: "default",
  required: false,
  showDescription: false,
  showLabel: true,
  size: "default",
};

const SIZE_OPTIONS: Array<{ label: string; value: CheckboxSize }> = [
  { label: "Small", value: "sm" },
  { label: "Default", value: "default" },
  { label: "Large", value: "lg" },
];

const PATTERN_OPTIONS: Array<{ label: string; value: CheckboxPattern }> = [
  { label: "Default", value: "default" },
  { label: "Disabled", value: "disabled" },
  { label: "Indeterminate", value: "indeterminate" },
  { label: "Invalid", value: "invalid" },
  { label: "Read only", value: "readonly" },
];

function formatSizeAttr(size: CheckboxSize) {
  return size === "default" ? "" : `\n        size="${size}"`;
}

function formatOptionalFlags(state: CheckboxPlaygroundState) {
  const flags: string[] = [];

  if (state.required) {
    flags.push("required");
  }

  if (state.pattern === "disabled") {
    flags.push("disabled");
  }

  if (state.pattern === "invalid") {
    flags.push("invalid");
  }

  if (state.pattern === "readonly") {
    flags.push("readOnly");
  }

  if (flags.length === 0) {
    return "";
  }

  return `\n        ${flags.join("\n        ")}`;
}

function generateCheckboxCode(
  state: CheckboxPlaygroundState,
  importPath: string
) {
  const labelBlock = state.showLabel
    ? `\n        label="Email me when the next release ships"`
    : "";
  const descriptionBlock = state.showDescription
    ? `\n        description="You can turn this off anytime in account settings."`
    : "";

  if (state.pattern === "indeterminate") {
    return `"use client";

import { Checkbox } from "${importPath}";

export function CheckboxIndeterminateExample() {
  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Checkbox
        checked="indeterminate"
        id="release-updates-indeterminate"
        label="Select all notifications"${formatSizeAttr(state.size)}
      />
    </div>
  );
}`;
  }

  if (state.pattern === "disabled") {
    return `"use client";

import { Checkbox } from "${importPath}";

export function CheckboxDisabledExample() {
  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Checkbox
        checked
        disabled
        id="release-updates-disabled"
        label="Email me when the next release ships"${formatSizeAttr(state.size)}
      />
    </div>
  );
}`;
  }

  if (state.pattern === "readonly") {
    return `"use client";

import { Checkbox } from "${importPath}";

export function CheckboxReadOnlyExample() {
  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Checkbox
        checked
        id="release-updates-readonly"
        label="Terms accepted during onboarding"
        readOnly${formatSizeAttr(state.size)}
      />
    </div>
  );
}`;
  }

  return `"use client";

import { useState } from "react";
import { Checkbox } from "${importPath}";

export function CheckboxPreview() {
  const [checked, setChecked] = useState(${state.checked ? "true" : "false"});

  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Checkbox
        checked={checked}
        id="release-updates"
        onCheckedChange={setChecked}${labelBlock}${descriptionBlock}${formatSizeAttr(state.size)}${formatOptionalFlags(state)}
      />
    </div>
  );
}`;
}

function CheckboxPlaygroundPreview({
  Checkbox,
  state,
}: {
  Checkbox: ComponentType<CheckboxProps>;
  state: CheckboxPlaygroundState;
}) {
  const [checked, setChecked] = useState(state.checked);

  useEffect(() => {
    setChecked(state.checked);
  }, [state.checked]);

  const sharedProps = {
    id: "release-updates-playground",
    size: state.size,
  } satisfies Partial<CheckboxProps>;

  if (state.pattern === "indeterminate") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <Checkbox
          {...sharedProps}
          checked="indeterminate"
          label="Select all notifications"
        />
      </div>
    );
  }

  if (state.pattern === "disabled") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <Checkbox
          {...sharedProps}
          checked
          disabled
          label="Email me when the next release ships"
        />
      </div>
    );
  }

  if (state.pattern === "readonly") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <Checkbox
          {...sharedProps}
          checked
          label="Terms accepted during onboarding"
          readOnly
        />
      </div>
    );
  }

  let controlledChecked: CheckboxCheckedState = checked;

  if (state.pattern === "invalid" && !checked) {
    controlledChecked = false;
  }

  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Checkbox
        {...sharedProps}
        checked={controlledChecked}
        description={
          state.showDescription
            ? "You can turn this off anytime in account settings."
            : undefined
        }
        invalid={state.pattern === "invalid"}
        label={
          state.showLabel ? "Email me when the next release ships" : undefined
        }
        onCheckedChange={setChecked}
        required={state.required}
      />
    </div>
  );
}

function CheckboxPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<CheckboxPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: CheckboxPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Checkbox"
    >
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {state.pattern === "default" || state.pattern === "invalid" ? (
        <>
          <DocsPlaygroundToggleField
            checked={state.showLabel}
            label="Show label"
            onChange={(showLabel) => onChange({ showLabel })}
          />
          <DocsPlaygroundToggleField
            checked={state.showDescription}
            label="Show description"
            onChange={(showDescription) => onChange({ showDescription })}
          />
          <DocsPlaygroundToggleField
            checked={state.checked}
            label="Checked"
            onChange={(checked) => onChange({ checked })}
          />
          <DocsPlaygroundToggleField
            checked={state.required}
            label="Required"
            onChange={(required) => onChange({ required })}
          />
        </>
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type CheckboxPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function CheckboxPlaygroundProvider({
  CheckboxModule,
  importPath,
  children,
}: {
  CheckboxModule: CheckboxModule;
  importPath: string;
  children: (props: CheckboxPlaygroundRenderProps) => ReactNode;
}) {
  const { Checkbox } = CheckboxModule;
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<CheckboxPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<CheckboxPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateCheckboxCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <CheckboxPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <CheckboxPlaygroundPreview Checkbox={Checkbox} state={state} />,
    renderSettings,
  });
}
