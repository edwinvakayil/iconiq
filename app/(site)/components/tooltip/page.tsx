"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { tooltipApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { usageToV0Page } from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/registry/tooltip";

const usageCode = `import { Tooltip } from "@/components/ui/tooltip";

const triggerClass =
  "rounded-lg px-0.5 font-semibold underline decoration-dotted underline-offset-[5px] transition-colors";

export function TooltipPreview() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-8 px-4 py-8">
      <blockquote className="max-w-lg text-center">
        <p className="text-lg font-medium leading-relaxed tracking-tight dark:text-neutral-100">
          Win the{" "}
          <Tooltip content="Press, recycle, stay compact." delay={0.12} side="top">
            <button
              className={\`\${triggerClass} text-emerald-700 decoration-emerald-500/40 dark:text-emerald-400\`}
              type="button"
            >
              midfield
            </button>
          </Tooltip>
          , then{" "}
          <Tooltip content="One ball behind the line." side="bottom">
            <button
              className={\`\${triggerClass} text-sky-700 decoration-sky-500/40 dark:text-sky-400\`}
              type="button"
            >
              break the last line
            </button>
          </Tooltip>
          — that&apos;s the half in two beats.
        </p>
      </blockquote>

      <p className="max-w-sm text-center text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        Hover the calls or{" "}
        <Tooltip content="Tab in — same note." side="right">
          <button
            className={\`\${triggerClass} text-neutral-700 decoration-neutral-400/70 dark:text-neutral-300\`}
            type="button"
          >
            use the keyboard
          </button>
        </Tooltip>
        .
      </p>
    </div>
  );
}`;

const componentDetailsItems = tooltipApiDetails;

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

function TooltipPreview() {
  const triggerClass =
    "rounded-lg px-0.5 font-semibold underline decoration-dotted underline-offset-[5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500/60";

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
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Tooltip" },
      ]}
      componentName="tooltip"
      description="Contextual label with soft motion and a compact callout surface. Ideal for icon-only controls, dense toolbars, and short hints."
      details={componentDetailsItems}
      preview={<TooltipPreview />}
      title="Tooltip"
      usageCode={usageCode}
      usageDescription="Use the canonical `Tooltip` export so the component drops cleanly into icon buttons, controls, and command surfaces."
      v0PageCode={usageToV0Page(usageCode)}
    />
  );
}
