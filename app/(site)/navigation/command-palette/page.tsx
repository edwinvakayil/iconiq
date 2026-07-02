"use client";

import { FileText, Home, Layers } from "lucide-react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { commandPaletteApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  type CommandMenuGroupDef,
  CommandPalette,
} from "@/registry/command-palette";

const demoGroups: CommandMenuGroupDef[] = [
  {
    heading: "Pages",
    items: [
      {
        label: "Overview",
        href: "/",
        icon: Home,
        description: "Return to the docs home page.",
        keywords: ["home", "start"],
      },
      {
        label: "Installation",
        href: "/installation",
        icon: FileText,
        description: "Add Iconiq components to your project.",
        keywords: ["setup", "shadcn", "registry"],
      },
    ],
  },
  {
    heading: "Components",
    items: [
      {
        label: "Button",
        href: "/buttons-and-actions/button",
        icon: Layers,
        description: "Primary action control with motion variants.",
        keywords: ["cta", "action"],
      },
      {
        label: "Dialog",
        href: "/overlay-and-popups/dialog",
        icon: Layers,
        description: "Modal surface for focused tasks and confirmations.",
        keywords: ["modal", "overlay"],
      },
    ],
  },
];

const usageCode = `"use client";

import { FileText, Home, Layers } from "lucide-react";

import {
  CommandPalette,
  type CommandMenuGroupDef,
} from "@/components/ui/command-palette";

const groups: CommandMenuGroupDef[] = [
  {
    heading: "Pages",
    items: [
      {
        label: "Overview",
        href: "/",
        icon: Home,
        description: "Return to the docs home page.",
        keywords: ["home", "start"],
      },
      {
        label: "Installation",
        href: "/installation",
        icon: FileText,
        description: "Add Iconiq components to your project.",
      },
    ],
  },
  {
    heading: "Components",
    items: [
      {
        label: "Button",
        href: "/buttons-and-actions/button",
        icon: Layers,
        keywords: ["cta", "action"],
      },
    ],
  },
];

export function CommandPalettePreview() {
  return (
    <CommandPalette
      groups={groups}
      placeholder="Search pages, components, actions…"
      triggerProps={{
        className: "w-full max-w-md",
        label: "Open command palette",
      }}
    />
  );
}`;

function CommandPalettePreview() {
  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-8">
      <CommandPalette
        groups={demoGroups}
        placeholder="Search pages, components, actions…"
        triggerProps={{
          className: "w-full max-w-md",
          label: "Open command palette",
        }}
      />
    </div>
  );
}

export default function CommandPalettePage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Navigation" },
        { label: "Command Palette" },
      ]}
      componentName="command-palette"
      description="Keyboard-first command menu for pages, actions, and theme switching."
      details={commandPaletteApiDetails}
      detailsDescription="CommandPalette groups searchable items, supports custom triggers, and wires navigation plus optional theme actions through Radix Dialog."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/navigation/command-palette/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      itemSlug="command-palette"
      pageUrl="/navigation/command-palette"
      preview={<CommandPalettePreview />}
      previewDescription="Open the palette with the trigger or press Cmd/Ctrl+K. Arrow keys move through results, Enter runs the active item, and Escape closes the dialog."
      title="Command Palette"
      usageCode={usageCode}
      usageDescription="Pass grouped `items` with labels, optional `href` or `action`, icons, keywords, and descriptions. Use `trigger` or `triggerProps` for the open control, and set `showThemeGroup={false}` when theme switching is not needed."
    />
  );
}
