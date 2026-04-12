import fs from "node:fs/promises";
import path from "node:path";

import { SITE } from "@/constants";

/** Example app/page.tsx snippets for v0 templates (registry name → content). */
const COMPONENT_EXAMPLE: Record<string, string> = {
  "animated-badges":
    '"use client";\n\n' +
    `import { StatusBadge } from "@/components/ui/animated-badges"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center gap-3 p-8">\n' +
    '      <StatusBadge label="Live" variant="live" />\n' +
    '      <StatusBadge label="Pending" variant="pending" />\n' +
    '      <StatusBadge label="Critical" variant="critical" />\n' +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "motion-accordion":
    '"use client";\n\n' +
    `import { MotionAccordion } from "@/components/ui/motion-accordion"\n\n` +
    "const items = [\n" +
    '  { id: "1", title: "First question", content: "Answer for the first item." },\n' +
    '  { id: "2", title: "Second question", content: "Answer for the second item." },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <MotionAccordion items={items} />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  breadcrumbs:
    '"use client";\n\n' +
    `import { AnimatedBreadcrumbs } from "@/components/ui/breadcrumbs"\n` +
    `import { Home } from "lucide-react"\n\n` +
    "const items = [\n" +
    '  { label: "Home", href: "/", icon: <Home className="size-3.5" /> },\n' +
    '  { label: "Docs", href: "/docs" },\n' +
    '  { label: "Current" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <AnimatedBreadcrumbs items={items} />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
};

const getComponentForV0 = async (name: string) => {
  try {
    const registryFilePath = path.join(
      process.cwd(),
      "public",
      "r",
      `${name}.json`
    );
    const registryFile = await fs.readFile(registryFilePath, "utf8");
    const registryData = JSON.parse(registryFile);

    const pageContent =
      COMPONENT_EXAMPLE[name] ??
      `import { } from "@/components/ui/${name}"\n\nexport default function Page() {\n  return <div />\n}\n`;

    const description =
      registryData.description ?? `${name} component from Iconiq`;

    const template = {
      name,
      type: "registry:component",
      title: registryData.title ?? name,
      source: {
        title: SITE.NAME,
        url: SITE.URL,
        file: `${name}.tsx`,
      },
      registryDependencies: registryData.registryDependencies || [],
      files: [
        {
          path: "page.tsx",
          content: pageContent,
          type: "registry:page",
          target: "app/page.tsx",
        },
        {
          path: "layout.tsx",
          content: `import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: '${registryData.title ?? name}',
  description: '${description}',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={geist.variable + ' font-sans antialiased'}>
        {children}
      </body>
    </html>
  )
}
`,
          type: "registry:page",
          target: "app/layout.tsx",
        },
        {
          path: `components/ui/${name}.tsx`,
          content: registryData.files[0].content,
          type: "registry:component",
          target: `components/ui/${name}.tsx`,
        },
      ],
    };

    return template;
  } catch (error) {
    console.error(`Error reading registry file ${name}:`, error);
    return null;
  }
};

export { getComponentForV0 };
