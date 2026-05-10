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
    <blockquote className="mx-auto max-w-xl text-center">
      <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-3 text-balance text-lg font-medium leading-snug tracking-tight dark:text-neutral-100">
        <span>Win the press,</span>
        <span className="font-normal text-neutral-500 dark:text-neutral-400">
          then
        </span>
        <span className="inline-flex translate-y-px align-middle">
          <Button>Continue</Button>
        </span>
        <span>the break</span>
        <span className="basis-full w-full text-[0.92em] font-normal text-neutral-500 dark:text-neutral-400">
          - that&apos;s the half in two beats.
        </span>
      </p>
    </blockquote>
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
      description="CVA variants with spring hover and tap feedback. Forwards refs and standard button attributes while staying aligned with the rest of the system."
      details={componentDetailsItems}
      preview={
        <div className="flex min-h-[280px] items-center justify-center px-4 py-2">
          <blockquote className="mx-auto max-w-xl text-center">
            <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-3 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:gap-x-2 sm:text-xl dark:text-neutral-100">
              <span>Win the press,</span>
              <span className="font-normal text-neutral-500 dark:text-neutral-400">
                then
              </span>
              <span className="inline-flex translate-y-px align-middle">
                <Button>Continue</Button>
              </span>
              <span>the break</span>
              <span className="w-full basis-full font-normal text-[0.92em] text-neutral-500 dark:text-neutral-400">
                - that's the half in two beats.
              </span>
            </p>
          </blockquote>
        </div>
      }
      title="Button"
      usageCode={usageCode}
      usageDescription="Use the default button first, then branch into variant, size, disabled state, and interaction behavior through the API panel."
    />
  );
}
