"use client";

import { File, FileText, Image } from "lucide-react";
import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { fileTreeApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { FileTree, FileTreeItem, FileTreeList } from "@/registry/file-tree";

const usageCode = `"use client";

import { File, FileText, Image } from "lucide-react";

import { FileTree, FileTreeItem, FileTreeList } from "@/components/ui/file-tree";

export function FileTreePreview() {
  return (
    <FileTree className="w-full max-w-sm" defaultExpandedIds={["documents", "projects", "project1"]}>
      <FileTreeList>
        <FileTreeItem nodeId="documents" label="Documents" hasChildren>
          <FileTreeItem nodeId="projects" label="Projects" hasChildren>
            <FileTreeItem nodeId="project1" label="Project 1" hasChildren>
              <FileTreeItem nodeId="readme" label="README.md" icon={<FileText className="size-4.5" />} />
              <FileTreeItem nodeId="index" label="index.tsx" icon={<FileText className="size-4.5" />} highlight />
            </FileTreeItem>
          </FileTreeItem>
          <FileTreeItem nodeId="images" label="Images" hasChildren>
            <FileTreeItem nodeId="logo" label="logo.png" icon={<Image className="size-4.5" />} />
            <FileTreeItem nodeId="banner" label="banner.jpg" icon={<Image className="size-4.5" />} />
          </FileTreeItem>
        </FileTreeItem>
        <FileTreeItem nodeId="notes" label="notes.md" icon={<File className="size-4.5" />} />
      </FileTreeList>
    </FileTree>
  );
}`;

function FileTreePreview() {
  return (
    <div className="flex w-full justify-center px-4 py-10">
      <FileTree
        className="w-full max-w-sm"
        defaultExpandedIds={["documents", "projects", "project1"]}
      >
        <FileTreeList>
          <FileTreeItem hasChildren label="Documents" nodeId="documents">
            <FileTreeItem hasChildren label="Projects" nodeId="projects">
              <FileTreeItem hasChildren label="Project 1" nodeId="project1">
                <FileTreeItem
                  icon={<FileText className="size-4.5" />}
                  label="README.md"
                  nodeId="readme"
                />
                <FileTreeItem
                  highlight
                  icon={<FileText className="size-4.5" />}
                  label="index.tsx"
                  nodeId="index"
                />
              </FileTreeItem>
            </FileTreeItem>
            <FileTreeItem hasChildren label="Images" nodeId="images">
              <FileTreeItem
                icon={<Image className="size-4.5" />}
                label="logo.png"
                nodeId="logo"
              />
              <FileTreeItem
                icon={<Image className="size-4.5" />}
                label="banner.jpg"
                nodeId="banner"
              />
            </FileTreeItem>
          </FileTreeItem>
          <FileTreeItem
            icon={<File className="size-4.5" />}
            label="notes.md"
            nodeId="notes"
          />
        </FileTreeList>
      </FileTree>
    </div>
  );
}

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
        "This page documents the Base UI install only. Folder and file rows use Base UI Button for toggles and selection.",
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
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="file-tree"
      description="Collapsible project tree with animated folders, file-type icons, and hover highlights."
      details={details}
      detailsDescription="Compose nested `FileTreeItem` rows inside `FileTreeList`. Branch rows use Base UI Button for toggles, while Motion handles folder icons, expand/collapse, and the shared hover highlight."
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
      preview={<FileTreePreview />}
      previewDescription="Hover rows to see the shared highlight track across files and folders. Click folders to expand or collapse nested items."
      title="File Tree"
      usageCode={usageCode}
      usageDescription={
        "Nest `FileTreeItem` components inside `FileTreeList` to declare folders and files. Built on Base UI Button. Add `hasChildren` for empty branches, pass custom `icon` nodes, and use `highlight` to tint newly added paths. Control initial open folders with `defaultExpandedIds` on `FileTree`."
      }
    />
  );
}
