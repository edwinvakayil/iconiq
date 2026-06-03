import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DocsPageRail } from "@/components/docs/component-page-rail";
import { DocsCopyActions } from "@/components/docs/docs-copy-actions";
import {
  docsPageArticleClassName,
  docsPageBodyClassName,
  docsPageDescriptionClassName,
  docsPageGridClassName,
  docsPageLinkListClassName,
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
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { createMetadata } from "@/seo/metadata";

const introductionTagline = `${SITE.NAME} is editable UI with minimal motion, built for clarity.`;

export const metadata: Metadata = createMetadata({
  title: `Introduction | ${SITE.NAME}`,
  description:
    "Learn what Iconiq is, how the registry workflow works, and why the library favors minimal motion and editable source files for standard, trustworthy interfaces.",
  canonical: "/introduction",
  ogTitle: `Introduction to ${SITE.NAME}`,
  keywords: [
    "ui library introduction",
    "registry ui workflow",
    "editable component files",
  ],
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Getting Started" },
  { label: "Introduction" },
];

const sections = [
  { id: "philosophy", label: "Philosophy" },
  { id: "community", label: "Community" },
];

const pageCopyContent = `# Introduction

${introductionTagline}

## Philosophy

Great component libraries do more than save time. They set a baseline — how much visual noise is acceptable, how interactions should feel, and whether the product stays coherent as it grows.

Iconiq is intentionally minimal. Motion is present, but never decorative. Every transition confirms an action, orients the user, or preserves spatial context — not performs. That restraint keeps interfaces feeling standard: predictable, calm, and aligned with patterns people already know from well-made products.

When teams evaluate a UI library, they usually ask:

- Will these components still fit our product after customization?
- Can we inspect and change the source without fighting abstractions?
- Do the interactions feel dependable without teaching users a new language?

Iconiq is built around a simple answer: quality lives in clarity, not complexity. Components arrive through the shadcn registry workflow as local files, so motion, styling, structure, and accessibility can evolve inside your own codebase.

That approach keeps adoption practical. You can review the implementation, adjust details to match your product, and keep moving without waiting on a package release cycle.

## Community

- GitHub Repository: ${LINK.GITHUB}
- Twitter/X: ${LINK.TWITTER}
- Support the project: ${SITE.URL}/sponsorship`;

const pagerButtonClassName =
  "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function IntroductionPage() {
  return (
    <main className="min-w-0 flex-1">
      <div className={docsPageShellClassName}>
        <BreadcrumbJsonLdClient items={breadcrumbs} />
        <div className={docsPageGridClassName}>
          <div className="min-w-0">
            <article className={docsPageArticleClassName}>
              <PageStagger delayChildren={0.04}>
                <PageStaggerItem>
                  <header className="space-y-3">
                    <DocsBreadcrumbs items={breadcrumbs} />

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl space-y-2">
                        <h1 className={docsPageTitleClassName}>Introduction</h1>
                        <p className={docsPageDescriptionClassName}>
                          {introductionTagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <DocsCopyActions
                          pageContent={pageCopyContent}
                          pageUrl="/introduction"
                          sourceHref={`${LINK.GITHUB}/blob/main/app/introduction/page.tsx`}
                          title="Introduction"
                        />
                        <Link
                          aria-label="Go to Installation"
                          className={pagerButtonClassName}
                          href="/installation"
                          title="Installation"
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
                    {SITE.NAME} is a curated collection of reusable UI delivered
                    through the shadcn registry workflow. The focus is
                    minimalism: restrained motion and familiar interaction
                    patterns that help teams ship interfaces users already know
                    how to read.
                  </p>
                </PageReveal>

                <PageReveal inView>
                  <section className={docsPageSectionClassName} id="philosophy">
                    <h2 className={docsPageSectionTitleClassName}>
                      Philosophy
                    </h2>
                    <p>
                      Great component libraries do more than save time. They set
                      a baseline — how much visual noise is acceptable, how
                      interactions should feel, and whether the product stays
                      coherent as it grows.
                    </p>
                    <p>
                      {SITE.NAME} is intentionally minimal. Motion is present,
                      but never decorative. Every transition confirms an action,
                      orients the user, or preserves spatial context — not
                      performs. That restraint keeps interfaces feeling
                      standard: predictable, calm, and aligned with patterns
                      people already know from well-made products.
                    </p>
                    <p>
                      When teams evaluate a UI library, they usually ask
                      themselves a few practical questions:
                    </p>
                    <ul className={docsPageListClassName}>
                      <li>
                        Will these components still fit our product after
                        customization?
                      </li>
                      <li>
                        Can we inspect and change the source without fighting
                        abstractions?
                      </li>
                      <li>
                        Do the interactions feel dependable without teaching
                        users a new language?
                      </li>
                    </ul>
                    <p>
                      {SITE.NAME} is built around a simple answer: quality lives
                      in clarity, not complexity. Components arrive as local
                      files, so motion, styling, structure, and accessibility
                      can evolve inside your own codebase instead of behind a
                      package boundary.
                    </p>
                    <p>
                      That approach keeps adoption practical. You can review the
                      implementation, adjust details to match your product, and
                      keep moving without waiting on an upstream release cycle.
                    </p>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <section className={docsPageSectionClassName} id="community">
                    <h2 className={docsPageSectionTitleClassName}>Community</h2>
                    <p>
                      {SITE.NAME} is open source and meant to be adapted in real
                      products. If you want to follow updates, inspect the
                      source, or support the project, these are the best places
                      to start.
                    </p>
                    <ul className={docsPageLinkListClassName}>
                      <li>
                        <a
                          className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                          href={LINK.GITHUB}
                          rel="noreferrer"
                          target="_blank"
                        >
                          GitHub Repository
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                          href={LINK.TWITTER}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Follow on Twitter/X
                        </a>
                      </li>
                      <li>
                        <Link
                          className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                          href="/sponsorship"
                        >
                          Support the project
                        </Link>
                      </li>
                    </ul>
                  </section>
                </PageReveal>
              </div>

              <PageReveal className="mt-12" inView>
                <nav className="flex items-center justify-between border-border/80 border-t pt-12">
                  <div />
                  <Link
                    className="group flex max-w-40 flex-col items-end gap-1 text-right text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href="/installation"
                  >
                    <span className="text-muted-foreground/75 transition-colors group-hover:text-muted-foreground">
                      Next
                    </span>
                    <span className="truncate font-medium text-foreground">
                      Installation
                    </span>
                  </Link>
                </nav>
              </PageReveal>
            </article>
          </div>

          <DocsPageRail
            editHref={`${LINK.GITHUB}/edit/main/app/introduction/page.tsx`}
            sections={sections}
          />
        </div>
      </div>
    </main>
  );
}
