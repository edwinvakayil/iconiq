import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DocsPageRail } from "@/components/docs/component-page-rail";
import { DocsCopyActions } from "@/components/docs/docs-copy-actions";
import { DocsBreadcrumbs } from "@/components/docs/page-shell";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { LINK, SITE } from "@/constants";
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: `Introduction | ${SITE.NAME}`,
  description:
    "Learn what Iconiq is, how the registry workflow works, and why the library is designed for teams that want editable, fluid motion-powered React component files.",
  canonical: "/introduction",
  ogTitle: `Introduction to ${SITE.NAME}`,
  keywords: [
    "react component library introduction",
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

Iconiq is editable React components with fluid motion, built for real products.

## Philosophy

Great component libraries do more than save time. They help teams move faster without losing trust in the interface or ownership of the implementation.

When teams evaluate a UI library, they usually ask:

- Will these components still fit our product after customization?
- Can we inspect and change the source without fighting abstractions?
- Do the interactions feel polished enough to earn user trust?

Iconiq is built around a simple answer: quality should exist both in the surface experience and in the code your team installs. Components arrive through the shadcn registry workflow as local files, so motion, styling, structure, and accessibility can evolve inside your own codebase.

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
                          Introduction
                        </h1>
                        <p className="max-w-3xl text-base text-muted-foreground">
                          {SITE.NAME} is editable React components with fluid
                          motion, built for real products.
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

              <div className="mt-10 space-y-8 text-[15px] text-secondary leading-7">
                <PageReveal inView>
                  <p>
                    {SITE.NAME} is a curated collection of reusable React
                    components delivered through the shadcn registry workflow.
                    The goal is to help product teams ship precise, fluid
                    motion-powered interfaces without giving up control over the
                    code they install.
                  </p>
                </PageReveal>

                <PageReveal inView>
                  <section className="scroll-mt-28 space-y-4" id="philosophy">
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Philosophy
                    </h2>
                    <p>
                      Great component libraries do more than save time. They
                      shape how confidently a team can ship, how easily the
                      design can evolve, and whether the interface still feels
                      cohesive after months of product changes.
                    </p>
                    <p>
                      When teams evaluate a UI library, they usually ask
                      themselves a few practical questions:
                    </p>
                    <ul className="list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
                      <li>
                        Will these components still fit our product after
                        customization?
                      </li>
                      <li>
                        Can we inspect and change the source without fighting
                        abstractions?
                      </li>
                      <li>
                        Do the interactions feel polished enough to earn user
                        trust?
                      </li>
                    </ul>
                    <p>
                      {SITE.NAME} is built around a simple answer: quality
                      should exist both in the surface experience and in the
                      code your team installs. Components arrive as local files,
                      so motion, styling, structure, and accessibility can
                      evolve inside your own codebase instead of behind a
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
                  <section className="scroll-mt-28 space-y-4" id="community">
                    <h2 className="text-2xl text-foreground tracking-tight">
                      Community
                    </h2>
                    <p>
                      {SITE.NAME} is open source and meant to be adapted in real
                      products. If you want to follow updates, inspect the
                      source, or support the project, these are the best places
                      to start.
                    </p>
                    <ul className="space-y-3">
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
