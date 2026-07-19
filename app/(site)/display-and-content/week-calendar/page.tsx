"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { WeekCalendarPlaygroundProvider } from "@/app/(site)/display-and-content/week-calendar/_components/week-calendar-playground";
import { weekCalendarApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as WeekCalendarModule from "@/registry/week-calendar";

const usageCode = `"use client";

import { useState } from "react";
import { WeekCalendar } from "@/components/ui/week-calendar";

export function WeekCalendarPreview() {
  const [selected, setSelected] = useState<Date | null>(new Date());

  return <WeekCalendar onSelect={setSelected} selected={selected} />;
}`;

const weekCalendarExamples: VariantItem[] = [
  {
    title: "Starts expanded",
    code: `"use client";

import { useState } from "react";
import { WeekCalendar } from "@/components/ui/week-calendar";

export function WeekCalendarMonth() {
  const [selected, setSelected] = useState<Date | null>(new Date());

  return (
    <WeekCalendar
      defaultExpanded
      onSelect={setSelected}
      selected={selected}
    />
  );
}`,
  },
  {
    title: "Monday week start",
    code: `"use client";

import { useState } from "react";
import { WeekCalendar } from "@/components/ui/week-calendar";

export function WeekCalendarMonday() {
  const [selected, setSelected] = useState<Date | null>(new Date());

  return (
    <WeekCalendar
      onSelect={setSelected}
      selected={selected}
      weekStartsOn={1}
    />
  );
}`,
  },
  {
    title: "Controlled expand state",
    code: `"use client";

import { useState } from "react";
import { WeekCalendar } from "@/components/ui/week-calendar";

export function WeekCalendarControlled() {
  const [selected, setSelected] = useState<Date | null>(new Date());
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        className="text-xs font-medium underline"
        onClick={() => setExpanded((value) => !value)}
        type="button"
      >
        {expanded ? "Collapse" : "Expand"} from outside
      </button>
      <WeekCalendar
        expanded={expanded}
        onExpandedChange={setExpanded}
        onSelect={setSelected}
        selected={selected}
      />
    </div>
  );
}`,
  },
];

export default function WeekCalendarPage() {
  return (
    <WeekCalendarPlaygroundProvider
      importPath="@/components/ui/week-calendar"
      WeekCalendarModule={WeekCalendarModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Week Calendar" },
          ]}
          componentName="week-calendar"
          description="A week strip that morphs into a full month grid, with a spring-driven pill and a draggable grabber handle."
          details={weekCalendarApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/week-calendar/page.tsx`}
          examples={weekCalendarExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="week-calendar"
          pageUrl="/display-and-content/week-calendar"
          preview={preview}
          previewClassName="min-h-[22rem] overflow-visible"
          previewDescription="Tap a day to select it, swipe the week strip left or right, or drag the handle down to morph into the full month."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Week Calendar"
          railNotes={[
            "Use WeekCalendar when a compact week strip should stay in the layout but still offer a full month view on demand.",
            "The selected pill and today ring share a layoutId per instance, so multiple calendars on one page never cross-morph into each other.",
            "Drag gestures fall back to instant state changes under prefers-reduced-motion.",
            "Selecting a day always re-centers the anchor week, so collapsing shows the week containing the newest selection.",
          ]}
          title="Week Calendar"
          usageCode={usageCode}
          usageDescription="Start with a controlled selected date, then opt into defaultExpanded or a custom weekStartsOn."
          v0PageCode={usageCode}
        />
      )}
    </WeekCalendarPlaygroundProvider>
  );
}
