"use client";

import { AnimatePresence, motion, useInView, useSpring } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type RollingDigitsLocale = true | string | Intl.NumberFormatOptions;

export interface RollingDigitsProps {
  /** Target number to display. Rounded to the nearest integer before formatting. */
  value: number;
  /** Minimum digit count before locale separators are applied. */
  pad?: number;
  /**
   * When true, waits until the component enters the viewport once before
   * animating from zero.
   * @default true
   */
  startOnView?: boolean;
  className?: string;
  digitClassName?: string;
  /**
   * Locale formatting. `true` uses the runtime default locale, a string sets
   * the locale tag, and an object is passed to `Intl.NumberFormat`.
   */
  locale?: RollingDigitsLocale;
  /** Custom formatter. Runs after rounding and overrides `locale`. */
  format?: (value: number) => string;
  /** Pixel gap between rendered characters. @default 2 */
  gap?: number;
  /**
   * Milliseconds between queued value steps when `value` changes faster than
   * the animation can finish.
   * @default 80
   */
  animationDelay?: number;
  /** @deprecated Use `animationDelay` instead. Seconds between queued steps. */
  stagger?: number;
  /** Spring stiffness for incoming digit motion. @default 170 */
  enterStiffness?: number;
  /** Spring damping for incoming digit motion. @default 10 */
  enterDamping?: number;
  /** Spring stiffness for outgoing digit motion. @default 170 */
  exitStiffness?: number;
  /** Spring damping for outgoing digit motion. @default 15 */
  exitDamping?: number;
  /**
   * Controls whether incoming digits slide up or down.
   * @default "dynamic"
   */
  direction?: "dynamic" | "up" | "down";
  /** Vertical offset in pixels used when a digit enters. @default 32 */
  enterY?: number;
  /** @deprecated Blur is no longer applied. Kept for backward compatibility. */
  enterBlur?: number;
  /** Starting scale applied when a digit enters. @default 0.84 */
  enterScale?: number;
  /** Ending scale applied when a digit exits. @default 0.84 */
  exitScale?: number;
  /**
   * When true, rapid `value` updates replace the pending queue with the latest
   * value instead of stepping through every intermediate update.
   */
  coalesceUpdates?: boolean;
  /** Called when the displayed value catches up to the latest `value`. */
  onAnimationComplete?: () => void;
  /**
   * Adds `aria-live` to the screen-reader layer. `true` maps to `"polite"`.
   * @default true
   */
  ariaLive?: boolean | "polite" | "assertive" | "off";
}

export interface RollingDigitsTextProps {
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
  /** @deprecated Blur is no longer applied. Kept for backward compatibility. */
  enterBlur?: number;
  enterScale?: number;
  exitScale?: number;
  animationDelay?: number;
  coalesceUpdates?: boolean;
  onAnimationComplete?: () => void;
}

export interface RollingDigitCellDescriptor {
  key: string;
  char: string;
  isDigit: boolean;
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
  enterScale: 0.84,
  exitScale: 0.84,
};

function isDigitChar(char: string) {
  return DIGIT_PATTERN.test(char);
}

function normalizeRollingDigitsValue(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value);
}

function normalizePad(pad?: number) {
  if (pad === undefined) {
    return undefined;
  }

  const normalized = Math.max(0, Math.floor(pad));
  return normalized > 0 ? normalized : undefined;
}

function safeFormattedNumber(rounded: number, formatted: string) {
  return formatted.length > 0 ? formatted : rounded.toString();
}

function formatWithLocale(
  rounded: number,
  locale: RollingDigitsLocale
): string {
  try {
    if (locale === true) {
      return rounded.toLocaleString();
    }

    if (typeof locale === "string") {
      return rounded.toLocaleString(locale);
    }

    return rounded.toLocaleString(undefined, locale);
  } catch {
    return rounded.toString();
  }
}

function formatWithCustomFormatter(
  rounded: number,
  format: (value: number) => string
) {
  try {
    return safeFormattedNumber(rounded, format(rounded));
  } catch {
    return rounded.toString();
  }
}

function formatPaddedNumber(rounded: number, normalizedPad: number) {
  const sign = rounded < 0 ? "-" : "";
  return sign + Math.abs(rounded).toString().padStart(normalizedPad, "0");
}

function formatLocaleValue(
  rounded: number,
  locale: RollingDigitsLocale,
  normalizedPad?: number
) {
  if (typeof locale === "object") {
    const options: Intl.NumberFormatOptions = { ...locale };

    if (normalizedPad) {
      options.minimumIntegerDigits = normalizedPad;
    }

    return formatWithLocale(rounded, options);
  }

  if (normalizedPad) {
    try {
      return rounded.toLocaleString(undefined, {
        minimumIntegerDigits: normalizedPad,
      });
    } catch {
      return formatPaddedNumber(rounded, normalizedPad);
    }
  }

  return formatWithLocale(rounded, locale);
}

export function formatRollingDigitsValue(
  value: number,
  { pad, locale, format }: Pick<RollingDigitsProps, "pad" | "locale" | "format">
) {
  const rounded = normalizeRollingDigitsValue(value);
  const normalizedPad = normalizePad(pad);

  if (format) {
    return formatWithCustomFormatter(rounded, format);
  }

  if (locale) {
    return formatLocaleValue(rounded, locale, normalizedPad);
  }

  if (normalizedPad) {
    return formatPaddedNumber(rounded, normalizedPad);
  }

  return rounded.toString();
}

export function buildRollingDigitCells(
  value: string
): RollingDigitCellDescriptor[] {
  if (!value) {
    return [{ key: "digit-r0", char: "0", isDigit: true }];
  }

  const chars = value.split("");
  const digitIndexFromRight = new Array<number>(chars.length).fill(-1);
  let fromRight = 0;

  for (let index = chars.length - 1; index >= 0; index -= 1) {
    if (isDigitChar(chars[index])) {
      digitIndexFromRight[index] = fromRight;
      fromRight += 1;
    }
  }

  return chars.map((char, index) => {
    const isDigit = isDigitChar(char);

    if (isDigit) {
      return {
        key: `digit-r${digitIndexFromRight[index]}`,
        char,
        isDigit,
      };
    }

    let key = `sep-l${index}`;

    for (let nextIndex = index + 1; nextIndex < chars.length; nextIndex += 1) {
      if (!isDigitChar(chars[nextIndex])) {
        continue;
      }

      let hasDigitLeft = false;

      for (let leftIndex = index - 1; leftIndex >= 0; leftIndex -= 1) {
        if (isDigitChar(chars[leftIndex])) {
          hasDigitLeft = true;
          break;
        }
      }

      if (hasDigitLeft) {
        key = `sep-r${digitIndexFromRight[nextIndex]}`;
      }

      break;
    }

    return { key, char, isDigit };
  });
}

function serializeRollingDigitsLocale(locale?: RollingDigitsLocale) {
  if (!locale) {
    return "none";
  }

  if (locale === true) {
    return "default";
  }

  if (typeof locale === "string") {
    return locale;
  }

  return JSON.stringify(
    locale,
    Object.keys(locale as Record<string, unknown>).sort()
  );
}

function getRollingDigitsFormattingKey({
  pad,
  locale,
  format,
}: Pick<RollingDigitsProps, "pad" | "locale" | "format">) {
  return `${normalizePad(pad) ?? "none"}:${serializeRollingDigitsLocale(locale)}:${format ? "format" : "plain"}`;
}

function resolveAriaLive(
  ariaLive: RollingDigitsProps["ariaLive"]
): "polite" | "assertive" | undefined {
  if (ariaLive === false || ariaLive === "off") {
    return undefined;
  }

  if (ariaLive === true || ariaLive === undefined) {
    return "polite";
  }

  return ariaLive;
}

function resolveAnimationDelay(animationDelay?: number, stagger?: number) {
  if (animationDelay !== undefined) {
    return Math.max(0, animationDelay);
  }

  if (stagger !== undefined) {
    return Math.max(0, Math.round(stagger * 1000));
  }

  return 80;
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
  enterScale = DIGIT_MOTION_DEFAULTS.enterScale,
  exitScale = DIGIT_MOTION_DEFAULTS.exitScale,
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
  exitScale?: number;
}) {
  const [exitQueue, setExitQueue] = useState<ExitItem[]>([]);
  const prevCharRef = useRef(char);
  const isFirstRender = useRef(true);
  const isMountedRef = useRef(true);

  const springConfig = { stiffness: enterStiffness, damping: enterDamping };
  const y = useSpring(0, springConfig);
  const opacity = useSpring(1, springConfig);
  const scale = useSpring(1, springConfig);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isDigit) {
      return;
    }

    return () => {
      setExitQueue([]);
    };
  }, [isDigit]);

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
    setExitQueue((queue) => [
      ...queue,
      { id, char: prev, exitY: up ? -enterY : enterY },
    ]);

    y.jump(up ? enterY : -enterY);
    opacity.jump(0);
    scale.jump(enterScale);

    y.set(0);
    opacity.set(1);
    scale.set(1);
  }, [char, direction, enterScale, enterY, isDigit, opacity, scale, y]);

  if (!isDigit) {
    return <span className={className}>{char}</span>;
  }

  return (
    <div
      className={cn(
        "relative isolate grid min-h-[1em] min-w-[1ch] place-items-center overflow-hidden leading-none [&>*]:col-start-1 [&>*]:row-start-1",
        className
      )}
    >
      <AnimatePresence>
        {exitQueue.map(({ id, char: exitChar, exitY }) => (
          <motion.span
            animate={{
              opacity: 0,
              scale: exitScale,
              y: exitY,
            }}
            aria-hidden
            className="[backface-visibility:hidden]"
            initial={{ opacity: 1, scale: 1, y: 0 }}
            key={id}
            onAnimationComplete={() => {
              if (!isMountedRef.current) return;

              setExitQueue((queue) => queue.filter((item) => item.id !== id));
            }}
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
      <motion.span
        className="[backface-visibility:hidden]"
        style={{ opacity, scale, y }}
      >
        {char}
      </motion.span>
    </div>
  );
}

export function RollingDigitsText({
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
  enterScale,
  exitScale,
  animationDelay = 80,
  coalesceUpdates = false,
  onAnimationComplete,
}: RollingDigitsTextProps) {
  const [displayedValue, setDisplayedValue] = useState(value);
  const pendingQueue = useRef<string[]>([]);
  const isAnimating = useRef(false);
  const hasPendingUpdateRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayedRef = useRef(value);
  const targetValueRef = useRef(value);
  const animationDelayRef = useRef(animationDelay);
  const onCompleteRef = useRef(onAnimationComplete);
  const isMountedRef = useRef(true);

  animationDelayRef.current = animationDelay;
  onCompleteRef.current = onAnimationComplete;
  targetValueRef.current = value;

  const motionConfigKey = useMemo(
    () =>
      [
        animationDelay,
        coalesceUpdates,
        direction,
        enterDamping,
        enterScale,
        enterStiffness,
        enterY,
        exitDamping,
        exitScale,
        exitStiffness,
        gap,
      ].join(":"),
    [
      animationDelay,
      coalesceUpdates,
      direction,
      enterDamping,
      enterScale,
      enterStiffness,
      enterY,
      exitDamping,
      exitScale,
      exitStiffness,
      gap,
    ]
  );

  const notifyComplete = useCallback(() => {
    if (
      !hasPendingUpdateRef.current ||
      displayedRef.current !== targetValueRef.current ||
      isAnimating.current ||
      pendingQueue.current.length > 0
    ) {
      return;
    }

    hasPendingUpdateRef.current = false;
    onCompleteRef.current?.();
  }, []);

  const processQueue = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }

    if (pendingQueue.current.length === 0) {
      isAnimating.current = false;
      notifyComplete();
      return;
    }

    isAnimating.current = true;
    const next = pendingQueue.current.shift();

    if (next === undefined) {
      isAnimating.current = false;
      notifyComplete();
      return;
    }

    displayedRef.current = next;
    setDisplayedValue(next);

    timerRef.current = setTimeout(processQueue, animationDelayRef.current);
  }, [notifyComplete]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: motion settings changes must reset the queue without re-running on value updates.
  useEffect(() => {
    displayedRef.current = targetValueRef.current;
    setDisplayedValue(targetValueRef.current);
    pendingQueue.current = [];
    isAnimating.current = false;
    hasPendingUpdateRef.current = false;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [motionConfigKey]);

  useEffect(() => {
    if (value === displayedRef.current) {
      notifyComplete();
      return;
    }

    hasPendingUpdateRef.current = true;

    if (coalesceUpdates) {
      pendingQueue.current = [value];

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      isAnimating.current = false;
      processQueue();
      return;
    }

    pendingQueue.current.push(value);

    if (!isAnimating.current) {
      processQueue();
    }
  }, [coalesceUpdates, notifyComplete, processQueue, value]);

  const cells = useMemo(
    () => buildRollingDigitCells(displayedValue),
    [displayedValue]
  );

  return (
    <div
      className={cn("inline-flex items-center tabular-nums", className)}
      style={{ gap }}
    >
      <AnimatePresence initial={false}>
        {cells.map(({ key, char, isDigit }) => (
          <motion.span
            className="inline-flex"
            exit={
              isDigit
                ? {
                    opacity: 0,
                    y:
                      direction === "down"
                        ? (enterY ?? DIGIT_MOTION_DEFAULTS.enterY)
                        : -(enterY ?? DIGIT_MOTION_DEFAULTS.enterY),
                  }
                : { opacity: 0 }
            }
            key={key}
            transition={{
              type: "spring",
              stiffness: exitStiffness ?? DIGIT_MOTION_DEFAULTS.exitStiffness,
              damping: exitDamping ?? DIGIT_MOTION_DEFAULTS.exitDamping,
            }}
          >
            <DigitCell
              char={char}
              className={digitClassName}
              direction={direction}
              enterDamping={enterDamping}
              enterScale={enterScale}
              enterStiffness={enterStiffness}
              enterY={enterY}
              exitDamping={exitDamping}
              exitScale={exitScale}
              exitStiffness={exitStiffness}
              isDigit={isDigit}
            />
          </motion.span>
        ))}
      </AnimatePresence>
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
  enterScale,
  exitScale,
  coalesceUpdates,
  onAnimationComplete,
  ariaLive = true,
}: RollingDigitsProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.6 });
  const [armed, setArmed] = useState(!startOnView);

  useEffect(() => {
    if (startOnView && inView) {
      setArmed(true);
    }
  }, [startOnView, inView]);

  useEffect(() => {
    if (!startOnView) {
      setArmed(true);
    }
  }, [startOnView]);

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
  const resolvedAnimationDelay = resolveAnimationDelay(animationDelay, stagger);
  const resolvedAriaLive = resolveAriaLive(ariaLive);
  const formattingKey = useMemo(
    () => getRollingDigitsFormattingKey({ pad, locale, format }),
    [format, locale, pad]
  );

  return (
    <span
      className={cn("inline-flex items-center tabular-nums", className)}
      ref={containerRef}
    >
      <span aria-live={resolvedAriaLive} className="sr-only">
        {displayText}
      </span>
      <span aria-hidden="true" className="inline-flex items-center">
        <RollingDigitsText
          animationDelay={resolvedAnimationDelay}
          coalesceUpdates={coalesceUpdates}
          digitClassName={digitClassName}
          direction={direction}
          enterDamping={enterDamping}
          enterScale={enterScale}
          enterStiffness={enterStiffness}
          enterY={enterY}
          exitDamping={exitDamping}
          exitScale={exitScale}
          exitStiffness={exitStiffness}
          gap={gap}
          key={formattingKey}
          onAnimationComplete={onAnimationComplete}
          value={displayText}
        />
      </span>
    </span>
  );
}
