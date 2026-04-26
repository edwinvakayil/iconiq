"use client";

import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
import { useState } from "react";

import { contextMenuApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { ContextMenu, type ContextMenuItem } from "@/registry/context-menu";

const usageCode = `import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { ContextMenu, type ContextMenuItem } from "@/components/ui/context-menu";

export function AssetContextMenu() {
  const [lastAction, setLastAction] = useState("Waiting for a selection");

  const items: ContextMenuItem[] = [
    {
      label: "Rename",
      icon: <PencilLine className="size-3.5" />,
      shortcut: "R",
      onSelect: () => setLastAction("Rename"),
    },
    {
      label: "Duplicate",
      icon: <Copy className="size-3.5" />,
      shortcut: "Cmd+D",
      separatorAfter: true,
      onSelect: () => setLastAction("Duplicate"),
    },
    {
      label: "Share",
      icon: <Share2 className="size-3.5" />,
      shortcut: "S",
      onSelect: () => setLastAction("Share"),
    },
    {
      label: "Delete",
      icon: <Trash2 className="size-3.5" />,
      shortcut: "Del",
      destructive: true,
      onSelect: () => setLastAction("Delete"),
    },
  ];

  return (
    <div className="w-full max-w-2xl space-y-4">
      <ContextMenu className="w-full" items={items}>
        <div className="w-full rounded-2xl border border-border/80 px-6 py-16 text-center">
          <p className="font-medium text-[15px] text-foreground">
            Right-click this surface
          </p>
          <p className="mt-2 text-[14px] text-secondary leading-6">
            Open the menu for file actions and quick status changes.
          </p>
        </div>
      </ContextMenu>
      <p className="text-center text-sm text-muted-foreground">
        Last action: <span className="text-foreground">{lastAction}</span>
      </p>
    </div>
  );
}`;

function ContextMenuPreview() {
  const [lastAction, setLastAction] = useState("Waiting for a selection");

  const items: ContextMenuItem[] = [
    {
      label: "Rename",
      icon: <PencilLine className="size-3.5" />,
      shortcut: "R",
      onSelect: () => setLastAction("Rename"),
    },
    {
      label: "Duplicate",
      icon: <Copy className="size-3.5" />,
      shortcut: "Cmd+D",
      separatorAfter: true,
      onSelect: () => setLastAction("Duplicate"),
    },
    {
      label: "Share",
      icon: <Share2 className="size-3.5" />,
      shortcut: "S",
      onSelect: () => setLastAction("Share"),
    },
    {
      label: "Delete",
      icon: <Trash2 className="size-3.5" />,
      shortcut: "Del",
      destructive: true,
      onSelect: () => setLastAction("Delete"),
    },
  ];

  return (
    <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="w-full max-w-2xl space-y-4">
        <ContextMenu className="w-full" items={items}>
          <div className="w-full border border-border/80 px-6 py-16 text-center">
            <p className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
              Right-click this workspace block
            </p>
            <p className="mt-2 text-[14px] text-secondary leading-6">
              Inspect spacing, shortcuts, separators, and the destructive row in
              the same menu.
            </p>
          </div>
        </ContextMenu>
        <p className="text-center text-[13px] text-secondary leading-6">
          Last action: <span className="text-foreground">{lastAction}</span>
        </p>
      </div>
    </div>
  );
}

export default function ContextMenuPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Context Menu" },
      ]}
      componentName="context-menu"
      description="Animated context menu that opens from a native right-click surface, handles viewport flipping, and supports per-item icons, shortcuts, and destructive actions."
      details={contextMenuApiDetails}
      preview={<ContextMenuPreview />}
      previewDescription="Right-click the surface to test viewport-aware placement, separators, shortcuts, and the internal highlighted-row state."
      title="Context Menu"
      usageCode={usageCode}
      usageDescription="Pass a typed item array and wrap the exact local surface you want to make context-clickable. Use the API details below to tune rows, callbacks, and menu styling."
    />
  );
}
