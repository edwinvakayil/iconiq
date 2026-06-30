"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  generateSelectionToolbarCode,
  SELECTION_TOOLBAR_DEFAULT_STATE,
  SelectionToolbarPlaygroundProvider,
} from "@/app/(site)/layout-and-toolbars/selection-toolbar/_components/selection-toolbar-playground";
import { selectionToolbarApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { selectionToolbarPreviewCode } from "@/lib/component-v0-pages";
import * as BaseSelectionToolbar from "@/registry/b-selection-toolbar";
import * as RadixSelectionToolbar from "@/registry/r-selection-toolbar";
import type { SelectionToolbarProps } from "@/registry/selectiontoolbar";

type SelectionToolbarModule = {
  SelectionToolbar: ComponentType<SelectionToolbarProps>;
};

type ProviderConfig = {
  componentName:
    | "b-selection-toolbar"
    | "r-selection-toolbar"
    | "selectiontoolbar";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: SelectionToolbarModule;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Layout & Toolbars" },
  { label: "Selection Toolbar" },
];

const IMPORT_PATHS = {
  base: "@/components/ui/b-selection-toolbar",
  radix: "@/components/ui/r-selection-toolbar",
} as const;

function getDetails(provider: ProviderConfig): DetailItem[] {
  return selectionToolbarApiDetails.map((item) => {
    if (item.id === "selectiontoolbar") {
      if (provider.componentName === "selectiontoolbar") {
        return item;
      }

      return {
        ...item,
        summary: `Floating formatting toolbar for editable text with the same Iconiq selection tracking, button shell, and reveal motion layered over ${provider.libraryLabel} toolbar primitives.`,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Uses Base UI toolbar root and button primitives while sharing the same selection controller, viewport clamping, keyboard shortcuts, and dark toolbar shell as the core component."
            : "Uses Radix toolbar root and button primitives while sharing the same selection controller, viewport clamping, keyboard shortcuts, and dark toolbar shell as the core component.",
          "Formatting actions run on mousedown so the current browser selection is preserved while bold, italic, underline, link, or copy is applied.",
          "Active states are read from document.queryCommandState for inline formatting commands exposed by the toolbar.",
        ],
      };
    }

    if (item.id === "selectiontoolbar-positioning") {
      return item;
    }

    if (item.id === "registry" || item.registryPath) {
      return {
        ...item,
        notes: [
          `Dependencies: ${provider.dependencyLabel}.`,
          ...provider.notes,
          `The generated registry file is /r/${provider.componentName}.json.`,
        ],
        registryPath: `${provider.componentName}.json`,
      };
    }

    return item;
  });
}

export default function SelectionToolbarPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-selection-toolbar",
        dependencyLabel: "@base-ui/react, lucide-react, selectiontoolbar",
        importPath: IMPORT_PATHS.base,
        libraryLabel: "Base UI",
        notes: [
          "Installs the Base UI-backed selection toolbar plus the shared core selection controller from selectiontoolbar.",
          "Keeps the same containerRef API, viewport-aware positioning, keyboard shortcuts, and dark toolbar shell as the core component.",
        ],
        ui: BaseSelectionToolbar,
      };
    }

    return {
      componentName: "r-selection-toolbar",
      dependencyLabel:
        "@radix-ui/react-toolbar, lucide-react, selectiontoolbar",
      importPath: IMPORT_PATHS.radix,
      libraryLabel: "Radix UI",
      notes: [
        "Installs the Radix-backed selection toolbar plus the shared core selection controller from selectiontoolbar.",
        "Keeps the same containerRef API, viewport-aware positioning, keyboard shortcuts, and dark toolbar shell as the core component.",
      ],
      ui: RadixSelectionToolbar,
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  const usageCode = generateSelectionToolbarCode(
    SELECTION_TOOLBAR_DEFAULT_STATE,
    provider.importPath
  );

  return (
    <SelectionToolbarPlaygroundProvider
      importPath={provider.importPath}
      key={provider.componentName}
      SelectionToolbarModule={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Floating toolbar for text selection actions and formatting."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/layout-and-toolbars/selection-toolbar/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="selection-toolbar"
          pageUrl="/layout-and-toolbars/selection-toolbar"
          preview={preview}
          previewClassName="min-h-[24rem] overflow-visible"
          previewDescription="Select text in the preview to reveal the toolbar. Use the playground to tune placement, optional actions, and disabled state."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Selection Toolbar"
          railNotes={[
            "Install `selectiontoolbar` for the zero-primitive path, or switch libraries above for Base UI or Radix toolbar primitives.",
            "Use `items` or `SelectionToolbarPresets` to add strikethrough, link, and copy actions.",
            "Keyboard shortcuts: Ctrl/Cmd+B, Ctrl/Cmd+I, and Ctrl/Cmd+U while text is selected.",
            "Base UI and Radix variants share the same selection controller and dark floating shell as the core component.",
          ]}
          title="Selection Toolbar"
          usageCode={usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={selectionToolbarPreviewCode}
        />
      )}
    </SelectionToolbarPlaygroundProvider>
  );
}
