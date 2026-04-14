"use client";

import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { RegistryInstallBlock } from "@/components/registry-install-block";
import { cn } from "@/lib/utils";
import { Accordion, type AccordionItem } from "@/registry/motion-accordion";

const demoItems: AccordionItem[] = [
  {
    id: "1",
    title: "What makes this accordion special?",
    content:
      "It uses spring-based physics animations powered by Framer Motion, creating fluid and natural feeling transitions that respond organically to user interaction.",
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

const usageCode = `import { Accordion } from "@/components/ui/motion-accordion";

const items = [
  {
    id: "1",
    title: "What makes this accordion special?",
    content:
      "It uses spring-based physics animations powered by Framer Motion for natural transitions.",
  },
  {
    id: "2",
    title: "How does the animation work?",
    content:
      "The icon, panel height, and text stagger are driven by separate spring transitions.",
  },
];

export function Faq() {
  return <Accordion items={items} />;
}`;

type DetailRow = AccordionItem & { registryPath?: string };

/** Same shape as accordion rows: documents API, packages, and behavior in the bento "Dependencies" tile. */
const componentDetailsItems: DetailRow[] = [
  {
    id: "items",
    title: "items prop (required)",
    content:
      "Pass an array of objects with id (stable string key per row), title (visible question), and content (answer body as a string — the component splits on spaces for the stagger animation).",
  },
  {
    id: "className",
    title: "className (optional)",
    content:
      "Forwarded to the root wrapper; use it to drop max-width, tweak spacing, or align with your layout grid.",
  },
  {
    id: "framer-motion",
    title: "framer-motion",
    content:
      "Handles layout height springs, AnimatePresence for panel mount/unmount, opacity on list entrance, plus rotation and scale on the trigger icon.",
  },
  {
    id: "lucide-react",
    title: "lucide-react",
    content:
      "Supplies the Plus icon. Replace the import with any Lucide icon or your own SVG if you prefer a different affordance.",
  },
  {
    id: "behavior",
    title: "Interaction model",
    content:
      "Only one section stays open at a time (single-select). Clicking the active row closes it. Focus styles use ring tokens for keyboard users.",
  },
  {
    id: "a11y",
    title: "Accessibility",
    content:
      "Each trigger is a native button with aria-expanded and aria-controls pointing at the animated panel id. Semantic structure works with screen readers and tab order.",
  },
  {
    id: "registry",
    title: "shadcn registry",
    content:
      "Peer dependencies are declared on the registry item so shadcn@latest add pulls framer-motion and lucide-react into your project when needed.",
    registryPath: "motion-accordion.json",
  },
];

function SectionLabel({
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

const bentoContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.06, staggerChildren: 0.07 },
  },
};

const bentoItem = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
};

const bentoContainerStatic = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 0 } },
};

const bentoItemStatic = {
  hidden: { opacity: 1, scale: 1, y: 0 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function BentoMotion({
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
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  return (
    <main className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <motion.nav
          animate={{ opacity: 1, y: 0 }}
          aria-label="Breadcrumb"
          className="mb-8"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 380, damping: 35 }
          }
        >
          <ol className="flex flex-wrap items-center gap-1.5 font-sans text-neutral-400 text-xs dark:text-neutral-500">
            <li>
              <Link
                className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                href="/"
              >
                Docs
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3 opacity-60" />
            </li>
            <li>
              <Link
                className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                href="/components/motion-accordion"
              >
                Components
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3 opacity-60" />
            </li>
            <li
              aria-current="page"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Accordion
            </li>
          </ol>
        </motion.nav>

        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-2xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 340, damping: 34, delay: 0.05 }
          }
        >
          <h1 className="font-sans font-semibold text-3xl text-neutral-900 tracking-tight sm:text-[2rem] dark:text-white">
            Accordion
          </h1>
          <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
            Single-open rows with spring height and staggered copy. Built with
            Framer Motion and your theme tokens.
          </p>
        </motion.header>

        <motion.div
          animate="visible"
          className={cn(
            "grid auto-rows-min grid-cols-1 gap-3 sm:gap-4",
            "lg:grid-cols-12 lg:gap-x-5 lg:gap-y-5"
          )}
          initial="hidden"
          variants={containerVariants}
        >
          {/* Featured preview — spans 2 rows on large screens */}
          <BentoMotion
            className={cn(
              "relative overflow-hidden lg:col-span-8 lg:row-span-2",
              "rounded-3xl border-neutral-200/40 dark:border-neutral-700/30"
            )}
            variants={itemVariants}
          >
            <SectionLabel accent="01">Live preview</SectionLabel>
            <div className="relative mt-1 min-h-0 flex-1">
              <Accordion className="max-w-none" items={demoItems} />
            </div>
          </BentoMotion>

          <BentoMotion
            className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="02">Install</SectionLabel>
            <div className="min-w-0 flex-1 [&>div]:mt-0">
              <CodeBlockInstall componentName="motion-accordion" />
            </div>
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/90 border-dashed lg:col-span-4 lg:col-start-9 lg:row-start-2 dark:border-neutral-700/80"
            variants={itemVariants}
          >
            <SectionLabel accent="03">v0</SectionLabel>
            <p className="mb-5 flex-1 font-sans text-neutral-500 text-sm leading-snug dark:text-neutral-400">
              Ship the registry bundle to v0 and iterate on motion or layout
              with prompts.
            </p>
            <ComponentActions name="motion-accordion" />
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="04">Usage</SectionLabel>
            <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
              Minimal example — see tile{" "}
              <span className="font-mono text-neutral-600 text-xs dark:text-neutral-300">
                05
              </span>{" "}
              for the full{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                items
              </code>{" "}
              contract and packages.
            </p>
            <CodeBlock code={usageCode} language="tsx" variant="embedded" />
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-4 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="05">Dependencies</SectionLabel>
            <p className="mb-3 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
              Registry peers and how this component fits your app — same{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                id
              </code>
              ,{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                title
              </code>
              ,{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                content
              </code>{" "}
              shape as accordion data.
            </p>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {componentDetailsItems.map((row) => (
                <div
                  className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[180px_1fr] sm:gap-8 sm:py-4"
                  key={row.id}
                >
                  <p className="pt-0.5 font-medium text-neutral-800 text-xs dark:text-neutral-200">
                    {row.title}
                  </p>
                  <div>
                    <p className="font-sans text-[13px] text-neutral-500 leading-relaxed dark:text-neutral-400">
                      {row.content}
                    </p>
                    {row.registryPath ? (
                      <RegistryInstallBlock registryPath={row.registryPath} />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </BentoMotion>
        </motion.div>
      </div>
    </main>
  );
}
