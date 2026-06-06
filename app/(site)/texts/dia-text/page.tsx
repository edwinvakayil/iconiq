import type { Metadata } from "next";

import { diaTextApiDetails } from "@/components/docs/component-api";
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
import { DiaText } from "@/registry/dia-text";
import { BreadcrumbJsonLd } from "@/seo/breadcrumb-json-ld";
import { createMetadata } from "@/seo/metadata";

const diaTextDescription =
  "Text reveal with gradient sweep, repeats, and optional rotation.";

export const metadata: Metadata = createMetadata({
  title: "Dia Text",
  canonical: "/texts/dia-text",
  description: diaTextDescription,
  keywords: [
    "dia text",
    "animated text reveal",
    "react text motion",
    "motion typography component",
  ],
  ogTitle: "Dia Text",
});

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Dia Text" },
];

const description = diaTextDescription;

const usageCode = `"use client";

import { DiaText } from "@/components/ui/dia-text";

export function HeroHeadline() {
  return (
    <p className="font-light text-4xl tracking-tight">
      Make interfaces feel{" "}
      <DiaText
        repeat
        repeatDelay={1.1}
        text={["smooth.", "focused.", "refined."]}
      />
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

function DiaTextPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10 text-center sm:min-h-[340px]">
      <p className="max-w-4xl font-light text-4xl text-foreground tracking-tight">
        Make interfaces feel{" "}
        <DiaText
          repeat
          repeatDelay={1.1}
          text={["smooth.", "focused.", "refined."]}
        />
      </p>
    </div>
  );
}

export default function DiaTextPage() {
  const pageContent = [
    "# Dia Text",
    description,
    "",
    "## Installation",
    "npx shadcn@latest add @iconiq/dia-text",
    "",
    "## Usage",
    usageCode.trim(),
  ].join("\n");

  const v0PageCode = getComponentV0Page("dia-text", usageCode);

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
                        <h1 className={docsPageTitleClassName}>Dia Text</h1>
                        <p className={docsPageDescriptionClassName}>
                          {description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <PageCopyActions
                          componentName="dia-text"
                          pageContent={pageContent}
                          pageUrl="/texts/dia-text"
                          title="Dia Text"
                          v0PageCode={v0PageCode}
                        />
                        <SectionPager
                          itemSlug="dia-text"
                          sectionLabel="Texts"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ComponentDemoCanvas
                      code={usageCode}
                      componentName="dia-text"
                      preview={<DiaTextPreview />}
                      previewClassName="px-4 py-6 sm:px-8 sm:py-10"
                      v0PageCode={v0PageCode}
                    />
                  </div>
                </header>
              </PageStaggerItem>
            </PageStagger>

            <div className="mt-14 space-y-14">
              <TextDocsSection id="installation" title="Installation">
                <ComponentInstallationTabs componentName="dia-text" />
              </TextDocsSection>

              <TextDocsSection id="props" title="Props">
                <DetailLedger details={diaTextApiDetails} />
              </TextDocsSection>
            </div>

            <SectionPrevNextNav itemSlug="dia-text" sectionLabel="Texts" />
          </article>
        </main>

        <DocsPageRail
          editHref={`${LINK.GITHUB}/edit/main/app/texts/dia-text/page.tsx`}
          sections={[
            { id: "installation", label: "Installation" },
            { id: "props", label: "Props" },
          ]}
        />
      </div>
    </div>
  );
}
