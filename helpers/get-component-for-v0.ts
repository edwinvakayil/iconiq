import { SITE } from "@/constants";

const COMPONENT_EXAMPLE: Record<string, string> = {
  highlighter:
    `import { Highlighter } from "@/components/ui/highlighter"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    '      <p className="font-sans text-lg text-neutral-600">\n' +
    '        Motion-powered icons for your{" "}\n' +
    '        <Highlighter containerClassName="inline-block align-baseline">\n' +
    '          <span className="relative z-10">React projects</span>\n' +
    "        </Highlighter>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "animated-tooltip":
    `import { AnimatedTooltip } from "@/components/ui/animated-tooltip"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center">\n' +
    '      <AnimatedTooltip content="Hover me!">\n' +
    '        <button type="button">Hover me</button>\n' +
    "      </AnimatedTooltip>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
};

const getComponentForV0 = async (name: string) => {
  try {
    const registryData = await (
      await fetch(`${SITE.URL}/r/${name}.json`)
    ).json();

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
