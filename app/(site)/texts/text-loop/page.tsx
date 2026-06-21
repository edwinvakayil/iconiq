import type { Metadata } from "next";

import { textLoopApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { TextLoop } from "@/registry/text-loop";
import { createMetadata } from "@/seo/metadata";

const textLoopDescription =
  "Cycling text with vertical slide transitions—pass your own items and interval.";

export const metadata: Metadata = createMetadata({
  title: "Text Loop",
  canonical: "/texts/text-loop",
  description: textLoopDescription,
  keywords: [
    "text loop",
    "cycling text",
    "animated text rotation",
    "react text carousel",
    "motion typography",
  ],
  ogTitle: "Text Loop",
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Text Loop" },
];

const usageCode = `"use client";

import { TextLoop } from "@/components/ui/text-loop";

export function RotatingHeadline() {
  return (
    <p className="max-w-4xl font-light text-lg text-foreground tracking-tight sm:text-xl">
      <TextLoop interval={1}>
        <span>Design</span>
        <span>Build</span>
        <span>Ship</span>
        <span>Iterate</span>
      </TextLoop>{" "}
      software that ships faster.
    </p>
  );
}`;

function TextLoopPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10 text-center sm:min-h-[340px]">
      <p className="max-w-4xl font-light text-foreground text-lg tracking-tight sm:text-xl">
        <TextLoop interval={1}>
          <span>Design</span>
          <span>Build</span>
          <span>Ship</span>
          <span>Iterate</span>
        </TextLoop>{" "}
        software that ships faster.
      </p>
    </div>
  );
}

export default function TextLoopPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="text-loop"
      description={textLoopDescription}
      details={textLoopApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/texts/text-loop/page.tsx`}
      itemSlug="text-loop"
      pageUrl="/texts/text-loop"
      preview={<TextLoopPreview />}
      title="Text Loop"
      usageCode={usageCode}
    />
  );
}
