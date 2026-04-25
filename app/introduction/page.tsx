"use client";

import { Layers, LayoutGrid, Sparkles, Zap } from "lucide-react";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { getIcons } from "@/actions/get-icons";
import { DocsPageShell, DocsSection } from "@/components/docs/page-shell";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

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
  visible: { transition: { delayChildren: 0.06, staggerChildren: 0.07 } },
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
  },
];

const stack = [
  { label: "Framer Motion", note: "spring animations" },
  { label: "Lucide grid", note: "icon geometry" },
  { label: "shadcn/ui", note: "component base" },
  { label: "Tailwind CSS", note: "styling" },
];

const frameworks = ["Next.js", "Vite", "Remix", "Astro"];

export default function IntroductionPage() {
  const iconCount = getIcons().length;
  const componentCount =
    SITE_SECTIONS.find((s) => s.label === "Components")?.children.length ?? 0;
  const stats = [
    { value: `${iconCount}+`, label: "Animated icons" },
    { value: String(componentCount), label: "UI components" },
    { value: "0", label: "Runtime deps" },
    { value: "shadcn", label: "CLI compatible" },
  ];

  return (
    <DocsPageShell
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Getting Started" },
        { label: "Introduction" },
      ]}
      description="Iconiq is an open-source library of animated icons and motion UI components for React. It is built to feel precise in production, not just attractive in screenshots."
      eyebrow="Getting Started"
      meta={[
        { label: "Icons", value: `${iconCount}+ animated glyphs` },
        { label: "Components", value: `${componentCount} registry pages` },
        { label: "Workflow", value: "shadcn CLI compatible" },
      ]}
      title="Introduction"
    >
      <DocsSection
        className="lg:col-span-7"
        description="Instead of shipping an icon package you update as a dependency, Iconiq gives you individual React files that land directly in your codebase."
        index="01"
        title="What Iconiq Actually Is"
      >
        <div className="space-y-4 text-[15px] text-secondary leading-7">
          <p>
            Animations are authored with Motion and respect reduced-motion
            preferences. Icons follow the Lucide grid so they sit naturally
            beside existing Lucide usage.
          </p>
          <p>
            Components follow the same idea: install once, own the source, and
            adapt the styling or motion without waiting on an external release.
          </p>
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-5"
        description="A quick read on what ships today."
        index="02"
        title="At A Glance"
      >
        <div className="grid grid-cols-2 gap-4">
          {stats.map(({ value, label }) => (
            <div
              className="border border-border/80 bg-muted/[0.16] px-4 py-4"
              key={label}
            >
              <p className="text-2xl text-foreground tracking-[-0.05em]">
                {value}
              </p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-12"
        description="The design system stays intentionally narrow so the library is easy to reason about."
        index="03"
        title="Principles"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {principles.map(({ icon: Icon, title, desc }) => (
            <div
              className="border border-border/80 bg-muted/[0.16] px-4 py-4"
              key={title}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center border border-border/80 bg-background">
                  <Icon className="size-4 text-foreground" />
                </span>
                <h3 className="text-[17px] text-foreground tracking-[-0.03em]">
                  {title}
                </h3>
              </div>
              <p className="text-[14px] text-secondary leading-6">{desc}</p>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-12"
        description="Iconiq is built for the common modern React stacks rather than a single framework niche."
        index="04"
        title="Stack"
      >
        <div className="flex flex-wrap gap-3">
          {[
            ...stack.map((item) => `${item.label} - ${item.note}`),
            ...frameworks,
          ].map((item) => (
            <span
              className="border border-border/80 bg-muted/[0.16] px-3 py-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      </DocsSection>
    </DocsPageShell>
  );
}
