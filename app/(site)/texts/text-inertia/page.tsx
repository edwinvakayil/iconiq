import type { Metadata } from "next";

import { textInertiaApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import TextInertia from "@/registry/text-inertia";
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

const breadcrumbs = [
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
  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="text-inertia"
      description={description}
      details={textInertiaApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/texts/text-inertia/page.tsx`}
      itemSlug="text-inertia"
      pageUrl="/texts/text-inertia"
      preview={<TextInertiaPreview />}
      title="Text Inertia"
      usageCode={usageCode}
    />
  );
}
