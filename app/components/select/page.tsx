"use client";

import { Orbit, Sparkles, Telescope } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { type ReactNode, useState } from "react";

import { selectApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import { select as Select } from "@/registry/select";

const demoOptions = [
  {
    value: "scout",
    label: "Scout pass",
    icon: <Sparkles className="size-4" />,
  },
  {
    value: "transit",
    label: "Transit window",
    icon: <Orbit className="size-4" />,
  },
  {
    value: "deep",
    label: "Deep field",
    icon: <Telescope className="size-4" />,
  },
];

const usageCode = `import { Orbit, Sparkles, Telescope } from "lucide-react";
import { select as Select } from "@/components/ui/select";

const options = [
  { value: "scout", label: "Scout pass", icon: <Sparkles className="size-4" /> },
  { value: "transit", label: "Transit window", icon: <Orbit className="size-4" /> },
  { value: "deep", label: "Deep field", icon: <Telescope className="size-4" /> },
];

export function MissionSelect() {
  const [value, setValue] = useState<string | undefined>("scout");
  return (
    <Select
      onChange={setValue}
      options={options}
      placeholder="Plot the trajectory…"
      value={value}
    />
  );
}`;

const componentDetailsItems = selectApiDetails;

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
  "flex flex-col rounded-2xl border border-neutral-200/80 bg-white px-3 py-4 sm:px-5 sm:py-5 md:p-6 dark:border-neutral-800 dark:bg-neutral-950";

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

export default function SelectPage() {
  const [value, setValue] = useState<string | undefined>("scout");
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Select" },
      ]}
      componentName="select"
      description="Animated single-select dropdown with staggered options, chevron rotation, and a check on the active row. Built to feel quick without becoming flashy."
      details={componentDetailsItems}
      preview={
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-6">
          <Select
            onChange={(next) => setValue(next)}
            options={demoOptions}
            placeholder="Plot the trajectory..."
            value={value}
          />
          <p className="max-w-md text-center text-[14px] text-secondary leading-6">
            Open the dropdown, scan the options, commit a single choice. The
            motion is there to help orientation, not compete for attention.
          </p>
        </div>
      }
      title="Select"
      usageCode={usageCode}
      usageDescription="Alias the lowercase export to `Select` in your app, then use the details below to tune options, icons, placeholders, and selection behavior."
    />
  );
}
