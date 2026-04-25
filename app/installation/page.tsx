"use client";

import { GitBranch, PackageCheck, Terminal } from "lucide-react";
import Link from "next/link";

import { CodeBlockInstall } from "@/components/code-block-install";
import { DocsPageShell, DocsSection } from "@/components/docs/page-shell";
import { RegistryInstallBlock } from "@/components/registry-install-block";
import { SITE_SECTIONS } from "@/lib/site-nav";

function hrefToSlug(href: string) {
  return href.split("/").pop() ?? href;
}

const steps = [
  {
    icon: Terminal,
    title: "Run the shadcn command",
    desc: "Use npx, pnpm dlx, yarn dlx, or bunx with shadcn@latest add @iconiq/<name> to pull a single component into your project.",
  },
  {
    icon: GitBranch,
    title: "Component lands in your project",
    desc: "The CLI writes the .tsx file directly into your codebase. No locked package boundary, no separate runtime wrapper, just source you can edit.",
  },
  {
    icon: PackageCheck,
    title: "Dependencies stay explicit",
    desc: "If a component needs Motion or another peer dependency, the registry metadata keeps that requirement visible instead of hiding it.",
  },
];

export default function InstallationPage() {
  const components =
    SITE_SECTIONS.find((s) => s.label === "Components")?.children ?? [];

  return (
    <DocsPageShell
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Getting Started" },
        { label: "Installation" },
      ]}
      description="Add any Iconiq component with the shadcn CLI. The install flow stays source-first, so the files land directly in your project instead of hiding behind a package boundary."
      eyebrow="Getting Started"
      meta={[
        { label: "Components", value: `${components.length} registry entries` },
        { label: "Method", value: "shadcn add @iconiq/<name>" },
        { label: "Format", value: "copy-paste source files" },
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
        description="Start with a common primitive, then swap the slug to any other component in the registry."
        index="02"
        title="Install A Component"
      >
        <CodeBlockInstall componentName="button" />
      </DocsSection>

      <DocsSection
        className="lg:col-span-7"
        description="Every documented component follows the same registry pattern."
        index="03"
        title="Available Registry Entries"
      >
        <div className="grid gap-3">
          {components.map(({ label, href }) => {
            const slug = hrefToSlug(href);
            return (
              <div
                className="flex items-center justify-between gap-4 border border-border/80 bg-muted/[0.12] px-4 py-3"
                key={href}
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
      </DocsSection>

      <DocsSection
        className="lg:col-span-5"
        description="Registry URLs are handy when you want to pin a direct source file instead of a scoped name."
        index="04"
        title="Direct URL Install"
      >
        <RegistryInstallBlock registryPath="button.json" />
      </DocsSection>
    </DocsPageShell>
  );
}
