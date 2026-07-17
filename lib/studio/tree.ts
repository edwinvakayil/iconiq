/**
 * Pure, immutable operations over the studio node tree.
 *
 * Every function returns a new tree; nothing here touches the DOM, the store,
 * or rendering. Invalid operations (cycles, unknown parents, dropping a node
 * into its own subtree) return the input tree unchanged so callers can treat
 * every op as safe.
 */

import type {
  ComponentNode,
  ContainerNode,
  DropTarget,
  StudioNode,
} from "./types";

let idCounter = 0;

export function createNodeId(prefix = "node"): string {
  idCounter += 1;
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${random}${idCounter}`;
}

export function createContainer(
  overrides: Partial<Omit<ContainerNode, "kind" | "id">> = {}
): ContainerNode {
  return {
    id: createNodeId("container"),
    kind: "container",
    layout: {
      mode: "flex",
      direction: "column",
      wrap: false,
      gap: 16,
      padding: 0,
      align: "stretch",
      justify: "start",
      columns: 2,
      ...overrides.layout,
    },
    style: {
      background: "none",
      radius: "none",
      border: false,
      shadow: "none",
      maxWidth: 0,
      ...overrides.style,
    },
    children: overrides.children ?? [],
    ...(overrides.name ? { name: overrides.name } : {}),
  };
}

/** Children of a node, or null when the node cannot hold children. */
export function getChildren(node: StudioNode): StudioNode[] | null {
  if (node.kind === "container") {
    return node.children;
  }
  if (node.kind === "component" && node.children) {
    return node.children;
  }
  return null;
}

function withChildren(node: StudioNode, children: StudioNode[]): StudioNode {
  if (node.kind === "container") {
    return { ...node, children };
  }
  if (node.kind === "component") {
    return { ...node, children };
  }
  return node;
}

export function findNode(root: StudioNode, id: string): StudioNode | null {
  if (root.id === id) {
    return root;
  }
  const children = getChildren(root);
  if (!children) {
    return null;
  }
  for (const child of children) {
    const found = findNode(child, id);
    if (found) {
      return found;
    }
  }
  return null;
}

export function findParent(
  root: StudioNode,
  id: string
): { parent: StudioNode; index: number } | null {
  const children = getChildren(root);
  if (!children) {
    return null;
  }
  const index = children.findIndex((child) => child.id === id);
  if (index !== -1) {
    return { parent: root, index };
  }
  for (const child of children) {
    const found = findParent(child, id);
    if (found) {
      return found;
    }
  }
  return null;
}

/** True when `maybeDescendant` is inside (or is) the subtree rooted at `id`. */
export function isDescendantOf(
  root: StudioNode,
  id: string,
  maybeDescendantId: string
): boolean {
  const subtree = findNode(root, id);
  return subtree ? findNode(subtree, maybeDescendantId) !== null : false;
}

function mapTree(
  node: StudioNode,
  fn: (node: StudioNode) => StudioNode
): StudioNode {
  const mapped = fn(node);
  const children = getChildren(mapped);
  if (!children) {
    return mapped;
  }
  let changed = false;
  const nextChildren = children.map((child) => {
    const next = mapTree(child, fn);
    if (next !== child) {
      changed = true;
    }
    return next;
  });
  return changed ? withChildren(mapped, nextChildren) : mapped;
}

export function updateNode(
  root: ContainerNode,
  id: string,
  updater: (node: StudioNode) => StudioNode
): ContainerNode {
  return mapTree(root, (node) =>
    node.id === id ? updater(node) : node
  ) as ContainerNode;
}

export function insertNode(
  root: ContainerNode,
  node: StudioNode,
  target: DropTarget
): ContainerNode {
  const parent = findNode(root, target.parentId);
  if (!parent || getChildren(parent) === null) {
    return root;
  }
  return mapTree(root, (current) => {
    if (current.id !== target.parentId) {
      return current;
    }
    const children = getChildren(current) ?? [];
    const index = Math.max(0, Math.min(target.index, children.length));
    const next = [...children.slice(0, index), node, ...children.slice(index)];
    return withChildren(current, next);
  }) as ContainerNode;
}

export function removeNodes(root: ContainerNode, ids: string[]): ContainerNode {
  const idSet = new Set(ids);
  if (idSet.has(root.id)) {
    return root;
  }
  const prune = (node: StudioNode): StudioNode => {
    const children = getChildren(node);
    if (!children) {
      return node;
    }
    const kept = children
      .filter((child) => !idSet.has(child.id))
      .map((child) => prune(child));
    return withChildren(node, kept);
  };
  return prune(root) as ContainerNode;
}

/**
 * Move existing nodes to a new position. `target.index` is interpreted in
 * post-removal space — the child list as it looks once the moved nodes are
 * taken out (which is how the drop engine measures it). Rejects moves that
 * would create a cycle (dropping a node inside its own subtree).
 */
export function moveNodes(
  root: ContainerNode,
  ids: string[],
  target: DropTarget
): ContainerNode {
  for (const id of ids) {
    if (id === root.id || isDescendantOf(root, id, target.parentId)) {
      return root;
    }
  }

  const moving: StudioNode[] = [];
  for (const id of ids) {
    const node = findNode(root, id);
    if (node) {
      moving.push(node);
    }
  }
  if (moving.length === 0) {
    return root;
  }

  let next = removeNodes(root, ids);
  for (const [offset, node] of moving.entries()) {
    next = insertNode(next, node, {
      parentId: target.parentId,
      index: target.index + offset,
    });
  }
  return next;
}

export function cloneSubtree(node: StudioNode): StudioNode {
  const cloned: StudioNode = { ...node, id: createNodeId(node.kind) };
  const children = getChildren(cloned);
  if (children) {
    return withChildren(
      cloned,
      children.map((child) => cloneSubtree(child))
    );
  }
  return cloned;
}

export function duplicateNodes(
  root: ContainerNode,
  ids: string[]
): { tree: ContainerNode; newIds: string[] } {
  let tree = root;
  const newIds: string[] = [];
  for (const id of ids) {
    const location = findParent(tree, id);
    const node = findNode(tree, id);
    if (!(location && node)) {
      continue;
    }
    const copy = cloneSubtree(node);
    newIds.push(copy.id);
    tree = insertNode(tree, copy, {
      parentId: location.parent.id,
      index: location.index + 1,
    });
  }
  return { tree, newIds };
}

/**
 * Wrap sibling nodes in a new flex container. Nodes must share a parent; the
 * wrapper takes the position of the first wrapped node.
 */
export function wrapInContainer(
  root: ContainerNode,
  ids: string[]
): { tree: ContainerNode; wrapperId: string | null } {
  if (ids.length === 0 || ids.includes(root.id)) {
    return { tree: root, wrapperId: null };
  }
  const locations = ids.map((id) => findParent(root, id));
  if (locations.some((loc) => loc === null)) {
    return { tree: root, wrapperId: null };
  }
  const parentId = (locations[0] as { parent: StudioNode }).parent.id;
  if (
    locations.some(
      (loc) => (loc as { parent: StudioNode }).parent.id !== parentId
    )
  ) {
    return { tree: root, wrapperId: null };
  }

  const parent = findNode(root, parentId);
  const siblings = parent ? (getChildren(parent) ?? []) : [];
  const ordered = siblings.filter((child) => ids.includes(child.id));
  const firstIndex = siblings.findIndex((child) => ids.includes(child.id));

  const wrapper = createContainer({
    layout: {
      mode: "flex",
      direction: ordered.length > 1 ? "row" : "column",
      wrap: false,
      gap: 16,
      padding: 0,
      align: ordered.length > 1 ? "center" : "stretch",
      justify: "start",
      columns: 2,
    },
    children: ordered,
  });

  let tree = removeNodes(root, ids);
  tree = insertNode(tree, wrapper, { parentId, index: firstIndex });
  return { tree, wrapperId: wrapper.id };
}

/** Reorder a node one step among its siblings. */
export function shiftNode(
  root: ContainerNode,
  id: string,
  delta: -1 | 1
): ContainerNode {
  const location = findParent(root, id);
  if (!location) {
    return root;
  }
  const siblings = getChildren(location.parent) ?? [];
  const nextIndex = location.index + delta;
  if (nextIndex < 0 || nextIndex >= siblings.length) {
    return root;
  }
  // moveNodes indices are post-removal, where nextIndex works both ways.
  return moveNodes(root, [id], {
    parentId: location.parent.id,
    index: nextIndex,
  });
}

export function countNodes(node: StudioNode): number {
  const children = getChildren(node);
  if (!children) {
    return 1;
  }
  return 1 + children.reduce((sum, child) => sum + countNodes(child), 0);
}

/** Every component registry key used in the tree (for CLI install command). */
export function collectComponents(node: StudioNode, into = new Set<string>()) {
  if (node.kind === "component") {
    into.add(node.component);
  }
  const children = getChildren(node);
  if (children) {
    for (const child of children) {
      collectComponents(child, into);
    }
  }
  return into;
}

export function isComponentNode(node: StudioNode): node is ComponentNode {
  return node.kind === "component";
}

export function isContainerNode(node: StudioNode): node is ContainerNode {
  return node.kind === "container";
}
