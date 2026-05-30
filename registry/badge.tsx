"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { forwardRef, type HTMLAttributes } from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

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
    VariantProps<typeof badgeVariants>,
    ReducedMotionProp {
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
      reducedMotion,
      style,
      ...props
    },
    ref
  ) => {
    const resolveReducedMotion = useResolvedReducedMotion(reducedMotion);
    const resolvedSize = size ?? "md";
    const colorValue = badgeColors[color];
    const isDefault = variant === "default";
    const shouldAnimate = isDefault && !resolveReducedMotion;
    const shouldBlinkDot = !(isDefault || resolveReducedMotion);
    const dotSize = badgeDotSizes[resolvedSize];

    const colorStyle = getBadgeColorStyle(isDefault, color, colorValue);

    const dotColor = color === "gray" ? "var(--muted-foreground)" : colorValue;

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <motion.span
          animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
          className={cn(
            componentThemeClassName,
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
                  waveColor ??
                  "color-mix(in srgb, currentColor 18%, transparent)"
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
      </ReducedMotionConfig>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, badgeColors };
export type { BadgeProps, BadgeColor };
export default Badge;
