"use client";

import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { RegistryInstallBlock } from "@/components/registry-install-block";
import { cn } from "@/lib/utils";
import { tooltip as Tooltip } from "@/registry/tooltip";

const usageCode = `import { tooltip as Tooltip } from "@/components/ui/tooltip";

export function HelpLabel() {
  return (
    <Tooltip content="Changes are saved automatically" side="top" delay={0.1}>
      <button className="rounded-md border px-3 py-1.5 text-sm">
        Autosave
      </button>
    </Tooltip>
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
    id: "children",
    title: "children (required)",
    content:
      "The trigger element. Tooltip opens on mouse enter or keyboard focus and closes on mouse leave or blur.",
  },
  {
    id: "content",
    title: "content (required)",
    content:
      "Tooltip body. Accepts any React node, so plain text and rich inline markup both work.",
  },
  {
    id: "side",
    title: "side (optional)",
    content:
      'Placement around the trigger: "top", "bottom", "left", or "right". Default is "top".',
  },
  {
    id: "delay",
    title: "delay (optional)",
    content:
      "Open delay in seconds before showing the tooltip. Default is 0.15 to avoid accidental flicker.",
  },
  {
    id: "classname",
    title: "className (optional)",
    content:
      "Appended to the tooltip bubble. Use it to change sizing, colors, or typography while keeping default motion.",
  },
  {
    id: "framer-motion",
    title: "framer-motion",
    content:
      "Drives AnimatePresence mount/unmount, spring scale, directional offsets, blur fade, and arrow pop animation.",
  },
  {
    id: "registry",
    title: "shadcn registry",
    content:
      "Registry item includes framer-motion so the install command brings in animation support.",
    registryPath: "tooltip.json",
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

function TooltipPreview() {
  const triggerClass =
    "rounded-sm px-0.5 font-semibold underline decoration-dotted underline-offset-[5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/60";

  return (
    <div className="flex min-h-[260px] flex-1 flex-col items-center justify-center gap-8 px-4 py-8">
      <blockquote className="max-w-lg text-center">
        <p className="font-medium font-sans text-lg text-neutral-800 leading-relaxed tracking-tight sm:text-xl dark:text-neutral-100">
          Win the{" "}
          <Tooltip
            content="Press, recycle, stay compact."
            delay={0.12}
            side="top"
          >
            <button
              className={cn(
                triggerClass,
                "text-emerald-700 decoration-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
              )}
              type="button"
            >
              midfield
            </button>
          </Tooltip>
          , then{" "}
          <Tooltip content="One ball behind the line." side="bottom">
            <button
              className={cn(
                triggerClass,
                "text-sky-700 decoration-sky-500/40 hover:bg-sky-500/10 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
              )}
              type="button"
            >
              break the last line
            </button>
          </Tooltip>
          — that’s the half in two beats.
        </p>
      </blockquote>
      <p className="max-w-sm text-center font-sans text-[13px] text-neutral-500 leading-relaxed dark:text-neutral-400">
        Hover the calls or{" "}
        <Tooltip content="Tab in — same note." side="right">
          <button
            className={cn(
              triggerClass,
              "text-neutral-700 decoration-neutral-400/70 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            )}
            type="button"
          >
            use the keyboard
          </button>
        </Tooltip>
        .
      </p>
    </div>
  );
}

export default function TooltipPage() {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  return (
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
                href="/components/tooltip"
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
              Tooltip
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
            Tooltip
          </h1>
          <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
            Animated tooltip with spring entrance and directional offset.
            Supports hover and focus interactions with configurable side and
            delay.
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
            <TooltipPreview />
          </BentoMotion>

          <BentoMotion
            className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="02">Install</SectionLabel>
            <div className="min-w-0 flex-1 [&>div]:mt-0">
              <CodeBlockInstall componentName="tooltip" />
            </div>
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/90 border-dashed lg:col-span-4 lg:col-start-9 lg:row-start-2 dark:border-neutral-700/80"
            variants={itemVariants}
          >
            <SectionLabel accent="03">v0</SectionLabel>
            <p className="mb-5 flex-1 font-sans text-neutral-500 text-sm leading-snug dark:text-neutral-400">
              Ship the tooltip registry item to v0, then iterate on copy, tone,
              and microinteractions with prompts.
            </p>
            <ComponentActions name="tooltip" />
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="04">Usage</SectionLabel>
            <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
              Wrap any trigger with the component and pass tooltip body via{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                content
              </code>
              .
            </p>
            <CodeBlock code={usageCode} language="tsx" variant="embedded" />
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-4 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="05">API &amp; dependencies</SectionLabel>
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
