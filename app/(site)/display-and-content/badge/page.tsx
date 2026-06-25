"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { BadgePlaygroundProvider } from "@/app/(site)/display-and-content/badge/_components/badge-playground";
import { badgeApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BadgeModule from "@/registry/badge";

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

const badgeExamples: VariantItem[] = [
  {
    title: "Sizes",
    code: `import { Badge } from "@/components/ui/badge";

export function BadgeSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge color="indigo" size="sm">
        Small
      </Badge>
      <Badge color="indigo">Medium</Badge>
      <Badge color="indigo" size="lg">
        Large
      </Badge>
    </div>
  );
}`,
  },
  {
    title: "Semantic colors",
    code: `import { Badge } from "@/components/ui/badge";

export function BadgeSemantic() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge color="success">Success</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="error">Error</Badge>
      <Badge color="info">Info</Badge>
    </div>
  );
}`,
  },
  {
    title: "Dismissible",
    code: `"use client";

import { Badge } from "@/components/ui/badge";

export function BadgeDismissible() {
  return (
    <Badge color="purple" onDismiss={() => console.log("dismissed")}>
      Design
    </Badge>
  );
}`,
  },
  {
    title: "As link",
    code: `import { Badge } from "@/components/ui/badge";

export function BadgeLink() {
  return (
    <Badge asChild color="blue">
      <a href="/changelog">Changelog</a>
    </Badge>
  );
}`,
  },
];

export default function BadgePage() {
  return (
    <BadgePlaygroundProvider
      BadgeModule={BadgeModule}
      importPath="@/components/ui/badge"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Badge" },
          ]}
          componentName="badge"
          description="Compact status labels with tinted fills, dot variants, semantic colors, and optional dismiss controls."
          details={badgeApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/badge/page.tsx`}
          examples={badgeExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="badge"
          pageUrl="/display-and-content/badge"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewDescription="Use the playground to switch patterns, variants, colors, and motion settings."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Badge"
          railNotes={[
            "Use Badge for inline status labels and filter chips in copy or toolbars.",
            "Use Status Dot when you need deployment-style ripple states with optional labels.",
            "Use AvatarBadge for presence dots that scale with Avatar size.",
            "Set animate={false} or shimmer={false} when rendering dense badge lists.",
          ]}
          title="Badge"
          usageCode={usageCode}
          usageDescription='Start with the default badge, switch to variant="dot" for a quieter status label, then tune size, color, icon, and motion through the API panel.'
          v0PageCode={usageCode}
        />
      )}
    </BadgePlaygroundProvider>
  );
}
