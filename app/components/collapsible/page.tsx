"use client";

import { ChevronRight, ChevronsUpDown, CreditCard } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { RegistryInstallBlock } from "@/components/registry-install-block";
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

type DetailRow = {
  id: string;
  title: string;
  content: string;
  registryPath?: string;
};

const componentDetailsItems: DetailRow[] = [
  {
    id: "collapsible",
    title: "Collapsible",
    content:
      'Root component. Accepts open and onOpenChange for controlled state, or works uncontrolled. Renders a Radix CollapsiblePrimitive.Root with a data-slot="collapsible" attribute.',
  },
  {
    id: "collapsibletrigger",
    title: "CollapsibleTrigger",
    content:
      'Button that toggles the open state. Receives data-state="open" or data-state="closed" so you can target it with Tailwind variants for icon rotation or color changes.',
  },
  {
    id: "collapsiblecontent",
    title: "CollapsibleContent",
    content:
      "Conditionally rendered content area. Radix handles mount/unmount and adds data-state for CSS-based height animations. Use animate-collapsible-down / animate-collapsible-up from your globals.",
  },
  {
    id: "radix-ui",
    title: "radix-ui",
    content:
      "Peer dependency that provides accessible open/close state management, keyboard navigation, and ARIA attributes. The shadcn CLI adds it automatically.",
  },
  {
    id: "registry",
    title: "shadcn registry",
    content: "Only peer dependency is radix-ui.",
    registryPath: "collapsible.json",
  },
];

const BILLING_ROWS: { label: string; value: string }[] = [
  { label: "Next billing", value: "May 1, 2026" },
  { label: "Payment method", value: "Visa ••••4242" },
  { label: "Seats used", value: "5 of 10" },
];

function SectionLabel({
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

const bentoContainer = {
  hidden: {},
  visible: { transition: { delayChildren: 0.06, staggerChildren: 0.07 } },
};
const bentoItem = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};
const bentoContainerStatic = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 0 } },
};
const bentoItemStatic = {
  hidden: { opacity: 1, scale: 1, y: 0 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function BentoMotion({
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
    <div className="w-full max-w-sm">
      <Collapsible onOpenChange={setOpen} open={open}>
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white">
              <CreditCard className="size-3.5 text-white dark:text-neutral-900" />
            </span>
            <span className="font-semibold text-base text-neutral-900 dark:text-white">
              Pro Plan
            </span>
          </div>
          <CollapsibleTrigger className="flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300">
            <ChevronsUpDown className="size-4" />
          </CollapsibleTrigger>
        </div>

        {/* Always-visible summary row */}
        <div className="rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-sm dark:text-neutral-500">
              Monthly cost
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 text-sm dark:text-white">
                $29 / mo
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible billing details */}
        <CollapsibleContent className="mt-2 flex flex-col gap-2">
          {BILLING_ROWS.map((row) => (
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
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  return (
    <main className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        {/* Breadcrumb */}
        <motion.nav
          animate={{ opacity: 1, y: 0 }}
          aria-label="Breadcrumb"
          className="mb-8"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 380, damping: 35 }
          }
        >
          <ol className="flex flex-wrap items-center gap-1.5 font-sans text-neutral-400 text-xs dark:text-neutral-500">
            <li>
              <Link
                className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                href="/"
              >
                Docs
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3 opacity-60" />
            </li>
            <li>
              <Link
                className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                href="/components/collapsible"
              >
                Components
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3 opacity-60" />
            </li>
            <li
              aria-current="page"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Collapsible
            </li>
          </ol>
        </motion.nav>

        {/* Header */}
        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-2xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 340, damping: 34, delay: 0.05 }
          }
        >
          <h1 className="font-sans font-semibold text-3xl text-neutral-900 tracking-tight sm:text-[2rem] dark:text-white">
            Collapsible
          </h1>
          <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
            Accessible expand/collapse primitive built on Radix UI. Exports
            three composable parts — Collapsible, CollapsibleTrigger, and
            CollapsibleContent — for building FAQs, disclosure sections, and
            nested navigation.
          </p>
        </motion.header>

        <motion.div
          animate="visible"
          className={cn(
            "grid auto-rows-min grid-cols-1 gap-3 sm:gap-4",
            "lg:grid-cols-12 lg:gap-x-5 lg:gap-y-5"
          )}
          initial="hidden"
          variants={containerVariants}
        >
          {/* Live preview */}
          <BentoMotion
            className={cn(
              "relative overflow-hidden lg:col-span-8 lg:row-span-2",
              "rounded-3xl border-neutral-200/40 dark:border-neutral-700/30"
            )}
            variants={itemVariants}
          >
            <SectionLabel accent="01">Live preview</SectionLabel>
            <div className="flex flex-1 items-start justify-center py-4">
              <BillingCardDemo />
            </div>
          </BentoMotion>

          {/* Install */}
          <BentoMotion
            className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="02">Install</SectionLabel>
            <div className="min-w-0 flex-1 [&>div]:mt-0">
              <CodeBlockInstall componentName="collapsible" />
            </div>
          </BentoMotion>

          {/* v0 */}
          <BentoMotion
            className="border-neutral-200/90 border-dashed lg:col-span-4 lg:col-start-9 lg:row-start-2 dark:border-neutral-700/80"
            variants={itemVariants}
          >
            <SectionLabel accent="03">v0</SectionLabel>
            <p className="mb-5 flex-1 font-sans text-neutral-500 text-sm leading-snug dark:text-neutral-400">
              Send the registry bundle to v0 to scaffold FAQ sections, navs, or
              custom disclosure patterns with prompts.
            </p>
            <ComponentActions name="collapsible" />
          </BentoMotion>

          {/* Usage */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="04">Usage</SectionLabel>
            <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
              Import the three composable parts and wire them together. The
              chevron rotation uses the{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                data-state
              </code>{" "}
              attribute that Radix sets on the trigger.
            </p>
            <CodeBlock code={usageCode} language="tsx" variant="embedded" />
          </BentoMotion>

          {/* API / Dependencies */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-4 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="05">API &amp; dependencies</SectionLabel>
            <p className="mb-3 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
              Three named exports:{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                Collapsible
              </code>
              ,{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                CollapsibleTrigger
              </code>
              ,{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                CollapsibleContent
              </code>
              .
            </p>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {componentDetailsItems.map((row) => (
                <div
                  className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-8 sm:py-4"
                  key={row.id}
                >
                  <p className="pt-0.5 font-medium text-neutral-800 text-xs dark:text-neutral-200">
                    {row.title}
                  </p>
                  <div>
                    <p className="font-sans text-[13px] text-neutral-500 leading-relaxed dark:text-neutral-400">
                      {row.content}
                    </p>
                    {row.registryPath ? (
                      <RegistryInstallBlock registryPath={row.registryPath} />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </BentoMotion>
        </motion.div>
      </div>
    </main>
  );
}
