/**
 * Semantic → Tailwind mapping used by both the canvas renderer and the code
 * exporter, so what you see on canvas is exactly the class list you export.
 *
 * Spacing is snapped to the Tailwind scale; arbitrary values are only emitted
 * when no utility exists (fixed widths that fall off the scale).
 */

import type { ContainerNode, NodeSize, StudioNode, TextNode } from "./types";

const WHITESPACE_REGEX = /\s+/;

/** Tailwind spacing scale (px → suffix). Kept in ascending px order. */
const SPACING_SCALE: [number, string][] = [
  [0, "0"],
  [2, "0.5"],
  [4, "1"],
  [6, "1.5"],
  [8, "2"],
  [10, "2.5"],
  [12, "3"],
  [14, "3.5"],
  [16, "4"],
  [20, "5"],
  [24, "6"],
  [28, "7"],
  [32, "8"],
  [36, "9"],
  [40, "10"],
  [44, "11"],
  [48, "12"],
  [56, "14"],
  [64, "16"],
  [80, "20"],
  [96, "24"],
];

export const SPACING_OPTIONS = SPACING_SCALE.map(([px]) => px);

/** Snap an arbitrary px value to the nearest step on the Tailwind scale. */
export function snapSpacing(px: number): number {
  let best = SPACING_SCALE[0][0];
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const [value] of SPACING_SCALE) {
    const distance = Math.abs(value - px);
    if (distance < bestDistance) {
      best = value;
      bestDistance = distance;
    }
  }
  return best;
}

export function spacingClass(prefix: string, px: number): string | null {
  if (px <= 0) {
    return null;
  }
  const entry = SPACING_SCALE.find(([value]) => value === px);
  const suffix = entry ? entry[1] : `[${px}px]`;
  return `${prefix}-${suffix}`;
}

const WIDTH_SCALE: Record<number, string> = {
  16: "w-4",
  24: "w-6",
  32: "w-8",
  40: "w-10",
  48: "w-12",
  64: "w-16",
  80: "w-20",
  96: "w-24",
  128: "w-32",
  160: "w-40",
  192: "w-48",
  224: "w-56",
  256: "w-64",
  288: "w-72",
  320: "w-80",
  384: "w-96",
};

function sizeClass(axis: "w" | "h", size: NodeSize | undefined): string | null {
  if (!size || size.mode === "auto") {
    return null;
  }
  if (size.mode === "full") {
    return `${axis}-full`;
  }
  const px = size.value ?? 0;
  if (px <= 0) {
    return null;
  }
  if (axis === "w" && WIDTH_SCALE[px]) {
    return WIDTH_SCALE[px];
  }
  const scaled = SPACING_SCALE.find(([value]) => value === px);
  if (scaled) {
    return `${axis}-${scaled[1]}`;
  }
  return `${axis}-[${px}px]`;
}

const ALIGN_CLASSES: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const JUSTIFY_CLASSES: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const BACKGROUND_CLASSES: Record<string, string | null> = {
  none: null,
  background: "bg-background",
  card: "bg-card",
  muted: "bg-muted",
  accent: "bg-accent",
};

const RADIUS_CLASSES: Record<string, string | null> = {
  none: null,
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const SHADOW_CLASSES: Record<string, string | null> = {
  none: null,
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

const MAX_WIDTH_SCALE: Record<number, string> = {
  384: "max-w-sm",
  448: "max-w-md",
  512: "max-w-lg",
  576: "max-w-xl",
  672: "max-w-2xl",
  768: "max-w-3xl",
  896: "max-w-4xl",
  1024: "max-w-5xl",
  1152: "max-w-6xl",
};

export const MAX_WIDTH_OPTIONS = [
  0, 384, 448, 512, 576, 672, 768, 896, 1024, 1152,
];

function pushClass(list: string[], value: string | null | undefined) {
  if (value) {
    list.push(value);
  }
}

/** Classes shared by every node kind (size, margin, custom). */
export function baseNodeClasses(node: StudioNode): string[] {
  const classes: string[] = [];
  pushClass(classes, sizeClass("w", node.width));
  pushClass(classes, sizeClass("h", node.height));
  pushClass(classes, spacingClass("m", node.margin ?? 0));
  if (node.customClasses) {
    classes.push(...node.customClasses.split(WHITESPACE_REGEX).filter(Boolean));
  }
  return classes;
}

/** The complete, export-ready class list for a container node. */
export function containerClasses(node: ContainerNode): string[] {
  const { layout, style } = node;
  const classes: string[] = [];

  if (layout.mode === "grid") {
    classes.push("grid", `grid-cols-${Math.max(1, layout.columns)}`);
  } else {
    classes.push("flex");
    if (layout.direction === "column") {
      classes.push("flex-col");
    }
    if (layout.wrap) {
      classes.push("flex-wrap");
    }
    if (layout.align !== "stretch") {
      pushClass(classes, ALIGN_CLASSES[layout.align]);
    }
    if (layout.justify !== "start") {
      pushClass(classes, JUSTIFY_CLASSES[layout.justify]);
    }
  }

  pushClass(classes, spacingClass("gap", layout.gap));
  pushClass(classes, spacingClass("p", layout.padding));
  pushClass(classes, BACKGROUND_CLASSES[style.background]);
  pushClass(classes, RADIUS_CLASSES[style.radius]);
  if (style.border) {
    classes.push("border", "border-border");
  }
  pushClass(classes, SHADOW_CLASSES[style.shadow]);
  if (style.maxWidth > 0) {
    classes.push(
      MAX_WIDTH_SCALE[style.maxWidth] ?? `max-w-[${style.maxWidth}px]`
    );
  }

  classes.push(...baseNodeClasses(node));
  return dedupeClasses(classes);
}

const TEXT_TAG_CLASSES: Record<TextNode["tag"], string> = {
  h1: "font-semibold text-4xl tracking-tight",
  h2: "font-semibold text-2xl tracking-tight",
  h3: "font-medium text-xl",
  h4: "font-medium text-lg",
  p: "text-base leading-7",
  span: "text-sm",
};

export function textClasses(node: TextNode): string[] {
  const classes = TEXT_TAG_CLASSES[node.tag].split(" ");
  if (node.muted) {
    classes.push("text-muted-foreground");
  }
  classes.push(...baseNodeClasses(node));
  return dedupeClasses(classes);
}

export function dedupeClasses(classes: string[]): string[] {
  return [...new Set(classes)];
}
