import type { Metadata } from "next";

import { shimmerTextApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { TextShimmer } from "@/registry/shimmer-text";
import { createMetadata } from "@/seo/metadata";

const shimmerTextDescription =
  "Shimmer highlight across one line—with adjustable speed and spread.";

export const metadata: Metadata = createMetadata({
  title: "Shimmer Text",
  canonical: "/texts/shimmer-text",
  description: shimmerTextDescription,
  keywords: [
    "shimmer text",
    "animated text highlight",
    "react shimmer text",
    "motion typography component",
  ],
  ogTitle: "Shimmer Text",
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Shimmer Text" },
];

const description = shimmerTextDescription;

const usageCode = `"use client";

import { TextShimmer } from "@/components/ui/shimmer-text";

export function StatusLine() {
  return (
    <TextShimmer className="font-light text-md tracking-tight">
      Agent is thinking ...
    </TextShimmer>
  );
}`;

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
  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="shimmer-text"
      description={description}
      details={shimmerTextApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/texts/shimmer-text/page.tsx`}
      itemSlug="shimmer-text"
      pageUrl="/texts/shimmer-text"
      preview={<ShimmerTextPreview />}
      title="Shimmer Text"
      usageCode={usageCode}
    />
  );
}
