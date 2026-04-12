"use client";

import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { SidebarNav } from "@/components/sidebar-nav";
import { cn } from "@/lib/utils";
import {
  CheckboxGroup,
  type CheckboxGroupOption,
} from "@/registry/checkbox-group";

const demoOptions: CheckboxGroupOption[] = [
  {
    label: "Email notifications",
    value: "email",
    description: "Product updates and tips in your inbox",
  },
  {
    label: "SMS alerts",
    value: "sms",
    description: "Urgent messages only",
  },
  {
    label: "Push (coming soon)",
    value: "push",
    description: "Disabled row example",
    disabled: true,
  },
];

const usageCode = `import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { useState } from "react";

const options = [
  { label: "Email", value: "email", description: "Optional helper text" },
  { label: "SMS", value: "sms" },
];

export function Preferences() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <CheckboxGroup onChange={setValue} options={options} value={value} />
  );
}`;

type DetailRow = { id: string; title: string; content: string };

const componentDetailsItems: DetailRow[] = [
  {
    id: "options",
    title: "options (required)",
    content:
      "Array of CheckboxGroupOption: label (visible title), value (stable id used in the controlled array), optional description (muted subline), optional disabled (skips toggle, dims row).",
  },
  {
    id: "value",
    title: "value (optional)",
    content:
      "Controlled selected values as string[]. Defaults to []. Each entry should match an option value.",
  },
  {
    id: "onChange",
    title: "onChange (optional)",
    content:
      "Called with the next string[] when a row is toggled. Use with value for controlled usage; omit both for static display only.",
  },
  {
    id: "className",
    title: "className (optional)",
    content:
      "Forwarded to the root flex column wrapper for spacing or max-width in your form layout.",
  },
  {
    id: "framer-motion",
    title: "framer-motion",
    content:
      "motion.button rows with hover background; AnimatePresence for check/uncheck crossfade; checked state shows only a primary-colored tick (no filled box).",
  },
  {
    id: "lucide-react",
    title: "lucide-react",
    content:
      "Lucide Check when selected (no inner fill on the row box). Swap for another icon if you want a different mark.",
  },
  {
    id: "a11y",
    title: "Accessibility",
    content:
      'Each row is a native button type="button". For full checkbox semantics in production, consider wrapping with a fieldset/legend or pairing with hidden inputs.',
  },
  {
    id: "registry",
    title: "shadcn registry",
    content:
      "Install adds checkbox-group.tsx as components/ui/checkbox-group; peers are framer-motion and lucide-react.",
  },
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
  visible: {
    transition: { delayChildren: 0.06, staggerChildren: 0.07 },
  },
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

export default function CheckboxGroupPage() {
  const [selected, setSelected] = useState<string[]>(["email"]);
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
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
                  href="/components/motion-accordion"
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
                Checkbox group
              </li>
            </ol>
          </motion.nav>

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
              Checkbox group
            </h1>
            <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
              Multi-select rows with a bordered empty box when off and a lone
              animated tick when on. Built with Framer Motion and your theme
              tokens.
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
            <BentoMotion
              className={cn(
                "relative overflow-hidden lg:col-span-8 lg:row-span-2",
                "rounded-3xl border-neutral-200/40 dark:border-neutral-700/30"
              )}
              variants={itemVariants}
            >
              <SectionLabel accent="01">Live preview</SectionLabel>
              <div className="relative mt-1 min-h-0 flex-1">
                <CheckboxGroup
                  className="max-w-md"
                  onChange={setSelected}
                  options={demoOptions}
                  value={selected}
                />
              </div>
            </BentoMotion>

            <BentoMotion
              className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="02">Install</SectionLabel>
              <div className="min-w-0 flex-1 [&>div]:mt-0">
                <CodeBlockInstall componentName="checkbox-group" />
              </div>
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/90 border-dashed lg:col-span-4 lg:col-start-9 lg:row-start-2 dark:border-neutral-700/80"
              variants={itemVariants}
            >
              <SectionLabel accent="03">v0</SectionLabel>
              <p className="mb-5 flex-1 font-sans text-neutral-500 text-sm leading-snug dark:text-neutral-400">
                Ship the registry bundle to v0 and iterate on motion or layout
                with prompts.
              </p>
              <ComponentActions name="checkbox-group" />
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/40 lg:col-span-8 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="04">Usage</SectionLabel>
              <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
                Minimal example — see tile{" "}
                <span className="font-mono text-neutral-600 text-xs dark:text-neutral-300">
                  05
                </span>{" "}
                for{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  options
                </code>
                ,{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  value
                </code>
                , and packages.
              </p>
              <CodeBlock code={usageCode} language="tsx" variant="embedded" />
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/40 bg-neutral-50/50 lg:col-span-4 lg:col-start-9 lg:row-start-3 dark:border-neutral-700/30 dark:bg-neutral-900/40"
              variants={itemVariants}
            >
              <SectionLabel accent="05">Dependencies</SectionLabel>
              <p className="mb-3 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                Registry peers and API — export{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                  CheckboxGroup
                </code>{" "}
                and{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                  CheckboxGroupOption
                </code>
                .
              </p>
              <div className="rounded-xl border border-neutral-200/30 bg-white dark:border-neutral-700/25 dark:bg-neutral-950">
                <ul className="divide-y divide-neutral-100/90 dark:divide-neutral-800/60">
                  {componentDetailsItems.map((row) => (
                    <li className="px-3 py-2.5 sm:px-3.5 sm:py-3" key={row.id}>
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <code className="shrink-0 rounded bg-neutral-100 px-1 py-px font-mono text-[10px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                          {row.id}
                        </code>
                        <span className="font-medium text-neutral-900 text-xs dark:text-neutral-100">
                          {row.title}
                        </span>
                      </div>
                      <p className="mt-1.5 font-sans text-[12px] text-neutral-600 leading-relaxed dark:text-neutral-400">
                        {row.content}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </BentoMotion>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
