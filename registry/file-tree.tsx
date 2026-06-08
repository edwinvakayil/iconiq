"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  File,
  FileCode,
  FileCog,
  FileImage,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const folderTriggerClassName =
  "w-full justify-start rounded-none border-0 bg-transparent p-0 text-start font-normal text-inherit shadow-none hover:bg-transparent focus-visible:ring-0";

const leafTriggerClassName = cn(
  folderTriggerClassName,
  "cursor-default focus-visible:ring-2"
);

type HighlightBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type FileTreeContextValue = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  expandedIds: Set<string>;
  highlightBounds: HighlightBounds | null;
  highlightColor: string;
  indentSize: number;
  onNodeClick?: (nodeId: string) => void;
  onNodeExpand?: (nodeId: string, expanded: boolean) => void;
  setHighlightBounds: React.Dispatch<
    React.SetStateAction<HighlightBounds | null>
  >;
  showIcons: boolean;
  toggleExpanded: (nodeId: string) => void;
};

type FolderContextValue = {
  isOpen: boolean;
};

const FileTreeContext = React.createContext<FileTreeContextValue | null>(null);
const FolderContext = React.createContext<FolderContextValue | null>(null);

function useFileTree() {
  const context = React.useContext(FileTreeContext);
  if (!context) {
    throw new Error("File tree components must be used within <FileTree />");
  }
  return context;
}

function useFolder() {
  const context = React.useContext(FolderContext);
  if (!context) {
    throw new Error("Folder item components must be used within a branch item");
  }
  return context;
}

const EXT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  tsx: FileCode,
  ts: FileCode,
  jsx: FileCode,
  js: FileCode,
  json: FileJson,
  md: FileText,
  mdx: FileText,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  svg: FileImage,
  webp: FileImage,
  css: FileCode,
  config: FileCog,
  toml: FileCog,
  yaml: FileCog,
  yml: FileCog,
  env: FileCog,
};

function resolveFileIcon(
  label: string
): React.ComponentType<{ className?: string }> {
  const ext = label.split(".").pop()?.toLowerCase() ?? "";
  return EXT_ICONS[ext] ?? File;
}

function FileTreeHoverHighlight({ className }: { className?: string }) {
  const { highlightBounds } = useFileTree();

  return (
    <AnimatePresence>
      {highlightBounds && (
        <motion.div
          animate={{
            opacity: 1,
            top: highlightBounds.top,
            left: highlightBounds.left,
            width: highlightBounds.width,
            height: highlightBounds.height,
          }}
          className={className}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{ position: "absolute", pointerEvents: "none", zIndex: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
    </AnimatePresence>
  );
}

function useHighlightTarget() {
  const { containerRef, setHighlightBounds } = useFileTree();
  const ref = React.useRef<HTMLDivElement>(null);

  const onMouseEnter = React.useCallback(() => {
    const element = ref.current;
    const container = containerRef.current;
    if (!(element && container)) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    setHighlightBounds({
      top: elementRect.top - containerRect.top,
      left: elementRect.left - containerRect.left,
      width: elementRect.width,
      height: elementRect.height,
    });
  }, [containerRef, setHighlightBounds]);

  return { ref, onMouseEnter };
}

function FolderIcon({
  closeIcon,
  openIcon,
}: {
  closeIcon: React.ReactNode;
  openIcon: React.ReactNode;
}) {
  const { isOpen } = useFolder();

  return (
    <span className="relative inline-flex size-[1.125rem] shrink-0">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="inline-flex"
          exit={{ scale: 0.5, opacity: 0, rotate: 15 }}
          initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
          key={isOpen ? "open" : "close"}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.8,
          }}
        >
          {isOpen ? openIcon : closeIcon}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function FolderContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useFolder();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          style={{ overflow: "hidden" }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FileTreeRowContent({
  highlight,
  icon,
  isBranch,
  label,
  openIcon,
}: {
  highlight?: boolean;
  icon?: React.ReactNode;
  isBranch: boolean;
  label: string;
  openIcon?: React.ReactNode;
}) {
  const { highlightColor, showIcons } = useFileTree();

  const renderedIcon = isBranch ? (
    <FolderIcon
      closeIcon={icon ?? <Folder className="size-4.5" />}
      openIcon={openIcon ?? <FolderOpen className="size-4.5" />}
    />
  ) : (
    (icon ??
    React.createElement(resolveFileIcon(label), { className: "size-4.5" }))
  );

  return (
    <div className="pointer-events-none flex items-center gap-2 p-2">
      {showIcons && (
        <span className="inline-flex shrink-0">{renderedIcon}</span>
      )}
      <span
        className="text-sm"
        style={highlight ? { color: highlightColor } : undefined}
      >
        {label}
      </span>
    </div>
  );
}

function getIndentClassName(indentSize: number) {
  return indentSize === 24 ? "ml-6" : undefined;
}

function getIndentStyle(indentSize: number): React.CSSProperties | undefined {
  return indentSize === 24 ? undefined : { marginLeft: indentSize };
}

export type FileTreeProps = React.ComponentProps<"div"> & {
  /** Folder node ids that should start expanded on first render. */
  defaultExpandedIds?: string[];
  /** Highlight color for items with `highlight` on FileTreeItem. Defaults to blue. */
  highlightColor?: string;
  /** Horizontal indent per nesting level in px. Defaults to 24. */
  indentSize?: number;
  onNodeClick?: (nodeId: string) => void;
  onNodeExpand?: (nodeId: string, expanded: boolean) => void;
  /** Whether to show file/folder icons. Defaults to true. */
  showIcons?: boolean;
};

export function FileTree({
  className,
  children,
  defaultExpandedIds = [],
  highlightColor = "#3b82f6",
  indentSize = 24,
  onNodeClick,
  onNodeExpand,
  showIcons = true,
  ...props
}: FileTreeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [highlightBounds, setHighlightBounds] =
    React.useState<HighlightBounds | null>(null);
  const [expandedIds, setExpandedIds] = React.useState(
    () => new Set(defaultExpandedIds)
  );

  const toggleExpanded = React.useCallback(
    (nodeId: string) => {
      setHighlightBounds(null);
      setExpandedIds((previous) => {
        const next = new Set(previous);
        const isExpanded = next.has(nodeId);

        if (isExpanded) {
          next.delete(nodeId);
        } else {
          next.add(nodeId);
        }

        onNodeExpand?.(nodeId, !isExpanded);
        return next;
      });
    },
    [onNodeExpand]
  );

  const contextValue = React.useMemo<FileTreeContextValue>(
    () => ({
      containerRef,
      expandedIds,
      highlightBounds,
      highlightColor,
      indentSize,
      onNodeClick,
      onNodeExpand,
      setHighlightBounds,
      showIcons,
      toggleExpanded,
    }),
    [
      expandedIds,
      highlightBounds,
      highlightColor,
      indentSize,
      onNodeClick,
      onNodeExpand,
      showIcons,
      toggleExpanded,
    ]
  );

  return (
    <FileTreeContext.Provider value={contextValue}>
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-border/60",
          className
        )}
        {...props}
      >
        <div
          className="relative isolate w-full p-2"
          onMouseLeave={() => setHighlightBounds(null)}
          ref={containerRef}
        >
          <FileTreeHoverHighlight className="z-0 rounded-lg border border-accent/45 bg-accent/55" />
          {children}
        </div>
      </div>
    </FileTreeContext.Provider>
  );
}

export function FileTreeList({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("flex flex-col", className),
        role: "tree",
      },
      props
    ),
    render,
    state: {
      slot: "file-tree-list",
    },
  });
}

export type FileTreeItemProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  children?: React.ReactNode;
  /** Marks the row as a branch even when it has no nested children yet. */
  hasChildren?: boolean;
  highlight?: boolean;
  icon?: React.ReactNode;
  /** Optional open-state icon for folder rows. Defaults to FolderOpen. */
  openIcon?: React.ReactNode;
  label: string;
  nodeId: string;
};

export function FileTreeItem({
  children,
  className,
  hasChildren,
  highlight,
  icon,
  openIcon,
  label,
  nodeId,
  ...props
}: FileTreeItemProps) {
  const { expandedIds, indentSize, onNodeClick, toggleExpanded } =
    useFileTree();
  const highlightTarget = useHighlightTarget();
  const childNodes = React.Children.toArray(children).filter(Boolean);
  const isBranch =
    hasChildren !== undefined ? hasChildren : childNodes.length > 0;
  const isOpen = expandedIds.has(nodeId);

  const handleActivate = React.useCallback(() => {
    if (isBranch) {
      toggleExpanded(nodeId);
    }

    onNodeClick?.(nodeId);
  }, [isBranch, nodeId, onNodeClick, toggleExpanded]);

  const row = (
    <div onMouseEnter={highlightTarget.onMouseEnter} ref={highlightTarget.ref}>
      <FileTreeRowContent
        highlight={highlight}
        icon={icon}
        isBranch={isBranch}
        label={label}
        openIcon={openIcon}
      />
    </div>
  );

  if (!isBranch) {
    return (
      <div
        className={cn("relative z-10", className)}
        data-value={nodeId}
        {...props}
      >
        <ButtonPrimitive
          aria-label={label}
          className={leafTriggerClassName}
          onClick={handleActivate}
          role="treeitem"
          type="button"
        >
          {row}
        </ButtonPrimitive>
      </div>
    );
  }

  return (
    <FolderContext.Provider value={{ isOpen }}>
      <div
        className={cn("relative z-10", className)}
        data-value={nodeId}
        {...props}
      >
        <ButtonPrimitive
          aria-expanded={isOpen}
          aria-label={label}
          className={folderTriggerClassName}
          onClick={handleActivate}
          role="treeitem"
          type="button"
        >
          {row}
        </ButtonPrimitive>
        <div
          className={cn(
            "relative before:absolute before:inset-y-0 before:-left-2 before:h-full before:w-px before:bg-border",
            getIndentClassName(indentSize)
          )}
          style={getIndentStyle(indentSize)}
        >
          <FolderContent>{children}</FolderContent>
        </div>
      </div>
    </FolderContext.Provider>
  );
}
