"use client";

import { Bold, Italic } from "lucide-react";
import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";

type ToggleVariant = "default" | "outline";
type TogglePattern = "inline" | "labeled" | "disabled";

type ToggleComponentProps = {
  "aria-label"?: string;
  className?: string;
  defaultPressed?: boolean;
  disabled?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  pressed?: boolean;
  size?: "default" | "lg" | "sm";
  variant?: ToggleVariant;
  children?: ReactNode;
};

type TogglePlaygroundState = {
  variant: ToggleVariant;
  pattern: TogglePattern;
  pressed: boolean;
};

const sentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const toggleInlineClassName =
  "inline-flex translate-y-px items-center align-middle";

const iconToggleClassName = "size-8 min-h-8 min-w-8 shrink-0 px-2 py-2";

const DEFAULT_STATE: TogglePlaygroundState = {
  variant: "outline",
  pattern: "inline",
  pressed: false,
};

const VARIANT_OPTIONS: Array<{ label: string; value: ToggleVariant }> = [
  { label: "Default", value: "default" },
  { label: "Outline", value: "outline" },
];

const PATTERN_OPTIONS: Array<{ label: string; value: TogglePattern }> = [
  { label: "Inline", value: "inline" },
  { label: "Labeled", value: "labeled" },
  { label: "Disabled", value: "disabled" },
];

const TogglePlaygroundContext = createContext<{
  state: TogglePlaygroundState;
  Toggle: ComponentType<ToggleComponentProps>;
} | null>(null);

function useTogglePlayground() {
  const context = useContext(TogglePlaygroundContext);

  if (!context) {
    throw new Error(
      "TogglePlayground components must be used within TogglePlaygroundProvider."
    );
  }

  return context;
}

function SentencePreview({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className={sentenceClassName}>{children}</p>
      </div>
    </div>
  );
}

function formatVariantAttr(variant: ToggleVariant) {
  return variant === "default" ? "" : ` variant="${variant}"`;
}

function generateToggleCode(state: TogglePlaygroundState, importPath: string) {
  const toggleImport = `import { Toggle } from "${importPath}";`;

  switch (state.pattern) {
    case "labeled":
      return `"use client";

import { Italic } from "lucide-react";
import { useState } from "react";
${toggleImport}

export function LabeledToggle() {
  const [italic, setItalic] = useState(${state.pressed ? "true" : "false"});

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="${sentenceClassName}">
        <span>Emphasize a phrase with</span>
        <span className="${toggleInlineClassName}">
          <Toggle
            aria-label="Toggle italic"
            onPressedChange={setItalic}
            pressed={italic}${formatVariantAttr(state.variant)}
          >
            <Italic className="size-4" />
            <span>Italic</span>
          </Toggle>
        </span>
        <span
          className={
            italic
              ? "italic text-neutral-950 transition-[font-style,color] duration-200 dark:text-neutral-50"
              : "text-neutral-800 transition-[font-style,color] duration-200 dark:text-neutral-100"
          }
        >
          in your editor.
        </span>
      </p>
    </div>
  );
}`;

    case "disabled":
      return `"use client";

import { Bold } from "lucide-react";
${toggleImport}

export function DisabledToggle() {
  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="${sentenceClassName}">
        <span>Bold formatting is locked while the draft is read-only.</span>
        <span className="${toggleInlineClassName}">
          <Toggle
            aria-label="Toggle bold"
            className="${iconToggleClassName}"
            defaultPressed
            disabled${formatVariantAttr(state.variant)}
          >
            <Bold className="size-4" />
          </Toggle>
        </span>
      </p>
    </div>
  );
}`;

    default:
      return `"use client";

import { Bold } from "lucide-react";
import { useState } from "react";
${toggleImport}

export function TogglePreview() {
  const [bold, setBold] = useState(false);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="${sentenceClassName}">
        <span>Ship the</span>
        <span
          className={
            bold
              ? "font-bold text-neutral-950 transition-[font-weight,color] duration-200 dark:text-neutral-50"
              : "text-neutral-800 transition-[font-weight,color] duration-200 dark:text-neutral-100"
          }
        >
          release notes
        </span>
        <span className="${toggleInlineClassName}">
          <Toggle
            aria-label="Toggle bold"
            className="${iconToggleClassName}"
            onPressedChange={setBold}
            pressed={bold}
            size="sm"${formatVariantAttr(state.variant)}
          >
            <Bold className="size-4" />
          </Toggle>
        </span>
      </p>
    </div>
  );
}`;
  }
}

function TogglePlaygroundPreview() {
  const { state, Toggle } = useTogglePlayground();
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(state.pressed);

  useEffect(() => {
    setItalic(state.pressed);
  }, [state.pressed]);

  switch (state.pattern) {
    case "labeled":
      return (
        <SentencePreview>
          <span>Emphasize a phrase with</span>
          <span className={toggleInlineClassName}>
            <Toggle
              aria-label="Toggle italic"
              onPressedChange={setItalic}
              pressed={italic}
              variant={state.variant}
            >
              <Italic className="size-4" />
              <span>Italic</span>
            </Toggle>
          </span>
          <span
            className={
              italic
                ? "text-neutral-950 italic transition-[font-style,color] duration-200 dark:text-neutral-50"
                : "text-neutral-800 transition-[font-style,color] duration-200 dark:text-neutral-100"
            }
          >
            in your editor.
          </span>
        </SentencePreview>
      );

    case "disabled":
      return (
        <SentencePreview>
          <span>Bold formatting is locked while the draft is read-only.</span>
          <span className={toggleInlineClassName}>
            <Toggle
              aria-label="Toggle bold"
              className={iconToggleClassName}
              defaultPressed
              disabled
              variant={state.variant}
            >
              <Bold className="size-4" />
            </Toggle>
          </span>
        </SentencePreview>
      );

    default:
      return (
        <SentencePreview>
          <span>Ship the</span>
          <span
            className={
              bold
                ? "font-bold text-neutral-950 transition-[font-weight,color] duration-200 dark:text-neutral-50"
                : "text-neutral-800 transition-[font-weight,color] duration-200 dark:text-neutral-100"
            }
          >
            release notes
          </span>
          <span className={toggleInlineClassName}>
            <Toggle
              aria-label="Toggle bold"
              className={iconToggleClassName}
              onPressedChange={setBold}
              pressed={bold}
              size="sm"
              variant={state.variant}
            >
              <Bold className="size-4" />
            </Toggle>
          </span>
        </SentencePreview>
      );
  }
}

function TogglePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<TogglePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: TogglePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Toggle"
    >
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {state.pattern === "labeled" ? (
        <DocsPlaygroundToggleField
          checked={state.pressed}
          label="Pressed"
          onChange={(pressed) => onChange({ pressed })}
        />
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type TogglePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function TogglePlaygroundProvider({
  Toggle,
  importPath,
  children,
}: {
  Toggle: ComponentType<ToggleComponentProps>;
  importPath: string;
  children: (props: TogglePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<TogglePlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<TogglePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateToggleCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <TogglePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <TogglePlaygroundContext.Provider value={{ state, Toggle }}>
      {children({
        preview: <TogglePlaygroundPreview />,
        renderSettings,
      })}
    </TogglePlaygroundContext.Provider>
  );
}
