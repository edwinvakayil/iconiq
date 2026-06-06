"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { badgeApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { badgePreviewCode } from "@/lib/component-v0-pages";
import { Badge } from "@/registry/badge";

const launchBadgeTone = {
  className:
    "[--badge-bg:#ccfbf1] [--badge-fg:#115e59] dark:[--badge-bg:#99f6e4] dark:[--badge-fg:#134e4a]",
  style: {
    backgroundColor: "var(--badge-bg)",
    color: "var(--badge-fg)",
  },
} as const;

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const usageCode = `import { Badge } from "@/components/ui/badge";

export function BadgePreview() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-lg leading-snug dark:text-neutral-100">
      <span>This update is</span>
      <Badge color="teal">Early Access</Badge>
      <span>and</span>
      <Badge color="blue" variant="dot">
        On Track
      </Badge>
      <span>.</span>
    </p>
  );
}`;

function BadgePreview() {
  return (
    <div className="flex min-h-[260px] items-center justify-center px-4 py-8">
      <p className={previewSentenceClassName}>
        <span>This update is</span>
        <span className="inline-flex translate-y-px align-middle">
          <Badge {...launchBadgeTone} color="teal">
            Early Access
          </Badge>
        </span>
        <span>and</span>
        <span className="inline-flex translate-y-px align-middle">
          <Badge color="blue" variant="dot">
            On Track
          </Badge>
        </span>
        <span>.</span>
      </p>
    </div>
  );
}

export default function BadgePage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Badge" },
      ]}
      componentName="badge"
      description="Compact status labels with default and dot variants."
      details={badgeApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/badge/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/badge"
      preview={<BadgePreview />}
      previewCode={badgePreviewCode}
      previewDescription="Default badges and a dot variant inline in one short sentence."
      title="Badge"
      usageCode={usageCode}
      usageDescription='Start with the default badge, switch to `variant="dot"` for a quieter status label, then tune size, color, and shimmer through the API panel.'
    />
  );
}
