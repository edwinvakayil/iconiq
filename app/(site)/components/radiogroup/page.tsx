"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode, useState } from "react";

import { radioGroupApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { usageToV0Page } from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";
import RadioGroup from "@/registry/radiogroup";

const demoOptions = [
  {
    value: "standard",
    label: "Standard delivery",
    description: "Tracked parcel in three to five business days.",
  },
  {
    value: "express",
    label: "Express",
    description: "Handoff next business day where available.",
  },
  {
    value: "pickup",
    label: "Pickup point",
    description: "Collect when convenient — no doorstep drop.",
  },
];

const usageCode = `"use client";

import { useState } from "react";
import RadioGroup from "@/components/ui/radiogroup";

const options = [
  {
    value: "standard",
    label: "Standard delivery",
    description: "Tracked parcel in three to five business days.",
  },
  {
    value: "express",
    label: "Express",
    description: "Handoff next business day where available.",
  },
  {
    value: "pickup",
    label: "Pickup point",
    description: "Collect when convenient — no doorstep drop.",
  },
];

export function RadioGroupPreview() {
  const [value, setValue] = useState("standard");

  return (
    <RadioGroup
      aria-label="Delivery options"
      className="max-w-md"
      onChange={setValue}
      options={options}
      value={value}
    />
  );
}`;

const componentDetailsItems = radioGroupApiDetails;

function _SectionLabel({
  children,
  accent,
}: {
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {accent ? (
        <span
          aria-hidden
          className="font-mono text-[10px] text-neutral-300 tabular-nums dark:text-neutral-600"
        >
          {accent}
        </span>
      ) : null}
      <p className="font-medium text-[10px] text-neutral-400 uppercase tracking-[0.18em] dark:text-neutral-500">
        {children}
      </p>
      <span className="h-px min-w-6 flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-700" />
    </div>
  );
}

const bentoShell =
  "flex flex-col rounded-lg border border-neutral-200/80 bg-white px-3 py-4 sm:px-5 sm:py-5 md:p-6 dark:border-neutral-800 dark:bg-neutral-950";

const _bentoContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.06, staggerChildren: 0.07 },
  },
};

const _bentoItem = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

const _bentoContainerStatic = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 0 } },
};

const _bentoItemStatic = {
  hidden: { opacity: 1, scale: 1, y: 0 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function _BentoMotion({
  children,
  className,
  variants,
}: {
  children: ReactNode;
  className?: string;
  variants: Variants;
}) {
  return (
    <motion.div className={cn(bentoShell, className)} variants={variants}>
      {children}
    </motion.div>
  );
}

export default function RadioGroupPage() {
  const [value, setValue] = useState("standard");
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Radio Group" },
      ]}
      componentName="radiogroup"
      description="Single-select list with a sliding highlight, spring radio control, and optional descriptions. Built to stay sharp in pricing tables, settings, and onboarding flows."
      details={componentDetailsItems}
      preview={
        <div className="flex min-h-[320px] items-center justify-center">
          <RadioGroup
            aria-label="Delivery options"
            className="max-w-md"
            onChange={setValue}
            options={demoOptions}
            value={value}
          />
        </div>
      }
      title="Radio Group"
      usageCode={usageCode}
      usageDescription="Import the default export and control it from state. The API details below cover the option contract, controlled state, and accessibility notes."
      v0PageCode={usageToV0Page(usageCode)}
    />
  );
}
