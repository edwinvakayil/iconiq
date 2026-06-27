"use client";

import { StatusDotPlaygroundProvider } from "@/app/(site)/display-and-content/status-dot/_components/status-dot-playground";
import { statusDotApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { statusDotPreviewCode } from "@/lib/component-v0-pages";
import * as StatusDotModule from "@/registry/status-dot";

const usageCode = `"use client";

import { StatusDot } from "@/components/ui/status-dot";

export function StatusDotPreview() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-lg leading-snug dark:text-neutral-100">
      <span>Right now, production is</span>
      <StatusDot className="translate-y-px" state="READY" />
      <span>live for every region.</span>
    </p>
  );
}`;

const statusDotExamples = [
  {
    title: "Inline sentence",
    code: `"use client";

import { StatusDot } from "@/components/ui/status-dot";

export function StatusDotInlineExample() {
  return (
    <p className="flex flex-wrap items-center gap-x-2 text-sm">
      <span>Deploy status:</span>
      <StatusDot state="BUILDING" />
      <span>on main.</span>
    </p>
  );
}`,
  },
  {
    title: "Labeled row",
    code: `"use client";

import { StatusDot } from "@/components/ui/status-dot";

export function StatusDotLabeledExample() {
  return <StatusDot showLabel state="ERROR" />;
}`,
  },
  {
    title: "Custom label",
    code: `"use client";

import { StatusDot } from "@/components/ui/status-dot";

export function StatusDotCustomLabelExample() {
  return (
    <StatusDot
      label="Live in production"
      showLabel
      state="READY"
    />
  );
}`,
  },
  {
    title: "Sizes",
    code: `"use client";

import { StatusDot } from "@/components/ui/status-dot";

export function StatusDotSizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <StatusDot showLabel size="sm" state="READY" />
      <StatusDot showLabel size="md" state="READY" />
      <StatusDot showLabel size="lg" state="READY" />
    </div>
  );
}`,
  },
];

export default function StatusDotPage() {
  return (
    <StatusDotPlaygroundProvider
      importPath="@/components/ui/status-dot"
      StatusDotModule={StatusDotModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Status Dot" },
          ]}
          componentName="status-dot"
          description="Rippling status dot for inline copy and deployment dashboards."
          details={statusDotApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/status-dot/page.tsx`}
          examples={statusDotExamples}
          itemSlug="status-dot"
          pageUrl="/display-and-content/status-dot"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewCode={statusDotPreviewCode}
          previewDescription="Tune deployment states, sizing, labels, and ripple animation from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Status Dot"
          railNotes={[
            "Default to dot-only for inline sentences; add `showLabel` when you need visible copy beside the indicator.",
            "Use `state` for deployment presets such as `BUILDING`, `READY`, and `ERROR`.",
            "Ripple animation defaults to active states only; pass `animate` to override per instance.",
            'Dot-only indicators announce changes with `role="status"` and `aria-live="polite"`.',
          ]}
          title="Status Dot"
          usageCode={usageCode}
          usageDescription="Start with a dot-only inline indicator, then expand into labeled rows and sizing through the API details."
          v0PageCode={usageCode}
        />
      )}
    </StatusDotPlaygroundProvider>
  );
}
