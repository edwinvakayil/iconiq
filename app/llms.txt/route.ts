import { LINK, SITE } from "@/constants";
import { AI_DISCOVERY_LINKS } from "@/lib/ai-discovery-links";
import { COMPONENT_CATALOG, GUIDE_CATALOG } from "@/lib/geo";

export function GET() {
  const guideLines = GUIDE_CATALOG.map(
    (guide) => `- ${guide.title}: ${guide.summary}\n  ${guide.url}`
  ).join("\n");

  const componentLines = COMPONENT_CATALOG.map(
    (component) =>
      `- ${component.name}: ${component.summary}\n  Docs: ${component.url}\n  Install: ${component.installCommand}`
  ).join("\n");

  const content = `# ${SITE.NAME}

> ${SITE.DESCRIPTION.SHORT}

${SITE.NAME} is a React component library delivered through the shadcn registry workflow. The site includes component docs, live playgrounds, and installation instructions.

## Canonical

- Website: ${SITE.URL}
- GitHub: ${LINK.GITHUB}
- Author: ${SITE.AUTHOR.NAME}

## AI Discovery

- LLM overview: ${AI_DISCOVERY_LINKS.llmsOverview}
- Full LLM index: ${AI_DISCOVERY_LINKS.llmsFull}
- Machine-readable catalog: ${AI_DISCOVERY_LINKS.indexJson}

## Quick Install

\`\`\`bash
npx shadcn@latest add @iconiq/b-button
\`\`\`

## Core Guides

${guideLines}

## Components (${COMPONENT_CATALOG.length})

${componentLines}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
