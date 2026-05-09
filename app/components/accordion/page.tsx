"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { accordionApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { cn } from "@/lib/utils";
import { Accordion, type AccordionItem } from "@/registry/accordion";

const demoItems: AccordionItem[] = [
  {
    id: "1",
    title: "What makes this accordion special?",
    content:
      "It uses spring-based physics animations powered by Motion, creating fluid and natural feeling transitions that respond organically to user interaction.",
  },
  {
    id: "2",
    title: "How does the animation work?",
    content:
      "Each element — the icon rotation, content reveal, and background shift — animates independently with carefully tuned spring parameters for a layered, premium feel.",
  },
  {
    id: "3",
    title: "Can I customize the content?",
    content:
      "Absolutely. Pass any React node as content. The accordion gracefully handles variable-height content with automatic height animation.",
  },
  {
    id: "4",
    title: "Is it accessible?",
    content:
      "Yes. It uses semantic button elements, proper ARIA attributes, and supports full keyboard navigation out of the box.",
  },
];

const usageCode = `import { Accordion, type AccordionItem } from "@/components/ui/accordion";

const items: AccordionItem[] = [
  {
    id: "1",
    title: "What makes this accordion special?",
    content:
      "It uses spring-based physics animations powered by Motion, creating fluid and natural feeling transitions that respond organically to user interaction.",
  },
  {
    id: "2",
    title: "How does the animation work?",
    content:
      "Each element — the icon rotation, content reveal, and background shift — animates independently with carefully tuned spring parameters for a layered, premium feel.",
  },
  {
    id: "3",
    title: "Can I customize the content?",
    content:
      "Absolutely. Pass any React node as content. The accordion gracefully handles variable-height content with automatic height animation.",
  },
  {
    id: "4",
    title: "Is it accessible?",
    content:
      "Yes. It uses semantic button elements, proper ARIA attributes, and supports full keyboard navigation out of the box.",
  },
];

export function AccordionPreview() {
  return <Accordion className="w-full max-w-none" items={items} />;
}`;

const componentDetailsItems = accordionApiDetails;

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

export default function AccordionPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Accordion" },
      ]}
      componentName="accordion"
      description="Animated accordion with composable items, spring reveal, and theme-aware disclosure chrome. Designed for FAQs, settings, and structured help content."
      details={componentDetailsItems}
      preview={
        <div className="min-h-[320px] w-full">
          <Accordion className="w-full max-w-none" items={demoItems} />
        </div>
      }
      title="Accordion"
      usageCode={usageCode}
      usageDescription="Use the default item array pattern below, then expand into item structure, content expectations, and layout behavior in the API panel."
    />
  );
}
