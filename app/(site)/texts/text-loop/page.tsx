import type { Metadata } from "next";

import { textLoopApiDetails } from "@/components/docs/component-api";
import { ComponentDemoCanvas } from "@/components/docs/component-demo-canvas";
import { ComponentInstallationTabs } from "@/components/docs/component-installation-tabs";
import { DocsPageRail } from "@/components/docs/component-page-rail";
import {
  docsPageArticleClassName,
  docsPageDescriptionClassName,
  docsPageGridClassName,
  docsPageShellClassName,
  docsPageTitleClassName,
} from "@/components/docs/docs-page-layout";
import { PageCopyActions } from "@/components/docs/page-copy-actions";
import {
  type BreadcrumbItem,
  DetailLedger,
  DocsBreadcrumbs,
  SectionPager,
  SectionPrevNextNav,
} from "@/components/docs/page-shell";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { LINK } from "@/constants";
import { getComponentV0Page } from "@/lib/component-v0-pages";
import { TextLoop } from "@/registry/text-loop";
import { BreadcrumbJsonLd } from "@/seo/breadcrumb-json-ld";
import { createMetadata } from "@/seo/metadata";

const textLoopDescription =
  "Cycling text with vertical slide transitions—pass your own items and interval.";

export const metadata: Metadata = createMetadata({
  title: "Text Loop",
  canonical: "/texts/text-loop",
  description: textLoopDescription,
  keywords: [
    "text loop",
    "cycling text",
    "animated text rotation",
    "react text carousel",
    "motion typography",
  ],
  ogTitle: "Text Loop",
});

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Text Loop" },
];

const description = textLoopDescription;

const usageCode = `"use client";

import { TextLoop } from "@/components/ui/text-loop";

export function RotatingHeadline() {
  return (
    <p className="max-w-4xl font-light text-lg text-foreground tracking-tight sm:text-xl">
      <TextLoop interval={1}>
        <span>Design</span>
        <span>Build</span>
        <span>Ship</span>
        <span>Iterate</span>
      </TextLoop>{" "}
      software that ships faster.
    </p>
  );
}`;

function TextDocsSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PageReveal inView>
      <section className="scroll-mt-32" id={id}>
        <h2 className="mt-16 border-border/80 border-b pb-4 font-semibold text-xl tracking-tight first:mt-0">
          {title}
        </h2>
        <div className="pt-6">{children}</div>
      </section>
    </PageReveal>
  );
}

function TextLoopPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10 text-center sm:min-h-[340px]">
      <p className="max-w-4xl font-light text-foreground text-lg tracking-tight sm:text-xl">
        <TextLoop interval={1}>
          <span>Design</span>
          <span>Build</span>
          <span>Ship</span>
          <span>Iterate</span>
        </TextLoop>{" "}
        software that ships faster.
      </p>
    </div>
  );
}

export default function TextLoopPage() {
  const pageContent = [
    "# Text Loop",
    description,
    "",
    "## Installation",
    "npx shadcn@latest add @iconiq/text-loop",
    "",
    "## Usage",
    usageCode.trim(),
  ].join("\n");

  const v0PageCode = getComponentV0Page("text-loop", usageCode);

  return (
    <div className={docsPageShellClassName}>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className={docsPageGridClassName}>
        <main className="min-w-0">
          <article className={docsPageArticleClassName}>
            <PageStagger delayChildren={0.03} staggerChildren={0.08}>
              <PageStaggerItem>
                <header className="space-y-6">
                  <div className="space-y-3">
                    <DocsBreadcrumbs items={breadcrumbs} />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl space-y-2">
                        <h1 className={docsPageTitleClassName}>Text Loop</h1>
                        <p className={docsPageDescriptionClassName}>
                          {description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <PageCopyActions
                          componentName="text-loop"
                          pageContent={pageContent}
                          pageUrl="/texts/text-loop"
                          title="Text Loop"
                          v0PageCode={v0PageCode}
                        />
                        <SectionPager
                          itemSlug="text-loop"
                          sectionLabel="Texts"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ComponentDemoCanvas
                      code={usageCode}
                      componentName="text-loop"
                      preview={<TextLoopPreview />}
                      previewClassName="px-4 py-6 sm:px-8 sm:py-10"
                      v0PageCode={v0PageCode}
                    />
                  </div>
                </header>
              </PageStaggerItem>
            </PageStagger>

            <div className="mt-14 space-y-14">
              <TextDocsSection id="installation" title="Installation">
                <ComponentInstallationTabs componentName="text-loop" />
              </TextDocsSection>

              <TextDocsSection id="props" title="Props">
                <DetailLedger details={textLoopApiDetails} />
              </TextDocsSection>
            </div>

            <SectionPrevNextNav itemSlug="text-loop" sectionLabel="Texts" />
          </article>
        </main>

        <DocsPageRail
          editHref={`${LINK.GITHUB}/edit/main/app/texts/text-loop/page.tsx`}
          sections={[
            { id: "installation", label: "Installation" },
            { id: "props", label: "Props" },
          ]}
        />
      </div>
    </div>
  );
}
