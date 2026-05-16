"use client";

import { useState } from "react";

import { calendarApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Calendar } from "@/registry/calendar";

const usageCode = `"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function CalendarPreview() {
  const [selected, setSelected] = useState<Date>(new Date());

  return (
    <Calendar
      defaultMonth={selected}
      disabled={(date) => date < new Date("2020-01-01")}
      onSelect={setSelected}
      selected={selected}
      size="sm"
    />
  );
}`;

function CalendarPreview() {
  const [selected, setSelected] = useState<Date>(new Date());

  return (
    <div className="flex w-full justify-center">
      <Calendar
        defaultMonth={selected}
        disabled={(date) => date < new Date("2020-01-01")}
        onSelect={setSelected}
        selected={selected}
        size="sm"
      />
    </div>
  );
}

export default function CalendarPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Calendar" },
      ]}
      componentName="calendar"
      description="Compact calendar card with animated month transitions, inline day selection, and a built-in selected-date summary."
      details={calendarApiDetails}
      preview={<CalendarPreview />}
      previewDescription="Move between months, choose a day, and test the controlled selected/onSelect API while keeping the same card visuals and transitions."
      title="Calendar"
      usageCode={usageCode}
      usageDescription="Use controlled or uncontrolled props depending on your form flow. The visual shell and animation behavior stay the same either way."
    />
  );
}
