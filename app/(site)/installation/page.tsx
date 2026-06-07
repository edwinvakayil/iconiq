import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlockInstall } from "@/components/code-block-install";
import { DocsPageRail } from "@/components/docs/component-page-rail";
import { DocsCopyActions } from "@/components/docs/docs-copy-actions";
import {
  docsPageArticleClassName,
  docsPageBodyClassName,
  docsPageDescriptionClassName,
  docsPageGridClassName,
  docsPageListClassName,
  docsPageSectionClassName,
  docsPageSectionTitleClassName,
  docsPageShellClassName,
  docsPageTitleClassName,
} from "@/components/docs/docs-page-layout";
import { DocsBreadcrumbs } from "@/components/docs/page-shell";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { RegistryInstallBlock } from "@/components/registry-install-block";
import { LINK, SITE } from "@/constants";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { BreadcrumbJsonLd } from "@/seo/breadcrumb-json-ld";
import { createMetadata } from "@/seo/metadata";

const installationTagline =
  "Install editable, fluid motion-powered UI directly into your app.";

export const metadata: Metadata = createMetadata({
  title: `Installation | ${SITE.NAME}`,
  description:
    "Install Iconiq with the shadcn registry workflow, keep the generated files in your project, and work with editable, motion-refined UI directly in your codebase.",
  canonical: "/installation",
  ogTitle: `Install ${SITE.NAME} Components`,
  keywords: [
    "install shadcn registry components",
    "editable ui components",
    "iconiq installation guide",
  ],
});

function hrefToSlug(href: string) {
  return href.split("/").pop() ?? href;
}

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Getting Started" },
  { label: "Installation" },
];

const sections = [
  { id: "registry-workflow", label: "Registry workflow" },
  { id: "registry-url", label: "Registry URL" },
  { id: "sample-entries", label: "Sample entries" },
];

const pagerButtonClassName =
  "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function InstallationPage() {
  const allComponents = SITE_SECTIONS.flatMap((section) => [
    ...section.children,
  ]);

  const featuredComponents = allComponents.filter(({ href }) =>
    [
      "/buttons-and-actions/button",
      "/navigation/accordion",
      "/inputs-and-forms/combobox",
    ].includes(href)
  );

  const pageCopyContent = `# Installation

${installationTagline}

## Registry workflow

1. Run the install command for the component you want.
2. Let shadcn add the component source and supporting dependencies to your project.
3. Review the generated files locally and adjust them to match your product.

Example command:

pnpm dlx shadcn@latest add @iconiq/b-button

## Registry URL

If you want to reference the registry JSON directly, you can also install from:

pnpm dlx shadcn@latest add ${SITE.URL}/r/b-button.json

## Sample entries

${featuredComponents
  .map(({ label, href }) => `- ${label}: ${SITE.URL}${href}`)
  .join("\n")}`;

  return (
    <main className="min-w-0 flex-1">
      <div className={docsPageShellClassName}>
        <BreadcrumbJsonLd items={breadcrumbs} />
        <div className={docsPageGridClassName}>
          <div className="min-w-0">
            <article className={docsPageArticleClassName}>
              <PageStagger delayChildren={0.04}>
                <PageStaggerItem>
                  <header className="space-y-3">
                    <DocsBreadcrumbs items={breadcrumbs} />

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl space-y-2">
                        <h1 className={docsPageTitleClassName}>Installation</h1>
                        <p className={docsPageDescriptionClassName}>
                          {installationTagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <DocsCopyActions
                          pageContent={pageCopyContent}
                          pageUrl="/installation"
                          sourceHref={`${LINK.GITHUB}/blob/main/app/installation/page.tsx`}
                          title="Installation"
                        />
                        <Link
                          aria-label="Go to Introduction"
                          className={pagerButtonClassName}
                          href="/introduction"
                          title="Introduction"
                        >
                          <ChevronLeft className="size-4" />
                        </Link>
                        <Link
                          aria-label="Go to MCP"
                          className={pagerButtonClassName}
                          href="/mcp"
                          title="MCP"
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </header>
                </PageStaggerItem>
              </PageStagger>

              <div className={docsPageBodyClassName}>
                <PageReveal inView>
                  <p>
                    The installation flow is intentionally simple: pick a
                    component, run the command, and keep the generated source
                    files inside your own app. That gives your team immediate
                    ownership over fluid motion, styling, structure, and
                    accessibility decisions.
                  </p>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className={docsPageSectionClassName}
                    id="registry-workflow"
                  >
                    <h2 className={docsPageSectionTitleClassName}>
                      Registry workflow
                    </h2>
                    <p>
                      The default path mirrors the way shadcn-style registries
                      are meant to be used. Install a single component first,
                      confirm the generated files look right in your project,
                      and then repeat the same flow as your interface grows.
                    </p>
                    <CodeBlockInstall
                      className="max-w-[720px]"
                      componentName="button"
                    />
                    <ul className={docsPageListClassName}>
                      <li>
                        Run one command for the component you want to add.
                      </li>
                      <li>
                        Let the registry place the implementation and any
                        required helper files directly in your codebase.
                      </li>
                      <li>
                        Review the files locally and adjust them to match your
                        product conventions.
                      </li>
                    </ul>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className={docsPageSectionClassName}
                    id="registry-url"
                  >
                    <h2 className={docsPageSectionTitleClassName}>
                      Registry URL
                    </h2>
                    <p>
                      If you want to reference a specific registry file
                      directly, you can install from the hosted JSON path
                      instead of the scoped package name. This is useful when
                      you want the exact source URL in front of you during
                      review or automation.
                    </p>
                    <RegistryInstallBlock
                      className="max-w-[720px]"
                      registryPath="button.json"
                    />
                    <ul className={docsPageListClassName}>
                      <li>
                        The direct URL follows the same shadcn add flow as the
                        scoped component command.
                      </li>
                      <li>
                        Most entries install as a single self-contained
                        component file through the same registry flow.
                      </li>
                      <li>
                        It works well when you want to point teammates or
                        tooling at a specific registry entry.
                      </li>
                    </ul>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className={docsPageSectionClassName}
                    id="sample-entries"
                  >
                    <h2 className={docsPageSectionTitleClassName}>
                      Sample entries
                    </h2>
                    <p>
                      Every documented component follows the same installation
                      pattern. Here are a few representative entries you can
                      open right away.
                    </p>
                    <div className="max-w-[720px] space-y-1">
                      {featuredComponents.map(({ label, href }) => {
                        const slug = hrefToSlug(href);

                        return (
                          <div
                            className="flex items-center justify-between gap-4 border-border/80 border-t py-3.5 first:border-t-0"
                            key={href}
                          >
                            <div className="min-w-0 space-y-1">
                              <p className="font-medium text-foreground">
                                {label}
                              </p>
                              <p className="font-mono text-[11px] text-muted-foreground tracking-[0.08em]">
                                @iconiq/{slug}
                              </p>
                            </div>
                            <Link
                              className="shrink-0 text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                              href={href}
                            >
                              View docs
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                    <p>
                      Browse the full catalog from the component docs and use
                      the same install flow whenever you want to add another
                      piece to your interface.
                    </p>
                  </section>
                </PageReveal>
              </div>

              <PageReveal className="mt-12" inView>
                <nav className="flex items-center justify-between border-border/80 border-t pt-12">
                  <Link
                    className="group flex max-w-40 flex-col gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/introduction"
                  >
                    <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
                      Previous
                    </span>
                    <span className="truncate font-medium text-foreground">
                      Introduction
                    </span>
                  </Link>
                  <Link
                    className="group flex max-w-40 flex-col items-end gap-1 text-right text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/mcp"
                  >
                    <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
                      Next
                    </span>
                    <span className="truncate font-medium text-foreground">
                      MCP
                    </span>
                  </Link>
                </nav>
              </PageReveal>
            </article>
          </div>

          <DocsPageRail
            editHref={`${LINK.GITHUB}/edit/main/app/installation/page.tsx`}
            sections={sections}
          />
        </div>
      </div>
    </main>
  );
}
