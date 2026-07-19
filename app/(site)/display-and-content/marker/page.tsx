"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { MarkerPlaygroundProvider } from "@/app/(site)/display-and-content/marker/_components/marker-playground";
import { markerApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as MarkerModule from "@/registry/marker";

const usageCode = `import { Marker } from "@/components/ui/marker";

export function MarkerPreview() {
  return (
    <p>
      The quick brown fox jumps over the <Marker>lazy dog</Marker>.
    </p>
  );
}`;

const markerExamples: VariantItem[] = [
  {
    title: "Highlight",
    code: `import { Marker } from "@/components/ui/marker";

export function MarkerHighlight() {
  return (
    <p>
      Ship it with <Marker variant="highlight">confidence</Marker>.
    </p>
  );
}`,
  },
  {
    title: "Circle",
    code: `import { Marker } from "@/components/ui/marker";

export function MarkerCircle() {
  return (
    <p>
      Don't forget the <Marker variant="circle">deadline</Marker>.
    </p>
  );
}`,
  },
  {
    title: "Cross out",
    code: `import { Marker } from "@/components/ui/marker";

export function MarkerCrossOut() {
  return (
    <p>
      <Marker variant="crossOut">$49</Marker> $29/month
    </p>
  );
}`,
  },
  {
    title: "Custom color, no animation",
    code: `import { Marker } from "@/components/ui/marker";

export function MarkerStatic() {
  return (
    <p>
      Always <Marker animate={false} color="text-pink-400" variant="underline">
        static
      </Marker> when it needs to render instantly.
    </p>
  );
}`,
  },
];

export default function MarkerPage() {
  return (
    <MarkerPlaygroundProvider
      importPath="@/components/ui/marker"
      MarkerModule={MarkerModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Marker" },
          ]}
          componentName="marker"
          description="Hand-drawn text annotations that draw themselves in like ink as they scroll into view, with an optional animate prop for a fully static render."
          details={markerApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/marker/page.tsx`}
          examples={markerExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="marker"
          pageUrl="/display-and-content/marker"
          preview={preview}
          previewClassName="min-h-[22rem]"
          previewDescription="Switch the variant, speed, and animate toggle to see the stroke redraw itself."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Marker"
          railNotes={[
            "Marker wraps inline content, so keep it inside a paragraph or heading rather than around block-level elements.",
            "Set animate={false} for a print-safe or reduced-motion-friendly static render.",
            "The highlight variant renders behind the glyphs; every other variant renders on top, so pick a color with enough contrast against your text.",
            "Multiple Marker instances on one page never collide — filter ids are scoped per instance with useId.",
          ]}
          title="Marker"
          usageCode={usageCode}
          usageDescription="Wrap any inline text. The stroke draws itself in once, the first time it scrolls into view."
          v0PageCode={usageCode}
        />
      )}
    </MarkerPlaygroundProvider>
  );
}
