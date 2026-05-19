"use client";

import { originButtonApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { OriginButton } from "@/registry/origin-button";

const usageCode = `"use client";

import { OriginButton } from "@/components/ui/origin-button";

export function OriginButtonPreview() {
  return <OriginButton>Origin Button</OriginButton>;
}`;

function OriginButtonPreview() {
  return (
    <div className="flex min-h-[12rem] w-full items-center justify-center px-4 py-10">
      <OriginButton>Origin Button</OriginButton>
    </div>
  );
}

export default function OriginButtonPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Special One" },
        { label: "Origin Button" },
      ]}
      componentName="origin-button"
      description="A rounded action button with a pointer-origin fill. On hover or keyboard focus, foreground color spreads from the entry point across the surface while the label inverts for contrast."
      details={originButtonApiDetails}
      preview={<OriginButtonPreview />}
      previewClassName="min-h-[16rem] overflow-visible"
      title="Origin Button"
      usageCode={usageCode}
      usageDescription={
        'Render `OriginButton` with label text or custom children. Use `type="submit"` and `name` inside forms, `loading` for async work, and standard handlers such as `onClick`. The fill starts from the pointer on hover or click and from the center on keyboard focus.'
      }
    />
  );
}
