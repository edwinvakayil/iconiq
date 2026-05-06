import type { MetadataRoute } from "next";

import { SITE } from "@/constants";

export default function robots(): MetadataRoute.Robots {
  const crawlAllow = ["/", "/llms.txt", "/llms-full.txt", "/ai-index.json"];
  const crawlDisallow = ["/api/", "/_next/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: crawlAllow,
        disallow: crawlDisallow,
      },
      {
        userAgent: "GPTBot",
        allow: crawlAllow,
        disallow: crawlDisallow,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: crawlAllow,
        disallow: crawlDisallow,
      },
    ],
    host: SITE.URL,
    sitemap: `${SITE.URL}/sitemap.xml`,
  };
}
