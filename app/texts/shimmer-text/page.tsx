import type { Metadata } from "next";

import { shimmerTextApiDetails } from "@/components/docs/component-api";
import { ComponentDemoCanvas } from "@/components/docs/component-demo-canvas";
import { ComponentInstallationTabs } from "@/components/docs/component-installation-tabs";
import { DocsPageRail } from "@/components/docs/component-page-rail";
import { PageCopyActions } from "@/components/docs/page-copy-actions";
import {
  type BreadcrumbItem,
  DetailLedger,
  DocsBreadcrumbs,
} from "@/components/docs/page-shell";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { LINK } from "@/constants";
import { TextShimmer } from "@/registry/shimmer-text";
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Shimmer Text",
  canonical: "/texts/shimmer-text",
  description:
    "Animated shimmer text that sweeps a moving highlight across one line of copy with adjustable speed, spread, and element rendering.",
  keywords: [
    "shimmer text",
    "animated text highlight",
    "react shimmer text",
    "motion typography component",
  ],
  ogTitle: "Shimmer Text",
});

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Shimmer Text" },
];

const description =
  "Animated shimmer text that sweeps a moving highlight across one line of copy with adjustable speed, spread, and element rendering.";

const usageCode = `"use client";

import { TextShimmer } from "@/components/ui/shimmer-text";

export function StatusLine() {
  return (
    <TextShimmer className="font-light text-md tracking-tight">
      Agent is thinking ...
    </TextShimmer>
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

function ShimmerTextPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10 text-center sm:min-h-[340px]">
      <TextShimmer className="max-w-4xl font-light text-md tracking-tight">
        Agent is thinking ...
      </TextShimmer>
    </div>
  );
}

export default function ShimmerTextPage() {
  const pageContent = [
    "# Shimmer Text",
    description,
    "",
    "## Installation",
    "npx shadcn@latest add @iconiq/shimmer-text",
    "",
    "## Usage",
    usageCode.trim(),
  ].join("\n");

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
                          Shimmer Text
                        </h1>
                        <p className="max-w-3xl text-base text-muted-foreground">
                          {description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start">
                        <PageCopyActions
                          componentName="shimmer-text"
                          pageContent={pageContent}
                          pageUrl="/texts/shimmer-text"
                          title="Shimmer Text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ComponentDemoCanvas
                      code={usageCode}
                      componentName="shimmer-text"
                      preview={<ShimmerTextPreview />}
                      previewClassName="px-4 py-6 sm:px-8 sm:py-10"
                    />
                  </div>
                </header>
              </PageStaggerItem>
            </PageStagger>

            <div className="mt-14 space-y-14">
              <TextDocsSection id="installation" title="Installation">
                <ComponentInstallationTabs componentName="shimmer-text" />
              </TextDocsSection>

              <TextDocsSection id="props" title="Props">
                <DetailLedger details={shimmerTextApiDetails} />
              </TextDocsSection>
            </div>
          </article>
        </main>

        <DocsPageRail
          editHref={`${LINK.GITHUB}/edit/main/app/texts/shimmer-text/page.tsx`}
          sections={[
            { id: "installation", label: "Installation" },
            { id: "props", label: "Props" },
          ]}
        />
      </div>
    </div>
  );
}
