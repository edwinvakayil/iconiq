import type { Metadata } from "next";

import { typewriterApiDetails } from "@/components/docs/component-api";
import { ComponentDemoCanvas } from "@/components/docs/component-demo-canvas";
import { ComponentInstallationTabs } from "@/components/docs/component-installation-tabs";
import { DocsPageRail } from "@/components/docs/component-page-rail";
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

export const metadata: Metadata = createMetadata({
  title: "Typewriter",
  canonical: "/texts/typewriter",
  description:
    "Looping typewriter text effect that reveals a string with brief glitch substitutions, a blinking cursor, and reduced-motion fallback.",
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

const description =
  "Looping typewriter text effect that reveals a string with brief glitch substitutions, a blinking cursor, and reduced-motion fallback.";

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
    <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <BreadcrumbJsonLdClient items={breadcrumbs} />
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_248px] xl:gap-4">
        <main className="min-w-0">
          <article className="min-w-0 max-w-4xl">
            <PageStagger delayChildren={0.03} staggerChildren={0.08}>
              <PageStaggerItem>
                <header className="space-y-6">
                  <div className="space-y-3">
                    <DocsBreadcrumbs items={breadcrumbs} />
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl space-y-2">
                        <h1 className="scroll-m-20 font-semibold text-3xl text-foreground tracking-tighter">
                          Typewriter
                        </h1>
                        <p className="max-w-3xl text-base text-muted-foreground">
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
