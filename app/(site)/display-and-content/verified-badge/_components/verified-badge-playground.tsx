"use client";

import { type ComponentType, type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { docsPlaygroundTextInputClassName } from "@/components/docs/playground/docs-playground-styles";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import type {
  VerifiedBadgeProps,
  VerifiedBadgeSize,
  VerifiedBadgeTone,
  VerifiedBadgeVariant,
} from "@/registry/verified-badge";

type VerifiedBadgeModule = {
  VerifiedBadge: ComponentType<VerifiedBadgeProps>;
};

type VerifiedBadgePlaygroundState = {
  decorative: boolean;
  displayName: string;
  size: VerifiedBadgeSize;
  tone: VerifiedBadgeTone;
  variant: VerifiedBadgeVariant;
};

const DEFAULT_STATE: VerifiedBadgePlaygroundState = {
  decorative: false,
  displayName: "Iconiq UI",
  size: "md",
  tone: "brand",
  variant: "shimmer",
};

const VARIANT_OPTIONS: Array<{
  label: string;
  value: VerifiedBadgeVariant;
}> = [
  { label: "Shimmer", value: "shimmer" },
  { label: "Static", value: "static" },
];

const SIZE_OPTIONS: Array<{ label: string; value: VerifiedBadgeSize }> = [
  { label: "Small (18px)", value: "sm" },
  { label: "Medium (22px)", value: "md" },
  { label: "Large (28px)", value: "lg" },
];

const TONE_OPTIONS: Array<{ label: string; value: VerifiedBadgeTone }> = [
  { label: "Brand", value: "brand" },
  { label: "Gold", value: "gold" },
  { label: "Neutral", value: "neutral" },
];

function verifiedBadgePropsFromState(
  state: VerifiedBadgePlaygroundState
): VerifiedBadgeProps {
  const props: VerifiedBadgeProps = {
    size: state.size,
    tone: state.tone,
    variant: state.variant,
  };

  if (state.decorative) {
    props.decorative = true;
  }

  return props;
}

function verifiedBadgePropLines(props: VerifiedBadgeProps) {
  const lines: string[] = [];

  if (props.variant !== "shimmer") {
    lines.push(`variant="${props.variant}"`);
  }

  if (props.size !== "md") {
    if (typeof props.size === "string") {
      lines.push(`size="${props.size}"`);
    } else if (props.size !== undefined) {
      lines.push(`size={${props.size}}`);
    }
  }

  if (props.tone && props.tone !== "brand") {
    lines.push(`tone="${props.tone}"`);
  }

  if (props.decorative) {
    lines.push("decorative");
  }

  return lines;
}

function generateVerifiedBadgeCode(
  state: VerifiedBadgePlaygroundState,
  importPath: string
): string {
  const sharedProps = verifiedBadgePropsFromState(state);
  const propLines = verifiedBadgePropLines(sharedProps);
  const propsBlock = propLines.length > 0 ? ` ${propLines.join(" ")}` : "";

  return `"use client";

import { VerifiedBadge } from "${importPath}";

export function VerifiedBadgeDemo() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold text-foreground text-xl tracking-tight">
        ${state.displayName}
      </span>
      <VerifiedBadge className="translate-y-px"${propsBlock} />
    </span>
  );
}`;
}

function VerifiedBadgeInlinePreview({
  VerifiedBadge,
  state,
}: {
  VerifiedBadge: VerifiedBadgeModule["VerifiedBadge"];
  state: VerifiedBadgePlaygroundState;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "font-semibold text-foreground text-xl tracking-tight"
      )}
    >
      <span>{state.displayName}</span>
      <VerifiedBadge
        className="translate-y-px"
        {...verifiedBadgePropsFromState(state)}
      />
    </span>
  );
}

function VerifiedBadgePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<VerifiedBadgePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: VerifiedBadgePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Verified Badge"
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-medium text-foreground text-xs">
          Display name
        </span>
        <input
          className={docsPlaygroundTextInputClassName}
          onChange={(event) => onChange({ displayName: event.target.value })}
          type="text"
          value={state.displayName}
        />
      </label>
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
      <DocsPlaygroundSelectField
        label="Tone"
        onChange={(tone) => onChange({ tone })}
        options={TONE_OPTIONS}
        value={state.tone}
      />
      <DocsPlaygroundToggleField
        checked={state.decorative}
        label="Decorative"
        onChange={(decorative) => onChange({ decorative })}
      />
    </DocsPlaygroundPanel>
  );
}

type VerifiedBadgePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function VerifiedBadgePlaygroundProvider({
  VerifiedBadgeModule,
  importPath,
  children,
}: {
  VerifiedBadgeModule: VerifiedBadgeModule;
  importPath: string;
  children: (props: VerifiedBadgePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<VerifiedBadgePlaygroundState>(DEFAULT_STATE);
  const { VerifiedBadge } = VerifiedBadgeModule;

  const updateState = (next: Partial<VerifiedBadgePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateVerifiedBadgeCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <VerifiedBadgePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <div className="flex min-h-[12rem] w-full items-center justify-center px-4 py-10">
        <VerifiedBadgeInlinePreview
          state={state}
          VerifiedBadge={VerifiedBadge}
        />
      </div>
    ),
    renderSettings,
  });
}
