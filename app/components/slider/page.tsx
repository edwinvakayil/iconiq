"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode, useState } from "react";

import { sliderApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import { Slider } from "@/registry/slider";

const usageCode = `"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function SliderPreview() {
  const [level, setLevel] = useState(42);

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-2 py-7">
      <div className="w-full max-w-[220px]">
        <Slider label="Tide" onChange={setLevel} value={level} />
      </div>

      <p className="max-w-sm text-center text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
        <span className="text-neutral-500 dark:text-neutral-400">
          Nudge the line until it hums —
        </span>{" "}
        <span className="font-medium text-amber-600 dark:text-amber-400">
          spring-settled
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">,</span>{" "}
        <span className="text-sky-600 dark:text-sky-400">
          thumb and fill in quiet agreement
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">
          {" "}
          — one gesture, no sharp edges.
        </span>
      </p>
    </div>
  );
}`;

const componentDetailsItems = sliderApiDetails;

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

function SliderPreview() {
  const [level, setLevel] = useState(42);
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-2 py-7 sm:py-8">
      <div className="w-full max-w-[220px] sm:max-w-[260px]">
        <Slider label="Tide" onChange={setLevel} value={level} />
      </div>
      <p
        className={cn(
          "max-w-sm text-center font-sans text-[13px] leading-relaxed sm:max-w-md sm:text-[14px]",
          "text-balance text-neutral-600 dark:text-neutral-300"
        )}
      >
        <span className="text-neutral-500 dark:text-neutral-400">
          Nudge the line until it hums —
        </span>{" "}
        <span className="font-medium text-amber-600 dark:text-amber-400">
          spring-settled
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">,</span>{" "}
        <span className="text-sky-600 dark:text-sky-400">
          thumb and fill in quiet agreement
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">
          {" "}
          — one gesture, no sharp edges.
        </span>
      </p>
    </div>
  );
}

export default function SliderPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Slider" },
      ]}
      componentName="slider"
      description="Horizontal range input with springy thumb motion and subtle track feedback. Great for volume, intensity, and any single numeric range."
      details={componentDetailsItems}
      preview={
        <div className="flex min-h-[320px] items-center justify-center">
          <SliderPreview />
        </div>
      }
      title="Slider"
      usageCode={usageCode}
      usageDescription="Use the compact example below as the baseline, then open the API details for value handling, limits, and interaction behavior."
    />
  );
}
