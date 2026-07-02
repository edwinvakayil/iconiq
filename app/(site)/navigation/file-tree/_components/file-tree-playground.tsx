"use client";

import { File, FileText, Image } from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSegmentedField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import {
  FileTree,
  FileTreeFromItems,
  FileTreeItem,
  FileTreeList,
  type FileTreeNodeData,
} from "@/registry/file-tree";

type FileTreeApiMode = "compound" | "items";

type FileTreePlaygroundState = {
  apiMode: FileTreeApiMode;
  defaultExpanded: boolean;
  showIcons: boolean;
};

export const FILE_TREE_DEFAULT_STATE: FileTreePlaygroundState = {
  apiMode: "compound",
  defaultExpanded: true,
  showIcons: true,
};

const API_MODE_OPTIONS: Array<{ label: string; value: FileTreeApiMode }> = [
  { label: "Compound", value: "compound" },
  { label: "Items API", value: "items" },
];

const IMPORT_PATH = "@/components/ui/file-tree";

const ITEMS_DATA: FileTreeNodeData[] = [
  {
    id: "documents",
    label: "Documents",
    hasChildren: true,
    children: [
      {
        id: "projects",
        label: "Projects",
        hasChildren: true,
        children: [
          {
            id: "project1",
            label: "Project 1",
            hasChildren: true,
            children: [
              {
                id: "readme",
                label: "README.md",
                icon: <FileText className="size-4.5" />,
              },
              {
                id: "index",
                label: "index.tsx",
                icon: <FileText className="size-4.5" />,
                highlight: true,
              },
            ],
          },
        ],
      },
      {
        id: "images",
        label: "Images",
        hasChildren: true,
        children: [
          {
            id: "logo",
            label: "logo.png",
            icon: <Image className="size-4.5" />,
          },
          {
            id: "banner",
            label: "banner.jpg",
            icon: <Image className="size-4.5" />,
          },
        ],
      },
    ],
  },
  {
    id: "notes",
    label: "notes.md",
    icon: <File className="size-4.5" />,
  },
];

function getDefaultExpandedIds(state: FileTreePlaygroundState) {
  if (!state.defaultExpanded) {
    return [];
  }

  return ["documents", "projects", "project1"];
}

function buildCompoundTree() {
  return (
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
  );
}

function buildTreeProps(state: FileTreePlaygroundState) {
  const props = [
    'className="w-full max-w-sm"',
    `defaultExpandedIds={${JSON.stringify(getDefaultExpandedIds(state))}}`,
    'defaultSelectedId="index"',
  ];

  if (!state.showIcons) {
    props.push("showIcons={false}");
  }

  return props;
}

function generateCompoundCode(state: FileTreePlaygroundState) {
  const props = buildTreeProps(state);

  return `"use client";

import { File, FileText, Image } from "lucide-react";

import { FileTree, FileTreeItem, FileTreeList } from "${IMPORT_PATH}";

export function FileTreePreview() {
  return (
    <FileTree
      ${props.join("\n      ")}
    >
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
}

function generateItemsCode(state: FileTreePlaygroundState) {
  const props = buildTreeProps(state);

  return `"use client";

import { FileTreeFromItems, type FileTreeNodeData } from "${IMPORT_PATH}";

const items: FileTreeNodeData[] = [
  {
    id: "documents",
    label: "Documents",
    hasChildren: true,
    children: [
      {
        id: "projects",
        label: "Projects",
        hasChildren: true,
        children: [
          {
            id: "project1",
            label: "Project 1",
            hasChildren: true,
            children: [
              { id: "readme", label: "README.md" },
              { id: "index", label: "index.tsx", highlight: true },
            ],
          },
        ],
      },
      {
        id: "images",
        label: "Images",
        hasChildren: true,
        children: [
          { id: "logo", label: "logo.png" },
          { id: "banner", label: "banner.jpg" },
        ],
      },
    ],
  },
  { id: "notes", label: "notes.md" },
];

export function FileTreePreview() {
  return (
    <FileTreeFromItems
      ${props.join("\n      ")}
      items={items}
    />
  );
}`;
}

export function getFileTreeDefaultUsageCode(importPath: string) {
  return generateCompoundCode(FILE_TREE_DEFAULT_STATE).replace(
    IMPORT_PATH,
    importPath
  );
}

function FileTreePlaygroundPreview({
  state,
}: {
  state: FileTreePlaygroundState;
}) {
  const sharedProps = useMemo(
    () => ({
      className: "w-full max-w-sm",
      defaultExpandedIds: getDefaultExpandedIds(state),
      defaultSelectedId: "index",
      showIcons: state.showIcons,
    }),
    [state]
  );

  return (
    <div className="flex w-full justify-center px-4 py-10">
      {state.apiMode === "items" ? (
        <FileTreeFromItems {...sharedProps} items={ITEMS_DATA} />
      ) : (
        <FileTree {...sharedProps}>{buildCompoundTree()}</FileTree>
      )}
    </div>
  );
}

function FileTreePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<FileTreePlaygroundState>) => void;
  onClose: () => void;
  onReset: () => void;
  state: FileTreePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="File Tree"
    >
      <DocsPlaygroundSegmentedField
        label="API mode"
        onChange={(apiMode) => onChange({ apiMode })}
        options={API_MODE_OPTIONS}
        value={state.apiMode}
      />
      <DocsPlaygroundToggleField
        checked={state.defaultExpanded}
        label="Default expanded"
        onChange={(defaultExpanded) => onChange({ defaultExpanded })}
      />
      <DocsPlaygroundToggleField
        checked={state.showIcons}
        label="Show icons"
        onChange={(showIcons) => onChange({ showIcons })}
      />
    </DocsPlaygroundPanel>
  );
}

type FileTreePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function FileTreePlaygroundProvider({
  children,
}: {
  children: (props: FileTreePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<FileTreePlaygroundState>(
    FILE_TREE_DEFAULT_STATE
  );

  const updateState = (next: Partial<FileTreePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(FILE_TREE_DEFAULT_STATE);
  };

  useLayoutEffect(() => {
    const code =
      state.apiMode === "items"
        ? generateItemsCode(state)
        : generateCompoundCode(state);
    setPlaygroundCode(code);
  }, [setPlaygroundCode, state]);

  useEffect(() => {
    return () => {
      setPlaygroundCode(null);
    };
  }, [setPlaygroundCode]);

  return (
    <>
      {children({
        preview: <FileTreePlaygroundPreview state={state} />,
        renderSettings: (onClose) => (
          <FileTreePlaygroundSettings
            onChange={updateState}
            onClose={onClose}
            onReset={resetState}
            state={state}
          />
        ),
      })}
    </>
  );
}
