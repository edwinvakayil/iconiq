"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import {
  getWheelPickerUsageCode,
  WheelPickerPlaygroundProvider,
} from "@/app/(site)/inputs-and-forms/wheel-picker/_components/wheel-picker-playground";
import { wheelPickerApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const importPath = "@/components/ui/wheel-picker";

const usageCode = getWheelPickerUsageCode(importPath);

const details = wheelPickerApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: motion.",
      "This is a pure Motion component with no Radix UI or Base UI primitive underneath — the barrel, inertia, and detent physics are custom.",
      "The generated registry file is /r/wheel-picker.json.",
    ],
    registryPath: "wheel-picker.json",
  };
});

export default function WheelPickerPage() {
  return (
    <WheelPickerPlaygroundProvider importPath={importPath}>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Inputs & Forms" },
            { label: "Wheel Picker" },
          ]}
          componentName="wheel-picker"
          description="iOS-style wheel picker with a 3D barrel, flick inertia, detent snapping, and a fluid selection morph."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/wheel-picker/page.tsx`}
          headerActions={<SharedPrimitiveProviderSwitch />}
          pageUrl="/inputs-and-forms/wheel-picker"
          preview={preview}
          previewClassName="!overflow-visible min-h-[24rem] lg:col-span-8"
          previewDescription="Switch presets and tune visible rows, looping, the selection lens, and disabled state from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Wheel Picker"
          railNotes={[
            "Drag, flick, scroll, tap a row, or use arrow keys — every input projects onto the detent grid and settles with the same near-critically-damped spring.",
            "onChange ticks as the wheel passes each detent, exactly like iOS; onValueCommit fires once when motion settles, for form-style commits.",
            "The selected row morphs continuously: a muted layer crossfades into a medium-weight foreground layer that scales up as it enters the lens.",
            "loop wraps long columns like months or minutes; columns shorter than visibleCount + 2 fall back to bounded scrolling with iOS-style rubber banding.",
            "Set visibleCount and itemHeight on the WheelPicker root so the lens and every column share one detent grid.",
            "Snapping springs collapse to quick eased tweens when prefers-reduced-motion is on.",
          ]}
          title="Wheel Picker"
          usageCode={usageCode}
          usageDescription="Compose WheelPickerColumn parts inside a WheelPicker root. Pass value and onChange for controlled columns, or defaultValue for uncontrolled ones — derived options like day counts can change between renders and the wheel re-snaps safely."
          v0PageCode={usageCode}
        />
      )}
    </WheelPickerPlaygroundProvider>
  );
}
