"use client";

import { useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { colorPickerApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { ColorPicker } from "@/registry/color-picker";

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-balance text-center text-[15px] text-muted-foreground leading-relaxed sm:text-base";

const previewContentClassName =
  "flex w-full flex-col items-center gap-4 text-center";

const usageCode = `"use client";

import { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";

export function BrandColorPicker() {
  const [color, setColor] = useState("#3B82F6");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <ColorPicker onChange={setColor} value={color} />
        <p className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-balance text-center text-[15px] text-muted-foreground leading-relaxed sm:text-base">
          <span>Your</span>
          <span className="font-medium" style={{ color }}>
            brand color
          </span>
          <span>—tuned from one compact panel.</span>
        </p>
      </div>
    </div>
  );
}`;

const details = colorPickerApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: lucide-react, motion.",
      "This page documents the shared Iconiq color picker. Base UI and Radix UI options are disabled because there is no primitive-specific variant.",
      "The generated registry file is /r/color-picker.json.",
    ],
    registryPath: "color-picker.json",
  };
});

function ColorPickerPreview() {
  const [color, setColor] = useState("#3B82F6");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className={previewContentClassName}>
        <ColorPicker onChange={setColor} value={color} />
        <p className={previewSentenceClassName}>
          <span>Your</span>
          <span className="font-medium" style={{ color }}>
            brand color
          </span>
          <span>—tuned from one compact panel.</span>
        </p>
      </div>
    </div>
  );
}

export default function ColorPickerPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Inputs & Forms" },
        { label: "Color Picker" },
      ]}
      componentName="color-picker"
      description="HSV picker with sliders, format readouts, hex input, and eyedropper."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/color-picker/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/inputs-and-forms/color-picker"
      preview={<ColorPickerPreview />}
      previewClassName="!overflow-visible"
      previewDescription="A compact color picker with a centered caption below."
      railNotes={[
        "The picker emits a leading-hash hex string through onChange (8-digit when alpha is below 100%). Slider drags commit on pointer up for stable controlled usage.",
        "HEX, RGB, HSL, and OKLCH rows are editable; channel values commit on blur or Enter.",
        "EyeDropper works in supporting browsers; use onEyedropperUnsupported for fallback UI instead of alerts.",
      ]}
      title="Color Picker"
      usageCode={usageCode}
      usageDescription="Use ColorPicker when a form needs an inline color surface instead of the native color input. Pass value and onChange for controlled usage, or rely on defaultValue for an uncontrolled starting color."
    />
  );
}
