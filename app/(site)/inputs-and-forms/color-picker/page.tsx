"use client";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { ColorPickerPlaygroundProvider } from "@/app/(site)/inputs-and-forms/color-picker/_components/color-picker-playground";
import { colorPickerApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const importPath = "@/components/ui/color-picker";

const usageCode = `"use client";

import { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";

export function BrandColorPicker() {
  const [color, setColor] = useState("#3B82F6");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <ColorPicker
          aria-label="Brand color"
          name="brand-color"
          onChange={setColor}
          showCopy
          value={color}
        />
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
      "Dependencies: @base-ui/react, lucide-react, motion.",
      "This page documents the Base UI install only. Text inputs use the Base UI Input primitive; Radix UI does not ship a dedicated color picker primitive.",
      "The generated registry file is /r/color-picker.json.",
    ],
    registryPath: "color-picker.json",
  };
});

function handleProviderSelect() {
  return undefined;
}

export default function ColorPickerPage() {
  return (
    <ColorPickerPlaygroundProvider importPath={importPath}>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Inputs & Forms" },
            { label: "Color Picker" },
          ]}
          componentName="color-picker"
          description="HSV picker with sliders, format readouts, hex input, presets, popover mode, and eyedropper."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/color-picker/page.tsx`}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          pageUrl="/inputs-and-forms/color-picker"
          preview={preview}
          previewClassName="!overflow-visible min-h-[20rem] lg:col-span-8"
          previewDescription="Tune variant, format, alpha, presets, and footer controls from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Color Picker"
          railNotes={[
            "The picker emits a leading-hash hex string through onChange (8-digit when alpha is below 100%). Slider drags commit on pointer up for stable controlled usage.",
            "onChange and onValueCommit both receive a detail object with hex, rgb, hsl, and oklch CSS strings.",
            'Use variant="popover" for a field trigger, variant="swatch" for a compact color square, or stay inline for always-visible editing.',
            "Pass presets for quick-select swatches, showCopy for clipboard, and showAlpha={false} for opaque-only flows.",
            "EyeDropper works in supporting browsers; use onEyedropperUnsupported for fallback UI instead of alerts.",
          ]}
          title="Color Picker"
          usageCode={usageCode}
          usageDescription="This Base UI install uses the Input primitive for hex and channel readouts. Pass value and onChange for controlled usage, or rely on defaultValue for an uncontrolled starting color."
          v0PageCode={usageCode}
        />
      )}
    </ColorPickerPlaygroundProvider>
  );
}
