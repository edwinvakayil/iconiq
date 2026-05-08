import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlockInstall } from "@/components/code-block-install";
import { DocsPageRail } from "@/components/docs/component-page-rail";
import { DocsCopyActions } from "@/components/docs/docs-copy-actions";
import { DocsBreadcrumbs } from "@/components/docs/page-shell";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { RegistryInstallBlock } from "@/components/registry-install-block";
import { LINK, SITE } from "@/constants";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: `Installation | ${SITE.NAME}`,
  description:
    "Install Iconiq components with the shadcn registry workflow, keep the generated files in your project, and work with editable, fluid motion-powered React UI components directly in your codebase.",
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
  const components =
    SITE_SECTIONS.find((section) => section.label === "Components")?.children ??
    [];

  const featuredComponents = components.filter(({ href }) =>
    [
      "/components/button",
      "/components/accordion",
      "/components/combobox",
    ].includes(href)
  );

  const pageCopyContent = `# Installation

Install editable, fluid motion-powered React components directly into your app.

## Registry workflow

1. Run the install command for the component you want.
2. Let shadcn add the files and supporting dependencies to your project.
3. Review the generated files locally and adjust them to match your product.

Example command:

pnpm dlx shadcn@latest add @iconiq/button

## Registry URL

If you want to reference the registry JSON directly, you can also install from:

pnpm dlx shadcn@latest add ${SITE.URL}/r/button.json

## Sample entries

${featuredComponents
  .map(({ label, href }) => `- ${label}: ${SITE.URL}${href}`)
  .join("\n")}`;

  return (
    <main className="min-w-0 flex-1">
      <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <BreadcrumbJsonLdClient items={breadcrumbs} />
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_248px] xl:gap-4">
          <div className="min-w-0">
            <article className="min-w-0 max-w-4xl">
              <PageStagger delayChildren={0.04}>
                <PageStaggerItem>
                  <header className="space-y-3">
                    <DocsBreadcrumbs items={breadcrumbs} />

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl space-y-2">
                        <h1 className="scroll-m-20 font-semibold text-3xl text-foreground tracking-tighter">
                          Installation
                        </h1>
                        <p className="max-w-3xl text-base text-muted-foreground">
                          Install editable, fluid motion-powered React
                          components directly into your app.
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
                          aria-label="Go to Components"
                          className={pagerButtonClassName}
                          href="/components"
                          title="Components"
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </header>
                </PageStaggerItem>
              </PageStagger>

              <div className="mt-10 space-y-8 text-[15px] text-secondary leading-7">
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
                    className="scroll-mt-28 space-y-5"
                    id="registry-workflow"
                  >
                    <h2 className="text-2xl text-foreground tracking-tight">
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
                    <ul className="list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
                      <li>
                        Run one command for the component you want to add.
                      </li>
                      <li>
                        Let the registry place the implementation directly in
                        your codebase.
                      </li>
                      <li>
                        Review the files locally and adjust them to match your
                        product conventions.
                      </li>
                    </ul>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section className="scroll-mt-28 space-y-5" id="registry-url">
                    <h2 className="text-2xl text-foreground tracking-tight">
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
                    <ul className="list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
                      <li>
                        The direct URL follows the same shadcn add flow as the
                        scoped component command.
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
                    className="scroll-mt-28 space-y-5"
                    id="sample-entries"
                  >
                    <h2 className="text-2xl text-foreground tracking-tight">
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
                              <p className="font-medium text-[15px] text-foreground">
                                {label}
                              </p>
                              <p className="font-mono text-[11px] text-muted-foreground tracking-[0.08em]">
                                @iconiq/{slug}
                              </p>
                            </div>
                            <Link
                              className="shrink-0 text-foreground text-sm underline underline-offset-4 transition-colors hover:text-muted-foreground"
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
                    href="/components"
                  >
                    <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
                      Next
                    </span>
                    <span className="truncate font-medium text-foreground">
                      Components
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
