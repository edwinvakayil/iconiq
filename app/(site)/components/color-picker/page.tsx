"use client";

import { useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { colorPickerApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { ColorPicker } from "@/registry/color-picker";

const usageCode = `"use client";

import { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";

export function BrandColorPicker() {
  const [color, setColor] = useState("#3B82F6");

  return <ColorPicker onChange={setColor} value={color} />;
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
    <div className="flex justify-center px-2 py-4">
      <ColorPicker onChange={setColor} value={color} />
    </div>
  );
}

export default function ColorPickerPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Color Picker" },
      ]}
      componentName="color-picker"
      description="HSV panel with hue/alpha sliders, multi-format readouts, hex input, and EyeDropper."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/color-picker/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/color-picker"
      preview={<ColorPickerPreview />}
      previewClassName="!overflow-visible"
      previewDescription="Drag inside the saturation field, tune hue and alpha on the sliders, switch between HEX, RGB, HSL, and OKLCH readouts, or sample a screen color when the browser supports EyeDropper."
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
