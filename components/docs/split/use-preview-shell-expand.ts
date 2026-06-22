"use client";

import * as React from "react";

const PREVIEW_EXPAND_MS = 420;
const PREVIEW_EXPAND_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

type PreviewRect = { top: number; left: number; width: number; height: number };

function toPreviewRect(rect: DOMRect | PreviewRect): PreviewRect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function getPreviewPadding(isMobile: boolean) {
  return {
    full: isMobile ? "0px" : "12px",
    split: isMobile ? "16px" : "12px 12px 12px 6px",
  };
}

function getCollapsedTargetRect(
  layout: Element,
  isMobile: boolean
): PreviewRect | null {
  const rightColumn = layout.querySelector<HTMLElement>(
    "[data-docs-right-column]"
  );
  const col = rightColumn?.getBoundingClientRect();

  if (!col) {
    return null;
  }

  if (isMobile) {
    return {
      top: col.top,
      left: col.left,
      width: col.width,
      height: Math.min(col.height, window.innerHeight * 0.55),
    };
  }

  return {
    top: col.top + 12,
    left: col.left + 6,
    width: col.width - 18,
    height: col.height - 24,
  };
}

function applyFixedRect(
  previewShell: HTMLElement,
  rect: PreviewRect,
  padding: string
) {
  previewShell.style.position = "fixed";
  previewShell.style.top = `${rect.top}px`;
  previewShell.style.left = `${rect.left}px`;
  previewShell.style.width = `${rect.width}px`;
  previewShell.style.height = `${rect.height}px`;
  previewShell.style.zIndex = "60";
  previewShell.style.padding = padding;
  previewShell.classList.add("bg-white", "dark:bg-[#080808]");
}

function clearFixedStyles(
  previewShell: HTMLElement,
  cacheSplitPreviewRect: () => void
) {
  delete previewShell.dataset.previewExpanded;

  for (const prop of [
    "position",
    "top",
    "left",
    "width",
    "height",
    "zIndex",
    "padding",
    "transition",
  ] as const) {
    previewShell.style.removeProperty(prop);
  }

  previewShell.classList.remove("bg-white", "dark:bg-[#080808]");
  cacheSplitPreviewRect();
}

function expandPreviewShell(
  previewShell: HTMLElement,
  splitPadding: string,
  fullPadding: string,
  transition: string,
  splitPreviewRectRef: React.MutableRefObject<PreviewRect | null>
) {
  const from = toPreviewRect(previewShell.getBoundingClientRect());
  splitPreviewRectRef.current = from;

  applyFixedRect(previewShell, from, splitPadding);
  previewShell.getBoundingClientRect();

  previewShell.style.transition = transition;
  requestAnimationFrame(() => {
    applyFixedRect(
      previewShell,
      {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      fullPadding
    );
    previewShell.dataset.previewExpanded = "true";
  });
}

function collapsePreviewShell(
  previewShell: HTMLElement,
  layout: Element,
  isMobile: boolean,
  splitPadding: string,
  transition: string,
  splitPreviewRectRef: React.MutableRefObject<PreviewRect | null>,
  cacheSplitPreviewRect: () => void
) {
  const target =
    getCollapsedTargetRect(layout, isMobile) ?? splitPreviewRectRef.current;

  if (!target) {
    clearFixedStyles(previewShell, cacheSplitPreviewRect);
    return undefined;
  }

  previewShell.style.transition = transition;
  requestAnimationFrame(() => {
    applyFixedRect(previewShell, target, splitPadding);
  });

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== previewShell || event.propertyName !== "width") {
      return;
    }

    clearFixedStyles(previewShell, cacheSplitPreviewRect);
  };

  previewShell.addEventListener("transitionend", onTransitionEnd);
  return onTransitionEnd;
}

export function usePreviewShellExpand({
  isExpanded,
  previewRef,
  cacheSplitPreviewRect,
  splitPreviewRectRef,
}: {
  isExpanded: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  cacheSplitPreviewRect: () => void;
  splitPreviewRectRef: React.MutableRefObject<PreviewRect | null>;
}) {
  React.useEffect(() => {
    const layout = previewRef.current?.closest("[data-docs-layout]");
    const previewShell = layout?.querySelector<HTMLElement>(
      "[data-docs-preview-shell]"
    );

    if (!previewShell) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const { full: fullPadding, split: splitPadding } =
      getPreviewPadding(isMobile);
    const transition = `top ${PREVIEW_EXPAND_MS}ms ${PREVIEW_EXPAND_EASING}, left ${PREVIEW_EXPAND_MS}ms ${PREVIEW_EXPAND_EASING}, width ${PREVIEW_EXPAND_MS}ms ${PREVIEW_EXPAND_EASING}, height ${PREVIEW_EXPAND_MS}ms ${PREVIEW_EXPAND_EASING}, padding ${PREVIEW_EXPAND_MS}ms ${PREVIEW_EXPAND_EASING}`;

    let onTransitionEnd: ((event: TransitionEvent) => void) | undefined;

    if (isExpanded) {
      expandPreviewShell(
        previewShell,
        splitPadding,
        fullPadding,
        transition,
        splitPreviewRectRef
      );
    } else if (previewShell.style.position === "fixed" && layout) {
      onTransitionEnd = collapsePreviewShell(
        previewShell,
        layout,
        isMobile,
        splitPadding,
        transition,
        splitPreviewRectRef,
        cacheSplitPreviewRect
      );
    } else {
      clearFixedStyles(previewShell, cacheSplitPreviewRect);
    }

    return () => {
      if (onTransitionEnd) {
        previewShell.removeEventListener("transitionend", onTransitionEnd);
      }
    };
  }, [cacheSplitPreviewRect, isExpanded, previewRef, splitPreviewRectRef]);
}

export type { PreviewRect };

export function createPreviewRect(rect: DOMRect | PreviewRect): PreviewRect {
  return toPreviewRect(rect);
}
