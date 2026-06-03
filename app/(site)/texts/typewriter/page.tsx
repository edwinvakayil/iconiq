import type { Metadata } from "next";

import { typewriterApiDetails } from "@/components/docs/component-api";
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
import TextTypewriter from "@/registry/typewriter";
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { createMetadata } from "@/seo/metadata";

const typewriterDescription =
  "Looping typewriter with glitch ticks, cursor, and reduced-motion fallback.";

export const metadata: Metadata = createMetadata({
  title: "Typewriter",
  canonical: "/texts/typewriter",
  description: typewriterDescription,
  keywords: [
    "typewriter text",
    "animated typewriter",
    "glitch text effect",
    "react text motion",
  ],
  ogTitle: "Typewriter",
});

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Typewriter" },
];

const description = typewriterDescription;

const usageCode = `"use client";

import TextTypewriter from "@/components/ui/typewriter";

export function TerminalHeadline() {
  return (
    <TextTypewriter
      className="font-mono text-2xl text-foreground sm:text-4xl"
      duration={2.6}
    >
      Deploying interface motion
    </TextTypewriter>
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

function TypewriterPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10 text-center sm:min-h-[340px]">
      <TextTypewriter
        className="font-mono text-2xl text-foreground sm:text-4xl"
        duration={2.6}
      >
        Deploying interface motion
      </TextTypewriter>
    </div>
  );
}

export default function TypewriterPage() {
  const pageContent = [
    "# Typewriter",
    description,
    "",
    "## Installation",
    "npx shadcn@latest add @iconiq/typewriter",
    "",
    "## Usage",
    usageCode.trim(),
  ].join("\n");

  const v0PageCode = getComponentV0Page("typewriter", usageCode);

  return (
    <div className={docsPageShellClassName}>
      <BreadcrumbJsonLdClient items={breadcrumbs} />
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
                        <h1 className={docsPageTitleClassName}>Typewriter</h1>
                        <p className={docsPageDescriptionClassName}>
                          {description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <PageCopyActions
                          componentName="typewriter"
                          pageContent={pageContent}
                          pageUrl="/texts/typewriter"
                          title="Typewriter"
                          v0PageCode={v0PageCode}
                        />
                        <SectionPager
                          itemSlug="typewriter"
                          sectionLabel="Texts"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ComponentDemoCanvas
                      code={usageCode}
                      componentName="typewriter"
                      preview={<TypewriterPreview />}
                      previewClassName="px-4 py-6 sm:px-8 sm:py-10"
                      v0PageCode={v0PageCode}
                    />
                  </div>
                </header>
              </PageStaggerItem>
            </PageStagger>

            <div className="mt-14 space-y-14">
              <TextDocsSection id="installation" title="Installation">
                <ComponentInstallationTabs componentName="typewriter" />
              </TextDocsSection>

              <TextDocsSection id="props" title="Props">
                <DetailLedger details={typewriterApiDetails} />
              </TextDocsSection>
            </div>

            <SectionPrevNextNav itemSlug="typewriter" sectionLabel="Texts" />
          </article>
        </main>

        <DocsPageRail
          editHref={`${LINK.GITHUB}/edit/main/app/texts/typewriter/page.tsx`}
          sections={[
            { id: "installation", label: "Installation" },
            { id: "props", label: "Props" },
          ]}
        />
      </div>
    </div>
  );
}
