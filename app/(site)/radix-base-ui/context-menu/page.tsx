"use client";

import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/radix-base-ui/_components/provider-switch";
import { contextMenuApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  ContextMenu as BaseContextMenu,
  type ContextMenuItem as BaseContextMenuItem,
} from "@/registry/b-context-menu";
import { ContextMenu as RadixContextMenu } from "@/registry/r-context-menu";

type ProviderConfig = {
  componentName: "b-context-menu" | "r-context-menu";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  preview: ReactNode;
  usageCode: string;
};

const demoItems: BaseContextMenuItem[] = [
  {
    label: "Rename",
    icon: <PencilLine className="size-3.5" />,
    shortcut: "R",
  },
  {
    label: "Duplicate",
    icon: <Copy className="size-3.5" />,
    shortcut: "Cmd+D",
    separatorAfter: true,
  },
  {
    label: "Share",
    icon: <Share2 className="size-3.5" />,
    shortcut: "S",
  },
  {
    label: "Delete",
    icon: <Trash2 className="size-3.5" />,
    shortcut: "Del",
    destructive: true,
  },
];

const previewSurface = (
  <div className="w-full border border-border/80 px-6 py-16 text-center">
    <p className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
      Right-click this workspace block
    </p>
    <p className="mt-2 text-[14px] text-secondary leading-6">
      Inspect spacing, shortcuts, separators, and the destructive row in the
      same menu.
    </p>
  </div>
);

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-context-menu": `"use client";

import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
import { ContextMenu, type ContextMenuItem } from "@/components/ui/b-context-menu";

const items: ContextMenuItem[] = [
  {
    label: "Rename",
    icon: <PencilLine className="size-3.5" />,
    shortcut: "R",
  },
  {
    label: "Duplicate",
    icon: <Copy className="size-3.5" />,
    shortcut: "Cmd+D",
    separatorAfter: true,
  },
  {
    label: "Share",
    icon: <Share2 className="size-3.5" />,
    shortcut: "S",
  },
  {
    label: "Delete",
    icon: <Trash2 className="size-3.5" />,
    shortcut: "Del",
    destructive: true,
  },
];

export function ContextMenuPreview() {
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
}`,
  "r-context-menu": `"use client";

import { Copy, PencilLine, Share2, Trash2 } from "lucide-react";
import { ContextMenu, type ContextMenuItem } from "@/components/ui/r-context-menu";

const items: ContextMenuItem[] = [
  {
    label: "Rename",
    icon: <PencilLine className="size-3.5" />,
    shortcut: "R",
  },
  {
    label: "Duplicate",
    icon: <Copy className="size-3.5" />,
    shortcut: "Cmd+D",
    separatorAfter: true,
  },
  {
    label: "Share",
    icon: <Share2 className="size-3.5" />,
    shortcut: "S",
  },
  {
    label: "Delete",
    icon: <Trash2 className="size-3.5" />,
    shortcut: "Del",
    destructive: true,
  },
];

export function ContextMenuPreview() {
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
}`,
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Context Menu" },
];

export default function RadixBaseContextMenuPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-context-menu",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs the Base UI context-menu and menu parts under the same product-facing ContextMenu API.",
          "Base UI handles anchor positioning, dismissal, and roving focus while the menu shell keeps the same Iconiq motion treatment.",
          "The generated registry file is /r/b-context-menu.json.",
        ],
        preview: (
          <BaseContextMenu className="w-full" items={demoItems}>
            {previewSurface}
          </BaseContextMenu>
        ),
        usageCode: usageCodeByProvider["b-context-menu"],
      };
    }

    return {
      componentName: "r-context-menu",
      dependencyLabel: "@radix-ui/react-context-menu, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs the Radix context-menu primitive under the same product-facing ContextMenu API.",
        "Radix handles focus, dismissal, and pointer anchoring while the menu shell keeps the same Iconiq motion treatment.",
        "The generated registry file is /r/r-context-menu.json.",
      ],
      preview: (
        <RadixContextMenu className="w-full" items={demoItems}>
          {previewSurface}
        </RadixContextMenu>
      ),
      usageCode: usageCodeByProvider["r-context-menu"],
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () =>
      contextMenuApiDetails.map((item) => {
        if (item.id === "context-menu") {
          return {
            ...item,
            notes: [
              "Open state stays internal on both installs.",
              `Current install target: ${provider.libraryLabel}.`,
              `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
              ...provider.notes,
            ],
          };
        }

        if (item.id !== "registry") {
          return item;
        }

        return {
          ...item,
          notes: [
            `Dependencies: ${provider.dependencyLabel}.`,
            ...provider.notes,
          ],
          registryPath: `${provider.componentName}.json`,
        };
      }),
    [provider]
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same context menu API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/context-menu/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="context-menu"
      pageUrl="/radix-base-ui/context-menu"
      preview={
        <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl">{provider.preview}</div>
        </div>
      }
      title="Context Menu"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
