"use client";

import { verifiedBadgeApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { verifiedBadgePreviewCode } from "@/lib/component-v0-pages";
import { VerifiedBadge } from "@/registry/verified-badge";

const usageCode = `"use client";

import { VerifiedBadge } from "@/components/ui/verified-badge";

export function VerifiedBadgePreview() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold text-foreground text-xl tracking-tight">
        Iconiq UI
      </span>
      <VerifiedBadge variant="shimmer" size={22} />
    </span>
  );
}`;

function VerifiedBadgePreview() {
  return (
    <div className="flex min-h-[12rem] w-full items-center justify-center px-4 py-10">
      <span className="inline-flex items-center gap-1.5">
        <span className="font-semibold text-foreground text-xl tracking-tight">
          Iconiq UI
        </span>
        <VerifiedBadge size={22} variant="shimmer" />
      </span>
    </div>
  );
}

export default function VerifiedBadgePage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Special One" },
        { label: "Verified Badge" },
      ]}
      componentName="verified-badge"
      description="X-style verified badge with shimmer or static variants."
      details={verifiedBadgeApiDetails}
      preview={<VerifiedBadgePreview />}
      previewClassName="min-h-[12rem] overflow-visible"
      title="Verified Badge"
      usageCode={usageCode}
      usageDescription={
        'Render `VerifiedBadge` beside usernames, profile headers, or trust indicators. Use `variant="shimmer"` for a sweeping highlight on the scallop, `variant="static"` for a fixed badge, and `size` to scale the mark in pixels.'
      }
      v0PageCode={verifiedBadgePreviewCode}
    />
  );
}
