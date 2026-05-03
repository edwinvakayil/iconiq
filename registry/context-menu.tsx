"use client";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

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

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
  menuClassName?: string;
}

const MENU_WIDTH = 232;
const ITEM_HEIGHT = 36;

export function ContextMenu({
  items,
  children,
  className,
  menuClassName,
}: ContextMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState<Position>({ x: 0, y: 0 });
  const [origin, setOrigin] = React.useState<
    "top-left" | "top-right" | "bottom-left" | "bottom-right"
  >("top-left");
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const openAt = React.useCallback(
    (clientX: number, clientY: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const estHeight = items.length * ITEM_HEIGHT + 16;

      const overflowRight = clientX + MENU_WIDTH + 8 > vw;
      const overflowBottom = clientY + estHeight + 8 > vh;

      const x = overflowRight ? Math.max(8, clientX - MENU_WIDTH) : clientX;
      const y = overflowBottom ? Math.max(8, clientY - estHeight) : clientY;

      setOrigin(
        `${overflowBottom ? "bottom" : "top"}-${overflowRight ? "right" : "left"}` as typeof origin
      );
      setPos({ x, y });
      setActiveIndex(null);
      setOpen(true);
    },
    [items.length]
  );

  const getEnabledIndex = React.useCallback(
    (startIndex: number, direction: 1 | -1) => {
      for (
        let index = startIndex;
        index >= 0 && index < items.length;
        index += direction
      ) {
        if (!items[index]?.disabled) {
          return index;
        }
      }

      return null;
    },
    [items]
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => {
          const nextIndex = getEnabledIndex(i === null ? 0 : i + 1, 1);

          return nextIndex ?? i;
        });
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(
          (i) => getEnabledIndex(i === null ? items.length - 1 : i - 1, -1) ?? i
        );
      }
      if (e.key === "Enter" && activeIndex !== null) {
        const item = items[activeIndex];
        if (item && !item.disabled) {
          item.onSelect?.();
          setOpen(false);
        }
      }
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, items, activeIndex, getEnabledIndex]);

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
            "rounded-xl border border-border/60 bg-white p-1.5 text-popover-foreground shadow-2xl dark:border-neutral-800 dark:bg-black",
            menuClassName
          )}
          exit={{ opacity: 0, scale: 0.96, y: -2 }}
          initial={{ opacity: 0, scale: 0.94, y: -4 }}
          onContextMenu={(e) => e.preventDefault()}
          onMouseDown={(e) => e.stopPropagation()}
          role="menu"
          style={{
            position: "fixed",
            top: pos.y,
            left: pos.x,
            width: MENU_WIDTH,
            transformOrigin,
            zIndex: 50,
          }}
          transition={{
            type: "spring",
            stiffness: 480,
            damping: 34,
            mass: 0.6,
          }}
        >
          {items.map((item, i) => (
            <React.Fragment key={`${item.label}-${i}`}>
              <MenuItem
                active={activeIndex === i}
                index={i}
                item={item}
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect?.();
                  setOpen(false);
                }}
                onHover={() => setActiveIndex(i)}
              />
              {item.separatorAfter && i < items.length - 1 && (
                <div className="my-1 h-px bg-border/60" />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <div className={className} onContextMenu={handleContextMenu}>
        {children}
      </div>
      {mounted ? createPortal(menu, document.body) : null}
    </>
  );
}

function MenuItem({
  item,
  index,
  active,
  onHover,
  onClick,
}: {
  item: ContextMenuItem;
  index: number;
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  return (
    <motion.button
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left font-medium text-sm outline-none transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        item.destructive ? "text-destructive" : "text-foreground/85"
      )}
      disabled={item.disabled}
      initial={{ opacity: 0, x: -4 }}
      onClick={onClick}
      onMouseEnter={onHover}
      role="menuitem"
      transition={{
        delay: 0.02 * index,
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
      }}
      type="button"
    >
      {active && !item.disabled && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-lg",
            item.destructive ? "bg-destructive/10" : "bg-accent"
          )}
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
        <span className="relative z-10 text-muted-foreground/70 text-xs tracking-widest">
          {item.shortcut}
        </span>
      )}
    </motion.button>
  );
}
