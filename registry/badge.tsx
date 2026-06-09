"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

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
      return {
        backgroundColor: "var(--ic-accent)",
        color: "var(--ic-foreground)",
      };
    }

    return {
      color: "var(--ic-foreground)",
      backgroundColor: `color-mix(in srgb, ${colorValue} 15%, var(--ic-background))`,
    };
  }

  if (color === "gray") {
    return {};
  }

  return {
    borderColor: `color-mix(in srgb, ${colorValue} 22%, var(--ic-border))`,
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
    const resolvedSize = size ?? "md";
    const colorValue = badgeColors[color];
    const isDefault = variant === "default";
    const shouldAnimate = isDefault;
    const shouldBlinkDot = !isDefault;
    const dotSize = badgeDotSizes[resolvedSize];

    const colorStyle = getBadgeColorStyle(isDefault, color, colorValue);

    const dotColor =
      color === "gray" ? "var(--ic-muted-foreground)" : colorValue;

    return (
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
