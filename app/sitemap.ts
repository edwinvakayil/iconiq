import type { MetadataRoute } from "next";

import { SITE } from "@/constants";
import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

// biome-ignore lint/suspicious/useAwait: ignore
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homepage = BASE_LINKS.find((item) => item.href === "/");
  const docsPages = [
    ...(homepage
      ? [
          {
            path: homepage.href,
            changeFrequency: "weekly" as const,
            priority: 1,
          },
        ]
      : []),
    ...BASE_LINKS.filter((item) => item.href !== "/").map((item) => ({
      path: item.href,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...SITE_SECTIONS.flatMap((section) =>
      section.children.map((item) => ({
        path: item.href,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }))
    ),
    {
      path: "/sponsorship",
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      path: "/llms.txt",
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      path: "/llms-full.txt",
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      path: "/ai-index.json",
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];

  return docsPages.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? SITE.URL : `${SITE.URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
