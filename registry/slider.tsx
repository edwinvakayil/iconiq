"use client";

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
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
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

function getPointerRatio(
  clientX: number,
  rect: DOMRect,
  inverted: boolean,
  isRtl: boolean
) {
  let ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;

  if (isRtl) {
    ratio = 1 - ratio;
  }

  if (inverted) {
    ratio = 1 - ratio;
  }

  return clamp(ratio, 0, 1);
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

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  };
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

function normalizeSliderNextValue(
  nextValue: number | [number, number],
  range: boolean,
  resolvedMin: number,
  resolvedMax: number,
  safeStep: number
) {
  if (range) {
    return snapRangeValue(
      Array.isArray(nextValue) ? nextValue : [nextValue, nextValue],
      resolvedMin,
      resolvedMax,
      safeStep
    );
  }

  return snapValue(
    Array.isArray(nextValue) ? (nextValue[0] ?? resolvedMin) : nextValue,
    resolvedMin,
    resolvedMax,
    safeStep
  );
}

function sliderValuesEqual(
  current: number | [number, number],
  normalized: number | [number, number],
  range: boolean
) {
  if (range) {
    const currentTuple = Array.isArray(current) ? current : [current, current];
    const nextTuple = normalized as [number, number];
    return currentTuple[0] === nextTuple[0] && currentTuple[1] === nextTuple[1];
  }

  return current === normalized;
}

type SliderKeyboardAction =
  | { type: "step"; delta: number }
  | { type: "min" }
  | { type: "max" };

function getSliderKeyboardAction(
  key: string,
  context: {
    inverted: boolean;
    isRtl: boolean;
    rangeSpan: number;
    safeStep: number;
  }
): SliderKeyboardAction | null {
  const { inverted, isRtl, rangeSpan, safeStep } = context;
  const pageStep =
    rangeSpan === 0 ? safeStep : Math.max(safeStep, rangeSpan / 10);
  const increaseOnRightUp = isRtl === inverted;
  const increaseKeys = new Set(["ArrowRight", "ArrowUp"]);
  const decreaseKeys = new Set(["ArrowLeft", "ArrowDown"]);

  if (
    (increaseOnRightUp && increaseKeys.has(key)) ||
    (!increaseOnRightUp && decreaseKeys.has(key))
  ) {
    return { type: "step", delta: safeStep };
  }

  if (
    (increaseOnRightUp && decreaseKeys.has(key)) ||
    (!increaseOnRightUp && increaseKeys.has(key))
  ) {
    return { type: "step", delta: -safeStep };
  }

  if (key === "PageUp") {
    return { type: "step", delta: pageStep };
  }

  if (key === "PageDown") {
    return { type: "step", delta: -pageStep };
  }

  if (key === "Home") {
    return { type: "min" };
  }

  if (key === "End") {
    return { type: "max" };
  }

  return null;
}

function applySliderKeyboardAction(
  action: SliderKeyboardAction,
  context: {
    activeThumbIndex: number;
    latestValue: number | [number, number];
    range: boolean;
    resolvedMax: number;
    resolvedMin: number;
    updateRangeThumb: (thumbIndex: number, nextThumbValue: number) => boolean;
    updateValue: (nextValue: number | [number, number]) => boolean;
  }
) {
  const {
    activeThumbIndex,
    latestValue,
    range,
    resolvedMax,
    resolvedMin,
    updateRangeThumb,
    updateValue,
  } = context;

  if (action.type === "min") {
    return range
      ? updateRangeThumb(activeThumbIndex, resolvedMin)
      : updateValue(resolvedMin);
  }

  if (action.type === "max") {
    return range
      ? updateRangeThumb(activeThumbIndex, resolvedMax)
      : updateValue(resolvedMax);
  }

  const current = range
    ? (latestValue as [number, number])[activeThumbIndex]
    : (latestValue as number);

  return range
    ? updateRangeThumb(activeThumbIndex, current + action.delta)
    : updateValue(current + action.delta);
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
  const trackRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const latestValueRef = useRef<number | [number, number]>(
    range ? [25, 75] : 50
  );
  const didChangeDuringInteractionRef = useRef(false);
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
  const activeValue = range ? values[activeThumbIndex] : (value as number);
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
    latestValueRef.current = value;
  }, [value]);

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

  const formattedValueText = formatSliderDisplayValue(value, {
    formatValue,
    range,
    valueDecimals: safeValueDecimals,
  });

  const updateValue = useCallback(
    (nextValue: number | [number, number]) => {
      if (disabled || readOnly) {
        return false;
      }

      const normalized = normalizeSliderNextValue(
        nextValue,
        range,
        resolvedMin,
        resolvedMax,
        safeStep
      );

      if (sliderValuesEqual(latestValueRef.current, normalized, range)) {
        return false;
      }

      latestValueRef.current = normalized;

      if (controlledValue === undefined) {
        setInternalValue(normalized);
      }

      onChange?.(normalized);
      return true;
    },
    [
      controlledValue,
      disabled,
      onChange,
      range,
      readOnly,
      resolvedMax,
      resolvedMin,
      safeStep,
    ]
  );

  const updateRangeThumb = useCallback(
    (thumbIndex: number, nextThumbValue: number) => {
      const current = latestValueRef.current;
      const tuple = Array.isArray(current) ? [...current] : [current, current];
      tuple[thumbIndex] = snapValue(
        nextThumbValue,
        resolvedMin,
        resolvedMax,
        safeStep
      );

      if (tuple[0] > tuple[1]) {
        if (thumbIndex === 0) {
          tuple[0] = tuple[1];
        } else {
          tuple[1] = tuple[0];
        }
      }

      return updateValue(tuple as [number, number]);
    },
    [resolvedMax, resolvedMin, safeStep, updateValue]
  );

  const updateFromPointer = useCallback(
    (clientX: number, _clientY: number, thumbIndex?: number) => {
      const track = trackRef.current;
      if (!track) {
        return false;
      }

      const rect = track.getBoundingClientRect();
      const ratio = getPointerRatio(clientX, rect, inverted, isRtl);
      const raw = resolvedMin + ratio * rangeSpan;
      const nextValue = snapValue(raw, resolvedMin, resolvedMax, safeStep);

      if (range) {
        const index =
          thumbIndex ??
          (() => {
            const current = latestValueRef.current;
            const tuple = Array.isArray(current) ? current : [current, current];
            const lowDistance = Math.abs(tuple[0] - nextValue);
            const highDistance = Math.abs(tuple[1] - nextValue);
            return lowDistance <= highDistance ? 0 : 1;
          })();

        setActiveThumbIndex(index);
        activeThumbIndexRef.current = index;
        return updateRangeThumb(index, nextValue);
      }

      return updateValue(nextValue);
    },
    [
      inverted,
      isRtl,
      range,
      rangeSpan,
      resolvedMax,
      resolvedMin,
      safeStep,
      updateRangeThumb,
      updateValue,
    ]
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || readOnly) {
      return;
    }

    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerIdRef.current = event.pointerId;
    didChangeDuringInteractionRef.current = false;
    setIsDragging(true);
    didChangeDuringInteractionRef.current = updateFromPointer(
      event.clientX,
      event.clientY
    );
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      disabled ||
      readOnly ||
      !isDragging ||
      pointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    didChangeDuringInteractionRef.current =
      updateFromPointer(
        event.clientX,
        event.clientY,
        range ? activeThumbIndexRef.current : undefined
      ) || didChangeDuringInteractionRef.current;
  };

  const finishPointerInteraction = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pointerIdRef.current = null;
    setIsDragging(false);

    if (didChangeDuringInteractionRef.current) {
      onValueCommit?.(latestValueRef.current);
      didChangeDuringInteractionRef.current = false;
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled || readOnly) {
      return;
    }

    const action = getSliderKeyboardAction(event.key, {
      inverted,
      isRtl,
      rangeSpan,
      safeStep,
    });

    if (!action) {
      return;
    }

    event.preventDefault();

    const changed = applySliderKeyboardAction(action, {
      activeThumbIndex: activeThumbIndexRef.current,
      latestValue: latestValueRef.current,
      range,
      resolvedMax,
      resolvedMin,
      updateRangeThumb,
      updateValue,
    });

    if (changed) {
      onValueCommit?.(latestValueRef.current);
    }
  };

  const handleMarkActivate = useCallback(
    (markValue: number) => {
      if (disabled || readOnly) {
        return;
      }

      if (range) {
        const current = latestValueRef.current;
        const tuple = Array.isArray(current) ? current : [current, current];
        const lowDistance = Math.abs(tuple[0] - markValue);
        const highDistance = Math.abs(tuple[1] - markValue);
        const thumbIndex = lowDistance <= highDistance ? 0 : 1;
        setActiveThumbIndex(thumbIndex);
        activeThumbIndexRef.current = thumbIndex;

        if (updateRangeThumb(thumbIndex, markValue)) {
          onValueCommit?.(latestValueRef.current);
        }

        return;
      }

      if (updateValue(markValue)) {
        onValueCommit?.(latestValueRef.current);
      }
    },
    [disabled, onValueCommit, range, readOnly, updateRangeThumb, updateValue]
  );

  const normalizedMarks = (marks ?? [])
    .map((mark) => ({
      ...mark,
      value: clamp(mark.value, resolvedMin, resolvedMax),
    }))
    .sort((firstMark, secondMark) => firstMark.value - secondMark.value);
  const active = isDragging || isHovered || isFocused;

  return (
    <div
      className={cn(
        componentThemeClassName,
        "w-full select-none",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      ref={fieldRef}
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

      <div
        className="relative"
        onBlur={(event) => {
          if (resolveBlurTarget(event.currentTarget, event.relatedTarget)) {
            setIsFocused(false);
          }
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
      >
        <div
          aria-describedby={fieldMeta.describedBy || undefined}
          aria-disabled={disabled || undefined}
          aria-invalid={fieldMeta.showInvalid || undefined}
          aria-label={accessibleName.ariaLabel}
          aria-labelledby={accessibleName.ariaLabelledBy}
          aria-orientation="horizontal"
          aria-readonly={readOnly || undefined}
          aria-valuemax={resolvedMax}
          aria-valuemin={resolvedMin}
          aria-valuenow={activeValue}
          aria-valuetext={formattedValueText}
          className={cn(
            "relative flex w-full cursor-pointer items-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-foreground/35 focus-visible:outline-offset-4",
            sizeClasses.hitAreaHorizontal,
            disabled && "cursor-not-allowed"
          )}
          id={fieldMeta.sliderId}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          onPointerCancel={finishPointerInteraction}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerInteraction}
          ref={mergeRefs(ref, trackRef)}
          role="slider"
          style={{ touchAction: "pan-y" }}
          tabIndex={disabled ? -1 : 0}
        >
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
        </div>

        {name ? (
          range ? (
            <>
              <input name={`${name}[0]`} type="hidden" value={lowValue} />
              <input name={`${name}[1]`} type="hidden" value={highValue} />
            </>
          ) : (
            <input name={name} type="hidden" value={value as number} />
          )
        ) : null}

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
