"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { switchApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import { switch as Switch } from "@/registry/switch";

const usageCode = `import { switch as Switch } from "@/components/ui/switch";
import { useState } from "react";

export function PressingToggle() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between gap-4 max-w-xs">
      <span className="text-sm text-muted-foreground">High press</span>
      <Switch size="lg" checked={on} onCheckedChange={setOn} />
    </div>
  );
}`;

const componentDetailsItems = switchApiDetails;

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

function SwitchPreview() {
  const [on, setOn] = useState(true);

  return (
    <div className="flex flex-col items-center gap-6 px-2 py-4">
      <Switch checked={on} onCheckedChange={setOn} size="sm" />
      <p className="max-w-md text-center font-sans text-[13px] leading-relaxed">
        <span className="text-emerald-600 dark:text-emerald-400">
          Flip the line
        </span>
        <span className="text-neutral-400 dark:text-neutral-500"> · </span>
        <span className="text-sky-600 dark:text-sky-400">
          Spring carries the thumb
        </span>
        <span className="text-neutral-400 dark:text-neutral-500"> · </span>
        <span className="text-violet-600 dark:text-violet-400">
          Track eases to green
        </span>
      </p>
    </div>
  );
}

export default function SwitchPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Switch" },
      ]}
      componentName="switch"
      description="Compact toggle with a spring thumb and immediate on and off feedback. Designed for settings rows, filters, and inline controls."
      details={componentDetailsItems}
      preview={<SwitchPreview />}
      title="Switch"
      usageCode={usageCode}
      usageDescription="The switch is easiest to read in a controlled flow. Start with the snippet below, then expand into state handling, sizes, and motion behavior in the API panel."
    />
  );
}
