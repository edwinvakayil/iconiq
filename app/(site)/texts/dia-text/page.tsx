import type { Metadata } from "next";

import { diaTextApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { DiaText } from "@/registry/dia-text";
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

const breadcrumbs = [
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
  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="dia-text"
      description={description}
      details={diaTextApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/texts/dia-text/page.tsx`}
      itemSlug="dia-text"
      pageUrl="/texts/dia-text"
      preview={<DiaTextPreview />}
      title="Dia Text"
      usageCode={usageCode}
    />
  );
}
