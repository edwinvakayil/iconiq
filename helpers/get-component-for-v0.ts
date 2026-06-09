import fs from "node:fs/promises";
import path from "node:path";

import { SITE } from "@/constants";
import {
  alertPreviewCode,
  avatarPreviewCode,
  badgePreviewCode,
  buildV0Page,
  cardPreviewCode,
  carouselPreviewCode,
  chartsPreviewCode,
  ensureV0Page,
  getComponentV0Page,
  infiniteRibbonPreviewCode,
  skeletonPreviewCode,
  themeTogglePreviewCode,
  verifiedBadgePreviewCode,
} from "@/lib/component-v0-pages";

const COMPONENT_EXAMPLE: Record<string, string> = {
  alert: buildV0Page(alertPreviewCode),
  avatar: buildV0Page(avatarPreviewCode),
  accordion: buildV0Page(
    `import { Accordion, type AccordionItem } from "@/components/ui/accordion";

const items: AccordionItem[] = [
  {
    id: "1",
    title: "What makes this accordion special?",
    content:
      "It uses spring-based physics animations powered by Motion, creating fluid and natural feeling transitions that respond organically to user interaction.",
  },
  {
    id: "2",
    title: "How does the animation work?",
    content:
      "Each element animates independently with carefully tuned spring parameters for a layered, premium feel.",
  },
  {
    id: "3",
    title: "Can I customize the content?",
    content: "Content accepts any React node for richer FAQ answers.",
  },
  {
    id: "4",
    title: "Is it accessible?",
    content:
      "Yes. It uses semantic button elements, proper ARIA attributes, and supports full keyboard navigation out of the box.",
  },
];

export function AccordionPreview() {
  return <Accordion className="w-full max-w-none" items={items} />;
}`
  ),
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
  card: buildV0Page(cardPreviewCode),
  charts: buildV0Page(chartsPreviewCode),
  infiniteribbon: buildV0Page(infiniteRibbonPreviewCode),
  "theme-toggle": buildV0Page(themeTogglePreviewCode),
  "verified-badge": buildV0Page(verifiedBadgePreviewCode),
  carousel: buildV0Page(carouselPreviewCode),
  "button-group": buildV0Page(`"use client";

import { MoreHorizontalIcon } from "lucide-react";

import {
  Button,
  ButtonGroup,
  IconButton,
} from "@/components/ui/button-group";

const previewWrapClassName =
  "mx-auto flex max-w-full flex-wrap justify-center gap-2";
const previewStackClassName =
  "mx-auto flex max-w-full flex-col items-center gap-3";
const buttonClassName =
  "border-border bg-background px-3 hover:bg-muted hover:text-foreground";
const iconButtonClassName =
  "border-border bg-background p-0 text-muted-foreground hover:bg-muted hover:text-foreground [&_svg]:size-3.5";

export function ButtonGroupDemo() {
  return (
    <div className={previewStackClassName}>
      <p className="text-center text-muted-foreground text-sm">
        Review the latest project changes before sharing them with your team.
      </p>
      <div className={previewWrapClassName}>
        <ButtonGroup>
          <Button className={buttonClassName} size="sm">
            Edit
          </Button>
          <Button className={buttonClassName} size="sm">
            Preview
          </Button>
          <Button className={buttonClassName} size="sm">
            Publish
          </Button>
          <IconButton
            aria-label="More project actions"
            className={iconButtonClassName}
            size="sm"
          >
            <MoreHorizontalIcon />
          </IconButton>
        </ButtonGroup>
      </div>
    </div>
  );
}`),
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
  checkbox:
    '"use client";\n\n' +
    `import { Checkbox } from "@/components/ui/checkbox"\n` +
    `import { useState } from "react"\n\n` +
    "export default function Page() {\n" +
    "  const [checked, setChecked] = useState(true)\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    '      <div className="w-full max-w-sm">\n' +
    "        <Checkbox\n" +
    "          checked={checked}\n" +
    '          id="release-updates"\n' +
    '          label="Email me when the next release ships"\n' +
    "          onCheckedChange={setChecked}\n" +
    "        />\n" +
    "      </div>\n" +
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
    `import { useState } from "react"\n\n` +
    "import {\n" +
    "  Combobox,\n" +
    "  ComboboxContent,\n" +
    "  ComboboxEmpty,\n" +
    "  ComboboxInput,\n" +
    "  ComboboxItem,\n" +
    "  ComboboxList,\n" +
    `} from "@/components/ui/combobox"\n\n` +
    "type RouteOption = {\n" +
    "  value: string\n" +
    "  label: string\n" +
    "  description: string\n" +
    "}\n\n" +
    "const options: RouteOption[] = [\n" +
    '  { value: "scout", label: "Scout pass", description: "First scan before the sprint" },\n' +
    '  { value: "transit", label: "Transit window", description: "Tighter route through midfield" },\n' +
    '  { value: "deep", label: "Deep field", description: "Longer view with less traffic" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  const [value, setValue] = useState<RouteOption | null>(options[1])\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-md items-center justify-center p-8">\n' +
    "      <Combobox\n" +
    "        itemToStringLabel={(item) => item.label}\n" +
    "        itemToStringValue={(item) => item.value}\n" +
    "        items={options}\n" +
    "        onValueChange={setValue}\n" +
    "        value={value}\n" +
    "      >\n" +
    '        <ComboboxInput placeholder="Pick a route..." />\n' +
    "        <ComboboxContent>\n" +
    "          <ComboboxList>\n" +
    "            {(option: RouteOption, index: number) => (\n" +
    "              <ComboboxItem description={option.description} index={index} key={option.value} value={option}>\n" +
    "                {option.label}\n" +
    "              </ComboboxItem>\n" +
    "            )}\n" +
    "          </ComboboxList>\n" +
    "          <ComboboxEmpty>No route matches that query.</ComboboxEmpty>\n" +
    "        </ComboboxContent>\n" +
    "      </Combobox>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "b-autocomplete":
    '"use client";\n\n' +
    `import { useState } from "react"\n\n` +
    "import {\n" +
    "  Autocomplete,\n" +
    "  AutocompleteContent,\n" +
    "  AutocompleteInput,\n" +
    "  AutocompleteItem,\n" +
    "  AutocompleteList,\n" +
    `} from "@/components/ui/b-autocomplete"\n\n` +
    "type Country = {\n" +
    "  code: string\n" +
    "  name: string\n" +
    "  region: string\n" +
    "}\n\n" +
    "const countries: Country[] = [\n" +
    '  { code: "CA", name: "Canada", region: "North America" },\n' +
    '  { code: "FR", name: "France", region: "Europe" },\n' +
    '  { code: "JP", name: "Japan", region: "Asia" },\n' +
    '  { code: "MX", name: "Mexico", region: "North America" },\n' +
    '  { code: "US", name: "United States", region: "North America" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    '  const [query, setQuery] = useState("")\n' +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-md items-center justify-center p-8">\n' +
    "      <Autocomplete\n" +
    "        itemToStringValue={(country) => country.name}\n" +
    "        items={countries}\n" +
    "        onValueChange={setQuery}\n" +
    "        value={query}\n" +
    "      >\n" +
    '        <AutocompleteInput placeholder="Search countries..." />\n' +
    "        <AutocompleteContent>\n" +
    "          <AutocompleteList>\n" +
    "            {(country: Country, index: number) => (\n" +
    "              <AutocompleteItem\n" +
    "                description={country.region}\n" +
    "                index={index}\n" +
    "                key={country.code}\n" +
    "                value={country}\n" +
    "              >\n" +
    "                {country.name}\n" +
    "              </AutocompleteItem>\n" +
    "            )}\n" +
    "          </AutocompleteList>\n" +
    "        </AutocompleteContent>\n" +
    "      </Autocomplete>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "context-menu":
    '"use client";\n\n' +
    "import {\n" +
    "  ContextMenu,\n" +
    "  ContextMenuContent,\n" +
    "  ContextMenuItem,\n" +
    "  ContextMenuShortcut,\n" +
    "  ContextMenuTrigger,\n" +
    `} from "@/components/ui/context-menu"\n\n` +
    "export default function Page() {\n" +
    "  return (\n" +
    '    <div className="mx-auto flex min-h-svh w-full max-w-2xl items-center justify-center p-8">\n' +
    "      <ContextMenu>\n" +
    '        <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">\n' +
    "          Right click here\n" +
    "        </ContextMenuTrigger>\n" +
    '        <ContextMenuContent className="w-48">\n' +
    "          <ContextMenuItem>\n" +
    "            Back\n" +
    "            <ContextMenuShortcut>⌘[</ContextMenuShortcut>\n" +
    "          </ContextMenuItem>\n" +
    "          <ContextMenuItem>\n" +
    "            Reload\n" +
    "            <ContextMenuShortcut>⌘R</ContextMenuShortcut>\n" +
    "          </ContextMenuItem>\n" +
    "        </ContextMenuContent>\n" +
    "      </ContextMenu>\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "b-progress": buildV0Page(`"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/b-progress";

const frames = [22, 41, 58, 76, 92, 100];

export function ProgressPreview() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, 1400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Progress
      className="w-full max-w-sm"
      label="Registry sync"
      value={frames[frameIndex]}
    />
  );
}`),
  drawer: buildV0Page(`"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function DrawerPreview() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
          type="button"
        >
          Open drawer
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Workspace details</DrawerTitle>
          <DrawerDescription>
            Review the latest changes before publishing the next update.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2 text-sm text-muted-foreground">
          This drawer keeps the interaction focused without leaving the current
          page.
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <button
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium"
              type="button"
            >
              Close
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}`),
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
  badge: buildV0Page(badgePreviewCode),
  skeleton: buildV0Page(skeletonPreviewCode),
  select:
    '"use client";\n\n' +
    'import { useState } from "react";\n\n' +
    `import { Select, type SelectOption } from "@/components/ui/select"\n\n` +
    "const options: SelectOption[] = [\n" +
    '  { value: "launch", label: "Launch plan" },\n' +
    '  { value: "design", label: "Design pass" },\n' +
    '  { value: "review", label: "Review notes" },\n' +
    "]\n\n" +
    "export default function Page() {\n" +
    "  const [value, setValue] = useState<string | undefined>()\n" +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <Select\n" +
    '        className="w-full max-w-72"\n' +
    "        onChange={setValue}\n" +
    "        options={options}\n" +
    '        placeholder="Choose workflow"\n' +
    "        value={value}\n" +
    "      />\n" +
    "    </div>\n" +
    "  )\n" +
    "}\n",
  "b-select": buildV0Page(`"use client";

import {
  CalendarDays,
  MessageSquareText,
  Palette,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/b-select";

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-72">
        <SelectValue placeholder="Choose workflow" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem icon={<Rocket className="size-4 text-muted-foreground" />} value="launch">
            Launch plan
          </SelectItem>
          <SelectItem icon={<Palette className="size-4 text-muted-foreground" />} value="design">
            Design pass
          </SelectItem>
          <SelectItem icon={<MessageSquareText className="size-4 text-muted-foreground" />} value="review">
            Review notes
          </SelectItem>
          <SelectItem icon={<CalendarDays className="size-4 text-muted-foreground" />} value="schedule">
            Schedule
          </SelectItem>
          <SelectItem icon={<ShieldCheck className="size-4 text-muted-foreground" />} value="approve">
            Approvals
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}`),
  "r-select": buildV0Page(`"use client";

import {
  CalendarDays,
  MessageSquareText,
  Palette,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/r-select";

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-72">
        <SelectValue placeholder="Choose workflow" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem icon={<Rocket className="size-4 text-muted-foreground" />} value="launch">
            Launch plan
          </SelectItem>
          <SelectItem icon={<Palette className="size-4 text-muted-foreground" />} value="design">
            Design pass
          </SelectItem>
          <SelectItem icon={<MessageSquareText className="size-4 text-muted-foreground" />} value="review">
            Review notes
          </SelectItem>
          <SelectItem icon={<CalendarDays className="size-4 text-muted-foreground" />} value="schedule">
            Schedule
          </SelectItem>
          <SelectItem icon={<ShieldCheck className="size-4 text-muted-foreground" />} value="approve">
            Approvals
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}`),
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
  "color-picker":
    '"use client";\n\n' +
    `import { useState } from "react"\n` +
    `import { ColorPicker } from "@/components/ui/color-picker"\n\n` +
    "export default function Page() {\n" +
    '  const [color, setColor] = useState("#3B82F6")\n\n' +
    "  return (\n" +
    '    <div className="flex min-h-svh items-center justify-center p-8">\n' +
    "      <ColorPicker onChange={setColor} value={color} />\n" +
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
  "r-progress": buildV0Page(`"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/r-progress";

const frames = [22, 41, 58, 76, 92, 100];

export function ProgressPreview() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, 1400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Progress
      className="w-full max-w-sm"
      label="Registry sync"
      value={frames[frameIndex]}
    />
  );
}`),
  "b-separator": buildV0Page(`import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/b-separator";

const members = [
  { name: "Maya", src: "/assets/av1.png" },
  { name: "Noah", src: "/assets/av2.png" },
  { name: "Ari", src: "/assets/av3.png" },
];

export function SeparatorPreview() {
  return (
    <div className="w-full max-w-md space-y-5">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {members.map((member) => (
              <Avatar
                alt={member.name}
                className="size-10 border-2 border-background"
                key={member.name}
                name={member.name}
                src={member.src}
              />
            ))}
          </div>
          <div>
            <h3 className="font-medium text-sm">Design sync</h3>
            <p className="text-muted-foreground text-sm">3 people active now</p>
          </div>
        </div>
        <Badge color="emerald" size="sm" variant="dot">
          Live
        </Badge>
      </div>

      <Separator />

      <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center text-sm">
        <div className="min-w-0 text-center">
          <p className="font-medium">12</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Tasks</p>
        </div>
        <Separator className="h-9" orientation="vertical" />
        <div className="min-w-0 text-center">
          <p className="font-medium">98%</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Ready</p>
        </div>
        <Separator className="h-9" orientation="vertical" />
        <div className="min-w-0 text-center">
          <p className="font-medium">4m</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Avg reply</p>
        </div>
      </div>

      <Separator variant="dotted" />

      <div className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Maya moved wireframes</span>
          <span className="font-medium">Now</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Noah resolved comments</span>
          <span className="font-medium">2m ago</span>
        </div>
      </div>
    </div>
  );
}`),
  "r-separator": buildV0Page(`import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/r-separator";

const members = [
  { name: "Maya", src: "/assets/av1.png" },
  { name: "Noah", src: "/assets/av2.png" },
  { name: "Ari", src: "/assets/av3.png" },
];

export function SeparatorPreview() {
  return (
    <div className="w-full max-w-md space-y-5">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {members.map((member) => (
              <Avatar
                alt={member.name}
                className="size-10 border-2 border-background"
                key={member.name}
                name={member.name}
                src={member.src}
              />
            ))}
          </div>
          <div>
            <h3 className="font-medium text-sm">Design sync</h3>
            <p className="text-muted-foreground text-sm">3 people active now</p>
          </div>
        </div>
        <Badge color="emerald" size="sm" variant="dot">
          Live
        </Badge>
      </div>

      <Separator />

      <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center text-sm">
        <div className="min-w-0 text-center">
          <p className="font-medium">12</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Tasks</p>
        </div>
        <Separator className="h-9" orientation="vertical" />
        <div className="min-w-0 text-center">
          <p className="font-medium">98%</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Ready</p>
        </div>
        <Separator className="h-9" orientation="vertical" />
        <div className="min-w-0 text-center">
          <p className="font-medium">4m</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Avg reply</p>
        </div>
      </div>

      <Separator variant="dotted" />

      <div className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Maya moved wireframes</span>
          <span className="font-medium">Now</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Noah resolved comments</span>
          <span className="font-medium">2m ago</span>
        </div>
      </div>
    </div>
  );
}`),
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
  switch: buildV0Page(`"use client";

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
  "dia-text": buildV0Page(`"use client";

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
  "shimmer-text": buildV0Page(`"use client";

import { TextShimmer } from "@/components/ui/shimmer-text";

export function StatusLine() {
  return (
    <TextShimmer className="font-light text-md tracking-tight">
      Agent is thinking ...
    </TextShimmer>
  );
}`),
  "text-inertia": buildV0Page(`"use client";

import TextInertia from "@/components/ui/text-inertia";

export function KineticHeadline() {
  return (
    <TextInertia
      className="w-full max-w-4xl justify-start text-left text-lg leading-relaxed sm:text-xl"
      intensity={0.3}
      text="Crafting refined, pixel-perfect web experiences that balance design clarity with technical excellence. Every interaction should feel responsive, intentional, and calm enough to disappear into the work. Motion adds a quiet layer of feedback, helping people sense where they are and what just changed."
    />
  );
}`),
  typewriter: buildV0Page(`"use client";

import TextTypewriter from "@/components/ui/typewriter";

export function TerminalHeadline() {
  return (
    <TextTypewriter
      className="font-mono text-2xl text-foreground sm:text-4xl"
      duration={2.6}
    >
      Deploying interface motion
    </TextTypewriter>
  );
}`),
  "morph-texts": buildV0Page(`"use client";

import { MorphText } from "@/components/ui/morph-texts";

export function HeroMorph() {
  return (
    <p className="max-w-4xl font-light text-2xl text-foreground tracking-tight sm:text-4xl">
      Build software that feels{" "}
      <MorphText
        fontFamily="inherit"
        fontSize="1em"
        interval={2800}
        textClassName="font-semibold"
        words={["fast", "fluid", "alive"]}
      />
      .
    </p>
  );
}`),
};

type RegistryFile = {
  content: string;
  path: string;
  target?: string;
  type?: string;
};

function parseRegistryDependencyName(dep: string) {
  if (dep.startsWith("@iconiq/")) {
    return dep.slice("@iconiq/".length);
  }

  return dep;
}

function mapRegistryFileForV0(file: RegistryFile, fallbackTarget: string) {
  return {
    path: file.path,
    content: file.content,
    type: file.type === "registry:ui" ? "registry:component" : file.type,
    target: file.target ?? fallbackTarget,
  };
}

async function loadRegistryDependencyFiles(registryDependencies: string[]) {
  const dependencyFiles: ReturnType<typeof mapRegistryFileForV0>[] = [];

  for (const dep of registryDependencies) {
    const depName = parseRegistryDependencyName(dep);
    const depFilePath = path.join(
      process.cwd(),
      "public",
      "r",
      `${depName}.json`
    );

    try {
      const depFile = await fs.readFile(depFilePath, "utf8");
      const depData = JSON.parse(depFile);

      for (const file of (depData.files ?? []) as RegistryFile[]) {
        dependencyFiles.push(mapRegistryFileForV0(file, file.path));
      }
    } catch (error) {
      console.warn(`Could not load registry dependency ${dep}:`, error);
    }
  }

  return dependencyFiles;
}

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

    const pageContentSource =
      pageContentOverride ??
      (getComponentV0Page(name) || COMPONENT_EXAMPLE[name]) ??
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

    const pageContent = ensureV0Page(pageContentSource);

    const description =
      registryData.description ?? `${name} component from Iconiq`;
    const registryFiles = (registryData.files ?? []).map((file: RegistryFile) =>
      mapRegistryFileForV0(file, `components/ui/${name}.tsx`)
    );
    const dependencyFiles = await loadRegistryDependencyFiles(
      registryData.registryDependencies || []
    );

    const template = {
      name,
      type: "registry:component",
      title: registryData.title ?? name,
      dependencies: registryData.dependencies || [],
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
        ...dependencyFiles,
        ...registryFiles,
      ],
    };

    return template;
  } catch (error) {
    console.error(`Error reading registry file ${name}:`, error);
    return null;
  }
};

export { getComponentForV0 };
