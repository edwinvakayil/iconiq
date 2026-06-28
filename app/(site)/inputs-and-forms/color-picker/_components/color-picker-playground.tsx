"use client";

import { type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import {
  ColorPicker,
  type ColorPickerFormat,
  type ColorPickerProps,
  type ColorPickerSwatchShape,
} from "@/registry/color-picker";

type ColorPickerVariant = NonNullable<ColorPickerProps["variant"]>;

type ColorPickerPlaygroundState = {
  defaultFormat: ColorPickerFormat;
  disabled: boolean;
  showAlpha: boolean;
  showCopy: boolean;
  showEyedropper: boolean;
  showPresets: boolean;
  swatchShape: ColorPickerSwatchShape;
  variant: ColorPickerVariant;
};

const DEFAULT_STATE: ColorPickerPlaygroundState = {
  defaultFormat: "HEX",
  disabled: false,
  showAlpha: true,
  showCopy: true,
  showEyedropper: true,
  showPresets: false,
  swatchShape: "default",
  variant: "inline",
};

const VARIANT_OPTIONS: Array<{ label: string; value: ColorPickerVariant }> = [
  { label: "Inline", value: "inline" },
  { label: "Popover", value: "popover" },
  { label: "Swatch", value: "swatch" },
];

const FORMAT_OPTIONS: Array<{ label: string; value: ColorPickerFormat }> = [
  { label: "HEX", value: "HEX" },
  { label: "RGB", value: "RGB" },
  { label: "HSL", value: "HSL" },
  { label: "OKLCH", value: "OKLCH" },
];

const PRESET_COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

function formatOptionalFlags(state: ColorPickerPlaygroundState) {
  const flags: string[] = [];

  if (state.disabled) {
    flags.push("disabled");
  }

  if (!state.showAlpha) {
    flags.push("showAlpha={false}");
  }

  if (state.showCopy) {
    flags.push("showCopy");
  }

  if (!state.showEyedropper) {
    flags.push("showEyedropper={false}");
  }

  if (state.defaultFormat !== "HEX") {
    flags.push(`defaultFormat="${state.defaultFormat}"`);
  }

  if (state.variant === "popover") {
    flags.push('variant="popover"');
    flags.push('placeholder="Pick a brand color"');
  }

  if (state.variant === "swatch") {
    flags.push('variant="swatch"');
  }

  if (state.swatchShape === "circle") {
    flags.push('swatchShape="circle"');
  }

  if (state.showPresets) {
    flags.push(
      `presets={[${PRESET_COLORS.map((color) => `"${color}"`).join(", ")}]}`
    );
  }

  if (flags.length === 0) {
    return "";
  }

  return `\n        ${flags.join("\n        ")}`;
}

function generateColorPickerCode(
  state: ColorPickerPlaygroundState,
  importPath: string
) {
  const wrapperClassName =
    state.variant === "popover"
      ? "flex w-[300px] max-w-full flex-col items-center gap-4"
      : state.variant === "swatch"
        ? "flex flex-col items-center gap-4"
        : "flex w-full flex-col items-center gap-4";

  const selectedColorBlock =
    state.variant === "inline"
      ? ""
      : `
        <p className="text-[15px] text-muted-foreground sm:text-base">
          Selected color:{" "}
          <span className="font-medium" style={{ color }}>
            {color}
          </span>
        </p>`;

  return `"use client";

import { useState } from "react";
import { ColorPicker } from "${importPath}";

export function BrandColorPicker() {
  const [color, setColor] = useState("#3B82F6");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="${wrapperClassName} text-center">
        <ColorPicker
          aria-label="Brand color"
          name="brand-color"
          onChange={setColor}
          value={color}${formatOptionalFlags(state)}
        />${selectedColorBlock}
      </div>
    </div>
  );
}`;
}

function ColorPickerPlaygroundPreview({
  state,
}: {
  state: ColorPickerPlaygroundState;
}) {
  const [color, setColor] = useState("#3B82F6");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div
        className={
          state.variant === "popover"
            ? "flex w-[300px] max-w-full flex-col items-center gap-4 text-center"
            : state.variant === "swatch"
              ? "flex flex-col items-center gap-4 text-center"
              : "flex w-full flex-col items-center gap-4 text-center"
        }
      >
        <ColorPicker
          aria-label="Brand color"
          defaultFormat={state.defaultFormat}
          disabled={state.disabled}
          name="brand-color"
          onChange={setColor}
          placeholder="Pick a brand color"
          presets={state.showPresets ? PRESET_COLORS : undefined}
          showAlpha={state.showAlpha}
          showCopy={state.showCopy}
          showEyedropper={state.showEyedropper}
          swatchShape={state.swatchShape}
          value={color}
          variant={state.variant}
        />
        {state.variant === "inline" ? (
          <p className="text-balance text-[15px] text-muted-foreground leading-relaxed sm:text-base">
            Selected color:{" "}
            <span className="font-medium" style={{ color }}>
              {color}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ColorPickerPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ColorPickerPlaygroundState>) => void;
  onClose: () => void;
  onReset: () => void;
  state: ColorPickerPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Color Picker"
    >
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundSelectField
        label="Default format"
        onChange={(defaultFormat) => onChange({ defaultFormat })}
        options={FORMAT_OPTIONS}
        value={state.defaultFormat}
      />
      <DocsPlaygroundToggleField
        checked={state.showAlpha}
        label="Show alpha"
        onChange={(showAlpha) => onChange({ showAlpha })}
      />
      <DocsPlaygroundToggleField
        checked={state.showCopy}
        label="Show copy"
        onChange={(showCopy) => onChange({ showCopy })}
      />
      <DocsPlaygroundToggleField
        checked={state.showEyedropper}
        label="Show eyedropper"
        onChange={(showEyedropper) => onChange({ showEyedropper })}
      />
      <DocsPlaygroundToggleField
        checked={state.showPresets}
        label="Show presets"
        onChange={(showPresets) => onChange({ showPresets })}
      />
      {state.variant === "swatch" ? (
        <DocsPlaygroundToggleField
          checked={state.swatchShape === "circle"}
          label="Circle swatch"
          onChange={(circle) =>
            onChange({ swatchShape: circle ? "circle" : "default" })
          }
        />
      ) : null}
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled"
        onChange={(disabled) => onChange({ disabled })}
      />
    </DocsPlaygroundPanel>
  );
}

type ColorPickerPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function ColorPickerPlaygroundProvider({
  importPath,
  children,
}: {
  importPath: string;
  children: (props: ColorPickerPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<ColorPickerPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<ColorPickerPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateColorPickerCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <ColorPickerPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <ColorPickerPlaygroundPreview state={state} />,
    renderSettings,
  });
}
