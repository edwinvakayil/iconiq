"use client";

import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { themeToggleApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { LINK } from "@/constants";
import { useDocStore } from "@/hooks/use-doc-store";
import { themeTogglePreviewCode } from "@/lib/component-v0-pages";
import {
  ThemeToggle,
  type ThemeToggleProps,
  type ThemeToggleSize,
} from "@/registry/theme-toggle";

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm";

type ThemeTogglePattern = "default" | "disabled" | "inline";

type ThemeTogglePlaygroundState = {
  applyToDocument: boolean;
  enableSystem: boolean;
  layout: "centered" | "inline";
  pattern: ThemeTogglePattern;
  persist: boolean;
  pressed: boolean;
  size: ThemeToggleSize;
};

const DEFAULT_PLAYGROUND_STATE: ThemeTogglePlaygroundState = {
  applyToDocument: true,
  enableSystem: true,
  layout: "inline",
  pattern: "inline",
  persist: true,
  pressed: false,
  size: "md",
};

const SIZE_OPTIONS: Array<{ label: string; value: ThemeToggleSize }> = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const PATTERN_OPTIONS: Array<{ label: string; value: ThemeTogglePattern }> = [
  { label: "Inline", value: "inline" },
  { label: "Default", value: "default" },
  { label: "Disabled", value: "disabled" },
];

const LAYOUT_OPTIONS: Array<{
  label: string;
  value: ThemeTogglePlaygroundState["layout"];
}> = [
  { label: "Inline sentence", value: "inline" },
  { label: "Centered", value: "centered" },
];

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Theme Toggle" },
];

function formatSizeAttr(size: ThemeToggleSize) {
  return size === "md" ? "" : `\n        size="${size}"`;
}

function formatOptionalFlags(state: ThemeTogglePlaygroundState) {
  const flags: string[] = [];

  if (!state.persist) {
    flags.push("persist={false}");
  }

  if (!state.enableSystem) {
    flags.push("enableSystem={false}");
  }

  if (!state.applyToDocument) {
    flags.push("applyToDocument={false}");
  }

  if (state.pattern === "disabled") {
    flags.push("disabled");
  }

  if (flags.length === 0) {
    return "";
  }

  return `\n        ${flags.join("\n        ")}`;
}

function generateThemeToggleCode(
  state: ThemeTogglePlaygroundState,
  importPath = "@/components/ui/theme-toggle"
) {
  if (state.pattern === "disabled") {
    return `"use client";

import { ThemeToggle } from "${importPath}";

export function ThemeToggleDisabledExample() {
  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <ThemeToggle disabled${formatSizeAttr(state.size)} />
    </div>
  );
}`;
  }

  if (state.layout === "inline" || state.pattern === "inline") {
    return `"use client";

import { ThemeToggle } from "${importPath}";

export function ThemeTogglePreview() {
  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm">
        <span>Switch between light</span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <ThemeToggle${formatSizeAttr(state.size)}${formatOptionalFlags(state)} />
        </span>
        <span>and dark.</span>
      </p>
    </div>
  );
}`;
  }

  return `"use client";

import { useState } from "react";
import { ThemeToggle } from "${importPath}";

export function ThemeTogglePreview() {
  const [isDark, setIsDark] = useState(${state.pressed ? "true" : "false"});

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <ThemeToggle
        applyToDocument={false}
        defaultPressed={isDark}
        onPressedChange={setIsDark}
        persist={false}${formatSizeAttr(state.size)}${formatOptionalFlags({
          ...state,
          applyToDocument: false,
          persist: false,
        })}
      />
    </div>
  );
}`;
}

function ThemeTogglePlaygroundPreview({
  state,
}: {
  state: ThemeTogglePlaygroundState;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [localPressed, setLocalPressed] = useState(state.pressed);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalPressed(state.pressed);
  }, [state.pressed]);

  const sharedProps = {
    disabled: state.pattern === "disabled",
    enableSystem: state.enableSystem,
    persist: state.persist,
    size: state.size,
  } satisfies Partial<ThemeToggleProps>;

  const renderToggle = () => {
    if (!mounted) {
      return (
        <ThemeToggle
          {...sharedProps}
          applyToDocument={false}
          aria-label="Loading theme toggle"
          persist={false}
        />
      );
    }

    if (state.pattern === "disabled") {
      return <ThemeToggle {...sharedProps} disabled />;
    }

    if (state.layout === "centered" && state.pattern === "default") {
      return (
        <ThemeToggle
          {...sharedProps}
          applyToDocument={state.applyToDocument}
          defaultPressed={localPressed}
          onPressedChange={setLocalPressed}
          persist={state.persist}
        />
      );
    }

    return (
      <ThemeToggle
        {...sharedProps}
        applyToDocument={false}
        onPressedChange={(pressed) => {
          setTheme(pressed ? "dark" : "light");
        }}
        persist={false}
        pressed={resolvedTheme === "dark"}
      />
    );
  };

  const toggle = renderToggle();

  if (state.layout === "inline" || state.pattern === "inline") {
    return (
      <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
        <p className={previewSentenceClassName}>
          <span>Switch between light</span>
          <span className="inline-flex translate-y-px items-center align-middle">
            {toggle}
          </span>
          <span>and dark.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      {toggle}
    </div>
  );
}

function ThemeTogglePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ThemeTogglePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: ThemeTogglePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Theme Toggle"
    >
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) =>
          onChange({
            pattern,
            layout: pattern === "inline" ? "inline" : state.layout,
          })
        }
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {state.pattern === "default" ? (
        <DocsPlaygroundSelectField
          label="Layout"
          onChange={(layout) => onChange({ layout })}
          options={LAYOUT_OPTIONS}
          value={state.layout}
        />
      ) : null}
      {state.pattern === "default" ? (
        <>
          <DocsPlaygroundToggleField
            checked={state.pressed}
            label="Start dark"
            onChange={(pressed) => onChange({ pressed })}
          />
          <DocsPlaygroundToggleField
            checked={state.persist}
            label="Persist preference"
            onChange={(persist) => onChange({ persist })}
          />
          <DocsPlaygroundToggleField
            checked={state.enableSystem}
            label="Follow system theme"
            onChange={(enableSystem) => onChange({ enableSystem })}
          />
          <DocsPlaygroundToggleField
            checked={state.applyToDocument}
            label="Apply to document"
            onChange={(applyToDocument) => onChange({ applyToDocument })}
          />
        </>
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type ThemeTogglePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

function ThemeTogglePlaygroundProvider({
  children,
}: {
  children: (props: ThemeTogglePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<ThemeTogglePlaygroundState>(
    DEFAULT_PLAYGROUND_STATE
  );

  const updateState = (next: Partial<ThemeTogglePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_PLAYGROUND_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateThemeToggleCode(state));
  }, [setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <ThemeTogglePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <ThemeTogglePlaygroundPreview state={state} />,
    renderSettings,
  });
}

const themeToggleExamples: VariantItem[] = [
  {
    title: "Inline",
    code: generateThemeToggleCode(DEFAULT_PLAYGROUND_STATE),
  },
  {
    title: "Controlled with next-themes",
    code: `"use client";

import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ThemeToggleWithNextThemes() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <ThemeToggle
      applyToDocument={false}
      onPressedChange={(pressed) => {
        setTheme(pressed ? "dark" : "light");
      }}
      persist={false}
      pressed={resolvedTheme === "dark"}
    />
  );
}`,
  },
  {
    title: "Disabled",
    code: `"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ThemeToggleDisabledExample() {
  return <ThemeToggle disabled size="md" />;
}`,
  },
];

function getDetails(): DetailItem[] {
  return themeToggleApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react/toggle, lucide-react.",
        "This page documents the Base UI install only. Theme Toggle uses the Base UI Toggle primitive for pressed state.",
        "The generated registry file is /r/theme-toggle.json.",
      ],
      registryPath: "theme-toggle.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function ThemeTogglePage() {
  const details = useMemo(() => getDetails(), []);
  const usageCode = useMemo(
    () => generateThemeToggleCode(DEFAULT_PLAYGROUND_STATE),
    []
  );

  return (
    <ThemeTogglePlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="theme-toggle"
          description="Animated light/dark pill switch with sun and moon icons."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/theme-toggle/page.tsx`}
          examples={themeToggleExamples}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          itemSlug="theme-toggle"
          pageUrl="/inputs-and-forms/theme-toggle"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible lg:col-span-8"
          previewDescription="Tune size, persistence, system preference, and disabled states from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Theme Toggle"
          railNotes={[
            "Standalone installs persist to localStorage with the `theme` key by default, compatible with next-themes.",
            "Pair with next-themes using controlled `pressed`, `onPressedChange`, `persist={false}`, and `applyToDocument={false}`.",
            "The control syncs the `dark` class and `color-scheme` on `document.documentElement` when `applyToDocument` is enabled.",
          ]}
          title="Theme Toggle"
          usageCode={usageCode}
          usageDescription="Render `ThemeToggle` where you need a self-contained theme control. It reads `localStorage`, `prefers-color-scheme`, and the document `dark` class on mount, then persists user choice. Use controlled props when integrating with next-themes or another theme layer."
          v0PageCode={themeTogglePreviewCode}
        />
      )}
    </ThemeTogglePlaygroundProvider>
  );
}
