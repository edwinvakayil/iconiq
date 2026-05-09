"use client";

import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
import { useState } from "react";

import { contextMenuApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { ContextMenu, type ContextMenuItem } from "@/registry/context-menu";

const usageCode = `"use client";

import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { ContextMenu, type ContextMenuItem } from "@/components/ui/context-menu";

export function ContextMenuPreview() {
  const [, setLastAction] = useState("Waiting for a selection");

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
    <ContextMenu className="w-full" items={items}>
      <div className="w-full border border-border/80 px-6 py-16 text-center">
        <p className="font-medium text-[15px] tracking-[-0.02em] text-foreground">
          Right-click this workspace block
        </p>
        <p className="mt-2 text-[14px] leading-6 text-secondary">
          Inspect spacing, shortcuts, separators, and the destructive row in the same menu.
        </p>
      </div>
    </ContextMenu>
  );
}`;

function ContextMenuPreview() {
  const [, setLastAction] = useState("Waiting for a selection");

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
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
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
