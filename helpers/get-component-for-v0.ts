import fs from "node:fs/promises";
import path from "node:path";

import { SITE } from "@/constants";

/** Example app/page.tsx snippets for v0 templates (registry name → content). */
const COMPONENT_EXAMPLE: Record<string, string> = {
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
  avatar:
    '"use client";\n\n' +
    `import { avatar as Avatar } from "@/components/ui/avatar"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <a\n" +
    '        className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"\n' +
    '        href="https://github.com/account"\n' +
    '        rel="noopener noreferrer"\n' +
    '        target="_blank"\n' +
    "      >\n" +
    '        <Avatar src="https://avatars.githubusercontent.com/u/180170746?v=4" />\n' +
    "      </a>\n" +
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
  calendar:
    '"use client";\n\n' +
    `import { Calendar } from "@/components/ui/calendar"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Calendar />\n" +
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
  combobox:
    '"use client";\n\n' +
    `import { combobox as Combobox, type ComboboxOption } from "@/components/ui/combobox"\n` +
    `import { useState } from "react"\n\n` +
    "const options: ComboboxOption[] = [\n" +
    '  { value: "scout", label: "Scout pass", description: "First scan before the sprint" },\n' +
    '  { value: "transit", label: "Transit window", description: "Tighter route through midfield" },\n' +
    '  { value: "deep", label: "Deep field", description: "Longer view with less traffic" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    '  const [value, setValue] = useState("transit")\n' +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-md items-center justify-center p-8">\n' +
    "      <Combobox\n" +
    '        className="w-full"\n' +
    '        emptyMessage="No route matches that query."\n' +
    "        onChange={setValue}\n" +
    "        options={options}\n" +
    '        placeholder="Pick a route..."\n' +
    "        value={value}\n" +
    "      />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "context-menu":
    '"use client";\n\n' +
    `import { Copy, PencilLine, Share2, Trash2 } from "lucide-react"\n` +
    `import { ContextMenu, type ContextMenuItem } from "@/components/ui/context-menu"\n\n` +
    "const items: ContextMenuItem[] = [\n" +
    '  { label: "Rename", icon: <PencilLine className="size-3.5" />, shortcut: "R" },\n' +
    '  { label: "Duplicate", icon: <Copy className="size-3.5" />, shortcut: "Cmd+D", separatorAfter: true },\n' +
    '  { label: "Share", icon: <Share2 className="size-3.5" />, shortcut: "S" },\n' +
    '  { label: "Delete", icon: <Trash2 className="size-3.5" />, shortcut: "Del", destructive: true },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-2xl items-center justify-center p-8">\n' +
    '      <ContextMenu className="w-full" items={items}>\n' +
    '        <div className="w-full rounded-2xl border border-border px-6 py-16 text-center">\n' +
    '          <p className="font-medium text-foreground">Right-click this surface</p>\n' +
    '          <p className="mt-2 text-sm text-muted-foreground">Use the menu for local file actions.</p>\n' +
    "        </div>\n" +
    "      </ContextMenu>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  drawer:
    '"use client";\n\n' +
    `import { useState } from "react"\n` +
    `import { Drawer } from "@/components/ui/drawer"\n\n` +
    "export default function Page() {\n" +
    "  const [open, setOpen] = useState(false)\n\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <>\n" +
    "        <button\n" +
    '          className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"\n' +
    "          onClick={() => setOpen(true)}\n" +
    '          type="button"\n' +
    "        >\n" +
    "          Open drawer\n" +
    "        </button>\n" +
    "        <Drawer\n" +
    '          description="Review the latest changes before publishing the next update."\n' +
    "          onClose={() => setOpen(false)}\n" +
    "          open={open}\n" +
    '          title="Workspace details"\n' +
    "        >\n" +
    '          <div className="space-y-3">\n' +
    '            <p className="text-sm text-muted-foreground">\n' +
    "              This drawer keeps the interaction focused without leaving the current page.\n" +
    "            </p>\n" +
    "          </div>\n" +
    "        </Drawer>\n" +
    "      </>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  radiogroup:
    '"use client";\n\n' +
    `import RadioGroup from "@/components/ui/radiogroup"\n` +
    `import { useState } from "react"\n\n` +
    "const options = [\n" +
    '  { value: "standard", label: "Standard", description: "Ship in 3–5 days" },\n' +
    '  { value: "express", label: "Express", description: "Next business day" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    '  const [value, setValue] = useState("standard")\n' +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <RadioGroup onChange={setValue} options={options} value={value} />\n" +
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
    `import { ChevronsUpDown, Trophy } from "lucide-react"\n` +
    `import { useState } from "react"\n` +
    "import {\n" +
    "  Collapsible,\n" +
    "  CollapsibleContent,\n" +
    "  CollapsibleTrigger,\n" +
    `} from "@/components/ui/collapsible"\n\n` +
    "const MATCH_DETAIL_ROWS: { label: string; value: string }[] = [\n" +
    '  { label: "Midfield", value: "Press, recycle, stay compact." },\n' +
    '  { label: "Last line", value: "One ball behind the line." },\n' +
    '  { label: "Keyboard", value: "Tab in — same note." },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  const [open, setOpen] = useState(true)\n\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    '      <div className="w-full max-w-sm">\n' +
    "        <Collapsible onOpenChange={setOpen} open={open}>\n" +
    '          <div className="mb-3 flex items-center justify-between">\n' +
    '            <div className="flex items-center gap-2.5">\n' +
    '              <span className="flex size-7 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white">\n' +
    '                <Trophy className="size-3.5 text-white dark:text-neutral-900" />\n' +
    "              </span>\n" +
    '              <span className="font-semibold text-base text-neutral-900 dark:text-white">\n' +
    "                Match sheet\n" +
    "              </span>\n" +
    "            </div>\n" +
    '            <CollapsibleTrigger className="flex size-8 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300">\n' +
    '              <ChevronsUpDown className="size-4" />\n' +
    "            </CollapsibleTrigger>\n" +
    "          </div>\n\n" +
    '          <div className="rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-700">\n' +
    '            <div className="flex items-center justify-between gap-2">\n' +
    '              <span className="text-neutral-400 text-sm dark:text-neutral-500">\n' +
    "                Phase\n" +
    "              </span>\n" +
    '              <div className="flex items-center gap-2">\n' +
    '                <span className="text-right font-semibold text-neutral-900 text-sm dark:text-white">\n' +
    "                  Build-up → Break\n" +
    "                </span>\n" +
    '                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">\n' +
    "                  Live\n" +
    "                </span>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n\n" +
    '          <CollapsibleContent className="mt-2 flex flex-col gap-2">\n' +
    "            {MATCH_DETAIL_ROWS.map((row) => (\n" +
    "              <div\n" +
    '                className="rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-700"\n' +
    "                key={row.label}\n" +
    "              >\n" +
    '                <p className="font-medium text-neutral-400 text-xs dark:text-neutral-500">\n' +
    "                  {row.label}\n" +
    "                </p>\n" +
    '                <p className="mt-0.5 font-semibold text-neutral-900 text-sm dark:text-white">\n' +
    "                  {row.value}\n" +
    "                </p>\n" +
    "              </div>\n" +
    "            ))}\n" +
    "          </CollapsibleContent>\n" +
    "        </Collapsible>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  dialog:
    '"use client";\n\n' +
    "import {\n" +
    "  Dialog,\n" +
    "  DialogContent,\n" +
    "  DialogDescription,\n" +
    "  DialogFooter,\n" +
    "  DialogHeader,\n" +
    "  DialogTitle,\n" +
    "  DialogTrigger,\n" +
    `} from "@/components/ui/dialog"\n` +
    `import { useState } from "react"\n\n` +
    "export default function Page() {\n" +
    "  const [open, setOpen] = useState(false)\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Dialog onOpenChange={setOpen} open={open}>\n" +
    "        <DialogTrigger asChild>\n" +
    "          <button\n" +
    '            className="rounded-lg border border-border bg-background px-4 py-2 font-medium text-sm"\n' +
    '            type="button"\n' +
    "          >\n" +
    "            Open dialog\n" +
    "          </button>\n" +
    "        </DialogTrigger>\n" +
    '        <DialogContent className="sm:max-w-md" open={open}>\n' +
    "          <DialogHeader>\n" +
    "            <DialogTitle>Motion dialog</DialogTitle>\n" +
    "            <DialogDescription>\n" +
    "              Overlay blur, spring scale, and staggered copy. Pass the same\n" +
    "              open boolean to DialogContent as the Dialog root.\n" +
    "            </DialogDescription>\n" +
    "          </DialogHeader>\n" +
    "          <DialogFooter>\n" +
    "            <button\n" +
    '              className="rounded-md border border-border px-3 py-1.5 text-sm"\n' +
    "              onClick={() => setOpen(false)}\n" +
    '              type="button"\n' +
    "            >\n" +
    "              Close\n" +
    "            </button>\n" +
    "          </DialogFooter>\n" +
    "        </DialogContent>\n" +
    "      </Dialog>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  spinner:
    '"use client";\n\n' +
    `import Spinner from "@/components/ui/spinner"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh flex-wrap items-center justify-center gap-8 p-8">\n' +
    "      <Spinner />\n" +
    '      <Spinner variant="dots" className="size-5" />\n' +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  slider:
    '"use client";\n\n' +
    `import { Slider } from "@/components/ui/slider"\n` +
    `import { useState } from "react"\n\n` +
    "export default function Page() {\n" +
    "  const [n, setN] = useState(42)\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-10 p-8">\n' +
    '      <Slider label="Brightness" value={n} onChange={setN} />\n' +
    '      <Slider defaultValue={30} max={200} min={0} showValue label="Exposure" step={5} />\n' +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "hover-card":
    '"use client";\n\n' +
    "import {\n" +
    "  HoverCard,\n" +
    "  HoverCardContent,\n" +
    "  HoverCardTrigger,\n" +
    `} from "@/components/ui/hover-card"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <HoverCard openDelay={120}>\n" +
    "        <HoverCardTrigger asChild>\n" +
    '          <button className="rounded-md border px-3 py-2 text-sm" type="button">\n' +
    "            View profile\n" +
    "          </button>\n" +
    "        </HoverCardTrigger>\n" +
    '        <HoverCardContent className="w-80">\n' +
    '          <div className="space-y-2">\n' +
    '            <p className="font-medium">Lina Warren</p>\n' +
    '            <p className="text-sm text-muted-foreground">\n' +
    "              Product designer working on onboarding and motion systems.\n" +
    "            </p>\n" +
    "          </div>\n" +
    "        </HoverCardContent>\n" +
    "      </HoverCard>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  popover:
    '"use client";\n\n' +
    `import { useState } from "react"\n` +
    "import {\n" +
    "  Popover,\n" +
    "  PopoverAnchor,\n" +
    "  PopoverContent,\n" +
    "  PopoverTrigger,\n" +
    `} from "@/components/ui/popover"\n\n` +
    "export default function Page() {\n" +
    "  const [open, setOpen] = useState(false)\n\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Popover onOpenChange={setOpen} open={open}>\n" +
    "        <PopoverAnchor asChild>\n" +
    '          <div className="inline-flex items-center gap-3">\n' +
    '            <span className="text-sm text-muted-foreground">Project notes</span>\n' +
    "            <PopoverTrigger asChild>\n" +
    '              <button className="rounded-md border px-3 py-2 text-sm" type="button">\n' +
    "                Open popover\n" +
    "              </button>\n" +
    "            </PopoverTrigger>\n" +
    "          </div>\n" +
    "        </PopoverAnchor>\n" +
    '        <PopoverContent className="w-80" open={open}>\n' +
    '          <div className="space-y-2">\n' +
    '            <p className="font-medium">Kickoff summary</p>\n' +
    '            <p className="text-sm text-muted-foreground">\n' +
    "              Align scope, confirm launch timing, and keep motion lightweight.\n" +
    "            </p>\n" +
    "          </div>\n" +
    "        </PopoverContent>\n" +
    "      </Popover>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  input:
    '"use client";\n\n' +
    `import { input as Input } from "@/components/ui/input"\n` +
    `import { useState } from "react"\n\n` +
    "export default function Page() {\n" +
    '  const [text, setText] = useState("Hello")\n' +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center p-8">\n' +
    '      <Input label="Your name" value={text} onChange={setText} placeholder=" " />\n' +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  switch:
    '"use client";\n\n' +
    `import { switch as Switch } from "@/components/ui/switch"\n` +
    `import { useState } from "react"\n\n` +
    "export default function Page() {\n" +
    "  const [on, setOn] = useState(false)\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8">\n' +
    '      <div className="flex items-center gap-3">\n' +
    '        <span className="text-sm text-muted-foreground">High press</span>\n' +
    '        <Switch size="md" checked={on} onCheckedChange={setOn} />\n' +
    "      </div>\n" +
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
