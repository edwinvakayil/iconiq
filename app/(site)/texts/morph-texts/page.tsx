import type { Metadata } from "next";

import { morphTextsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { MorphText } from "@/registry/morph-texts";
import { createMetadata } from "@/seo/metadata";

const morphTextsDescription =
  "Cycling headline words with a goo-filter morph transition powered by Motion.";

export const metadata: Metadata = createMetadata({
  title: "Morph Text",
  canonical: "/texts/morph-texts",
  description: morphTextsDescription,
  keywords: [
    "morph text",
    "animated headline",
    "text morph",
    "goo filter text",
    "react text motion",
  ],
  ogTitle: "Morph Text",
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Morph Text" },
];

const description = morphTextsDescription;

const usageCode = `"use client";

import { MorphText } from "@/components/ui/morph-texts";

export function HeroMorph() {
  return (
    <p className="max-w-4xl font-light text-2xl text-foreground tracking-tight sm:text-4xl">
      Build software that feels{" "}
      <MorphText
        fontFamily="inherit"
        fontSize="1em"
        interval={2800}
        textClassName="font-semibold"
        words={["fast", "fluid", "alive"]}
      />
      .
    </p>
  );
}`;

function MorphTextPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10 text-center sm:min-h-[340px]">
      <p className="max-w-4xl font-light text-2xl text-foreground tracking-tight sm:text-4xl">
        Build software that feels{" "}
        <MorphText
          fontFamily="inherit"
          fontSize="1em"
          interval={2800}
          textClassName="font-semibold"
          words={["fast", "fluid", "alive"]}
        />
      </p>
    </div>
  );
}

export default function MorphTextsPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="morph-texts"
      description={description}
      details={morphTextsApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/texts/morph-texts/page.tsx`}
      itemSlug="morph-texts"
      pageUrl="/texts/morph-texts"
      preview={<MorphTextPreview />}
      title="Morph Text"
      usageCode={usageCode}
    />
  );
}
