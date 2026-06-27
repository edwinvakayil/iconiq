"use client";

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
import { FaviconBadgeLivePreview } from "@/components/favicon-badge-live-preview";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import type {
  FaviconBadgeProps,
  FaviconBadgeSize,
} from "@/registry/favicon-badge";

type FaviconBadgePattern =
  | "inline"
  | "sizes"
  | "label"
  | "invalid"
  | "override";

type FaviconBadgeModule = {
  FaviconBadge: ComponentType<FaviconBadgeProps>;
};

type FaviconPixelSize = NonNullable<FaviconBadgeProps["faviconSize"]>;

type FaviconBadgePlaygroundState = {
  faviconSize: FaviconPixelSize;
  label: string;
  pattern: FaviconBadgePattern;
  showLabel: boolean;
  size: FaviconBadgeSize;
  website: string;
};

const sentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const inlineBadgeClassName = "inline-flex translate-y-px align-middle";

const DEFAULT_STATE: FaviconBadgePlaygroundState = {
  faviconSize: 64,
  label: "Iconiq UI",
  pattern: "inline",
  showLabel: false,
  size: "md",
  website: "vercel.com",
};

const PATTERN_OPTIONS: Array<{ label: string; value: FaviconBadgePattern }> = [
  { label: "Inline", value: "inline" },
  { label: "Sizes", value: "sizes" },
  { label: "With label", value: "label" },
  { label: "Invalid domain", value: "invalid" },
  { label: "Custom URL", value: "override" },
];

const SIZE_OPTIONS: Array<{ label: string; value: FaviconBadgeSize }> = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const FAVICON_SIZE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "16px", value: "16" },
  { label: "32px", value: "32" },
  { label: "64px", value: "64" },
  { label: "128px", value: "128" },
];

const WEBSITE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "iconiqui.com", value: "iconiqui.com" },
  { label: "github.com", value: "github.com" },
  { label: "vercel.com", value: "vercel.com" },
  { label: "mintlify.com", value: "mintlify.com" },
  { label: "neon.com", value: "neon.com" },
];

const FaviconBadgePlaygroundContext = createContext<{
  FaviconBadgeModule: FaviconBadgeModule;
  state: FaviconBadgePlaygroundState;
} | null>(null);

function useFaviconBadgePlayground() {
  const context = useContext(FaviconBadgePlaygroundContext);

  if (!context) {
    throw new Error(
      "FaviconBadgePlayground components must be used within FaviconBadgePlaygroundProvider."
    );
  }

  return context;
}

function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[14rem] w-full items-center justify-center px-4 py-6">
      <div className="mx-auto max-w-3xl text-center">{children}</div>
    </div>
  );
}

function faviconBadgePropsFromState(state: FaviconBadgePlaygroundState) {
  const props: Pick<
    FaviconBadgeProps,
    "faviconSize" | "label" | "size" | "website"
  > = {
    website: state.website,
    size: state.size,
  };

  if (state.faviconSize !== 64) {
    props.faviconSize = state.faviconSize;
  }

  if (state.showLabel || state.pattern === "label") {
    props.label = state.label;
  }

  return props;
}

function escapeCodeString(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function generateFaviconBadgeCode(
  state: FaviconBadgePlaygroundState,
  importPath: string
) {
  const props: string[] = [`website="${escapeCodeString(state.website)}"`];

  if (state.size !== "md") {
    props.push(`size="${state.size}"`);
  }

  if (state.faviconSize !== 64) {
    props.push(`faviconSize={${state.faviconSize}}`);
  }

  if (state.showLabel || state.pattern === "label") {
    props.push(`label="${escapeCodeString(state.label)}"`);
  }

  const badgeProps = props.join(" ");

  switch (state.pattern) {
    case "sizes": {
      const sharedProps = props.filter((prop) => !prop.startsWith('size="'));

      return `"use client";

import { FaviconBadge } from "${importPath}";

export function FaviconBadgeSizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <FaviconBadge ${sharedProps.length > 0 ? `${sharedProps.join(" ")} ` : ""}size="sm" />
      <FaviconBadge ${sharedProps.length > 0 ? `${sharedProps.join(" ")} ` : ""}size="md" />
      <FaviconBadge ${sharedProps.length > 0 ? `${sharedProps.join(" ")} ` : ""}size="lg" />
    </div>
  );
}`;
    }

    case "label":
      return `"use client";

import { FaviconBadge } from "${importPath}";

export function FaviconBadgeLabelDemo() {
  return (
    <FaviconBadge label="${escapeCodeString(state.label)}" size="${state.size}" website="${escapeCodeString(state.website)}"${state.faviconSize !== 64 ? ` faviconSize={${state.faviconSize}}` : ""} />
  );
}`;

    case "invalid":
      return `"use client";

import { FaviconBadge } from "${importPath}";

export function FaviconBadgeInvalidDemo() {
  return <FaviconBadge website="not-a-valid-domain" />;
}`;

    case "override":
      return `"use client";

import { FaviconBadge } from "${importPath}";

export function FaviconBadgeOverrideDemo() {
  return (
    <FaviconBadge
      faviconUrl="/assets/shadcn.jpg"
      label="Internal docs"
      website="docs.internal"
    />
  );
}`;

    default:
      return `"use client";

import { FaviconBadge } from "${importPath}";

export function FaviconBadgeDemo() {
  return (
    <p className="${sentenceClassName}">
      <span>Attributed to</span>
      <span className="${inlineBadgeClassName}">
        <FaviconBadge ${badgeProps} />
      </span>
      <span>for this release.</span>
    </p>
  );
}`;
  }
}

function FaviconBadgePlaygroundPreview() {
  const { FaviconBadgeModule, state } = useFaviconBadgePlayground();
  const { FaviconBadge } = FaviconBadgeModule;
  const badgeProps = faviconBadgePropsFromState(state);

  switch (state.pattern) {
    case "sizes":
      return (
        <PreviewFrame>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <FaviconBadge {...badgeProps} size="sm" />
            <FaviconBadge {...badgeProps} size="md" />
            <FaviconBadge {...badgeProps} size="lg" />
          </div>
        </PreviewFrame>
      );

    case "label":
      return (
        <PreviewFrame>
          <FaviconBadge
            faviconSize={state.faviconSize}
            label={state.label}
            size={state.size}
            website={state.website}
          />
        </PreviewFrame>
      );

    case "invalid":
      return (
        <PreviewFrame>
          <FaviconBadge website="not-a-valid-domain" />
        </PreviewFrame>
      );

    case "override":
      return (
        <PreviewFrame>
          <FaviconBadge
            faviconUrl="/assets/shadcn.jpg"
            label="Internal docs"
            website="docs.internal"
          />
        </PreviewFrame>
      );

    default:
      return null;
  }
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

function FaviconBadgePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<FaviconBadgePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: FaviconBadgePlaygroundState;
}) {
  const showWebsiteControls =
    state.pattern === "inline" ||
    state.pattern === "label" ||
    state.pattern === "sizes";
  const showSizeControl =
    state.pattern === "inline" || state.pattern === "label";
  const showLabelControls =
    state.pattern === "inline" || state.pattern === "label";
  const showFaviconSizeControl =
    state.pattern !== "invalid" && state.pattern !== "override";
  const websiteOptions = WEBSITE_OPTIONS.some(
    (option) => option.value === state.website
  )
    ? WEBSITE_OPTIONS
    : [...WEBSITE_OPTIONS, { label: state.website, value: state.website }];

  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Favicon Badge"
    >
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) =>
          onChange({
            pattern,
            ...(pattern === "invalid"
              ? { website: "not-a-valid-domain", showLabel: false }
              : pattern === "override"
                ? { website: "docs.internal", showLabel: false }
                : pattern === "label"
                  ? { showLabel: true }
                  : {}),
          })
        }
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {showWebsiteControls ? (
        <>
          <DocsPlaygroundSelectField
            label="Website"
            onChange={(website) => onChange({ website })}
            options={websiteOptions}
            value={state.website}
          />
          <DocsPlaygroundTextField
            label="Custom"
            onChange={(website) => onChange({ website })}
            placeholder="your-domain.com"
            value={state.website}
          />
        </>
      ) : null}
      {showSizeControl ? (
        <DocsPlaygroundSelectField
          label="Size"
          onChange={(size) => onChange({ size })}
          options={SIZE_OPTIONS}
          value={state.size}
        />
      ) : null}
      {showFaviconSizeControl ? (
        <DocsPlaygroundSelectField
          label="Favicon"
          onChange={(faviconSize) =>
            onChange({
              faviconSize: Number(faviconSize) as FaviconPixelSize,
            })
          }
          options={FAVICON_SIZE_OPTIONS}
          value={String(state.faviconSize)}
        />
      ) : null}
      {showLabelControls ? (
        <>
          {state.pattern === "inline" ? (
            <DocsPlaygroundToggleField
              checked={state.showLabel}
              label="Label"
              onChange={(showLabel) => onChange({ showLabel })}
            />
          ) : null}
          {state.showLabel || state.pattern === "label" ? (
            <DocsPlaygroundTextField
              label="Label text"
              onChange={(label) => onChange({ label })}
              placeholder="Site name"
              value={state.label}
            />
          ) : null}
        </>
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type FaviconBadgePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function FaviconBadgePlaygroundProvider({
  FaviconBadgeModule,
  importPath,
  children,
}: {
  FaviconBadgeModule: FaviconBadgeModule;
  importPath: string;
  children: (props: FaviconBadgePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<FaviconBadgePlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<FaviconBadgePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateFaviconBadgeCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <FaviconBadgePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <FaviconBadgePlaygroundContext.Provider
      value={{ FaviconBadgeModule, state }}
    >
      {children({
        preview: (
          <FaviconBadgePlaygroundPreviewWithSync updateState={updateState} />
        ),
        renderSettings,
      })}
    </FaviconBadgePlaygroundContext.Provider>
  );
}

function FaviconBadgePlaygroundPreviewWithSync({
  updateState,
}: {
  updateState: (next: Partial<FaviconBadgePlaygroundState>) => void;
}) {
  const { state } = useFaviconBadgePlayground();

  if (state.pattern !== "inline") {
    return <FaviconBadgePlaygroundPreview />;
  }

  return (
    <FaviconBadgeLivePreview
      className="min-h-[14rem] py-2"
      faviconSize={state.faviconSize}
      label={state.showLabel ? state.label : undefined}
      onWebsiteChange={(website) => updateState({ website })}
      size={state.size}
      website={state.website}
    />
  );
}
