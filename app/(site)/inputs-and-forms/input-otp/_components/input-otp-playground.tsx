"use client";

import { type ComponentType, type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type { OTPProps, OTPSize } from "@/registry/input-otp";

type InputOtpModule = {
  OTP: ComponentType<OTPProps>;
  OTPSlots: ComponentType<import("@/registry/input-otp").OTPSlotsProps>;
};

type InputOtpPattern =
  | "default"
  | "alphanumeric"
  | "disabled"
  | "invalid"
  | "masked"
  | "readonly";

type InputOtpPlaygroundState = {
  length: number;
  pattern: InputOtpPattern;
  required: boolean;
  showDescription: boolean;
  showLabel: boolean;
  showPlaceholder: boolean;
  showSeparator: boolean;
  size: OTPSize;
};

const DEFAULT_STATE: InputOtpPlaygroundState = {
  length: 6,
  pattern: "default",
  required: false,
  showDescription: true,
  showLabel: true,
  showPlaceholder: false,
  showSeparator: true,
  size: "default",
};

const SIZE_OPTIONS: Array<{ label: string; value: OTPSize }> = [
  { label: "Small", value: "sm" },
  { label: "Default", value: "default" },
];

const LENGTH_OPTIONS = [
  { label: "4 digits", value: "4" },
  { label: "6 digits", value: "6" },
  { label: "8 digits", value: "8" },
] as const;

const PATTERN_OPTIONS: Array<{ label: string; value: InputOtpPattern }> = [
  { label: "Default", value: "default" },
  { label: "Alphanumeric", value: "alphanumeric" },
  { label: "Masked", value: "masked" },
  { label: "Invalid", value: "invalid" },
  { label: "Disabled", value: "disabled" },
  { label: "Read only", value: "readonly" },
];

function formatOptionalFlags(state: InputOtpPlaygroundState) {
  const flags: string[] = [];

  if (state.required) {
    flags.push("required");
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

  if (state.pattern === "masked") {
    flags.push("mask");
  }

  if (state.size !== "default") {
    flags.push(`size="${state.size}"`);
  }

  if (flags.length === 0) {
    return "";
  }

  return `\n        ${flags.join("\n        ")}`;
}

function formatSlotsProps(state: InputOtpPlaygroundState) {
  const props: string[] = [];

  if (state.showSeparator && state.length > 3) {
    props.push(`separatorAfter={${Math.floor(state.length / 2)}}`);
  }

  if (state.showPlaceholder) {
    props.push('placeholder="0"');
  }

  if (props.length === 0) {
    return "";
  }

  return `\n        ${props.join("\n        ")}`;
}

function getSampleOtpValue(length: number) {
  return "8374920165".slice(0, length);
}

function getInvalidOtpValue(length: number) {
  return `${getSampleOtpValue(length).slice(0, -1)}0`;
}

function generateInputOtpCode(
  state: InputOtpPlaygroundState,
  importPath: string
) {
  const labelBlock = state.showLabel
    ? `\n        label="Verification code"`
    : `\n        aria-label="Verification code"`;
  const descriptionBlock = state.showDescription
    ? `\n        description="Enter the code sent to your device."`
    : "";
  const errorBlock =
    state.pattern === "invalid"
      ? `\n        errorMessage="That code is incorrect. Try again."`
      : "";
  const validationBlock =
    state.pattern === "alphanumeric"
      ? `\n        validationType="alphanumeric"`
      : "";

  if (state.pattern === "disabled") {
    return `"use client";

import { OTP, OTPSlots } from "${importPath}";

export function InputOtpDisabledExample() {
  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <OTP
        id="verification-code"
        label="Verification code"
        length={${state.length}}
        disabled
        value="${getSampleOtpValue(state.length)}"
      >
        <OTPSlots${formatSlotsProps(state)} />
      </OTP>
    </div>
  );
}`;
  }

  if (state.pattern === "readonly") {
    return `"use client";

import { OTP, OTPSlots } from "${importPath}";

export function InputOtpReadOnlyExample() {
  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <OTP
        id="verification-code"
        label="Verification code"
        length={${state.length}}
        readOnly
        value="${getSampleOtpValue(state.length)}"
      >
        <OTPSlots${formatSlotsProps(state)} />
      </OTP>
    </div>
  );
}`;
  }

  return `"use client";

import { useState } from "react";
import { OTP, OTPSlots } from "${importPath}";

export function InputOtpPreview() {
  const [value, setValue] = useState(${state.pattern === "invalid" ? '"123450"' : '""'});

  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <OTP
        id="verification-code"
        length={${state.length}}
        onValueChange={setValue}
        value={value}${labelBlock}${descriptionBlock}${errorBlock}${validationBlock}${formatOptionalFlags(state)}
      >
        <OTPSlots${formatSlotsProps(state)} />
      </OTP>
    </div>
  );
}`;
}

function InputOtpPlaygroundPreview({
  OTP,
  OTPSlots,
  state,
}: {
  OTP: ComponentType<OTPProps>;
  OTPSlots: InputOtpModule["OTPSlots"];
  state: InputOtpPlaygroundState;
}) {
  const [value, setValue] = useState(() => {
    if (state.pattern === "invalid") {
      return getInvalidOtpValue(state.length);
    }

    if (state.pattern === "disabled" || state.pattern === "readonly") {
      return getSampleOtpValue(state.length);
    }

    return "";
  });

  useEffect(() => {
    if (state.pattern === "invalid") {
      setValue(getInvalidOtpValue(state.length));
      return;
    }

    if (state.pattern === "disabled" || state.pattern === "readonly") {
      setValue(getSampleOtpValue(state.length));
      return;
    }

    setValue("");
  }, [state.pattern, state.length]);

  const separatorAfter =
    state.showSeparator && state.length > 3
      ? Math.floor(state.length / 2)
      : undefined;

  const sharedProps = {
    id: "input-otp-playground",
    length: state.length,
    size: state.size,
  } satisfies Partial<OTPProps>;

  if (state.pattern === "disabled") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <OTP {...sharedProps} disabled label="Verification code" value={value}>
          <OTPSlots
            placeholder={state.showPlaceholder ? "0" : undefined}
            separatorAfter={separatorAfter}
          />
        </OTP>
      </div>
    );
  }

  if (state.pattern === "readonly") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <OTP {...sharedProps} label="Verification code" readOnly value={value}>
          <OTPSlots
            placeholder={state.showPlaceholder ? "0" : undefined}
            separatorAfter={separatorAfter}
          />
        </OTP>
      </div>
    );
  }

  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <OTP
        {...sharedProps}
        aria-label={state.showLabel ? undefined : "Verification code"}
        description={
          state.showDescription
            ? "Enter the code sent to your device."
            : undefined
        }
        errorMessage={
          state.pattern === "invalid"
            ? "That code is incorrect. Try again."
            : undefined
        }
        invalid={state.pattern === "invalid"}
        label={state.showLabel ? "Verification code" : undefined}
        mask={state.pattern === "masked"}
        onValueChange={setValue}
        required={state.required}
        validationType={
          state.pattern === "alphanumeric" ? "alphanumeric" : undefined
        }
        value={value}
      >
        <OTPSlots
          placeholder={state.showPlaceholder ? "0" : undefined}
          separatorAfter={separatorAfter}
        />
      </OTP>
    </div>
  );
}

function InputOtpPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<InputOtpPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: InputOtpPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Input OTP"
    >
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundSelectField
        label="Length"
        onChange={(length) => onChange({ length: Number(length) })}
        options={[...LENGTH_OPTIONS]}
        value={String(state.length)}
      />
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {state.pattern === "default" ||
      state.pattern === "invalid" ||
      state.pattern === "masked" ||
      state.pattern === "alphanumeric" ? (
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
            checked={state.required}
            label="Required"
            onChange={(required) => onChange({ required })}
          />
        </>
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.showSeparator}
        label="Show separator"
        onChange={(showSeparator) => onChange({ showSeparator })}
      />
      <DocsPlaygroundToggleField
        checked={state.showPlaceholder}
        label="Show placeholder hints"
        onChange={(showPlaceholder) => onChange({ showPlaceholder })}
      />
    </DocsPlaygroundPanel>
  );
}

type InputOtpPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function InputOtpPlaygroundProvider({
  InputOtpModule,
  importPath,
  children,
}: {
  InputOtpModule: InputOtpModule;
  importPath: string;
  children: (props: InputOtpPlaygroundRenderProps) => ReactNode;
}) {
  const { OTP, OTPSlots } = InputOtpModule;
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<InputOtpPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<InputOtpPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateInputOtpCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <InputOtpPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <InputOtpPlaygroundPreview OTP={OTP} OTPSlots={OTPSlots} state={state} />
    ),
    renderSettings,
  });
}
