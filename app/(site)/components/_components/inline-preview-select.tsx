"use client";

import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_EASE = [0.55, 0.06, 0.68, 0.19] as const;
const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const POPUP_EXIT_EASE = [0.4, 0, 0.6, 1] as const;
const POPUP_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.95,
};

type InlinePreviewSelectOption<T extends string> = {
  label: string;
  value: T;
};

type InlinePreviewSelectProps<T extends string> = {
  ariaLabel: string;
  menuKey: string;
  onChange: (value: T) => void;
  options: readonly InlinePreviewSelectOption<T>[];
  value: T;
};

const menuMotion = {
  animate: { opacity: 1, scale: 1, y: 0 },
  closed: { opacity: 0, scale: 0.985, y: -5 },
  initial: { opacity: 0, scale: 0.985, y: -5 },
  openTransition: {
    opacity: { duration: 0.34, ease: FLUID_EASE },
    scale: POPUP_SPRING,
    y: POPUP_SPRING,
  },
  closedTransition: {
    opacity: { duration: 0.22, ease: POPUP_EXIT_EASE },
    scale: { duration: 0.22, ease: POPUP_EXIT_EASE },
    y: { duration: 0.22, ease: POPUP_EXIT_EASE },
  },
};

const menuItemVariants = {
  exit: (index: number) => ({
    opacity: 0,
    transition: {
      delay: Math.min(index, 4) * 0.01,
      duration: 0.12,
      ease: EXIT_EASE,
    },
    y: -2,
  }),
  hidden: {
    opacity: 0,
    y: -4,
  },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      delay: Math.min(index, 4) * 0.02,
      duration: 0.18,
      ease: SOFT_EASE,
    },
    y: 0,
  }),
};

export function InlinePreviewSelect<T extends string>({
  ariaLabel,
  menuKey,
  onChange,
  options,
  value,
}: InlinePreviewSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;
  const menuSelector = `[data-inline-preview-menu="${menuKey}"]`;

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();

    setMenuStyle({
      left: rect.left + rect.width / 2,
      top: rect.bottom + 6,
      width: Math.max(rect.width, 152),
    });
  }, []);

  function toggleMenu() {
    setOpen((current) => {
      if (current) {
        return false;
      }

      updateMenuPosition();
      return true;
    });
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function updateMenuPositionOnScroll() {
      updateMenuPosition();
    }

    updateMenuPositionOnScroll();
    window.addEventListener("resize", updateMenuPositionOnScroll);
    window.addEventListener("scroll", updateMenuPositionOnScroll, true);

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (containerRef.current?.contains(target)) {
        return;
      }

      if (target instanceof Element && target.closest(menuSelector)) {
        return;
      }

      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updateMenuPositionOnScroll);
      window.removeEventListener("scroll", updateMenuPositionOnScroll, true);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuSelector, open, updateMenuPosition]);

  const menu =
    menuStyle && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence initial={false}>
            {open ? (
              <motion.ul
                animate={{ ...menuMotion.animate, x: "-50%" }}
                className="fixed z-[300] m-0 origin-top list-none rounded-lg border border-border bg-card p-1 text-card-foreground shadow-[0_12px_32px_-18px_rgba(15,23,42,0.28)] dark:border-border dark:bg-card dark:shadow-[0_12px_32px_-18px_rgba(0,0,0,0.6)]"
                data-inline-preview-menu={menuKey}
                exit={{
                  ...menuMotion.closed,
                  transition: menuMotion.closedTransition,
                  x: "-50%",
                }}
                initial={{ ...menuMotion.initial, x: "-50%" }}
                key={menuKey}
                role="listbox"
                style={{
                  left: menuStyle.left,
                  top: menuStyle.top,
                  width: menuStyle.width,
                }}
                transition={menuMotion.openTransition}
              >
                {options.map((option, index) => {
                  const isSelected = option.value === value;

                  return (
                    <motion.li
                      animate="visible"
                      custom={index}
                      exit="exit"
                      initial="hidden"
                      key={option.value}
                      role="presentation"
                      variants={menuItemVariants}
                    >
                      <button
                        aria-selected={isSelected}
                        className={cn(
                          "flex w-full cursor-pointer items-center rounded-md border-0 px-3 py-2 text-left text-sm transition-colors",
                          isSelected
                            ? "bg-accent font-medium text-foreground"
                            : "bg-card font-normal text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                        onClick={() => {
                          onChange(option.value);
                          setOpen(false);
                        }}
                        role="option"
                        type="button"
                      >
                        {option.label}
                      </button>
                    </motion.li>
                  );
                })}
              </motion.ul>
            ) : null}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <span className="relative inline-flex align-middle" ref={containerRef}>
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          className="inline-flex items-center gap-0.5 border-0 bg-transparent p-0 font-medium text-foreground transition-colors hover:text-foreground focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
          onClick={toggleMenu}
          ref={triggerRef}
          type="button"
        >
          <span>{selectedLabel}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="inline-flex"
            transition={{ duration: 0.2, ease: SOFT_EASE }}
          >
            <ChevronDownIcon className="size-[0.85em] text-muted-foreground" />
          </motion.span>
        </button>
      </span>
      {menu}
    </>
  );
}
