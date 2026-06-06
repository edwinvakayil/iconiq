import type { Metadata } from "next";

import { textInertiaApiDetails } from "@/components/docs/component-api";
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
import TextInertia from "@/registry/text-inertia";
import { BreadcrumbJsonLd } from "@/seo/breadcrumb-json-ld";
import { createMetadata } from "@/seo/metadata";

const textInertiaDescription =
  "Cursor-driven words that kick aside and spring back.";

export const metadata: Metadata = createMetadata({
  title: "Text Inertia",
  canonical: "/texts/text-inertia",
  description: textInertiaDescription,
  keywords: [
    "text inertia",
    "pointer reactive text",
    "motion text effect",
    "animated words",
  ],
  ogTitle: "Text Inertia",
});

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Text Inertia" },
];

const description = textInertiaDescription;

const previewText =
  "Crafting refined, pixel-perfect web experiences that balance design clarity with technical excellence. Every interaction should feel responsive, intentional, and calm enough to disappear into the work. Motion adds a quiet layer of feedback, helping people sense where they are and what just changed.";

const usageCode = `"use client";

import TextInertia from "@/components/ui/text-inertia";

export function KineticHeadline() {
  return (
    <TextInertia
      className="w-full max-w-4xl justify-start text-left text-lg leading-relaxed sm:text-xl"
      intensity={0.3}
      text="${previewText}"
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

function TextInertiaPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10 sm:min-h-[340px]">
      <TextInertia
        className="w-full max-w-4xl justify-start text-left text-lg leading-relaxed sm:text-xl"
        intensity={0.3}
        text={previewText}
      />
    </div>
  );
}

export default function TextInertiaPage() {
  const pageContent = [
    "# Text Inertia",
    description,
    "",
    "## Installation",
    "npx shadcn@latest add @iconiq/text-inertia",
    "",
    "## Usage",
    usageCode.trim(),
  ].join("\n");

  const v0PageCode = getComponentV0Page("text-inertia", usageCode);

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
                        <h1 className={docsPageTitleClassName}>Text Inertia</h1>
                        <p className={docsPageDescriptionClassName}>
                          {description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <PageCopyActions
                          componentName="text-inertia"
                          pageContent={pageContent}
                          pageUrl="/texts/text-inertia"
                          title="Text Inertia"
                          v0PageCode={v0PageCode}
                        />
                        <SectionPager
                          itemSlug="text-inertia"
                          sectionLabel="Texts"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ComponentDemoCanvas
                      code={usageCode}
                      componentName="text-inertia"
                      preview={<TextInertiaPreview />}
                      previewClassName="px-4 py-6 sm:px-8 sm:py-10"
                      v0PageCode={v0PageCode}
                    />
                  </div>
                </header>
              </PageStaggerItem>
            </PageStagger>

            <div className="mt-14 space-y-14">
              <TextDocsSection id="installation" title="Installation">
                <ComponentInstallationTabs componentName="text-inertia" />
              </TextDocsSection>

              <TextDocsSection id="props" title="Props">
                <DetailLedger details={textInertiaApiDetails} />
              </TextDocsSection>
            </div>

            <SectionPrevNextNav itemSlug="text-inertia" sectionLabel="Texts" />
          </article>
        </main>

        <DocsPageRail
          editHref={`${LINK.GITHUB}/edit/main/app/texts/text-inertia/page.tsx`}
          sections={[
            { id: "installation", label: "Installation" },
            { id: "props", label: "Props" },
          ]}
        />
      </div>
    </div>
  );
}
