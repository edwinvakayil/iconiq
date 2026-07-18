"use client";

/**
 * Iconiq Studio state.
 *
 * One Zustand store, three concerns:
 *  - document: the semantic node tree (undoable)
 *  - selection/interaction: selection, hover, drag (partially undoable)
 *  - viewport: zoom, pan, device, theme, mode (never undoable)
 *
 * History uses tag coalescing: bursts of the same edit (typing in an
 * inspector field, nudging a gap slider) collapse into one undo step.
 */

import { create } from "zustand";

import { createDefaultProject } from "./persistence";
import { getComponentDef } from "./registry";
import {
  cloneSubtree,
  createContainer,
  createNodeId,
  duplicateNodes,
  findNode,
  findParent,
  insertNode,
  moveNodes,
  removeNodes,
  shiftNode,
  updateNode,
  wrapInContainer,
} from "./tree";
import {
  type CanvasTheme,
  type ContainerNode,
  type Device,
  type DragSource,
  type DragState,
  type DropIndicator,
  type DropTarget,
  type NewNodeSpec,
  type NodePlace,
  type StudioMode,
  type StudioNode,
  type StudioProject,
  type TextTag,
  ZOOM_LEVELS,
} from "./types";

type HistoryEntry = {
  root: ContainerNode;
  selection: string[];
};

const HISTORY_LIMIT = 100;
const COALESCE_MS = 900;

export type StudioStore = {
  project: StudioProject;
  hydrated: boolean;

  selection: string[];
  hoveredId: string | null;
  drag: DragState | null;
  clipboard: StudioNode[] | null;

  zoom: number;
  pan: { x: number; y: number };
  device: Device;
  canvasTheme: CanvasTheme;
  mode: StudioMode;
  exportOpen: boolean;

  past: HistoryEntry[];
  future: HistoryEntry[];
  lastHistoryTag: string | null;
  lastHistoryTime: number;

  savedAt: number | null;
  dirty: boolean;

  hydrate: () => void;
  setProjectName: (name: string) => void;

  select: (ids: string[]) => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  setHovered: (id: string | null) => void;

  insertNew: (spec: NewNodeSpec, target: DropTarget) => void;
  move: (ids: string[], target: DropTarget) => void;
  remove: (ids: string[]) => void;
  duplicate: (ids: string[]) => void;
  wrapSelection: () => void;
  /**
   * Position the selection inside its parent. A multi-selection is grouped
   * into a stack first so it moves as one unit. Centering vertically at the
   * page root also enables full height so the placement is visible.
   */
  placeSelection: (place: NodePlace | undefined) => void;
  copySelection: () => void;
  paste: () => void;
  shiftSelected: (delta: -1 | 1) => void;

  updateComponentProps: (id: string, patch: Record<string, unknown>) => void;
  updateContainer: (
    id: string,
    patch: {
      layout?: Partial<ContainerNode["layout"]>;
      style?: Partial<ContainerNode["style"]>;
    }
  ) => void;
  updateBase: (
    id: string,
    patch: Partial<
      Pick<
        StudioNode,
        | "name"
        | "hidden"
        | "customClasses"
        | "width"
        | "height"
        | "margin"
        | "padding"
        | "place"
      >
    >
  ) => void;
  updateText: (
    id: string,
    patch: Partial<{ tag: TextTag; text: string; muted: boolean }>
  ) => void;

  undo: () => void;
  redo: () => void;

  setZoom: (zoom: number) => void;
  stepZoom: (direction: -1 | 1) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setDevice: (device: Device) => void;
  setCanvasTheme: (theme: CanvasTheme) => void;
  setMode: (mode: StudioMode) => void;
  setExportOpen: (open: boolean) => void;

  startDrag: (source: DragSource, pointer: { x: number; y: number }) => void;
  updateDrag: (
    pointer: { x: number; y: number },
    target: DropIndicator | null
  ) => void;
  endDrag: (commit: boolean) => void;

  resetProject: () => void;
  importProject: (project: StudioProject) => void;
  markSaved: (timestamp: number) => void;
};

const ZOOM_STEPS: readonly number[] = ZOOM_LEVELS;

export function createNodeFromSpec(spec: NewNodeSpec): StudioNode | null {
  if (spec.kind === "container") {
    if (spec.preset === "grid") {
      return createContainer({
        layout: {
          mode: "grid",
          direction: "row",
          wrap: false,
          gap: 24,
          padding: 0,
          align: "stretch",
          justify: "start",
          columns: 2,
        },
      });
    }
    const isRow = spec.preset === "stack-h";
    return createContainer({
      layout: {
        mode: "flex",
        direction: isRow ? "row" : "column",
        wrap: false,
        gap: 16,
        padding: 0,
        align: isRow ? "center" : "stretch",
        justify: "start",
        columns: 2,
      },
    });
  }

  if (spec.kind === "text") {
    return {
      id: createNodeId("text"),
      kind: "text",
      tag: spec.tag,
      text: spec.tag === "p" ? "Write something helpful." : "Heading",
      muted: spec.tag === "p",
    };
  }

  const def = getComponentDef(spec.type);
  if (!def) {
    return null;
  }
  return {
    id: createNodeId("component"),
    kind: "component",
    component: def.type,
    props: def.defaultProps(),
    ...(def.acceptsChildren ? { children: [] } : {}),
  };
}

export const useStudioStore = create<StudioStore>((set, get) => {
  /** Push an undo entry unless it coalesces with the previous one. */
  const pushHistory = (tag: string) => {
    const state = get();
    const now = Date.now();
    const coalesce =
      tag === state.lastHistoryTag && now - state.lastHistoryTime < COALESCE_MS;
    set({
      lastHistoryTag: tag,
      lastHistoryTime: now,
      future: [],
      dirty: true,
      ...(coalesce
        ? {}
        : {
            past: [
              ...state.past.slice(-(HISTORY_LIMIT - 1)),
              { root: state.project.root, selection: state.selection },
            ],
          }),
    });
  };

  const setRoot = (root: ContainerNode) => {
    set((state) => ({ project: { ...state.project, root } }));
  };

  return {
    project: createDefaultProject(),
    hydrated: false,

    selection: [],
    hoveredId: null,
    drag: null,
    clipboard: null,

    zoom: 1,
    pan: { x: 0, y: 0 },
    device: "desktop",
    canvasTheme: "light",
    mode: "edit",
    exportOpen: false,

    past: [],
    future: [],
    lastHistoryTag: null,
    lastHistoryTime: 0,

    savedAt: null,
    dirty: false,

    hydrate: () => {
      if (get().hydrated) {
        return;
      }
      // Imported lazily to keep the store constructor SSR-safe.
      import("./persistence").then(({ loadStoredProject }) => {
        const stored = loadStoredProject();
        set({
          hydrated: true,
          ...(stored ? { project: stored, savedAt: Date.now() } : {}),
        });
      });
    },

    setProjectName: (name) => {
      pushHistory("project-name");
      set((state) => ({ project: { ...state.project, name } }));
    },

    select: (ids) => set({ selection: ids }),
    toggleSelect: (id) =>
      set((state) => ({
        selection: state.selection.includes(id)
          ? state.selection.filter((existing) => existing !== id)
          : [...state.selection, id],
      })),
    clearSelection: () => set({ selection: [] }),
    setHovered: (id) => set({ hoveredId: id }),

    insertNew: (spec, target) => {
      const node = createNodeFromSpec(spec);
      if (!node) {
        return;
      }
      pushHistory(`insert:${node.id}`);
      setRoot(insertNode(get().project.root, node, target));
      set({ selection: [node.id] });
    },

    move: (ids, target) => {
      pushHistory(`move:${ids.join(",")}:${Date.now()}`);
      setRoot(moveNodes(get().project.root, ids, target));
    },

    remove: (ids) => {
      if (ids.length === 0) {
        return;
      }
      pushHistory(`remove:${ids.join(",")}`);
      setRoot(removeNodes(get().project.root, ids));
      set({ selection: [], hoveredId: null });
    },

    duplicate: (ids) => {
      if (ids.length === 0) {
        return;
      }
      pushHistory(`duplicate:${ids.join(",")}:${Date.now()}`);
      const { tree, newIds } = duplicateNodes(get().project.root, ids);
      setRoot(tree);
      set({ selection: newIds });
    },

    wrapSelection: () => {
      const { selection } = get();
      if (selection.length === 0) {
        return;
      }
      pushHistory(`wrap:${selection.join(",")}`);
      const { tree, wrapperId } = wrapInContainer(
        get().project.root,
        selection
      );
      setRoot(tree);
      if (wrapperId) {
        set({ selection: [wrapperId] });
      }
    },

    placeSelection: (place) => {
      const { selection, project } = get();
      if (selection.length === 0) {
        return;
      }
      pushHistory(`place:${selection.join(",")}`);

      let tree = project.root;
      let targetId = selection[0];

      // A multi-selection moves as one unit: group it first.
      if (selection.length > 1) {
        const wrapped = wrapInContainer(tree, selection);
        if (!wrapped.wrapperId) {
          return;
        }
        tree = wrapped.tree;
        targetId = wrapped.wrapperId;
      }

      tree = updateNode(tree, targetId, (node) => ({ ...node, place }));

      // "Center of canvas" needs vertical room: give the page height when
      // the placed node sits directly in the root.
      const location = findParent(tree, targetId);
      if (
        place &&
        place.v !== "auto" &&
        location?.parent.id === tree.id &&
        !tree.style.fullHeight
      ) {
        tree = { ...tree, style: { ...tree.style, fullHeight: true } };
      }

      setRoot(tree);
      set({ selection: [targetId] });
    },

    copySelection: () => {
      const { selection, project } = get();
      const nodes = selection
        .map((id) => findNode(project.root, id))
        .filter((node): node is StudioNode => node !== null);
      if (nodes.length > 0) {
        set({ clipboard: nodes.map((node) => cloneSubtree(node)) });
      }
    },

    paste: () => {
      const { clipboard, selection, project } = get();
      if (!clipboard || clipboard.length === 0) {
        return;
      }
      // Paste after the selected node, or at the end of the root.
      let target: DropTarget = {
        parentId: project.root.id,
        index: project.root.children.length,
      };
      if (selection.length > 0) {
        const location = findParent(project.root, selection[0]);
        if (location) {
          target = {
            parentId: location.parent.id,
            index: location.index + 1,
          };
        }
      }
      pushHistory(`paste:${Date.now()}`);
      let tree = project.root;
      const pastedIds: string[] = [];
      for (const [offset, node] of clipboard.entries()) {
        const copy = cloneSubtree(node);
        pastedIds.push(copy.id);
        tree = insertNode(tree, copy, {
          parentId: target.parentId,
          index: target.index + offset,
        });
      }
      setRoot(tree);
      set({ selection: pastedIds });
    },

    shiftSelected: (delta) => {
      const { selection } = get();
      if (selection.length !== 1) {
        return;
      }
      pushHistory(`shift:${selection[0]}`);
      setRoot(shiftNode(get().project.root, selection[0], delta));
    },

    updateComponentProps: (id, patch) => {
      pushHistory(`props:${id}:${Object.keys(patch).join(",")}`);
      setRoot(
        updateNode(get().project.root, id, (node) =>
          node.kind === "component"
            ? { ...node, props: { ...node.props, ...patch } }
            : node
        )
      );
    },

    updateContainer: (id, patch) => {
      pushHistory(
        `container:${id}:${Object.keys(patch.layout ?? {}).join(",")}:${Object.keys(patch.style ?? {}).join(",")}`
      );
      setRoot(
        updateNode(get().project.root, id, (node) =>
          node.kind === "container"
            ? {
                ...node,
                layout: { ...node.layout, ...patch.layout },
                style: { ...node.style, ...patch.style },
              }
            : node
        )
      );
    },

    updateBase: (id, patch) => {
      pushHistory(`base:${id}:${Object.keys(patch).join(",")}`);
      setRoot(
        updateNode(get().project.root, id, (node) => ({ ...node, ...patch }))
      );
    },

    updateText: (id, patch) => {
      pushHistory(`text:${id}:${Object.keys(patch).join(",")}`);
      setRoot(
        updateNode(get().project.root, id, (node) =>
          node.kind === "text" ? { ...node, ...patch } : node
        )
      );
    },

    undo: () => {
      const { past, future, project, selection } = get();
      const previous = past.at(-1);
      if (!previous) {
        return;
      }
      set({
        past: past.slice(0, -1),
        future: [...future, { root: project.root, selection }].slice(
          -HISTORY_LIMIT
        ),
        project: { ...project, root: previous.root },
        selection: previous.selection,
        lastHistoryTag: null,
        dirty: true,
      });
    },

    redo: () => {
      const { past, future, project, selection } = get();
      const next = future.at(-1);
      if (!next) {
        return;
      }
      set({
        future: future.slice(0, -1),
        past: [...past, { root: project.root, selection }].slice(
          -HISTORY_LIMIT
        ),
        project: { ...project, root: next.root },
        selection: next.selection,
        lastHistoryTag: null,
        dirty: true,
      });
    },

    setZoom: (zoom) => set({ zoom }),
    stepZoom: (direction) => {
      const { zoom } = get();
      const index = ZOOM_STEPS.findIndex((step) => step >= zoom - 0.001);
      const currentIndex = index === -1 ? ZOOM_STEPS.length - 1 : index;
      const nextIndex = Math.max(
        0,
        Math.min(ZOOM_STEPS.length - 1, currentIndex + direction)
      );
      set({ zoom: ZOOM_STEPS[nextIndex] });
    },
    setPan: (pan) => set({ pan }),
    setDevice: (device) => set({ device }),
    setCanvasTheme: (canvasTheme) => set({ canvasTheme }),
    setMode: (mode) =>
      set({
        mode,
        ...(mode === "preview" ? { selection: [], hoveredId: null } : {}),
      }),
    setExportOpen: (exportOpen) => set({ exportOpen }),

    startDrag: (source, pointer) =>
      set({ drag: { source, pointer, target: null } }),

    updateDrag: (pointer, target) =>
      set((state) =>
        state.drag ? { drag: { ...state.drag, pointer, target } } : {}
      ),

    endDrag: (commit) => {
      const { drag } = get();
      set({ drag: null });
      if (!(commit && drag?.target)) {
        return;
      }
      const target: DropTarget = {
        parentId: drag.target.parentId,
        index: drag.target.index,
      };
      if (drag.source.type === "new") {
        get().insertNew(drag.source.spec, target);
      } else {
        get().move(drag.source.nodeIds, target);
      }
    },

    resetProject: () => {
      pushHistory(`reset:${Date.now()}`);
      const fresh = createDefaultProject();
      set((state) => ({
        project: { ...fresh, name: state.project.name },
        selection: [],
        hoveredId: null,
      }));
    },

    importProject: (project) => {
      pushHistory(`import:${Date.now()}`);
      set({ project, selection: [], hoveredId: null });
    },

    markSaved: (timestamp) => set({ savedAt: timestamp, dirty: false }),
  };
});

/* Convenience selectors (stable references for common subscriptions). */
export const selectRoot = (state: StudioStore) => state.project.root;
export const selectSelection = (state: StudioStore) => state.selection;
export const selectDrag = (state: StudioStore) => state.drag;
export const selectMode = (state: StudioStore) => state.mode;
