import { SITE } from "@/constants";

const AI_DISCOVERY_LINKS = {
  indexJson: `${SITE.URL}/ai-index.json`,
  llmsFull: `${SITE.URL}/llms-full.txt`,
  llmsOverview: `${SITE.URL}/llms.txt`,
} as const;

export { AI_DISCOVERY_LINKS };
