"use client";

import { CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { type ReactNode, useState } from "react";

import { alertApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { usageToV0Page } from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";
import Alert from "@/registry/alert";

const usageCode = `"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Alert from "@/components/ui/alert";

export function AlertPreview() {
  const [previewKey, setPreviewKey] = useState(0);

  return (
    <div className="relative flex min-h-[300px] items-center justify-center">
      <button
        className="inline-flex items-center rounded-lg bg-neutral-900 px-6 py-3 text-[13px] font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        onClick={() => setPreviewKey((current) => current + 1)}
        type="button"
      >
        Show alert
      </button>

      {previewKey > 0 ? (
        <Alert
          icon={<CheckCircle2 aria-hidden className="size-[18px]" />}
          key={previewKey}
          message="Your latest updates are now live for the team."
          variant="toast"
          position="top-right"
          title="Changes saved"
        />
      ) : null}
    </div>
  );
}`;

const componentDetailsItems = alertApiDetails;

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

export default function AlertPage() {
  const prefersReducedMotion = useReducedMotion();
  const [previewKey, setPreviewKey] = useState(0);

  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Alert" },
      ]}
      componentName="alert"
      description="Dismissible alerts with a forgiving close target, polite live announcements, paused auto-dismiss on interaction, and optional toast positioning."
      details={componentDetailsItems}
      preview={
        <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center pb-2">
          <motion.button
            className={cn(
              "group relative isolate flex items-center gap-2.5 overflow-hidden rounded-lg px-6 py-3",
              "bg-neutral-900 font-medium text-[13px] text-white",
              "shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_2px_10px_0_rgba(0,0,0,0.18)]",
              "dark:bg-neutral-100 dark:text-neutral-900",
              "dark:shadow-[0_1px_0_0_rgba(0,0,0,0.06)_inset,0_2px_10px_0_rgba(0,0,0,0.28)]"
            )}
            onClick={() => setPreviewKey((k) => k + 1)}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            type="button"
            whileHover={prefersReducedMotion ? {} : { scale: 1.03, y: -1 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97, y: 0 }}
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent"
              transition={{ duration: 0.45, ease: "easeOut" }}
              whileHover={prefersReducedMotion ? {} : { translateX: "200%" }}
            />
            <motion.span
              className="relative flex size-[18px] items-center justify-center"
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
              whileHover={
                prefersReducedMotion ? {} : { rotate: [0, -18, 14, -8, 0] }
              }
            >
              <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
                <path
                  d="M8 2a4.5 4.5 0 0 0-4.5 4.5c0 2.1-.6 3.3-1.1 4 .5.5 1.4.5 1.6.5h8c.2 0 1.1 0 1.6-.5-.5-.7-1.1-1.9-1.1-4A4.5 4.5 0 0 0 8 2Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.3"
                />
                <path
                  d="M6.5 11.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.3"
                />
              </svg>
            </motion.span>
            <span className="relative">Show alert</span>
          </motion.button>
          {previewKey > 0 ? (
            <Alert
              icon={<CheckCircle2 aria-hidden className="size-[18px]" />}
              key={previewKey}
              message="Your latest updates are now live for the team."
              position="top-right"
              title="Changes saved"
              variant="toast"
            />
          ) : null}
        </div>
      }
      previewClassName="overflow-visible lg:col-span-8"
      title="Alert"
      usageCode={usageCode}
      usageDescription="Default export. Start with the inline alert below, then switch to toast mode when you want viewport positioning, timed dismissal, and polite live announcements."
      v0PageCode={usageToV0Page(usageCode)}
    />
  );
}
