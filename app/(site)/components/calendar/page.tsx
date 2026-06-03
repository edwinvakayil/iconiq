"use client";

import { useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { calendarApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Calendar } from "@/registry/calendar";

const usageCode = `"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function CalendarPreview() {
  const [selected, setSelected] = useState<Date>(new Date());

  return (
    <Calendar
      defaultMonth={selected}
      onSelect={setSelected}
      selected={selected}
    />
  );
}`;

function CalendarPreview() {
  const [selected, setSelected] = useState<Date>(new Date());

  return (
    <div className="flex w-full justify-center">
      <Calendar
        defaultMonth={selected}
        onSelect={setSelected}
        selected={selected}
      />
    </div>
  );
}

export default function RadixBaseCalendarPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Calendar" },
      ]}
      componentName="calendar"
      description="Date picker for month, year, and day selection."
      details={calendarApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/calendar/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/calendar"
      preview={<CalendarPreview />}
      previewDescription="Move between months, open the month/year labels, choose a day, and test the controlled selected/onSelect API while keeping the same compact calendar visuals and transitions."
      title="Calendar"
      usageCode={usageCode}
      usageDescription="Use controlled or uncontrolled props depending on your form flow. Month/year picking, grid shifts, and selected-day motion share the same visual shell either way."
    />
  );
}
