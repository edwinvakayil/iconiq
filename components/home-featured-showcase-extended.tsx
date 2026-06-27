"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { InlinePreviewSelect } from "@/app/(site)/components/_components/inline-preview-select";
import {
  CheckboxGroup,
  type CheckboxGroupOption,
} from "@/registry/b-checkbox-group";
import { Badge } from "@/registry/badge";
import { Calendar } from "@/registry/calendar";
import { RadioGroup, type RadioOption } from "@/registry/r-radio-group";
import { RollingDigits } from "@/registry/rolling-digits";
import { Slider } from "@/registry/slider";
import { Switch } from "@/registry/switch";
import { Timezone } from "@/registry/timezone";

const timezoneZoneOptions = [
  { value: "San Francisco", label: "San Francisco" },
  { value: "New York", label: "New York" },
  { value: "London", label: "London" },
  { value: "India", label: "India" },
  { value: "Tokyo", label: "Tokyo" },
  { value: "Sydney", label: "Sydney" },
] as const;

type HomeTimezoneZone = (typeof timezoneZoneOptions)[number]["value"];

function ShowcaseCard({
  title,
  href,
  className,
  children,
}: {
  title: string;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={`flex flex-col rounded-[22px] border border-border/70 bg-muted/32 p-5 text-left sm:p-6 ${className ?? ""}`}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl px-4 py-6">
        {children}
      </div>

      <div className="mt-4 min-w-0">
        <Link
          className="inline-block font-medium text-[1.05rem] text-foreground tracking-[-0.04em] decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:underline hover:decoration-foreground"
          href={href}
        >
          {title}
        </Link>
      </div>
    </article>
  );
}

function HomeRollingDigitsShowcase() {
  const [days, setDays] = useState(12);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDays((current) => (current <= 0 ? 12 : current - 1));
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[150px] w-full items-center justify-center px-4">
      <div className="flex max-w-sm flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-balance text-center font-medium text-foreground text-lg leading-snug tracking-tight">
        <span>Early access opens in</span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <RollingDigits pad={2} startOnView={false} value={days} />
        </span>
        <span>days.</span>
      </div>
    </div>
  );
}

function HomeTimezoneShowcase() {
  const [zone, setZone] = useState<HomeTimezoneZone>("San Francisco");

  return (
    <div className="flex min-h-[150px] w-full items-center justify-center px-4">
      <div className="flex max-w-2xl flex-wrap items-baseline justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-foreground text-sm leading-snug tracking-tight sm:text-base">
        <span>Right now in</span>
        <InlinePreviewSelect
          ariaLabel="Timezone city"
          menuKey="home-timezone-zone-menu"
          onChange={setZone}
          options={timezoneZoneOptions}
          value={zone}
        />
        <span>it is</span>
        <Timezone live zone={zone} />
        <span>for the distributed team.</span>
      </div>
    </div>
  );
}

export function HomeFeaturedShowcaseExtended({
  selectedRadio,
  onRadioChange,
  selectedCheckboxes,
  onCheckboxChange,
  radioOptions,
  checkboxOptions,
}: {
  selectedRadio: string;
  onRadioChange: (value: string) => void;
  selectedCheckboxes: string[];
  onCheckboxChange: (value: string[]) => void;
  radioOptions: RadioOption[];
  checkboxOptions: CheckboxGroupOption[];
}) {
  return (
    <>
      <ShowcaseCard
        className="lg:col-span-4"
        href="/display-and-content/calendar"
        title="Calendar"
      >
        <div className="flex w-full justify-center">
          <Calendar
            defaultMonth={new Date("2026-05-10")}
            defaultSelected={new Date("2026-05-10")}
          />
        </div>
      </ShowcaseCard>

      <div className="grid gap-4 lg:col-span-8 lg:grid-cols-2">
        <ShowcaseCard
          href="/display-and-content/rolling-digits"
          title="Rolling Digits"
        >
          <HomeRollingDigitsShowcase />
        </ShowcaseCard>

        <ShowcaseCard href="/display-and-content/badge" title="Badge">
          <div className="flex min-h-[150px] w-full items-center justify-center px-4">
            <Badge color="indigo">Early Access</Badge>
          </div>
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-2"
          href="/display-and-content/timezone"
          title="Timezone"
        >
          <HomeTimezoneShowcase />
        </ShowcaseCard>
      </div>

      <ShowcaseCard
        className="lg:col-span-6"
        href="/inputs-and-forms/switch"
        title="Switch"
      >
        <div className="w-full max-w-[320px] space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[14px] text-foreground tracking-[-0.02em]">
              Motion
            </p>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[14px] text-foreground tracking-[-0.02em]">
              Previews
            </p>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[14px] text-foreground tracking-[-0.02em]">
              Reduced UI
            </p>
            <Switch />
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        className="lg:col-span-6"
        href="/inputs-and-forms/slider"
        title="Slider"
      >
        <div className="w-full max-w-[320px] space-y-4">
          <Slider defaultValue={42} label="Volume" />
          <Slider defaultValue={68} label="Brightness" />
          <Slider defaultValue={55} label="Opacity" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        className="lg:col-span-6"
        href="/inputs-and-forms/radio-group"
        title="Radio Group"
      >
        <div className="w-full max-w-md">
          <RadioGroup
            aria-label="Install workflow"
            className="w-full"
            onChange={onRadioChange}
            options={radioOptions}
            value={selectedRadio}
          />
        </div>
      </ShowcaseCard>

      <ShowcaseCard
        className="lg:col-span-6"
        href="/inputs-and-forms/checkbox-group"
        title="Checkbox Group"
      >
        <div className="w-full max-w-md">
          <CheckboxGroup
            className="w-full"
            onChange={onCheckboxChange}
            options={checkboxOptions}
            value={selectedCheckboxes}
          />
        </div>
      </ShowcaseCard>
    </>
  );
}
