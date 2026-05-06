import { SITE } from "@/constants";
import { getChangelogEntries } from "@/lib/changelog";
import {
  AI_DISCOVERY_LINKS,
  COMPONENT_CATALOG,
  GUIDE_CATALOG,
} from "@/lib/geo";

export async function GET() {
  const latestRelease = (await getChangelogEntries())[0] ?? null;

  const payload = {
    site: {
      name: SITE.NAME,
      url: SITE.URL,
      description: SITE.DESCRIPTION.LONG,
      llms: {
        overview: AI_DISCOVERY_LINKS.llmsOverview,
        full: AI_DISCOVERY_LINKS.llmsFull,
      },
      catalogs: {
        aiIndex: AI_DISCOVERY_LINKS.indexJson,
      },
    },
    guides: GUIDE_CATALOG,
    components: COMPONENT_CATALOG,
    latestRelease: latestRelease
      ? {
          version: latestRelease.version,
          date: latestRelease.date,
          title: latestRelease.title,
          summary: latestRelease.summary,
          groups: latestRelease.groups,
        }
      : null,
    generatedAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
