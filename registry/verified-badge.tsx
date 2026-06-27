"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] [--verified-badge-color:var(--ic-brand)] [--verified-badge-gold:#ca8a04] [--verified-badge-neutral:var(--ic-muted-foreground)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)] dark:[--verified-badge-gold:#eab308]";

export type VerifiedBadgeVariant = "shimmer" | "static";
export type VerifiedBadgeSize = "sm" | "md" | "lg";
export type VerifiedBadgeTone = "brand" | "gold" | "neutral";

const verifiedBadgeSizePixels = {
  sm: 18,
  md: 22,
  lg: 28,
} as const satisfies Record<VerifiedBadgeSize, number>;

const verifiedBadgeToneClassNames = {
  brand: "text-[var(--verified-badge-color)]",
  gold: "text-[var(--verified-badge-gold)]",
  neutral: "text-[var(--verified-badge-neutral)]",
} as const satisfies Record<VerifiedBadgeTone, string>;

export function resolveVerifiedBadgePixelSize(
  size: VerifiedBadgeSize | number = "md"
): number {
  if (typeof size === "number") {
    if (!Number.isFinite(size) || size <= 0) {
      return verifiedBadgeSizePixels.md;
    }

    return size;
  }

  return verifiedBadgeSizePixels[size];
}

export function resolveVerifiedBadgeStrokeWidth(pixelSize: number): number {
  return Math.max(2, Math.min(4, pixelSize * 0.16));
}

export function resolveVerifiedBadgeA11yProps({
  ariaLabel = "Verified",
  decorative = false,
}: {
  ariaLabel?: string;
  decorative?: boolean;
}) {
  if (decorative) {
    return { "aria-hidden": true as const };
  }

  return {
    "aria-label": ariaLabel,
    role: "img" as const,
  };
}

export function shouldRenderVerifiedBadgeShimmer({
  mounted = true,
  prefersReducedMotion,
  variant,
}: {
  mounted?: boolean;
  prefersReducedMotion: boolean | null;
  variant: VerifiedBadgeVariant;
}) {
  return mounted && variant === "shimmer" && prefersReducedMotion !== true;
}

export interface VerifiedBadgeProps
  extends Omit<
    ComponentPropsWithoutRef<"span">,
    "children" | "role" | "aria-hidden"
  > {
  /** @default false */
  decorative?: boolean;
  /** Preset or explicit pixel width/height. @default "md" (22px) */
  size?: VerifiedBadgeSize | number;
  /** @default brand */
  tone?: VerifiedBadgeTone;
  /** @default shimmer */
  variant?: VerifiedBadgeVariant;
}

const SCALLOP_PATH =
  "M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816z";

const scallopMaskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><path fill="white" d="${SCALLOP_PATH}"/></svg>`;
const scallopMaskUrl = `url("data:image/svg+xml,${encodeURIComponent(scallopMaskSvg)}")`;

const scallopMaskStyle: CSSProperties = {
  maskImage: scallopMaskUrl,
  WebkitMaskImage: scallopMaskUrl,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
};

const ScallopShape = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 22 22">
    <path d={SCALLOP_PATH} fill="currentColor" />
  </svg>
);

const ScallopShimmer = ({ className }: { className?: string }) => {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      style={scallopMaskStyle}
    >
      <motion.span
        animate={{ x: ["-100%", "200%"] }}
        className="absolute inset-0"
        initial={{ x: "-100%" }}
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
        }}
        transition={{
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1.5,
          ease: "easeInOut",
        }}
      />
    </span>
  );
};

const VerifiedBadge = forwardRef<HTMLSpanElement, VerifiedBadgeProps>(
  function VerifiedBadge(
    {
      variant = "shimmer",
      size = "md",
      tone = "brand",
      decorative = false,
      className,
      "aria-label": ariaLabel = "Verified",
      style,
      ...props
    },
    ref
  ) {
    const [mounted, setMounted] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
      setMounted(true);
    }, []);

    const pixelSize = resolveVerifiedBadgePixelSize(size);
    const checkSize = pixelSize * 0.5;
    const strokeWidth = resolveVerifiedBadgeStrokeWidth(pixelSize);
    const a11yProps = resolveVerifiedBadgeA11yProps({ ariaLabel, decorative });
    const showShimmer = shouldRenderVerifiedBadgeShimmer({
      mounted,
      prefersReducedMotion,
      variant,
    });

    return (
      <span
        className={cn(
          componentThemeClassName,
          "relative inline-block shrink-0 align-middle",
          verifiedBadgeToneClassNames[tone],
          className
        )}
        ref={ref}
        style={{ width: pixelSize, height: pixelSize, ...style }}
        {...props}
        {...a11yProps}
      >
        <ScallopShape className="absolute inset-0 h-full w-full" />
        {showShimmer ? <ScallopShimmer /> : null}

        <svg
          aria-hidden="true"
          className="absolute inset-0 z-10 m-auto"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          style={{ width: checkSize, height: checkSize }}
          viewBox="0 0 24 24"
        >
          <polyline points="5 12.5 10 17.5 19 7.5" />
        </svg>
      </span>
    );
  }
);

VerifiedBadge.displayName = "VerifiedBadge";

export { VerifiedBadge };
export default VerifiedBadge;
