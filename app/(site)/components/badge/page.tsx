"use client";

import { badgeApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
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
      actionDescription="Ship the registry bundle to v0 when you want to tune the palette, add more badge modes, or adjust the shimmer pacing."
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Badge" },
      ]}
      componentName="badge"
      description="Preset-color badge with an animated default fill, a quieter dot variant, and compact size controls."
      details={badgeApiDetails}
      detailsDescription="Props and visual behavior are grouped into expandable rows instead of a dense table."
      preview={<BadgePreview />}
      previewCode={badgePreviewCode}
      title="Badge"
      usageCode={usageCode}
      usageDescription='Start with the animated default badge, switch to `variant="dot"` for a quieter status label, then tune size, color, and shimmer through the API panel.'
    />
  );
}
