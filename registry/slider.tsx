"use client";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  label?: string;
}

export function Slider({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  showValue = true,
  label,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(
    controlledValue ?? defaultValue
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const value = controlledValue ?? internalValue;
  const progress = ((value - min) / (max - min)) * 100;

  const progressMV = useMotionValue(progress);
  const widthPercent = useTransform(progressMV, (p) => `${p}%`);
  const leftPercent = useTransform(progressMV, (p) => `${p}%`);
  const displayValue = useTransform(progressMV, (p) =>
    Math.round(min + (p / 100) * (max - min))
  );

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

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1
      );
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      const clamped = Math.min(Math.max(stepped, min), max);
      if (controlledValue === undefined) setInternalValue(clamped);
      onChange?.(clamped);
    },
    [min, max, step, controlledValue, onChange]
  );

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const active = isDragging || isHovered;

  return (
    <div className="w-full select-none">
      {(label || showValue) && (
        <div className="mb-3 flex items-baseline justify-between">
          {label && (
            <span className="font-medium text-muted-foreground text-sm tracking-wide">
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

      <div
        className="relative flex h-8 items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Track wrapper — full hit area */}
        <div
          className="relative h-8 w-full cursor-pointer touch-none"
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={trackRef}
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
            <div className="relative h-5 w-5 rounded-full border-2 border-foreground bg-background shadow-sm" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
