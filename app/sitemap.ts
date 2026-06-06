import type { MetadataRoute } from "next";

import { SITE } from "@/constants";
import { SITELINK_ROUTES } from "@/lib/seo-routes";
import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

const SITELINK_PATHS = new Set<string>(
  SITELINK_ROUTES.map((route) => route.href).filter((href) => href !== "/")
);

function getPagePriority(path: string) {
  if (path === "/") {
    return 1;
  }

  if (SITELINK_PATHS.has(path)) {
    return 0.95;
  }

  if (BASE_LINKS.some((item) => item.href === path)) {
    return 0.9;
  }

  return 0.8;
}

// biome-ignore lint/suspicious/useAwait: ignore
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homepage = BASE_LINKS.find((item) => item.href === "/");
  const docsPages = [
    ...(homepage
      ? [
          {
            path: homepage.href,
            changeFrequency: "weekly" as const,
          },
        ]
      : []),
    ...BASE_LINKS.filter((item) => item.href !== "/").map((item) => ({
      path: item.href,
      changeFrequency: "monthly" as const,
    })),
    ...SITE_SECTIONS.flatMap((section) =>
      section.children.map((item) => ({
        path: item.href,
        changeFrequency: "monthly" as const,
      }))
    ),
    {
      path: "/sponsorship",
      changeFrequency: "monthly" as const,
    },
    {
      path: "/llms.txt",
      changeFrequency: "weekly" as const,
    },
    {
      path: "/llms-full.txt",
      changeFrequency: "weekly" as const,
    },
    {
      path: "/ai-index.json",
      changeFrequency: "weekly" as const,
    },
  ];

  return docsPages.map(({ path, changeFrequency }) => ({
    url: path === "/" ? SITE.URL : `${SITE.URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority: getPagePriority(path),
  }));
}
