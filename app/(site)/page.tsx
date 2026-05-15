import type { Metadata } from "next";
import { SITE } from "@/constants";
import { createMetadata } from "@/seo/metadata";
import { HomeHero } from "./home-hero";

export const metadata: Metadata = createMetadata({
  title: `${SITE.NAME} | Open Source React Component Library`,
  description:
    "Discover Iconiq, an open-source React component library built around the shadcn registry workflow, editable UI primitives, and polished interactions.",
  canonical: "/",
  ogTitle: `${SITE.NAME} | Editable React Components`,
  keywords: [
    "open source react component library",
    "editable ui components",
    "editable component library",
    "shadcn registry ui",
  ],
});

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-var(--nav-stack-height-mobile))] w-full min-w-0 lg:min-h-[calc(100vh-var(--nav-stack-height-desktop))]">
      <main className="min-w-0 flex-1">
        <HomeHero />
      </main>
    </div>
  );
}
