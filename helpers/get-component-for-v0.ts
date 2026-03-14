import fs from "node:fs/promises";
import path from "node:path";

import { SITE } from "@/constants";

const COMPONENT_EXAMPLE: Record<string, string> = {
  "smart-tooltip":
    `import { SmartTooltip } from "@/components/ui/smart-tooltip"\n\n` +
    '"use client";\n\n' +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-neutral-950">\n' +
    '      <SmartTooltip copyValue="user@example.com">\n' +
    "        Copy email\n" +
    "      </SmartTooltip>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "file-tree":
    "import {\n" +
    "  FileTree,\n" +
    "  FileTreeSearch,\n" +
    "  Folder,\n" +
    "  File,\n" +
    `} from "@/components/ui/file-tree"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-neutral-950">\n' +
    '      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">\n' +
    "        <FileTree\n" +
    '          aria-label="Project files"\n' +
    '          defaultExpanded={["src", "components"]}\n' +
    '          defaultSelected="FileTree.tsx"\n' +
    "        >\n" +
    '          <FileTreeSearch placeholder="Search files..." />\n' +
    '          <Folder id="src" label="src">\n' +
    '            <Folder id="components" label="components">\n' +
    '              <File label="FileTree.tsx" />\n' +
    '              <File label="Sidebar.tsx" />\n' +
    "            </Folder>\n" +
    '            <Folder id="app" label="app">\n' +
    '              <File label="layout.tsx" />\n' +
    '              <File label="page.tsx" />\n' +
    "            </Folder>\n" +
    "          </Folder>\n" +
    '          <Folder id="public" label="public">\n' +
    '            <File label="favicon.ico" />\n' +
    "          </Folder>\n" +
    '          <File label="package.json" />\n' +
    "        </FileTree>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
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
  breadcrumbs:
    '"use client";\n\n' +
    `import { AnimatedBreadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs"\n` +
    `import { Home } from "lucide-react"\n\n` +
    "const items: BreadcrumbItem[] = [\n" +
    '  { label: "Home", href: "/", icon: <Home className="h-3.5 w-3.5" /> },\n' +
    '  { label: "Docs", href: "/" },\n' +
    '  { label: "Components", href: "/components" },\n' +
    '  { label: "Breadcrumb" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <AnimatedBreadcrumbs items={items} />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  radiogroup:
    '"use client";\n\n' +
    `import { AnimatedRadioGroup, AnimatedRadioGroupItem } from "@/components/ui/radiogroup"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    '      <AnimatedRadioGroup defaultValue="pro" name="plan" className="max-w-md">\n' +
    '        <AnimatedRadioGroupItem label="Starter" value="starter" description="For individuals." />\n' +
    '        <AnimatedRadioGroupItem label="Pro" value="pro" description="For growing teams." />\n' +
    '        <AnimatedRadioGroupItem label="Enterprise" value="enterprise" description="For enterprises." />\n' +
    "      </AnimatedRadioGroup>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  slider:
    '"use client";\n\n' +
    `import { AnimatedSlider } from "@/components/ui/slider"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    '      <div className="w-full max-w-md">\n' +
    '        <AnimatedSlider defaultValue={[50]} unit="%" />\n' +
    "      </div>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "magic-pen":
    `import { MagicPen } from "@/components/ui/magic-pen"\n\n` +
    '"use client";\n\n' +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="min-h-svh bg-background text-foreground">\n' +
    '      <MagicPen clipRadiusPx={110} className="min-h-svh" toggleOnClick={false}>\n' +
    '        <div className="mx-auto max-w-3xl p-10 sm:p-14">\n' +
    '          <h1 className="max-w-[24ch] text-balance text-4xl font-black tracking-tight sm:text-6xl">\n' +
    "            Build bold interfaces with Iconiq.\n" +
    "          </h1>\n" +
    '          <p className="mt-5 max-w-[60ch] text-sm opacity-70">\n' +
    "            Wrap your own content with MagicPen to get the cursor reveal effect.\n" +
    "          </p>\n" +
    "          <button\n" +
    '            className="mt-8 rounded-full px-4 py-2 text-sm"\n' +
    "            style={{\n" +
    '              backgroundColor: "var(--magicpen-fg)",\n' +
    '              color: "var(--magicpen-bg)",\n' +
    "            }}\n" +
    '            type="button"\n' +
    "          >\n" +
    "            Button adapts to theme\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </MagicPen>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "drag-task":
    '"use client";\n\n' +
    'import { Flame, Target, Star } from "lucide-react"\n' +
    'import { DragTask, type Task } from "@/components/ui/drag-task"\n\n' +
    "const tasks: Task[] = [\n" +
    "  {\n" +
    '    id: "1",\n' +
    '    text: "Ship the new landing page",\n' +
    '    priority: "high",\n' +
    "    done: false,\n" +
    '    icon: <Flame className="h-4 w-4" />, \n' +
    "  },\n" +
    "  {\n" +
    '    id: "2",\n' +
    '    text: "Review pull requests",\n' +
    '    priority: "medium",\n' +
    "    done: false,\n" +
    '    icon: <Target className="h-4 w-4" />, \n' +
    "  },\n" +
    "  {\n" +
    '    id: "3",\n' +
    '    text: "Update design tokens",\n' +
    '    priority: "low",\n' +
    "    done: true,\n" +
    '    icon: <Star className="h-4 w-4" />, \n' +
    "  },\n" +
    "]\n\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-neutral-950">\n' +
    '      <DragTask initialTasks={tasks} title="Tasks" />\n' +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "accordion-animated":
    `import type { ForwardRefRenderFunction } from "react"\n` +
    `import { forwardRef, useImperativeHandle } from "react"\n` +
    "\n" +
    `import { AccordionAnimated } from "@/components/ui/accordion-animated"\n` +
    "\n" +
    "type AnimatedIconHandle = {\n" +
    "  startAnimation: () => void\n" +
    "  stopAnimation: () => void\n" +
    "}\n" +
    "\n" +
    "interface IconProps {\n" +
    "  size?: number\n" +
    "  className?: string\n" +
    "}\n" +
    "\n" +
    "const makeIcon = (label: string): ForwardRefRenderFunction<AnimatedIconHandle, IconProps> => (\n" +
    "  { size = 24, className },\n" +
    "  ref,\n" +
    ") => {\n" +
    "  useImperativeHandle(ref, () => ({\n" +
    "    startAnimation: () => {},\n" +
    "    stopAnimation: () => {},\n" +
    "  }))\n" +
    "\n" +
    "  return (\n" +
    "    <div\n" +
    "      className={\n" +
    `        "flex items-center justify-center rounded-xl border border-neutral-200/80 bg-white text-xs font-medium text-neutral-700 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-100 " +\n` +
    `        (className ?? "")\n` +
    "      }\n" +
    "      style={{ width: size + 8, height: size + 8 }}\n" +
    "    >\n" +
    "      {label}\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n" +
    "\n" +
    `const PerformanceIcon = forwardRef(makeIcon("P"))\n` +
    `const ProjectsIcon = forwardRef(makeIcon("Pr"))\n` +
    `const SecurityIcon = forwardRef(makeIcon("S"))\n` +
    `const TeamIcon = forwardRef(makeIcon("T"))\n` +
    "\n" +
    "const items = [\n" +
    "  {\n" +
    `    value: "performance",\n` +
    `    title: "Performance",\n` +
    `    subtitle: "Track usage and load",\n` +
    "    content:\n" +
    `      "Monitor response times, traffic spikes, and throughput to keep your product fast under real-world workloads.",\n` +
    "    icon: PerformanceIcon,\n" +
    `    textColor: "text-sky-500",\n` +
    `    bgColor: "bg-sky-500/10",\n` +
    "  },\n" +
    "  {\n" +
    `    value: "projects",\n` +
    `    title: "Projects",\n` +
    `    subtitle: "Organize your work",\n` +
    "    content:\n" +
    `      "Group related tasks, assets, and releases so teams always know what ships together and when.",\n` +
    "    icon: ProjectsIcon,\n" +
    `    textColor: "text-amber-500",\n` +
    `    bgColor: "bg-amber-500/10",\n` +
    "  },\n" +
    "  {\n" +
    `    value: "security",\n` +
    `    title: "Security",\n` +
    `    subtitle: "Control access and risk",\n` +
    "    content:\n" +
    `      "Configure roles, permissions, and enforcement policies to keep sensitive data safe by default.",\n` +
    "    icon: SecurityIcon,\n" +
    `    textColor: "text-emerald-500",\n` +
    `    bgColor: "bg-emerald-500/10",\n` +
    "  },\n" +
    "  {\n" +
    `    value: "team",\n` +
    `    title: "Team Members",\n` +
    `    subtitle: "Manage users and roles",\n` +
    "    content:\n" +
    `      "Invite collaborators, assign responsibilities, and see who is actively contributing to each area.",\n` +
    "    icon: TeamIcon,\n" +
    `    textColor: "text-rose-500",\n` +
    `    bgColor: "bg-rose-500/10",\n` +
    "  },\n" +
    "] as const\n" +
    "\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    `    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-neutral-950">\n` +
    "      <AccordionAnimated defaultValue={[items[0].value]} items={items} />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "hover-flip-card":
    `import Image from "next/image"\n` +
    "\n" +
    `import { HoverFlipCard } from "@/components/ui/hover-flip-card"\n` +
    "\n" +
    "interface CardData {\n" +
    "  id: string\n" +
    "  front: {\n" +
    "    imageSrc: string\n" +
    "    imageAlt: string\n" +
    "    title: string\n" +
    "    description: string\n" +
    "  }\n" +
    "  back: {\n" +
    "    description: string\n" +
    "    buttonText: string\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "const cards: CardData[] = [\n" +
    "  {\n" +
    `    id: "card-1",\n` +
    "    front: {\n" +
    "      imageSrc:\n" +
    `        "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1200",\n` +
    `      imageAlt: "Team collaborating in front of a laptop",\n` +
    `      title: "Sprint Planning",\n` +
    "      description:\n" +
    `        "Give your team a quick overview of what ships this week, with room for links and context.",\n` +
    "    },\n" +
    "    back: {\n" +
    "      description:\n" +
    `        "Flip the card to reveal links to docs, owners, and timelines so everyone stays aligned.",\n` +
    `      buttonText: "View sprint board",\n` +
    "    },\n" +
    "  },\n" +
    "]\n" +
    "\n" +
    `function CardFront({ data }: { data: CardData["front"] }) {\n` +
    "  return (\n" +
    `    <div className="flex h-full w-full flex-col p-4">\n` +
    `      <div className="relative h-48 w-full overflow-hidden rounded-md">\n` +
    "        <Image\n" +
    "          alt={data.imageAlt}\n" +
    `          className="object-cover"\n` +
    "          fill\n" +
    "          src={data.imageSrc}\n" +
    "        />\n" +
    "      </div>\n" +
    `      <div className="p-2">\n` +
    `        <h3 className="mt-2 font-semibold text-base text-neutral-900 dark:text-white">\n` +
    "          {data.title}\n" +
    "        </h3>\n" +
    `        <p className="mt-2 text-[13.5px] text-neutral-600 dark:text-neutral-300">\n` +
    "          {data.description}\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n" +
    "\n" +
    `function CardBack({ data }: { data: CardData["back"] }) {\n` +
    "  return (\n" +
    `    <div className="flex h-full w-full flex-col items-center justify-center p-6">\n` +
    `      <p className="mt-2 text-center text-[13.5px] text-neutral-600 dark:text-neutral-300">\n` +
    "        {data.description}\n" +
    "      </p>\n" +
    "      <button\n" +
    `        className="mt-6 flex h-8 w-min items-center justify-center whitespace-nowrap rounded-md bg-neutral-900 px-4 py-2 text-[13.5px] text-white dark:bg-white dark:text-neutral-900"\n` +
    `        type="button"\n` +
    "      >\n" +
    "        {data.buttonText}\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n" +
    "\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    `    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-neutral-950">\n` +
    "      <HoverFlipCard\n" +
    "        backContent={<CardBack data={cards[0].back} />}\n" +
    "        frontContent={<CardFront data={cards[0].front} />}\n" +
    "        height={300}\n" +
    "        width={350}\n" +
    "      />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "input-group-01":
    '"use client";\n\n' +
    "import {\n" +
    "  PasswordValidationInput,\n" +
    "  type PasswordValidationRule,\n" +
    `} from "@/components/ui/input-group-01"\n\n` +
    "const HAS_DIGIT = /\\\\d/;\n" +
    "const HAS_UPPERCASE = /[A-Z]/;\n" +
    "const HAS_SPECIAL = /[!@#$%^&*]/;\n\n" +
    "const validations: PasswordValidationRule[] = [\n" +
    '  { text: "At least 8 characters", validate: (v) => v.length >= 8 },\n' +
    '  { text: "Contains a number", validate: (v) => HAS_DIGIT.test(v) },\n' +
    '  { text: "Contains uppercase letter", validate: (v) => HAS_UPPERCASE.test(v) },\n' +
    '  { text: "Contains special character", validate: (v) => HAS_SPECIAL.test(v) },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <PasswordValidationInput validations={validations} />\n" +
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
