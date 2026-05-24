import { SITE } from "@/constants";
import { AI_DISCOVERY_LINKS } from "@/lib/ai-discovery-links";
import { COMPONENT_CATALOG, GUIDE_CATALOG } from "@/lib/geo";

export function GET() {
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
    generatedAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
