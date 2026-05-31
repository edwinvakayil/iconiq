"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  animate,
  type MotionValue,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useId, useState } from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps extends ReducedMotionProp {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  showValue?: boolean;
  valueDecimals?: number;
  formatValue?: (value: number) => string;
  label?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  marks?: SliderMark[];
  className?: string;
}

function SliderMarks({
  marks,
  range,
  resolvedMin,
}: {
  marks: SliderMark[];
  range: number;
  resolvedMin: number;
}) {
  if (marks.length === 0) {
    return null;
  }

  const hasMarkLabels = marks.some((mark) => mark.label);

  return (
    <div
      aria-hidden
      className={`pointer-events-none relative mt-2 ${
        hasMarkLabels ? "h-8" : "h-3"
      }`}
    >
      {marks.map((mark) => {
        const left =
          range === 0 ? "0%" : `${((mark.value - resolvedMin) / range) * 100}%`;

        return (
          <div
            className="absolute top-0 -translate-x-1/2 text-center"
            key={`${mark.value}-${mark.label ?? "tick"}`}
            style={{ left }}
          >
            <span className="mx-auto block h-2 w-px rounded-full bg-foreground/25" />
            {mark.label ? (
              <span className="mt-1 block whitespace-nowrap font-medium text-[11px] text-muted-foreground">
                {mark.label}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function SliderVisualShell({
  active,
  isDragging,
  isHovered,
  leftPercent,
  widthPercent,
}: {
  active: boolean;
  isDragging: boolean;
  isHovered: boolean;
  leftPercent: MotionValue<string>;
  widthPercent: MotionValue<string>;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <motion.div
        animate={{ height: active ? 6 : 4 }}
        className="absolute top-1/2 right-0 left-0 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/15"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 28,
          mass: 0.8,
        }}
      />

      <motion.div
        animate={{ height: active ? 6 : 4 }}
        className="absolute top-1/2 left-0 origin-left -translate-y-1/2 overflow-hidden rounded-full bg-foreground"
        style={{ width: widthPercent }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 28,
          mass: 0.8,
        }}
      />

      <motion.div
        animate={{
          scale: isDragging ? 1.15 : isHovered ? 1.08 : 1,
        }}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ left: leftPercent }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 22,
          mass: 0.7,
        }}
      >
        <div className="relative h-4 w-4 rounded-full border-[1.5px] border-foreground bg-background shadow-sm" />
      </motion.div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPrecision(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const normalized = value.toString().toLowerCase();

  if (normalized.includes("e-")) {
    const [base, exponent] = normalized.split("e-");
    return (base.split(".")[1]?.length ?? 0) + Number(exponent);
  }

  return normalized.split(".")[1]?.length ?? 0;
}

function snapValue(raw: number, min: number, max: number, step: number) {
  const safeStep = step > 0 ? step : 1;
  const precision = Math.max(
    getPrecision(safeStep),
    getPrecision(min),
    getPrecision(max)
  );
  const stepped = min + Math.round((raw - min) / safeStep) * safeStep;
  return clamp(Number(stepped.toFixed(precision)), min, max);
}

function resolveBlurTarget(
  currentTarget: EventTarget & HTMLSpanElement,
  relatedTarget: EventTarget | null
) {
  return !currentTarget.contains(relatedTarget as Node | null);
}

function resolveSliderPrimitiveValue(
  nextValues: readonly number[],
  min: number,
  max: number,
  step: number
) {
  return snapValue(nextValues[0] ?? min, min, max, step);
}

export function Slider({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onValueCommit,
  showValue = true,
  valueDecimals = 0,
  formatValue,
  label,
  ariaLabel,
  ariaLabelledBy,
  marks,
  reducedMotion,
  className,
}: SliderProps) {
  const labelId = useId();
  const resolvedMin = Math.min(min, max);
  const resolvedMax = Math.max(min, max);
  const safeStep = step > 0 ? step : 1;
  const safeValueDecimals = Math.max(0, valueDecimals);
  const range = resolvedMax - resolvedMin;
  const [internalValue, setInternalValue] = useState(() =>
    snapValue(
      controlledValue ?? defaultValue,
      resolvedMin,
      resolvedMax,
      safeStep
    )
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (controlledValue !== undefined) {
      return;
    }

    setInternalValue((current) => {
      const next = snapValue(current, resolvedMin, resolvedMax, safeStep);
      return current === next ? current : next;
    });
  }, [controlledValue, resolvedMin, resolvedMax, safeStep]);

  const value =
    controlledValue === undefined
      ? internalValue
      : snapValue(controlledValue, resolvedMin, resolvedMax, safeStep);
  const progress = range === 0 ? 0 : ((value - resolvedMin) / range) * 100;

  const progressMV = useMotionValue(progress);
  const widthPercent = useTransform(progressMV, (currentProgress) => {
    return `${currentProgress}%`;
  });
  const leftPercent = useTransform(progressMV, (currentProgress) => {
    return `${currentProgress}%`;
  });
  const resolveReducedMotion = useResolvedReducedMotion(reducedMotion);
  const displayValue = useTransform(progressMV, (currentProgress) => {
    const nextValue = snapValue(
      resolvedMin + (currentProgress / 100) * range,
      resolvedMin,
      resolvedMax,
      safeStep
    );

    return formatValue
      ? formatValue(nextValue)
      : nextValue.toFixed(safeValueDecimals);
  });

  useEffect(() => {
    if (resolveReducedMotion) {
      progressMV.set(progress);
      return;
    }

    const controls = animate(progressMV, progress, {
      type: "spring",
      stiffness: 180,
      damping: 26,
      mass: 0.9,
      restDelta: 0.001,
    });

    return controls.stop;
  }, [progress, progressMV, resolveReducedMotion]);

  const normalizedMarks = (marks ?? [])
    .map((mark) => ({
      ...mark,
      value: clamp(mark.value, resolvedMin, resolvedMax),
    }))
    .sort((firstMark, secondMark) => firstMark.value - secondMark.value);
  const active = isDragging || isHovered || isFocused;
  const formattedValue = formatValue
    ? formatValue(value)
    : value.toFixed(safeValueDecimals);

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <div
        className={cn(componentThemeClassName, "w-full select-none", className)}
      >
        {(label || showValue) && (
          <div className="mb-3 flex items-baseline justify-between">
            {label ? (
              <span
                className="font-medium text-muted-foreground text-sm tracking-wide"
                id={labelId}
              >
                {label}
              </span>
            ) : null}
            {showValue ? (
              <motion.span className="font-semibold text-foreground text-sm tabular-nums">
                {displayValue}
              </motion.span>
            ) : null}
          </div>
        )}

        <div className="relative">
          <SliderPrimitive.Root
            className="relative flex h-11 w-full cursor-pointer items-center rounded-full outline-none focus-within:outline-2 focus-within:outline-foreground/35 focus-within:outline-offset-4"
            max={resolvedMax}
            min={resolvedMin}
            onBlurCapture={(event) => {
              if (resolveBlurTarget(event.currentTarget, event.relatedTarget)) {
                setIsFocused(false);
              }
            }}
            onFocusCapture={() => {
              setIsFocused(true);
            }}
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
            onPointerCancelCapture={() => {
              setIsDragging(false);
            }}
            onPointerDownCapture={() => {
              setIsDragging(true);
            }}
            onPointerUpCapture={() => {
              setIsDragging(false);
            }}
            onValueChange={(nextValues) => {
              const nextValue = resolveSliderPrimitiveValue(
                nextValues,
                resolvedMin,
                resolvedMax,
                safeStep
              );

              if (controlledValue === undefined) {
                setInternalValue(nextValue);
              }

              onChange?.(nextValue);
            }}
            onValueCommit={(nextValues) => {
              const nextValue = resolveSliderPrimitiveValue(
                nextValues,
                resolvedMin,
                resolvedMax,
                safeStep
              );

              onValueCommit?.(nextValue);
            }}
            step={safeStep}
            style={{ touchAction: "pan-y" }}
            value={[value]}
          >
            <SliderPrimitive.Track className="absolute top-1/2 right-0 left-0 h-4 -translate-y-1/2 opacity-0">
              <SliderPrimitive.Range className="absolute inset-y-0 left-0 h-full" />
            </SliderPrimitive.Track>

            <SliderPrimitive.Thumb
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy ?? (label ? labelId : undefined)}
              aria-valuetext={formatValue ? formattedValue : undefined}
              className="block h-4 w-4 opacity-0 outline-none"
            />

            <SliderVisualShell
              active={active}
              isDragging={isDragging}
              isHovered={isHovered}
              leftPercent={leftPercent}
              widthPercent={widthPercent}
            />
          </SliderPrimitive.Root>

          <SliderMarks
            marks={normalizedMarks}
            range={range}
            resolvedMin={resolvedMin}
          />
        </div>
      </div>
    </ReducedMotionConfig>
  );
}

export { Slider as slider };
