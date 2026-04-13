"use client";

import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { getIcons } from "@/actions/get-icons";
import { ButtonSvgBuilder } from "@/components/button-svg-builder";
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

export default function ButtonSvgPage() {
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
              Button + Icon
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
            Button + Icon
          </h1>
          <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
            Pick any Iconiq icon, preview it inside a shadcn Button, then copy
            the complete snippet or run the CLI command.
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
          {/* Steps */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-4 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="01">How to use</SectionLabel>
            <ol className="flex flex-col gap-4">
              {[
                {
                  title: "Pick an icon",
                  desc: "Search or browse the icon grid and click to select.",
                },
                {
                  title: "Configure the button",
                  desc: "Set the button label and choose a variant: default, outline, ghost, and more.",
                },
                {
                  title: "Copy & install",
                  desc: "Grab the full JSX snippet and run the shadcn CLI command to add the icon.",
                },
              ].map((step, i) => (
                <li className="flex items-start gap-3" key={i}>
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 font-mono text-[10px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-neutral-800 text-sm dark:text-neutral-200">
                      {step.title}
                    </p>
                    <p className="mt-0.5 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </BentoMotion>

          {/* What you get */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-4 lg:col-start-5 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="02">What you get</SectionLabel>
            <ul className="flex flex-col gap-4">
              {[
                {
                  title: "Live preview",
                  desc: "Hover the button to see the icon animation play in real time before you copy anything.",
                },
                {
                  title: "Ready-to-paste JSX",
                  desc: "A complete Button + Icon snippet wired to the shadcn Button component with your chosen variant.",
                },
                {
                  title: "One-line install",
                  desc: "shadcn CLI command scoped to your package manager so the icon lands exactly where it belongs.",
                },
              ].map(({ title, desc }) => (
                <li className="flex items-start gap-3" key={title}>
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                  <div>
                    <p className="font-medium text-neutral-800 text-sm dark:text-neutral-200">
                      {title}
                    </p>
                    <p className="mt-0.5 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </BentoMotion>

          {/* Frameworks */}
          <BentoMotion
            className="border-neutral-200/90 border-dashed lg:col-span-4 lg:col-start-9 dark:border-neutral-700/80"
            variants={itemVariants}
          >
            <SectionLabel accent="03">Works with</SectionLabel>
            <p className="mb-4 font-sans text-neutral-500 text-sm leading-snug dark:text-neutral-400">
              Any React project using shadcn — no extra setup needed beyond the
              Button component and your chosen icon.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "Vite", "Remix", "Astro", "shadcn/ui"].map((fw) => (
                <span
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[10px] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                  key={fw}
                >
                  {fw}
                </span>
              ))}
            </div>
          </BentoMotion>

          {/* Builder — full width */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="04">Builder</SectionLabel>
            <ButtonSvgBuilder icons={icons} />
          </BentoMotion>
        </motion.div>
      </div>
    </main>
  );
}
