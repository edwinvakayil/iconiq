"use client";

import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const contextMenuThemeClassName =
  "[--cm-surface:#ffffff] [--cm-foreground:#111111] [--cm-border:#e3e7ec] [--cm-muted-foreground:#6d7480] [--cm-accent:#f3f5f8] [--color-accent:var(--cm-accent)] [--color-accent-foreground:var(--cm-accent-foreground)] [--cm-accent-foreground:#111111] [--cm-destructive:#dc2626] [--cm-ring:rgba(17,17,17,0.16)] dark:[--cm-surface:#111111] dark:[--cm-foreground:#f6f3ec] dark:[--cm-border:#2b2a25] dark:[--cm-muted-foreground:#9a958a] dark:[--cm-accent:#1a1a18] [--color-accent:var(--cm-accent)] [--color-accent-foreground:var(--cm-accent-foreground)] dark:[--cm-accent-foreground:#f6f3ec] dark:[--cm-destructive:#f87171] dark:[--cm-ring:rgba(246,243,236,0.18)]";

const contextMenuPanelClassName =
  "rounded-lg border border-[color:color-mix(in_oklch,var(--cm-border),transparent_40%)] bg-[color:var(--cm-surface)] p-1.5 text-[color:var(--cm-foreground)] shadow-2xl";

const contextMenuTriggerClassName =
  "outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--cm-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cm-surface)]";

const contextMenuItemHighlightClassName =
  "absolute inset-0 rounded-lg bg-[color:var(--cm-accent)]";

const contextMenuItemDefaultClassName =
  "text-[color:color-mix(in_oklch,var(--cm-foreground),transparent_15%)] hover:bg-accent/60";

const contextMenuItemDestructiveClassName =
  "text-[color:var(--cm-destructive)] hover:bg-accent/60";

export type ContextMenuItem = {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  separatorAfter?: boolean;
};

type Position = { x: number; y: number };
type MenuOrigin = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
  menuClassName?: string;
}

const MENU_WIDTH = 232;
const ITEM_HEIGHT = 44;
const TYPEAHEAD_RESET_MS = 500;
const VIEWPORT_MARGIN = 8;

export function ContextMenu({
  items,
  children,
  className,
  menuClassName,
}: ContextMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [anchor, setAnchor] = React.useState<Position>({ x: 0, y: 0 });
  const [pos, setPos] = React.useState<Position>({ x: 0, y: 0 });
  const [origin, setOrigin] = React.useState<MenuOrigin>("top-left");
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const typeaheadRef = React.useRef("");
  const typeaheadTimeoutRef = React.useRef<number | null>(null);
  const shouldSyncFocusRef = React.useRef(false);
  const enabledIndexes = React.useMemo(
    () =>
      items.reduce<number[]>((indexes, item, index) => {
        if (!item.disabled) {
          indexes.push(index);
        }

        return indexes;
      }, []),
    [items]
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const clearTypeahead = React.useCallback(() => {
    if (typeaheadTimeoutRef.current !== null) {
      window.clearTimeout(typeaheadTimeoutRef.current);
      typeaheadTimeoutRef.current = null;
    }

    typeaheadRef.current = "";
  }, []);

  React.useEffect(() => clearTypeahead, [clearTypeahead]);

  const getFirstEnabledIndex = React.useCallback(
    () => enabledIndexes[0] ?? null,
    [enabledIndexes]
  );

  const getLastEnabledIndex = React.useCallback(
    () => (enabledIndexes.length > 0 ? (enabledIndexes.at(-1) ?? null) : null),
    [enabledIndexes]
  );

  const focusItem = React.useCallback((index: number | null) => {
    if (index === null) {
      menuRef.current?.focus();
      return;
    }

    itemRefs.current[index]?.focus();
  }, []);

  const closeMenu = React.useCallback(
    (restoreFocus = false) => {
      clearTypeahead();
      setOpen(false);
      setActiveIndex(null);

      if (!restoreFocus) {
        return;
      }

      const nextFocusTarget = returnFocusRef.current ?? triggerRef.current;

      if (!nextFocusTarget) {
        return;
      }

      window.requestAnimationFrame(() => {
        nextFocusTarget.focus();
      });
    },
    [clearTypeahead]
  );

  const getNextEnabledIndex = React.useCallback(
    (currentIndex: number | null, direction: 1 | -1) => {
      if (!enabledIndexes.length) {
        return null;
      }

      if (currentIndex === null) {
        return direction === 1
          ? (enabledIndexes[0] ?? null)
          : (enabledIndexes.at(-1) ?? null);
      }

      const currentPosition = enabledIndexes.indexOf(currentIndex);

      if (currentPosition === -1) {
        return direction === 1
          ? (enabledIndexes[0] ?? null)
          : (enabledIndexes.at(-1) ?? null);
      }

      const nextPosition =
        (currentPosition + direction + enabledIndexes.length) %
        enabledIndexes.length;

      return enabledIndexes[nextPosition] ?? null;
    },
    [enabledIndexes]
  );

  const findMatchingIndex = React.useCallback(
    (query: string, fromIndex: number | null) => {
      const normalizedQuery = query.trim().toLowerCase();

      if (!normalizedQuery) {
        return null;
      }

      const startIndex =
        fromIndex === null ? 0 : (fromIndex + 1) % Math.max(items.length, 1);

      for (let offset = 0; offset < items.length; offset += 1) {
        const index = (startIndex + offset) % items.length;
        const item = items[index];

        if (item?.disabled) {
          continue;
        }

        if (item?.label.toLowerCase().startsWith(normalizedQuery)) {
          return index;
        }
      }

      return null;
    },
    [items]
  );

  const updatePosition = React.useCallback(
    (clientX: number, clientY: number, width: number, height: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const overflowRight = clientX + width + VIEWPORT_MARGIN > vw;
      const overflowBottom = clientY + height + VIEWPORT_MARGIN > vh;
      const x = overflowRight
        ? Math.max(VIEWPORT_MARGIN, clientX - width)
        : Math.min(clientX, vw - width - VIEWPORT_MARGIN);
      const y = overflowBottom
        ? Math.max(VIEWPORT_MARGIN, clientY - height)
        : Math.min(clientY, vh - height - VIEWPORT_MARGIN);

      setOrigin(
        `${overflowBottom ? "bottom" : "top"}-${overflowRight ? "right" : "left"}`
      );
      setPos({ x, y });
    },
    []
  );

  const openAt = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!items.length) {
        return;
      }

      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      returnFocusRef.current =
        activeElement && triggerRef.current?.contains(activeElement)
          ? activeElement
          : triggerRef.current;

      shouldSyncFocusRef.current = true;
      clearTypeahead();
      setAnchor({ x: clientX, y: clientY });
      setPos({ x: clientX, y: clientY });
      setActiveIndex(getFirstEnabledIndex());
      setOpen(true);
    },
    [clearTypeahead, getFirstEnabledIndex, items.length]
  );

  const openFromElement = React.useCallback(
    (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();

      openAt(rect.left + Math.min(rect.width / 2, 24), rect.bottom);
    },
    [openAt]
  );

  const moveActiveIndex = React.useCallback((index: number | null) => {
    if (index === null) {
      return;
    }

    shouldSyncFocusRef.current = true;
    setActiveIndex(index);
  }, []);

  const handleSelect = React.useCallback(
    (index: number | null, restoreFocus = false) => {
      if (index === null) {
        return;
      }

      const item = items[index];

      if (!item || item.disabled) {
        return;
      }

      item.onSelect?.();
      closeMenu(restoreFocus);
    },
    [closeMenu, items]
  );

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!(e.shiftKey && e.key === "F10") && e.key !== "ContextMenu") {
      return;
    }

    e.preventDefault();

    const target =
      e.target instanceof HTMLElement ? e.target : triggerRef.current;

    if (!target) {
      return;
    }

    openFromElement(target);
  };

  const getNavigationIndexForKey = React.useCallback(
    (key: string) => {
      switch (key) {
        case "ArrowDown":
          return getNextEnabledIndex(activeIndex, 1);
        case "ArrowUp":
          return getNextEnabledIndex(activeIndex, -1);
        case "Home":
          return getFirstEnabledIndex();
        case "End":
          return getLastEnabledIndex();
        default:
          return undefined;
      }
    },
    [
      activeIndex,
      getFirstEnabledIndex,
      getLastEnabledIndex,
      getNextEnabledIndex,
    ]
  );

  const handleTypeaheadKey = React.useCallback(
    (key: string) => {
      const normalizedKey = key.toLowerCase();
      const nextQuery =
        typeaheadRef.current === normalizedKey
          ? normalizedKey
          : `${typeaheadRef.current}${normalizedKey}`;
      const match = findMatchingIndex(nextQuery, activeIndex);

      typeaheadRef.current = nextQuery;

      if (typeaheadTimeoutRef.current !== null) {
        window.clearTimeout(typeaheadTimeoutRef.current);
      }

      typeaheadTimeoutRef.current = window.setTimeout(() => {
        typeaheadRef.current = "";
        typeaheadTimeoutRef.current = null;
      }, TYPEAHEAD_RESET_MS);

      moveActiveIndex(match);
    },
    [activeIndex, findMatchingIndex, moveActiveIndex]
  );

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu(true);
      return;
    }

    if (e.key === "Tab") {
      closeMenu();
      return;
    }

    const navigationIndex = getNavigationIndexForKey(e.key);

    if (navigationIndex !== undefined) {
      e.preventDefault();
      moveActiveIndex(navigationIndex);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(activeIndex, true);
      return;
    }

    if (
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.key.length !== 1 ||
      e.key === " "
    ) {
      return;
    }

    handleTypeaheadKey(e.key);
  };

  React.useLayoutEffect(() => {
    if (!(open && menuRef.current)) {
      return;
    }

    const menuElement = menuRef.current;
    const measureAndPosition = () => {
      const { height, width } = menuElement.getBoundingClientRect();

      updatePosition(anchor.x, anchor.y, width, height);
    };

    measureAndPosition();

    const observer = new ResizeObserver(() => {
      measureAndPosition();
    });

    observer.observe(menuElement);

    return () => observer.disconnect();
  }, [anchor.x, anchor.y, open, updatePosition]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleWindowMouseDown = () => closeMenu();
    const handleWindowResize = () => closeMenu();
    const handleWindowScroll = (event: Event) => {
      if (
        event.target instanceof Node &&
        menuRef.current?.contains(event.target)
      ) {
        return;
      }

      closeMenu();
    };

    window.addEventListener("mousedown", handleWindowMouseDown);
    window.addEventListener("scroll", handleWindowScroll, true);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("mousedown", handleWindowMouseDown);
      window.removeEventListener("scroll", handleWindowScroll, true);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [closeMenu, open]);

  React.useEffect(() => {
    if (!(open && shouldSyncFocusRef.current)) {
      return;
    }

    shouldSyncFocusRef.current = false;

    const frame = window.requestAnimationFrame(() => {
      focusItem(activeIndex);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, focusItem, open]);

  const transformOrigin = {
    "top-left": "top left",
    "top-right": "top right",
    "bottom-left": "bottom left",
    "bottom-right": "bottom right",
  }[origin];

  const menu = (
    <AnimatePresence>
      {open && mounted ? (
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          aria-orientation="vertical"
          className={cn(
            contextMenuThemeClassName,
            contextMenuPanelClassName,
            menuClassName
          )}
          exit={{ opacity: 0, scale: 0.96, y: -2 }}
          initial={{ opacity: 0, scale: 0.94, y: -4 }}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={handleMenuKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          ref={menuRef}
          role="menu"
          style={{
            position: "fixed",
            top: pos.y,
            left: pos.x,
            width: MENU_WIDTH,
            maxHeight: `calc(100vh - ${VIEWPORT_MARGIN * 2}px)`,
            overflowY: "auto",
            overscrollBehavior: "contain",
            transformOrigin,
            zIndex: 50,
          }}
          tabIndex={-1}
          transition={{
            duration: 0.14,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {items.map((item, i) => (
            <React.Fragment key={`${item.label}-${i}`}>
              <MenuItem
                active={activeIndex === i}
                buttonRef={(node) => {
                  itemRefs.current[i] = node;
                }}
                item={item}
                onClick={() => {
                  if (item.disabled) {
                    return;
                  }

                  handleSelect(i);
                }}
                onFocus={() => setActiveIndex(i)}
                onHover={() => setActiveIndex(i)}
              />
              {item.separatorAfter && i < items.length - 1 && (
                <div className="my-1 h-px bg-[color:color-mix(in_oklch,var(--cm-border),transparent_40%)]" />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  const triggerClassName = cn(
    contextMenuThemeClassName,
    contextMenuTriggerClassName,
    className
  );
  const useSlottedTrigger =
    React.isValidElement(children) && children.type !== React.Fragment;

  return (
    <>
      {useSlottedTrigger ? (
        <Slot
          aria-expanded={open}
          aria-haspopup="menu"
          className={triggerClassName}
          onContextMenu={handleContextMenu}
          onKeyDown={handleTriggerKeyDown}
          ref={triggerRef}
          role="button"
          tabIndex={0}
        >
          {children}
        </Slot>
      ) : (
        <button
          aria-expanded={open}
          aria-haspopup="menu"
          className={triggerClassName}
          onContextMenu={handleContextMenu}
          onKeyDown={handleTriggerKeyDown}
          ref={triggerRef as React.RefObject<HTMLButtonElement | null>}
          type="button"
        >
          {children}
        </button>
      )}
      {mounted ? createPortal(menu, document.body) : null}
    </>
  );
}

function MenuItem({
  item,
  active,
  buttonRef,
  onFocus,
  onHover,
  onClick,
}: {
  item: ContextMenuItem;
  active: boolean;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onFocus: () => void;
  onHover: () => void;
  onClick: () => void;
}) {
  return (
    <motion.button
      animate={{ opacity: 1, x: 0 }}
      aria-disabled={item.disabled}
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-medium text-sm outline-none transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        item.destructive
          ? contextMenuItemDestructiveClassName
          : contextMenuItemDefaultClassName
      )}
      disabled={item.disabled}
      initial={{ opacity: 0, x: -4 }}
      onClick={onClick}
      onFocus={onFocus}
      onMouseEnter={onHover}
      onPointerMove={onHover}
      ref={buttonRef}
      role="menuitem"
      style={{ minHeight: ITEM_HEIGHT }}
      tabIndex={item.disabled ? -1 : active ? 0 : -1}
      transition={{
        duration: 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      type="button"
    >
      {active && !item.disabled && (
        <motion.div
          className={contextMenuItemHighlightClassName}
          layoutId="context-menu-active"
          transition={{ type: "spring", stiffness: 600, damping: 38 }}
        />
      )}
      <span className="relative z-10 flex flex-1 items-center gap-2.5">
        {item.icon && (
          <span className="flex h-4 w-4 items-center justify-center opacity-70">
            {item.icon}
          </span>
        )}
        <span className="truncate">{item.label}</span>
      </span>
      {item.shortcut && (
        <span className="relative z-10 text-[color:color-mix(in_oklch,var(--cm-muted-foreground),transparent_30%)] text-xs tracking-widest">
          {item.shortcut}
        </span>
      )}
    </motion.button>
  );
}
