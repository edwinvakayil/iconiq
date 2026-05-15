"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { buttonApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/button";

const usageCode = `import { Button } from "@/components/ui/button";

export function ButtonPreview() {
  return (
    <div className="mx-auto max-w-2xl space-y-3 text-center">
      <p className="text-balance text-lg font-medium leading-snug tracking-tight dark:text-neutral-100">
        When you are ready to ship.
      </p>
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance text-lg font-medium leading-snug tracking-tight dark:text-neutral-100">
        <span>Tap</span>
        <span className="inline-flex translate-y-px align-middle">
          <Button>Continue</Button>
        </span>
        <span>to finish.</span>
      </p>
    </div>
  );
}`;

const componentDetailsItems = buttonApiDetails;

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

export default function ButtonPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Button" },
      ]}
      componentName="button"
      description="CVA variants with spring hover and press feedback, larger default hit targets, and optional intrinsic width animation for changing labels."
      details={componentDetailsItems}
      preview={
        <div className="flex min-h-[280px] items-center justify-center px-4 py-2">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <p className="text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
              When you are ready to ship.
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
              <span>Tap</span>
              <span className="inline-flex translate-y-px align-middle">
                <Button>Continue</Button>
              </span>
              <span>to finish.</span>
            </p>
          </div>
        </div>
      }
      title="Button"
      usageCode={usageCode}
      usageDescription="Start with the default button, then branch into variants, the unstyled escape hatch, optional size animation for changing labels, and the built-in interaction states through the API panel."
    />
  );
}
