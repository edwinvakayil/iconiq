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

const betaBadgeTone = {
  className:
    "[--badge-bg:#ffedd5] [--badge-fg:#9a3412] dark:[--badge-bg:#fed7aa] dark:[--badge-fg:#7c2d12]",
  style: {
    backgroundColor: "var(--badge-bg)",
    color: "var(--badge-fg)",
  },
} as const;

const shippingBadgeTone = {
  className:
    "[--badge-bg:#fce7f3] [--badge-fg:#9d174d] dark:[--badge-bg:#fbcfe8] dark:[--badge-fg:#831843]",
  style: {
    backgroundColor: "var(--badge-bg)",
    color: "var(--badge-fg)",
  },
} as const;

const usageCode = `import { Badge } from "@/components/ui/badge";

export function BadgePreview() {
  return (
    <p className="max-w-2xl text-center text-lg font-medium leading-relaxed dark:text-neutral-100">
      Mark the beat with a <Badge color="teal">Fresh Launch</Badge> tag for
      releases, <Badge color="orange">Private Beta</Badge> while you're still
      tuning, <Badge color="pink">Now Shipping</Badge> once it's out the door,
      and a quieter{" "}
      <Badge color="blue" variant="dot">
        Status Monitoring
      </Badge>{" "}
      pulse when the release just needs a status check.
    </p>
  );
}`;

function BadgePreview() {
  return (
    <div className="flex min-h-[260px] flex-1 items-center justify-center px-4 py-8">
      <p className="max-w-2xl text-center font-medium font-sans text-lg text-neutral-800 leading-relaxed sm:text-xl dark:text-neutral-100">
        Mark the beat with a{" "}
        <Badge {...launchBadgeTone} color="teal">
          Fresh Launch
        </Badge>{" "}
        tag for releases,{" "}
        <Badge {...betaBadgeTone} color="orange">
          Private Beta
        </Badge>{" "}
        while you&apos;re still tuning,{" "}
        <Badge {...shippingBadgeTone} color="pink">
          Now Shipping
        </Badge>{" "}
        once it&apos;s out the door, and a quieter{" "}
        <Badge color="blue" variant="dot">
          Status Monitoring
        </Badge>{" "}
        pulse when the release just needs a status check.
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
      title="Badge"
      usageCode={usageCode}
      usageDescription='Start with the default badge, switch to `variant="dot"` for a quieter status label, then tune size, color, and shimmer through the API panel.'
    />
  );
}
