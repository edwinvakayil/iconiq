import type { Metadata } from "next";

import { typewriterApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import TextTypewriter from "@/registry/typewriter";
import { createMetadata } from "@/seo/metadata";

const typewriterDescription =
  "Looping typewriter with glitch ticks and a blinking cursor.";

export const metadata: Metadata = createMetadata({
  title: "Typewriter",
  canonical: "/texts/typewriter",
  description: typewriterDescription,
  keywords: [
    "typewriter text",
    "animated typewriter",
    "glitch text effect",
    "react text motion",
  ],
  ogTitle: "Typewriter",
});

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Texts" },
  { label: "Typewriter" },
];

const description = typewriterDescription;

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
  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="typewriter"
      description={description}
      details={typewriterApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/texts/typewriter/page.tsx`}
      itemSlug="typewriter"
      pageUrl="/texts/typewriter"
      preview={<TypewriterPreview />}
      title="Typewriter"
      usageCode={usageCode}
    />
  );
}
