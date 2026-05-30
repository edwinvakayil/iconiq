"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

const DEFAULT_VALUE = 64;

const fillSpring = {
  type: "spring" as const,
  stiffness: 84,
  damping: 18,
  mass: 1.14,
  restDelta: 0.001,
};

const shellSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
  mass: 0.78,
};

const indeterminateTransition = {
  duration: 1.55,
  ease: [0.24, 0.04, 0.2, 1] as const,
  repeat: Number.POSITIVE_INFINITY,
};

export interface ProgressProps extends ReducedMotionProp {
  ariaLabel?: string;
  className?: string;
  formatValue?: (value: number, percent: number) => string;
  getValueLabel?: (value: number, percent: number) => string;
  helper?: string;
  indeterminateLabel?: string;
  label?: string;
  max?: number;
  min?: number;
  showValue?: boolean;
  value?: number | null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveBounds(min: number, max: number) {
  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
  };
}

function toPercent(value: number, min: number, max: number) {
  const range = max - min;
  if (range <= 0) {
    return 0;
  }

  return ((value - min) / range) * 100;
}

function resolveDisplayValue(
  actualValue: number,
  percent: number,
  formatValue?: (value: number, percent: number) => string
) {
  if (formatValue) {
    return formatValue(actualValue, percent);
  }

  return `${Math.round(percent)}%`;
}

function resolveAriaValueText(
  actualValue: number | null,
  percent: number,
  indeterminateLabel: string,
  getValueLabel?: (value: number, percent: number) => string,
  formatValue?: (value: number, percent: number) => string
) {
  if (actualValue === null) {
    return indeterminateLabel;
  }

  if (getValueLabel) {
    return getValueLabel(actualValue, percent);
  }

  return resolveDisplayValue(actualValue, percent, formatValue);
}

function ProgressHeader({
  displayValue,
  helper,
  label,
  reduceMotion,
  showValue,
}: {
  displayValue: string | MotionValue<string>;
  helper?: string;
  label?: string;
  reduceMotion: boolean;
  showValue: boolean;
}) {
  if (!(label || helper || showValue)) {
    return null;
  }

  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-1">
        {label ? (
          <ProgressPrimitive.Label className="font-medium text-[12px] text-foreground/90 tracking-[-0.02em] sm:text-[13px]">
            {label}
          </ProgressPrimitive.Label>
        ) : null}
        {helper ? (
          <p className="max-w-xl text-[12px] text-muted-foreground leading-5 sm:text-[13px]">
            {helper}
          </p>
        ) : null}
      </div>

      {showValue ? (
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 font-medium text-[12px] text-muted-foreground tabular-nums tracking-[-0.02em] sm:text-[13px]"
          transition={reduceMotion ? { duration: 0 } : shellSpring}
        >
          {displayValue}
        </motion.span>
      ) : null}
    </div>
  );
}

function DeterminateFill({ fillScale }: { fillScale: MotionValue<number> }) {
  return (
    <motion.div
      className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-foreground dark:bg-white"
      style={{ scaleX: fillScale }}
    />
  );
}

function IndeterminateFill({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden rounded-full"
      >
        <div className="absolute inset-y-0 left-[34%] w-[30%] rounded-full bg-foreground/16 dark:bg-white/[0.12]" />
      </div>
    );
  }

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
      <motion.div
        animate={{
          opacity: [0, 0.92, 0.92, 0],
          scaleX: [0.94, 1, 0.96],
          x: ["-44%", "238%"],
        }}
        className="absolute inset-y-0 left-0 w-[38%] rounded-full [--progress-indeterminate-core:color-mix(in_srgb,var(--foreground)_16%,transparent)] [--progress-indeterminate-soft:color-mix(in_srgb,var(--foreground)_8%,transparent)] dark:[--progress-indeterminate-core:color-mix(in_srgb,var(--foreground)_14%,transparent)] dark:[--progress-indeterminate-soft:color-mix(in_srgb,var(--foreground)_7%,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, var(--progress-indeterminate-soft) 16%, var(--progress-indeterminate-core) 50%, var(--progress-indeterminate-soft) 84%, transparent 100%)",
        }}
        transition={{
          ...indeterminateTransition,
          times: [0, 0.14, 0.84, 1],
        }}
      />
    </div>
  );
}

export function Progress({
  ariaLabel,
  className,
  formatValue,
  getValueLabel,
  helper,
  indeterminateLabel = "In progress",
  label,
  max = 100,
  min = 0,
  showValue = true,
  reducedMotion,
  value = DEFAULT_VALUE,
}: ProgressProps) {
  const resolveReducedMotion = useResolvedReducedMotion(reducedMotion);
  const bounds = resolveBounds(min, max);
  const clampedValue =
    value === null
      ? null
      : clamp(value ?? DEFAULT_VALUE, bounds.min, bounds.max);
  const progress =
    clampedValue === null ? 0 : toPercent(clampedValue, bounds.min, bounds.max);
  const progressTargetMV = useMotionValue(progress);
  const smoothProgressMV = useSpring(progressTargetMV, fillSpring);
  const fillScale = useTransform(smoothProgressMV, (currentProgress) => {
    return currentProgress / 100;
  });
  const displayValue = useTransform(smoothProgressMV, (currentProgress) => {
    const actualValue =
      bounds.min + ((bounds.max - bounds.min) * currentProgress) / 100;

    return resolveDisplayValue(actualValue, currentProgress, formatValue);
  });

  React.useEffect(() => {
    if (clampedValue === null || resolveReducedMotion) {
      progressTargetMV.jump(progress);
      smoothProgressMV.jump(progress);
      return;
    }

    progressTargetMV.set(progress);
  }, [
    clampedValue,
    progress,
    progressTargetMV,
    resolveReducedMotion,
    smoothProgressMV,
  ]);

  const renderedValue =
    clampedValue === null ? indeterminateLabel : displayValue;

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <ProgressPrimitive.Root
        aria-label={ariaLabel ?? (label ? undefined : "Progress")}
        className={cn(componentThemeClassName, "w-full space-y-3", className)}
        getAriaValueText={(_, actualValue) => {
          const currentPercent =
            actualValue === null
              ? 0
              : toPercent(actualValue, bounds.min, bounds.max);
          return resolveAriaValueText(
            actualValue,
            currentPercent,
            indeterminateLabel,
            getValueLabel,
            formatValue
          );
        }}
        max={bounds.max}
        min={bounds.min}
        value={clampedValue}
      >
        <ProgressHeader
          displayValue={renderedValue}
          helper={helper}
          label={label}
          reduceMotion={resolveReducedMotion}
          showValue={showValue}
        />

        <ProgressPrimitive.Track className="relative h-2.5 overflow-hidden rounded-full bg-foreground/8 dark:bg-white/[0.08]">
          <ProgressPrimitive.Indicator className="absolute inset-y-0 left-0 opacity-0" />
          {clampedValue === null ? (
            <IndeterminateFill reduceMotion={resolveReducedMotion} />
          ) : (
            <DeterminateFill fillScale={fillScale} />
          )}
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
    </ReducedMotionConfig>
  );
}

export { Progress as progress };
