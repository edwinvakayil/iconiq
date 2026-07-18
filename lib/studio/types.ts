/**
 * Iconiq Studio — core data model.
 *
 * The studio never works with pixels or absolute positions. Every design is a
 * semantic tree of containers (flex / grid) and component instances. Code is
 * generated from this tree, never from the DOM.
 */

export type StudioNode = ContainerNode | ComponentNode | TextNode;

export type NodeKind = StudioNode["kind"];

export type FlexDirection = "row" | "column";
export type AlignItems = "start" | "center" | "end" | "stretch" | "baseline";
export type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

/** Spacing values are px on the Tailwind spacing scale (snapped on edit). */
export type SpacingValue = number;

/** Per-side spacing in px on the Tailwind scale. */
export type SpacingSides = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export function uniformSides(value: number): SpacingSides {
  return { top: value, right: value, bottom: value, left: value };
}

export type SizeMode = "auto" | "fit" | "full" | "fixed";

/** One axis of a node's position within its parent. */
export type PlaceValue = "auto" | "start" | "center" | "end";

/**
 * Per-node placement inside the parent, expressed semantically and resolved
 * to `self-*` / auto-margin utilities based on the parent's flow direction —
 * so a single component can sit centered without touching its siblings.
 */
export type NodePlace = { h: PlaceValue; v: PlaceValue };

export type NodeSize = {
  mode: SizeMode;
  /** Only meaningful when mode === "fixed". Px, snapped to Tailwind scale. */
  value?: number;
};

export type ContainerBackground =
  | "none"
  | "background"
  | "card"
  | "muted"
  | "accent";

export type ContainerRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";

export type ContainerShadow = "none" | "sm" | "md" | "lg";

type BaseNode = {
  id: string;
  /** Optional user-facing label shown in the layers/selection UI. */
  name?: string;
  hidden?: boolean;
  /** Extra Tailwind classes appended verbatim on export and render. */
  customClasses?: string;
  width?: NodeSize;
  height?: NodeSize;
  /** Per-side margin in px, snapped to the Tailwind scale. */
  margin?: SpacingSides;
  /** Per-side padding in px, snapped to the Tailwind scale. */
  padding?: SpacingSides;
  /** Position within the parent (self-alignment + auto margins). */
  place?: NodePlace;
};

export type ContainerLayout = {
  mode: "flex" | "grid";
  direction: FlexDirection;
  wrap: boolean;
  gap: SpacingValue;
  padding: SpacingValue;
  align: AlignItems;
  justify: JustifyContent;
  /** Grid only. */
  columns: number;
};

export type ContainerStyle = {
  background: ContainerBackground;
  radius: ContainerRadius;
  border: boolean;
  shadow: ContainerShadow;
  /** Optional max-width in px (snapped). 0 = none. */
  maxWidth: number;
  /**
   * Stretch to at least the viewport height (`min-h-screen`). Combined with
   * center alignment this lets content sit in the middle of the page instead
   * of always flowing from the top.
   */
  fullHeight: boolean;
};

export type ContainerNode = BaseNode & {
  kind: "container";
  layout: ContainerLayout;
  style: ContainerStyle;
  children: StudioNode[];
};

export type ComponentNode = BaseNode & {
  kind: "component";
  /** Key into the studio component registry, e.g. "button". */
  component: string;
  props: Record<string, unknown>;
  /** Present only for components that accept dropped children (e.g. Card). */
  children?: StudioNode[];
};

export type TextTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

export type TextNode = BaseNode & {
  kind: "text";
  tag: TextTag;
  text: string;
  muted: boolean;
};

/** The document root is always a column container. */
export type StudioProject = {
  version: 1;
  name: string;
  root: ContainerNode;
};

/* ------------------------------------------------------------------ */
/* Drag and drop                                                       */
/* ------------------------------------------------------------------ */

/** What the palette inserts — a registry component, a container, or text. */
export type NewNodeSpec =
  | { kind: "component"; type: string }
  | { kind: "container"; preset: "stack-v" | "stack-h" | "grid" }
  | { kind: "text"; tag: TextTag };

export type DragSource =
  | { type: "new"; spec: NewNodeSpec }
  | { type: "node"; nodeIds: string[] };

/** A semantic insertion point in the tree — never a coordinate. */
export type DropTarget = {
  parentId: string;
  index: number;
};

export type DropIndicator = DropTarget & {
  /** Screen-space line for the insertion indicator overlay. */
  rect: { x: number; y: number; width: number; height: number };
  orientation: "horizontal" | "vertical";
};

export type DragState = {
  source: DragSource;
  /** Pointer position in screen space, for the drag ghost. */
  pointer: { x: number; y: number };
  target: DropIndicator | null;
};

/* ------------------------------------------------------------------ */
/* Viewport                                                            */
/* ------------------------------------------------------------------ */

export const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5] as const;

export type Device = "desktop" | "tablet" | "mobile";

export const DEVICE_WIDTHS: Record<Device, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 390,
};

/** Emulated viewport height per device — what `min-h-screen` means on canvas. */
export const DEVICE_VIEWPORT_HEIGHTS: Record<Device, number> = {
  desktop: 800,
  tablet: 1024,
  mobile: 844,
};

export type CanvasTheme = "light" | "dark";

export type StudioMode = "edit" | "preview";
