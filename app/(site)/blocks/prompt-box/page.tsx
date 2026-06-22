"use client";

import { Camera, FolderKanban, Paperclip } from "lucide-react";
import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { promptBoxApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  PromptInput,
  type PromptPlusMenuItem,
  type PromptSettingGroup,
} from "@/registry/prompt-box";

const previewContentClassName =
  "mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-10";

const previewSentenceClassName =
  "max-w-[320px] text-balance text-center text-[13px] text-muted-foreground leading-tight";

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

const previewDefaultSettings = {
  effort: "high",
};

const previewPlusMenuItems: PromptPlusMenuItem[] = [
  {
    id: "attach",
    label: "Add files or photos",
    icon: <Paperclip className="h-4 w-4" />,
    shortcut: "⌘U",
    onSelect: () => console.log("attach"),
  },
  {
    id: "screenshot",
    label: "Take a screenshot",
    icon: <Camera className="h-4 w-4" />,
    onSelect: () => console.log("screenshot"),
  },
  {
    id: "project",
    label: "Add to project",
    icon: <FolderKanban className="h-4 w-4" />,
    options: [
      { value: "design-system", label: "Design system" },
      { value: "marketing-site", label: "Marketing site" },
      { value: "mobile-app", label: "Mobile app" },
    ],
    onOptionSelect: (value) => console.log("project", value),
  },
];

const usageCode = `"use client";

import { Camera, FolderKanban, Paperclip } from "lucide-react";
import {
  PromptInput,
  type PromptPlusMenuItem,
  type PromptSettingGroup,
} from "@/components/ui/prompt-box";

const settingGroups: PromptSettingGroup[] = [
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

const plusMenuItems: PromptPlusMenuItem[] = [
  {
    id: "attach",
    label: "Add files or photos",
    icon: <Paperclip className="h-4 w-4" />,
    shortcut: "⌘U",
    onSelect: () => console.log("attach"),
  },
  {
    id: "screenshot",
    label: "Take a screenshot",
    icon: <Camera className="h-4 w-4" />,
    onSelect: () => console.log("screenshot"),
  },
  {
    id: "project",
    label: "Add to project",
    icon: <FolderKanban className="h-4 w-4" />,
    options: [
      { value: "design-system", label: "Design system" },
      { value: "marketing-site", label: "Marketing site" },
    ],
    onOptionSelect: (value) => console.log("project", value),
  },
];

export function PromptBoxPreview() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 px-4 py-10">
      <PromptInput
        defaultSettings={{ effort: "high" }}
        onSettingsChange={(settings) => console.log(settings)}
        onSubmit={(value) => console.log(value)}
        placeholder="Ask anything"
        plusMenuItems={plusMenuItems}
        settingGroups={settingGroups}
      />
      <p className="max-w-[320px] text-balance text-center text-[13px] text-muted-foreground leading-tight">
        Tap in, let it bloom, and hit Enter to send.
      </p>
    </div>
  );
}`;

function PromptBoxPreview() {
  return (
    <div className={previewContentClassName}>
      <PromptInput
        defaultSettings={previewDefaultSettings}
        onSettingsChange={(settings) => console.log(settings)}
        onSubmit={(value) => console.log(value)}
        placeholder="Ask anything"
        plusMenuItems={previewPlusMenuItems}
        settingGroups={previewSettingGroups}
      />
      <p className={previewSentenceClassName}>
        Tap in, let it bloom, and hit Enter to send.
      </p>
    </div>
  );
}

function getDetails(): DetailItem[] {
  return promptBoxApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react, motion, lucide-react.",
        "This page documents the Base UI install only. Prompt Box uses the Base UI Input primitive for the prompt field.",
        "The generated registry file is /r/prompt-box.json.",
      ],
      registryPath: "prompt-box.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function PromptBoxPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Prompt Box" },
      ]}
      componentName="prompt-box"
      description="Spring-animated AI prompt with model controls and voice or send."
      details={details}
      detailsDescription="PromptInput starts as a compact pill and expands into a textarea with a pinned footer for customizable settings groups. Enter submits when the field has content, Escape collapses when empty, and blur collapses when there is no draft."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/prompt-box/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="prompt-box"
      pageUrl="/blocks/prompt-box"
      preview={<PromptBoxPreview />}
      previewClassName="min-h-[20rem] overflow-visible"
      previewDescription="The surface grows with spring motion to reveal the textarea, footer controls, and a send button that swaps between voice and submit icons."
      title="Prompt Box"
      usageCode={usageCode}
      usageDescription="Render `PromptInput` where you need a compact-to-expanded prompt surface. Pass `settingGroups` for the footer menu sections and `plusMenuItems` for the add menu. Use `onSettingsChange` or controlled `settings` to read the user's picks alongside `onSubmit` for the prompt text."
    />
  );
}
