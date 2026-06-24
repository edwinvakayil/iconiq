"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  type LucideIcon,
  Underline,
} from "lucide-react";
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
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import type * as BaseToggleGroup from "@/registry/b-togglegroup";
import type * as RadixToggleGroup from "@/registry/r-togglegroup";

type ToggleGroupVariant = "default" | "outline";
type ToggleGroupPattern = "toolbar" | "labeled" | "disabled";
type ToggleGroupSelectionMode = "multiple" | "single";
type ToggleGroupLibrary = "base" | "radix";

type FormatOption = {
  icon: LucideIcon;
  label: string;
  value: string;
};

type ToggleGroupModule = typeof BaseToggleGroup | typeof RadixToggleGroup;

type ToggleGroupPlaygroundState = {
  variant: ToggleGroupVariant;
  orientation: "horizontal" | "vertical";
  spacing: 0 | 1;
  selectionMode: ToggleGroupSelectionMode;
  pattern: ToggleGroupPattern;
};

const formatOptions: FormatOption[] = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
];

const alignOptions: FormatOption[] = [
  { value: "left", label: "Align left", icon: AlignLeft },
  { value: "center", label: "Align center", icon: AlignCenter },
  { value: "right", label: "Align right", icon: AlignRight },
];

const previewShellClassName =
  "flex min-h-[18rem] w-full items-center justify-center px-4 py-6";

const previewContentClassName = "flex flex-col items-start gap-3";

const sentenceClassName =
  "text-balance text-left font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const iconItemClassName = "size-8 min-h-8 min-w-8 shrink-0 px-0";

const DEFAULT_STATE: ToggleGroupPlaygroundState = {
  variant: "outline",
  orientation: "horizontal",
  spacing: 1,
  selectionMode: "multiple",
  pattern: "toolbar",
};

const VARIANT_OPTIONS: Array<{ label: string; value: ToggleGroupVariant }> = [
  { label: "Default", value: "default" },
  { label: "Outline", value: "outline" },
];

const ORIENTATION_OPTIONS = [
  { label: "Horizontal", value: "horizontal" as const },
  { label: "Vertical", value: "vertical" as const },
];

const SPACING_OPTIONS = [
  { label: "Connected", value: "0" as const },
  { label: "Gap", value: "1" as const },
];

const SELECTION_OPTIONS = [
  { label: "Multiple", value: "multiple" as const },
  { label: "Single", value: "single" as const },
];

const PATTERN_OPTIONS: Array<{ label: string; value: ToggleGroupPattern }> = [
  { label: "Toolbar", value: "toolbar" },
  { label: "Labeled", value: "labeled" },
  { label: "Disabled", value: "disabled" },
];

const ToggleGroupPlaygroundContext = createContext<
  | {
      library: "base";
      state: ToggleGroupPlaygroundState;
      ui: typeof BaseToggleGroup;
    }
  | {
      library: "radix";
      state: ToggleGroupPlaygroundState;
      ui: typeof RadixToggleGroup;
    }
  | null
>(null);

function useToggleGroupPlayground() {
  const context = useContext(ToggleGroupPlaygroundContext);

  if (!context) {
    throw new Error(
      "ToggleGroupPlayground components must be used within ToggleGroupPlaygroundProvider."
    );
  }

  return context;
}

function getHeadlineClassName(formats: string[]) {
  return cn(
    "transition-[color,font-style,font-weight,text-decoration-color] duration-200",
    formats.includes("bold") && "font-bold",
    formats.includes("italic") && "italic",
    formats.includes("underline") && "underline underline-offset-4",
    formats.length > 0
      ? "text-neutral-950 dark:text-neutral-50"
      : "text-neutral-800 dark:text-neutral-100"
  );
}

function formatOptionalAttr(name: string, value: string | number | boolean) {
  if (typeof value === "boolean") {
    return value ? `\n          ${name}` : "";
  }

  if (typeof value === "number") {
    return value === DEFAULT_STATE.spacing
      ? ""
      : `\n          ${name}={${value}}`;
  }

  if (name === 'type="single"' && value === "single") {
    return '\n          type="single"';
  }

  if (name === "multiple={false}" && value === "single") {
    return "\n          multiple={false}";
  }

  const defaults: Record<string, string> = {
    variant: "default",
    orientation: "horizontal",
  };

  if (defaults[name] === value) {
    return "";
  }

  return `\n          ${name}="${value}"`;
}

function generateToggleGroupCode(
  state: ToggleGroupPlaygroundState,
  importPath: string,
  library: ToggleGroupLibrary
) {
  const imports = `import {
  ToggleGroup,
  ToggleGroupItem,
} from "${importPath}";`;

  const selectionAttr =
    library === "radix"
      ? formatOptionalAttr('type="single"', state.selectionMode)
      : formatOptionalAttr("multiple={false}", state.selectionMode);

  const groupAttrs = [
    'aria-label="Text formatting"',
    formatOptionalAttr("variant", state.variant),
    formatOptionalAttr("orientation", state.orientation),
    state.spacing === 0 ? "\n          spacing={0}" : "",
    selectionAttr,
  ].join("");

  if (state.pattern === "disabled") {
    return `"use client";

import { Bold, Italic, Underline } from "lucide-react";
${imports}

const options = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
] as const;

export function DisabledToggleGroupPreview() {
  return (
    <div className="${previewShellClassName}">
      <ToggleGroup
        aria-label="Text formatting"
        defaultValue={["bold"]}
        disabled${groupAttrs.replace('aria-label="Text formatting"', "")}
      >
        {options.map(({ value, label, icon: Icon }) => (
          <ToggleGroupItem
            aria-label={label}
            className="${iconItemClassName}"
            key={value}
            value={value}
          >
            <Icon className="size-4" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}`;
  }

  if (state.pattern === "labeled") {
    return `"use client";

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { useState } from "react";
${imports}

const options = [
  { value: "left", label: "Align left", icon: AlignLeft },
  { value: "center", label: "Align center", icon: AlignCenter },
  { value: "right", label: "Align right", icon: AlignRight },
] as const;

export function LabeledToggleGroupPreview() {
  const [alignment, setAlignment] = useState("${
    state.selectionMode === "single" ? "left" : '["left"]'
  }");

  return (
    <div className="${previewShellClassName}">
      <ToggleGroup
        aria-label="Text alignment"
        onValueChange={setAlignment}
        value={alignment}${groupAttrs.replace('aria-label="Text formatting"', "")}
      >
        {options.map(({ value, label, icon: Icon }) => (
          <ToggleGroupItem key={value} value={value}>
            <Icon className="size-4" />
            <span>{label.replace("Align ", "")}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}`;
  }

  return `"use client";

import { Bold, Italic, Underline } from "lucide-react";
import { useState } from "react";
${imports}

const options = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
] as const;

function getHeadlineClassName(formats: string[]) {
  return [
    "transition-[color,font-style,font-weight,text-decoration-color] duration-200",
    formats.includes("bold") ? "font-bold" : "",
    formats.includes("italic") ? "italic" : "",
    formats.includes("underline") ? "underline underline-offset-4" : "",
    formats.length > 0
      ? "text-neutral-950 dark:text-neutral-50"
      : "text-neutral-800 dark:text-neutral-100",
  ]
    .filter(Boolean)
    .join(" ");
}

export function ToggleGroupPreview() {
  const [formats, setFormats] = useState<string[]>(["bold"]);

  return (
    <div className="${previewShellClassName}">
      <div className="${previewContentClassName}">
        <ToggleGroup
          aria-label="Text formatting"
          onValueChange={setFormats}
          value={formats}${groupAttrs}
        >
          {options.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem
              aria-label={label}
              className="${iconItemClassName}"
              key={value}
              value={value}
            >
              <Icon className="size-4" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className="${sentenceClassName}">
          <span>Edit the </span>
          <span className={getHeadlineClassName(formats)}>launch headline</span>
        </p>
      </div>
    </div>
  );
}`;
}

function getVisualProps(state: ToggleGroupPlaygroundState) {
  return {
    orientation: state.orientation,
    spacing: state.spacing,
    variant: state.variant,
  };
}

function RadixToggleGroupPlaygroundPreview({
  state,
  ui,
}: {
  state: ToggleGroupPlaygroundState;
  ui: typeof RadixToggleGroup;
}) {
  const { ToggleGroup, ToggleGroupItem } = ui;
  const [formats, setFormats] = useState<string[]>(["bold"]);
  const [singleFormat, setSingleFormat] = useState("bold");
  const [singleAlignment, setSingleAlignment] = useState("left");
  const [multipleAlignment, setMultipleAlignment] = useState<string[]>([
    "left",
  ]);
  const isSingle = state.selectionMode === "single";
  const visualProps = getVisualProps(state);

  if (state.pattern === "disabled") {
    return (
      <div className={previewShellClassName}>
        {isSingle ? (
          <ToggleGroup
            aria-label="Text formatting"
            defaultValue="bold"
            disabled
            type="single"
            {...visualProps}
          >
            {formatOptions.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem
                aria-label={label}
                className={iconItemClassName}
                key={value}
                value={value}
              >
                <Icon className="size-4" />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : (
          <ToggleGroup
            aria-label="Text formatting"
            defaultValue={["bold"]}
            disabled
            type="multiple"
            {...visualProps}
          >
            {formatOptions.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem
                aria-label={label}
                className={iconItemClassName}
                key={value}
                value={value}
              >
                <Icon className="size-4" />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </div>
    );
  }

  if (state.pattern === "labeled") {
    return (
      <div className={previewShellClassName}>
        {isSingle ? (
          <ToggleGroup
            aria-label="Text alignment"
            onValueChange={setSingleAlignment}
            type="single"
            value={singleAlignment}
            {...visualProps}
          >
            {alignOptions.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem key={value} value={value}>
                <Icon className="size-4" />
                <span>{label.replace("Align ", "")}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : (
          <ToggleGroup
            aria-label="Text alignment"
            onValueChange={setMultipleAlignment}
            type="multiple"
            value={multipleAlignment}
            {...visualProps}
          >
            {alignOptions.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem key={value} value={value}>
                <Icon className="size-4" />
                <span>{label.replace("Align ", "")}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </div>
    );
  }

  if (isSingle) {
    return (
      <div className={previewShellClassName}>
        <div className={previewContentClassName}>
          <ToggleGroup
            aria-label="Text formatting"
            onValueChange={setSingleFormat}
            type="single"
            value={singleFormat}
            {...visualProps}
          >
            {formatOptions.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem
                aria-label={label}
                className={iconItemClassName}
                key={value}
                value={value}
              >
                <Icon className="size-4" />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className={sentenceClassName}>
            <span>Edit the </span>
            <span className={getHeadlineClassName([singleFormat])}>
              launch headline
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={previewShellClassName}>
      <div className={previewContentClassName}>
        <ToggleGroup
          aria-label="Text formatting"
          onValueChange={setFormats}
          type="multiple"
          value={formats}
          {...visualProps}
        >
          {formatOptions.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem
              aria-label={label}
              className={iconItemClassName}
              key={value}
              value={value}
            >
              <Icon className="size-4" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className={sentenceClassName}>
          <span>Edit the </span>
          <span className={getHeadlineClassName(formats)}>launch headline</span>
        </p>
      </div>
    </div>
  );
}

function BaseToggleGroupPlaygroundPreview({
  state,
  ui,
}: {
  state: ToggleGroupPlaygroundState;
  ui: typeof BaseToggleGroup;
}) {
  const { ToggleGroup, ToggleGroupItem } = ui;
  const [formats, setFormats] = useState<string[]>(["bold"]);
  const [singleFormat, setSingleFormat] = useState("bold");
  const [alignment, setAlignment] = useState<string[]>(
    state.selectionMode === "single" ? ["left"] : ["left"]
  );
  const multiple = state.selectionMode !== "single";
  const visualProps = getVisualProps(state);

  if (state.pattern === "disabled") {
    return (
      <div className={previewShellClassName}>
        <ToggleGroup
          aria-label="Text formatting"
          defaultValue={multiple ? ["bold"] : ["bold"]}
          disabled
          multiple={multiple}
          {...visualProps}
        >
          {formatOptions.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem
              aria-label={label}
              className={iconItemClassName}
              key={value}
              value={value}
            >
              <Icon className="size-4" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    );
  }

  if (state.pattern === "labeled") {
    return (
      <div className={previewShellClassName}>
        <ToggleGroup
          aria-label="Text alignment"
          multiple={multiple}
          onValueChange={setAlignment}
          value={alignment}
          {...visualProps}
        >
          {alignOptions.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem key={value} value={value}>
              <Icon className="size-4" />
              <span>{label.replace("Align ", "")}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    );
  }

  if (!multiple) {
    return (
      <div className={previewShellClassName}>
        <div className={previewContentClassName}>
          <ToggleGroup
            aria-label="Text formatting"
            multiple={false}
            onValueChange={(value) => setSingleFormat(value[0] ?? "")}
            value={[singleFormat]}
            {...visualProps}
          >
            {formatOptions.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem
                aria-label={label}
                className={iconItemClassName}
                key={value}
                value={value}
              >
                <Icon className="size-4" />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className={sentenceClassName}>
            <span>Edit the </span>
            <span className={getHeadlineClassName([singleFormat])}>
              launch headline
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={previewShellClassName}>
      <div className={previewContentClassName}>
        <ToggleGroup
          aria-label="Text formatting"
          multiple
          onValueChange={setFormats}
          value={formats}
          {...visualProps}
        >
          {formatOptions.map(({ value, label, icon: Icon }) => (
            <ToggleGroupItem
              aria-label={label}
              className={iconItemClassName}
              key={value}
              value={value}
            >
              <Icon className="size-4" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <p className={sentenceClassName}>
          <span>Edit the </span>
          <span className={getHeadlineClassName(formats)}>launch headline</span>
        </p>
      </div>
    </div>
  );
}

function ToggleGroupPlaygroundPreview() {
  const context = useToggleGroupPlayground();

  if (context.library === "radix") {
    return (
      <RadixToggleGroupPlaygroundPreview
        key={context.state.selectionMode}
        state={context.state}
        ui={context.ui}
      />
    );
  }

  return (
    <BaseToggleGroupPlaygroundPreview
      key={context.state.selectionMode}
      state={context.state}
      ui={context.ui}
    />
  );
}

function ToggleGroupPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ToggleGroupPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: ToggleGroupPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Toggle Group"
    >
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundSelectField
        label="Orientation"
        onChange={(orientation) => onChange({ orientation })}
        options={ORIENTATION_OPTIONS}
        value={state.orientation}
      />
      <DocsPlaygroundSegmentedField
        label="Spacing"
        onChange={(spacing) => onChange({ spacing: Number(spacing) as 0 | 1 })}
        options={SPACING_OPTIONS}
        value={String(state.spacing) as "0" | "1"}
      />
      <DocsPlaygroundSegmentedField
        label="Selection"
        onChange={(selectionMode) => onChange({ selectionMode })}
        options={SELECTION_OPTIONS}
        value={state.selectionMode}
      />
    </DocsPlaygroundPanel>
  );
}

type ToggleGroupPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function ToggleGroupPlaygroundProvider({
  children,
  importPath,
  library,
  ui,
}: {
  children: (props: ToggleGroupPlaygroundRenderProps) => ReactNode;
  importPath: string;
  library: ToggleGroupLibrary;
  ui: ToggleGroupModule;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<ToggleGroupPlaygroundState>(DEFAULT_STATE);
  const contextValue =
    library === "radix"
      ? {
          library: "radix" as const,
          state,
          ui: ui as typeof RadixToggleGroup,
        }
      : {
          library: "base" as const,
          state,
          ui: ui as typeof BaseToggleGroup,
        };

  const updateState = (next: Partial<ToggleGroupPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateToggleGroupCode(state, importPath, library));
  }, [importPath, library, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <ToggleGroupPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <ToggleGroupPlaygroundContext.Provider value={contextValue}>
      {children({
        preview: <ToggleGroupPlaygroundPreview />,
        renderSettings,
      })}
    </ToggleGroupPlaygroundContext.Provider>
  );
}
