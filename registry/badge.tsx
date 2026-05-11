"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeColors = {
  gray: "#a3a3a3",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
} as const;

type BadgeColor = keyof typeof badgeColors;

const badgeDotSizes = {
  sm: 6,
  md: 7,
  lg: 8,
} as const;

const badgeVariants = cva(
  "relative inline-flex items-center overflow-hidden whitespace-nowrap rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "",
        dot: "border border-border bg-background text-foreground",
      },
      size: {
        sm: "h-5 gap-1 px-2 text-[11px]",
        md: "h-6 gap-1.5 px-2.5 text-[12px]",
        lg: "h-7 gap-1.5 px-3 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type SpanHTMLAttributesForMotion = Omit<
  HTMLAttributes<HTMLSpanElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

interface BadgeProps
  extends Omit<SpanHTMLAttributesForMotion, "color">,
    VariantProps<typeof badgeVariants> {
  color?: BadgeColor;
  waveColor?: string;
}

function getBadgeColorStyle(
  isDefault: boolean,
  color: BadgeColor,
  colorValue: string
) {
  if (isDefault) {
    if (color === "gray") {
      return { backgroundColor: "var(--accent)", color: "var(--foreground)" };
    }

    return {
      color: "var(--foreground)",
      backgroundColor: `color-mix(in srgb, ${colorValue} 15%, var(--background))`,
    };
  }

  if (color === "gray") {
    return {};
  }

  return {
    borderColor: `color-mix(in srgb, ${colorValue} 22%, var(--border))`,
  };
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      color = "gray",
      waveColor,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const resolvedSize = size ?? "md";
    const colorValue = badgeColors[color];
    const isDefault = variant === "default";
    const shouldAnimate = isDefault && !prefersReducedMotion;
    const shouldBlinkDot = !(isDefault || prefersReducedMotion);
    const dotSize = badgeDotSizes[resolvedSize];

    const colorStyle = getBadgeColorStyle(isDefault, color, colorValue);

    const dotColor = color === "gray" ? "var(--muted-foreground)" : colorValue;

    return (
      <motion.span
        animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
        className={cn(
          badgeVariants({ variant, size: resolvedSize }),
          className
        )}
        initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : undefined}
        ref={ref}
        style={{ ...colorStyle, ...style }}
        transition={shouldAnimate ? { duration: 0.3 } : undefined}
        {...props}
      >
        {shouldAnimate ? (
          <motion.span
            animate={{ x: ["-100%", "200%"] }}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${
                waveColor ?? "color-mix(in srgb, currentColor 18%, transparent)"
              } 50%, transparent 100%)`,
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
          />
        ) : null}
        {isDefault ? null : (
          <motion.span
            animate={
              shouldBlinkDot
                ? {
                    opacity: [0.5, 1, 0.5],
                    scale: [0.9, 1, 0.9],
                  }
                : undefined
            }
            className="relative z-10 shrink-0 rounded-full"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: dotColor,
            }}
            transition={
              shouldBlinkDot
                ? {
                    duration: 1.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }
                : undefined
            }
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, badgeColors };
export type { BadgeProps, BadgeColor };
export default Badge;
