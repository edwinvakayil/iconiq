"use client";

import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import {
  type ContextMenuModule,
  ContextMenuPlaygroundProvider,
  getContextMenuDefaultUsageCode,
} from "@/app/(site)/overlay-and-popups/context-menu/_components/context-menu-playground";
import { contextMenuApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseContextMenu from "@/registry/b-context-menu";

const IMPORT_PATH = "@/components/ui/b-context-menu";

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Overlay & Popups" },
  { label: "Context Menu" },
];

function handleProviderSelect() {
  return undefined;
}

export default function ContextMenuPage() {
  const details = useMemo<DetailItem[]>(
    () =>
      contextMenuApiDetails.map((detail) => {
        if (detail.id === "context-menu") {
          return {
            ...detail,
            notes: [
              "Compose ContextMenuTrigger, ContextMenuContent, and item primitives inside the root.",
              "Dependencies declared by this registry entry: @base-ui/react, motion, lucide-react.",
              "Base UI handles anchor positioning, dismissal, and roving focus while the menu shell keeps panel spring, row entrance, active highlight, and reduced-motion fallbacks.",
              "The generated registry file is /r/b-context-menu.json.",
              ...(detail.notes ?? []),
            ],
          };
        }

        if (detail.id !== "registry") {
          return detail;
        }

        return {
          ...detail,
          notes: [
            "Dependencies: @base-ui/react, motion, lucide-react.",
            "Installs the Base UI context-menu parts under the composable ContextMenu API.",
            "The generated registry file is /r/b-context-menu.json.",
          ],
          registryPath: "b-context-menu.json",
        };
      }),
    []
  );

  return (
    <ContextMenuPlaygroundProvider
      importPath={IMPORT_PATH}
      ui={BaseContextMenu as ContextMenuModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="b-context-menu"
          description="Right-click menu for contextual actions and shortcuts."
          details={details}
          detailsDescription="Compound parts cover custom triggers, controlled open state, submenus, checkbox and radio rows, destructive actions, collision padding, and reduced-motion behavior."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/overlay-and-popups/context-menu/page.tsx`}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          itemSlug="context-menu"
          pageUrl="/overlay-and-popups/context-menu"
          preview={preview}
          previewClassName="min-h-[320px]"
          previewDescription="Use the playground to switch controlled state, custom triggers, submenu depth, destructive rows, shortcuts, checkbox and radio sections, and collision padding."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Context Menu"
          railNotes={[
            "Use ContextMenuTrigger asChild when the trigger is already a card, row, or canvas surface.",
            "ContextMenuContent and ContextMenuSubContent accept collisionPadding to keep menus inside the viewport.",
            "ContextMenuShortcut stays muted until its parent row is hovered or focused.",
            "Pass open and onOpenChange on the root for controlled usage.",
          ]}
          title="Context Menu"
          usageCode={getContextMenuDefaultUsageCode(IMPORT_PATH)}
          usageDescription="This page documents the Base UI install. The Radix UI option is disabled until an r-context-menu registry entry is available."
          v0PageCode={getContextMenuDefaultUsageCode(IMPORT_PATH)}
        />
      )}
    </ContextMenuPlaygroundProvider>
  );
}
