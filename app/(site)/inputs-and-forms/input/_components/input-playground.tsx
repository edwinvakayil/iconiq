"use client";

import { type ComponentType, type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type { InputProps, InputSize } from "@/registry/input";

type InputModule = {
  Input: ComponentType<InputProps>;
};

type InputPattern =
  | "default"
  | "disabled"
  | "invalid"
  | "password"
  | "readonly";

type InputPlaygroundState = {
  pattern: InputPattern;
  required: boolean;
  showClear: boolean;
  showDescription: boolean;
  showLabel: boolean;
  showPasswordToggle: boolean;
  size: InputSize;
};

const DEFAULT_STATE: InputPlaygroundState = {
  pattern: "default",
  required: false,
  showClear: false,
  showDescription: true,
  showLabel: true,
  showPasswordToggle: true,
  size: "default",
};

const SIZE_OPTIONS: Array<{ label: string; value: InputSize }> = [
  { label: "Small", value: "sm" },
  { label: "Default", value: "default" },
];

const PATTERN_OPTIONS: Array<{ label: string; value: InputPattern }> = [
  { label: "Default", value: "default" },
  { label: "Password", value: "password" },
  { label: "Disabled", value: "disabled" },
  { label: "Invalid", value: "invalid" },
  { label: "Read only", value: "readonly" },
];

function formatSizeAttr(size: InputSize) {
  return size === "default" ? "" : `\n        size="${size}"`;
}

function formatOptionalFlags(state: InputPlaygroundState) {
  const flags: string[] = [];

  if (state.required) {
    flags.push("required");
  }

  if (state.showClear) {
    flags.push("showClear");
  }

  if (state.pattern === "disabled") {
    flags.push("disabled");
  }

  if (state.pattern === "readonly") {
    flags.push("readOnly");
  }

  if (state.pattern === "invalid") {
    flags.push("invalid");
  }

  if (flags.length === 0) {
    return "";
  }

  return `\n        ${flags.join("\n        ")}`;
}

function generateInputCode(state: InputPlaygroundState, importPath: string) {
  const labelBlock = state.showLabel
    ? `\n        label="Work email"`
    : `\n        aria-label="Work email"`;
  const descriptionBlock = state.showDescription
    ? `\n        description="We only use this for account notifications."`
    : "";
  const errorBlock =
    state.pattern === "invalid"
      ? `\n        errorMessage="Enter a valid company email address."`
      : "";
  const passwordToggleBlock =
    state.pattern === "password" && !state.showPasswordToggle
      ? "\n        showPasswordToggle={false}"
      : "";

  if (state.pattern === "password") {
    return `"use client";

import { useState } from "react";
import { Input } from "${importPath}";

export function InputPasswordExample() {
  const [value, setValue] = useState("");

  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Input
        label="Password"
        onValueChange={setValue}
        placeholder="Enter your password"
        type="password"
        value={value}${formatSizeAttr(state.size)}${passwordToggleBlock}${formatOptionalFlags(state)}
      />
    </div>
  );
}`;
  }

  if (state.pattern === "disabled") {
    return `"use client";

import { Input } from "${importPath}";

export function InputDisabledExample() {
  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Input
        defaultValue="name@company.com"
        disabled
        label="Work email"${formatSizeAttr(state.size)}
      />
    </div>
  );
}`;
  }

  if (state.pattern === "readonly") {
    return `"use client";

import { Input } from "${importPath}";

export function InputReadOnlyExample() {
  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Input
        defaultValue="name@company.com"
        label="Work email"
        readOnly${formatSizeAttr(state.size)}
      />
    </div>
  );
}`;
  }

  return `"use client";

import { useState } from "react";
import { Input } from "${importPath}";

export function InputPreview() {
  const [value, setValue] = useState(${state.pattern === "invalid" ? '"not-an-email"' : '""'});

  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Input
        onValueChange={setValue}
        placeholder="name@company.com"
        value={value}${labelBlock}${descriptionBlock}${errorBlock}${formatSizeAttr(state.size)}${formatOptionalFlags(state)}
      />
    </div>
  );
}`;
}

function InputPlaygroundPreview({
  Input,
  state,
}: {
  Input: ComponentType<InputProps>;
  state: InputPlaygroundState;
}) {
  const [value, setValue] = useState(
    state.pattern === "invalid" ? "not-an-email" : ""
  );

  useEffect(() => {
    setValue(state.pattern === "invalid" ? "not-an-email" : "");
  }, [state.pattern]);

  const sharedProps = {
    id: "input-playground",
    onValueChange: setValue,
    placeholder: "name@company.com",
    size: state.size,
    value,
  } satisfies Partial<InputProps>;

  if (state.pattern === "password") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <Input
          {...sharedProps}
          label="Password"
          placeholder="Enter your password"
          showPasswordToggle={state.showPasswordToggle}
          type="password"
        />
      </div>
    );
  }

  if (state.pattern === "disabled") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <Input
          defaultValue="name@company.com"
          disabled
          id="input-playground"
          label="Work email"
          size={state.size}
        />
      </div>
    );
  }

  if (state.pattern === "readonly") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <Input
          defaultValue="name@company.com"
          id="input-playground"
          label="Work email"
          readOnly
          size={state.size}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Input
        {...sharedProps}
        aria-label={state.showLabel ? undefined : "Work email"}
        description={
          state.showDescription
            ? "We only use this for account notifications."
            : undefined
        }
        errorMessage={
          state.pattern === "invalid"
            ? "Enter a valid company email address."
            : undefined
        }
        invalid={state.pattern === "invalid"}
        label={state.showLabel ? "Work email" : undefined}
        required={state.required}
        showClear={state.showClear}
      />
    </div>
  );
}

function InputPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<InputPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: InputPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Input"
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
            checked={state.showClear}
            label="Show clear button"
            onChange={(showClear) => onChange({ showClear })}
          />
          <DocsPlaygroundToggleField
            checked={state.required}
            label="Required"
            onChange={(required) => onChange({ required })}
          />
        </>
      ) : null}
      {state.pattern === "password" ? (
        <DocsPlaygroundToggleField
          checked={state.showPasswordToggle}
          label="Show password toggle"
          onChange={(showPasswordToggle) => onChange({ showPasswordToggle })}
        />
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type InputPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function InputPlaygroundProvider({
  InputModule,
  importPath,
  children,
}: {
  InputModule: InputModule;
  importPath: string;
  children: (props: InputPlaygroundRenderProps) => ReactNode;
}) {
  const { Input } = InputModule;
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<InputPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<InputPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateInputCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <InputPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <InputPlaygroundPreview Input={Input} state={state} />,
    renderSettings,
  });
}
