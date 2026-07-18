"use client";

import {
  Bold,
  Copy,
  Italic,
  Link,
  Strikethrough,
  Underline,
} from "lucide-react";
import * as React from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export const selectionToolbarStyles = {
  controlCornerClassName:
    "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]",
  toolbarShellClassName:
    "z-50 flex items-center gap-1 bg-neutral-800 px-2 py-1.5 text-neutral-200 shadow-xl ring-1 ring-black/20",
  toolbarButtonClassName: cn(
    "group/btn relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden text-neutral-200",
    "transition-[transform,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "hover:scale-[1.06] hover:bg-neutral-700 hover:text-white",
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_18px_-10px_rgba(0,0,0,0.55)]",
    "active:scale-[0.96] active:duration-150 active:ease-[cubic-bezier(0.34,1.2,0.64,1)]",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:shadow-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-800",
    "motion-reduce:transition-colors motion-reduce:active:scale-100 motion-reduce:hover:scale-100"
  ),
  toolbarButtonIconClassName:
    "inline-flex transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:scale-110 group-active/btn:scale-[0.96] motion-reduce:transform-none",
} as const;

const VIEWPORT_MARGIN = 8;
const DEFAULT_OFFSET = 10;
const ESTIMATED_TOOLBAR_WIDTH = 132;
const ESTIMATED_TOOLBAR_HEIGHT = 44;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export type SelectionToolbarCommand =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "createLink"
  | "copy";

export type SelectionToolbarItem = {
  command?: SelectionToolbarCommand;
  disabled?: boolean;
  icon?: React.ReactNode;
  id: string;
  label: string;
  onAction?: () => boolean | undefined;
};

export interface SelectionToolbarProps {
  "aria-controls"?: string;
  className?: string;
  children?: React.ReactNode;
  containerRef: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
  items?: SelectionToolbarItem[];
  offset?: number;
  onCommand?: (command: SelectionToolbarCommand) => void;
  portalContainer?: HTMLElement | null;
  side?: "auto" | "bottom" | "top";
  zIndex?: number;
}

type ToolbarPlacement = {
  anchorY: number;
  placement: "above" | "below";
  x: number;
};

type ActiveState = Record<
  "bold" | "italic" | "strikeThrough" | "underline",
  boolean
>;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

function useObservedContainer(
  containerRef: React.RefObject<HTMLElement | null>
) {
  const [container, setContainer] = useState<HTMLElement | null>(
    () => containerRef.current
  );

  useLayoutEffect(() => {
    let active = true;
    let frame = 0;

    const sync = () => {
      if (!active) {
        return;
      }

      const next = containerRef.current;
      setContainer((current) => (current === next ? current : next));

      if (!next) {
        frame = requestAnimationFrame(sync);
      }
    };

    sync();

    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [containerRef]);

  return container;
}

export function getDefaultSelectionToolbarItems(): SelectionToolbarItem[] {
  return [
    {
      command: "bold",
      icon: <Bold className="h-4 w-4" strokeWidth={2.5} />,
      id: "bold",
      label: "Bold",
    },
    {
      command: "italic",
      icon: <Italic className="h-4 w-4" strokeWidth={2.5} />,
      id: "italic",
      label: "Italic",
    },
    {
      command: "underline",
      icon: <Underline className="h-4 w-4" strokeWidth={2.5} />,
      id: "underline",
      label: "Underline",
    },
  ];
}

function readActiveState(): ActiveState {
  return {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    strikeThrough: document.queryCommandState("strikeThrough"),
    underline: document.queryCommandState("underline"),
  };
}

function getSelectedText() {
  const selection = window.getSelection();
  return selection?.toString() ?? "";
}

function resolveToolbarPlacement({
  offset,
  rect,
  side,
  toolbarHeight,
}: {
  offset: number;
  rect: DOMRect;
  side: NonNullable<SelectionToolbarProps["side"]>;
  toolbarHeight: number;
}): Pick<ToolbarPlacement, "anchorY" | "placement"> {
  const viewportHeight = window.innerHeight;
  const spaceAbove = rect.top - VIEWPORT_MARGIN;
  const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_MARGIN;
  const requiredHeight = toolbarHeight + offset;

  if (side === "bottom") {
    if (spaceBelow >= requiredHeight || spaceBelow >= spaceAbove) {
      return { anchorY: rect.bottom, placement: "below" };
    }

    return { anchorY: rect.top, placement: "above" };
  }

  if (side === "top") {
    if (spaceAbove >= requiredHeight || spaceAbove >= spaceBelow) {
      return { anchorY: rect.top, placement: "above" };
    }

    return { anchorY: rect.bottom, placement: "below" };
  }

  if (spaceAbove >= requiredHeight || spaceAbove >= spaceBelow) {
    return { anchorY: rect.top, placement: "above" };
  }

  return { anchorY: rect.bottom, placement: "below" };
}

function computeToolbarPlacement({
  offset,
  rect,
  side,
  toolbarHeight,
  toolbarWidth,
}: {
  offset: number;
  rect: DOMRect;
  side: NonNullable<SelectionToolbarProps["side"]>;
  toolbarHeight: number;
  toolbarWidth: number;
}): ToolbarPlacement {
  const viewportWidth = window.innerWidth;
  const halfWidth = toolbarWidth / 2;
  const x = clamp(
    rect.left + rect.width / 2,
    VIEWPORT_MARGIN + halfWidth,
    Math.max(
      VIEWPORT_MARGIN + halfWidth,
      viewportWidth - halfWidth - VIEWPORT_MARGIN
    )
  );
  const { anchorY, placement } = resolveToolbarPlacement({
    offset,
    rect,
    side,
    toolbarHeight,
  });

  return { anchorY, placement, x };
}

function promptForLinkUrl(defaultValue: string) {
  // Native prompt keeps the zero-dependency link flow for contentEditable surfaces.
  // biome-ignore lint/suspicious/noAlert: lightweight registry default for inline link editing
  return window.prompt("Enter link URL", defaultValue);
}

function runNativeCommand(command: SelectionToolbarCommand) {
  if (command === "createLink") {
    const currentUrl = document.queryCommandValue("createLink");
    const nextUrl = promptForLinkUrl(currentUrl || "https://");

    if (nextUrl === null) {
      return false;
    }

    if (nextUrl.trim() === "") {
      document.execCommand("unlink");
      return true;
    }

    document.execCommand("createLink", false, nextUrl.trim());
    return true;
  }

  if (command === "copy") {
    const selectedText = getSelectedText();

    if (selectedText && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(selectedText).catch(() => undefined);
      return true;
    }

    return document.execCommand("copy");
  }

  return document.execCommand(command);
}

export function isSelectionToolbarCommandActive(
  command: SelectionToolbarCommand,
  active: ActiveState
) {
  if (command === "bold") {
    return active.bold;
  }

  if (command === "italic") {
    return active.italic;
  }

  if (command === "underline") {
    return active.underline;
  }

  if (command === "strikeThrough") {
    return active.strikeThrough;
  }

  return false;
}

export function getSelectionToolbarShortcutLabel(
  command: SelectionToolbarCommand
) {
  if (command === "bold") {
    return "Ctrl+B";
  }

  if (command === "italic") {
    return "Ctrl+I";
  }

  if (command === "underline") {
    return "Ctrl+U";
  }

  return undefined;
}

const FORMATTING_SHORTCUTS: Record<string, SelectionToolbarCommand> = {
  b: "bold",
  i: "italic",
  u: "underline",
};

function handleFormattingShortcutKeyDown({
  container,
  event,
  runCommand,
}: {
  container: HTMLElement;
  event: KeyboardEvent;
  runCommand: (command: SelectionToolbarCommand) => boolean;
}) {
  const selection = window.getSelection();
  const range =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  if (
    !(range && container.contains(range.commonAncestorContainer)) ||
    selection?.isCollapsed
  ) {
    return;
  }

  if (!(event.metaKey || event.ctrlKey)) {
    return;
  }

  const command = FORMATTING_SHORTCUTS[event.key.toLowerCase()];

  if (!command) {
    return;
  }

  event.preventDefault();
  runCommand(command);
}

export function useSelectionToolbar({
  "aria-controls": ariaControls,
  className,
  children,
  containerRef,
  disabled = false,
  items,
  offset = DEFAULT_OFFSET,
  onCommand,
  portalContainer = null,
  side = "auto",
  zIndex = 50,
}: SelectionToolbarProps) {
  const container = useObservedContainer(containerRef);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [placement, setPlacement] = useState<ToolbarPlacement | null>(null);
  const [active, setActive] = useState<ActiveState>({
    bold: false,
    italic: false,
    strikeThrough: false,
    underline: false,
  });
  const [focusedIndex, setFocusedIndex] = useState(0);
  const toolbarRef = useRef<HTMLElement | null>(null);
  const toolbarSizeRef = useRef({
    height: ESTIMATED_TOOLBAR_HEIGHT,
    width: ESTIMATED_TOOLBAR_WIDTH,
  });
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const resolvedItems = useMemo(
    () => items ?? getDefaultSelectionToolbarItems(),
    [items]
  );
  const visible = placement !== null && !disabled;

  const refreshToolbarSize = useCallback(() => {
    const node = toolbarRef.current;

    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      toolbarSizeRef.current = {
        height: rect.height,
        width: rect.width,
      };
    }
  }, []);

  const updateFromSelection = useCallback(() => {
    if (!container || disabled) {
      setPlacement(null);
      return;
    }

    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setPlacement(null);
      return;
    }

    const range = selection.getRangeAt(0);

    if (!container.contains(range.commonAncestorContainer)) {
      setPlacement(null);
      return;
    }

    const rect = range.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      setPlacement(null);
      return;
    }

    setPlacement(
      computeToolbarPlacement({
        offset,
        rect,
        side,
        toolbarHeight: toolbarSizeRef.current.height,
        toolbarWidth: toolbarSizeRef.current.width,
      })
    );
    setActive(readActiveState());
  }, [container, disabled, offset, side]);

  const runCommand = useCallback(
    (command: SelectionToolbarCommand) => {
      if (disabled) {
        return false;
      }

      const succeeded = runNativeCommand(command);

      if (succeeded) {
        onCommand?.(command);
        setActive(readActiveState());
        requestAnimationFrame(updateFromSelection);
      }

      return succeeded;
    },
    [disabled, onCommand, updateFromSelection]
  );

  const handleItemAction = useCallback(
    (item: SelectionToolbarItem) => {
      if (item.disabled || disabled) {
        return;
      }

      if (item.onAction) {
        const handled = item.onAction();

        if (handled !== false) {
          setActive(readActiveState());
          requestAnimationFrame(updateFromSelection);
        }

        return;
      }

      if (item.command) {
        runCommand(item.command);
      }
    },
    [disabled, runCommand, updateFromSelection]
  );

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!container || disabled) {
      setPlacement(null);
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (toolbarRef.current?.contains(target)) {
        return;
      }

      if (container.contains(target)) {
        return;
      }

      setPlacement(null);
    };

    document.addEventListener("selectionchange", updateFromSelection);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("scroll", updateFromSelection, true);
    window.addEventListener("resize", updateFromSelection);

    return () => {
      document.removeEventListener("selectionchange", updateFromSelection);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("scroll", updateFromSelection, true);
      window.removeEventListener("resize", updateFromSelection);
    };
  }, [container, disabled, updateFromSelection]);

  useLayoutEffect(() => {
    if (!visible) {
      return;
    }

    refreshToolbarSize();
    updateFromSelection();
  }, [refreshToolbarSize, updateFromSelection, visible]);

  useEffect(() => {
    if (!visible || disabled || !container) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      handleFormattingShortcutKeyDown({
        container,
        event,
        runCommand,
      });
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [container, disabled, runCommand, visible]);

  useEffect(() => {
    if (!visible) {
      setFocusedIndex(0);
    }
  }, [visible]);

  const handleToolbarKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const itemCount = resolvedItems.length;

    if (itemCount === 0) {
      return;
    }

    const lastIndex = itemCount - 1;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = focusedIndex >= lastIndex ? 0 : focusedIndex + 1;
      setFocusedIndex(nextIndex);
      buttonRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = focusedIndex <= 0 ? lastIndex : focusedIndex - 1;
      setFocusedIndex(nextIndex);
      buttonRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setFocusedIndex(0);
      buttonRefs.current[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setFocusedIndex(lastIndex);
      buttonRefs.current[lastIndex]?.focus();
    }
  };

  const transform =
    placement?.placement === "below"
      ? `translate(-50%, ${offset}px)`
      : `translate(-50%, calc(-100% - ${offset}px))`;

  const transition = prefersReducedMotion
    ? "opacity 120ms linear"
    : "opacity 150ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1)";

  const portalTarget =
    portalContainer ?? (typeof document === "undefined" ? null : document.body);

  const toolbarStyle: React.CSSProperties = {
    left: placement?.x ?? 0,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? "auto" : "none",
    position: "fixed",
    top: placement?.anchorY ?? 0,
    transform: `${transform} scale(${visible ? 1 : prefersReducedMotion ? 1 : 0.96})`,
    transition,
    zIndex,
  };

  const shellClassName = cn(
    selectionToolbarStyles.toolbarShellClassName,
    selectionToolbarStyles.controlCornerClassName,
    className
  );

  return {
    active,
    ariaControls,
    buttonRefs,
    children,
    disabled,
    focusedIndex,
    handleItemAction,
    handleToolbarKeyDown,
    mounted,
    portalTarget,
    prefersReducedMotion,
    resolvedItems,
    setToolbarNode: (node: HTMLElement | null) => {
      toolbarRef.current = node;
    },
    shellClassName,
    toolbarStyle,
    visible,
  };
}

export type SelectionToolbarController = ReturnType<typeof useSelectionToolbar>;

export const SelectionToolbarPresets = {
  copy: {
    command: "copy" as const,
    icon: <Copy className="h-4 w-4" strokeWidth={2.5} />,
    id: "copy",
    label: "Copy",
  },
  link: {
    command: "createLink" as const,
    icon: <Link className="h-4 w-4" strokeWidth={2.5} />,
    id: "link",
    label: "Link",
  },
  strikeThrough: {
    command: "strikeThrough" as const,
    icon: <Strikethrough className="h-4 w-4" strokeWidth={2.5} />,
    id: "strikeThrough",
    label: "Strikethrough",
  },
};

export function getSelectionToolbarButtonClassName({
  active = false,
  className,
}: {
  active?: boolean;
  className?: string;
} = {}) {
  return cn(
    selectionToolbarStyles.toolbarButtonClassName,
    selectionToolbarStyles.controlCornerClassName,
    active &&
      "scale-100 bg-neutral-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-neutral-600",
    className
  );
}

type ToolbarButtonProps = {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  shortcut?: string;
  tabIndex?: number;
};

export const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(function ToolbarButton(
  {
    active = false,
    children,
    className,
    disabled = false,
    label,
    onMouseDown,
    shortcut,
    tabIndex = -1,
  },
  ref
) {
  return (
    <button
      aria-keyshortcuts={shortcut}
      aria-label={shortcut ? `${label} (${shortcut})` : label}
      aria-pressed={active}
      className={getSelectionToolbarButtonClassName({ active, className })}
      disabled={disabled}
      onMouseDown={onMouseDown}
      ref={ref}
      tabIndex={tabIndex}
      title={shortcut ? `${label} (${shortcut})` : label}
      type="button"
    >
      <span className={selectionToolbarStyles.toolbarButtonIconClassName}>
        {children}
      </span>
    </button>
  );
});

ToolbarButton.displayName = "ToolbarButton";

export function SelectionToolbar(props: SelectionToolbarProps) {
  const toolbar = useSelectionToolbar(props);

  if (!(toolbar.mounted && toolbar.portalTarget)) {
    return null;
  }

  return createPortal(
    <div
      aria-controls={toolbar.ariaControls}
      aria-hidden={!toolbar.visible}
      aria-label="Text formatting"
      className={toolbar.shellClassName}
      onKeyDown={toolbar.handleToolbarKeyDown}
      onMouseDown={(event) => event.preventDefault()}
      ref={toolbar.setToolbarNode}
      role="toolbar"
      style={toolbar.toolbarStyle}
    >
      {toolbar.resolvedItems.map((item, index) => (
        <ToolbarButton
          active={
            item.command
              ? isSelectionToolbarCommandActive(item.command, toolbar.active)
              : false
          }
          disabled={toolbar.disabled || item.disabled}
          key={item.id}
          label={item.label}
          onMouseDown={(event) => {
            event.preventDefault();
            toolbar.handleItemAction(item);
          }}
          ref={(node) => {
            toolbar.buttonRefs.current[index] = node;
          }}
          shortcut={
            item.command
              ? getSelectionToolbarShortcutLabel(item.command)
              : undefined
          }
          tabIndex={toolbar.focusedIndex === index ? 0 : -1}
        >
          {item.icon}
        </ToolbarButton>
      ))}
      {toolbar.children}
    </div>,
    toolbar.portalTarget
  );
}

SelectionToolbar.displayName = "SelectionToolbar";
