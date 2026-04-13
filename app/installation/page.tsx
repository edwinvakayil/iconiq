"use client";

import {
  ChevronRight,
  ExternalLink,
  GitBranch,
  PackageCheck,
  Terminal,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { getIcons } from "@/actions/get-icons";
import { CliBlock, CliBlockUrl } from "@/components/cli-block";
import { SITE } from "@/constants";
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

// Derive the registry slug from a component href, e.g. "/components/motion-accordion" → "motion-accordion"
function hrefToSlug(href: string) {
  return href.split("/").pop() ?? href;
}

const steps = [
  {
    icon: Terminal,
    title: "Run the shadcn command",
    desc: "Use npx, pnpm, yarn, or bun with the short name — e.g. shadcn add @iconiq/bell for an icon or @iconiq/badge for a component.",
  },
  {
    icon: GitBranch,
    title: "Component lands in your project",
    desc: "The CLI writes the .tsx file directly into your components folder. No package to install, no lock-in — it's just your code.",
  },
  {
    icon: PackageCheck,
    title: "Framer Motion auto-installed",
    desc: "If framer-motion isn't in your project yet, the CLI adds it as a dependency automatically along with any other peer deps.",
  },
];

export default function InstallationPage() {
  const icons = getIcons();
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? bentoContainerStatic
    : bentoContainer;
  const itemVariants = prefersReducedMotion ? bentoItemStatic : bentoItem;

  const components =
    SITE_SECTIONS.find((s) => s.label === "Components")?.children ?? [];

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
              Installation
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
            Installation
          </h1>
          <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
            Add any Iconiq icon or component with a single shadcn CLI command.
            Works with npm, pnpm, yarn, and bun.
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
          {/* Row 1 — Steps + Icon install */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-5 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="01">How it works</SectionLabel>
            <ol className="flex flex-col gap-4">
              {steps.map(({ icon: Icon, title, desc }, i) => (
                <li className="flex items-start gap-3" key={title}>
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                    <Icon className="size-3.5" />
                  </span>
                  <div>
                    <p className="font-medium text-neutral-800 text-sm dark:text-neutral-200">
                      {i + 1}. {title}
                    </p>
                    <p className="mt-0.5 font-sans text-neutral-500 text-xs leading-relaxed dark:text-neutral-400">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/40 lg:col-span-7 lg:col-start-6 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="02">Install an icon</SectionLabel>
            <p className="mb-1 font-sans text-[13px] text-neutral-500 leading-relaxed dark:text-neutral-400">
              Replace the icon name with any of the{" "}
              <Link
                className="underline underline-offset-2 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                href="/icons"
              >
                {icons.length}+ available icons
              </Link>
              .
            </p>
            <div className="[&>div]:mt-0 [&>div]:max-w-full">
              <CliBlock
                icons={icons.filter((icon) => icon.name.length <= 20)}
              />
            </div>
          </BentoMotion>

          {/* Row 2 — Component list + URL fallback */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-7 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <SectionLabel accent="03">Install a component</SectionLabel>
            <p className="mb-4 font-sans text-[13px] text-neutral-500 leading-relaxed dark:text-neutral-400">
              All motion UI components follow the same install pattern — replace
              the slug with any component below.
            </p>
            <div className="mb-4 rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 font-mono text-[12px] dark:border-neutral-700 dark:bg-neutral-900/50">
              <span className="text-neutral-400 dark:text-neutral-500">
                npx shadcn@latest add{" "}
              </span>
              <span className="text-neutral-800 dark:text-neutral-200">
                @iconiq/
              </span>
              <span className="text-neutral-400 dark:text-neutral-500">
                &lt;slug&gt;
              </span>
            </div>
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {components.slice(0, 3).map(({ label, href }) => {
                const slug = hrefToSlug(href);
                return (
                  <li
                    className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                    key={slug}
                  >
                    <Link
                      className="font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                      href={href}
                    >
                      {label}
                    </Link>
                    <code className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      @iconiq/{slug}
                    </code>
                  </li>
                );
              })}
            </ul>
            <Link
              className="mt-3 inline-flex items-center gap-1 font-sans text-neutral-400 text-xs transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
              href="/components/motion-accordion"
            >
              View all {components.length} components
              <ChevronRight className="size-3" />
            </Link>
          </BentoMotion>

          <BentoMotion
            className="border-neutral-200/90 border-dashed lg:col-span-5 lg:col-start-8 dark:border-neutral-700/80"
            variants={itemVariants}
          >
            <SectionLabel accent="04">Full URL fallback</SectionLabel>
            <p className="mb-1 font-sans text-[13px] text-neutral-500 leading-snug dark:text-neutral-400">
              If the short name doesn't resolve in your environment, use the
              direct registry URL instead.
            </p>
            <div className="[&>div]:mt-0 [&>div]:max-w-full">
              <CliBlockUrl
                icons={icons.filter((icon) => icon.name.length <= 20)}
              />
            </div>
            <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900/40">
              <p className="mb-1.5 font-medium text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
                Registry root
              </p>
              <a
                className="inline-flex items-center gap-1.5 break-all font-mono text-[11px] text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                href={`${SITE.URL}/r`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {SITE.URL}/r/&lt;name&gt;.json
                <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>
            <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900/40">
              <p className="mb-1 font-medium text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
                Requirements
              </p>
              <ul className="space-y-1">
                {[
                  "React 18+",
                  "shadcn/ui init",
                  "framer-motion (auto)",
                  "Node.js 18+",
                ].map((req) => (
                  <li
                    className="flex items-center gap-2 font-sans text-[12px] text-neutral-500 dark:text-neutral-400"
                    key={req}
                  >
                    <span className="size-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </BentoMotion>

          {/* Nav */}
          <BentoMotion
            className="border-neutral-200/40 lg:col-span-12 dark:border-neutral-700/30"
            variants={itemVariants}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                className="inline-flex items-center gap-1.5 font-medium font-sans text-neutral-600 text-sm transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                href="/introduction"
              >
                <ChevronRight className="size-3.5 rotate-180" />
                Introduction
              </Link>
              <Link
                className="inline-flex items-center gap-1.5 font-medium font-sans text-neutral-600 text-sm transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                href="/icons"
              >
                Icon Library
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </BentoMotion>
        </motion.div>
      </div>
    </main>
  );
}
