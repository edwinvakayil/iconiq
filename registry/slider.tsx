"use client";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

interface SliderMark {
  value: number;
  label?: string;
}

interface SliderProps {
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
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPrecision(value: number) {
  if (!Number.isFinite(value)) return 0;

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
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const latestValueRef = useRef<number>(defaultValue);
  const didChangeDuringInteractionRef = useRef(false);
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
    if (controlledValue !== undefined) return;

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
  const widthPercent = useTransform(progressMV, (p) => `${p}%`);
  const leftPercent = useTransform(progressMV, (p) => `${p}%`);
  const displayValue = useTransform(progressMV, (p) =>
    formatValue
      ? formatValue(
          snapValue(
            resolvedMin + (p / 100) * range,
            resolvedMin,
            resolvedMax,
            safeStep
          )
        )
      : snapValue(
          resolvedMin + (p / 100) * range,
          resolvedMin,
          resolvedMax,
          safeStep
        ).toFixed(safeValueDecimals)
  );

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    const controls = animate(progressMV, progress, {
      type: "spring",
      stiffness: 180,
      damping: 26,
      mass: 0.9,
      restDelta: 0.001,
    });
    return controls.stop;
  }, [progress, progressMV]);

  const updateValue = useCallback(
    (nextValue: number) => {
      if (nextValue === latestValueRef.current) return false;

      latestValueRef.current = nextValue;

      if (controlledValue === undefined) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
      return true;
    },
    [controlledValue, onChange]
  );

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      if (rect.width === 0) return false;

      const ratio = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1
      );
      const raw = resolvedMin + ratio * range;
      const nextValue = snapValue(raw, resolvedMin, resolvedMax, safeStep);
      return updateValue(nextValue);
    },
    [range, resolvedMin, resolvedMax, safeStep, updateValue]
  );

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.focus();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    didChangeDuringInteractionRef.current = false;
    setIsDragging(true);
    didChangeDuringInteractionRef.current = Boolean(
      updateFromClientX(e.clientX)
    );
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== e.pointerId) return;

    didChangeDuringInteractionRef.current =
      Boolean(updateFromClientX(e.clientX)) ||
      didChangeDuringInteractionRef.current;
  };

  const finishPointerInteraction = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    pointerIdRef.current = null;
    setIsDragging(false);

    if (didChangeDuringInteractionRef.current) {
      onValueCommit?.(latestValueRef.current);
      didChangeDuringInteractionRef.current = false;
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const pageStep = range === 0 ? safeStep : Math.max(safeStep, range / 10);
    let nextValue = latestValueRef.current;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        nextValue += safeStep;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        nextValue -= safeStep;
        break;
      case "PageUp":
        nextValue += pageStep;
        break;
      case "PageDown":
        nextValue -= pageStep;
        break;
      case "Home":
        nextValue = resolvedMin;
        break;
      case "End":
        nextValue = resolvedMax;
        break;
      default:
        return;
    }

    e.preventDefault();

    const changed = updateValue(
      snapValue(nextValue, resolvedMin, resolvedMax, safeStep)
    );

    if (changed) {
      onValueCommit?.(latestValueRef.current);
    }
  };

  const normalizedMarks = (marks ?? [])
    .map((mark) => ({
      ...mark,
      value: clamp(mark.value, resolvedMin, resolvedMax),
    }))
    .sort((a, b) => a.value - b.value);
  const hasMarkLabels = normalizedMarks.some((mark) => mark.label);
  const active = isDragging || isHovered || isFocused;
  const formattedValue = formatValue
    ? formatValue(value)
    : value.toFixed(safeValueDecimals);

  return (
    <div className="w-full select-none">
      {(label || showValue) && (
        <div className="mb-3 flex items-baseline justify-between">
          {label && (
            <span
              className="font-medium text-muted-foreground text-sm tracking-wide"
              id={labelId}
            >
              {label}
            </span>
          )}
          {showValue && (
            <motion.span className="font-semibold text-foreground text-sm tabular-nums">
              {displayValue}
            </motion.span>
          )}
        </div>
      )}

      <div className="relative">
        <div
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (label ? labelId : undefined)}
          aria-orientation="horizontal"
          aria-valuemax={resolvedMax}
          aria-valuemin={resolvedMin}
          aria-valuenow={value}
          aria-valuetext={formatValue ? formattedValue : undefined}
          className="relative flex h-11 w-full cursor-pointer items-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-foreground/35 focus-visible:outline-offset-4"
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerCancel={finishPointerInteraction}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerInteraction}
          ref={trackRef}
          role="slider"
          style={{ touchAction: "pan-y" }}
          tabIndex={0}
        >
          {/* Background track */}
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

          {/* Filled track */}
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

          {/* Thumb */}
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

        {normalizedMarks.length > 0 && (
          <div
            aria-hidden
            className={`pointer-events-none relative mt-2 ${
              hasMarkLabels ? "h-8" : "h-3"
            }`}
          >
            {normalizedMarks.map((mark) => {
              const left =
                range === 0
                  ? "0%"
                  : `${((mark.value - resolvedMin) / range) * 100}%`;

              return (
                <div
                  className="absolute top-0 -translate-x-1/2 text-center"
                  key={`${mark.value}-${mark.label ?? "tick"}`}
                  style={{ left }}
                >
                  <span className="mx-auto block h-2 w-px rounded-full bg-foreground/25" />
                  {mark.label && (
                    <span className="mt-1 block whitespace-nowrap font-medium text-[11px] text-muted-foreground">
                      {mark.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
