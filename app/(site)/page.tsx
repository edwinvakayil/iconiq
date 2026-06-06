import type { Metadata } from "next";

import { HomeSeoNav } from "@/components/home-seo-nav";
import { getRouteMetadata } from "@/lib/seo-routes";
import { HomePageJsonLd } from "@/seo/json-ld";
import { HomeHero } from "./home-hero";

export const metadata: Metadata = getRouteMetadata("/");

export default function Home() {
  return (
    <>
      <HomePageJsonLd />
      <div className="flex min-h-[calc(100vh-var(--nav-stack-height-mobile))] w-full min-w-0 lg:min-h-[calc(100vh-var(--nav-stack-height-desktop))]">
        <HomeSeoNav />
        <main className="min-w-0 flex-1">
          <HomeHero />
        </main>
      </div>
    </>
  );
}
