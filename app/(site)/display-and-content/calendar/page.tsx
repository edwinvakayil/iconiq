"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { CalendarPlaygroundProvider } from "@/app/(site)/display-and-content/calendar/_components/calendar-playground";
import { calendarApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as CalendarModule from "@/registry/calendar";

const usageCode = `"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function CalendarPreview() {
  const [selected, setSelected] = useState<Date | null>(new Date());

  return (
    <Calendar
      onSelect={setSelected}
      selected={selected}
      size="md"
    />
  );
}`;

const calendarExamples: VariantItem[] = [
  {
    title: "Date bounds",
    code: `"use client";

import { addDays, isWeekend, startOfDay } from "date-fns";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function CalendarBounds() {
  const [selected, setSelected] = useState<Date | null>(null);
  const today = startOfDay(new Date());

  return (
    <Calendar
      disabled={(date) => isWeekend(date)}
      maxDate={addDays(today, 30)}
      minDate={today}
      onSelect={setSelected}
      selected={selected}
    />
  );
}`,
  },
  {
    title: "Range selection",
    code: `"use client";

import { useState } from "react";
import { Calendar, type CalendarRange } from "@/components/ui/calendar";

export function CalendarRange() {
  const [range, setRange] = useState<CalendarRange>({});

  return (
    <Calendar mode="range" onRangeSelect={setRange} range={range} size="md" />
  );
}`,
  },
  {
    title: "Marked dates",
    code: `import { Calendar } from "@/components/ui/calendar";

export function CalendarModifiers() {
  return (
    <Calendar
      modifiers={{
        booked: (date) => date.getDate() % 7 === 0,
      }}
      modifierLabels={{
        booked: "Booked",
      }}
    />
  );
}`,
  },
  {
    title: "With DatePicker",
    code: `"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

export function CalendarDatePicker() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <DatePicker
      calendarProps={{ size: "md" }}
      onChange={setValue}
      value={value}
    />
  );
}`,
  },
];

export default function CalendarPage() {
  return (
    <CalendarPlaygroundProvider
      CalendarModule={CalendarModule}
      importPath="@/components/ui/calendar"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Calendar" },
          ]}
          componentName="calendar"
          description="Animated monthly calendar for single-day or range selection, with bounds, modifiers, locale support, and an optional DatePicker wrapper."
          details={calendarApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/calendar/page.tsx`}
          examples={calendarExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="calendar"
          pageUrl="/display-and-content/calendar"
          preview={preview}
          previewClassName="min-h-[22rem] overflow-visible"
          previewDescription="Use the playground to switch mode, size, bounds, locale, and marker settings."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Calendar"
          railNotes={[
            "Use Calendar when the date grid should stay visible in the page layout.",
            "Use DatePicker for compact forms that open the same calendar panel from a trigger.",
            "Pass stable disabled and modifiers callbacks in production to avoid unnecessary focus resets.",
            "Install the calendar registry entry before date-picker in consumer apps.",
          ]}
          title="Calendar"
          usageCode={usageCode}
          usageDescription="Start with a controlled single-date calendar, then add bounds or switch to range mode. Pair with date-picker when you need a collapsible field."
          v0PageCode={usageCode}
        />
      )}
    </CalendarPlaygroundProvider>
  );
}
