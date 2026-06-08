"use client";

import { useMemo, useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { datePickerApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { DatePicker } from "@/registry/date-picker";

const previewSentenceClassName =
  "text-balance text-center text-[15px] text-muted-foreground leading-relaxed sm:text-base";

const previewContentClassName =
  "flex w-full flex-col items-center gap-4 text-center";

const usageCode = `"use client";

import { useState } from "react";

import { DatePicker } from "@/components/ui/date-picker";

export function DatePickerPreview() {
  const [value, setValue] = useState<Date | undefined>(new Date());

  return (
    <div className="flex w-full items-center justify-center px-4 py-10">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <DatePicker value={value} onChange={setValue} />
        <p className="text-balance text-center text-[15px] text-muted-foreground leading-relaxed sm:text-base">
          Open the trigger to pick a date from the shared Calendar panel.
        </p>
      </div>
    </div>
  );
}`;

function DatePickerPreview() {
  const [value, setValue] = useState<Date | undefined>(new Date());

  return (
    <div className="flex w-full items-center justify-center px-4 py-10">
      <div className={previewContentClassName}>
        <DatePicker onChange={setValue} value={value} />
        <p className={previewSentenceClassName}>
          Open the trigger to pick a date from the shared Calendar panel.
        </p>
      </div>
    </div>
  );
}

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Display & Content" },
  { label: "Date Picker" },
];

function getDetails(): DetailItem[] {
  return datePickerApiDetails.map((item) => {
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
}

export default function DatePickerPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="date-picker"
      description="Collapsible date field with the shared Calendar panel and spring open motion."
      details={details}
      detailsDescription="Wrap forms with a trigger button and expandable Calendar panel. Selection, visible month, and close-on-pick behavior stay in sync through controlled or uncontrolled props."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/date-picker/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      itemSlug="date-picker"
      pageUrl="/display-and-content/date-picker"
      preview={<DatePickerPreview />}
      previewClassName="min-h-[28rem] overflow-visible"
      previewDescription="The trigger shows the formatted date while the embedded Calendar keeps the same month/year pickers, day grid, and selection motion."
      title="Date Picker"
      usageCode={usageCode}
      usageDescription={
        "Use `value` and `onChange` for controlled forms, or omit `value` for internal selection state. Pass `calendarProps` to forward size, locale, disabled-day rules, and other Calendar options except month and selection handlers."
      }
    />
  );
}
