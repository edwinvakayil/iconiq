"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/registry/badge";
import { Button } from "@/registry/button";
import { Calendar } from "@/registry/calendar";
import {
  CheckboxGroup,
  type CheckboxGroupOption,
} from "@/registry/b-checkbox-group";
import { RadioGroup, type RadioOption } from "@/registry/r-radio-group";
import { Slider } from "@/registry/slider";
import { Switch } from "@/registry/switch";
import { Tooltip } from "@/registry/tooltip";

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
        href="/components/calendar"
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
        <ShowcaseCard href="/components/tooltip" title="Tooltip">
          <div className="flex min-h-[150px] w-full items-center justify-center px-4">
            <p className="max-w-sm text-center font-sans text-[15px] text-foreground leading-relaxed">
              Hover the{" "}
              <Tooltip
                content="Quick context on hover."
                delay={0.12}
                side="top"
              >
                <button
                  className="rounded-lg px-0.5 font-medium text-sky-700 underline decoration-sky-500/40 decoration-dotted underline-offset-[5px] transition-colors hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
                  type="button"
                >
                  trigger
                </button>
              </Tooltip>{" "}
              to preview the floating label.
            </p>
          </div>
        </ShowcaseCard>

        <ShowcaseCard href="/components/badge" title="Badge">
          <div className="flex min-h-[150px] w-full items-center justify-center px-4">
            <Badge color="indigo">Early Access</Badge>
          </div>
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-2"
          href="/components/button"
          title="Button"
        >
          <div className="flex w-full max-w-[360px] flex-wrap items-center justify-center gap-2.5">
            <Button size="sm">Default</Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="ghost">
              Ghost
            </Button>
          </div>
        </ShowcaseCard>
      </div>

      <ShowcaseCard
        className="lg:col-span-6"
        href="/components/switch"
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
        href="/components/slider"
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
        href="/components/radio-group"
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
        href="/components/checkbox-group"
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
