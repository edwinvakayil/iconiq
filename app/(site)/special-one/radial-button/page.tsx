"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { radialButtonApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { RadialButton } from "@/registry/radial-button";

const usageCode = `"use client";

import { RadialButton } from "@/components/ui/radial-button";

export function RadialButtonPreview() {
  return <RadialButton>Radial Button</RadialButton>;
}`;

function RadialButtonPreview() {
  return (
    <div className="flex min-h-[12rem] w-full items-center justify-center px-4 py-10">
      <RadialButton>Radial Button</RadialButton>
    </div>
  );
}

export default function RadialButtonPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Special One" },
        { label: "Radial Button" },
      ]}
      componentName="radial-button"
      description="Rounded button with a radial fill on hover—and inverted label."
      details={radialButtonApiDetails}
      headerActions={<SharedPrimitiveProviderSwitch />}
      preview={<RadialButtonPreview />}
      previewClassName="min-h-[16rem] overflow-visible"
      title="Radial Button"
      usageCode={usageCode}
      usageDescription={
        'Render `RadialButton` with label text or custom children. Use `type="submit"` and `name` inside forms, `loading` for async work, and standard handlers such as `onClick`. The fill starts from the pointer on hover or click and from the center on keyboard focus.'
      }
    />
  );
}
