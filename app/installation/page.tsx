"use client";

import { GitBranch, PackageCheck, Terminal } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { getIcons } from "@/actions/get-icons";
import { CliBlock, CliBlockUrl } from "@/components/cli-block";
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

// Derive the registry slug from a component href, e.g. "/components/motion-accordion" → "motion-accordion"
function hrefToSlug(href: string) {
  return href.split("/").pop() ?? href;
}

const steps = [
  {
    icon: Terminal,
    title: "Run the shadcn command",
    desc: "Use npx, pnpm dlx, yarn dlx, or bunx --bun with shadcn@latest add @iconiq/<name> — e.g. @iconiq/bell for an icon or @iconiq/badge for a component.",
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
  const components =
    SITE_SECTIONS.find((s) => s.label === "Components")?.children ?? [];

  return (
    <DocsPageShell
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Getting Started" },
        { label: "Installation" },
      ]}
      description="Add any Iconiq icon or component with the shadcn CLI. The install flow stays source-first, so the files land directly in your project instead of hiding behind a package boundary."
      eyebrow="Getting Started"
      meta={[
        { label: "Icons", value: `${icons.length}+ installable glyphs` },
        { label: "Components", value: `${components.length} registry entries` },
        { label: "Method", value: "shadcn add @iconiq/<name>" },
      ]}
      title="Installation"
    >
      <DocsSection
        className="lg:col-span-5"
        description="The install flow is intentionally short."
        index="01"
        title="How It Works"
      >
        <ol className="space-y-4">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <li className="flex gap-3" key={title}>
              <span className="flex size-8 items-center justify-center border border-border/80 bg-muted/[0.16]">
                <Icon className="size-4 text-foreground" />
              </span>
              <div>
                <p className="font-medium text-[15px] text-foreground">
                  {i + 1}. {title}
                </p>
                <p className="mt-1 text-[14px] text-secondary leading-6">
                  {desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </DocsSection>

      <DocsSection
        className="lg:col-span-7"
        description="Pick any icon name and copy the command directly."
        index="02"
        title="Install An Icon"
      >
        <CliBlock icons={icons.filter((icon) => icon.name.length <= 20)} />
      </DocsSection>

      <DocsSection
        className="lg:col-span-7"
        description="Components follow the exact same registry pattern."
        index="03"
        title="Install A Component"
      >
        <div className="space-y-4">
          <div className="border border-border/80 bg-muted/[0.16] px-4 py-3 font-mono text-[12px] text-secondary">
            npx shadcn@latest add @iconiq/&lt;slug&gt;
          </div>
          <div className="grid gap-3">
            {components.slice(0, 6).map(({ label, href }) => {
              const slug = hrefToSlug(href);
              return (
                <div
                  className="flex items-center justify-between gap-4 border border-border/80 bg-muted/[0.12] px-4 py-3"
                  key={slug}
                >
                  <div>
                    <p className="font-medium text-[15px] text-foreground">
                      {label}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                      @iconiq/{slug}
                    </p>
                  </div>
                  <Link
                    className="font-mono text-[10px] text-foreground uppercase tracking-[0.18em]"
                    href={href}
                  >
                    Open page
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-5"
        description="Registry URLs are handy when you want to pin a specific file path."
        index="04"
        title="Direct URL Install"
      >
        <CliBlockUrl staticIconName="badge" />
      </DocsSection>
    </DocsPageShell>
  );
}
