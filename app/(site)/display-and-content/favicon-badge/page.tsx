"use client";

import { useMemo, useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { faviconBadgeApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { FaviconBadgeLivePreview } from "@/components/favicon-badge-live-preview";
import { LINK } from "@/constants";
import { faviconBadgePreviewCode } from "@/lib/component-v0-pages";

const usageCode = `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgePreview() {
  return (
    <FaviconBadge website="iconiqui.com" size="md" />
  );
}`;

function buildPreviewCode(website: string) {
  return `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgePreview() {
  return (
    <FaviconBadge website="${website}" size="md" />
  );
}`;
}

export default function FaviconBadgePage() {
  const [website, setWebsite] = useState("iconiqui.com");
  const previewCode = useMemo(() => buildPreviewCode(website), [website]);

  return (
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
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/favicon-badge"
      preview={
        <FaviconBadgeLivePreview
          className="min-h-[14rem] py-10"
          onWebsiteChange={setWebsite}
          website={website}
        />
      }
      previewClassName="min-h-[14rem] overflow-visible"
      previewCode={previewCode}
      previewDescription="Edit the website inline in the sentence to see the favicon badge update live."
      title="Favicon Badge"
      usageCode={usageCode}
      usageDescription={
        "Pass `website` with a domain or full URL to resolve the favicon through Google's favicon service. Add optional `label` for text beside the circular badge, and tune `size` or `faviconSize` when the default scale does not fit your layout."
      }
      v0PageCode={faviconBadgePreviewCode}
    />
  );
}
