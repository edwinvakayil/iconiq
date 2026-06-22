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

const MIN_COLLAPSE_HEIGHT = 40;

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
    const height = Math.min(col.height, window.innerHeight * 0.55);

    // While expanded the shell is fixed, so the column often collapses to ~0.
    if (height < MIN_COLLAPSE_HEIGHT) {
      return null;
    }

    return {
      top: col.top,
      left: col.left,
      width: col.width,
      height,
    };
  }

  return {
    top: col.top + 12,
    left: col.left + 6,
    width: col.width - 18,
    height: col.height - 24,
  };
}

function resolveCollapseTarget(
  layout: Element,
  isMobile: boolean,
  splitPreviewRectRef: React.MutableRefObject<PreviewRect | null>
): PreviewRect | null {
  const cached = splitPreviewRectRef.current;
  const live = getCollapsedTargetRect(layout, isMobile);

  if (isMobile) {
    if (cached && cached.height >= MIN_COLLAPSE_HEIGHT) {
      return cached;
    }

    return live ?? cached;
  }

  return live ?? cached;
}

function reserveRightColumnSpace(previewShell: HTMLElement, height: number) {
  previewShell
    .closest<HTMLElement>("[data-docs-right-column]")
    ?.style.setProperty("min-height", `${height}px`);
}

function releaseRightColumnSpace(previewShell: HTMLElement) {
  previewShell
    .closest<HTMLElement>("[data-docs-right-column]")
    ?.style.removeProperty("min-height");
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
  releaseRightColumnSpace(previewShell);
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
  reserveRightColumnSpace(previewShell, from.height);

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
  const target = resolveCollapseTarget(layout, isMobile, splitPreviewRectRef);

  if (!target || target.height < MIN_COLLAPSE_HEIGHT) {
    clearFixedStyles(previewShell, cacheSplitPreviewRect);
    return undefined;
  }

  previewShell.style.transition = transition;
  requestAnimationFrame(() => {
    applyFixedRect(previewShell, target, splitPadding);
  });

  let finished = false;
  let timeoutId = 0;

  const finishCollapse = () => {
    if (finished) {
      return;
    }

    finished = true;
    window.clearTimeout(timeoutId);
    previewShell.removeEventListener("transitionend", onTransitionEnd);
    clearFixedStyles(previewShell, cacheSplitPreviewRect);
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== previewShell) {
      return;
    }

    if (event.propertyName !== "width" && event.propertyName !== "height") {
      return;
    }

    finishCollapse();
  };

  previewShell.addEventListener("transitionend", onTransitionEnd);
  timeoutId = window.setTimeout(finishCollapse, PREVIEW_EXPAND_MS + 80);

  return () => {
    window.clearTimeout(timeoutId);
    previewShell.removeEventListener("transitionend", onTransitionEnd);
  };
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

    let cleanupCollapse: (() => void) | undefined;

    if (isExpanded) {
      expandPreviewShell(
        previewShell,
        splitPadding,
        fullPadding,
        transition,
        splitPreviewRectRef
      );
    } else if (previewShell.style.position === "fixed" && layout) {
      cleanupCollapse = collapsePreviewShell(
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
      cleanupCollapse?.();
    };
  }, [cacheSplitPreviewRect, isExpanded, previewRef, splitPreviewRectRef]);
}

export type { PreviewRect };

export function createPreviewRect(rect: DOMRect | PreviewRect): PreviewRect {
  return toPreviewRect(rect);
}
