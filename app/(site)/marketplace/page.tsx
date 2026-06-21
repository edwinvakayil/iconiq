import type { Metadata } from "next";
import Link from "next/link";

import {
  docsPageListClassName,
  docsPageSectionClassName,
  docsPageSectionTitleClassName,
  guidePageBodyClassName,
} from "@/components/docs/docs-page-layout";
import { GuideDocsPage } from "@/components/docs/page-shell";
import { PageReveal } from "@/components/page-reveal";
import { LINK, SITE } from "@/constants";
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

export default function MarketplacePage() {
  return (
    <GuideDocsPage
      breadcrumbs={breadcrumbs}
      description={marketplaceTagline}
      pageUrl="/marketplace"
      title="Marketplace"
    >
      <div className={guidePageBodyClassName}>
        <PageReveal inView>
          <p>
            If you prefer working in the IDE over copying install commands from
            the docs, the official {SITE.NAME} extension puts the full registry
            catalog in your sidebar. It uses the same shadcn workflow as the
            terminal — the generated files still land in your project.
          </p>
        </PageReveal>

        <PageReveal inView>
          <section className={docsPageSectionClassName} id="vscode-extension">
            <h2 className={docsPageSectionTitleClassName}>VS Code extension</h2>
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
              . Open your project, pick a component, and let shadcn add the
              source locally.
            </p>
            <ul className={docsPageListClassName}>
              <li>Catalog grouped by the same categories as these docs</li>
              <li>Base UI and Radix UI picker when both variants exist</li>
              <li>Installed state for components already in your project</li>
              <li>One-click jump to component documentation</li>
            </ul>
          </section>
        </PageReveal>

        <PageReveal inView>
          <section className={docsPageSectionClassName} id="compatible-editors">
            <h2 className={docsPageSectionTitleClassName}>
              Compatible editors
            </h2>
            <p>
              Built on the standard VS Code extension API — runs in Visual
              Studio Code, <strong>Cursor</strong>, <strong>Antigravity</strong>
              , and other compatible forks.
            </p>
            <p>
              AI coding tools such as GitHub Copilot, Cline, and Roo Code work
              alongside the sidebar. They do not replace it. If you want your
              assistant to install components for you, use the{" "}
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
            <span className="truncate font-medium text-foreground">MCP</span>
          </Link>
        </nav>
      </PageReveal>
    </GuideDocsPage>
  );
}
