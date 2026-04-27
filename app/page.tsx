import type { Metadata } from "next";
import { SITE } from "@/constants";
import { createMetadata } from "@/seo/metadata";
import { HomeHero } from "./home-hero";

export const metadata: Metadata = createMetadata({
  title: `${SITE.NAME} | Open Source React Component Library`,
  description:
    "Discover Iconiq, an open-source React component library with a source-first shadcn registry workflow, editable UI primitives, and polished product-focused interactions.",
  canonical: "/",
  ogTitle: `${SITE.NAME} | Source-First React Components`,
  keywords: [
    "open source react component library",
    "editable ui components",
    "source first component library",
    "shadcn registry ui",
  ],
});

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height-mobile))] w-full min-w-0 lg:min-h-[calc(100vh-var(--header-height-desktop))]">
      <main className="min-w-0 flex-1">
        <HomeHero />
      </main>
    </div>
  );
}
