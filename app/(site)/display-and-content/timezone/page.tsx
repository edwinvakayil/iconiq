"use client";

import { useState } from "react";

import { InlinePreviewSelect } from "@/app/(site)/components/_components/inline-preview-select";
import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { timezoneApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { timezonePreviewCode } from "@/lib/component-v0-pages";
import { Timezone } from "@/registry/timezone";

const zoneOptions = [
  { value: "San Francisco", label: "San Francisco" },
  { value: "New York", label: "New York" },
  { value: "London", label: "London" },
  { value: "India", label: "India" },
  { value: "Tokyo", label: "Tokyo" },
  { value: "Sydney", label: "Sydney" },
] as const;

type PreviewZone = (typeof zoneOptions)[number]["value"];

const previewSentenceClassName =
  "flex max-w-2xl flex-wrap items-baseline justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-sm text-neutral-800 leading-snug tracking-tight sm:text-base dark:text-neutral-100";

const usageCode = `import { Timezone } from "@/components/ui/timezone";

export function TimezonePreview() {
  return (
    <p className="flex max-w-2xl flex-wrap items-baseline justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-sm leading-snug tracking-tight sm:text-base dark:text-neutral-100">
      <span>Right now in</span>
      <span>San Francisco</span>
      <span>it is</span>
      <Timezone live zone="San Francisco" zoneName="abbreviation" />
      <span>for the west coast team.</span>
    </p>
  );
}`;

function TimezonePreview() {
  const [zone, setZone] = useState<PreviewZone>("San Francisco");

  return (
    <div className="flex min-h-[260px] w-full items-center justify-center px-4 py-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className={previewSentenceClassName}>
          <span>Right now in</span>
          <InlinePreviewSelect
            ariaLabel="Timezone city"
            menuKey="timezone-zone-menu"
            onChange={setZone}
            options={zoneOptions}
            value={zone}
          />
          <span>it is</span>
          <Timezone live zone={zone} />
          <span>for the distributed team.</span>
        </p>
      </div>
    </div>
  );
}

export default function TimezonePage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Display & Content" },
        { label: "Timezone" },
      ]}
      componentName="timezone"
      description="Inline live clock for city names or IANA timezones."
      details={timezoneApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/timezone/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/timezone"
      preview={<TimezonePreview />}
      previewClassName="overflow-visible"
      previewCode={timezonePreviewCode}
      previewDescription="Pick a city inline and watch the live clock update in the sentence."
      title="Timezone"
      usageCode={usageCode}
      usageDescription='Pass a city alias like `San Francisco` or an IANA timezone such as `America/Los_Angeles`. Use `zoneName="abbreviation"` for IST/EST-style labels, or `zoneName="offset"` for GMT offset labels.'
      v0PageCode={timezonePreviewCode}
    />
  );
}
