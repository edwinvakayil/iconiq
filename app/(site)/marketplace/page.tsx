import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

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
import { LINK, SITE } from "@/constants";
import { BreadcrumbJsonLd } from "@/seo/breadcrumb-json-ld";
import { createMetadata } from "@/seo/metadata";

const marketplaceTagline = "Add registry components from inside your editor.";

export const metadata: Metadata = createMetadata({
  title: `Marketplace | ${SITE.NAME}`,
  description:
    "Install the Iconiq UI VS Code extension from the Marketplace to browse the registry catalog and add components without leaving your editor.",
  canonical: "/marketplace",
  ogTitle: `${SITE.NAME} VS Code Extension`,
  keywords: [
    "iconiq ui vscode extension",
    "vscode marketplace",
    "shadcn registry extension",
  ],
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Getting Started" },
  { label: "Marketplace" },
];

const sections = [
  { id: "vscode-extension", label: "VS Code extension" },
  { id: "compatible-editors", label: "Compatible editors" },
];

const pagerButtonClassName =
  "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const pageCopyContent = `# Marketplace

${marketplaceTagline}

If you prefer working in the IDE over copying install commands from the docs, the official ${SITE.NAME} extension puts the full registry catalog in your sidebar. It uses the same shadcn workflow as the terminal — the generated files still land in your project.

## VS Code extension

Published on the Visual Studio Code Marketplace. Open your project, pick a component, and let shadcn add the source locally.

- Catalog grouped by the same categories as these docs
- Base UI and Radix UI picker when both variants exist
- Installed state for components already in your project
- One-click jump to component documentation

Install: ${LINK.VSCODE_MARKETPLACE}

## Compatible editors

Built on the standard VS Code extension API — runs in Visual Studio Code, Cursor, Windsurf, and other compatible forks. AI coding tools such as GitHub Copilot, Cline, and Roo Code work alongside the sidebar. For agent-driven installs, see ${SITE.URL}/mcp.`;

export default function MarketplacePage() {
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
                        <h1 className={docsPageTitleClassName}>Marketplace</h1>
                        <p className={docsPageDescriptionClassName}>
                          {marketplaceTagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <DocsCopyActions
                          pageContent={pageCopyContent}
                          pageUrl="/marketplace"
                          sourceHref={`${LINK.GITHUB}/blob/main/app/marketplace/page.tsx`}
                          title="Marketplace"
                        />
                        <Link
                          aria-label="Go to Installation"
                          className={pagerButtonClassName}
                          href="/installation"
                          title="Installation"
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
                    If you prefer working in the IDE over copying install
                    commands from the docs, the official {SITE.NAME} extension
                    puts the full registry catalog in your sidebar. It uses the
                    same shadcn workflow as the terminal — the generated files
                    still land in your project.
                  </p>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className={docsPageSectionClassName}
                    id="vscode-extension"
                  >
                    <h2 className={docsPageSectionTitleClassName}>
                      VS Code extension
                    </h2>
                    <p>
                      The extension is published on the{" "}
                      <a
                        className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                        href={LINK.VSCODE_MARKETPLACE}
                        rel="noreferrer"
                        target="_blank"
                      >
                        VS Code Marketplace
                      </a>
                      . Open your project, pick a component, and let shadcn add
                      the source locally.
                    </p>
                    <ul className={docsPageListClassName}>
                      <li>
                        Catalog grouped by the same categories as these docs
                      </li>
                      <li>
                        Base UI and Radix UI picker when both variants exist
                      </li>
                      <li>
                        Installed state for components already in your project
                      </li>
                      <li>One-click jump to component documentation</li>
                    </ul>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section
                    className={docsPageSectionClassName}
                    id="compatible-editors"
                  >
                    <h2 className={docsPageSectionTitleClassName}>
                      Compatible editors
                    </h2>
                    <p>
                      Built on the standard VS Code extension API — runs in
                      Visual Studio Code, <strong>Cursor</strong>,{" "}
                      <strong>Windsurf</strong>, and other compatible forks.
                    </p>
                    <p>
                      AI coding tools such as GitHub Copilot, Cline, and Roo
                      Code work alongside the sidebar. They do not replace it.
                      If you want your assistant to install components for you,
                      use the{" "}
                      <Link
                        className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                        href="/mcp"
                      >
                        MCP setup guide
                      </Link>{" "}
                      instead.
                    </p>
                  </section>
                </PageReveal>
              </div>

              <PageReveal className="mt-12" inView>
                <nav className="flex items-center justify-between border-border/80 border-t pt-12">
                  <Link
                    className="group flex max-w-40 flex-col gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/installation"
                  >
                    <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
                      Previous
                    </span>
                    <span className="truncate font-medium text-foreground">
                      Installation
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
            editHref={`${LINK.GITHUB}/edit/main/app/marketplace/page.tsx`}
            sections={sections}
          />
        </div>
      </div>
    </main>
  );
}
