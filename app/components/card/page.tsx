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
import { InfoCard } from "@/registry/card";

const usageCode = `import { InfoCard } from "@/components/ui/card";

export function FeaturedCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <InfoCard
        imageSrc="/photo.jpg"
        title="Mountain retreat"
        description="A quiet cabin with views and slow mornings by the fire."
        index={0}
      />
      <InfoCard
        imageSrc="/photo-2.jpg"
        title="Coastal studio"
        description="Light-filled workspace a few blocks from the water."
        index={1}
      />
    </div>
  );
}`;

type DetailRow = { id: string; title: string; content: string };

const componentDetailsItems: DetailRow[] = [
  {
    id: "imageSrc",
    title: "imageSrc (required)",
    content:
      "URL or path for the hero image. The image uses object-cover inside a fixed-height frame with a subtle zoom on hover.",
  },
  {
    id: "title",
    title: "title (required)",
    content:
      "Card heading, also passed as the image alt text for basic accessibility.",
  },
  {
    id: "description",
    title: "description (required)",
    content:
      "Body copy in a scrollable area when text is long; uses muted foreground styling.",
  },
  {
    id: "index",
    title: "index (optional)",
    content:
      "Defaults to 0. Staggers the entrance animation delay (index × 0.12s) when rendering multiple cards in a list.",
  },
  {
    id: "framer-motion",
    title: "framer-motion",
    content:
      "Springs on rotateX/rotateY from pointer position, whileHover lift and shadow, whileTap scale, and image scale on hover.",
  },
  {
    id: "behavior",
    title: "Interaction model",
    content:
      "Pointer move over the card drives subtle 3D tilt; leaving resets springs. Cursor is pointer — wire onClick on a wrapper if you need navigation.",
  },
  {
    id: "a11y",
    title: "Accessibility",
    content:
      "Semantic heading and img with alt from title. Heavy motion users may prefer wrapping with reduced-motion checks in your app.",
  },
  {
    id: "registry",
    title: "shadcn registry",
    content:
      "Install adds card.tsx as components/ui/card; peer dependency is framer-motion.",
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

export default function CardPage() {
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
                Info card
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
              Info card
            </h1>
            <p className="mt-2 font-sans text-[15px] text-neutral-500 leading-relaxed dark:text-neutral-400">
              Media card with 3D tilt on pointer move, staggered entrance, and
              hover lift. Built with Framer Motion and your theme tokens.
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
              <span
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-sky-50/55 blur-3xl dark:bg-sky-300/10"
              />
              <SectionLabel accent="01">Live preview</SectionLabel>
              <div className="relative mt-1 min-h-0 flex-1">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    description="Founded in 1902, Real Madrid is one of the world’s most decorated clubs, with a record haul of European Cups and a global fanbase. The first team plays at the Santiago Bernabéu in Chamartín, where match nights turn the city white. From Di Stéfano and Raúl to today’s squad, the club’s history is built on attacking football and the relentless pursuit of trophies."
                    imageSrc="/assets/rma.webp"
                    index={0}
                    title="Real Madrid"
                  />
                  <InfoCard
                    description="Formed as Newton Heath in 1878 and renamed in 1902, Manchester United is England’s most successful club in the modern era, with a long line of league titles and European nights. Home matches are played at Old Trafford, the Theatre of Dreams, where generations of supporters have seen Busby’s Babes, the Class of ’92, and decades of teams compete for trophies in red."
                    imageSrc="/assets/manutd.avif"
                    index={1}
                    title="Manchester United"
                  />
                </div>
              </div>
            </BentoMotion>

            <BentoMotion
              className="justify-between border-neutral-200/40 lg:col-span-4 lg:col-start-9 lg:row-start-1 dark:border-neutral-700/30"
              variants={itemVariants}
            >
              <SectionLabel accent="02">Install</SectionLabel>
              <div className="min-w-0 flex-1 [&>div]:mt-0">
                <CodeBlockInstall componentName="card" />
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
                  imageSrc
                </code>
                ,{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  title
                </code>
                ,{" "}
                <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[11px] dark:bg-neutral-900">
                  description
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
                  InfoCard
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
