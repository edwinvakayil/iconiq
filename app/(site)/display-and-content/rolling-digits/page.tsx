"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { RollingDigitsPlaygroundProvider } from "@/app/(site)/display-and-content/rolling-digits/_components/rolling-digits-playground";
import { rollingDigitsApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { rollingDigitsPreviewCode } from "@/lib/component-v0-pages";
import * as RollingDigitsModule from "@/registry/rolling-digits";

const usageCode = `"use client";

import { useEffect, useState } from "react";
import { RollingDigits } from "@/components/ui/rolling-digits";

export function RollingDigitsPreview() {
  const [days, setDays] = useState(12);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDays((current) => (current <= 0 ? 12 : current - 1));
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-balance text-center font-medium text-lg leading-snug dark:text-neutral-100">
      <span>Early access opens in</span>
      <span className="inline-flex translate-y-px items-center align-middle">
        <RollingDigits value={days} pad={2} startOnView={false} />
      </span>
      <span>days.</span>
    </div>
  );
}`;

const rollingDigitsExamples: VariantItem[] = [
  {
    title: "Currency",
    code: `"use client";

import { RollingDigits } from "@/components/ui/rolling-digits";

export function RollingDigitsCurrency() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-lg dark:text-neutral-100">
      <span>Revenue is now</span>
      <RollingDigits
        format={(value) =>
          value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          })
        }
        startOnView={false}
        value={1250}
      />
    </p>
  );
}`,
  },
  {
    title: "Stats",
    code: `"use client";

import { RollingDigits } from "@/components/ui/rolling-digits";

export function RollingDigitsStats() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-lg dark:text-neutral-100">
      <span>We crossed</span>
      <RollingDigits coalesceUpdates locale startOnView={false} value={1000000} />
      <span>users.</span>
    </p>
  );
}`,
  },
  {
    title: "Clock",
    code: `"use client";

import { useEffect, useState } from "react";
import { RollingDigits } from "@/components/ui/rolling-digits";

export function RollingDigitsClock() {
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => (current + 1) % 100);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-lg dark:text-neutral-100">
      <span>Elapsed</span>
      <RollingDigits pad={2} startOnView={false} value={seconds} />
      <span>seconds.</span>
    </p>
  );
}`,
  },
  {
    title: "Large jump",
    code: `"use client";

import { useState } from "react";
import { RollingDigits } from "@/components/ui/rolling-digits";

export function RollingDigitsLargeJump() {
  const [value, setValue] = useState(99);

  return (
    <div className="flex flex-col items-center gap-4 text-lg dark:text-neutral-100">
      <p className="flex flex-wrap items-center justify-center gap-x-1.5">
        <span>Score</span>
        <RollingDigits locale startOnView={false} value={value} />
      </p>
      <button
        className="rounded-full border px-4 py-2 text-sm"
        onClick={() => setValue((current) => (current === 99 ? 1000000 : 99))}
        type="button"
      >
        Toggle 99 / 1,000,000
      </button>
    </div>
  );
}`,
  },
];

export default function RollingDigitsPage() {
  return (
    <RollingDigitsPlaygroundProvider
      importPath="@/components/ui/rolling-digits"
      RollingDigitsModule={RollingDigitsModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Rolling Digits" },
          ]}
          componentName="rolling-digits"
          description="Spring-animated digit counter with transform, opacity, and vertical motion."
          details={rollingDigitsApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/rolling-digits/page.tsx`}
          examples={rollingDigitsExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="rolling-digits"
          pageUrl="/display-and-content/rolling-digits"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewCode={rollingDigitsPreviewCode}
          previewDescription="Use the playground to switch countdown, currency, stats, clock, and manual value patterns, plus locale, padding, direction, queue delay, and accessibility options."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Rolling Digits"
          railNotes={[
            "Use `pad` for fixed-width countdown digits and `locale` for grouped thousands.",
            "Pass a `format` callback for currency, units, or compact notation.",
            "Enable `coalesceUpdates` for live stats that should jump to the latest value.",
            "Layer symbols such as `%` or `$` beside the component, or include them through `format`.",
            "The visual layer is `aria-hidden`; screen readers receive updates through the `sr-only` layer.",
          ]}
          title="Rolling Digits"
          usageCode={usageCode}
          usageDescription="Pass the target number as `value`, use `pad` for fixed-width countdown digits, and update the value from your own timer or interval."
          v0PageCode={usageCode}
        />
      )}
    </RollingDigitsPlaygroundProvider>
  );
}
