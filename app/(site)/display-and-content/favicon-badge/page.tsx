"use client";

import { useMemo, useState } from "react";

import { InlinePreviewSelect } from "@/app/(site)/components/_components/inline-preview-select";
import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { faviconBadgeApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { faviconBadgePreviewCode } from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";
import { FaviconBadge } from "@/registry/favicon-badge";

type FaviconBadgeSize = "sm" | "md" | "lg";

const sizeOptions: { label: string; value: FaviconBadgeSize }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const controlInputClassName =
  "min-w-[8.5rem] rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none transition-colors focus-visible:outline-none";

const usageCode = `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgePreview() {
  return (
    <FaviconBadge website="iconiqui.com" size="md" />
  );
}`;

function buildPreviewCode({
  label,
  size,
  website,
}: {
  label: string;
  size: FaviconBadgeSize;
  website: string;
}) {
  const trimmedLabel = label.trim();
  const labelProp = trimmedLabel ? `\n      label="${trimmedLabel}"` : "";

  return `"use client";

import { FaviconBadge } from "@/components/ui/favicon-badge";

export function FaviconBadgePreview() {
  return (
    <FaviconBadge
      website="${website}"${labelProp}
      size="${size}"
    />
  );
}`;
}

type FaviconBadgePreviewProps = {
  label: string;
  onLabelChange: (label: string) => void;
  onSizeChange: (size: FaviconBadgeSize) => void;
  onWebsiteChange: (website: string) => void;
  size: FaviconBadgeSize;
  website: string;
};

function FaviconBadgePreview({
  label,
  onLabelChange,
  onSizeChange,
  onWebsiteChange,
  size,
  website,
}: FaviconBadgePreviewProps) {
  const badgeLabel = label.trim() || undefined;

  return (
    <div className="flex min-h-[14rem] w-full flex-col items-center justify-center gap-6 px-4 py-10">
      <fieldset
        aria-label="Favicon badge preview controls"
        className="m-0 flex w-full max-w-xl flex-wrap items-end justify-center gap-3 border-0 p-0"
      >
        <label className="flex min-w-[10rem] flex-1 flex-col gap-1.5 text-left text-muted-foreground text-xs">
          Website
          <input
            className={controlInputClassName}
            onChange={(event) => onWebsiteChange(event.target.value)}
            placeholder="iconiqui.com"
            value={website}
          />
        </label>
        <label className="flex min-w-[8rem] flex-1 flex-col gap-1.5 text-left text-muted-foreground text-xs">
          Label
          <input
            className={controlInputClassName}
            onChange={(event) => onLabelChange(event.target.value)}
            placeholder="Optional"
            value={label}
          />
        </label>
        <div className="flex flex-col gap-1.5 text-left text-muted-foreground text-xs">
          Size
          <InlinePreviewSelect
            ariaLabel="Favicon badge size"
            menuKey="favicon-badge-size-menu"
            onChange={onSizeChange}
            options={sizeOptions}
            value={size}
          />
        </div>
      </fieldset>

      <p className={cn(previewSentenceClassName, "max-w-2xl text-center")}>
        <span>Attributed to</span>
        <span className="inline-flex translate-y-px align-middle">
          <FaviconBadge label={badgeLabel} size={size} website={website} />
        </span>
        <span>for</span>
        <span className="font-medium text-foreground">
          {website || "your site"}
        </span>
        <span>.</span>
      </p>
    </div>
  );
}

export default function FaviconBadgePage() {
  const [website, setWebsite] = useState("iconiqui.com");
  const [label, setLabel] = useState("");
  const [size, setSize] = useState<FaviconBadgeSize>("md");
  const previewCode = useMemo(
    () => buildPreviewCode({ website, label, size }),
    [label, size, website]
  );

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
        <FaviconBadgePreview
          label={label}
          onLabelChange={setLabel}
          onSizeChange={setSize}
          onWebsiteChange={setWebsite}
          size={size}
          website={website}
        />
      }
      previewClassName="min-h-[14rem] overflow-visible"
      previewCode={previewCode}
      previewDescription="Edit the website, optional label, and size inline to see the favicon badge update live."
      title="Favicon Badge"
      usageCode={usageCode}
      usageDescription={
        "Pass `website` with a domain or full URL to resolve the favicon through Google's favicon service. Add optional `label` for text beside the circular badge, and tune `size` or `faviconSize` when the default scale does not fit your layout."
      }
      v0PageCode={faviconBadgePreviewCode}
    />
  );
}
