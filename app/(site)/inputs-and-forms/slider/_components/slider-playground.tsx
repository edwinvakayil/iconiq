"use client";

import { type ReactNode, useEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type { SliderMark, SliderProps, SliderSize } from "@/registry/b-slider";

type SliderModule = {
  Slider: React.ComponentType<SliderProps>;
};

type SliderPlaygroundState = {
  disabled: boolean;
  inverted: boolean;
  marksInteractive: boolean;
  range: boolean;
  readOnly: boolean;
  showDescription: boolean;
  showError: boolean;
  showLabel: boolean;
  showMarks: boolean;
  showValue: boolean;
  size: SliderSize;
};

const FIELD_LABEL = "Intensity";
const FIELD_DESCRIPTION = "Drag to set how strong the effect should feel.";

const DEMO_MARKS: SliderMark[] = [
  { value: 0, label: "Low" },
  { value: 50, label: "Cruise" },
  { value: 100, label: "Peak" },
];

const DEFAULT_STATE: SliderPlaygroundState = {
  disabled: false,
  inverted: false,
  marksInteractive: false,
  range: false,
  readOnly: false,
  showDescription: false,
  showError: false,
  showLabel: true,
  showMarks: true,
  showValue: true,
  size: "md",
};

const SIZE_OPTIONS: Array<{ label: string; value: SliderSize }> = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

function generateSliderCode(
  state: SliderPlaygroundState,
  importPath: string
): string {
  const marksBlock = state.showMarks
    ? `\nconst marks = [
  { value: 0, label: "Low" },
  { value: 50, label: "Cruise" },
  { value: 100, label: "Peak" },
];`
    : "";

  const valueHook = state.range
    ? "const [value, setValue] = useState<[number, number]>([25, 75]);"
    : "const [value, setValue] = useState(42);";

  const sliderProps = [
    'className="w-full max-w-sm"',
    state.showLabel ? `label="${FIELD_LABEL}"` : null,
    state.showDescription ? `description="${FIELD_DESCRIPTION}"` : null,
    state.showError
      ? 'errorMessage="Choose a value within the allowed range."'
      : null,
    state.showMarks ? "marks={marks}" : null,
    state.marksInteractive ? "marksInteractive" : null,
    state.range ? "range" : null,
    state.size !== "md" ? `size="${state.size}"` : null,
    state.inverted ? "inverted" : null,
    state.disabled ? "disabled" : null,
    state.readOnly ? "readOnly" : null,
    state.showValue ? null : "showValue={false}",
    "onChange={setValue}",
    "value={value}",
  ]
    .filter(Boolean)
    .join("\n      ");

  return `"use client";

import { useState } from "react";
import { Slider } from "${importPath}";${marksBlock}

export function SliderPreview() {
  ${valueHook}

  return (
    <Slider
      ${sliderProps}
    />
  );
}`;
}

export function getSliderUsageCode(importPath: string) {
  return generateSliderCode(DEFAULT_STATE, importPath);
}

function SliderPlaygroundPreview({
  SliderModule,
  state,
}: {
  SliderModule: SliderModule;
  state: SliderPlaygroundState;
}) {
  const { Slider } = SliderModule;
  const [singleValue, setSingleValue] = useState(42);
  const [rangeValue, setRangeValue] = useState<[number, number]>([25, 75]);

  const sharedProps = {
    className: "w-full max-w-sm",
    description: state.showDescription ? FIELD_DESCRIPTION : undefined,
    disabled: state.disabled,
    errorMessage: state.showError
      ? "Choose a value within the allowed range."
      : undefined,
    inverted: state.inverted,
    label: state.showLabel ? FIELD_LABEL : undefined,
    marks: state.showMarks ? DEMO_MARKS : undefined,
    marksInteractive: state.marksInteractive,
    readOnly: state.readOnly,
    showValue: state.showValue,
    size: state.size,
  } satisfies Partial<SliderProps>;

  return (
    <div className="flex min-h-[20rem] w-full items-center justify-center px-6 py-8">
      {state.range ? (
        <Slider
          {...sharedProps}
          onChange={(nextValue) => {
            if (Array.isArray(nextValue)) {
              setRangeValue(nextValue);
            }
          }}
          range
          value={rangeValue}
        />
      ) : (
        <Slider
          {...sharedProps}
          onChange={(nextValue) => {
            if (typeof nextValue === "number") {
              setSingleValue(nextValue);
            }
          }}
          value={singleValue}
        />
      )}
    </div>
  );
}

function SliderPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<SliderPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: SliderPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Slider"
    >
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size: size as SliderSize })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundToggleField
        checked={state.showLabel}
        label="Show label"
        onChange={(showLabel) => onChange({ showLabel })}
      />
      <DocsPlaygroundToggleField
        checked={state.showValue}
        label="Show value"
        onChange={(showValue) => onChange({ showValue })}
      />
      <DocsPlaygroundToggleField
        checked={state.showDescription}
        label="Show description"
        onChange={(showDescription) => onChange({ showDescription })}
      />
      <DocsPlaygroundToggleField
        checked={state.showError}
        label="Show error"
        onChange={(showError) => onChange({ showError })}
      />
      <DocsPlaygroundToggleField
        checked={state.showMarks}
        label="Show marks"
        onChange={(showMarks) => onChange({ showMarks })}
      />
      <DocsPlaygroundToggleField
        checked={state.marksInteractive}
        label="Interactive marks"
        onChange={(marksInteractive) => onChange({ marksInteractive })}
      />
      <DocsPlaygroundToggleField
        checked={state.range}
        label="Range mode"
        onChange={(range) => onChange({ range })}
      />
      <DocsPlaygroundToggleField
        checked={state.inverted}
        label="Inverted"
        onChange={(inverted) => onChange({ inverted })}
      />
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled"
        onChange={(disabled) => onChange({ disabled })}
      />
      <DocsPlaygroundToggleField
        checked={state.readOnly}
        label="Read only"
        onChange={(readOnly) => onChange({ readOnly })}
      />
    </DocsPlaygroundPanel>
  );
}

type SliderPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function SliderPlaygroundProvider({
  SliderModule,
  importPath,
  children,
}: {
  SliderModule: SliderModule;
  importPath: string;
  children: (props: SliderPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<SliderPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<SliderPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateSliderCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <SliderPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <SliderPlaygroundPreview SliderModule={SliderModule} state={state} />
    ),
    renderSettings,
  });
}
