import type { Metadata } from "next";

import { revealTextApiDetails } from "@/components/docs/component-api";
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
import { RevealText } from "@/registry/reveal-text";
import { BreadcrumbJsonLd } from "@/seo/breadcrumb-json-ld";
import { createMetadata } from "@/seo/metadata";

const revealTextDescription =
  "Staggered word or character reveal with spring lift, blur fade, and optional scroll-triggered playback.";

export const metadata: Metadata = createMetadata({
  title: "Reveal Text",
  canonical: "/texts/reveal-text",
  description: revealTextDescription,
  keywords: [
    "reveal text",
    "text reveal",
    "staggered text animation",
    "scroll reveal text",
    "react text motion",
  ],
  ogTitle: "Reveal Text",
});

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Reveal Text" },
];

const description = revealTextDescription;

const usageCode = `"use client";

import { RevealText } from "@/components/ui/reveal-text";

export function HeroReveal() {
  return (
    <RevealText
      as="h2"
      className="font-semibold text-xl tracking-tight sm:text-2xl"
      split="word"
      text="Design meets motion, one word at a time"
      whileInView
    />
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

function RevealTextPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10 text-center sm:min-h-[340px]">
      <RevealText
        as="h2"
        className="font-semibold text-xl tracking-tight sm:text-2xl"
        split="word"
        text="Design meets motion, one word at a time"
        whileInView
      />
    </div>
  );
}

export default function RevealTextPage() {
  const pageContent = [
    "# Reveal Text",
    description,
    "",
    "## Installation",
    "npx shadcn@latest add @iconiq/reveal-text",
    "",
    "## Usage",
    usageCode.trim(),
  ].join("\n");

  const v0PageCode = getComponentV0Page("reveal-text", usageCode);

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
                        <h1 className={docsPageTitleClassName}>Reveal Text</h1>
                        <p className={docsPageDescriptionClassName}>
                          {description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <PageCopyActions
                          componentName="reveal-text"
                          pageContent={pageContent}
                          pageUrl="/texts/reveal-text"
                          title="Reveal Text"
                          v0PageCode={v0PageCode}
                        />
                        <SectionPager
                          itemSlug="reveal-text"
                          sectionLabel="Texts"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ComponentDemoCanvas
                      code={usageCode}
                      componentName="reveal-text"
                      preview={<RevealTextPreview />}
                      previewClassName="px-4 py-6 sm:px-8 sm:py-10"
                      v0PageCode={v0PageCode}
                    />
                  </div>
                </header>
              </PageStaggerItem>
            </PageStagger>

            <div className="mt-14 space-y-14">
              <TextDocsSection id="installation" title="Installation">
                <ComponentInstallationTabs componentName="reveal-text" />
              </TextDocsSection>

              <TextDocsSection id="props" title="Props">
                <DetailLedger details={revealTextApiDetails} />
              </TextDocsSection>
            </div>

            <SectionPrevNextNav itemSlug="reveal-text" sectionLabel="Texts" />
          </article>
        </main>

        <DocsPageRail
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/texts/reveal-text/page.tsx`}
          sections={[
            { id: "installation", label: "Installation" },
            { id: "props", label: "Props" },
          ]}
        />
      </div>
    </div>
  );
}
