"use client";

import {
  motion,
  type Transition,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  createElement,
  type ElementType,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type SplitMode = "word" | "char";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const DEFAULT_SPRING = { stiffness: 140, damping: 26, mass: 1.2 };
const WORD_SPLIT_REGEX = /\s+/;
const IN_VIEW_OPTIONS = {
  amount: "some" as const,
  margin: "0px 0px -8% 0px" as const,
};

export interface RevealTextProps {
  text: string | string[];
  as?: ElementType;
  className?: string;
  split?: SplitMode;
  stagger?: number;
  delay?: number;
  blur?: number;
  yOffset?: string | number;
  spring?: { stiffness?: number; damping?: number; mass?: number };
  once?: boolean;
  whileInView?: boolean;
  children?: ReactNode;
}

type RevealUnit = {
  lineKey: string;
  unit: string;
  unitKey: string;
  unitDelay: number;
  showSpaceAfter: boolean;
};

type RevealTextUnitProps = {
  unit: RevealUnit;
  blur: number;
  yOffset: string | number;
  useBlur: boolean;
  reduceMotion: boolean | null;
  shouldAnimate: boolean;
  springConfig: { stiffness: number; damping: number; mass: number };
};

function splitLine(line: string, split: SplitMode) {
  if (split === "char") {
    return Array.from(line);
  }

  return line.split(WORD_SPLIT_REGEX).filter(Boolean);
}

function getUnitMotionState({
  unit,
  blur,
  yOffset,
  useBlur,
  reduceMotion,
  shouldAnimate,
  springConfig,
}: RevealTextUnitProps) {
  const initial = reduceMotion
    ? { opacity: 0 }
    : {
        y: yOffset,
        opacity: 0,
        ...(useBlur ? { filter: `blur(${blur}px)` } : {}),
      };
  const revealed = reduceMotion
    ? { opacity: 1 }
    : {
        y: 0,
        opacity: 1,
        ...(useBlur ? { filter: "blur(0px)" } : {}),
      };
  const animate = shouldAnimate ? revealed : initial;
  const transition: Transition = reduceMotion
    ? {
        opacity: {
          duration: 0.25,
          ease: EASE_OUT,
          delay: unit.unitDelay * 0.3,
        },
      }
    : {
        y: {
          type: "spring" as const,
          ...springConfig,
          delay: unit.unitDelay,
        },
        opacity: {
          duration: 0.7,
          ease: EASE_OUT,
          delay: unit.unitDelay,
        },
        ...(useBlur
          ? {
              filter: {
                duration: 0.9,
                ease: EASE_OUT,
                delay: unit.unitDelay,
              },
            }
          : {}),
      };

  return { initial, animate, transition };
}

function RevealTextUnit(props: RevealTextUnitProps) {
  const { unit } = props;
  const { initial, animate, transition } = getUnitMotionState(props);

  return (
    <motion.span
      animate={animate}
      className="inline-block transform-gpu will-change-transform"
      initial={initial}
      transition={transition}
    >
      {unit.unit}
      {unit.showSpaceAfter ? (
        <span className="inline-block">&nbsp;</span>
      ) : null}
    </motion.span>
  );
}

function useBlurMotionEnabled() {
  const [blurEnabled, setBlurEnabled] = useState(true);

  useEffect(() => {
    const update = () => {
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      setBlurEnabled(!coarsePointer);
    };

    update();

    const coarseMedia = window.matchMedia("(pointer: coarse)");
    coarseMedia.addEventListener("change", update);

    return () => {
      coarseMedia.removeEventListener("change", update);
    };
  }, []);

  return blurEnabled;
}

function useRevealReady(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  inView: boolean
) {
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setReady(true);
      return;
    }

    if (inView) {
      setReady(true);
    }
  }, [enabled, inView]);

  useEffect(() => {
    if (!enabled || ready) return;

    const node = ref.current;
    if (!node) return;

    const isVisible = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      const viewHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const viewWidth =
        window.innerWidth || document.documentElement.clientWidth;

      return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < viewHeight &&
        rect.left < viewWidth
      );
    };

    if (isVisible()) {
      setReady(true);
      return;
    }

    const frame = requestAnimationFrame(() => {
      if (isVisible()) setReady(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [enabled, ready, ref]);

  return ready;
}

function buildRevealUnits(
  lines: string[],
  split: SplitMode,
  delay: number,
  stagger: number
) {
  const units: RevealUnit[] = [];
  const lineCounts = new Map<string, number>();
  let unitIndex = 0;

  for (const line of lines) {
    if (!line) continue;

    const lineCount = lineCounts.get(line) ?? 0;
    lineCounts.set(line, lineCount + 1);
    const lineKey = `${line}-${lineCount}`;
    const lineUnits = splitLine(line, split);
    const unitCounts = new Map<string, number>();

    lineUnits.forEach((unit, index) => {
      const unitCount = unitCounts.get(unit) ?? 0;
      unitCounts.set(unit, unitCount + 1);

      units.push({
        lineKey,
        unit,
        unitKey: `${lineKey}-${unit}-${unitCount}`,
        unitDelay: delay + unitIndex * stagger,
        showSpaceAfter: split === "word" && index < lineUnits.length - 1,
      });

      unitIndex += 1;
    });
  }

  return units;
}

export function RevealText({
  text,
  as: Comp = "span",
  className,
  split = "word",
  stagger = 0.09,
  delay = 0,
  blur = 12,
  yOffset = "40%",
  spring,
  once = true,
  whileInView = false,
  children,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const wasInView = useRef(false);
  const reduceMotion = useReducedMotion();
  const blurMotionEnabled = useBlurMotionEnabled();
  const useBlur = blurMotionEnabled && !reduceMotion && blur > 0;
  const inView = useInView(ref, { ...IN_VIEW_OPTIONS, once });
  const inViewReady = useRevealReady(ref, whileInView, inView);
  const [replayKey, setReplayKey] = useState(0);

  const lines = useMemo(
    () => (Array.isArray(text) ? text : [text]).filter(Boolean),
    [text]
  );
  const accessibleText = useMemo(() => lines.join(" "), [lines]);
  const revealUnits = useMemo(
    () => buildRevealUnits(lines, split, delay, stagger),
    [delay, lines, split, stagger]
  );
  const unitsByLine = useMemo(() => {
    const grouped = new Map<string, RevealUnit[]>();

    for (const unit of revealUnits) {
      const lineUnits = grouped.get(unit.lineKey) ?? [];
      lineUnits.push(unit);
      grouped.set(unit.lineKey, lineUnits);
    }

    return grouped;
  }, [revealUnits]);
  const lineKeys = useMemo(() => [...unitsByLine.keys()], [unitsByLine]);

  useEffect(() => {
    if (!(whileInView && inView)) return;

    if (!once && wasInView.current) {
      setReplayKey((current) => current + 1);
    }

    wasInView.current = true;
  }, [inView, once, whileInView]);

  const shouldAnimate = whileInView ? inViewReady : true;
  const springConfig = { ...DEFAULT_SPRING, ...spring };
  const unitMotionProps = {
    blur,
    yOffset,
    useBlur,
    reduceMotion,
    shouldAnimate,
    springConfig,
  };

  if (!accessibleText) {
    return children
      ? createElement(Comp, { className: cn("block", className) }, children)
      : null;
  }

  const animatedContent = (
    <span key={replayKey}>
      {lineKeys.map((lineKey) => (
        <span className="block" key={lineKey}>
          {(unitsByLine.get(lineKey) ?? []).map((unit) => (
            <RevealTextUnit
              key={unit.unitKey}
              unit={unit}
              {...unitMotionProps}
            />
          ))}
        </span>
      ))}
    </span>
  );

  return (
    <>
      <span className="sr-only">{accessibleText}</span>
      {createElement(
        Comp,
        {
          ref,
          className: cn("block", className),
          "aria-hidden": true,
        },
        animatedContent
      )}
      {children}
    </>
  );
}
