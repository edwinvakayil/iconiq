"use client";
import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export type DrawerSide = "left" | "right" | "top" | "bottom";
type PanelMotion = { x?: string | number; y?: string | number };

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: string;
  description?: string;
  children?: ReactNode;
}

const panelVariants: Record<
  DrawerSide,
  {
    initial: PanelMotion;
    animate: PanelMotion;
    exit: PanelMotion;
    className: string;
  }
> = {
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    className: "top-0 right-0 h-full w-full max-w-md border-l",
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    className: "top-0 left-0 h-full w-full max-w-md border-r",
  },
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
    className: "top-0 left-0 w-full max-h-[80vh] border-b",
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    className: "bottom-0 left-0 w-full max-h-[80vh] border-t",
  },
};

const containerStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.12 },
  },
  exit: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const itemFade: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: 4,
    filter: "blur(2px)",
    transition: { duration: 0.15 },
  },
};

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  description,
  children,
}: DrawerProps) {
  const variant = panelVariants[side];
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const spring: Transition = reduce
    ? { duration: 0.2 }
    : { type: "spring", stiffness: 260, damping: 32, mass: 0.8 };

  const drawerContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[2147483647]">
          <motion.div
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            className="absolute inset-0 bg-foreground/30"
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={onClose}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.aside
            animate={variant.animate}
            className={`absolute flex flex-col overflow-hidden border-neutral-200/80 bg-background shadow-2xl dark:border-neutral-800 ${variant.className}`}
            exit={variant.exit}
            initial={variant.initial}
            transition={spring}
          >
            {/* subtle gradient shimmer */}
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-muted/40 to-transparent"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />

            <motion.header
              animate="show"
              className="relative flex items-start justify-between gap-4 border-neutral-200/80 border-b px-6 py-5 sm:px-7 sm:py-6 dark:border-neutral-800"
              exit="exit"
              initial="hidden"
              variants={containerStagger}
            >
              <div className="max-w-[min(100%,18rem)] space-y-1.5 pr-2">
                <motion.h2
                  className="font-medium text-[17px] text-foreground tracking-[-0.03em] sm:text-[18px]"
                  variants={itemFade}
                >
                  {title ?? ""}
                </motion.h2>
                {description && (
                  <motion.p
                    className="max-w-sm text-[13px] text-secondary leading-5"
                    variants={itemFade}
                  >
                    {description}
                  </motion.p>
                )}
              </div>
              <motion.button
                aria-label="Close drawer"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100/80 text-muted-foreground transition-colors duration-200 hover:bg-neutral-200/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                onClick={onClose}
                type="button"
                variants={itemFade}
              >
                <X className="size-4" />
              </motion.button>
            </motion.header>

            <motion.div
              animate="show"
              className="relative flex-1 overflow-y-auto px-6 py-5 text-foreground text-sm"
              exit="exit"
              initial="hidden"
              variants={containerStagger}
            >
              <motion.div variants={itemFade}>{children}</motion.div>
            </motion.div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") {
    return drawerContent;
  }

  return createPortal(drawerContent, document.body);
}
