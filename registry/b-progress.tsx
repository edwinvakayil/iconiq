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
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

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
        className="absolute inset-y-0 left-0 w-[38%] rounded-full [--progress-indeterminate-core:color-mix(in_srgb,var(--ic-foreground)_16%,transparent)] [--progress-indeterminate-soft:color-mix(in_srgb,var(--ic-foreground)_8%,transparent)] dark:[--progress-indeterminate-core:color-mix(in_srgb,var(--ic-foreground)_14%,transparent)] dark:[--progress-indeterminate-soft:color-mix(in_srgb,var(--ic-foreground)_7%,transparent)]"
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
