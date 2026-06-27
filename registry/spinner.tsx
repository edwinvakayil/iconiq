"use client";

import { motion } from "motion/react";
import {
  type ComponentProps,
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  useLayoutEffect,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const MotionSpan = motion.create("span");
const MATRIX_STYLE_ID = "iconiq-spinner-matrix-styles";
const MATRIX_GRID = 5;

const MATRIX_CSS = `
@keyframes iconiq-spinner-matrix-wave {
  0%,
  100% {
    opacity: 0.16;
    transform: scale(0.88);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.iconiq-spinner-matrix-dot {
  animation: iconiq-spinner-matrix-wave var(--iconiq-matrix-duration, 2.8s) ease-in-out infinite;
  animation-delay: calc(var(--iconiq-matrix-phase, 0) * var(--iconiq-matrix-duration, 2.8s) * -1);
  background-color: var(--ic-primary);
  transform-origin: center;
}
`;

type SpinnerSize = "sm" | "md" | "lg";
type SpinnerVariant = "ring" | "dots" | "matrix";

const spinnerSizeClasses = {
  sm: {
    root: "size-4",
    border: "border",
    gap: "gap-[18%]",
  },
  md: {
    root: "size-6",
    border: "border-2",
    gap: "gap-[18%]",
  },
  lg: {
    root: "size-8",
    border: "border-2",
    gap: "gap-[18%]",
  },
} as const satisfies Record<
  SpinnerSize,
  { root: string; border: string; gap: string }
>;

const spinnerMatrixConfig = {
  sm: {
    root: "size-6",
    gap: "gap-[10%]",
  },
  md: {
    root: "size-7",
    gap: "gap-[9%]",
  },
  lg: {
    root: "size-9",
    gap: "gap-[10%]",
  },
} as const satisfies Record<SpinnerSize, { root: string; gap: string }>;

const spinnerVariantDuration = {
  ring: 1,
  dots: 0.9,
  matrix: 2.8,
} as const satisfies Record<SpinnerVariant, number>;

function ensureMatrixStyles() {
  if (typeof document === "undefined") {
    return;
  }

  let style = document.getElementById(
    MATRIX_STYLE_ID
  ) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = MATRIX_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = MATRIX_CSS;
}

function getMatrixGridSize() {
  return MATRIX_GRID;
}

function getMatrixDiagonalPhase(row: number, col: number, gridSize: number) {
  if (gridSize <= 1) {
    return 0;
  }

  return (row + col) / (2 * (gridSize - 1));
}

function buildMatrixCells(gridSize: number) {
  return Array.from({ length: gridSize * gridSize }, (_, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    return {
      row,
      col,
      index,
      phase: getMatrixDiagonalPhase(row, col, gridSize),
    };
  });
}

function resolveSpinnerA11yProps({
  decorative = false,
}: {
  decorative?: boolean;
}) {
  if (decorative) {
    return { "aria-hidden": true as const };
  }

  return {
    "aria-label": "Loading",
    "aria-live": "polite" as const,
    role: "status" as const,
  };
}

interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  decorative?: boolean;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, decorative = false, size = "md", variant = "ring", ...props },
  ref
) {
  const sizeClasses = spinnerSizeClasses[size];
  const variantDuration = spinnerVariantDuration[variant];
  const a11yProps = resolveSpinnerA11yProps({ decorative });

  useLayoutEffect(() => {
    if (variant === "matrix") {
      ensureMatrixStyles();
    }
  }, [variant]);

  if (variant === "dots") {
    const dotDelayStep = variantDuration * 0.167;

    return (
      <span
        className={cn(
          componentThemeClassName,
          "inline-flex items-center justify-center",
          sizeClasses.root,
          sizeClasses.gap,
          className
        )}
        ref={ref}
        {...a11yProps}
        {...props}
      >
        {[0, 1, 2].map((index) => (
          <motion.span
            animate={{ y: ["0%", "-55%", "0%"] }}
            aria-hidden
            className="aspect-square w-[22%] shrink-0 rounded-full bg-primary"
            key={index}
            transition={{
              duration: variantDuration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * dotDelayStep,
            }}
          />
        ))}
      </span>
    );
  }

  if (variant === "matrix") {
    const matrixConfig = spinnerMatrixConfig[size];
    const cells = buildMatrixCells(MATRIX_GRID);

    return (
      <span
        className={cn(
          componentThemeClassName,
          "inline-grid shrink-0 grid-cols-5 place-items-center",
          matrixConfig.root,
          matrixConfig.gap,
          className
        )}
        ref={ref}
        {...a11yProps}
        {...props}
      >
        {cells.map(({ index, phase }) => (
          <span
            aria-hidden
            className="iconiq-spinner-matrix-dot aspect-square w-full rounded-full"
            key={index}
            style={
              {
                "--iconiq-matrix-duration": `${variantDuration}s`,
                "--iconiq-matrix-phase": phase,
              } as CSSProperties
            }
          />
        ))}
      </span>
    );
  }

  return (
    <MotionSpan
      animate={{ rotate: 360 }}
      className={cn(
        componentThemeClassName,
        "box-border inline-flex shrink-0 rounded-full border-muted border-t-primary",
        sizeClasses.root,
        sizeClasses.border,
        className
      )}
      ref={ref}
      transition={{
        duration: variantDuration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      {...a11yProps}
      {...(props as ComponentProps<typeof MotionSpan>)}
    />
  );
});

Spinner.displayName = "Spinner";

export {
  buildMatrixCells,
  getMatrixDiagonalPhase,
  getMatrixGridSize,
  resolveSpinnerA11yProps,
  Spinner,
  spinnerMatrixConfig,
  spinnerSizeClasses,
  spinnerVariantDuration,
};
export default Spinner;
export type { SpinnerProps, SpinnerSize, SpinnerVariant };
