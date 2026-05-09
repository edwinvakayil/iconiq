"use client";

import { Home } from "lucide-react";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { breadcrumbsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import { type BreadcrumbItem, Breadcrumbs } from "@/registry/breadcrumbs";

const demoItems: BreadcrumbItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home className="size-3.5" />,
  },
  { label: "Components", href: "/components/breadcrumbs" },
  { label: "Breadcrumbs" },
];

const usageCode = `import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Home } from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: <Home className="size-3.5" /> },
  { label: "Docs", href: "/docs" },
  { label: "Current page" },
];

export function PageHeader() {
  return <Breadcrumbs items={items} />;
}`;

const componentDetailsItems = breadcrumbsApiDetails;

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

export default function BreadcrumbsPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Breadcrumbs" },
      ]}
      componentName="breadcrumbs"
      description="Spring separators, hover lift, and a shimmer on the current segment. Built with Motion and tuned to the theme tokens that drive the rest of the library."
      details={componentDetailsItems}
      detailsDescription="Each item expands into the segment contract, current-state behavior, and the motion details that affect usage."
      preview={
        <div className="flex min-h-[280px] items-center justify-center">
          <Breadcrumbs items={demoItems} />
        </div>
      }
      title="Breadcrumbs"
      usageCode={usageCode}
      usageDescription="Use the minimal trail below as the baseline, then expand into icons, current-state styling, and custom separators through the API details."
    />
  );
}
