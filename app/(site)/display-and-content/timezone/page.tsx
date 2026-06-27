"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { TimezonePlaygroundProvider } from "@/app/(site)/display-and-content/timezone/_components/timezone-playground";
import { timezoneApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { timezonePreviewCode } from "@/lib/component-v0-pages";
import * as TimezoneModule from "@/registry/timezone";

const usageCode = `import { Timezone } from "@/components/ui/timezone";

export function TimezonePreview() {
  return (
    <div className="flex max-w-2xl flex-wrap items-baseline justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-sm leading-snug tracking-tight sm:text-base dark:text-neutral-100">
      <span>Right now in</span>
      <span>San Francisco</span>
      <span>it is</span>
      <Timezone live showZoneLabel zone="San Francisco" zoneName="abbreviation" />
      <span>for the west coast team.</span>
    </div>
  );
}`;

export default function TimezonePage() {
  return (
    <TimezonePlaygroundProvider
      importPath="@/components/ui/timezone"
      TimezoneModule={TimezoneModule}
    >
      {({ preview, renderSettings }) => (
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
          itemSlug="timezone"
          pageUrl="/display-and-content/timezone"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewCode={timezonePreviewCode}
          previewDescription="Use the playground to switch cities, clock format, zone labels, locale, live seconds, animation, and screen-reader behavior."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Timezone"
          railNotes={[
            "Use `resolveTimezone()` before rendering if you need to validate user input.",
            "`getWorldTimezones()` returns every IANA timezone from the current runtime.",
            "Aliases such as `portland` and `la` intentionally resolve to US West Coast zones.",
            "Pass `fallback` or `onError` when the zone string comes from user input.",
            "Enable `ariaLive` for minute-level clocks; keep it off for second-level `live` clocks unless you need frequent announcements.",
          ]}
          title="Timezone"
          usageCode={usageCode}
          usageDescription='Pass a city alias like `San Francisco` or an IANA timezone such as `America/Los_Angeles`. Use `zoneName="abbreviation"` for IST/EST-style labels, or `zoneName="offset"` for GMT offset labels.'
          v0PageCode={timezonePreviewCode}
        />
      )}
    </TimezonePlaygroundProvider>
  );
}
