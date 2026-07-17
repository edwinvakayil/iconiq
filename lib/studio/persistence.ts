/**
 * Project save / load / import / export.
 *
 * Projects autosave to localStorage; the same serializer backs the JSON
 * import/export in the toolbar. Parsing is defensive — unknown node kinds are
 * dropped rather than crashing the editor.
 */

import { createContainer, createNodeId } from "./tree";
import type {
  ContainerNode,
  StudioNode,
  StudioProject,
  TextTag,
} from "./types";

export const STORAGE_KEY = "iconiq-studio-project-v1";

const TEXT_TAGS = new Set(["h1", "h2", "h3", "h4", "p", "span"]);

type SanitizedBase = Pick<StudioNode, "id"> &
  Partial<
    Pick<
      StudioNode,
      "name" | "hidden" | "customClasses" | "width" | "height" | "margin"
    >
  >;

function sanitizeBase(node: Record<string, unknown>): SanitizedBase {
  return {
    id: typeof node.id === "string" ? node.id : createNodeId(),
    ...(typeof node.name === "string" ? { name: node.name } : {}),
    ...(node.hidden === true ? { hidden: true } : {}),
    ...(typeof node.customClasses === "string"
      ? { customClasses: node.customClasses }
      : {}),
    ...(node.width && typeof node.width === "object"
      ? { width: node.width as StudioNode["width"] }
      : {}),
    ...(node.height && typeof node.height === "object"
      ? { height: node.height as StudioNode["height"] }
      : {}),
    ...(typeof node.margin === "number" ? { margin: node.margin } : {}),
  };
}

function sanitizeChildren(children: unknown): StudioNode[] {
  if (!Array.isArray(children)) {
    return [];
  }
  return children
    .map((child) => sanitizeNode(child))
    .filter((child): child is StudioNode => child !== null);
}

function sanitizeContainer(
  node: Record<string, unknown>,
  base: SanitizedBase
): StudioNode {
  const defaults = createContainer();
  return {
    ...base,
    kind: "container",
    layout: {
      ...defaults.layout,
      ...(node.layout && typeof node.layout === "object"
        ? (node.layout as ContainerNode["layout"])
        : {}),
    },
    style: {
      ...defaults.style,
      ...(node.style && typeof node.style === "object"
        ? (node.style as ContainerNode["style"])
        : {}),
    },
    children: sanitizeChildren(node.children),
  };
}

function sanitizeComponent(
  node: Record<string, unknown>,
  base: SanitizedBase
): StudioNode {
  return {
    ...base,
    kind: "component",
    component: node.component as string,
    props:
      node.props && typeof node.props === "object"
        ? (node.props as Record<string, unknown>)
        : {},
    ...(Array.isArray(node.children)
      ? { children: sanitizeChildren(node.children) }
      : {}),
  };
}

function sanitizeText(
  node: Record<string, unknown>,
  base: SanitizedBase
): StudioNode {
  const tag: TextTag =
    typeof node.tag === "string" && TEXT_TAGS.has(node.tag)
      ? (node.tag as TextTag)
      : "p";
  return {
    ...base,
    kind: "text",
    tag,
    text: typeof node.text === "string" ? node.text : "",
    muted: node.muted === true,
  };
}

function sanitizeNode(raw: unknown): StudioNode | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const node = raw as Record<string, unknown>;
  const base = sanitizeBase(node);

  if (node.kind === "container") {
    return sanitizeContainer(node, base);
  }
  if (node.kind === "component" && typeof node.component === "string") {
    return sanitizeComponent(node, base);
  }
  if (node.kind === "text") {
    return sanitizeText(node, base);
  }
  return null;
}

export function parseProject(json: string): StudioProject | null {
  try {
    const raw = JSON.parse(json) as Record<string, unknown>;
    if (!raw || typeof raw !== "object") {
      return null;
    }
    const root = sanitizeNode(raw.root);
    if (!root || root.kind !== "container") {
      return null;
    }
    return {
      version: 1,
      name: typeof raw.name === "string" && raw.name ? raw.name : "Untitled",
      root,
    };
  } catch {
    return null;
  }
}

export function serializeProject(project: StudioProject): string {
  return JSON.stringify(project, null, 2);
}

export function loadStoredProject(): StudioProject | null {
  if (typeof window === "undefined") {
    return null;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? parseProject(stored) : null;
}

export function storeProject(project: StudioProject): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeProject(project));
    return true;
  } catch {
    return false;
  }
}

export function clearStoredProject() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * First-run starter document showing off semantic composition.
 * Ids are deterministic so SSR and client hydration render the same tree.
 */
export function createDefaultProject(): StudioProject {
  const root: ContainerNode = {
    id: "root",
    kind: "container",
    layout: {
      mode: "flex",
      direction: "column",
      wrap: false,
      gap: 24,
      padding: 32,
      align: "stretch",
      justify: "start",
      columns: 2,
    },
    style: {
      background: "none",
      radius: "none",
      border: false,
      shadow: "none",
      maxWidth: 0,
    },
    children: [
      {
        id: "starter-heading",
        kind: "text",
        tag: "h2",
        text: "Welcome to Iconiq Studio",
        muted: false,
      },
      {
        id: "starter-copy",
        kind: "text",
        tag: "p",
        text: "Drag components from the left, tune them on the right, then export clean React + Tailwind.",
        muted: true,
      },
      {
        id: "starter-actions",
        kind: "container",
        layout: {
          mode: "flex",
          direction: "row",
          wrap: false,
          gap: 12,
          padding: 0,
          align: "center",
          justify: "start",
          columns: 2,
        },
        style: {
          background: "none",
          radius: "none",
          border: false,
          shadow: "none",
          maxWidth: 0,
        },
        children: [
          {
            id: "starter-primary",
            kind: "component",
            component: "button",
            props: {
              text: "Get started",
              variant: "default",
              size: "md",
              disabled: false,
            },
          },
          {
            id: "starter-secondary",
            kind: "component",
            component: "button",
            props: {
              text: "Learn more",
              variant: "outline",
              size: "md",
              disabled: false,
            },
          },
        ],
      },
    ],
  };

  return { version: 1, name: "Untitled", root };
}
