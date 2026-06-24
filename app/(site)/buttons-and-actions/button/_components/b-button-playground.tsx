"use client";

import { Plus, Settings } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSegmentedField,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { Button, type ButtonProps } from "@/registry/b-button";

type ButtonVariant = NonNullable<ButtonProps["variant"]>;
type ButtonSize = NonNullable<ButtonProps["size"]>;
type ButtonPattern = "variant" | "loading" | "sizes" | "icons" | "href";
type IconPreviewMode = "labeled" | "icon-only";

type ButtonPlaygroundState = {
  pattern: ButtonPattern;
  variant: ButtonVariant;
  size: ButtonSize;
  iconMode: IconPreviewMode;
  loading: boolean;
};

const sentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const buttonInlineClassName = "inline-flex translate-y-px align-middle";

const DEFAULT_STATE: ButtonPlaygroundState = {
  pattern: "variant",
  variant: "default",
  size: "default",
  iconMode: "labeled",
  loading: false,
};

const PATTERN_OPTIONS: Array<{ label: string; value: ButtonPattern }> = [
  { label: "Variant", value: "variant" },
  { label: "Loading", value: "loading" },
  { label: "Sizes", value: "sizes" },
  { label: "Icons", value: "icons" },
  { label: "Href link", value: "href" },
];

const VARIANT_OPTIONS: Array<{ label: string; value: ButtonVariant }> = [
  { label: "Default", value: "default" },
  { label: "Outline", value: "outline" },
  { label: "Secondary", value: "secondary" },
  { label: "Ghost", value: "ghost" },
  { label: "Destructive", value: "destructive" },
  { label: "Link", value: "link" },
];

const SIZE_OPTIONS: Array<{ label: string; value: ButtonSize }> = [
  { label: "xs", value: "xs" },
  { label: "sm", value: "sm" },
  { label: "md", value: "default" },
  { label: "lg", value: "lg" },
];

const ICON_MODE_OPTIONS: Array<{ label: string; value: IconPreviewMode }> = [
  { label: "With label", value: "labeled" },
  { label: "Icon only", value: "icon-only" },
];

const ButtonPlaygroundContext = createContext<ButtonPlaygroundState | null>(
  null
);

function useButtonPlaygroundState() {
  const context = useContext(ButtonPlaygroundContext);

  if (!context) {
    throw new Error(
      "ButtonPlayground components must be used within ButtonPlaygroundProvider."
    );
  }

  return context;
}

function SentencePreview({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-2">
      <div className="mx-auto max-w-2xl text-center">
        <p className={sentenceClassName}>{children}</p>
      </div>
    </div>
  );
}

function formatVariantAttr(variant: ButtonVariant) {
  return variant === "default" ? "" : ` variant="${variant}"`;
}

function formatSizeAttr(size: ButtonSize) {
  return size === "default" ? "" : ` size="${size}"`;
}

function generateButtonCode(state: ButtonPlaygroundState) {
  switch (state.pattern) {
    case "loading":
      return `"use client";

import { useState } from "react";

import { Button } from "@/components/ui/b-button";

export function SavingButton() {
  const [loading, setLoading] = useState(${state.loading ? "true" : "false"});

  return (
    <p className="${sentenceClassName}">
      <span>When your draft is ready,</span>
      <span>tap</span>
      <span className="${buttonInlineClassName}">
        <Button
          animateSize
          loading={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1500);
          }}
          type="button"
        >
          {loading ? "Saving" : "Save changes"}
        </Button>
      </span>
      <span>to publish.</span>
    </p>
  );
}`;

    case "sizes":
      return `import { Button } from "@/components/ui/b-button";

export function ButtonSizes() {
  return (
    <p className="${sentenceClassName}">
      <span>When you are building at</span>
      <span className="font-medium text-foreground">${SIZE_OPTIONS.find((option) => option.value === state.size)?.label ?? "md"}</span>
      <span>size, tap</span>
      <span className="${buttonInlineClassName}">
        <Button${formatSizeAttr(state.size)}>Continue</Button>
      </span>
      <span>to finish.</span>
    </p>
  );
}`;

    case "icons":
      if (state.iconMode === "icon-only") {
        return `import { Plus } from "lucide-react";

import { Button } from "@/components/ui/b-button";

export function IconButtons() {
  return (
    <p className="${sentenceClassName}">
      <span>Need a quick action?</span>
      <span>tap</span>
      <span className="${buttonInlineClassName}">
        <Button
          icon={<Plus aria-hidden />}
          iconLabel="Create item"
          size="icon"
          variant="default"
        />
      </span>
      <span>to add something new.</span>
    </p>
  );
}`;
      }

      return `import { Settings } from "lucide-react";

import { Button } from "@/components/ui/b-button";

export function IconButtons() {
  return (
    <p className="${sentenceClassName}">
      <span>When you need to adjust things,</span>
      <span>tap</span>
      <span className="${buttonInlineClassName}">
        <Button icon={<Settings aria-hidden />} iconPosition="start" variant="outline">
          Settings
        </Button>
      </span>
      <span>to continue.</span>
    </p>
  );
}`;

    case "href":
      return `import { Button } from "@/components/ui/b-button";

export function DocsLinkButton() {
  return (
    <p className="${sentenceClassName}">
      <span>Need more detail?</span>
      <span>Read the</span>
      <span className="${buttonInlineClassName}">
        <Button href="/docs" target="_blank" variant="outline">
          docs
        </Button>
      </span>
      <span>in a new tab.</span>
    </p>
  );
}`;

    default:
      return `import { Button } from "@/components/ui/b-button";

export function ButtonPreview() {
  return (
    <p className="${sentenceClassName}">
      <span>When you are ready to ship with</span>
      <span className="font-medium text-foreground">${state.variant}</span>
      <span>tap</span>
      <span className="${buttonInlineClassName}">
        <Button${formatVariantAttr(state.variant)}>Continue</Button>
      </span>
      <span>to finish.</span>
    </p>
  );
}`;
  }
}

function ButtonPlaygroundPreview() {
  const state = useButtonPlaygroundState();
  const [loading, setLoading] = useState(state.loading);

  useEffect(() => {
    setLoading(state.loading);
  }, [state.loading]);

  switch (state.pattern) {
    case "loading":
      return (
        <SentencePreview>
          <span>When your draft is ready,</span>
          <span>tap</span>
          <span className={buttonInlineClassName}>
            <Button
              animateSize
              loading={loading}
              onClick={() => {
                setLoading(true);
                window.setTimeout(() => setLoading(false), 1500);
              }}
              type="button"
            >
              {loading ? "Saving" : "Save changes"}
            </Button>
          </span>
          <span>to publish.</span>
        </SentencePreview>
      );

    case "sizes":
      return (
        <SentencePreview>
          <span>When you are building at</span>
          <span className="font-medium text-foreground">
            {SIZE_OPTIONS.find((option) => option.value === state.size)
              ?.label ?? "md"}
          </span>
          <span>size, tap</span>
          <span className={buttonInlineClassName}>
            <Button size={state.size}>Continue</Button>
          </span>
          <span>to finish.</span>
        </SentencePreview>
      );

    case "icons":
      return state.iconMode === "icon-only" ? (
        <SentencePreview>
          <span>Need a quick action?</span>
          <span>tap</span>
          <span className={buttonInlineClassName}>
            <Button
              icon={<Plus aria-hidden />}
              iconLabel="Create item"
              size="icon"
              variant="default"
            />
          </span>
          <span>to add something new.</span>
        </SentencePreview>
      ) : (
        <SentencePreview>
          <span>When you need to adjust things,</span>
          <span>tap</span>
          <span className={buttonInlineClassName}>
            <Button
              icon={<Settings aria-hidden />}
              iconPosition="start"
              variant="outline"
            >
              Settings
            </Button>
          </span>
          <span>to continue.</span>
        </SentencePreview>
      );

    case "href":
      return (
        <SentencePreview>
          <span>Need more detail?</span>
          <span>Read the</span>
          <span className={buttonInlineClassName}>
            <Button href="/" target="_blank" variant="outline">
              docs
            </Button>
          </span>
          <span>in a new tab.</span>
        </SentencePreview>
      );

    default:
      return (
        <SentencePreview>
          <span>When you are ready to ship with</span>
          <span className="font-medium text-foreground">{state.variant}</span>
          <span>tap</span>
          <span className={buttonInlineClassName}>
            <Button variant={state.variant}>Continue</Button>
          </span>
          <span>to finish.</span>
        </SentencePreview>
      );
  }
}

function ButtonPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ButtonPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: ButtonPlaygroundState;
}) {
  const showVariant = state.pattern === "variant";
  const showSize = state.pattern === "sizes";
  const showIconMode = state.pattern === "icons";
  const showLoading = state.pattern === "loading";

  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Button"
    >
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {showVariant ? (
        <DocsPlaygroundSelectField
          label="Variant"
          onChange={(variant) => onChange({ variant })}
          options={VARIANT_OPTIONS}
          value={state.variant}
        />
      ) : null}
      {showSize ? (
        <DocsPlaygroundSegmentedField
          label="Size"
          onChange={(size) => onChange({ size })}
          options={SIZE_OPTIONS}
          value={state.size}
        />
      ) : null}
      {showIconMode ? (
        <DocsPlaygroundSelectField
          label="Icon mode"
          onChange={(iconMode) => onChange({ iconMode })}
          options={ICON_MODE_OPTIONS}
          value={state.iconMode}
        />
      ) : null}
      {showLoading ? (
        <DocsPlaygroundToggleField
          checked={state.loading}
          label="Loading"
          onChange={(loading) => onChange({ loading })}
        />
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type ButtonPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function ButtonPlaygroundProvider({
  children,
}: {
  children: (props: ButtonPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<ButtonPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<ButtonPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateButtonCode(state));
  }, [setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <ButtonPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <ButtonPlaygroundContext.Provider value={state}>
      {children({
        preview: <ButtonPlaygroundPreview />,
        renderSettings,
      })}
    </ButtonPlaygroundContext.Provider>
  );
}
