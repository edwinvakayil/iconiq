import type { Metadata } from "next";
import type React from "react";
import { typographyApiDetails } from "@/components/docs/component-api";
import { ComponentInstallationTabs } from "@/components/docs/component-installation-tabs";
import { DocsPageRail } from "@/components/docs/component-page-rail";
import { PageCopyActions } from "@/components/docs/page-copy-actions";
import {
  type BreadcrumbItem,
  DetailLedger,
  DocsBreadcrumbs,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  TYPOGRAPHY_GROUPS,
  TYPOGRAPHY_SAMPLE_TEXT,
  TYPOGRAPHY_VARIANT_META,
  Typography,
  type TypographyVariant,
} from "@/registry/typography";
import { BreadcrumbJsonLdClient } from "@/seo/breadcrumb-json-ld-client";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Typography",
  canonical: "/foundation/typography",
  description:
    "Single typography primitive for the full Iconiq type scale, covering headings, labels, paragraphs, subheadings, and documentation copy.",
  keywords: [
    "typography component",
    "type scale",
    "design foundation",
    "react typography",
  ],
  ogTitle: "Typography",
});

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Docs", href: "/" },
  { label: "Foundation" },
  { label: "Typography" },
];

const description =
  "One component for the full type system. Use a single `variant` prop to keep headings, labels, paragraphs, subheadings, and doc copy aligned with the same source of truth.";

function TypographyDocsSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-32" id={id}>
      <h2 className="mt-16 border-border/80 border-b pb-4 font-semibold text-xl tracking-tight first:mt-0">
        {title}
      </h2>
      <div className="pt-6">{children}</div>
    </section>
  );
}

const TYPOGRAPHY_SPEC_FIELDS = [
  { key: "weight", label: "Weight" },
  { key: "fontSize", label: "Font size" },
  { key: "lineHeight", label: "Line height" },
  { key: "letterSpacing", label: "Letter spacing" },
] as const;

function TypographySpecStrip({
  spec,
}: {
  spec: (typeof TYPOGRAPHY_VARIANT_META)[TypographyVariant];
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
      {TYPOGRAPHY_SPEC_FIELDS.map(({ key, label }) => (
        <div key={key}>
          <dt className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
            {label}
          </dt>
          <dd className="mt-1.5 font-mono text-[13px] text-foreground tabular-nums">
            {spec[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function TypographyScaleRow({ variant }: { variant: TypographyVariant }) {
  const spec = TYPOGRAPHY_VARIANT_META[variant];

  return (
    <article className="py-9 first:pt-0 last:pb-0">
      <p className="text-[14px] text-foreground">{spec.label}</p>

      <Typography className="mt-4 text-pretty" variant={variant}>
        {TYPOGRAPHY_SAMPLE_TEXT}
      </Typography>

      <div className="mt-6 space-y-4 border-border/50 border-t border-dotted pt-5">
        <TypographySpecStrip spec={spec} />
        <p className="font-mono text-[12px] text-foreground/90">
          {`<Typography variant="${variant}">`}
        </p>
      </div>
    </article>
  );
}

function TypographyScaleSection() {
  return (
    <div className="space-y-14">
      {TYPOGRAPHY_GROUPS.map((group) => (
        <section key={group.label}>
          <h3 className="mb-6 font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
            {group.label}
          </h3>
          <div className="divide-y divide-border/50">
            {group.variants.map((variant) => (
              <TypographyScaleRow key={variant} variant={variant} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TypographyPropsSection() {
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-[14px] text-muted-foreground leading-6">
        Pass a single <code className="font-mono text-[13px]">variant</code> to
        apply the scale. Override the rendered element with{" "}
        <code className="font-mono text-[13px]">as</code> when the default tag
        does not fit the layout.
      </p>
      <DetailLedger details={typographyApiDetails} />
    </div>
  );
}

export default function TypographyPage() {
  const pageContent = [
    "# Typography",
    description,
    "",
    "## Installation",
    "npx shadcn@latest add @iconiq/typography",
    "",
    "## Scale",
    ...TYPOGRAPHY_GROUPS.flatMap((group) => [
      `### ${group.label}`,
      ...group.variants.map((variant) => {
        const spec = TYPOGRAPHY_VARIANT_META[variant];
        return `- ${spec.label}: ${spec.weight}, ${spec.fontSize}, ${spec.lineHeight}, ${spec.letterSpacing}`;
      }),
      "",
    ]),
  ].join("\n");

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <BreadcrumbJsonLdClient items={breadcrumbs} />
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_248px] xl:gap-4">
        <main className="min-w-0">
          <article className="min-w-0 max-w-4xl">
            <header className="space-y-6">
              <div className="space-y-3">
                <DocsBreadcrumbs items={breadcrumbs} />
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl space-y-2">
                    <h1 className="scroll-m-20 font-semibold text-3xl text-foreground tracking-tighter">
                      Typography
                    </h1>
                    <p className="max-w-3xl text-base text-muted-foreground">
                      {description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <PageCopyActions
                      componentName="typography"
                      pageContent={pageContent}
                      pageUrl="/foundation/typography"
                      title="Typography"
                    />
                  </div>
                </div>
              </div>
            </header>

            <div className="mt-14 space-y-14">
              <TypographyDocsSection id="installation" title="Installation">
                <ComponentInstallationTabs componentName="typography" />
              </TypographyDocsSection>

              <TypographyDocsSection id="scale" title="Scale">
                <TypographyScaleSection />
              </TypographyDocsSection>

              <TypographyDocsSection id="props" title="Props">
                <TypographyPropsSection />
              </TypographyDocsSection>
            </div>
          </article>
        </main>

        <DocsPageRail
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/foundation/typography/page.tsx`}
          sections={[
            { id: "installation", label: "Installation" },
            { id: "scale", label: "Scale" },
            { id: "props", label: "Props" },
          ]}
        />
      </div>
    </div>
  );
}
