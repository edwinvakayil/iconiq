"use client";

import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  useLayoutEffect,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const STYLE_ID = "iconiq-skeleton-styles";

const SKELETON_CSS = `
@keyframes iconiq-skeleton-shimmer {
  to {
    transform: translateX(200%);
  }
}

@keyframes iconiq-skeleton-fade {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.38;
  }
}

.iconiq-skeleton-surface {
  background-color: #f5f7fa;
  background-color: var(--ic-muted);
}

.iconiq-skeleton-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(17, 17, 17, 0.06) 50%,
    transparent 100%
  );
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--ic-foreground) 6%, transparent) 50%,
    transparent 100%
  );
  animation: iconiq-skeleton-shimmer var(--iconiq-skeleton-duration, 1.6s)
    ease-in-out infinite;
}

.iconiq-skeleton-fade-root {
  animation: iconiq-skeleton-fade var(--iconiq-skeleton-duration, 2.4s)
    ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .iconiq-skeleton-shimmer,
  .iconiq-skeleton-fade-root {
    animation: none;
  }
}
`;

type SkeletonRounded = "none" | "sm" | "md" | "lg" | "full";
type SkeletonVariant = "shimmer" | "fade";

const skeletonRoundedClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const satisfies Record<SkeletonRounded, string>;

const skeletonVariantDefaultDuration: Record<SkeletonVariant, number> = {
  shimmer: 1.6,
  fade: 2.4,
};

function getSkeletonVariantDuration(variant: SkeletonVariant, duration = 1.6) {
  if (duration !== 1.6) {
    return duration;
  }

  return skeletonVariantDefaultDuration[variant];
}

function ensureSkeletonStyles() {
  if (typeof document === "undefined") {
    return;
  }

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = SKELETON_CSS;
}

function resolveSkeletonA11yProps({
  animate = true,
  decorative = true,
  label,
}: {
  animate?: boolean;
  decorative?: boolean;
  label?: string | null;
}) {
  if (decorative || label === null) {
    return { "aria-hidden": true as const };
  }

  return {
    "aria-label": label ?? (animate ? "Loading" : "Placeholder"),
    "aria-live": "polite" as const,
    role: "status" as const,
  };
}

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
  decorative?: boolean;
  duration?: number;
  label?: string | null;
  rounded?: SkeletonRounded;
  variant?: SkeletonVariant;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    animate = true,
    className,
    decorative = true,
    duration = 1.6,
    label,
    rounded = "md",
    style,
    variant = "shimmer",
    ...props
  },
  ref
) {
  const variantDuration = getSkeletonVariantDuration(variant, duration);
  const showShimmer = animate && variant === "shimmer";
  const showFade = animate && variant === "fade";

  useLayoutEffect(() => {
    if (animate) {
      ensureSkeletonStyles();
    }
  }, [animate]);

  const animatedStyle =
    showShimmer || showFade
      ? ({
          ...style,
          "--iconiq-skeleton-duration": `${variantDuration}s`,
        } as CSSProperties)
      : style;

  return (
    <div
      className={cn(
        componentThemeClassName,
        "iconiq-skeleton-surface relative block h-4 w-full overflow-hidden",
        showFade && "iconiq-skeleton-fade-root",
        skeletonRoundedClasses[rounded],
        className
      )}
      ref={ref}
      style={animatedStyle}
      {...resolveSkeletonA11yProps({ animate, decorative, label })}
      {...props}
    >
      {showShimmer ? (
        <span
          aria-hidden="true"
          className="iconiq-skeleton-shimmer pointer-events-none absolute inset-0 -translate-x-full"
        />
      ) : null}
    </div>
  );
});

Skeleton.displayName = "Skeleton";

function SkeletonAvatar({
  className,
  ...props
}: Omit<SkeletonProps, "rounded">) {
  return (
    <Skeleton
      className={cn("size-10", className)}
      decorative
      rounded="full"
      {...props}
    />
  );
}

function SkeletonText({ className, ...props }: SkeletonProps) {
  return <Skeleton className={cn("h-3", className)} decorative {...props} />;
}

function SkeletonButton({
  className,
  ...props
}: Omit<SkeletonProps, "rounded">) {
  return (
    <Skeleton
      className={cn("h-9 w-24", className)}
      decorative
      rounded="lg"
      {...props}
    />
  );
}

const ShimmerSkeleton = Skeleton;

export {
  getSkeletonVariantDuration,
  resolveSkeletonA11yProps,
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonText,
  ShimmerSkeleton,
  skeletonRoundedClasses,
  skeletonVariantDefaultDuration,
};
export default Skeleton;
export type {
  SkeletonProps,
  SkeletonProps as ShimmerSkeletonProps,
  SkeletonRounded,
  SkeletonVariant,
};
