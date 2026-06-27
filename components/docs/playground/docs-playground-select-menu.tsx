"use client";

import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import { docsPlaygroundRowClassName } from "./docs-playground-styles";

const VIEWPORT_MARGIN = 12;
const MENU_GAP = 6;
const MENU_MIN_WIDTH = 168;

const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_EASE = [0.4, 0, 0.6, 1] as const;
const POPUP_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.82,
};

type MenuPlacement = {
  minWidth: number;
  openAbove: boolean;
  right: number;
  top?: number;
  bottom?: number;
};

function getMenuPlacement(
  trigger: HTMLElement,
  menuHeight: number
): MenuPlacement {
  const rect = trigger.getBoundingClientRect();
  const minWidth = Math.min(
    Math.max(rect.width, MENU_MIN_WIDTH),
    window.innerWidth - VIEWPORT_MARGIN * 2
  );

  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;
  const spaceAbove = rect.top - VIEWPORT_MARGIN;
  const openAbove =
    spaceBelow < menuHeight + MENU_GAP && spaceAbove > spaceBelow;

  const right = Math.max(
    VIEWPORT_MARGIN,
    Math.min(
      window.innerWidth - rect.right,
      window.innerWidth - minWidth - VIEWPORT_MARGIN
    )
  );

  if (openAbove) {
    return {
      bottom: window.innerHeight - rect.top + MENU_GAP,
      minWidth,
      openAbove: true,
      right,
    };
  }

  return {
    minWidth,
    openAbove: false,
    right,
    top: rect.bottom + MENU_GAP,
  };
}

const itemMotion = {
  hidden: { opacity: 0, y: -4 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(index, 5) * 0.02,
      duration: 0.18,
      ease: FLUID_EASE,
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    y: -2,
    transition: {
      delay: Math.min(index, 5) * 0.008,
      duration: 0.1,
      ease: EXIT_EASE,
    },
  }),
};

type PlaygroundSelectOption<T extends string> = {
  label: string;
  value: T;
};

type DocsPlaygroundSelectMenuProps<T extends string> = {
  ariaLabel: string;
  onChange: (value: T) => void;
  options: readonly PlaygroundSelectOption<T>[];
  triggerClassName?: string;
  value: T;
};

export function DocsPlaygroundSelectMenu<T extends string>({
  ariaLabel,
  onChange,
  options,
  triggerClassName,
  value,
}: DocsPlaygroundSelectMenuProps<T>) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<T | null>(null);
  const [menuPlacement, setMenuPlacement] = useState<MenuPlacement | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuSelector = `[data-playground-select-menu="${menuId}"]`;
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const measuredHeight =
      menuRef.current?.offsetHeight ?? options.length * 42 + 16;
    setMenuPlacement(getMenuPlacement(trigger, measuredHeight));
  }, [options.length]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setHoveredValue(null);
  }, []);

  const toggleMenu = () => {
    setOpen((current) => {
      if (current) {
        setHoveredValue(null);
        return false;
      }

      const trigger = triggerRef.current;

      if (trigger) {
        setMenuPlacement(getMenuPlacement(trigger, options.length * 42 + 16));
      }

      return true;
    });
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    updateMenuPosition();

    const menuNode = menuRef.current;
    const resizeObserver =
      typeof ResizeObserver !== "undefined" && menuNode
        ? new ResizeObserver(() => updateMenuPosition())
        : null;

    resizeObserver?.observe(menuNode as Element);

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (containerRef.current?.contains(target)) {
        return;
      }

      if (target instanceof Element && target.closest(menuSelector)) {
        return;
      }

      closeMenu();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, menuSelector, open, updateMenuPosition]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => updateMenuPosition());
    }
  }, [open, updateMenuPosition]);

  const menuMotion = menuPlacement?.openAbove
    ? {
        animate: { opacity: 1, scale: 1, y: 0 },
        closed: { opacity: 0, scale: 0.96, y: 6 },
        initial: { opacity: 0, scale: 0.96, y: 6 },
      }
    : {
        animate: { opacity: 1, scale: 1, y: 0 },
        closed: { opacity: 0, scale: 0.96, y: -6 },
        initial: { opacity: 0, scale: 0.96, y: -6 },
      };

  const menu =
    open && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            <div
              className="fixed z-[400]"
              data-playground-select-menu={menuId}
              ref={menuRef}
              style={{
                bottom: menuPlacement?.bottom,
                minWidth: menuPlacement?.minWidth ?? MENU_MIN_WIDTH,
                right: menuPlacement?.right ?? VIEWPORT_MARGIN,
                top: menuPlacement?.top,
              }}
            >
              <motion.div
                animate={menuMotion.animate}
                className="rounded-[14px] border border-black/[0.08] bg-white p-1.5 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.14)] dark:border-white/[0.08] dark:bg-[#1c1c1e] dark:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.48)]"
                exit={{
                  ...menuMotion.closed,
                  transition: {
                    opacity: { duration: 0.16, ease: EXIT_EASE },
                    scale: { duration: 0.16, ease: EXIT_EASE },
                    y: { duration: 0.16, ease: EXIT_EASE },
                  },
                }}
                initial={menuMotion.initial}
                role="listbox"
                style={{
                  transformOrigin: menuPlacement?.openAbove
                    ? "bottom right"
                    : "top right",
                }}
                transition={{
                  opacity: { duration: 0.24, ease: FLUID_EASE },
                  scale: POPUP_SPRING,
                  y: POPUP_SPRING,
                }}
              >
                <LayoutGroup id={`${menuId}-hover`}>
                  <ul
                    className="m-0 flex list-none flex-col gap-0.5 p-0"
                    onMouseLeave={() => setHoveredValue(null)}
                  >
                    {options.map((option, index) => {
                      const isSelected = option.value === value;
                      const isHovered =
                        hoveredValue === option.value && !isSelected;

                      return (
                        <motion.li
                          animate="visible"
                          custom={index}
                          exit="exit"
                          initial="hidden"
                          key={option.value}
                          role="presentation"
                          variants={itemMotion}
                        >
                          <button
                            aria-selected={isSelected}
                            className="relative flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-left text-[13px] outline-none"
                            onClick={() => {
                              onChange(option.value);
                              closeMenu();
                            }}
                            onMouseEnter={() => setHoveredValue(option.value)}
                            role="option"
                            type="button"
                          >
                            {isSelected ? (
                              <span className="absolute inset-0 rounded-[10px] bg-[#007aff] dark:bg-[#0a84ff]" />
                            ) : null}
                            {isHovered ? (
                              <motion.span
                                className="absolute inset-0 rounded-[10px] bg-[#f3f3f3] dark:bg-[#2c2c2e]"
                                layoutId={`${menuId}-hover-pill`}
                                transition={{
                                  type: "spring",
                                  stiffness: 520,
                                  damping: 38,
                                  mass: 0.72,
                                }}
                              />
                            ) : null}
                            <span className="relative z-10 flex w-4 shrink-0 justify-center">
                              {isSelected ? (
                                <Check
                                  className="size-3.5 text-white"
                                  strokeWidth={2.5}
                                />
                              ) : null}
                            </span>
                            <span
                              className={cn(
                                "relative z-10 min-w-0 flex-1 truncate font-medium",
                                isSelected
                                  ? "text-white"
                                  : "text-[#111113] dark:text-zinc-100"
                              )}
                            >
                              {option.label}
                            </span>
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                </LayoutGroup>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <div className="relative min-w-0 flex-1" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          "flex w-full min-w-0 items-center justify-end gap-1 rounded-lg px-1 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#007aff]/35",
          triggerClassName
        )}
        onClick={toggleMenu}
        ref={triggerRef}
        type="button"
      >
        <span className="truncate font-medium text-[#111113] text-[13px] dark:text-zinc-100">
          {selectedLabel}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="shrink-0 text-[#5c5c61] dark:text-[#a1a1a6]"
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 24,
            mass: 0.7,
          }}
        >
          <ChevronDown className="size-4" strokeWidth={1.75} />
        </motion.span>
      </button>
      {menu}
    </div>
  );
}

export function DocsPlaygroundSelectRow<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: readonly PlaygroundSelectOption<T>[];
  value: T;
}) {
  return (
    <div
      className={cn(docsPlaygroundRowClassName, "justify-between gap-3 px-4")}
    >
      <span className="shrink-0 font-medium text-[#5c5c61] text-[13px] dark:text-[#a1a1a6]">
        {label}
      </span>
      <DocsPlaygroundSelectMenu
        ariaLabel={label}
        onChange={onChange}
        options={options}
        value={value}
      />
    </div>
  );
}
