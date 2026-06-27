"use client";

import { VerifiedBadgePlaygroundProvider } from "@/app/(site)/display-and-content/verified-badge/_components/verified-badge-playground";
import { verifiedBadgeApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { verifiedBadgePreviewCode } from "@/lib/component-v0-pages";
import * as VerifiedBadgeModule from "@/registry/verified-badge";

const usageCode = `"use client";

import { VerifiedBadge } from "@/components/ui/verified-badge";

export function VerifiedBadgePreview() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold text-foreground text-xl tracking-tight">
        Iconiq UI
      </span>
      <VerifiedBadge className="translate-y-px" />
    </span>
  );
}`;

const verifiedBadgeExamples: VariantItem[] = [
  {
    title: "Static variant",
    code: `"use client";

import { VerifiedBadge } from "@/components/ui/verified-badge";

export function VerifiedBadgeStaticExample() {
  return (
    <span className="inline-flex items-center gap-1.5 text-lg font-semibold">
      <span>Iconiq UI</span>
      <VerifiedBadge className="translate-y-px" variant="static" />
    </span>
  );
}`,
  },
  {
    title: "Sizes",
    code: `"use client";

import { VerifiedBadge } from "@/components/ui/verified-badge";

export function VerifiedBadgeSizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <VerifiedBadge size="sm" />
      <VerifiedBadge size="md" />
      <VerifiedBadge size="lg" />
    </div>
  );
}`,
  },
  {
    title: "Gold tone",
    code: `"use client";

import { VerifiedBadge } from "@/components/ui/verified-badge";

export function VerifiedBadgeGoldExample() {
  return (
    <span className="inline-flex items-center gap-1.5 text-lg font-semibold">
      <span>Premium account</span>
      <VerifiedBadge className="translate-y-px" tone="gold" />
    </span>
  );
}`,
  },
  {
    title: "Decorative beside visible label",
    code: `"use client";

import { VerifiedBadge } from "@/components/ui/verified-badge";

export function VerifiedBadgeDecorativeExample() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span>Iconiq UI</span>
      <span className="text-muted-foreground">Verified</span>
      <VerifiedBadge className="translate-y-px" decorative size="sm" />
    </span>
  );
}`,
  },
];

export default function VerifiedBadgePage() {
  return (
    <VerifiedBadgePlaygroundProvider
      importPath="@/components/ui/verified-badge"
      VerifiedBadgeModule={VerifiedBadgeModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Verified Badge" },
          ]}
          componentName="verified-badge"
          description="X-style verified badge with shimmer or static variants."
          details={verifiedBadgeApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/verified-badge/page.tsx`}
          examples={verifiedBadgeExamples}
          itemSlug="verified-badge"
          pageUrl="/display-and-content/verified-badge"
          preview={preview}
          previewClassName="min-h-[12rem] overflow-visible"
          previewCode={verifiedBadgePreviewCode}
          previewDescription="Tune variant, size presets, tone, and decorative mode from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Verified Badge"
          railNotes={[
            'Default to `size="md"` (22px) beside usernames; use `sm` in dense lists and `lg` in profile headers.',
            "Pass `decorative` when visible copy already announces verification so screen readers do not repeat it.",
            "Shimmer mounts after hydration to avoid SSR mismatches and falls back to static when `prefers-reduced-motion` is enabled.",
            'Use `tone="gold"` for premium or organization-style marks; override color with any `text-*` class via `className`.',
            'Add `className="translate-y-px"` when aligning the badge with adjacent text baselines.',
          ]}
          title="Verified Badge"
          usageCode={usageCode}
          usageDescription={
            'Render `VerifiedBadge` beside usernames, profile headers, or trust indicators. Use `variant="shimmer"` for a sweeping highlight on the scallop, `variant="static"` for a fixed badge, and `size` presets (`sm`, `md`, `lg`) or a pixel number to scale the mark.'
          }
          v0PageCode={verifiedBadgePreviewCode}
        />
      )}
    </VerifiedBadgePlaygroundProvider>
  );
}
