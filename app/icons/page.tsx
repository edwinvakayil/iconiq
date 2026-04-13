"use client";

import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { getIcons } from "@/actions/get-icons";
import { IconsList } from "@/components/list";
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

export default function IconLibraryPage() {
  const icons = getIcons();
  const prefersReducedMotion = useReducedMotion();
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
            <li>
              <Link
                className="transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                href="/icons"
              >
                Icons
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3 opacity-60" />
            </li>
            <li
              aria-current="page"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Icon Library
            </li>
          </ol>
        </motion.nav>

        {/* Header */}
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
            Icon Library
          </h1>
          <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
            Browse all available Iconiq icons. Each one is built with Motion and
            follows the Lucide design system.
          </p>
        </motion.header>

        {/* Bento grid */}
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
            className="border-neutral-200/40 lg:col-span-8 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="01">About</SectionLabel>
            <p className="font-sans text-neutral-500 text-sm leading-relaxed dark:text-neutral-400">
              All icons are copy-paste React components that live directly in
              your project. Built with Motion for smooth hover and interaction
              animations — consistent stroke weight and visual rhythm across
              every glyph.
            </p>
          </BentoMotion>

          {/* Stats */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-4 lg:col-start-9 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="02">Stats</SectionLabel>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-semibold text-2xl text-neutral-900 tabular-nums dark:text-white">
                  {icons.length}+
                </p>
                <p className="font-sans text-neutral-500 text-xs dark:text-neutral-400">
                  animated icons
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["motion", "lucide-design", "shadcn"].map((tag) => (
                  <span
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BentoMotion>

          {/* Icon grid */}
          <BentoMotion
            className="overflow-hidden border-neutral-200/40 px-0! py-0! lg:col-span-12 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <div className="px-4 pt-4 pb-3 sm:px-6 md:px-6">
              <SectionLabel accent="03">Browse</SectionLabel>
            </div>
            <div className="px-4 pb-6 sm:px-6">
              <IconsList icons={icons} />
            </div>
          </BentoMotion>
        </motion.div>
      </div>
    </main>
  );
}
