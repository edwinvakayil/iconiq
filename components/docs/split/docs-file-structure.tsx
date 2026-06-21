"use client";

import type { ReactNode } from "react";

import { FileTree, FileTreeItem, FileTreeList } from "@/registry/file-tree";

interface DocsFileStructureProps {
  componentName: string;
  installPath?: string;
}

function resolveInstallPath(componentName: string, installPath?: string) {
  if (installPath) {
    return installPath;
  }

  return `components/ui/${componentName}.tsx`;
}

function buildPathSegments(componentName: string, installPath?: string) {
  const resolvedPath = resolveInstallPath(componentName, installPath);
  return ["your-project", ...resolvedPath.split("/").filter(Boolean)];
}

function buildExpandedIds(segments: string[]) {
  const ids: string[] = [];
  let parentId = "";

  for (let index = 0; index < segments.length - 1; index += 1) {
    const nodeId = parentId
      ? `${parentId}/${segments[index]}`
      : segments[index];
    ids.push(nodeId);
    parentId = nodeId;
  }

  return ids;
}

function renderPathTree(
  segments: string[],
  index = 0,
  parentId = ""
): ReactNode {
  const segment = segments[index];
  const nodeId = parentId ? `${parentId}/${segment}` : segment;
  const isFile = index === segments.length - 1;

  if (isFile) {
    return <FileTreeItem highlight label={segment} nodeId={nodeId} />;
  }

  return (
    <FileTreeItem hasChildren label={segment} nodeId={nodeId}>
      {renderPathTree(segments, index + 1, nodeId)}
    </FileTreeItem>
  );
}

export function DocsFileStructure({
  componentName,
  installPath,
}: DocsFileStructureProps) {
  const segments = buildPathSegments(componentName, installPath);
  const expandedIds = buildExpandedIds(segments);

  return (
    <div className="overflow-hidden rounded-xl border-[0.5px] border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-950">
      <FileTree
        className="rounded-none border-0 bg-transparent"
        defaultExpandedIds={expandedIds}
        indentSize={24}
      >
        <FileTreeList>{renderPathTree(segments)}</FileTreeList>
      </FileTree>
    </div>
  );
}
