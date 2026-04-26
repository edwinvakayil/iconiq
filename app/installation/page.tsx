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
    title: "Run the registry command",
    desc: "Use the shadcn CLI with your preferred package runner to install a single component directly into the application you are working on.",
  },
  {
    icon: GitBranch,
    title: "Review the generated source",
    desc: "The component is written into your codebase as local source, making it straightforward to inspect, adapt, and maintain with the rest of your product UI.",
  },
  {
    icon: PackageCheck,
    title: "Keep requirements explicit",
    desc: "If a component depends on Motion or other supporting packages, the registry keeps those requirements visible instead of hiding them behind a bundled abstraction.",
  },
];

export default function InstallationPage() {
  const components =
    SITE_SECTIONS.find((s) => s.label === "Components")?.children ?? [];
  const featuredComponents = components.filter(({ href }) =>
    [
      "/components/button",
      "/components/motion-accordion",
      "/components/combobox",
    ].includes(href)
  );

  return (
    <DocsPageShell
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Getting Started" },
        { label: "Installation" },
      ]}
      description="Install any Iconiq component through the shadcn registry workflow. The process keeps delivery source-based, so implementation files land directly in your project."
      eyebrow="Getting Started"
      meta={[
        { label: "Catalog", value: `${components.length} documented entries` },
        { label: "Command", value: "shadcn add @iconiq/<name>" },
        { label: "Output", value: "project-owned source files" },
      ]}
      title="Installation"
    >
      <DocsSection
        className="lg:col-span-5"
        description="The setup flow is intentionally concise so teams can move from evaluation to implementation with minimal overhead."
        index="01"
        title="How Installation Works"
      >
        <ol className="space-y-4">
          {steps.map(({ icon: Icon, title, desc }) => (
            <li className="flex gap-3" key={title}>
              <span className="flex size-8 items-center justify-center">
                <Icon className="size-4 text-foreground" />
              </span>
              <div>
                <p className="font-medium text-[15px] text-foreground">
                  {title}
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
        description="Start with a representative component, then replace the slug with any other entry in the registry."
        index="02"
        title="Install A Single Component"
      >
        <CodeBlockInstall componentName="button" />
      </DocsSection>

      <DocsSection
        className="lg:col-span-7"
        description="A small sample of the registry is shown here. The full component library follows the same installation pattern."
        index="03"
        title="Registry Catalog"
      >
        <div className="grid gap-3">
          {featuredComponents.map(({ label, href }) => {
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
                  View docs
                </Link>
              </div>
            );
          })}
        </div>
        <div className="pt-4">
          <Link
            className="inline-flex border border-border/85 bg-muted/[0.14] px-4 py-3 font-mono text-[10px] text-foreground uppercase tracking-[0.18em] transition-colors hover:bg-muted/45"
            href="/components/button"
          >
            View components
          </Link>
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-5"
        description="A direct registry URL is useful when your team wants to reference the component source file explicitly rather than rely on the scoped package name."
        index="04"
        title="Install From A Direct Registry URL"
      >
        <RegistryInstallBlock registryPath="button.json" />
      </DocsSection>
    </DocsPageShell>
  );
}
