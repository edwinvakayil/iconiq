"use client";

import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { SidebarNav } from "@/components/sidebar-nav";
import { cn } from "@/lib/utils";
import { HoverExpand, type HoverExpandItem } from "@/registry/hovercard";

const demoItems: HoverExpandItem[] = [
  {
    label: "Real Madrid",
    sublabel: "LaLiga",
    image: "/assets/rma.jpg",
    imageAlt: "Real Madrid",
    description:
      "European royalty — Bernabéu nights and a record haul of continental trophies.",
  },
  {
    label: "Manchester United",
    sublabel: "Premier League",
    image: "/assets/manutd.jpg",
    imageAlt: "Manchester United",
    description:
      "Old Trafford, the Class of ’92, and decades of sides chasing silverware in red.",
  },
  {
    label: "Bayern Munich",
    sublabel: "Bundesliga",
    image: "/assets/bayern.jpg",
    imageAlt: "Bayern Munich",
    description: "Domestic dominance and Allianz Arena under the lights.",
  },
];

const usageCode = `import { HoverExpand } from "@/components/ui/hovercard";

const items = [
  {
    label: "Mountain retreat",
    image: "/cabin.jpg",
    sublabel: "Alpine",
    description: "Quiet mornings and long views.",
  },
  {
    label: "Coastal studio",
    image: "/studio.jpg",
    description: "Light-filled workspace near the water.",
  },
];

export function Highlights() {
  return <HoverExpand className="max-w-xl" items={items} />;
}`;

type DetailRow = { id: string; title: string; content: string };

const componentDetailsItems: DetailRow[] = [
  {
    id: "items",
    title: "items (required)",
    content:
      "Array of HoverExpandItem: label (row title), image (path or URL for next/image), optional sublabel (uppercase rail, hidden below sm to save space), optional imageAlt (defaults to label), optional description (shown under the title when expanded).",
  },
  {
    id: "collapsedHeight",
    title: "collapsedHeight (optional)",
    content: "Pixel height of each row when nothing is hovered. Default 76.",
  },
  {
    id: "expandedHeight",
    title: "expandedHeight (optional)",
    content:
      "Pixel height of the hovered row. Default 320. Spring physics animate between collapsed and expanded.",
  },
  {
    id: "className",
    title: "className (optional)",
    content:
      "Merged onto the root flex column — set max-width or typography color (rows use currentColor until hover).",
  },
  {
    id: "motion",
    title: "motion/react",
    content:
      "Spring height on each row; crossfade and scale on the background layer; opacity dip on non-hovered rows when one is active.",
  },
  {
    id: "next-image",
    title: "next/image",
    content:
      "Backgrounds use fill + object-cover. Configure images.remotePatterns for external hosts, or use files under /public.",
  },
  {
    id: "behavior",
    title: "Interaction model",
    content:
      "Fine pointer + hover: pointer enter expands a row, leave resets. Touch / coarse pointer: tap a row to expand or collapse (tap again to close). Rows use role=button when in tap mode.",
  },
  {
    id: "registry",
    title: "shadcn registry",
    content:
      "Install adds hovercard.tsx as components/ui/hovercard; peer dependency is motion (Motion for React).",
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

export default function HovercardPage() {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

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
                Hover expand
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
              Hover expand
            </h1>
            <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
              Stacked rows that spring open on hover to reveal a full-bleed
              image and overlay copy. Built with Motion and next/image.
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
            <BentoMotion
              className={cn(
                "relative overflow-hidden lg:col-span-8 lg:row-span-2",
                "rounded-3xl border-neutral-200/40 dark:border-neutral-700/30"
              )}
              variants={itemVariants}
            >
              <SectionLabel accent="01">Live preview</SectionLabel>
              <div className="relative mt-1 min-h-0 flex-1">
                <HoverExpand
                  className="mx-auto max-w-2xl text-neutral-900 dark:text-neutral-100"
                  collapsedHeight={76}
                  expandedHeight={280}
                  items={demoItems}
                />
              </div>
            </BentoMotion>

            <BentoMotion
              className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="02">Install</SectionLabel>
              <div className="min-w-0 flex-1 [&>div]:mt-0">
                <CodeBlockInstall componentName="hovercard" />
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
              <ComponentActions name="card" />
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/40 lg:col-span-8 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="04">Usage</SectionLabel>
              <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
                Minimal example — see tile{" "}
                <span className="font-mono text-neutral-600 text-xs dark:text-neutral-300">
                  05
                </span>{" "}
                for{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  items
                </code>
                ,{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  collapsedHeight
                </code>
                ,{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  expandedHeight
                </code>
                , and packages.
              </p>
              <CodeBlock code={usageCode} language="tsx" variant="embedded" />
            </BentoMotion>

            <BentoMotion
              className="border-neutral-200/40 bg-neutral-50/50 lg:col-span-4 lg:col-start-9 lg:row-start-3 dark:border-neutral-700/30 dark:bg-neutral-900/40"
              variants={itemVariants}
            >
              <SectionLabel accent="05">Dependencies</SectionLabel>
              <p className="mb-3 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                Registry peers and API — export{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                  HoverExpand
                </code>
                ,{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                  HoverExpandItem
                </code>
                .
              </p>
              <div className="rounded-xl border border-neutral-200/30 bg-white dark:border-neutral-700/25 dark:bg-neutral-950">
                <ul className="divide-y divide-neutral-100/90 dark:divide-neutral-800/60">
                  {componentDetailsItems.map((row) => (
                    <li className="px-3 py-2.5 sm:px-3.5 sm:py-3" key={row.id}>
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <code className="shrink-0 rounded bg-neutral-100 px-1 py-px font-mono text-[10px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                          {row.id}
                        </code>
                        <span className="font-medium text-neutral-900 text-xs dark:text-neutral-100">
                          {row.title}
                        </span>
                      </div>
                      <p className="mt-1.5 font-sans text-[12px] text-neutral-600 leading-relaxed dark:text-neutral-400">
                        {row.content}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </BentoMotion>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
