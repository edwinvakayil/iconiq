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
import type {
  ProgressProps,
  ProgressSize,
  ProgressTone,
  ProgressVariant,
} from "@/registry/r-progress";

type ProgressModule = {
  Progress: ComponentType<ProgressProps>;
};

type ProgressPlaygroundState = {
  helper: string;
  indeterminate: boolean;
  indeterminateLabel: string;
  label: string;
  showHelper: boolean;
  showLabel: boolean;
  showValue: boolean;
  size: ProgressSize;
  tone: ProgressTone;
  value: number;
  variant: ProgressVariant;
};

const DEFAULT_STATE: ProgressPlaygroundState = {
  helper: "Smooth width animation keeps the bar and inline readout aligned.",
  indeterminate: false,
  indeterminateLabel: "Syncing",
  label: "Registry sync",
  showHelper: true,
  showLabel: true,
  showValue: true,
  size: "md",
  tone: "default",
  value: 64,
  variant: "default",
};

const VARIANT_OPTIONS: Array<{ label: string; value: ProgressVariant }> = [
  { label: "Default", value: "default" },
  { label: "Circular", value: "circular" },
];

const SIZE_OPTIONS: Array<{ label: string; value: ProgressSize }> = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const TONE_OPTIONS: Array<{ label: string; value: ProgressTone }> = [
  { label: "Default", value: "default" },
  { label: "Brand", value: "brand" },
  { label: "Destructive", value: "destructive" },
  { label: "Success", value: "success" },
];

const VALUE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "0%", value: "0" },
  { label: "25%", value: "25" },
  { label: "50%", value: "50" },
  { label: "64%", value: "64" },
  { label: "100%", value: "100" },
];

function escapeCodeString(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function progressPropsFromState(state: ProgressPlaygroundState) {
  const props: ProgressProps = {
    size: state.size,
    tone: state.tone,
    value: state.indeterminate ? null : state.value,
    variant: state.variant,
  };

  if (state.showLabel) {
    props.label = state.label;
  }

  if (state.showHelper) {
    props.helper = state.helper;
  }

  if (!state.showValue) {
    props.showValue = false;
  }

  if (state.indeterminate) {
    props.indeterminateLabel = state.indeterminateLabel;
  }

  return props;
}

function generateProgressCode(
  state: ProgressPlaygroundState,
  importPath: string
) {
  const lines: string[] = [];

  if (state.indeterminate) {
    lines.push("value={null}");
    if (state.indeterminateLabel !== "In progress") {
      lines.push(
        `indeterminateLabel="${escapeCodeString(state.indeterminateLabel)}"`
      );
    }
  } else if (state.value !== 0) {
    lines.push(`value={${state.value}}`);
  }

  if (state.variant !== "default") {
    lines.push(`variant="${state.variant}"`);
  }

  if (state.size !== "md") {
    lines.push(`size="${state.size}"`);
  }

  if (state.tone !== "default") {
    lines.push(`tone="${state.tone}"`);
  }

  if (state.showLabel) {
    lines.push(`label="${escapeCodeString(state.label)}"`);
  }

  if (state.showHelper) {
    lines.push(`helper="${escapeCodeString(state.helper)}"`);
  }

  if (!state.showValue) {
    lines.push("showValue={false}");
  }

  const propsBlock =
    lines.length > 0 ? `\n      ${lines.join("\n      ")}\n    ` : " ";

  return `"use client";

import { Progress } from "${importPath}";

export function ProgressDemo() {
  return (
    <Progress className="w-full max-w-sm"${propsBlock}/>
  );
}`;
}

function DocsPlaygroundTextField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <div className="flex min-h-12 items-center gap-3 overflow-hidden rounded-2xl bg-[#ebebeb] px-3 dark:bg-[#232323]">
      <span className="shrink-0 whitespace-nowrap font-medium text-[#5c5c61] text-[13px] dark:text-[#a1a1a6]">
        {label}
      </span>
      <input
        className={cn(
          "min-w-0 flex-1 bg-transparent py-2 text-right font-medium text-[#111113] text-[13px] outline-none placeholder:text-[#5c5c61] dark:text-zinc-100 dark:placeholder:text-[#a1a1a6]"
        )}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        type="text"
        value={value}
      />
    </div>
  );
}

function ProgressPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ProgressPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: ProgressPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Progress"
    >
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundToggleField
        checked={state.indeterminate}
        label="Indeterminate"
        onChange={(indeterminate) => onChange({ indeterminate })}
      />
      {state.indeterminate ? (
        <DocsPlaygroundTextField
          label="Status"
          onChange={(indeterminateLabel) => onChange({ indeterminateLabel })}
          placeholder="Syncing"
          value={state.indeterminateLabel}
        />
      ) : (
        <DocsPlaygroundSelectField
          label="Value"
          onChange={(value) => onChange({ value: Number(value) })}
          options={VALUE_OPTIONS}
          value={String(state.value)}
        />
      )}
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundSelectField
        label="Tone"
        onChange={(tone) => onChange({ tone })}
        options={TONE_OPTIONS}
        value={state.tone}
      />
      <DocsPlaygroundToggleField
        checked={state.showLabel}
        label="Label"
        onChange={(showLabel) => onChange({ showLabel })}
      />
      {state.showLabel ? (
        <DocsPlaygroundTextField
          label="Label text"
          onChange={(label) => onChange({ label })}
          placeholder="Task name"
          value={state.label}
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.showHelper}
        label="Helper"
        onChange={(showHelper) => onChange({ showHelper })}
      />
      {state.showHelper ? (
        <DocsPlaygroundTextField
          label="Helper text"
          onChange={(helper) => onChange({ helper })}
          placeholder="Supporting copy"
          value={state.helper}
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.showValue}
        label="Value readout"
        onChange={(showValue) => onChange({ showValue })}
      />
    </DocsPlaygroundPanel>
  );
}

type ProgressPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function ProgressPlaygroundProvider({
  ProgressModule,
  importPath,
  children,
}: {
  ProgressModule: ProgressModule;
  importPath: string;
  children: (props: ProgressPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<ProgressPlaygroundState>(DEFAULT_STATE);
  const { Progress } = ProgressModule;

  const updateState = (next: Partial<ProgressPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateProgressCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <ProgressPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <div className="flex min-h-[10rem] w-full items-center justify-center px-4 py-6">
        <div
          className={cn(
            state.variant === "circular" ? "w-auto" : "w-full max-w-lg"
          )}
        >
          <Progress className="w-full" {...progressPropsFromState(state)} />
        </div>
      </div>
    ),
    renderSettings,
  });
}
