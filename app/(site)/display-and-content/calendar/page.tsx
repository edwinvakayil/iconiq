"use client";

import { useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { calendarApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Calendar } from "@/registry/calendar";

const previewSentenceClassName =
  "text-balance text-center text-[15px] text-muted-foreground leading-relaxed sm:text-base";

const previewContentClassName =
  "flex w-full flex-col items-center gap-4 text-center";

const usageCode = `"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function CalendarPreview() {
  const [selected, setSelected] = useState<Date>(new Date());

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <Calendar
          defaultMonth={selected}
          onSelect={setSelected}
          selected={selected}
        />
        <p className="text-balance text-center text-[15px] text-muted-foreground leading-relaxed sm:text-base">
          Jump months and pick a day from one compact grid.
        </p>
      </div>
    </div>
  );
}`;

function CalendarPreview() {
  const [selected, setSelected] = useState<Date>(new Date());

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className={previewContentClassName}>
        <Calendar
          defaultMonth={selected}
          onSelect={setSelected}
          selected={selected}
        />
        <p className={previewSentenceClassName}>
          Jump months and pick a day from one compact grid.
        </p>
      </div>
    </div>
  );
}

export default function RadixBaseCalendarPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Display & Content" },
        { label: "Calendar" },
      ]}
      componentName="calendar"
      description="Date picker for month, year, and day selection."
      details={calendarApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/calendar/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/calendar"
      preview={<CalendarPreview />}
      previewDescription="A compact calendar with a centered caption below."
      title="Calendar"
      usageCode={usageCode}
      usageDescription="Use controlled or uncontrolled props depending on your form flow. Month/year picking, grid shifts, and selected-day motion share the same visual shell either way."
    />
  );
}
