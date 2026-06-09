"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

export type TextInertiaProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  text?: string;
  intensity?: number;
  wordClassName?: string;
};

type PointerVelocity = {
  x: number;
  y: number;
};

const DEFAULT_TEXT = "Interfaces remember momentum";
const MAX_TRANSLATE = 46;
const MAX_ROTATION = 18;
const WORD_SPLIT_PATTERN = /\s+/;
const RESET_DELAY = 150;
const INERTIA_SPRING = {
  stiffness: 58,
  damping: 16,
  mass: 1.35,
  restDelta: 0.001,
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function withFallback(value: number, fallback: number) {
  return Math.abs(value) < 1 ? fallback : value;
}

function InertiaWord({
  children,
  index,
  intensity,
  velocityRef,
  wordClassName,
}: {
  children: string;
  index: number;
  intensity: number;
  velocityRef: RefObject<PointerVelocity>;
  wordClassName?: string;
}) {
  const xTarget = useMotionValue(0);
  const yTarget = useMotionValue(0);
  const rotateTarget = useMotionValue(0);
  const x = useSpring(xTarget, INERTIA_SPRING);
  const y = useSpring(yTarget, INERTIA_SPRING);
  const rotate = useSpring(rotateTarget, INERTIA_SPRING);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = undefined;
  }, []);

  const resetTargets = useCallback(() => {
    xTarget.set(0);
    yTarget.set(0);
    rotateTarget.set(0);
  }, [rotateTarget, xTarget, yTarget]);

  useEffect(
    () => () => {
      clearResetTimer();
    },
    [clearResetTimer]
  );

  const handlePointerEnter = () => {
    const direction = index % 2 === 0 ? 1 : -1;
    const velocity = velocityRef.current;
    const xKick = clamp(
      withFallback(velocity.x * intensity * 2.2, direction * intensity * 10),
      -MAX_TRANSLATE,
      MAX_TRANSLATE
    );
    const yKick = clamp(
      withFallback(velocity.y * intensity * 2.2, -intensity * 7),
      -MAX_TRANSLATE,
      MAX_TRANSLATE
    );
    const rotateKick = clamp(
      withFallback(
        (velocity.x - velocity.y) * intensity * 0.5,
        direction * intensity * 6
      ),
      -MAX_ROTATION,
      MAX_ROTATION
    );

    clearResetTimer();
    xTarget.set(xKick);
    yTarget.set(yKick);
    rotateTarget.set(rotateKick);
    resetTimerRef.current = setTimeout(() => {
      resetTargets();
      resetTimerRef.current = undefined;
    }, RESET_DELAY);
  };

  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "inline-block cursor-default select-none will-change-transform",
        wordClassName
      )}
      onPointerEnter={handlePointerEnter}
      style={{ rotate, x, y }}
    >
      {children}
    </motion.span>
  );
}

export default function TextInertia({
  text = DEFAULT_TEXT,
  className,
  wordClassName,
  intensity = 1,
  "aria-label": ariaLabel,
  onPointerLeave,
  onPointerMove,
  ...props
}: TextInertiaProps) {
  const velocityRef = useRef<PointerVelocity>({ x: 0, y: 0 });
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const words = useMemo(
    () => text.trim().split(WORD_SPLIT_PATTERN).filter(Boolean),
    [text]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const lastPoint = lastPointRef.current;

      if (lastPoint) {
        velocityRef.current = {
          x: event.clientX - lastPoint.x,
          y: event.clientY - lastPoint.y,
        };
      }

      lastPointRef.current = { x: event.clientX, y: event.clientY };
      onPointerMove?.(event);
    },
    [onPointerMove]
  );

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      lastPointRef.current = null;
      velocityRef.current = { x: 0, y: 0 };
      onPointerLeave?.(event);
    },
    [onPointerLeave]
  );

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-[0.12em] text-center leading-none",
        className
      )}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      {...props}
    >
      <span className="sr-only">{ariaLabel ?? text}</span>
      {words.map((word, index) => (
        <InertiaWord
          index={index}
          intensity={intensity}
          key={`${word}-${index}`}
          velocityRef={velocityRef}
          wordClassName={wordClassName}
        >
          {word}
        </InertiaWord>
      ))}
    </div>
  );
}
