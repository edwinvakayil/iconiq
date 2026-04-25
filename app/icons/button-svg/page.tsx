"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { getIcons } from "@/actions/get-icons";
import { ButtonSvgBuilder } from "@/components/button-svg-builder";
import { DocsPageShell, DocsSection } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";

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
  visible: { transition: { delayChildren: 0.06, staggerChildren: 0.07 } },
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

export default function ButtonSvgPage() {
  const icons = getIcons();

  return (
    <DocsPageShell
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Icons" },
        { label: "Button + Icon" },
      ]}
      description="Pick any Iconiq icon, preview it inside a button, then copy the complete snippet or install command. This page is tuned for fast composition instead of generic showcase chrome."
      eyebrow="Composable Snippet Builder"
      meta={[
        { label: "Icons", value: `${icons.length}+ options` },
        { label: "Output", value: "Ready-to-paste JSX" },
        { label: "Workflow", value: "Install and copy in one place" },
      ]}
      title="Button + Icon"
    >
      <DocsSection
        className="lg:col-span-12"
        description="Search, preview, and export a button composition without bouncing between docs, snippets, and install commands."
        index="01"
        title="Builder"
      >
        <ButtonSvgBuilder icons={icons} />
      </DocsSection>
    </DocsPageShell>
  );
}
