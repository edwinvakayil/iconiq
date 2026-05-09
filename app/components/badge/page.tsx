"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { badgeApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import Badge from "@/registry/badge";

const usageCode = `import Badge from "@/components/ui/badge";

export function BadgePreview() {
  return (
    <p className="max-w-lg text-center text-lg font-medium leading-relaxed dark:text-neutral-100">
      Mark the beat — a{" "}
      <Badge
        bgColor="#ccfbf1"
        textColor="#115e59"
        waveColor="rgba(255,255,255,0.52)"
      >
        New
      </Badge>{" "}
      tag for launches,{" "}
      <Badge
        bgColor="#ffedd5"
        textColor="#9a3412"
        waveColor="rgba(255,255,255,0.52)"
      >
        Beta
      </Badge>{" "}
      when you&apos;re still tuning,{" "}
      <Badge
        bgColor="#fce7f3"
        textColor="#9d174d"
        waveColor="rgba(255,255,255,0.52)"
      >
        Live
      </Badge>{" "}
      once it&apos;s out the door.
    </p>
  );
}`;

const componentDetailsItems = badgeApiDetails;

function BadgePreview() {
  return (
    <div className="flex min-h-[260px] flex-1 flex-col items-center justify-center px-4 py-8">
      <p className="max-w-lg text-center font-medium font-sans text-lg text-neutral-800 leading-relaxed sm:text-xl dark:text-neutral-100">
        Mark the beat — a{" "}
        <Badge
          bgColor="#ccfbf1"
          textColor="#115e59"
          waveColor="rgba(255,255,255,0.52)"
        >
          New
        </Badge>{" "}
        tag for launches,{" "}
        <Badge
          bgColor="#ffedd5"
          textColor="#9a3412"
          waveColor="rgba(255,255,255,0.52)"
        >
          Beta
        </Badge>{" "}
        when you&apos;re still tuning,{" "}
        <Badge
          bgColor="#fce7f3"
          textColor="#9d174d"
          waveColor="rgba(255,255,255,0.52)"
        >
          Live
        </Badge>{" "}
        once it&apos;s out the door.
      </p>
    </div>
  );
}

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

export default function BadgePage() {
  return (
    <ComponentDocsPage
      actionDescription="Ship the registry bundle to v0 when you want to explore alternate palettes, timings, or status labels."
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Badge" },
      ]}
      componentName="badge"
      description="Inline label with a looping shimmer wave and spring entrance. Theme-aware by default, fully customizable with color overrides."
      details={componentDetailsItems}
      detailsDescription="Props and visual behavior are grouped into expandable rows instead of a dense table."
      preview={<BadgePreview />}
      title="Badge"
      usageCode={usageCode}
      usageDescription="Default export. Start with the compact example below, then branch into content, color overrides, and class-based styling through the API panel."
    />
  );
}
