"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

export type SwitchSize = "sm" | "md" | "lg";

const SWITCH_LAYOUT = {
  sm: {
    root: "h-[22px] w-[42px] p-[2px]",
    thumb: "h-[18px] w-[18px]",
    travel: 20,
  },
  md: {
    root: "h-[30px] w-[52px] p-[3px]",
    thumb: "h-[24px] w-[24px]",
    travel: 22,
  },
  lg: {
    root: "h-[36px] w-[64px] p-[3px]",
    thumb: "h-[30px] w-[30px]",
    travel: 28,
  },
} as const satisfies Record<
  SwitchSize,
  { root: string; thumb: string; travel: number }
>;

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  /** Visual scale: `sm` (compact), `md` (default), `lg` (prominent). */
  size?: SwitchSize;
}

/** Track tint: smooth deceleration so the color “settles” after the thumb. */
const trackEase = [0.17, 1, 0.25, 1] as [number, number, number, number];

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onCheckedChange,
      disabled = false,
      className,
      size = "md",
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion();
    const layout = SWITCH_LAYOUT[size];

    const trackTransition = reduceMotion
      ? { duration: 0.12, ease: "easeOut" as const }
      : {
          duration: 0.62,
          ease: trackEase,
          delay: 0.05,
        };

    const thumbTransition = reduceMotion
      ? {
          type: "tween" as const,
          duration: 0.14,
          ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        }
      : {
          type: "spring" as const,
          stiffness: 320,
          damping: 22,
          mass: 0.48,
          restDelta: 0.0008,
          restSpeed: 0.15,
        };

    return (
      <button
        aria-checked={checked}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
          layout.root,
          className
        )}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        ref={ref}
        role="switch"
        type="button"
      >
        <motion.span
          animate={{
            backgroundColor: checked
              ? "oklch(0.55 0.15 160)"
              : "oklch(0.85 0 0)",
          }}
          className="absolute inset-0 rounded-full"
          transition={trackTransition}
        />
        <motion.span
          animate={{ x: checked ? layout.travel : 0 }}
          className={cn(
            "relative z-10 block rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]",
            layout.thumb
          )}
          transition={thumbTransition}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch, Switch as switch };
