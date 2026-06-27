"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { DatePickerPlaygroundProvider } from "@/app/(site)/display-and-content/date-picker/_components/date-picker-playground";
import { datePickerApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as DatePickerModule from "@/registry/date-picker";

const usageCode = `"use client";

import { useState } from "react";

import { DatePicker } from "@/components/ui/date-picker";

export function DatePickerPreview() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <DatePicker onChange={setValue} value={value} />
  );
}`;

const datePickerExamples: VariantItem[] = [
  {
    title: "Date bounds",
    code: `"use client";

import { addDays, isWeekend, startOfDay } from "date-fns";
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

export function DatePickerBounds() {
  const [value, setValue] = useState<Date | null>(null);
  const today = startOfDay(new Date());

  return (
    <DatePicker
      calendarProps={{
        disabled: (date) => isWeekend(date),
        maxDate: addDays(today, 30),
        minDate: today,
      }}
      onChange={setValue}
      value={value}
    />
  );
}`,
  },
  {
    title: "Clearable controlled field",
    code: `"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

export function DatePickerClearable() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <DatePicker clearable onChange={setValue} value={value} />
  );
}`,
  },
  {
    title: "Controlled open state",
    code: `"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

export function DatePickerControlledOpen() {
  const [value, setValue] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <DatePicker
      onChange={setValue}
      onOpenChange={setOpen}
      open={open}
      value={value}
    />
  );
}`,
  },
  {
    title: "Localized trigger label",
    code: `"use client";

import { fr } from "date-fns/locale";
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

export function DatePickerLocale() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <DatePicker
      calendarProps={{ locale: fr }}
      dateFormat="EEEE d MMMM yyyy"
      onChange={setValue}
      value={value}
    />
  );
}`,
  },
];

const details = datePickerApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: motion, lucide-react, date-fns.",
      "Registry dependency: calendar. Install date-picker together with the shared Calendar component.",
      "The generated registry file is /r/date-picker.json.",
    ],
    registryPath: "date-picker.json",
  };
});

export default function DatePickerPage() {
  return (
    <DatePickerPlaygroundProvider
      DatePickerModule={DatePickerModule}
      importPath="@/components/ui/date-picker"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Date Picker" },
          ]}
          componentName="date-picker"
          description="Collapsible date field with a portaled Calendar panel, locale-aware trigger formatting, and spring open motion."
          details={details}
          detailsDescription="Wrap forms with a trigger button and expandable Calendar panel. Selection, visible month, close-on-pick behavior, and open state stay in sync through controlled or uncontrolled props."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/date-picker/page.tsx`}
          examples={datePickerExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="date-picker"
          pageUrl="/display-and-content/date-picker"
          preview={preview}
          previewClassName="min-h-[28rem] overflow-visible"
          previewDescription="Use the playground to switch size, locale, bounds, clearable mode, and controlled open state."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Date Picker"
          railNotes={[
            "Use DatePicker for compact forms that open the shared Calendar from a trigger.",
            "Pass `calendarProps` for bounds, disabled days, modifiers, and locale labels.",
            "Set `clearable` when users need to reset a controlled value to null.",
            "Install the calendar registry entry before date-picker in consumer apps.",
          ]}
          title="Date Picker"
          usageCode={usageCode}
          usageDescription="Use `value` and `onChange` for controlled forms, `defaultValue` for uncontrolled usage, and `calendarProps` for Calendar options. Control panel visibility with `open` and `onOpenChange` when needed."
          v0PageCode={usageCode}
        />
      )}
    </DatePickerPlaygroundProvider>
  );
}
