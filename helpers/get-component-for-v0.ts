import fs from "node:fs/promises";
import path from "node:path";

import { SITE } from "@/constants";
import { skeletonV0Page, usageToV0Page } from "@/lib/component-v0-pages";

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
    `import { Avatar } from "@/components/ui/avatar"\n\n` +
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
  accordion:
    '"use client";\n\n' +
    `import { Accordion } from "@/components/ui/accordion"\n\n` +
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
  "button-group":
    '"use client";\n\n' +
    `import { Bell, Grid2x2, List, Table2 } from "lucide-react"\n` +
    "import {\n" +
    "  ButtonGroupItems,\n" +
    "  IconButton,\n" +
    `} from "@/components/ui/button-group"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col items-center justify-center gap-8 p-8">\n' +
    "      <ButtonGroupItems>\n" +
    '        <button type="button">\n' +
    '          <List className="size-4" />\n' +
    "          List\n" +
    "        </button>\n" +
    '        <button type="button">\n' +
    '          <Grid2x2 className="size-4" />\n' +
    "          Board\n" +
    "        </button>\n" +
    '        <button type="button">\n' +
    '          <Table2 className="size-4" />\n' +
    "          Table\n" +
    "        </button>\n" +
    "      </ButtonGroupItems>\n" +
    "\n" +
    '      <IconButton aria-label="Notifications" type="button">\n' +
    '        <Bell className="size-4" />\n' +
    "      </IconButton>\n" +
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
    `import { Combobox, type ComboboxOption } from "@/components/ui/combobox"\n` +
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
  dropdown:
    '"use client";\n\n' +
    "import {\n" +
    "  Dropdown,\n" +
    "  DropdownContent,\n" +
    "  DropdownItem,\n" +
    "  DropdownTrigger,\n" +
    "  DropdownValue,\n" +
    `} from "@/components/ui/dropdown"\n` +
    `import { useState } from "react"\n\n` +
    "export default function Page() {\n" +
    '  const [value, setValue] = useState<string | undefined>("design")\n' +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    '      <Dropdown className="w-56" onValueChange={setValue} value={value}>\n' +
    "        <DropdownTrigger>\n" +
    '          <DropdownValue placeholder="Choose a team" />\n' +
    "        </DropdownTrigger>\n" +
    '        <DropdownContent className="w-full">\n' +
    '          <DropdownItem value="design">Design</DropdownItem>\n' +
    '          <DropdownItem value="product">Product</DropdownItem>\n' +
    '          <DropdownItem value="engineering">Engineering</DropdownItem>\n' +
    "        </DropdownContent>\n" +
    "      </Dropdown>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "file-upload":
    '"use client";\n\n' +
    `import { FileUpload } from "@/components/ui/file-upload"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-3xl items-center justify-center p-8">\n' +
    "      <FileUpload />\n" +
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
    '      <RadioGroup aria-label="Delivery options" onChange={setValue} options={options} value={value} />\n' +
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
    `import { Select } from "@/components/ui/select"\n` +
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
    '              <button className="min-h-11 rounded-md border px-4 text-sm" type="button">\n' +
    "                Open popover\n" +
    "              </button>\n" +
    "            </PopoverTrigger>\n" +
    "          </div>\n" +
    "        </PopoverAnchor>\n" +
    '        <PopoverContent className="w-80">\n' +
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
  "input-group":
    '"use client";\n\n' +
    `import { Eye, EyeOff, LockKeyhole, Mail, User2 } from "lucide-react"\n` +
    `import { useState } from "react"\n` +
    `import { InputGroup, InputGroupField } from "@/components/ui/input-group"\n\n` +
    "export default function Page() {\n" +
    '  const [name, setName] = useState("")\n' +
    '  const [email, setEmail] = useState("")\n' +
    "  const [showPassword, setShowPassword] = useState(false)\n\n" +
    "  const emailError =\n" +
    '    email.length > 0 && !email.includes("@")\n' +
    '      ? "Enter a valid email address."\n' +
    "      : undefined\n\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-xl items-center justify-center p-8">\n' +
    "      <InputGroup>\n" +
    "        <InputGroupField\n" +
    '          label="Full name"\n' +
    "          onChange={(event) => setName(event.target.value)}\n" +
    '          prefixIcon={<User2 aria-hidden className="size-5" />}\n' +
    "          value={name}\n" +
    "        />\n" +
    "        <InputGroupField\n" +
    "          error={emailError}\n" +
    '          label="Work email"\n' +
    "          onChange={(event) => setEmail(event.target.value)}\n" +
    '          prefixIcon={<Mail aria-hidden className="size-5" />}\n' +
    '          type="email"\n' +
    "          value={email}\n" +
    "        />\n" +
    "        <InputGroupField\n" +
    '          label="Password"\n' +
    '          prefixIcon={<LockKeyhole aria-hidden className="size-5" />}\n' +
    '          suffixLabel={showPassword ? "Hide password" : "Show password"}\n' +
    '          suffixIcon={showPassword ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}\n' +
    "          onSuffixClick={() => setShowPassword((current) => !current)}\n" +
    '          type={showPassword ? "text" : "password"}\n' +
    "        />\n" +
    "      </InputGroup>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  pagination:
    '"use client";\n\n' +
    `import { useState } from "react"\n` +
    "import {\n" +
    "  Pagination,\n" +
    "  PaginationContent,\n" +
    "  PaginationEllipsis,\n" +
    "  PaginationItem,\n" +
    "  PaginationLink,\n" +
    "  PaginationNext,\n" +
    "  PaginationPrevious,\n" +
    `} from "@/components/ui/pagination"\n\n` +
    "function getVisiblePages(page: number, total: number) {\n" +
    '  const pages: (number | "…")[] = []\n\n' +
    "  for (let index = 1; index <= total; index++) {\n" +
    "    if (\n" +
    "      index === 1 ||\n" +
    "      index === total ||\n" +
    "      (index >= page - 1 && index <= page + 1)\n" +
    "    ) {\n" +
    "      pages.push(index)\n" +
    '    } else if (pages.at(-1) !== "…") {\n' +
    '      pages.push("…")\n' +
    "    }\n" +
    "  }\n\n" +
    "  return pages\n" +
    "}\n\n" +
    "export default function Page() {\n" +
    "  const [page, setPage] = useState(4)\n\n" +
    "  const pages = getVisiblePages(page, 12)\n\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Pagination onChange={setPage} page={page} total={12}>\n" +
    "        <PaginationContent>\n" +
    "          <PaginationPrevious />\n" +
    "          {pages.map((item, index) =>\n" +
    '            item === "…" ? (\n' +
    "              <PaginationItem key={`ellipsis-$" +
    "{index}`}>\n" +
    "                <PaginationEllipsis />\n" +
    "              </PaginationItem>\n" +
    "            ) : (\n" +
    "              <PaginationItem key={item}>\n" +
    "                <PaginationLink\n" +
    '                  className="tabular-nums"\n' +
    "                  isActive={item === page}\n" +
    "                  onClick={() => setPage(item)}\n" +
    "                >\n" +
    '                  {String(item).padStart(2, "0")}\n' +
    "                </PaginationLink>\n" +
    "              </PaginationItem>\n" +
    "            )\n" +
    "          )}\n" +
    "          <PaginationNext />\n" +
    "        </PaginationContent>\n" +
    "      </Pagination>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  tabs:
    '"use client";\n\n' +
    "import {\n" +
    "  Tabs,\n" +
    "  TabsContent,\n" +
    "  TabsList,\n" +
    "  TabsTrigger,\n" +
    `} from "@/components/ui/tabs"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-3xl items-center justify-center p-8">\n' +
    '      <Tabs className="w-full" defaultValue="overview">\n' +
    "        <TabsList>\n" +
    '          <TabsTrigger value="overview">Overview</TabsTrigger>\n' +
    '          <TabsTrigger value="activity">Activity</TabsTrigger>\n' +
    '          <TabsTrigger value="files">Files</TabsTrigger>\n' +
    "        </TabsList>\n" +
    '        <TabsContent value="overview">\n' +
    '          <p className="text-sm text-muted-foreground">A concise summary for the current workspace.</p>\n' +
    "        </TabsContent>\n" +
    '        <TabsContent value="activity">\n' +
    '          <p className="text-sm text-muted-foreground">Recent updates, comments, and handoff notes.</p>\n' +
    "        </TabsContent>\n" +
    '        <TabsContent value="files">\n' +
    '          <p className="text-sm text-muted-foreground">Attached assets and supporting documents.</p>\n' +
    "        </TabsContent>\n" +
    "      </Tabs>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  table:
    '"use client";\n\n' +
    "import {\n" +
    "  Table,\n" +
    "  TableBody,\n" +
    "  TableCaption,\n" +
    "  TableCell,\n" +
    "  TableHead,\n" +
    "  TableHeader,\n" +
    "  TableRow,\n" +
    `} from "@/components/ui/table"\n\n` +
    "const rows = [\n" +
    '  { id: "1", name: "Ada Lovelace", role: "Engineer", status: "Active", amount: "$4,200" },\n' +
    '  { id: "2", name: "Grace Hopper", role: "Architect", status: "Pending", amount: "$3,100" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-6xl items-center justify-center p-8">\n' +
    "      <Table>\n" +
    "        <TableHeader>\n" +
    '          <TableRow variant="header">\n' +
    "            <TableHead>Name</TableHead>\n" +
    "            <TableHead>Role</TableHead>\n" +
    "            <TableHead>Status</TableHead>\n" +
    '            <TableHead align="right">Amount</TableHead>\n' +
    "          </TableRow>\n" +
    "        </TableHeader>\n" +
    "        <TableBody>\n" +
    "          {rows.map((row, index) => (\n" +
    "            <TableRow index={index} key={row.id}>\n" +
    '              <TableCell className="font-medium text-foreground">{row.name}</TableCell>\n' +
    '              <TableCell className="text-muted-foreground">{row.role}</TableCell>\n' +
    "              <TableCell>{row.status}</TableCell>\n" +
    '              <TableCell align="right" className="tabular-nums text-foreground">{row.amount}</TableCell>\n' +
    "            </TableRow>\n" +
    "          ))}\n" +
    "        </TableBody>\n" +
    "        <TableCaption>2 revenue entries</TableCaption>\n" +
    "      </Table>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  toggle:
    '"use client";\n\n' +
    `import { Bold, Italic, Underline } from "lucide-react"\n` +
    `import { useState } from "react"\n` +
    `import { Toggle } from "@/components/ui/toggle"\n\n` +
    "export default function Page() {\n" +
    "  const [bold, setBold] = useState(false)\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-xl items-center justify-center p-8">\n' +
    '      <div className="flex items-center gap-2">\n' +
    '        <Toggle aria-label="Toggle bold" onPressedChange={setBold} pressed={bold}>\n' +
    '          <Bold className="size-4" />\n' +
    "          Bold\n" +
    "        </Toggle>\n" +
    '        <Toggle aria-label="Toggle italic" variant="outline">\n' +
    '          <Italic className="size-4" />\n' +
    "        </Toggle>\n" +
    '        <Toggle aria-label="Toggle underline" variant="outline">\n' +
    '          <Underline className="size-4" />\n' +
    "        </Toggle>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  tooltip:
    '"use client";\n\n' +
    `import { Tooltip } from "@/components/ui/tooltip"\n\n` +
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
  switch: usageToV0Page(`"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export function MotionSwitch() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Switch
      aria-label="Enable motion"
      checked={enabled}
      label="Enable motion"
      onCheckedChange={setEnabled}
    />
  );
}`),
  skeleton: skeletonV0Page,
  "dia-text": usageToV0Page(`"use client";

import { DiaText } from "@/components/ui/dia-text";

export function HeroHeadline() {
  return (
    <p className="font-light text-4xl tracking-tight">
      Make interfaces feel{" "}
      <DiaText
        repeat
        repeatDelay={1.1}
        text={["smooth.", "focused.", "refined."]}
      />
    </p>
  );
}`),
  "shimmer-text": usageToV0Page(`"use client";

import { TextShimmer } from "@/components/ui/shimmer-text";

export function StatusLine() {
  return (
    <TextShimmer className="font-light text-md tracking-tight">
      Agent is thinking ...
    </TextShimmer>
  );
}`),
};

const getComponentForV0 = async (
  name: string,
  pageContentOverride?: string
) => {
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
      pageContentOverride ??
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
