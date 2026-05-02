import { Layers, LayoutGrid, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";

import { DocsPageShell, DocsSection } from "@/components/docs/page-shell";
import { SITE } from "@/constants";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: `Introduction | ${SITE.NAME}`,
  description:
    "Learn what Iconiq is, how the registry workflow works, and why the library is designed for teams that want editable React component files.",
  canonical: "/introduction",
  ogTitle: `Introduction to ${SITE.NAME}`,
  keywords: [
    "react component library introduction",
    "registry ui workflow",
    "editable component files",
  ],
});

const principles = [
  {
    icon: Layers,
    title: "Editable components by default",
    desc: "Each component is installed directly into your application, giving your team immediate control over structure, styling, and interaction behavior.",
  },
  {
    icon: LayoutGrid,
    title: "Curated component scope",
    desc: "The library stays intentionally focused on high-utility primitives that support common interface workflows without unnecessary surface area.",
  },
  {
    icon: Sparkles,
    title: "Motion with a clear role",
    desc: "Animation is used to communicate hierarchy, state, and transition feedback so the interface feels responsive without becoming decorative.",
  },
  {
    icon: Zap,
    title: "Practical adoption flow",
    desc: "The registry workflow is designed for speed: install a component, review the source locally, and adapt it inside your own codebase.",
  },
];

export default function IntroductionPage() {
  const componentCount =
    SITE_SECTIONS.find((s) => s.label === "Components")?.children.length ?? 0;
  const stats = [
    { value: String(componentCount), label: "Documented components" },
    { value: "React", label: "Framework target" },
    { value: "Direct", label: "Ownership model" },
    { value: "shadcn", label: "Registry workflow" },
  ];

  return (
    <DocsPageShell
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Getting Started" },
        { label: "Introduction" },
      ]}
      description="Iconiq is an open-source React component library for teams that want implementation ownership, polished interaction patterns, and documentation built for real adoption."
      eyebrow=""
      meta={[
        { label: "Library", value: `${componentCount} documented entries` },
        { label: "Delivery", value: "local files" },
        { label: "Install", value: "registry compatible" },
      ]}
      title="Introduction"
    >
      <DocsSection
        className="lg:col-span-7"
        description="Instead of wrapping components behind a package boundary, Iconiq installs real React files that become part of your application."
        index="01"
        title="What Iconiq Provides"
      >
        <div className="space-y-4 text-[15px] text-secondary leading-7">
          <p>
            Components are built with Motion, respect reduced-motion
            preferences, and are tuned for interfaces that need to feel precise
            rather than overstyled.
          </p>
          <p>
            The model favors ownership over abstraction. Once installed, the
            component files live in your codebase, making it easier to review,
            customize, and evolve each primitive without depending on upstream
            release cycles.
          </p>
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-5"
        description="A concise summary of the current library and delivery model."
        index="02"
        title="Overview"
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
        description="The library is shaped by a small set of practical decisions that keep it easier to evaluate, adopt, and maintain."
        index="03"
        title="Design Principles"
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
    </DocsPageShell>
  );
}
