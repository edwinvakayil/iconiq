"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import {
  animate,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

export interface SliderMark {
  value: number;
  label?: string;
}

export type SliderSize = "sm" | "md" | "lg";

export interface SliderProps {
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number | [number, number]) => void;
  onValueCommit?: (value: number | [number, number]) => void;
  showValue?: boolean;
  valueDecimals?: number;
  formatValue?: (value: number) => string;
  label?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  marks?: SliderMark[];
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  description?: ReactNode;
  errorMessage?: ReactNode;
  invalid?: boolean;
  ariaDescribedBy?: string;
  marksInteractive?: boolean;
  size?: SliderSize;
  inverted?: boolean;
  name?: string;
  id?: string;
  range?: boolean;
}

export const sliderSizeClasses = {
  sm: {
    hitAreaHorizontal: "h-9",
    thumb: "h-3 w-3",
    thumbBorder: "border",
    trackInactive: 3,
    trackActive: 5,
  },
  md: {
    hitAreaHorizontal: "h-11",
    thumb: "h-4 w-4",
    thumbBorder: "border-[1.5px]",
    trackInactive: 4,
    trackActive: 6,
  },
  lg: {
    hitAreaHorizontal: "h-14",
    thumb: "h-5 w-5",
    thumbBorder: "border-2",
    trackInactive: 5,
    trackActive: 7,
  },
} as const satisfies Record<
  SliderSize,
  {
    hitAreaHorizontal: string;
    thumb: string;
    thumbBorder: string;
    trackInactive: number;
    trackActive: number;
  }
>;

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

function snapRangeValue(
  raw: readonly [number, number] | number[],
  min: number,
  max: number,
  step: number
): [number, number] {
  const first = snapValue(raw[0] ?? min, min, max, step);
  const second = snapValue(raw[1] ?? max, min, max, step);
  return first <= second ? [first, second] : [second, first];
}

function formatSliderDisplayValue(
  value: number | [number, number],
  options: {
    formatValue?: (value: number) => string;
    range?: boolean;
    valueDecimals?: number;
  }
) {
  const { formatValue, range = false, valueDecimals = 0 } = options;

  if (range && Array.isArray(value)) {
    const [low, high] = value;
    const lowText = formatValue ? formatValue(low) : low.toFixed(valueDecimals);
    const highText = formatValue
      ? formatValue(high)
      : high.toFixed(valueDecimals);
    return `${lowText} – ${highText}`;
  }

  const numericValue = Array.isArray(value) ? (value[0] ?? 0) : value;
  return formatValue
    ? formatValue(numericValue)
    : numericValue.toFixed(valueDecimals);
}

function resolveSliderAccessibleName({
  ariaLabel,
  ariaLabelledBy,
  label,
  labelId,
}: {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  label?: string;
  labelId?: string;
}) {
  if (ariaLabelledBy || label) {
    return {
      ariaLabel: undefined,
      ariaLabelledBy: ariaLabelledBy ?? labelId,
    };
  }

  return {
    ariaLabel: ariaLabel ?? "Slider",
    ariaLabelledBy: undefined,
  };
}

function resolveSliderFieldMeta({
  ariaDescribedByProp,
  description,
  errorMessage,
  generatedId,
  id,
  invalid,
}: {
  ariaDescribedByProp?: string;
  description?: ReactNode;
  errorMessage?: ReactNode;
  generatedId: string;
  id?: string;
  invalid?: boolean;
}) {
  const sliderId = id ?? generatedId;
  const descriptionId = description ? `${sliderId}-description` : undefined;
  const errorId = errorMessage ? `${sliderId}-error` : undefined;
  const showInvalid = Boolean(invalid) || Boolean(errorMessage);

  return {
    describedBy: [ariaDescribedByProp, descriptionId, errorId]
      .filter(Boolean)
      .join(" "),
    descriptionId,
    errorId,
    showInvalid,
    sliderId,
  };
}

function resolveBlurTarget(
  currentTarget: EventTarget & HTMLDivElement,
  relatedTarget: EventTarget | null
) {
  return !currentTarget.contains(relatedTarget as Node | null);
}

function isDocumentRtl() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.dir === "rtl";
}

function valueToProgress(
  currentValue: number,
  resolvedMin: number,
  resolvedMax: number
) {
  const span = resolvedMax - resolvedMin;
  return span === 0 ? 0 : ((currentValue - resolvedMin) / span) * 100;
}

function progressToValue(
  progress: number,
  resolvedMin: number,
  resolvedMax: number,
  safeStep: number
) {
  const span = resolvedMax - resolvedMin;
  const raw = resolvedMin + (progress / 100) * span;
  return snapValue(raw, resolvedMin, resolvedMax, safeStep);
}

function resolveInitialSliderValue(
  controlledValue: number | [number, number] | undefined,
  defaultValue: number | [number, number] | undefined,
  range: boolean,
  resolvedMin: number,
  resolvedMax: number,
  safeStep: number,
  rangeSpan: number
) {
  const initial = controlledValue ?? defaultValue ?? (range ? [25, 75] : 50);

  if (range) {
    const tuple = Array.isArray(initial)
      ? initial
      : [resolvedMin + rangeSpan * 0.25, resolvedMin + rangeSpan * 0.75];
    return snapRangeValue(tuple, resolvedMin, resolvedMax, safeStep);
  }

  const numeric = Array.isArray(initial) ? (initial[0] ?? 50) : initial;
  return snapValue(numeric, resolvedMin, resolvedMax, safeStep);
}

function resolveControlledSliderValue(
  controlledValue: number | [number, number] | undefined,
  internalValue: number | [number, number],
  range: boolean,
  resolvedMin: number,
  resolvedMax: number,
  safeStep: number
) {
  if (controlledValue === undefined) {
    return internalValue;
  }

  if (range) {
    return snapRangeValue(
      Array.isArray(controlledValue)
        ? controlledValue
        : [controlledValue, controlledValue],
      resolvedMin,
      resolvedMax,
      safeStep
    );
  }

  return snapValue(
    Array.isArray(controlledValue)
      ? (controlledValue[0] ?? resolvedMin)
      : controlledValue,
    resolvedMin,
    resolvedMax,
    safeStep
  );
}

function sliderValuesEqual(
  current: number | [number, number],
  next: number | [number, number],
  range: boolean
) {
  if (range) {
    const currentTuple = Array.isArray(current) ? current : [current, current];
    const nextTuple = Array.isArray(next) ? next : [next, next];
    return currentTuple[0] === nextTuple[0] && currentTuple[1] === nextTuple[1];
  }

  const currentValue = Array.isArray(current) ? (current[0] ?? 0) : current;
  const nextValue = Array.isArray(next) ? (next[0] ?? 0) : next;
  return currentValue === nextValue;
}

function invertSliderValue(
  value: number,
  resolvedMin: number,
  resolvedMax: number
) {
  return resolvedMin + resolvedMax - value;
}

function toPrimitiveValue(
  value: number | [number, number],
  isRange: boolean,
  inverted: boolean,
  resolvedMin: number,
  resolvedMax: number
): number | [number, number] {
  if (!inverted) {
    return value;
  }

  if (isRange) {
    const [low, high] = value as [number, number];
    return [
      invertSliderValue(high, resolvedMin, resolvedMax),
      invertSliderValue(low, resolvedMin, resolvedMax),
    ];
  }

  return invertSliderValue(value as number, resolvedMin, resolvedMax);
}

function fromPrimitiveValue(
  nextValue: number | readonly number[],
  isRange: boolean,
  inverted: boolean,
  resolvedMin: number,
  resolvedMax: number,
  safeStep: number
): number | [number, number] {
  if (!inverted) {
    if (isRange) {
      const tuple = Array.isArray(nextValue)
        ? nextValue
        : [nextValue, nextValue];
      return snapRangeValue(tuple, resolvedMin, resolvedMax, safeStep);
    }

    return snapValue(
      Array.isArray(nextValue) ? (nextValue[0] ?? resolvedMin) : nextValue,
      resolvedMin,
      resolvedMax,
      safeStep
    );
  }

  if (isRange) {
    const tuple = Array.isArray(nextValue) ? nextValue : [nextValue, nextValue];
    const low = invertSliderValue(
      tuple[1] ?? resolvedMax,
      resolvedMin,
      resolvedMax
    );
    const high = invertSliderValue(
      tuple[0] ?? resolvedMin,
      resolvedMin,
      resolvedMax
    );
    return snapRangeValue([low, high], resolvedMin, resolvedMax, safeStep);
  }

  const numeric = Array.isArray(nextValue)
    ? (nextValue[0] ?? resolvedMin)
    : nextValue;
  return snapValue(
    invertSliderValue(numeric, resolvedMin, resolvedMax),
    resolvedMin,
    resolvedMax,
    safeStep
  );
}

function toPrimitiveArray(
  value: number | [number, number],
  isRange: boolean,
  inverted: boolean,
  resolvedMin: number,
  resolvedMax: number
): number[] {
  const primitive = toPrimitiveValue(
    value,
    isRange,
    inverted,
    resolvedMin,
    resolvedMax
  );

  if (isRange) {
    const tuple = primitive as [number, number];
    return [tuple[0], tuple[1]];
  }

  return [primitive as number];
}

function resolveThumbAccessibleLabel(
  accessibleName: ReturnType<typeof resolveSliderAccessibleName>,
  thumbIndex: number,
  isRange: boolean
) {
  if (accessibleName.ariaLabelledBy) {
    return undefined;
  }

  const baseLabel = accessibleName.ariaLabel ?? "Slider";

  if (!isRange) {
    return baseLabel;
  }

  return thumbIndex === 0 ? `${baseLabel}, minimum` : `${baseLabel}, maximum`;
}

function SliderVisualShell({
  active,
  activeThumbIndex,
  fillLeftPercent,
  fillSizePercent,
  isDragging,
  isHovered,
  isRange,
  sizeClasses,
  thumbPercents,
}: {
  active: boolean;
  activeThumbIndex: number;
  fillLeftPercent: MotionValue<string>;
  fillSizePercent: MotionValue<string>;
  isDragging: boolean;
  isHovered: boolean;
  isRange: boolean;
  sizeClasses: (typeof sliderSizeClasses)[SliderSize];
  thumbPercents: MotionValue<string>[];
}) {
  const trackInactive = sizeClasses.trackInactive;
  const trackActive = sizeClasses.trackActive;
  const trackSize = active ? trackActive : trackInactive;
  const springTransition = {
    type: "spring" as const,
    stiffness: 200,
    damping: 28,
    mass: 0.8,
  };
  const thumbSpringTransition = {
    type: "spring" as const,
    stiffness: 220,
    damping: 22,
    mass: 0.7,
  };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <motion.div
        animate={{ height: trackSize }}
        className="absolute top-1/2 right-0 left-0 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/15"
        transition={springTransition}
      />

      <motion.div
        animate={{ height: trackSize }}
        className="absolute top-1/2 left-0 origin-left -translate-y-1/2 overflow-hidden rounded-full bg-foreground"
        style={{ left: fillLeftPercent, width: fillSizePercent }}
        transition={springTransition}
      />

      {thumbPercents.map((thumbPercent, index) => {
        const isActiveThumb = isDragging && activeThumbIndex === index;

        return (
          <motion.div
            animate={{
              scale: isActiveThumb ? 1.15 : isHovered ? 1.08 : 1,
            }}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            key={isRange ? `thumb-${index}` : "thumb"}
            style={{ left: thumbPercent }}
            transition={thumbSpringTransition}
          >
            <div
              className={cn(
                "relative rounded-full border-foreground bg-background shadow-sm",
                sizeClasses.thumb,
                sizeClasses.thumbBorder
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function SliderMarks({
  disabled,
  inverted,
  isRtl,
  marks,
  marksInteractive,
  onMarkActivate,
  rangeSpan,
  readOnly,
  resolvedMin,
}: {
  disabled?: boolean;
  inverted: boolean;
  isRtl: boolean;
  marks: SliderMark[];
  marksInteractive?: boolean;
  onMarkActivate: (value: number) => void;
  rangeSpan: number;
  readOnly?: boolean;
  resolvedMin: number;
}) {
  if (marks.length === 0) {
    return null;
  }

  const hasMarkLabels = marks.some((mark) => mark.label);
  const interactive = marksInteractive && !disabled && !readOnly;

  return (
    <div
      aria-hidden={!interactive}
      className={cn(
        "relative mt-2",
        hasMarkLabels ? "h-8" : "h-3",
        interactive ? "" : "pointer-events-none"
      )}
    >
      {marks.map((mark) => {
        let progress =
          rangeSpan === 0 ? 0 : ((mark.value - resolvedMin) / rangeSpan) * 100;

        if (isRtl) {
          progress = 100 - progress;
        }

        if (inverted) {
          progress = 100 - progress;
        }

        const positionStyle = { left: `${progress}%` };

        const content = (
          <>
            <span className="mx-auto block h-2 w-px rounded-full bg-foreground/25" />
            {mark.label ? (
              <span className="mt-1 block whitespace-nowrap font-medium text-[11px] text-muted-foreground">
                {mark.label}
              </span>
            ) : null}
          </>
        );

        if (interactive) {
          return (
            <button
              className="absolute top-0 -translate-x-1/2 text-center outline-none focus-visible:outline-2 focus-visible:outline-foreground/35 focus-visible:outline-offset-2"
              key={`${mark.value}-${mark.label ?? "tick"}`}
              onClick={() => {
                onMarkActivate(mark.value);
              }}
              style={positionStyle}
              type="button"
            >
              {content}
            </button>
          );
        }

        return (
          <div
            className="absolute top-0 -translate-x-1/2 text-center"
            key={`${mark.value}-${mark.label ?? "tick"}`}
            style={positionStyle}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

function SliderFieldMessages({
  description,
  descriptionId,
  errorId,
  errorMessage,
}: {
  description?: ReactNode;
  descriptionId?: string;
  errorId?: string;
  errorMessage?: ReactNode;
}) {
  if (!(description || errorMessage)) {
    return null;
  }

  return (
    <div className="mt-2 space-y-1">
      {description ? (
        <p
          className="text-muted-foreground text-xs leading-snug"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      {errorMessage ? (
        <p
          aria-live="polite"
          className="text-destructive text-xs leading-snug"
          id={errorId}
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: slider shell coordinates motion, range, pointer, and keyboard state in one place.
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value: controlledValue,
    defaultValue,
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
    className,
    disabled = false,
    readOnly = false,
    description,
    errorMessage,
    invalid = false,
    ariaDescribedBy,
    marksInteractive = false,
    size = "md",
    inverted = false,
    name,
    id,
    range = false,
  },
  ref
) {
  const generatedId = useId();
  const labelId = useId();
  const activeThumbIndexRef = useRef(0);
  const resolvedMin = Math.min(min, max);
  const resolvedMax = Math.max(min, max);
  const safeStep = step > 0 ? step : 1;
  const safeValueDecimals = Math.max(0, valueDecimals);
  const rangeSpan = resolvedMax - resolvedMin;
  const sizeClasses = sliderSizeClasses[size];
  const prefersReducedMotion = useReducedMotion() === true;
  const [isRtl, setIsRtl] = useState(false);
  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    () =>
      resolveInitialSliderValue(
        controlledValue,
        defaultValue,
        range,
        resolvedMin,
        resolvedMax,
        safeStep,
        rangeSpan
      )
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);

  const fieldMeta = resolveSliderFieldMeta({
    ariaDescribedByProp: ariaDescribedBy,
    description,
    errorMessage,
    generatedId,
    id,
    invalid,
  });
  const accessibleName = resolveSliderAccessibleName({
    ariaLabel,
    ariaLabelledBy,
    label,
    labelId,
  });

  useEffect(() => {
    setIsRtl(isDocumentRtl());
  }, []);

  useEffect(() => {
    if (controlledValue !== undefined) {
      return;
    }

    setInternalValue((current) => {
      if (range) {
        const tuple = Array.isArray(current)
          ? current
          : [resolvedMin, resolvedMax];
        const next = snapRangeValue(tuple, resolvedMin, resolvedMax, safeStep);
        return next[0] === tuple[0] && next[1] === tuple[1] ? current : next;
      }

      const numeric = Array.isArray(current)
        ? (current[0] ?? resolvedMin)
        : current;
      const next = snapValue(numeric, resolvedMin, resolvedMax, safeStep);
      return current === next ? current : next;
    });
  }, [controlledValue, range, resolvedMin, resolvedMax, safeStep]);

  const value = resolveControlledSliderValue(
    controlledValue,
    internalValue,
    range,
    resolvedMin,
    resolvedMax,
    safeStep
  );

  const values: [number, number] = range
    ? (value as [number, number])
    : [value as number, value as number];
  const [lowValue, highValue] = values;
  const lowProgress = valueToProgress(lowValue, resolvedMin, resolvedMax);
  const highProgress = valueToProgress(highValue, resolvedMin, resolvedMax);
  const singleProgress = range
    ? lowProgress
    : valueToProgress(value as number, resolvedMin, resolvedMax);
  const fillStartProgress = range ? lowProgress : 0;
  const fillEndProgress = range ? highProgress : singleProgress;

  const lowProgressMV = useMotionValue(lowProgress);
  const highProgressMV = useMotionValue(highProgress);
  const singleProgressMV = useMotionValue(singleProgress);
  const fillStartMV = useMotionValue(fillStartProgress);
  const fillEndMV = useMotionValue(fillEndProgress);

  const lowThumbPercent = useTransform(
    lowProgressMV,
    (progress) => `${progress}%`
  );
  const highThumbPercent = useTransform(
    highProgressMV,
    (progress) => `${progress}%`
  );
  const singleThumbPercent = useTransform(
    singleProgressMV,
    (progress) => `${progress}%`
  );
  const thumbPercents = range
    ? [lowThumbPercent, highThumbPercent]
    : [singleThumbPercent];

  const fillLeftPercent = useTransform(
    fillStartMV,
    (progress) => `${progress}%`
  );
  const fillSizePercent = useTransform(
    [fillStartMV, fillEndMV],
    ([start, end]: number[]) => `${Math.max(0, end - start)}%`
  );

  const singleDisplayValue = useTransform(singleProgressMV, (progress) => {
    const resolved = progressToValue(
      progress,
      resolvedMin,
      resolvedMax,
      safeStep
    );

    return formatSliderDisplayValue(resolved, {
      formatValue,
      valueDecimals: safeValueDecimals,
    });
  });
  const rangeDisplayValue = useTransform(
    [lowProgressMV, highProgressMV],
    ([low, high]: number[]) => {
      const lowResolved = progressToValue(
        low,
        resolvedMin,
        resolvedMax,
        safeStep
      );
      const highResolved = progressToValue(
        high,
        resolvedMin,
        resolvedMax,
        safeStep
      );

      return formatSliderDisplayValue([lowResolved, highResolved], {
        formatValue,
        range: true,
        valueDecimals: safeValueDecimals,
      });
    }
  );

  const progressSpring = prefersReducedMotion
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: 180,
        damping: 26,
        mass: 0.9,
        restDelta: 0.001,
      };

  useEffect(() => {
    activeThumbIndexRef.current = activeThumbIndex;
  }, [activeThumbIndex]);

  useEffect(() => {
    const controls = [
      animate(lowProgressMV, lowProgress, progressSpring),
      animate(highProgressMV, highProgress, progressSpring),
      animate(singleProgressMV, singleProgress, progressSpring),
      animate(fillStartMV, fillStartProgress, progressSpring),
      animate(fillEndMV, fillEndProgress, progressSpring),
    ];

    return () => {
      for (const control of controls) {
        control.stop();
      }
    };
  }, [
    fillEndProgress,
    fillStartProgress,
    highProgress,
    highProgressMV,
    lowProgress,
    lowProgressMV,
    progressSpring,
    singleProgress,
    singleProgressMV,
    fillEndMV,
    fillStartMV,
  ]);

  const primitiveValue = toPrimitiveArray(
    value,
    range,
    inverted,
    resolvedMin,
    resolvedMax
  );

  const commitValue = useCallback(
    (
      nextPrimitiveValue: number | readonly number[],
      commit?: (resolved: number | [number, number]) => void
    ) => {
      if (disabled || readOnly) {
        return;
      }

      const resolved = fromPrimitiveValue(
        nextPrimitiveValue,
        range,
        inverted,
        resolvedMin,
        resolvedMax,
        safeStep
      );

      if (sliderValuesEqual(value, resolved, range)) {
        return;
      }

      if (controlledValue === undefined) {
        setInternalValue(resolved);
      }

      onChange?.(resolved);
      commit?.(resolved);
    },
    [
      controlledValue,
      disabled,
      inverted,
      onChange,
      range,
      readOnly,
      resolvedMax,
      resolvedMin,
      safeStep,
      value,
    ]
  );

  const handleMarkActivate = useCallback(
    (markValue: number) => {
      if (disabled || readOnly) {
        return;
      }

      if (range) {
        const current = value as [number, number];
        const lowDistance = Math.abs(current[0] - markValue);
        const highDistance = Math.abs(current[1] - markValue);
        const thumbIndex = lowDistance <= highDistance ? 0 : 1;
        setActiveThumbIndex(thumbIndex);
        activeThumbIndexRef.current = thumbIndex;

        const nextTuple: [number, number] = [...current];
        nextTuple[thumbIndex] = snapValue(
          markValue,
          resolvedMin,
          resolvedMax,
          safeStep
        );
        const resolved = snapRangeValue(
          nextTuple,
          resolvedMin,
          resolvedMax,
          safeStep
        );

        if (sliderValuesEqual(value, resolved, true)) {
          return;
        }

        if (controlledValue === undefined) {
          setInternalValue(resolved);
        }

        onChange?.(resolved);
        onValueCommit?.(resolved);
        return;
      }

      const resolved = snapValue(markValue, resolvedMin, resolvedMax, safeStep);

      if (sliderValuesEqual(value, resolved, false)) {
        return;
      }

      if (controlledValue === undefined) {
        setInternalValue(resolved);
      }

      onChange?.(resolved);
      onValueCommit?.(resolved);
    },
    [
      controlledValue,
      disabled,
      onChange,
      onValueCommit,
      range,
      readOnly,
      resolvedMax,
      resolvedMin,
      safeStep,
      value,
    ]
  );

  const normalizedMarks = (marks ?? [])
    .map((mark) => ({
      ...mark,
      value: clamp(mark.value, resolvedMin, resolvedMax),
    }))
    .sort((firstMark, secondMark) => firstMark.value - secondMark.value);
  const active = isDragging || isHovered || isFocused;

  const thumbClassName = cn("block opacity-0 outline-none", sizeClasses.thumb);
  const getThumbAriaValueText = useCallback(
    (_formattedValue: string, thumbValue: number) =>
      formatSliderDisplayValue(thumbValue, {
        formatValue,
        valueDecimals: safeValueDecimals,
      }),
    [formatValue, safeValueDecimals]
  );
  const getThumbAriaLabel = useCallback(
    (thumbIndex: number) =>
      resolveThumbAccessibleLabel(accessibleName, thumbIndex, range),
    [accessibleName, range]
  );

  return (
    <div
      className={cn(
        componentThemeClassName,
        "w-full select-none",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
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
              {range ? rangeDisplayValue : singleDisplayValue}
            </motion.span>
          ) : null}
        </div>
      )}

      <div className="relative">
        <SliderPrimitive.Root
          aria-label={
            accessibleName.ariaLabelledBy ? undefined : accessibleName.ariaLabel
          }
          aria-labelledby={accessibleName.ariaLabelledBy}
          className="relative"
          disabled={disabled}
          max={resolvedMax}
          min={resolvedMin}
          onValueChange={(nextValue) => {
            commitValue(nextValue);
          }}
          onValueCommitted={(nextValue) => {
            commitValue(nextValue, onValueCommit);
          }}
          step={safeStep}
          value={primitiveValue}
        >
          <div className="relative">
            <SliderPrimitive.Control
              aria-describedby={fieldMeta.describedBy || undefined}
              aria-invalid={fieldMeta.showInvalid || undefined}
              aria-orientation="horizontal"
              aria-readonly={readOnly || undefined}
              className={cn(
                "relative flex w-full cursor-pointer items-center rounded-full outline-none focus-within:outline-2 focus-within:outline-foreground/35 focus-within:outline-offset-4",
                sizeClasses.hitAreaHorizontal,
                (disabled || readOnly) && "cursor-not-allowed"
              )}
              id={fieldMeta.sliderId}
              onBlurCapture={(event) => {
                if (
                  resolveBlurTarget(event.currentTarget, event.relatedTarget)
                ) {
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
              ref={ref}
              style={{ touchAction: "pan-y" }}
            >
              <SliderPrimitive.Track className="absolute top-1/2 right-0 left-0 h-4 -translate-y-1/2 opacity-0">
                <SliderPrimitive.Indicator className="absolute inset-0" />
              </SliderPrimitive.Track>

              {range ? (
                <>
                  <SliderPrimitive.Thumb
                    className={thumbClassName}
                    getAriaLabel={
                      accessibleName.ariaLabelledBy
                        ? undefined
                        : () => getThumbAriaLabel(0) ?? "Slider, minimum"
                    }
                    getAriaValueText={getThumbAriaValueText}
                    index={0}
                    onFocus={() => {
                      setActiveThumbIndex(0);
                    }}
                  />
                  <SliderPrimitive.Thumb
                    className={thumbClassName}
                    getAriaLabel={
                      accessibleName.ariaLabelledBy
                        ? undefined
                        : () => getThumbAriaLabel(1) ?? "Slider, maximum"
                    }
                    getAriaValueText={getThumbAriaValueText}
                    index={1}
                    onFocus={() => {
                      setActiveThumbIndex(1);
                    }}
                  />
                </>
              ) : (
                <SliderPrimitive.Thumb
                  className={thumbClassName}
                  getAriaLabel={
                    accessibleName.ariaLabelledBy
                      ? undefined
                      : () => getThumbAriaLabel(0) ?? "Slider"
                  }
                  getAriaValueText={getThumbAriaValueText}
                  onFocus={() => {
                    setActiveThumbIndex(0);
                  }}
                />
              )}

              <SliderVisualShell
                active={active}
                activeThumbIndex={activeThumbIndex}
                fillLeftPercent={fillLeftPercent}
                fillSizePercent={fillSizePercent}
                isDragging={isDragging}
                isHovered={isHovered}
                isRange={range}
                sizeClasses={sizeClasses}
                thumbPercents={thumbPercents}
              />
            </SliderPrimitive.Control>

            <SliderMarks
              disabled={disabled}
              inverted={inverted}
              isRtl={isRtl}
              marks={normalizedMarks}
              marksInteractive={marksInteractive}
              onMarkActivate={handleMarkActivate}
              rangeSpan={rangeSpan}
              readOnly={readOnly}
              resolvedMin={resolvedMin}
            />
          </div>
        </SliderPrimitive.Root>

        {name ? (
          range ? (
            <>
              <input
                aria-hidden
                name={`${name}[0]`}
                tabIndex={-1}
                type="hidden"
                value={lowValue}
              />
              <input
                aria-hidden
                name={`${name}[1]`}
                tabIndex={-1}
                type="hidden"
                value={highValue}
              />
            </>
          ) : (
            <input
              aria-hidden
              name={name}
              tabIndex={-1}
              type="hidden"
              value={value as number}
            />
          )
        ) : null}
      </div>

      <SliderFieldMessages
        description={description}
        descriptionId={fieldMeta.descriptionId}
        errorId={fieldMeta.errorId}
        errorMessage={errorMessage}
      />
    </div>
  );
});

export { Slider as slider };
