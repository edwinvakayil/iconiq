"use client";

/**
 * Left sidebar: searchable component library grouped by category. Items drag
 * onto the canvas (or click to append into the current selection's parent).
 */

import {
  HeadingIcon,
  LayoutGridIcon,
  type LucideIcon,
  PilcrowIcon,
  RectangleHorizontalIcon,
  RectangleVerticalIcon,
  SearchIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  STUDIO_CATEGORIES,
  STUDIO_COMPONENTS,
  type StudioComponentDef,
} from "@/lib/studio/registry";
import { useStudioStore } from "@/lib/studio/store";
import { findNode, getChildren } from "@/lib/studio/tree";
import type { NewNodeSpec } from "@/lib/studio/types";
import { cn } from "@/lib/utils";

import { didJustDrag, useStudioDrag } from "./use-studio-drag";

type PaletteEntry = {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  spec: NewNodeSpec;
  keywords: string;
};

const LAYOUT_ENTRIES: PaletteEntry[] = [
  {
    key: "stack-v",
    label: "Vertical stack",
    description: "Flex column with gap.",
    icon: RectangleVerticalIcon,
    spec: { kind: "container", preset: "stack-v" },
    keywords: "container flex column stack layout",
  },
  {
    key: "stack-h",
    label: "Horizontal stack",
    description: "Flex row with gap.",
    icon: RectangleHorizontalIcon,
    spec: { kind: "container", preset: "stack-h" },
    keywords: "container flex row stack layout",
  },
  {
    key: "grid",
    label: "Grid",
    description: "Responsive column grid.",
    icon: LayoutGridIcon,
    spec: { kind: "container", preset: "grid" },
    keywords: "container grid columns layout",
  },
  {
    key: "heading",
    label: "Heading",
    description: "Semantic heading text.",
    icon: HeadingIcon,
    spec: { kind: "text", tag: "h2" },
    keywords: "text title heading typography",
  },
  {
    key: "paragraph",
    label: "Paragraph",
    description: "Body copy text block.",
    icon: PilcrowIcon,
    spec: { kind: "text", tag: "p" },
    keywords: "text body copy paragraph typography",
  },
];

function componentEntry(def: StudioComponentDef): PaletteEntry {
  return {
    key: def.type,
    label: def.label,
    description: def.description,
    icon: def.icon,
    spec: { kind: "component", type: def.type },
    keywords: `${def.label} ${def.type} ${def.keywords ?? ""}`.toLowerCase(),
  };
}

/** Append the entry into the selected container (or the root). */
function insertByClick(spec: NewNodeSpec) {
  const store = useStudioStore.getState();
  const { project, selection } = store;
  let parentId = project.root.id;
  let index = project.root.children.length;

  if (selection.length === 1) {
    const selected = findNode(project.root, selection[0]);
    const children = selected ? getChildren(selected) : null;
    if (selected && children) {
      parentId = selected.id;
      index = children.length;
    }
  }
  store.insertNew(spec, { parentId, index });
}

function PaletteItem({ entry }: { entry: PaletteEntry }) {
  const { beginDrag } = useStudioDrag();
  const Icon = entry.icon;
  const [pressed, setPressed] = useState(false);

  return (
    <button
      className={cn(
        "group flex w-full cursor-grab items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors duration-100",
        "hover:border-border hover:bg-accent/70",
        pressed && "cursor-grabbing"
      )}
      onClick={(event) => {
        // A real drag ends before click fires; don't double-insert after it.
        if (!didJustDrag()) {
          event.preventDefault();
          insertByClick(entry.spec);
        }
      }}
      onPointerDown={(event) => {
        setPressed(true);
        beginDrag(event, { type: "new", spec: entry.spec });
      }}
      onPointerUp={() => setPressed(false)}
      title={entry.description}
      type="button"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground transition-colors group-hover:text-foreground">
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium text-[13px] text-foreground leading-tight">
          {entry.label}
        </span>
        <span className="block truncate text-[11px] text-muted-foreground leading-tight">
          {entry.description}
        </span>
      </span>
    </button>
  );
}

export function StudioPalette() {
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = (entry: PaletteEntry) =>
      normalized.length === 0 ||
      entry.keywords.includes(normalized) ||
      entry.label.toLowerCase().includes(normalized);

    const result: Array<{ title: string; entries: PaletteEntry[] }> = [];
    const layout = LAYOUT_ENTRIES.filter(matches);
    if (layout.length > 0) {
      result.push({ title: "Structure", entries: layout });
    }
    for (const category of STUDIO_CATEGORIES) {
      const entries = STUDIO_COMPONENTS.filter(
        (def) => def.category === category
      )
        .map(componentEntry)
        .filter(matches);
      if (entries.length > 0) {
        result.push({ title: category, entries });
      }
    }
    return result;
  }, [query]);

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-border border-r bg-background">
      <div className="border-border border-b p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 focus-within:border-ring">
          <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search components…"
            value={query}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {sections.length === 0 ? (
          <p className="px-2 py-6 text-center text-muted-foreground text-xs">
            No components match “{query}”.
          </p>
        ) : (
          sections.map((section) => (
            <div className="mb-3" key={section.title}>
              <p className="px-2 pt-1 pb-1.5 font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
                {section.title}
              </p>
              <div className="flex flex-col gap-0.5">
                {section.entries.map((entry) => (
                  <PaletteItem entry={entry} key={entry.key} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
