"use client";

import {
  ChevronRight,
  Layers,
  LayoutGrid,
  MousePointerClick,
  PackageCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { getIcons } from "@/actions/get-icons";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

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
  visible: { transition: { delayChildren: 0.06, staggerChildren: 0.07 } },
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

const principles = [
  {
    icon: Layers,
    title: "Lucide-grid icons",
    desc: "Every icon follows the same stroke weight, corner radius, and optical sizing as Lucide — so they sit naturally beside each other and native UI.",
  },
  {
    icon: LayoutGrid,
    title: "UI components",
    desc: "Beyond icons, Iconiq ships a growing set of animated UI components — each built with Framer Motion spring physics and drop-in compatible with shadcn/ui.",
  },
  {
    icon: Sparkles,
    title: "Motion that means something",
    desc: "Animations are triggered by hover, focus, or state change. They reinforce what the icon represents — a bell rings, a download arrow falls.",
  },
  {
    icon: Zap,
    title: "Copy-paste, no lock-in",
    desc: "Everything lands directly in your source tree. No icon font, no CDN, no provider — just React and Framer Motion.",
  }
];

const stack = [
  { label: "Framer Motion", note: "spring animations" },
  { label: "Lucide grid", note: "icon geometry" },
  { label: "shadcn/ui", note: "component base" },
  { label: "Tailwind CSS", note: "styling" },
];

const frameworks = ["Next.js", "Vite", "Remix", "Astro"];

export default function IntroductionPage() {
  const prefersReducedMotion = useReducedMotion();
  const iconCount = getIcons().length;
  const componentCount =
    SITE_SECTIONS.find((s) => s.label === "Components")?.children.length ?? 0;
  const stats = [
    { value: `${iconCount}+`, label: "Animated icons" },
    { value: String(componentCount), label: "UI components" },
    { value: "0", label: "Runtime deps" },
    { value: "shadcn", label: "CLI compatible" },
  ];
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  return (
    <main className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        {/* Breadcrumb */}
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
            <li
              aria-current="page"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Introduction
            </li>
          </ol>
        </motion.nav>

        {/* Header */}
        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 max-w-2xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 340, damping: 34, delay: 0.05 }
          }
        >
          <h1 className="font-sans font-semibold text-3xl text-neutral-900 tracking-tight sm:text-[2rem] dark:text-white">
            Introduction
          </h1>
          <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
            Iconiq is an open-source library of animated icons and motion UI
            components for React — built on Framer Motion, distributed via
            shadcn CLI.
          </p>
        </motion.header>

        {/* Bento grid — row 1 */}
        <motion.div
          animate="visible"
          className={cn(
            "grid auto-rows-min grid-cols-1 gap-3 sm:gap-4",
            "lg:grid-cols-12 lg:gap-x-5 lg:gap-y-5"
          )}
          initial="hidden"
          variants={containerVariants}
        >
          {/* About */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-5 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="01">What is Iconiq</SectionLabel>
            <p className="font-sans text-[14px] text-neutral-600 leading-relaxed dark:text-neutral-400">
              Instead of shipping an icon package you update as a dependency,
              Iconiq gives you individual animated React components that live
              directly in your codebase. Each icon or UI component is added once
              via the shadcn CLI and is fully yours to edit.
            </p>
            <p className="mt-3 font-sans text-[14px] text-neutral-600 leading-relaxed dark:text-neutral-400">
              Animations are authored with Framer Motion spring physics and
              respect{" "}
              <code className="rounded bg-neutral-100 px-1 font-mono text-[12px] dark:bg-neutral-800">
                prefers-reduced-motion
              </code>
              . Icons follow the Lucide grid so they blend with any existing
              Lucide usage.
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {frameworks.map((fw) => (
                <span
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                  key={fw}
                >
                  {fw}
                </span>
              ))}
            </div>
          </BentoMotion>

          {/* Stats */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-3 lg:col-start-6 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="02">At a glance</SectionLabel>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <dt className="font-mono font-semibold text-2xl text-neutral-900 leading-none dark:text-white">
                    {value}
                  </dt>
                  <dd className="mt-1 font-sans text-[11px] text-neutral-500 dark:text-neutral-400">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </BentoMotion>

          {/* Distribution */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-4 lg:col-start-9 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="03">Distribution</SectionLabel>
            <p className="mb-4 font-sans text-[14px] text-neutral-500 leading-snug dark:text-neutral-400">
              Every icon and component is installed with one shadcn command — no
              package to update, no version conflicts.
            </p>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900/50">
              <div className="mb-1.5 flex items-center gap-2">
                <Terminal className="size-3 text-neutral-400 dark:text-neutral-500" />
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider dark:text-neutral-500">
                  shell
                </span>
              </div>
              <code className="block font-mono text-[12px] text-neutral-700 dark:text-neutral-300">
                npx shadcn@latest add @iconiq/bell
              </code>
            </div>
          </BentoMotion>

          {/* Principles */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-7 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="04">Design principles</SectionLabel>
            <ul className="flex flex-col gap-4">
              {principles.map(({ icon: Icon, title, desc }) => (
                <li className="flex items-start gap-3" key={title}>
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                    <Icon className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-neutral-800 text-sm dark:text-neutral-200">
                      {title}
                    </p>
                    <p className="mt-0.5 font-sans text-neutral-500 text-xs leading-relaxed dark:text-neutral-400">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </BentoMotion>

          {/* Built on + Next step stacked in 5 cols */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-5 lg:col-start-8">
            {/* Built on */}
            <BentoMotion
              className="border-neutral-200/40 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="05">Built on</SectionLabel>
              <ul className="flex flex-col gap-2.5">
                {stack.map(({ label, note }) => (
                  <li
                    className="flex items-center justify-between gap-3"
                    key={label}
                  >
                    <span className="font-medium text-neutral-800 text-sm dark:text-neutral-200">
                      {label}
                    </span>
                    <span className="font-sans text-neutral-400 text-xs dark:text-neutral-500">
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </BentoMotion>

            {/* Next step */}
            <BentoMotion
              className="border-neutral-200/90 border-dashed dark:border-neutral-700/80"
              variants={itemVariants}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white">
                  <MousePointerClick className="size-4 text-white dark:text-neutral-900" />
                </span>
                <div>
                  <p className="font-medium text-neutral-800 text-sm dark:text-neutral-200">
                    Ready to start?
                  </p>
                  <p className="mt-0.5 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                    Run a single shadcn command to add any icon or component.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 font-medium font-sans text-[13px] text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                  href="/installation"
                >
                  Installation guide
                  <ChevronRight className="size-3.5" />
                </Link>
                <Link
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3.5 py-1.5 font-medium font-sans text-[13px] text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  href="/icons"
                >
                  Browse icons
                  <PackageCheck className="size-3.5" />
                </Link>
              </div>
            </BentoMotion>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
