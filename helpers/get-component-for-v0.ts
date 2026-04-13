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
  alert:
    '"use client";\n\n' +
    `import Alert from "@/components/ui/alert"\n` +
    `import { CheckCircle2 } from "lucide-react"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Alert\n" +
    '        icon={<CheckCircle2 aria-hidden className="size-[18px]" />}\n' +
    '        message="Your workspace was updated."\n' +
    '        title="All set"\n' +
    "      />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "motion-accordion":
    '"use client";\n\n' +
    `import { Accordion } from "@/components/ui/motion-accordion"\n\n` +
    "const items = [\n" +
    '  { id: "1", title: "First question", content: "Answer for the first item." },\n' +
    '  { id: "2", title: "Second question", content: "Answer for the second item." },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Accordion items={items} />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  breadcrumbs:
    '"use client";\n\n' +
    `import { Breadcrumbs } from "@/components/ui/breadcrumbs"\n` +
    `import { Home } from "lucide-react"\n\n` +
    "const items = [\n" +
    '  { label: "Home", href: "/", icon: <Home className="size-3.5" /> },\n' +
    '  { label: "Docs", href: "/docs" },\n' +
    '  { label: "Current" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Breadcrumbs items={items} />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  button:
    '"use client";\n\n' +
    `import { Button } from "@/components/ui/button"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh flex-wrap items-center justify-center gap-3 p-8">\n' +
    "      <Button>Primary</Button>\n" +
    '      <Button variant="outline">Outline</Button>\n' +
    '      <Button variant="secondary" size="sm">\n' +
    "        Small\n" +
    "      </Button>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "checkbox-group":
    '"use client";\n\n' +
    `import { CheckboxGroup } from "@/components/ui/checkbox-group"\n` +
    `import { useState } from "react"\n\n` +
    "const options = [\n" +
    '  { label: "Option A", value: "a" },\n' +
    '  { label: "Option B", value: "b" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  const [value, setValue] = useState<string[]>([])\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <CheckboxGroup onChange={setValue} options={options} value={value} />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  badge:
    '"use client";\n\n' +
    `import Badge from "@/components/ui/badge"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Badge>New</Badge>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  select:
    '"use client";\n\n' +
    `import { select as Select } from "@/components/ui/select"\n` +
    `import { useState } from "react"\n\n` +
    "const options = [\n" +
    '  { value: "a", label: "Option A" },\n' +
    '  { value: "b", label: "Option B" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    '  const [value, setValue] = useState<string | undefined>("a")\n' +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Select onChange={setValue} options={options} value={value} />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  collapsible:
    '"use client";\n\n' +
    "import {\n" +
    "  Collapsible,\n" +
    "  CollapsibleContent,\n" +
    "  CollapsibleTrigger,\n" +
    `} from "@/components/ui/collapsible"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    '      <Collapsible className="w-72 rounded-xl border border-border p-2">\n' +
    '        <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 font-medium text-sm">\n' +
    "          Toggle\n" +
    "        </CollapsibleTrigger>\n" +
    "        <CollapsibleContent>\n" +
    '          <p className="px-3 pb-2 text-muted-foreground text-sm">\n' +
    "            Hidden content goes here.\n" +
    "          </p>\n" +
    "        </CollapsibleContent>\n" +
    "      </Collapsible>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  tooltip:
    '"use client";\n\n' +
    `import { tooltip as Tooltip } from "@/components/ui/tooltip"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    '      <Tooltip content="Hello from the tooltip">\n' +
    "        <button\n" +
    '          className="rounded-lg border border-border bg-card px-4 py-2 text-sm"\n' +
    '          type="button"\n' +
    "        >\n" +
    "          Hover me\n" +
    "        </button>\n" +
    "      </Tooltip>\n" +
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
      [
        '"use client";',
        "",
        "export default function Page() {",
        "  return (",
        `    <div className="flex min-h-svh flex-col items-center justify-center gap-2 p-8 font-sans text-sm">`,
        "      <p>",
        `        No v0 preview snippet for{" "}`,
        `        <code className="rounded bg-muted px-1.5 py-0.5 font-mono">${name}</code>.`,
        "      </p>",
        `      <p className="text-muted-foreground">`,
        "        Add an entry in helpers/get-component-for-v0.ts (COMPONENT_EXAMPLE).",
        "      </p>",
        "    </div>",
        "  )",
        "}",
      ].join("\n");

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
