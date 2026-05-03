import { GitBranch, PackageCheck, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlockInstall } from "@/components/code-block-install";
import { DocsPageShell, DocsSection } from "@/components/docs/page-shell";
import { RegistryInstallBlock } from "@/components/registry-install-block";
import { SITE } from "@/constants";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: `Installation | ${SITE.NAME}`,
  description:
    "Install Iconiq components with the shadcn registry workflow, keep the generated files in your project, and work with editable React UI components directly in your codebase.",
  canonical: "/installation",
  ogTitle: `Install ${SITE.NAME} Components`,
  keywords: [
    "install shadcn registry components",
    "editable react components",
    "iconiq installation guide",
  ],
});

function hrefToSlug(href: string) {
  return href.split("/").pop() ?? href;
}

const installNotes = [
  {
    icon: Terminal,
    title: "Run one command",
    description: "Add a single component with the shadcn registry workflow.",
  },
  {
    icon: GitBranch,
    title: "Review the files",
    description: "The generated files land in your project for direct edits.",
  },
  {
    icon: PackageCheck,
    title: "Keep dependencies clear",
    description: "Supporting packages stay visible instead of being hidden.",
  },
];

const directUrlNotes = [
  "Useful when you want to reference a specific registry file directly.",
  "Follows the same add flow as the scoped component command.",
];

export default function InstallationPage() {
  const components =
    SITE_SECTIONS.find((section) => section.label === "Components")?.children ??
    [];

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
      description="Install any Iconiq component through the shadcn registry workflow. The process writes the component files directly into your project, so your team can review and adapt them immediately."
      eyebrow=""
      meta={[
        { label: "Catalog", value: `${components.length} documented entries` },
        { label: "Command", value: "shadcn add @iconiq/<name>" },
        { label: "Output", value: "local component files" },
      ]}
      title="Installation"
    >
      <DocsSection
        className="lg:col-span-12"
        description="Start with a single component, confirm the generated files, and then repeat the same flow across the rest of the registry."
        title="Install with the registry"
      >
        <div className="space-y-4">
          <CodeBlockInstall className="max-w-[620px]" componentName="button" />
          <div className="grid gap-3 md:grid-cols-3">
            {installNotes.map(({ icon: Icon, title, description }) => (
              <div
                className="space-y-2 border-border/70 border-t pt-4 first:border-t-0 first:pt-0"
                key={title}
              >
                <Icon className="size-4 text-foreground" />
                <div className="space-y-1.5">
                  <p className="font-medium text-[15px] text-foreground">
                    {title}
                  </p>
                  <p className="text-[14px] text-secondary leading-6">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-7"
        description="A few representative entries are listed below. The rest of the registry follows the same installation pattern."
        title="Sample registry entries"
      >
        <div className="space-y-3">
          {featuredComponents.map(({ label, href }) => {
            const slug = hrefToSlug(href);

            return (
              <div
                className="flex items-center justify-between gap-4 border-border/70 border-t py-3.5 first:border-t-0"
                key={href}
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium text-[15px] text-foreground">
                    {label}
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground tracking-[0.08em]">
                    @iconiq/{slug}
                  </p>
                </div>
                <Link
                  className="shrink-0 font-mono text-[11px] text-foreground tracking-[0.08em] transition-colors hover:text-secondary"
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
            className="inline-flex items-center font-mono text-[11px] text-foreground tracking-[0.08em] transition-colors hover:text-secondary"
            href="/components/button"
          >
            View components
          </Link>
        </div>
      </DocsSection>

      <DocsSection
        className="lg:col-span-5"
        description="Use the direct file path when you want to reference the registry JSON explicitly."
        title="Install from a registry URL"
      >
        <div className="space-y-4">
          <RegistryInstallBlock
            className="max-w-[620px]"
            registryPath="button.json"
          />
          <ul className="space-y-2 text-[14px] text-secondary leading-6">
            {directUrlNotes.map((note) => (
              <li className="flex gap-2.5" key={note}>
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/70"
                />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </DocsSection>
    </DocsPageShell>
  );
}
