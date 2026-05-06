import { SITE } from "@/constants";
import { getChangelogEntries } from "@/lib/changelog";
import {
  AI_DISCOVERY_LINKS,
  COMPONENT_CATALOG,
  GUIDE_CATALOG,
} from "@/lib/geo";

export async function GET() {
  const latestRelease = (await getChangelogEntries())[0];

  const guideSection = GUIDE_CATALOG.map(
    (guide) =>
      `- ${guide.title}\n  URL: ${guide.url}\n  Summary: ${guide.summary}`
  ).join("\n\n");

  const componentSection = COMPONENT_CATALOG.map((component) => {
    const apiLines = component.apiSections
      .map((section) => {
        const fieldLines = section.fields
          .map((field) => {
            const meta = [
              field.type ? `type: ${field.type}` : null,
              field.required ? "required" : null,
              field.defaultValue ? `default: ${field.defaultValue}` : null,
            ]
              .filter(Boolean)
              .join(", ");

            return `  - ${field.name}${meta ? ` (${meta})` : ""}: ${field.description}`;
          })
          .join("\n");

        return `- ${section.title}: ${section.summary ?? "Documented component behavior."}${fieldLines ? `\n${fieldLines}` : ""}`;
      })
      .join("\n");

    return `## ${component.name}

- URL: ${component.url}
- Package: ${component.installPackage}
- Install: ${component.installCommand}
- Registry JSON: ${component.registryUrl}
- Summary: ${component.summary}
${component.dependencies.length ? `- Dependencies: ${component.dependencies.join(", ")}\n` : ""}
### Documented APIs
${apiLines}`;
  }).join("\n\n");

  const content = `# ${SITE.NAME}

> Detailed AI-readable product index for ${SITE.NAME}

## Product Summary

${SITE.DESCRIPTION.LONG}

## Discovery Endpoints

- Overview: ${AI_DISCOVERY_LINKS.llmsOverview}
- Full index: ${AI_DISCOVERY_LINKS.llmsFull}
- JSON catalog: ${AI_DISCOVERY_LINKS.indexJson}

## Latest Release

${
  latestRelease
    ? `- Version: ${latestRelease.version}
- Date: ${latestRelease.date}
- Title: ${latestRelease.title}
- Summary: ${latestRelease.summary || "No summary provided."}`
    : "- No changelog entries available."
}

## Guides

${guideSection}

## Component Catalog

${componentSection}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
