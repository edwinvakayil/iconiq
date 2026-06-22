"use client";

import { useEffect, useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { rollingDigitsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { rollingDigitsPreviewCode } from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";
import { RollingDigits } from "@/registry/rolling-digits";

const COUNTDOWN_START = 12;

const previewSentenceClassName =
  "flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-balance text-center font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const tickerWrapClassName =
  "inline-flex translate-y-px items-center align-middle";

const previewTickerProps = {
  pad: 2,
  startOnView: false,
} as const;

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
      <span aria-hidden className="inline-flex translate-y-px items-center align-middle">
        <RollingDigits value={days} pad={2} startOnView={false} />
      </span>
      <span>days.</span>
    </div>
  );
}`;

function RollingDigitsPreview() {
  const [days, setDays] = useState(COUNTDOWN_START);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDays((current) => (current <= 0 ? COUNTDOWN_START : current - 1));
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[260px] items-center justify-center px-4 py-8">
      <div className={cn(previewSentenceClassName)}>
        <span>Early access opens in</span>
        <span aria-hidden className={tickerWrapClassName}>
          <RollingDigits value={days} {...previewTickerProps} />
        </span>
        <span>days.</span>
      </div>
    </div>
  );
}

export default function RollingDigitsPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Display & Content" },
        { label: "Rolling Digits" },
      ]}
      componentName="rolling-digits"
      description="Spring-animated digit counter with blur and scale."
      details={rollingDigitsApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/rolling-digits/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/rolling-digits"
      preview={<RollingDigitsPreview />}
      previewCode={rollingDigitsPreviewCode}
      previewDescription="A live countdown inline in one short sentence, resetting when it reaches zero."
      title="Rolling Digits"
      usageCode={usageCode}
      usageDescription="Pass the target number as `value`, use `pad` for fixed-width countdown digits, and update the value from your own timer or interval."
    />
  );
}
