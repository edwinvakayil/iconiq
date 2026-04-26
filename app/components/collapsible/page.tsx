"use client";

import { ChevronsUpDown, Trophy } from "lucide-react";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { collapsibleApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/collapsible";

const usageCode = `import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

// CollapsibleContent animates height + opacity automatically via
// Framer Motion spring physics. No extra setup needed.
export function BillingCard() {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-base">Pro Plan</span>
        <CollapsibleTrigger className="flex size-8 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200">
          <ChevronsUpDown className="size-4 text-neutral-500" />
        </CollapsibleTrigger>
      </div>

      {/* Always visible */}
      <div className="rounded-xl border px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Monthly cost</span>
          <span className="font-semibold text-sm">$29 / mo</span>
        </div>
      </div>

      {/* Animated collapsible details */}
      <CollapsibleContent className="mt-2 flex flex-col gap-2">
        <div className="rounded-xl border px-4 py-3">
          <p className="text-muted-foreground text-xs">Next billing</p>
          <p className="mt-0.5 font-semibold text-sm">May 1, 2026</p>
        </div>
        <div className="rounded-xl border px-4 py-3">
          <p className="text-muted-foreground text-xs">Payment method</p>
          <p className="mt-0.5 font-semibold text-sm">Visa ••••4242</p>
        </div>
        <div className="rounded-xl border px-4 py-3">
          <p className="text-muted-foreground text-xs">Seats used</p>
          <p className="mt-0.5 font-semibold text-sm">5 of 10</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}`;

const componentDetailsItems = collapsibleApiDetails;

const MATCH_DETAIL_ROWS: { label: string; value: string }[] = [
  { label: "Midfield", value: "Press, recycle, stay compact." },
  { label: "Last line", value: "One ball behind the line." },
  { label: "Keyboard", value: "Tab in — same note." },
];

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
  visible: { transition: { delayChildren: 0.06, staggerChildren: 0.07 } },
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

function BillingCardDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="w-full">
      <Collapsible onOpenChange={setOpen} open={open}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white">
              <Trophy className="size-3.5 text-white dark:text-neutral-900" />
            </span>
            <span className="font-semibold text-base text-neutral-900 dark:text-white">
              Match sheet
            </span>
          </div>
          <CollapsibleTrigger className="flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300">
            <ChevronsUpDown className="size-4" />
          </CollapsibleTrigger>
        </div>

        <div className="rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <div className="flex items-center justify-between gap-2">
            <span className="text-neutral-400 text-sm dark:text-neutral-500">
              Phase
            </span>
            <div className="flex items-center gap-2">
              <span className="text-right font-semibold text-neutral-900 text-sm dark:text-white">
                Build-up → Break
              </span>
              <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Live
              </span>
            </div>
          </div>
        </div>

        <CollapsibleContent className="mt-2 flex flex-col gap-2">
          {MATCH_DETAIL_ROWS.map((row) => (
            <div
              className="rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-700"
              key={row.label}
            >
              <p className="font-medium text-neutral-400 text-xs dark:text-neutral-500">
                {row.label}
              </p>
              <p className="mt-0.5 font-semibold text-neutral-900 text-sm dark:text-white">
                {row.value}
              </p>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default function CollapsiblePage() {
  return (
    <ComponentDocsPage
      actionDescription="Send the registry bundle to v0 when you want to scaffold FAQ sections, navigation groups, or custom disclosure patterns."
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Collapsible" },
      ]}
      componentName="collapsible"
      description="Accessible expand and collapse primitive built on Radix UI. Exports three composable parts for FAQs, disclosure sections, and nested navigation."
      details={componentDetailsItems}
      preview={
        <div className="flex min-h-[320px] w-full items-start justify-center py-4">
          <BillingCardDemo />
        </div>
      }
      title="Collapsible"
      usageCode={usageCode}
      usageDescription="Import the three composable parts and wire them together. The API details below cover root state, trigger composition, and content behavior."
    />
  );
}
