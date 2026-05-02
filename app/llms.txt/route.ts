import { LINK, SITE } from "@/constants";
import { SITE_SECTIONS } from "@/lib/site-nav";

export function GET() {
  const componentNames = SITE_SECTIONS.flatMap((section) =>
    section.children.map((item) => item.label)
  ).join(", ");

  const content = `# ${SITE.NAME}

> Motion-powered React components delivered through the shadcn registry

${SITE.NAME} is an open-source collection of motion-aware UI components for React projects.

## Overview

- Website: ${SITE.URL}
- GitHub: ${LINK.GITHUB}
- Author: ${SITE.AUTHOR.TWITTER} (${LINK.TWITTER})

## Tech Stack

- React components with TypeScript
- Animations powered by Motion (${LINK.MOTION})
- Registry delivery aligned with shadcn/ui conventions

## Installation

\`\`\`bash
npx shadcn@latest add @iconiq/button
\`\`\`

You can also install from a direct registry URL:

\`\`\`bash
npx shadcn@latest add ${SITE.URL}/r/button.json
\`\`\`

## Available Components (${SITE_SECTIONS.flatMap((section) => section.children).length} total)

${componentNames}

## Usage

\`\`\`tsx
import { Button } from "@/registry/button";

export function Demo() {
  return <Button>Launch</Button>;
}
\`\`\`

## Open Source

Free for personal and commercial use.

## Contributing

Contributions welcome! See CONTRIBUTING.md for guidelines.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
