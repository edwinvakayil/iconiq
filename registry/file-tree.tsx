"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { FileIcon, FolderIcon, FolderOpenIcon, Search } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type ItemInfo = { label: string; path: string[]; isFolder: boolean };

function computeVisibleIds(
  items: Map<string, ItemInfo>,
  query: string
): Set<string> | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const visible = new Set<string>();
  const matchedFolders = new Set<string>();

  for (const [id, info] of items) {
    if (!info.label.toLowerCase().includes(q)) continue;
    visible.add(id);
    info.path.forEach((a) => {
      visible.add(a);
    });
    if (info.isFolder) matchedFolders.add(id);
  }

  for (const [id, info] of items) {
    if (info.path.some((a) => matchedFolders.has(a))) {
      visible.add(id);
      info.path.forEach((a) => {
        visible.add(a);
      });
    }
  }

  return visible;
}

type FileTreeContextValue = {
  selectedId: string | null;
  select: (id: string) => void;
  expandedIds: string[];
  setExpandedIds: React.Dispatch<React.SetStateAction<string[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  register: (id: string, info: ItemInfo) => void;
  visibleIds: Set<string> | null;
  suppressAnimationRef: React.RefObject<boolean>;
};

const FileTreeContext = React.createContext<FileTreeContextValue | null>(null);
const PathContext = React.createContext<string[]>([]);

const useFileTree = () => {
  const ctx = React.useContext(FileTreeContext);
  if (!ctx) throw new Error("useFileTree must be used within FileTree");
  return ctx;
};

interface FileTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultExpanded?: string[];
  defaultSelected?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function FileTree({
  className,
  children,
  defaultExpanded = [],
  defaultSelected,
  ref,
  ...props
}: FileTreeProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    defaultSelected ?? null
  );
  const [expandedIds, setExpandedIds] =
    React.useState<string[]>(defaultExpanded);
  const [searchQuery, setSearchQuery] = React.useState("");
  const itemsRef = React.useRef<Map<string, ItemInfo>>(new Map());
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const suppressAnimationRef = React.useRef(false);

  const register = React.useCallback((id: string, info: ItemInfo) => {
    const existing = itemsRef.current.get(id);
    if (existing?.label === info.label && existing?.isFolder === info.isFolder)
      return;
    itemsRef.current.set(id, info);
    forceUpdate();
  }, []);

  const visibleIds = computeVisibleIds(itemsRef.current, searchQuery);

  React.useEffect(() => {
    if (!visibleIds || visibleIds.size === 0) return;

    suppressAnimationRef.current = true;

    setExpandedIds((prev) => {
      const newSet = new Set([...prev, ...visibleIds]);
      return newSet.size === prev.length ? prev : [...newSet];
    });

    suppressAnimationRef.current = false;
  }, [visibleIds]);

  return (
    <FileTreeContext.Provider
      value={{
        selectedId,
        select: setSelectedId,
        expandedIds,
        setExpandedIds,
        searchQuery,
        setSearchQuery,
        register,
        visibleIds,
        suppressAnimationRef,
      }}
    >
      <div
        className={cn("select-none text-sm", className)}
        ref={ref}
        {...props}
      >
        <Accordion.Root
          className="flex flex-col"
          onValueChange={setExpandedIds}
          type="multiple"
          value={expandedIds}
        >
          {children}
        </Accordion.Root>
      </div>
    </FileTreeContext.Provider>
  );
}

interface FileTreeSearchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  onValueChange?: (value: string) => void;
  ref?: React.Ref<HTMLInputElement>;
}

export function FileTreeSearch({
  className,
  onValueChange,
  ref,
  ...props
}: FileTreeSearchProps) {
  const { searchQuery, setSearchQuery } = useFileTree();
  return (
    <div className="relative mb-2">
      <Search className="absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        className={cn(
          "w-full rounded-sm border border-input bg-transparent py-1 pr-3 pl-7.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className
        )}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onValueChange?.(e.target.value);
        }}
        ref={ref}
        type="text"
        value={searchQuery}
        {...props}
      />
    </div>
  );
}

interface FolderProps {
  label: string;
  id: string;
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function Folder({ className, label, id, children, ref }: FolderProps) {
  const {
    expandedIds,
    setExpandedIds,
    register,
    visibleIds,
    suppressAnimationRef,
  } = useFileTree();
  const parentPath = React.useContext(PathContext);
  const path = React.useMemo(() => [...parentPath, id], [parentPath, id]);
  const isOpen = expandedIds.includes(id);

  React.useEffect(() => {
    register(id, { label, path: parentPath, isFolder: true });
  }, [id, label, parentPath, register]);

  if (visibleIds && !visibleIds.has(id)) return null;

  const shouldAnimate = !suppressAnimationRef.current;

  return (
    <PathContext.Provider value={path}>
      <Accordion.Item className={className} ref={ref} value={id}>
        <Accordion.Trigger className="flex w-fit items-center gap-1 rounded-sm px-1 py-0.5 transition-colors hover:bg-muted">
          {isOpen ? (
            <FolderOpenIcon className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate">{label}</span>
        </Accordion.Trigger>
        <Accordion.Content
          className={cn(
            "overflow-hidden",
            shouldAnimate &&
              "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
          )}
        >
          <div className="ml-2 border-border border-l pl-4">
            <Accordion.Root
              className="flex flex-col"
              onValueChange={setExpandedIds}
              type="multiple"
              value={expandedIds}
            >
              {children}
            </Accordion.Root>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </PathContext.Provider>
  );
}

interface FileProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  id?: string;
  icon?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

export function File({ className, label, id, icon, ref, ...props }: FileProps) {
  const { selectedId, select, register, visibleIds } = useFileTree();
  const parentPath = React.useContext(PathContext);
  const fileId = id ?? label;

  React.useEffect(() => {
    register(fileId, { label, path: parentPath, isFolder: false });
  }, [fileId, label, parentPath, register]);

  if (visibleIds && !visibleIds.has(fileId)) return null;

  return (
    <button
      className={cn(
        "flex w-fit items-center gap-1 rounded-sm px-1 py-0.5 text-left transition-colors hover:bg-muted",
        selectedId === fileId && "bg-muted",
        className
      )}
      onClick={() => select(fileId)}
      ref={ref}
      type="button"
      {...props}
    >
      {icon ?? <FileIcon className="size-4 shrink-0 text-muted-foreground" />}
      <span className="truncate">{label}</span>
    </button>
  );
}
