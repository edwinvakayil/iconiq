"use client";

import { type ComponentType, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { sliderApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseSlider from "@/registry/b-slider";
import * as RadixSlider from "@/registry/r-slider";

type SliderMark = {
  value: number;
  label?: string;
};

type SliderModule = {
  Slider: ComponentType<{
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
    onValueCommit?: (value: number) => void;
    showValue?: boolean;
    valueDecimals?: number;
    formatValue?: (value: number) => string;
    label?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    marks?: SliderMark[];
    reducedMotion?: boolean;
    className?: string;
  }>;
};

type ProviderConfig = {
  componentName: "b-slider" | "r-slider";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: SliderModule;
  usageCode: string;
};

const demoMarks: SliderMark[] = [
  { value: 0, label: "Low" },
  { value: 50, label: "Cruise" },
  { value: 100, label: "Peak" },
];

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Slider" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-slider": `"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/b-slider";

const marks = [
  { value: 0, label: "Low" },
  { value: 50, label: "Cruise" },
  { value: 100, label: "Peak" },
];

export function SliderPreview() {
  const [value, setValue] = useState(42);

  return (
    <Slider
      className="w-full max-w-sm"
      label="Intensity"
      marks={marks}
      onChange={setValue}
      value={value}
    />
  );
}`,
  "r-slider": `"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/r-slider";

const marks = [
  { value: 0, label: "Low" },
  { value: 50, label: "Cruise" },
  { value: 100, label: "Peak" },
];

export function SliderPreview() {
  const [value, setValue] = useState(42);

  return (
    <Slider
      className="w-full max-w-sm"
      label="Intensity"
      marks={marks}
      onChange={setValue}
      value={value}
    />
  );
}`,
};

function SliderPreview({ ui }: { ui: SliderModule }) {
  const { Slider } = ui;
  const [value, setValue] = useState(42);

  return (
    <div className="flex min-h-[320px] w-full items-center justify-center p-6">
      <Slider
        className="w-full max-w-sm"
        label="Intensity"
        marks={demoMarks}
        onChange={setValue}
        value={value}
      />
    </div>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return sliderApiDetails.map((item) => {
    if (item.id === "slider") {
      return {
        ...item,
        summary: `Single-value slider with the same Iconiq label row, spring-settled fill, and thumb motion layered over ${provider.libraryLabel} primitives.`,
      };
    }

    if (item.id === "slider-interaction") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on Base UI Slider.Root, Slider.Control, Slider.Track, Slider.Indicator, Slider.Thumb, and Slider.Label while preserving the same active track-height animation, spring-smoothed fill, and thumb scale behavior as the core slider."
            : "Built on Radix Slider.Root, Slider.Track, Slider.Range, and Slider.Thumb while preserving the same active track-height animation, spring-smoothed fill, and thumb scale behavior as the core slider.",
          ...(item.notes ?? []),
        ],
      };
    }

    if (item.id === "registry" || item.registryPath) {
      return {
        ...item,
        notes: [
          `Dependencies: ${provider.dependencyLabel}.`,
          ...provider.notes,
          `The generated registry file is /r/${provider.componentName}.json.`,
        ],
        registryPath: `${provider.componentName}.json`,
      };
    }

    return item;
  });
}

export default function RadixBaseSliderPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-slider",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI slider with the same value, defaultValue, min, max, step, marks, and formatting API as the Radix version.",
          "Uses the Base UI slider control and thumb primitives under the same Iconiq track and thumb motion shell.",
        ],
        ui: BaseSlider,
        usageCode: usageCodeByProvider["b-slider"],
      };
    }

    return {
      componentName: "r-slider",
      dependencyLabel: "@radix-ui/react-slider, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix slider with the same value, defaultValue, min, max, step, marks, and formatting API as the Base UI version.",
        "Uses the Radix slider track, range, and thumb primitives under the same Iconiq track and thumb motion shell.",
      ],
      ui: RadixSlider,
      usageCode: usageCodeByProvider["r-slider"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same slider API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/slider/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="slider"
      pageUrl="/components/slider"
      preview={<SliderPreview ui={provider.ui} />}
      title="Slider"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
