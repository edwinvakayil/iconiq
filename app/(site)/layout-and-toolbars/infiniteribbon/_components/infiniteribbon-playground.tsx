"use client";

import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import {
  docsPlaygroundRowClassName,
  docsPlaygroundTextInputClassName,
} from "@/components/docs/playground/docs-playground-styles";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import type { InfiniteRibbonProps } from "@/registry/infiniteribbon";

type InfiniteRibbonModule = {
  InfiniteRibbon: ComponentType<InfiniteRibbonProps>;
};

type InfiniteRibbonLayout = "single" | "crossed";
type InfiniteRibbonContentMode = "text" | "items";
type InfiniteRibbonSpeedMode = "duration" | "speed";

type InfiniteRibbonPlaygroundState = {
  ariaLabel: string;
  content: string;
  contentMode: InfiniteRibbonContentMode;
  customAriaLabel: boolean;
  duration: number;
  fadeEdges: boolean;
  gap: number;
  href: string;
  layout: InfiniteRibbonLayout;
  pauseOnHover: boolean;
  pauseWhenHidden: boolean;
  reverse: boolean;
  rotation: number;
  selectable: boolean;
  showHref: boolean;
  speed: number;
  speedMode: InfiniteRibbonSpeedMode;
  variant: NonNullable<InfiniteRibbonProps["variant"]>;
};

const DEFAULT_RIBBON_TEXT =
  "Build fast, responsive, and beautiful interfaces with ready-to-use components. Designed for developers.";

export const INFINITE_RIBBON_DEMO_TEXT = DEFAULT_RIBBON_TEXT;

const CROSSED_RIBBON_BAND_CLASS =
  "absolute top-1/2 left-1/2 w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2";

export const CROSSED_RIBBON_CONTAINER_CLASS =
  "relative h-full min-h-[24rem] w-full overflow-hidden bg-white dark:bg-background";

export const SINGLE_RIBBON_CONTAINER_CLASS =
  "relative flex h-full min-h-[24rem] w-full items-center justify-center overflow-hidden bg-white dark:bg-background";

export function InfiniteRibbonSinglePreview({
  InfiniteRibbon,
  ribbonProps,
}: {
  InfiniteRibbon: ComponentType<InfiniteRibbonProps>;
  ribbonProps?: Omit<InfiniteRibbonProps, "rotation" | "reverse">;
}) {
  const sharedProps = {
    duration: 42,
    children: DEFAULT_RIBBON_TEXT,
    ...ribbonProps,
  };

  return (
    <div className={SINGLE_RIBBON_CONTAINER_CLASS}>
      <InfiniteRibbon {...sharedProps} className="w-full" />
    </div>
  );
}

export function InfiniteRibbonCrossedPreview({
  InfiniteRibbon,
  ribbonProps,
  rotation = 5,
}: {
  InfiniteRibbon: ComponentType<InfiniteRibbonProps>;
  ribbonProps?: Omit<InfiniteRibbonProps, "rotation" | "reverse">;
  rotation?: number;
}) {
  const sharedProps = {
    duration: 42,
    children: DEFAULT_RIBBON_TEXT,
    ...ribbonProps,
  };

  return (
    <div className={CROSSED_RIBBON_CONTAINER_CLASS}>
      <div className={cn(CROSSED_RIBBON_BAND_CLASS, "z-0")}>
        <InfiniteRibbon {...sharedProps} rotation={rotation} />
      </div>
      <div className={cn(CROSSED_RIBBON_BAND_CLASS, "z-10")}>
        <InfiniteRibbon {...sharedProps} reverse rotation={-rotation} />
      </div>
    </div>
  );
}

const DEFAULT_STATE: InfiniteRibbonPlaygroundState = {
  ariaLabel: "Product announcement",
  content: DEFAULT_RIBBON_TEXT,
  contentMode: "text",
  customAriaLabel: false,
  duration: 42,
  fadeEdges: false,
  gap: 32,
  href: "/docs",
  layout: "crossed",
  pauseOnHover: true,
  pauseWhenHidden: true,
  reverse: false,
  rotation: 5,
  selectable: true,
  showHref: false,
  speed: 48,
  speedMode: "duration",
  variant: "default",
};

export const INFINITE_RIBBON_DEFAULT_STATE = DEFAULT_STATE;

const LAYOUT_OPTIONS: Array<{ label: string; value: InfiniteRibbonLayout }> = [
  { label: "Single strip", value: "single" },
  { label: "Crossed banners", value: "crossed" },
];

const VARIANT_OPTIONS: Array<{
  label: string;
  value: NonNullable<InfiniteRibbonProps["variant"]>;
}> = [
  { label: "Default", value: "default" },
  { label: "Brand", value: "brand" },
  { label: "Warning", value: "warning" },
];

const CONTENT_MODE_OPTIONS: Array<{
  label: string;
  value: InfiniteRibbonContentMode;
}> = [
  { label: "Single line", value: "text" },
  { label: "Items list", value: "items" },
];

const SPEED_MODE_OPTIONS: Array<{
  label: string;
  value: InfiniteRibbonSpeedMode;
}> = [
  { label: "Duration", value: "duration" },
  { label: "Speed", value: "speed" },
];

const DURATION_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "12s", value: "12" },
  { label: "24s", value: "24" },
  { label: "42s", value: "42" },
  { label: "60s", value: "60" },
];

const SPEED_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "32 px/s", value: "32" },
  { label: "48 px/s", value: "48" },
  { label: "72 px/s", value: "72" },
  { label: "96 px/s", value: "96" },
];

const GAP_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "16px", value: "16" },
  { label: "32px", value: "32" },
  { label: "48px", value: "48" },
  { label: "64px", value: "64" },
];

const ROTATION_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "0°", value: "0" },
  { label: "5°", value: "5" },
  { label: "-5°", value: "-5" },
  { label: "12°", value: "12" },
];

function escapeCodeString(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function getItemsFromContent(content: string) {
  return content
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
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
    <div className={cn(docsPlaygroundRowClassName, "gap-3 px-3")}>
      <span className="shrink-0 whitespace-nowrap font-medium text-[#5c5c61] text-[13px] dark:text-[#a1a1a6]">
        {label}
      </span>
      <input
        className={docsPlaygroundTextInputClassName}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        type="text"
        value={value}
      />
    </div>
  );
}

function ribbonPropsFromState(
  state: InfiniteRibbonPlaygroundState,
  layoutRotation?: number
): InfiniteRibbonProps {
  const props: InfiniteRibbonProps = {
    variant: state.variant,
    pauseOnHover: state.pauseOnHover,
    pauseWhenHidden: state.pauseWhenHidden,
    fadeEdges: state.fadeEdges,
    selectable: state.selectable,
    gap: state.gap,
  };

  if (state.contentMode === "items") {
    props.items = getItemsFromContent(state.content);
    props.separator = " · ";
  } else {
    props.children = state.content;
  }

  if (state.speedMode === "speed") {
    props.speed = state.speed;
  } else if (state.duration !== 10) {
    props.duration = state.duration;
  }

  if (state.reverse) {
    props.reverse = true;
  }

  const rotation = layoutRotation ?? state.rotation;
  if (rotation !== 0) {
    props.rotation = rotation;
  }

  if (state.showHref) {
    props.href = state.href;
  }

  if (state.customAriaLabel) {
    props["aria-label"] = state.ariaLabel;
  }

  return props;
}

function formatPropsBlock(lines: string[]) {
  if (lines.length === 0) {
    return "";
  }

  return `\n      ${lines.join("\n      ")}\n    `;
}

function buildSharedPropLines(
  state: InfiniteRibbonPlaygroundState,
  layout: InfiniteRibbonLayout
) {
  const props = ribbonPropsFromState(
    state,
    layout === "single" ? 0 : undefined
  );
  const lines: string[] = [];

  if (props.variant && props.variant !== "default") {
    lines.push(`variant="${props.variant}"`);
  }

  if (props.speed) {
    lines.push(`speed={${props.speed}}`);
  } else if (props.duration) {
    lines.push(`duration={${props.duration}}`);
  }

  if (props.reverse && layout === "single") {
    lines.push("reverse");
  }

  if (props.gap && props.gap !== 32) {
    lines.push(`gap={${props.gap}}`);
  }

  if (props.fadeEdges) {
    lines.push("fadeEdges");
  }

  if (props.pauseOnHover === false) {
    lines.push("pauseOnHover={false}");
  }

  if (props.pauseWhenHidden === false) {
    lines.push("pauseWhenHidden={false}");
  }

  if (props.selectable === false) {
    lines.push("selectable={false}");
  }

  if (props.href) {
    lines.push(`href="${escapeCodeString(props.href)}"`);
  }

  if (props["aria-label"]) {
    lines.push(`aria-label="${escapeCodeString(props["aria-label"])}"`);
  }

  return { lines, props };
}

export function generateInfiniteRibbonCode(
  state: InfiniteRibbonPlaygroundState,
  importPath: string
) {
  const { lines, props } = buildSharedPropLines(state, state.layout);
  const propsBlock = formatPropsBlock(lines);

  if (state.contentMode === "items" && props.items?.length) {
    const itemsCode = props.items
      .map((item) => `"${escapeCodeString(item)}"`)
      .join(", ");

    if (state.layout === "crossed") {
      return `"use client";

import { InfiniteRibbon } from "${importPath}";

export function InfiniteRibbonPreview() {
  return (
    <div className="relative h-full min-h-[24rem] w-full overflow-hidden bg-white">
      <div className="absolute top-1/2 left-1/2 z-0 w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2">
        <InfiniteRibbon
          items={[${itemsCode}]}
          rotation={${state.rotation}}
          separator=" · "${propsBlock}/>
      </div>
      <div className="absolute top-1/2 left-1/2 z-10 w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2">
        <InfiniteRibbon
          items={[${itemsCode}]}
          reverse
          rotation={${-state.rotation}}
          separator=" · "${propsBlock}/>
      </div>
    </div>
  );
}`;
    }

    return `"use client";

import { InfiniteRibbon } from "${importPath}";

export function InfiniteRibbonPreview() {
  return (
    <div className="relative flex h-full min-h-[24rem] w-full items-center justify-center overflow-hidden bg-white">
      <InfiniteRibbon
        className="w-full"
        items={[${itemsCode}]}
        separator=" · "${propsBlock}/>
    </div>
  );
}`;
  }

  const content = escapeCodeString(state.content);

  if (state.layout === "crossed") {
    return `"use client";

import { InfiniteRibbon } from "${importPath}";

export function InfiniteRibbonPreview() {
  return (
    <div className="relative h-full min-h-[24rem] w-full overflow-hidden bg-white">
      <div className="absolute top-1/2 left-1/2 z-0 w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2">
        <InfiniteRibbon rotation={${state.rotation}}${propsBlock}>
          ${content}
        </InfiniteRibbon>
      </div>
      <div className="absolute top-1/2 left-1/2 z-10 w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2">
        <InfiniteRibbon reverse rotation={${-state.rotation}}${propsBlock}>
          ${content}
        </InfiniteRibbon>
      </div>
    </div>
  );
}`;
  }

  return `"use client";

import { InfiniteRibbon } from "${importPath}";

export function InfiniteRibbonPreview() {
  return (
    <div className="relative flex h-full min-h-[24rem] w-full items-center justify-center overflow-hidden bg-white">
      <InfiniteRibbon className="w-full"${propsBlock}>
        ${content}
      </InfiniteRibbon>
    </div>
  );
}`;
}

function InfiniteRibbonPlaygroundPreview({
  InfiniteRibbon,
  state,
}: {
  InfiniteRibbon: ComponentType<InfiniteRibbonProps>;
  state: InfiniteRibbonPlaygroundState;
}) {
  const ribbonContentProps = {
    ...ribbonPropsFromState(state, state.layout === "single" ? 0 : undefined),
    children: state.contentMode === "items" ? undefined : state.content,
    items:
      state.contentMode === "items"
        ? getItemsFromContent(state.content)
        : undefined,
  };

  if (state.layout === "crossed") {
    return (
      <InfiniteRibbonCrossedPreview
        InfiniteRibbon={InfiniteRibbon}
        ribbonProps={ribbonContentProps}
        rotation={state.rotation}
      />
    );
  }

  return (
    <InfiniteRibbonSinglePreview
      InfiniteRibbon={InfiniteRibbon}
      ribbonProps={ribbonContentProps}
    />
  );
}

function InfiniteRibbonPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<InfiniteRibbonPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: InfiniteRibbonPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Infinite Ribbon"
    >
      <DocsPlaygroundSelectField
        label="Layout"
        onChange={(layout) =>
          onChange({
            layout,
            ...(layout === "single" ? { reverse: false } : {}),
          })
        }
        options={LAYOUT_OPTIONS}
        value={state.layout}
      />
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundSelectField
        label="Content"
        onChange={(contentMode) => onChange({ contentMode })}
        options={CONTENT_MODE_OPTIONS}
        value={state.contentMode}
      />
      <DocsPlaygroundTextField
        label={state.contentMode === "items" ? "Items" : "Text"}
        onChange={(content) => onChange({ content })}
        placeholder={
          state.contentMode === "items"
            ? "Ship faster | Polish flows | Launch sooner"
            : "Your announcement copy"
        }
        value={state.content}
      />
      <DocsPlaygroundSelectField
        label="Motion"
        onChange={(speedMode) => onChange({ speedMode })}
        options={SPEED_MODE_OPTIONS}
        value={state.speedMode}
      />
      {state.speedMode === "speed" ? (
        <DocsPlaygroundSelectField
          label="Speed"
          onChange={(speed) => onChange({ speed: Number(speed) })}
          options={SPEED_OPTIONS}
          value={String(state.speed)}
        />
      ) : (
        <DocsPlaygroundSelectField
          label="Duration"
          onChange={(duration) => onChange({ duration: Number(duration) })}
          options={DURATION_OPTIONS}
          value={String(state.duration)}
        />
      )}
      <DocsPlaygroundSelectField
        label="Gap"
        onChange={(gap) => onChange({ gap: Number(gap) })}
        options={GAP_OPTIONS}
        value={String(state.gap)}
      />
      {state.layout === "crossed" ? (
        <DocsPlaygroundSelectField
          label="Rotation"
          onChange={(rotation) => onChange({ rotation: Number(rotation) })}
          options={ROTATION_OPTIONS}
          value={String(state.rotation)}
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.reverse}
        label="Reverse"
        onChange={(reverse) => onChange({ reverse })}
      />
      <DocsPlaygroundToggleField
        checked={state.fadeEdges}
        label="Fade edges"
        onChange={(fadeEdges) => onChange({ fadeEdges })}
      />
      <DocsPlaygroundToggleField
        checked={state.pauseOnHover}
        label="Pause on hover"
        onChange={(pauseOnHover) => onChange({ pauseOnHover })}
      />
      <DocsPlaygroundToggleField
        checked={state.pauseWhenHidden}
        label="Pause when hidden"
        onChange={(pauseWhenHidden) => onChange({ pauseWhenHidden })}
      />
      <DocsPlaygroundToggleField
        checked={state.selectable}
        label="Selectable text"
        onChange={(selectable) => onChange({ selectable })}
      />
      <DocsPlaygroundToggleField
        checked={state.showHref}
        label="Link banner"
        onChange={(showHref) => onChange({ showHref })}
      />
      {state.showHref ? (
        <DocsPlaygroundTextField
          label="Href"
          onChange={(href) => onChange({ href })}
          placeholder="/docs"
          value={state.href}
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.customAriaLabel}
        label="Custom label"
        onChange={(customAriaLabel) => onChange({ customAriaLabel })}
      />
      {state.customAriaLabel ? (
        <DocsPlaygroundTextField
          label="Aria label"
          onChange={(ariaLabel) => onChange({ ariaLabel })}
          placeholder="Site announcement"
          value={state.ariaLabel}
        />
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type InfiniteRibbonPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function InfiniteRibbonPlaygroundProvider({
  InfiniteRibbonModule,
  importPath,
  children,
}: {
  InfiniteRibbonModule: InfiniteRibbonModule;
  importPath: string;
  children: (props: InfiniteRibbonPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] =
    useState<InfiniteRibbonPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<InfiniteRibbonPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useLayoutEffect(() => {
    setPlaygroundCode(generateInfiniteRibbonCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(() => {
    return () => {
      setPlaygroundCode(null);
    };
  }, [setPlaygroundCode]);

  const renderSettings = (onClose: () => void) => (
    <InfiniteRibbonPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  const preview = (
    <InfiniteRibbonPlaygroundPreview
      InfiniteRibbon={InfiniteRibbonModule.InfiniteRibbon}
      state={state}
    />
  );

  return <>{children({ preview, renderSettings })}</>;
}
