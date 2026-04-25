"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { spinnerApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import Spinner from "@/registry/spinner";

const usageCode = `import Spinner from "@/components/ui/spinner";

export function SavingIndicator() {
  return <Spinner className="size-4" />;
}

export function InlineDots() {
  return <Spinner variant="dots" className="size-5" />;
}`;

const componentDetailsItems = spinnerApiDetails;

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

function SpinnerPreview() {
  return (
    <div className="flex justify-center px-2 py-7 sm:py-8">
      <p
        className={cn(
          "flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2.5",
          "text-balance text-center font-sans text-[13px] text-neutral-600 leading-relaxed sm:max-w-2xl sm:gap-x-2 sm:text-[14px]",
          "dark:text-neutral-300"
        )}
      >
        <span className="text-neutral-500 dark:text-neutral-400">
          Every stall deserves a kinder signal —
        </span>
        <span aria-hidden className="inline-flex items-center">
          <Spinner className="size-5 shrink-0" />
        </span>
        <span className="font-medium text-sky-600 dark:text-sky-400">
          one tireless lap
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">,</span>
        <span>or</span>
        <span aria-hidden className="inline-flex items-center">
          <Spinner className="size-6 shrink-0" variant="dots" />
        </span>
        <span className="font-medium text-violet-600 dark:text-violet-400">
          three staggered taps
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">
          — calm motion that still reads.
        </span>
      </p>
    </div>
  );
}

export default function SpinnerPage() {
  return (
    <ComponentDocsPage
      actionDescription="Send the registry bundle to v0 when you want to experiment with loading copy, layout, or alternate pacing."
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Spinner" },
      ]}
      componentName="spinner"
      description="Lightweight loading states with a rotating ring or bouncing dots. Motion-driven, theme-aware, and easy to drop into inline or full-screen waits."
      details={componentDetailsItems}
      preview={<SpinnerPreview />}
      title="Spinner"
      usageCode={usageCode}
      usageDescription="Default export. Start with the compact snippet below, then expand into sizing, variants, and direct registry installs through the API details."
    />
  );
}
