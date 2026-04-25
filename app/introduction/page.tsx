"use client";

import { Layers, LayoutGrid, Sparkles, Zap } from "lucide-react";

import { DocsPageShell, DocsSection } from "@/components/docs/page-shell";
import { SITE_SECTIONS } from "@/lib/site-nav";

const principles = [
  {
    icon: Layers,
    title: "Source-first delivery",
    desc: "Every component installs as real project code, so teams can adjust motion, structure, and styling without waiting on a package release.",
  },
  {
    icon: LayoutGrid,
    title: "Focused component set",
    desc: "Iconiq stays intentionally narrow with reusable UI primitives that cover common product patterns instead of chasing endless surface area.",
  },
  {
    icon: Sparkles,
    title: "Motion with intent",
    desc: "Animation is there to clarify state changes, hierarchy, and interaction feedback rather than to decorate otherwise static UI.",
  },
  {
    icon: Zap,
    title: "Fast installation",
    desc: "The shadcn-style workflow keeps adoption light: copy a command, pull a file into your app, and keep moving.",
  },
];

const stack = [
  { label: "Motion", note: "interaction and state animation" },
  { label: "TypeScript", note: "typed component APIs" },
  { label: "shadcn registry", note: "source-first delivery" },
  { label: "Tailwind CSS", note: "styling layer" },
];

const frameworks = ["Next.js", "Vite", "Remix", "Astro"];

export default function IntroductionPage() {
  const componentCount =
    SITE_SECTIONS.find((s) => s.label === "Components")?.children.length ?? 0;
  const stats = [
    { value: String(componentCount), label: "Registry components" },
    { value: String(frameworks.length), label: "Common app stacks" },
    { value: "0", label: "Lock-in layers" },
    { value: "shadcn", label: "CLI compatible" },
  ];

  return (
    <DocsPageShell
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Getting Started" },
        { label: "Introduction" },
      ]}
      description="Iconiq is an open-source library of motion-powered UI components for React. It is built to feel precise in production, not just attractive in screenshots."
      eyebrow="Getting Started"
      meta={[
        { label: "Components", value: `${componentCount} registry pages` },
        { label: "Workflow", value: "source first" },
        { label: "Install", value: "shadcn compatible" },
      ]}
      title="Introduction"
    >
      <DocsSection
        className="lg:col-span-7"
        description="Instead of hiding primitives behind a package boundary, Iconiq gives you React files that land directly in your codebase."
        index="01"
        title="What Iconiq Actually Is"
      >
        <div className="space-y-4 text-[15px] text-secondary leading-7">
          <p>
            Components are authored with Motion, respect reduced-motion
            preferences, and are designed to feel calm in real product UIs.
          </p>
          <p>
            The library favors ownership over abstraction: install once, keep
            the source, and adapt each primitive to match your app without
            waiting on an upstream release cycle.
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
        description="The system stays intentionally narrow so the library is easier to reason about."
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
        description="Iconiq is built for the common modern React stacks rather than a narrow framework niche."
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
