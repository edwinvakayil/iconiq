"use client";

import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { RegistryInstallBlock } from "@/components/registry-install-block";
import { SidebarNav } from "@/components/sidebar-nav";
import { cn } from "@/lib/utils";
import Badge from "@/registry/badge";

const usageCode = `import Badge from "@/components/ui/badge";

export function NewFeatureTag() {
  return <Badge>New feature</Badge>;
}

// With custom colors
export function CustomBadge() {
  return (
    <Badge bgColor="#18181b" textColor="#fafafa" waveColor="rgba(255,255,255,0.12)">
      Custom
    </Badge>
  );
}`;

type DetailRow = {
  id: string;
  title: string;
  content: string;
  registryPath?: string;
};

const componentDetailsItems: DetailRow[] = [
  {
    id: "children",
    title: "children — required",
    content:
      "Any React node rendered inside the badge. Wrapped in a relative z-10 span so it always sits above the shimmer layer.",
  },
  {
    id: "className",
    title: "className — optional",
    content:
      "Merged onto the root motion.span. Use it to override size, border-radius, or spacing without touching the component source.",
  },
  {
    id: "bgColor",
    title: "bgColor — optional",
    content:
      "CSS color string applied as backgroundColor via inline style. When omitted the badge inherits bg-secondary from your theme.",
  },
  {
    id: "textColor",
    title: "textColor — optional",
    content:
      "CSS color string applied as color via inline style. When omitted the badge inherits text-secondary-foreground from your theme.",
  },
  {
    id: "waveColor",
    title: "waveColor — optional",
    content:
      'Center stop of the shimmer gradient. Defaults to hsl(var(--foreground) / 0.06). Pass any CSS color — e.g. "rgba(255,255,255,0.15)" for light-on-dark badges.',
  },
  {
    id: "framer-motion",
    title: "framer-motion",
    content:
      "Drives the spring scale-in on mount and the infinite looping shimmer sweep across the badge surface. Peer dependency — install separately.",
  },
  {
    id: "registry",
    title: "shadcn registry",
    content: "Only peer dependency is framer-motion.",
    registryPath: "badge.json",
  },
];

const DEMO_BADGES: {
  label: string;
  bgColor?: string;
  textColor?: string;
  waveColor?: string;
}[] = [
  { label: "New feature" },
  {
    label: "Beta",
    bgColor: "#eff6ff",
    textColor: "#1d4ed8",
    waveColor: "rgba(29,78,216,0.10)",
  },
  {
    label: "Deprecated",
    bgColor: "#fef2f2",
    textColor: "#b91c1c",
    waveColor: "rgba(185,28,28,0.10)",
  },
  {
    label: "Stable",
    bgColor: "#f0fdf4",
    textColor: "#15803d",
    waveColor: "rgba(21,128,61,0.10)",
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

export default function BadgePage() {
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
                  href="/components/badge"
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
                Badge
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
              Badge
            </h1>
            <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
              Inline label with a looping shimmer wave and spring entrance.
              Theme-aware by default, fully customisable with color overrides.
              Built with Framer Motion.
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
            {/* Live preview */}
            <BentoMotion
              className={cn(
                "relative overflow-hidden lg:col-span-8 lg:row-span-2",
                "rounded-3xl border-neutral-200/40 dark:border-neutral-700/30"
              )}
              variants={itemVariants}
            >
              <SectionLabel accent="01">Live preview</SectionLabel>
              <div className="mt-4 flex min-h-[160px] flex-1 flex-wrap items-center justify-center gap-3">
                {DEMO_BADGES.map((badge) => (
                  <Badge
                    bgColor={badge.bgColor}
                    key={badge.label}
                    textColor={badge.textColor}
                    waveColor={badge.waveColor}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </BentoMotion>

            {/* Install */}
            <BentoMotion
              className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="02">Install</SectionLabel>
              <div className="min-w-0 flex-1 [&>div]:mt-0">
                <CodeBlockInstall componentName="badge" />
              </div>
            </BentoMotion>

            {/* v0 */}
            <BentoMotion
              className="border-neutral-200/90 border-dashed lg:col-span-4 lg:col-start-9 lg:row-start-2 dark:border-neutral-700/80"
              variants={itemVariants}
            >
              <SectionLabel accent="03">v0</SectionLabel>
              <p className="mb-5 flex-1 font-sans text-neutral-500 text-sm leading-snug dark:text-neutral-400">
                Ship the registry bundle to v0 and iterate on motion or color
                with prompts.
              </p>
              <ComponentActions name="badge" />
            </BentoMotion>

            {/* Usage */}
            <BentoMotion
              className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-3 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="04">Usage</SectionLabel>
              <p className="mb-4 font-sans text-neutral-500 text-sm dark:text-neutral-400">
                Default export — see tile{" "}
                <span className="font-mono text-neutral-600 text-xs dark:text-neutral-300">
                  05
                </span>{" "}
                for{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  bgColor
                </code>
                ,{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  waveColor
                </code>
                , and packages.
              </p>
              <CodeBlock code={usageCode} language="tsx" variant="embedded" />
            </BentoMotion>

            {/* Dependencies */}
            <BentoMotion
              className="border-neutral-200/40 lg:col-span-12 lg:col-start-1 lg:row-start-4 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="05">Dependencies</SectionLabel>
              <p className="mb-3 font-sans text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                Registry peers — default export{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:bg-neutral-900">
                  Badge
                </code>
                .
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
    </div>
  );
}
