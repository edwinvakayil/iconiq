import type { MetadataRoute } from "next";

import { SITE } from "@/constants";
import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

// biome-ignore lint/suspicious/useAwait: ignore
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docsPages = [
    ...BASE_LINKS.map((item) => item.href),
    ...SITE_SECTIONS.flatMap((section) =>
      section.children.map((item) => item.href)
    ),
    "/sponsorship",
  ];

  return docsPages.map((path) => ({
    url: path === "/" ? SITE.URL : `${SITE.URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
