"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type AlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface AlertProps {
  /** Leading graphic (e.g. a Lucide icon). You control markup and sizing. */
  icon: ReactNode;
  title: string;
  message: string;
  dismissible?: boolean;
  position?: AlertPosition;
  /** Auto-dismiss after this many milliseconds. Defaults to 10 000. Pass 0 to disable. */
  timeout?: number;
  onDismiss?: () => void;
}

/**
 * Mobile-first: every positioned alert sits at the top of the viewport,
 * spanning the full width minus safe margins (inset-x-4). At the sm
 * breakpoint the requested corner takes over.
 */
const positionClasses: Record<AlertPosition, string> = {
  "top-left": "fixed top-4 inset-x-4 sm:inset-x-auto sm:left-4 sm:right-auto",
  "top-center":
    "fixed top-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2",
  "top-right": "fixed top-4 inset-x-4 sm:inset-x-auto sm:left-auto sm:right-4",
  "bottom-left":
    "fixed top-4 inset-x-4 sm:inset-x-auto sm:top-auto sm:bottom-4 sm:left-4 sm:right-auto",
  "bottom-center":
    "fixed top-4 inset-x-4 sm:inset-x-auto sm:top-auto sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2",
  "bottom-right":
    "fixed top-4 inset-x-4 sm:inset-x-auto sm:top-auto sm:bottom-4 sm:left-auto sm:right-4",
};

/** Entry direction per position (desktop). On mobile all arrive from top. */
const entryY: Record<AlertPosition, number> = {
  "top-left": -10,
  "top-center": -10,
  "top-right": -10,
  "bottom-left": 10,
  "bottom-center": 10,
  "bottom-right": 10,
};

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

/** Shared stagger children — subtle lift + blur fade */
const childVariants: Variants = {
  hidden: { opacity: 0, y: 4, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

/** Icon — soft spring scale-up from a visible start */
const iconVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 340,
      damping: 22,
      delay: 0.06,
    },
  },
  exit: {
    scale: 0.6,
    opacity: 0,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

export const Alert = ({
  icon,
  title,
  message,
  dismissible = true,
  position,
  timeout = 10_000,
  onDismiss,
}: AlertProps) => {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    if (!timeout) return;
    const id = setTimeout(handleDismiss, timeout);
    return () => clearTimeout(id);
  }, [timeout, handleDismiss]);

  const dy = position ? entryY[position] : -8;

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: dy, scale: 0.97, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: 0.22, ease: "easeOut" },
        y: { type: "spring" as const, stiffness: 320, damping: 26 },
        scale: { type: "spring" as const, stiffness: 320, damping: 26 },
        filter: { duration: 0.3, ease: "easeOut" },
        staggerChildren: 0.05,
        delayChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: dy,
      scale: 0.97,
      filter: "blur(4px)",
      transition: { duration: 0.18, ease: EASE_IN },
    },
  };

  const card = (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate="visible"
          className={cn(
            "relative flex items-start gap-3 overflow-hidden rounded-xl border border-foreground/8 bg-card px-3.5 shadow-[0_2px_14px_0_rgba(0,0,0,0.07)]",
            position
              ? // Fixed: let left+right inset determine width (no w-full).
                // On mobile inset-x-4 stretches across viewport minus margins.
                // On sm: max-w-sm caps the desktop corner width.
                "py-3 sm:max-w-sm sm:py-2.5"
              : // In-flow: explicit full width up to max-w-sm.
                "w-full max-w-sm py-2.5",
            position ? positionClasses[position] : undefined,
            position && "z-300"
          )}
          exit="exit"
          initial="hidden"
          variants={containerVariants}
        >
          {/* Timeout progress bar */}
          {timeout > 0 && (
            <motion.span
              animate={{ scaleX: 0 }}
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-foreground/10"
              initial={{ scaleX: 1 }}
              transition={{
                duration: timeout / 1000,
                ease: "linear",
                delay: 0.3,
              }}
            />
          )}

          {/* Icon */}
          <motion.div
            className="mt-px shrink-0 text-black dark:text-white [&_svg]:h-[18px] [&_svg]:w-[18px]"
            variants={iconVariants}
          >
            {icon}
          </motion.div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <motion.p
              className="font-medium text-[13px] text-foreground/80 tracking-[-0.01em]"
              variants={childVariants}
            >
              {title}
            </motion.p>
            <motion.p
              className="mt-0.5 text-[12px] text-foreground/40 leading-relaxed"
              variants={childVariants}
            >
              {message}
            </motion.p>
          </div>

          {/* Dismiss */}
          {dismissible && (
            <motion.button
              className="mt-1 shrink-0 text-foreground/20 transition-colors hover:text-foreground/50"
              onClick={handleDismiss}
              type="button"
              variants={childVariants}
            >
              <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
                <path
                  d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.2"
                />
              </svg>
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  /**
   * When a position is given, portal the alert to document.body so it
   * escapes any ancestor CSS transform (Motion scale/y), which
   * would otherwise make `position: fixed` relative to the transformed
   * element instead of the viewport.
   */
  if (position) {
    return mounted ? createPortal(card, document.body) : null;
  }

  return card;
};

export default Alert;
