/**
 * Layout inference for drag & drop.
 *
 * Given a pointer position, work out the semantic insertion point: which
 * container, at which index, honoring the container's flow direction. All
 * measurement happens in screen space via data-attributes the canvas renderer
 * stamps on droppable elements — the tree itself never stores coordinates.
 */

import { findNode, getChildren, isDescendantOf } from "./tree";
import type {
  ContainerNode,
  DragSource,
  DropIndicator,
  StudioNode,
} from "./types";

export const DROP_ATTR = "data-studio-drop";
export const NODE_ATTR = "data-studio-node-id";
/** Marks the single root element of each rendered node (not inner drop zones). */
export const NODE_ROOT_ATTR = "data-studio-node";
export const DIRECTION_ATTR = "data-studio-direction";

type Flow = "row" | "column" | "grid";

const INDICATOR_THICKNESS = 3;

function childElements(container: Element): HTMLElement[] {
  const all = container.querySelectorAll<HTMLElement>(`[${NODE_ROOT_ATTR}]`);
  const direct: HTMLElement[] = [];
  for (const el of all) {
    // Only immediate tree children: skip nodes nested in deeper drop zones.
    if (el.parentElement?.closest(`[${DROP_ATTR}]`) === container) {
      direct.push(el);
    }
  }
  return direct;
}

function insertionIndexForColumn(
  children: HTMLElement[],
  pointerY: number
): number {
  let index = 0;
  for (const child of children) {
    const rect = child.getBoundingClientRect();
    if (pointerY > rect.top + rect.height / 2) {
      index += 1;
    }
  }
  return index;
}

function insertionIndexForRow(
  children: HTMLElement[],
  pointerX: number,
  pointerY: number,
  wrapAware: boolean
): number {
  let index = 0;
  for (const child of children) {
    const rect = child.getBoundingClientRect();
    if (wrapAware && pointerY > rect.bottom) {
      index += 1;
      continue;
    }
    if (wrapAware && pointerY < rect.top) {
      continue;
    }
    if (pointerX > rect.left + rect.width / 2) {
      index += 1;
    }
  }
  return index;
}

function indicatorRect(
  container: Element,
  children: HTMLElement[],
  index: number,
  flow: Flow
): DropIndicator["rect"] {
  const containerRect = container.getBoundingClientRect();
  const style = window.getComputedStyle(container);
  const padLeft = Number.parseFloat(style.paddingLeft) || 0;
  const padRight = Number.parseFloat(style.paddingRight) || 0;
  const padTop = Number.parseFloat(style.paddingTop) || 0;
  const padBottom = Number.parseFloat(style.paddingBottom) || 0;
  const innerX = containerRect.left + padLeft;
  const innerWidth = containerRect.width - padLeft - padRight;
  const innerY = containerRect.top + padTop;
  const innerHeight = containerRect.height - padTop - padBottom;

  if (children.length === 0) {
    return {
      x: innerX,
      y: innerY,
      width: Math.max(innerWidth, 24),
      height: Math.max(Math.min(innerHeight, 48), INDICATOR_THICKNESS),
    };
  }

  const clamped = Math.max(0, Math.min(index, children.length));
  const reference =
    clamped < children.length
      ? children[clamped].getBoundingClientRect()
      : (children.at(-1) as HTMLElement).getBoundingClientRect();
  const isAfterLast = clamped >= children.length;

  if (flow === "column") {
    const y = isAfterLast ? reference.bottom + 2 : reference.top - 2;
    return {
      x: innerX,
      y: y - INDICATOR_THICKNESS / 2,
      width: innerWidth,
      height: INDICATOR_THICKNESS,
    };
  }

  const x = isAfterLast ? reference.right + 2 : reference.left - 2;
  return {
    x: x - INDICATOR_THICKNESS / 2,
    y: reference.top,
    width: INDICATOR_THICKNESS,
    height: reference.height,
  };
}

function dropForbidden(
  root: ContainerNode,
  source: DragSource,
  parentId: string
): boolean {
  if (source.type !== "node") {
    return false;
  }
  for (const id of source.nodeIds) {
    // Can't drop a node into itself or its own subtree.
    if (id === parentId || isDescendantOf(root, id, parentId)) {
      return true;
    }
  }
  return false;
}

/**
 * Resolve the drop indicator for the current pointer position, or null when
 * the pointer isn't over a valid drop zone.
 */
export function computeDropIndicator(
  root: ContainerNode,
  source: DragSource,
  pointer: { x: number; y: number }
): DropIndicator | null {
  if (typeof document === "undefined") {
    return null;
  }

  const stack = document.elementsFromPoint(pointer.x, pointer.y);
  const dropElement = stack.find((el) => el.hasAttribute(DROP_ATTR));
  if (!dropElement) {
    return null;
  }

  const parentId = dropElement.getAttribute(NODE_ATTR);
  if (!parentId || dropForbidden(root, source, parentId)) {
    return null;
  }

  const parentNode = findNode(root, parentId);
  if (!parentNode || getChildren(parentNode) === null) {
    return null;
  }

  const flow = (dropElement.getAttribute(DIRECTION_ATTR) ?? "column") as Flow;
  const children = childElements(dropElement).filter((el) => {
    if (source.type !== "node") {
      return true;
    }
    const id = el.getAttribute(NODE_ATTR);
    return !(id && source.nodeIds.includes(id));
  });

  const index =
    flow === "column"
      ? insertionIndexForColumn(children, pointer.y)
      : insertionIndexForRow(children, pointer.x, pointer.y, flow === "grid");

  return {
    parentId,
    index,
    rect: indicatorRect(dropElement, children, index, flow),
    orientation: flow === "column" ? "horizontal" : "vertical",
  };
}

/** Map an arbitrary DOM element to the studio node it belongs to. */
export function nodeIdFromElement(element: Element | null): string | null {
  const host = element?.closest(`[${NODE_ATTR}]`);
  return host?.getAttribute(NODE_ATTR) ?? null;
}

export function nodeElementById(id: string): HTMLElement | null {
  if (typeof document === "undefined") {
    return null;
  }
  return document.querySelector<HTMLElement>(`[${NODE_ATTR}="${id}"]`);
}

export function isStudioNode(node: StudioNode | null): node is StudioNode {
  return node !== null;
}
