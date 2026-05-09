"use client";

import {
  type AnimationPlaybackControls,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const DEFAULT_COLORS = ["#c679c4", "#fa3d1d", "#ffb005", "#e1e1fe", "#0358f7"];
const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;
const TEXT_SWAP_EASE = [0.22, 1, 0.36, 1] as const;

type DiaTextMotionProps = ComponentPropsWithoutRef<typeof motion.span>;

export type DiaTextRevealProps = Omit<
  DiaTextMotionProps,
  "children" | "style" | "animate" | "transition" | "color" | "className"
> & {
  text: string | string[];
  colors?: string[];
  textColor?: string;
  duration?: number;
  delay?: number;
  repeat?: boolean;
  repeatDelay?: number;
  triggerOnView?: boolean;
  once?: boolean;
  className?: string;
  fixedWidth?: boolean;
};

const sweepEase = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

function buildGradient(pos: number, colors: string[], textColor: string) {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;

  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`;
  }

  const count = colors.length;
  const parts: string[] = [];

  if (bandStart > 0) {
    parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`);
  }

  colors.forEach((color, index) => {
    const pct =
      count === 1 ? pos : bandStart + (index / (count - 1)) * BAND_HALF * 2;

    parts.push(`${color} ${pct.toFixed(2)}%`);
  });

  if (bandEnd < 100) {
    parts.push(`transparent ${bandEnd.toFixed(2)}%`, "transparent 100%");
  }

  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

function measureWidths(element: HTMLElement, texts: string[]) {
  const ghost = element.cloneNode() as HTMLElement;

  Object.assign(ghost.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    width: "auto",
    whiteSpace: "nowrap",
  });

  element.parentElement?.appendChild(ghost);

  const widths = texts.map((entry) => {
    ghost.textContent = entry;
    return ghost.getBoundingClientRect().width;
  });

  ghost.remove();
  return widths;
}

const DiaTextReveal = forwardRef<HTMLSpanElement, DiaTextRevealProps>(
  (
    {
      text,
      colors = DEFAULT_COLORS,
      textColor = "var(--foreground)",
      duration = 1.5,
      delay = 0,
      repeat = false,
      repeatDelay = 0.5,
      triggerOnView = true,
      once = true,
      className,
      fixedWidth = false,
      ...props
    },
    ref
  ) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [measuredWidths, setMeasuredWidths] = useState<number[]>([]);

    const indexRef = useRef(0);
    const hasPlayedRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined
    );
    const controlsRef = useRef<AnimationPlaybackControls | undefined>(
      undefined
    );
    const previousTextKeyRef = useRef("");

    const sweepPos = useMotionValue(SWEEP_START);
    const textOpacity = useMotionValue(1);
    const textBlur = useMotionValue(0);
    const textShift = useMotionValue(0);
    const prefersReducedMotion = Boolean(useReducedMotion());
    const inView = useInView(spanRef, { once, amount: 0.1 });
    const previousActiveIndexRef = useRef(0);

    const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
    const textKey = useMemo(() => texts.join("\0"), [texts]);
    const isMulti = texts.length > 1;
    const isVisible = triggerOnView ? inView : true;

    const backgroundImage = useTransform(sweepPos, (pos) =>
      buildGradient(pos, colors, textColor)
    );
    const contentFilter = useTransform(
      textBlur,
      (blur) => `blur(${blur.toFixed(2)}px)`
    );
    const contentTransform = useTransform(
      textShift,
      (shift) => `translateY(${(-2 + shift).toFixed(2)}px)`
    );

    const fixedW = useMemo(
      () =>
        isMulti && fixedWidth && measuredWidths.length > 0
          ? Math.max(...measuredWidths)
          : undefined,
      [fixedWidth, isMulti, measuredWidths]
    );

    const animatedW = useMemo(
      () =>
        isMulti && !fixedWidth && measuredWidths[activeIndex] != null
          ? measuredWidths[activeIndex]
          : undefined,
      [activeIndex, fixedWidth, isMulti, measuredWidths]
    );

    const containerStyle = useMemo(
      (): NonNullable<DiaTextMotionProps["style"]> => ({
        ...(isMulti && {
          display: "inline-block",
          overflow: "hidden",
          whiteSpace: "nowrap",
          verticalAlign: "text-center" as CSSProperties["verticalAlign"],
          ...(fixedW != null && { width: fixedW }),
        }),
      }),
      [fixedW, isMulti]
    );

    const contentStyle = useMemo(
      (): NonNullable<DiaTextMotionProps["style"]> => ({
        display: "inline-block",
        color: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundSize: "100% 100%",
        backgroundImage,
        opacity: textOpacity,
        filter: contentFilter,
        transform: contentTransform,
        willChange: "filter, opacity, transform",
      }),
      [backgroundImage, contentFilter, contentTransform, textOpacity]
    );

    const clearCycle = useCallback(() => {
      controlsRef.current?.stop();
      controlsRef.current = undefined;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = undefined;
    }, []);

    const playRef = useRef<() => void>(() => undefined);

    playRef.current = () => {
      clearCycle();
      sweepPos.set(SWEEP_START);

      controlsRef.current = animate(sweepPos, SWEEP_END, {
        duration,
        delay,
        ease: sweepEase,
        onComplete() {
          if (!repeat || texts.length === 0) {
            return;
          }

          timerRef.current = setTimeout(() => {
            const next = (indexRef.current + 1) % texts.length;

            indexRef.current = next;
            setActiveIndex(next);
            playRef.current();
          }, repeatDelay * 1000);
        },
      });
    };

    useEffect(() => {
      if (textKey === previousTextKeyRef.current) {
        return;
      }

      previousTextKeyRef.current = textKey;
      indexRef.current = 0;
      setActiveIndex(0);
      hasPlayedRef.current = false;
      clearCycle();

      if (prefersReducedMotion) {
        sweepPos.set(SWEEP_END);
        textOpacity.set(1);
        textBlur.set(0);
        textShift.set(0);
        return;
      }

      sweepPos.set(SWEEP_START);

      if (isVisible) {
        hasPlayedRef.current = true;
        playRef.current();
      }
    }, [
      clearCycle,
      isVisible,
      prefersReducedMotion,
      sweepPos,
      textBlur.set,
      textKey,
      textOpacity.set,
      textShift.set,
    ]);

    useEffect(() => {
      const element = spanRef.current;

      if (!(element && isMulti)) {
        setMeasuredWidths([]);
        return;
      }

      setMeasuredWidths(measureWidths(element, texts));
    }, [isMulti, texts]);

    useEffect(() => {
      if (prefersReducedMotion) {
        clearCycle();
        sweepPos.set(SWEEP_END);
        textOpacity.set(1);
        textBlur.set(0);
        textShift.set(0);
        return;
      }

      if (!isVisible) {
        if (!once) {
          hasPlayedRef.current = false;
        }
        return;
      }

      if (once && hasPlayedRef.current) {
        return;
      }

      hasPlayedRef.current = true;
      playRef.current();

      return clearCycle;
    }, [
      clearCycle,
      isVisible,
      once,
      prefersReducedMotion,
      sweepPos,
      textBlur,
      textOpacity,
      textShift,
    ]);

    useEffect(() => {
      if (prefersReducedMotion || !isMulti) {
        textOpacity.set(1);
        textBlur.set(0);
        textShift.set(0);
        previousActiveIndexRef.current = activeIndex;
        return;
      }

      if (previousActiveIndexRef.current === activeIndex) {
        return;
      }

      previousActiveIndexRef.current = activeIndex;
      textOpacity.set(0.58);
      textBlur.set(8);
      textShift.set(5.5);

      const opacityControls = animate(textOpacity, 1, {
        duration: 0.26,
        ease: TEXT_SWAP_EASE,
      });
      const blurControls = animate(textBlur, 0, {
        duration: 0.34,
        ease: TEXT_SWAP_EASE,
      });
      const shiftControls = animate(textShift, 0, {
        duration: 0.34,
        ease: TEXT_SWAP_EASE,
      });

      return () => {
        opacityControls.stop();
        blurControls.stop();
        shiftControls.stop();
      };
    }, [
      activeIndex,
      isMulti,
      prefersReducedMotion,
      textBlur,
      textOpacity,
      textShift,
    ]);

    useEffect(() => clearCycle, [clearCycle]);

    const setRefs = (node: HTMLSpanElement | null) => {
      spanRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <motion.span
        animate={animatedW != null ? { width: animatedW } : undefined}
        className={cn("align-bottom text-inherit leading-[100%]", className)}
        ref={setRefs}
        style={containerStyle}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        {...props}
      >
        <motion.span
          aria-hidden
          className="inline-block text-inherit leading-[100%]"
          style={contentStyle}
        >
          {texts[activeIndex]}
        </motion.span>
        <span className="sr-only">{texts[activeIndex]}</span>
      </motion.span>
    );
  }
);

DiaTextReveal.displayName = "DiaTextReveal";

const DiaText = DiaTextReveal;

export { DiaText, DiaTextReveal };
