/**
 * Iconiq Studio code exporter.
 *
 * Generates handwritten-looking React + Tailwind from the studio tree — the
 * JSX printer works on a tiny element model, never the DOM. No inline styles,
 * no absolute coordinates, default prop values omitted.
 */

import {
  baseNodeClasses,
  containerClasses,
  dedupeClasses,
  textClasses,
} from "./tailwind";
import { collectComponents, getChildren } from "./tree";
import type { ContainerNode, StudioNode, StudioProject } from "./types";

/* ------------------------------------------------------------------ */
/* JSX element model                                                   */
/* ------------------------------------------------------------------ */

/** A raw JS expression rendered inside `{}` — e.g. array literals. */
export type JsxExpr = { expr: string };

export type JsxPropValue = string | number | boolean | JsxExpr;

export type JsxElement = {
  tag: string;
  props?: Record<string, JsxPropValue | undefined>;
  children?: Array<JsxElement | string>;
};

export type ImportSpec = {
  names: string[];
  path: string;
};

export function expr(value: string): JsxExpr {
  return { expr: value };
}

/** Serialize a plain JS value into readable source (multi-line for arrays). */
export function serializeValue(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  const padInner = "  ".repeat(indent + 1);

  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    const items = value.map(
      (item) => `${padInner}${serializeValue(item, indent + 1)}`
    );
    return `[\n${items.join(",\n")},\n${pad}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== undefined
    );
    if (entries.length === 0) {
      return "{}";
    }
    const fields = entries.map(
      ([key, v]) => `${key}: ${serializeValue(v, indent)}`
    );
    return `{ ${fields.join(", ")} }`;
  }
  return "null";
}

/* ------------------------------------------------------------------ */
/* Printer                                                             */
/* ------------------------------------------------------------------ */

const MAX_INLINE_WIDTH = 78;

function escapeJsxText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

function printPropValue(value: JsxPropValue): string {
  if (typeof value === "string") {
    return `"${value.replace(/"/g, "&quot;")}"`;
  }
  if (typeof value === "boolean") {
    return value ? "" : "{false}";
  }
  if (typeof value === "number") {
    return `{${value}}`;
  }
  return `{${value.expr}}`;
}

function printProp(name: string, value: JsxPropValue): string {
  if (value === true) {
    return name;
  }
  return `${name}=${printPropValue(value)}`;
}

function sortedProps(
  props: Record<string, JsxPropValue | undefined>
): [string, JsxPropValue][] {
  return Object.entries(props)
    .filter((entry): entry is [string, JsxPropValue] => entry[1] !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
}

function reindentExpression(printed: string, pad: string): string {
  if (!printed.includes("\n")) {
    return printed;
  }
  return printed
    .split("\n")
    .map((line, index) => (index === 0 ? line : `${pad}${line}`))
    .join("\n");
}

export function printJsx(element: JsxElement, indent = 0): string {
  const pad = "  ".repeat(indent);
  const props = sortedProps(element.props ?? {});
  const children = (element.children ?? []).filter(
    (child) => typeof child !== "string" || child.length > 0
  );

  const inlineProps = props
    .map(([name, value]) => printProp(name, value))
    .join(" ");
  const openInline = inlineProps
    ? `<${element.tag} ${inlineProps}`
    : `<${element.tag}`;
  const fitsInline =
    pad.length + openInline.length + 4 <= MAX_INLINE_WIDTH &&
    !openInline.includes("\n");

  let openTag: string;
  if (fitsInline) {
    openTag = children.length > 0 ? `${openInline}>` : `${openInline} />`;
  } else {
    const propLines = props
      .map(
        ([name, value]) =>
          `${pad}  ${reindentExpression(printProp(name, value), `${pad}  `)}`
      )
      .join("\n");
    const close = children.length > 0 ? `${pad}>` : `${pad}/>`;
    openTag = `<${element.tag}\n${propLines}\n${close}`;
  }

  if (children.length === 0) {
    return `${pad}${openTag}`;
  }

  // A single short text child stays on one line.
  if (
    children.length === 1 &&
    typeof children[0] === "string" &&
    fitsInline &&
    pad.length + openTag.length + children[0].length + element.tag.length + 3 <=
      MAX_INLINE_WIDTH
  ) {
    return `${pad}${openTag}${escapeJsxText(children[0])}</${element.tag}>`;
  }

  const childLines = children
    .map((child) =>
      typeof child === "string"
        ? `${pad}  ${escapeJsxText(child)}`
        : printJsx(child, indent + 1)
    )
    .join("\n");

  return `${pad}${openTag}\n${childLines}\n${pad}</${element.tag}>`;
}

/* ------------------------------------------------------------------ */
/* Tree → JSX                                                          */
/* ------------------------------------------------------------------ */

export type ComponentEmitter = (
  node: StudioNode & { kind: "component" },
  children: Array<JsxElement | string>
) => JsxElement;

export type CodegenRegistry = {
  emit: Record<string, ComponentEmitter>;
  imports: Record<string, ImportSpec[]>;
  /** Registry keys that are installable via the Iconiq CLI. */
  cliNames: Record<string, string | null>;
};

export function classNameProp(classes: string[]): string | undefined {
  const deduped = dedupeClasses(classes.filter(Boolean));
  return deduped.length > 0 ? deduped.join(" ") : undefined;
}

function mergeBaseClasses(element: JsxElement, node: StudioNode): JsxElement {
  const base = baseNodeClasses(node);
  if (base.length === 0) {
    return element;
  }
  const existing =
    typeof element.props?.className === "string"
      ? element.props.className.split(" ")
      : [];
  return {
    ...element,
    props: {
      ...element.props,
      className: classNameProp([...existing, ...base]),
    },
  };
}

export function emitNode(
  node: StudioNode,
  registry: CodegenRegistry
): JsxElement | null {
  if (node.hidden) {
    return null;
  }

  if (node.kind === "text") {
    return {
      tag: node.tag,
      props: { className: classNameProp(textClasses(node)) },
      children: node.text ? [node.text] : [],
    };
  }

  if (node.kind === "container") {
    const children = node.children
      .map((child) => emitNode(child, registry))
      .filter((child): child is JsxElement => child !== null);
    return {
      tag: "div",
      props: { className: classNameProp(containerClasses(node)) },
      children,
    };
  }

  const emitter = registry.emit[node.component];
  if (!emitter) {
    return null;
  }
  const children = (node.children ?? [])
    .map((child) => emitNode(child, registry))
    .filter((child): child is JsxElement => child !== null);
  return mergeBaseClasses(emitter(node, children), node);
}

/* ------------------------------------------------------------------ */
/* Full file generation                                                */
/* ------------------------------------------------------------------ */

function collectImports(
  root: ContainerNode,
  registry: CodegenRegistry
): ImportSpec[] {
  const byPath = new Map<string, Set<string>>();
  const visit = (node: StudioNode) => {
    if (node.kind === "component" && !node.hidden) {
      for (const spec of registry.imports[node.component] ?? []) {
        const names = byPath.get(spec.path) ?? new Set<string>();
        for (const name of spec.names) {
          names.add(name);
        }
        byPath.set(spec.path, names);
      }
    }
    const children = getChildren(node);
    if (children) {
      for (const child of children) {
        visit(child);
      }
    }
  };
  visit(root);

  return [...byPath.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, names]) => ({ path, names: [...names].sort() }));
}

const NON_IDENTIFIER_REGEX = /[^a-zA-Z0-9\s\-_]/g;
const WORD_SEPARATOR_REGEX = /[\s\-_]+/;

function toPascalCase(name: string): string {
  const cleaned = name
    .replace(NON_IDENTIFIER_REGEX, "")
    .split(WORD_SEPARATOR_REGEX)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
  return cleaned || "GeneratedSection";
}

export type GeneratedOutput = {
  code: string;
  installCommand: string | null;
  usedComponents: string[];
};

export function generateCode(
  project: StudioProject,
  registry: CodegenRegistry
): GeneratedOutput {
  const rootElement = emitNode(project.root, registry) ?? {
    tag: "div",
    children: [],
  };
  const imports = collectImports(project.root, registry);
  const componentName = toPascalCase(project.name);

  const lines: string[] = [];
  if (imports.length > 0) {
    for (const spec of imports) {
      lines.push(`import { ${spec.names.join(", ")} } from "${spec.path}";`);
    }
    lines.push("");
  }
  lines.push(`export function ${componentName}() {`);
  lines.push("  return (");
  lines.push(printJsx(rootElement, 2));
  lines.push("  );");
  lines.push("}");
  lines.push("");

  const used = [...collectComponents(project.root)]
    .map((key) => registry.cliNames[key])
    .filter((name): name is string => Boolean(name))
    .sort();
  const installCommand =
    used.length > 0 ? `npx iconiq add ${[...new Set(used)].join(" ")}` : null;

  return {
    code: lines.join("\n"),
    installCommand,
    usedComponents: [...new Set(used)],
  };
}
