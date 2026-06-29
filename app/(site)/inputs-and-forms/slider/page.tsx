"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  getSliderUsageCode,
  SliderPlaygroundProvider,
} from "@/app/(site)/inputs-and-forms/slider/_components/slider-playground";
import { sliderApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseSlider from "@/registry/b-slider";
import * as RadixSlider from "@/registry/r-slider";

type ProviderConfig = {
  componentName: "b-slider" | "r-slider";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: typeof BaseSlider | typeof RadixSlider;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Slider" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-slider": getSliderUsageCode("@/components/ui/b-slider"),
  "r-slider": getSliderUsageCode("@/components/ui/r-slider"),
};

function getDetails(provider: ProviderConfig): DetailItem[] {
  return sliderApiDetails.map((item) => {
    if (item.id === "slider") {
      return {
        ...item,
        summary: `Single- or dual-thumb slider with the same Iconiq label row, spring-settled fill, and thumb motion layered over ${provider.libraryLabel} primitives.`,
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
        importPath: "@/components/ui/b-slider",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI slider with the same value, range, marks, formatting, and field chrome API as the Radix version.",
          "Uses the Base UI slider control and thumb primitives under the same Iconiq track and thumb motion shell.",
        ],
        ui: BaseSlider,
        usageCode: usageCodeByProvider["b-slider"],
      };
    }

    return {
      componentName: "r-slider",
      dependencyLabel: "@radix-ui/react-slider, motion",
      importPath: "@/components/ui/r-slider",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix slider with the same value, range, marks, formatting, and field chrome API as the Base UI version.",
        "Uses the Radix slider track, range, and thumb primitives under the same Iconiq track and thumb motion shell.",
      ],
      ui: RadixSlider,
      usageCode: usageCodeByProvider["r-slider"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <SliderPlaygroundProvider
      importPath={provider.importPath}
      SliderModule={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Drag control for adjusting a value within a range."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/slider/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="slider"
          pageUrl="/inputs-and-forms/slider"
          preview={preview}
          previewClassName="min-h-[20rem] overflow-visible lg:col-span-8"
          previewDescription="Tune range mode, marks, size, validation, and disabled states from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Slider"
          railNotes={[
            `Current install target: ${provider.libraryLabel}.`,
            "Use range to render two thumbs with a filled segment between them.",
            "marksInteractive lets users jump to labeled landmarks with a click.",
            "description and errorMessage render below the track with the same field chrome pattern as Input.",
            "Track and thumb motion honor prefers-reduced-motion automatically.",
          ]}
          title="Slider"
          usageCode={provider.usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </SliderPlaygroundProvider>
  );
}
