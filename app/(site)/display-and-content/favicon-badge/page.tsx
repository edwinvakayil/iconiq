"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { FaviconBadgePlaygroundProvider } from "@/app/(site)/display-and-content/favicon-badge/_components/favicon-badge-playground";
import { faviconBadgeApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { faviconBadgePreviewCode } from "@/lib/component-v0-pages";
import * as FaviconBadgeModule from "@/registry/favicon-badge";

const usageCode = `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgePreview() {
  return (
    <FaviconBadge label="Iconiq UI" size="md" website="iconiqui.com" />
  );
}`;

const faviconBadgeExamples: VariantItem[] = [
  {
    title: "Sizes",
    code: `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgeSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FaviconBadge size="sm" website="github.com" />
      <FaviconBadge size="md" website="github.com" />
      <FaviconBadge size="lg" website="github.com" />
    </div>
  );
}`,
  },
  {
    title: "With label",
    code: `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgeWithLabel() {
  return (
    <FaviconBadge label="Vercel" size="md" website="vercel.com" />
  );
}`,
  },
  {
    title: "Custom favicon URL",
    code: `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgeOverride() {
  return (
    <FaviconBadge
      faviconUrl="/brand-mark.svg"
      label="Internal docs"
      website="docs.internal"
    />
  );
}`,
  },
  {
    title: "Invalid domain",
    code: `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgeInvalid() {
  return <FaviconBadge website="not-a-valid-domain" />;
}`,
  },
];

export default function FaviconBadgePage() {
  return (
    <FaviconBadgePlaygroundProvider
      FaviconBadgeModule={FaviconBadgeModule}
      importPath="@/components/ui/favicon-badge"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Favicon Badge" },
          ]}
          componentName="favicon-badge"
          description="Circular website favicon badge with optional label text."
          details={faviconBadgeApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/favicon-badge/page.tsx`}
          examples={faviconBadgeExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="favicon-badge"
          pageUrl="/display-and-content/favicon-badge"
          preview={preview}
          previewClassName="min-h-[14rem] overflow-visible"
          previewDescription="Use the playground to switch patterns, website presets, sizes, favicon resolution, and label text."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Favicon Badge"
          railNotes={[
            "Use the inline pattern for attribution rows where the domain can be edited in place.",
            "Set `faviconUrl` when CSP or privacy rules block Google and DuckDuckGo icon services.",
            "Tune `faviconSize` for retina clarity without changing the on-screen badge scale.",
            "Invalid domains show the error globe with a destructive-tinted border.",
          ]}
          title="Favicon Badge"
          usageCode={usageCode}
          usageDescription={
            "Pass `website` with a domain or full URL to resolve the favicon through Google and DuckDuckGo icon services. Add optional `label` for text beside the circular badge, use `faviconUrl` to bypass external providers for CSP or self-hosted icons, and tune `size` or `faviconSize` when the default scale does not fit your layout."
          }
          v0PageCode={faviconBadgePreviewCode}
        />
      )}
    </FaviconBadgePlaygroundProvider>
  );
}
