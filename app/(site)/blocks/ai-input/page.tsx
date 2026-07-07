"use client";

import {
  Archive,
  Briefcase,
  Camera,
  FolderOpen,
  FolderPlus,
  LayoutGrid,
  LayoutTemplate,
  Paperclip,
  Plug,
  Search,
} from "lucide-react";

import { aiInputApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  AIInput,
  type AIInputMenuItem,
  type PromptSettingGroup,
} from "@/registry/ai-input";

const previewSettingGroups: PromptSettingGroup[] = [
  {
    id: "model",
    label: "Model",
    display: "featured",
    moreMenuLabel: "More models",
    options: [
      {
        value: "fable",
        label: "Fable",
        description: "Balanced for creative and everyday tasks",
      },
      {
        value: "sonnet-4.6",
        label: "Sonnet 4.6",
        description: "Most efficient for everyday tasks",
      },
      {
        value: "opus-4",
        label: "Opus 4",
        description: "Stronger reasoning for complex work",
      },
      {
        value: "haiku-3.5",
        label: "Haiku 3.5",
        description: "Fastest responses for quick tasks",
      },
    ],
  },
  {
    id: "effort",
    label: "Effort",
    display: "submenu",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
];

const previewDefaultSettings = { effort: "high" };

const previewMenuItems: AIInputMenuItem[] = [
  {
    value: "add-files",
    label: "Add files or photos",
    icon: Paperclip,
    shortcut: "⌘U",
  },
  { value: "screenshot", label: "Take a screenshot", icon: Camera },
  {
    value: "add-to-project",
    label: "Add to project",
    icon: Archive,
    items: [
      { value: "new-project", label: "New project", icon: FolderPlus },
      {
        value: "existing-project",
        label: "Existing project",
        icon: FolderOpen,
      },
    ],
  },
  { value: "sep-1", type: "separator" },
  {
    value: "skills",
    label: "Skills",
    icon: LayoutGrid,
    items: [
      { value: "skill-creator", label: "skill-creator", icon: LayoutTemplate },
      { value: "manage-skills", label: "Manage skills", icon: Briefcase },
      { value: "browse-skills", label: "Browse skills", icon: Search },
    ],
  },
  { value: "add-connector", label: "Add connector", icon: Plug },
];

const usageCode = `"use client";

import { Archive, Camera, LayoutGrid, Paperclip, Plug } from "lucide-react";

import {
  AIInput,
  type AIInputMenuItem,
  type PromptSettingGroup,
} from "@/components/ui/ai-input";

// Featured row for the selected model, submenu for effort level.
const settingGroups: PromptSettingGroup[] = [
  {
    id: "model",
    label: "Model",
    display: "featured",
    options: [
      { value: "claude-5", label: "Claude 5", description: "Most capable" },
      { value: "claude-5-fast", label: "Claude 5 Fast", description: "Faster" },
    ],
  },
  {
    id: "effort",
    label: "Effort",
    display: "submenu",
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
];

// Use \`shortcut\` to show a keyboard hint. Pass \`items\` for a one-level submenu.
const menuItems: AIInputMenuItem[] = [
  { value: "add-files", label: "Add files or photos", icon: Paperclip, shortcut: "⌘U" },
  { value: "screenshot", label: "Take a screenshot", icon: Camera },
  {
    value: "add-to-project",
    label: "Add to project",
    icon: Archive,
    items: [
      { value: "new-project", label: "New project" },
      { value: "existing-project", label: "Existing project" },
    ],
  },
  { value: "sep-1", type: "separator" },
  {
    value: "skills",
    label: "Skills",
    icon: LayoutGrid,
    items: [
      { value: "skill-creator", label: "skill-creator" },
      { value: "manage-skills", label: "Manage skills" },
      { value: "browse-skills", label: "Browse skills" },
    ],
  },
  { value: "add-connector", label: "Add connector", icon: Plug },
];

export function AIInputPreview() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <AIInput
        menuItems={menuItems}
        settingGroups={settingGroups}
        onMenuSelect={(value) => console.log("menu:", value)}
        onSettingsChange={(settings) => console.log("settings:", settings)}
        onSend={(message, meta) => console.log(message, meta)}
        placeholder="Ask for follow-up changes"
      />
    </div>
  );
}`;

function AIInputPreview() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col justify-end px-4 py-10">
      <AIInput
        defaultSettings={previewDefaultSettings}
        menuItems={previewMenuItems}
        onMenuSelect={(value) => console.log("menu:", value)}
        onSend={(message, meta) => console.log(message, meta)}
        onSettingsChange={(settings) => console.log("settings:", settings)}
        placeholder="Ask for follow-up changes"
        settingGroups={previewSettingGroups}
      />
    </div>
  );
}

export default function AIInputPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "AI Input" },
      ]}
      componentName="ai-input"
      description="Chat-style AI composer with agent and model chips and an Apple Intelligence-style gradient wave on send."
      details={aiInputApiDetails}
      detailsDescription="AIInput keeps its sent messages in local state and renders them as right-aligned chat bubbles above the composer, so it behaves like a chat thread out of the box. Sending plays a gradient wave exactly once: a tall, softly blurred multicolor band rises from the bottom to the top of the surface in a single pass, then fades back out. The sweep collapses to a static fade when the user prefers reduced motion."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/ai-input/page.tsx`}
      itemSlug="ai-input"
      pageUrl="/blocks/ai-input"
      preview={<AIInputPreview />}
      previewClassName="min-h-[34rem] overflow-visible"
      previewDescription="Type a message and press Enter or click the arrow — the message pops in above the composer as a chat bubble while a soft Apple Intelligence-style gradient wave rises through the input from bottom to top, then fades away. The settings dropdown shows a featured model row, effort submenu, and animated effort bars icon."
      title="AI Input"
      usageCode={usageCode}
      usageDescription="Render `AIInput` where the user composes prompts. Pass `settingGroups` to build the settings dropdown — use `featured` display for the selected model row and `submenu` for effort level. Pass `menuItems` for the plus menu. Sent messages stack above the composer automatically; pass `showMessages={false}` if you render your own thread."
    />
  );
}
