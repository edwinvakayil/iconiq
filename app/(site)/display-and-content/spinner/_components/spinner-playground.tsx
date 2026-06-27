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
import type { SpinnerProps } from "@/registry/spinner";

type SpinnerModule = {
  Spinner: ComponentType<SpinnerProps>;
};

type SpinnerPlaygroundState = {
  decorative: boolean;
  size: NonNullable<SpinnerProps["size"]>;
  variant: NonNullable<SpinnerProps["variant"]>;
};

const DEFAULT_STATE: SpinnerPlaygroundState = {
  decorative: true,
  size: "sm",
  variant: "ring",
};

const VARIANT_OPTIONS: Array<{
  label: string;
  value: NonNullable<SpinnerProps["variant"]>;
}> = [
  { label: "Ring", value: "ring" },
  { label: "Dots", value: "dots" },
  { label: "Matrix", value: "matrix" },
];

const SIZE_OPTIONS: Array<{
  label: string;
  value: NonNullable<SpinnerProps["size"]>;
}> = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

function spinnerPropsFromState(state: SpinnerPlaygroundState) {
  const props: SpinnerProps = {
    size: state.size,
    variant: state.variant,
  };

  if (state.decorative) {
    props.decorative = true;
  }

  return props;
}

function spinnerPropLines(props: SpinnerProps) {
  const lines: string[] = [];

  if (props.variant !== "ring") {
    lines.push(`variant="${props.variant}"`);
  }

  if (props.size !== "md") {
    lines.push(`size="${props.size}"`);
  }

  if (props.decorative) {
    lines.push("decorative");
  }

  return lines;
}

function generateSpinnerCode(
  state: SpinnerPlaygroundState,
  importPath: string
): string {
  const sharedProps = spinnerPropsFromState(state);
  const propLines = spinnerPropLines(sharedProps);
  const propsBlock = propLines.length > 0 ? ` ${propLines.join(" ")}` : "";

  return `"use client";

import Spinner from "${importPath}";

export function SpinnerDemo() {
  return (
    <p className="flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2.5 text-center text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
      <span className="text-neutral-500 dark:text-neutral-400">
        Every stall deserves a kinder signal —
      </span>
      <Spinner className="shrink-0"${propsBlock} />
      <span className="font-medium text-sky-600 dark:text-sky-400">
        calm motion that still reads.
      </span>
    </p>
  );
}`;
}

function SpinnerSentencePreview({
  Spinner,
  state,
}: {
  Spinner: SpinnerModule["Spinner"];
  state: SpinnerPlaygroundState;
}) {
  return (
    <p
      className={cn(
        "flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2.5",
        "text-balance text-center font-sans text-[13px] text-neutral-600 leading-relaxed sm:max-w-2xl sm:gap-x-2 sm:text-[14px]",
        "dark:text-neutral-300"
      )}
    >
      <span className="text-neutral-500 dark:text-neutral-400">
        Every stall deserves a kinder signal —
      </span>
      <Spinner className="shrink-0" {...spinnerPropsFromState(state)} />
      <span className="font-medium text-sky-600 dark:text-sky-400">
        calm motion that still reads.
      </span>
    </p>
  );
}

function SpinnerPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<SpinnerPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: SpinnerPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Spinner"
    >
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundToggleField
        checked={state.decorative}
        label="Decorative"
        onChange={(decorative) => onChange({ decorative })}
      />
    </DocsPlaygroundPanel>
  );
}

type SpinnerPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function SpinnerPlaygroundProvider({
  SpinnerModule,
  importPath,
  children,
}: {
  SpinnerModule: SpinnerModule;
  importPath: string;
  children: (props: SpinnerPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<SpinnerPlaygroundState>(DEFAULT_STATE);
  const { Spinner } = SpinnerModule;

  const updateState = (next: Partial<SpinnerPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateSpinnerCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <SpinnerPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-8">
        <SpinnerSentencePreview Spinner={Spinner} state={state} />
      </div>
    ),
    renderSettings,
  });
}
