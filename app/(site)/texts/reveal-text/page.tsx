import type { Metadata } from "next";

import { revealTextApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { RevealText } from "@/registry/reveal-text";
import { createMetadata } from "@/seo/metadata";

const revealTextDescription =
  "Staggered word or character reveal with spring lift, blur fade, and optional scroll-triggered playback.";

export const metadata: Metadata = createMetadata({
  title: "Reveal Text",
  canonical: "/texts/reveal-text",
  description: revealTextDescription,
  keywords: [
    "reveal text",
    "text reveal",
    "staggered text animation",
    "scroll reveal text",
    "react text motion",
  ],
  ogTitle: "Reveal Text",
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Reveal Text" },
];

const description = revealTextDescription;

const usageCode = `"use client";

import { RevealText } from "@/components/ui/reveal-text";

export function HeroReveal() {
  return (
    <RevealText
      as="h2"
      className="font-semibold text-xl tracking-tight sm:text-2xl"
      split="word"
      text="Design meets motion, one word at a time"
      whileInView
    />
  );
}`;

function RevealTextPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10 text-center sm:min-h-[340px]">
      <RevealText
        as="h2"
        className="font-semibold text-xl tracking-tight sm:text-2xl"
        split="word"
        text="Design meets motion, one word at a time"
        whileInView
      />
    </div>
  );
}

export default function RevealTextPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="reveal-text"
      description={description}
      details={revealTextApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/texts/reveal-text/page.tsx`}
      itemSlug="reveal-text"
      pageUrl="/texts/reveal-text"
      preview={<RevealTextPreview />}
      title="Reveal Text"
      usageCode={usageCode}
    />
  );
}
