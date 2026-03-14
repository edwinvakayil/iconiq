import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import { File, FileTree, FileTreeSearch, Folder } from "@/registry/file-tree";

const FILE_TREE_CODE = `import {
  FileTree,
  FileTreeSearch,
  Folder,
  File,
} from "@/components/ui/file-tree";

export function ExampleFileTree() {
  return (
    <FileTree
      aria-label="Project files"
      defaultExpanded={["src", "components"]}
      defaultSelected="FileTree.tsx"
    >
      <FileTreeSearch placeholder="Search files..." />
      <Folder id="src" label="src">
        <Folder id="components" label="components">
          <File label="FileTree.tsx" />
          <File label="Sidebar.tsx" />
        </Folder>
        <Folder id="app" label="app">
          <File label="layout.tsx" />
          <File label="page.tsx" />
        </Folder>
      </Folder>
      <Folder id="public" label="public">
        <File label="favicon.ico" />
      </Folder>
      <File label="package.json" />
    </FileTree>
  );
}`;

const FILE_TREE_PROPS = [
  {
    name: "defaultExpanded",
    type: "string[]",
    desc: "Optional array of folder ids that should start expanded.",
  },
  {
    name: "defaultSelected",
    type: "string",
    desc: "Optional id or label of the file that should start selected.",
  },
  {
    name: "className",
    type: "string",
    desc: "Optional class name applied to the outer tree container.",
  },
];

function FileTreePreview() {
  return (
    <div className="rounded-sm border border-border bg-card p-3">
      <FileTree
        aria-label="Project files"
        className="max-h-[320px] w-full overflow-auto"
        defaultExpanded={["src", "components"]}
        defaultSelected="FileTree.tsx"
      >
        <FileTreeSearch placeholder="Search files..." />
        <Folder id="src" label="src">
          <Folder id="components" label="components">
            <File label="FileTree.tsx" />
            <File label="Sidebar.tsx" />
            <File label="Button.tsx" />
          </Folder>
          <Folder id="app" label="app">
            <File label="layout.tsx" />
            <File label="page.tsx" />
          </Folder>
        </Folder>
        <Folder id="public" label="public">
          <File label="favicon.ico" />
        </Folder>
        <File label="package.json" />
        <File label="tsconfig.json" />
      </FileTree>
    </div>
  );
}

export default function FileTreePage() {
  return (
    <ComponentDocsLayout
      codeSample={FILE_TREE_CODE}
      componentName="file-tree"
      description="A composable file tree with search, nested folders, and keyboard focus styles built on top of Radix Accordion."
      previewChildren={<FileTreePreview />}
      previewDescription="Search for a file or folder to auto-expand matching branches. Click folders to toggle them and select a file to highlight it."
      propsRows={FILE_TREE_PROPS}
      propsTag="file-tree"
      title="File Tree"
    />
  );
}
