"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface RollingDigitsProps {
  value: number;
  pad?: number;
  startOnView?: boolean;
  className?: string;
  digitClassName?: string;
  locale?: boolean;
  format?: (value: number) => string;
  gap?: number;
  animationDelay?: number;
  /** @deprecated Use `animationDelay` instead. Seconds between queued steps. */
  stagger?: number;
  enterStiffness?: number;
  enterDamping?: number;
  exitStiffness?: number;
  exitDamping?: number;
  direction?: "dynamic" | "up" | "down";
  enterY?: number;
  enterBlur?: number;
  enterScale?: number;
}

interface RollingDigitsTextProps {
  value: string;
  gap?: number;
  className?: string;
  digitClassName?: string;
  enterStiffness?: number;
  enterDamping?: number;
  exitStiffness?: number;
  exitDamping?: number;
  direction?: "dynamic" | "up" | "down";
  enterY?: number;
  enterBlur?: number;
  enterScale?: number;
  animationDelay?: number;
}

interface ExitItem {
  id: number;
  char: string;
  exitY: number;
}

let exitId = 0;
const DIGIT_PATTERN = /\d/;

const DIGIT_MOTION_DEFAULTS = {
  enterStiffness: 170,
  enterDamping: 10,
  exitStiffness: 170,
  exitDamping: 15,
  direction: "dynamic" as const,
  enterY: 32,
  enterBlur: 52,
  enterScale: 0.7,
  exitBlur: "10px",
  exitScale: 0.7,
};

function isDigitChar(char: string) {
  return DIGIT_PATTERN.test(char);
}

function formatRollingDigitsValue(
  value: number,
  { pad, locale, format }: Pick<RollingDigitsProps, "pad" | "locale" | "format">
) {
  const rounded = Math.round(value);
  const formatted = format
    ? format(rounded)
    : locale
      ? rounded.toLocaleString()
      : rounded.toString();

  return pad ? formatted.padStart(pad, "0") : formatted;
}

function DigitCell({
  char,
  isDigit,
  className,
  enterStiffness = DIGIT_MOTION_DEFAULTS.enterStiffness,
  enterDamping = DIGIT_MOTION_DEFAULTS.enterDamping,
  exitStiffness = DIGIT_MOTION_DEFAULTS.exitStiffness,
  exitDamping = DIGIT_MOTION_DEFAULTS.exitDamping,
  direction = DIGIT_MOTION_DEFAULTS.direction,
  enterY = DIGIT_MOTION_DEFAULTS.enterY,
  enterBlur = DIGIT_MOTION_DEFAULTS.enterBlur,
  enterScale = DIGIT_MOTION_DEFAULTS.enterScale,
}: {
  char: string;
  isDigit: boolean;
  className?: string;
  enterStiffness?: number;
  enterDamping?: number;
  exitStiffness?: number;
  exitDamping?: number;
  direction?: "dynamic" | "up" | "down";
  enterY?: number;
  enterBlur?: number;
  enterScale?: number;
}) {
  const [exitQueue, setExitQueue] = useState<ExitItem[]>([]);
  const prevCharRef = useRef(char);
  const isFirstRender = useRef(true);

  const springConfig = { stiffness: enterStiffness, damping: enterDamping };
  const y = useSpring(0, springConfig);
  const opacity = useSpring(1, springConfig);
  const scale = useSpring(1, springConfig);
  const blur = useSpring(0, springConfig);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  useEffect(() => {
    if (!isDigit) return;

    const prev = prevCharRef.current;
    prevCharRef.current = char;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (char === prev || !isDigitChar(prev)) return;

    const up =
      direction === "dynamic"
        ? Number(char) > Number(prev)
        : direction === "up";

    const id = exitId++;
    setExitQueue((q) => {
      const next = [...q, { id, char: prev, exitY: up ? -enterY : enterY }];
      return next.length > 3 ? next.slice(-3) : next;
    });

    y.jump(up ? enterY : -enterY);
    opacity.jump(0);
    scale.jump(enterScale);
    blur.jump(enterBlur);

    y.set(0);
    opacity.set(1);
    scale.set(1);
    blur.set(0);
  }, [
    char,
    isDigit,
    direction,
    enterY,
    enterBlur,
    enterScale,
    y,
    opacity,
    scale,
    blur,
  ]);

  if (!isDigit) {
    return <span className={className}>{char}</span>;
  }

  return (
    <div
      className={cn(
        "relative grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1",
        className
      )}
    >
      <AnimatePresence>
        {exitQueue.map(({ id, char: exitChar, exitY }) => (
          <motion.span
            animate={{
              opacity: 0,
              scale: DIGIT_MOTION_DEFAULTS.exitScale,
              filter: `blur(${DIGIT_MOTION_DEFAULTS.exitBlur})`,
              y: exitY,
            }}
            aria-hidden
            initial={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            key={id}
            onAnimationComplete={() =>
              setExitQueue((q) => q.filter((item) => item.id !== id))
            }
            transition={{
              type: "spring",
              stiffness: exitStiffness,
              damping: exitDamping,
            }}
          >
            {exitChar}
          </motion.span>
        ))}
      </AnimatePresence>
      <motion.span style={{ opacity, scale, filter, y }}>{char}</motion.span>
    </div>
  );
}

function RollingDigitsText({
  value,
  gap = 2,
  className,
  digitClassName,
  enterStiffness,
  enterDamping,
  exitStiffness,
  exitDamping,
  direction,
  enterY,
  enterBlur,
  enterScale,
  animationDelay = 80,
}: RollingDigitsTextProps) {
  const [displayedValue, setDisplayedValue] = useState(value);
  const pendingQueue = useRef<string[]>([]);
  const isAnimating = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayedRef = useRef(value);
  const animationDelayRef = useRef(animationDelay);

  animationDelayRef.current = animationDelay;

  const processQueue = useCallback(() => {
    if (pendingQueue.current.length === 0) {
      isAnimating.current = false;
      return;
    }

    isAnimating.current = true;
    const next = pendingQueue.current.shift();
    if (next === undefined) {
      isAnimating.current = false;
      return;
    }

    displayedRef.current = next;
    setDisplayedValue(next);

    timerRef.current = setTimeout(processQueue, animationDelayRef.current);
  }, []);

  useEffect(() => {
    if (value === displayedRef.current) return;

    pendingQueue.current.push(value);

    if (!isAnimating.current) {
      processQueue();
    }
  }, [processQueue, value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const chars = displayedValue.split("");

  return (
    <div
      className={cn("inline-flex items-center tabular-nums", className)}
      style={{ gap }}
    >
      {chars.map((char, i) => (
        <DigitCell
          char={char}
          className={digitClassName}
          direction={direction}
          enterBlur={enterBlur}
          enterDamping={enterDamping}
          enterScale={enterScale}
          enterStiffness={enterStiffness}
          enterY={enterY}
          exitDamping={exitDamping}
          exitStiffness={exitStiffness}
          isDigit={isDigitChar(char)}
          key={i}
        />
      ))}
    </div>
  );
}

export function RollingDigits({
  value,
  pad,
  startOnView = true,
  className,
  digitClassName,
  locale,
  format,
  gap,
  animationDelay,
  stagger,
  enterStiffness,
  enterDamping,
  exitStiffness,
  exitDamping,
  direction,
  enterY,
  enterBlur,
  enterScale,
}: RollingDigitsProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.6 });
  const [armed, setArmed] = useState(!startOnView);

  useEffect(() => {
    if (startOnView && inView) setArmed(true);
  }, [startOnView, inView]);

  const formatOptions = useMemo(
    () => ({ pad, locale, format }),
    [format, locale, pad]
  );
  const text = useMemo(
    () => formatRollingDigitsValue(value, formatOptions),
    [formatOptions, value]
  );
  const zeroText = useMemo(
    () => formatRollingDigitsValue(0, formatOptions),
    [formatOptions]
  );
  const displayText = armed ? text : zeroText;
  const resolvedAnimationDelay =
    animationDelay ?? (stagger !== undefined ? Math.round(stagger * 1000) : 80);

  return (
    <span
      className={cn("inline-flex items-center tabular-nums", className)}
      ref={containerRef}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex items-center">
        <RollingDigitsText
          animationDelay={resolvedAnimationDelay}
          digitClassName={digitClassName}
          direction={direction}
          enterBlur={enterBlur}
          enterDamping={enterDamping}
          enterScale={enterScale}
          enterStiffness={enterStiffness}
          enterY={enterY}
          exitDamping={exitDamping}
          exitStiffness={exitStiffness}
          gap={gap}
          value={displayText}
        />
      </span>
    </span>
  );
}
