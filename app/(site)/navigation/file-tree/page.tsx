"use client";

import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import {
  FileTreePlaygroundProvider,
  getFileTreeDefaultUsageCode,
} from "@/app/(site)/navigation/file-tree/_components/file-tree-playground";
import { fileTreeApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const IMPORT_PATH = "@/components/ui/file-tree";

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Navigation" },
  { label: "File Tree" },
];

function getDetails(): DetailItem[] {
  return fileTreeApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react, motion, lucide-react.",
        "This page documents the Base UI install only. File and folder rows use Base UI Button with full tree keyboard navigation.",
        "The generated registry file is /r/file-tree.json.",
      ],
      registryPath: "file-tree.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function FileTreePage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <FileTreePlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="file-tree"
          description="Accessible project tree with keyboard navigation, selection, search filtering, animated folders, and hover highlights."
          details={details}
          detailsDescription="Compose nested `FileTreeItem` rows inside `FileTreeList`, or pass a data tree to `FileTreeFromItems`. Supports controlled expand/selection state, multi-select, lazy loading, drag callbacks, and imperative expand/collapse helpers."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/navigation/file-tree/page.tsx`}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          itemSlug="file-tree"
          pageUrl="/navigation/file-tree"
          preview={preview}
          previewDescription="Try compound vs items API, default expanded folders, and icon visibility."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="File Tree"
          title="File Tree"
          usageCode={getFileTreeDefaultUsageCode(IMPORT_PATH)}
          usageDescription="Nest `FileTreeItem` components inside `FileTreeList`, or use `FileTreeFromItems` with an `items` array. Control open folders with `defaultExpandedIds` or `expandedIds`, and selection with `defaultSelectedId` / `selectedIds`. Filter with `searchQuery`, and attach drag or context-menu callbacks on `FileTree`."
        />
      )}
    </FileTreePlaygroundProvider>
  );
}
