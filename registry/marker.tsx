"use client";

import { motion, useReducedMotion } from "motion/react";
import { forwardRef, type ReactNode, useId } from "react";

import { cn } from "@/lib/utils";

const DRAW_EASE = [0.65, 0, 0.35, 1] as const;
const DEFAULT_DURATION = 0.7;
const STAGGER_SECONDS = 0.16;

type StrokeLinecap = "butt" | "round" | "square";
type StrokeLinejoin = "bevel" | "miter" | "round";

function DrawPath({
  animate,
  d,
  delay,
  duration,
  fill,
  filter,
  opacity = 1,
  reduceMotion,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
}: {
  animate: boolean;
  d: string;
  delay: number;
  duration: number;
  fill?: string;
  filter?: string;
  opacity?: number;
  reduceMotion: boolean | null;
  stroke?: string;
  strokeLinecap?: StrokeLinecap;
  strokeLinejoin?: StrokeLinejoin;
  strokeWidth?: number;
}) {
  const pathProps = {
    d,
    fill,
    filter,
    stroke,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth,
  };

  if (!(animate && !reduceMotion)) {
    return <path {...pathProps} opacity={opacity} />;
  }

  return (
    <motion.path
      {...pathProps}
      initial={{ opacity: 0, pathLength: 0 }}
      transition={{
        opacity: { delay, duration: Math.min(duration, 0.3) },
        pathLength: { delay, duration, ease: DRAW_EASE },
      }}
      viewport={{ once: true }}
      whileInView={{ opacity, pathLength: 1 }}
    />
  );
}

function RoughFilters({ id }: Readonly<{ id: string }>) {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0">
      <defs>
        <filter
          height="160%"
          id={`hd-rough-${id}`}
          width="160%"
          x="-30%"
          y="-30%"
        >
          <feTurbulence
            baseFrequency={0.045}
            numOctaves={2}
            result="n"
            seed={4}
            type="fractalNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale={2.6}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter
          height="160%"
          id={`hd-rough-soft-${id}`}
          width="160%"
          x="-30%"
          y="-30%"
        >
          <feTurbulence
            baseFrequency={0.035}
            numOctaves={2}
            result="n2"
            seed={11}
            type="fractalNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n2"
            scale={1.5}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

type DecorationProps = Readonly<{
  animate: boolean;
  className?: string;
  delay: number;
  duration: number;
  filterId: string;
  filterSoftId: string;
  reduceMotion: boolean | null;
}>;

function WavyDecoration({
  animate,
  className,
  delay,
  duration,
  filterSoftId,
  reduceMotion,
}: DecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 140 14"
    >
      <DrawPath
        animate={animate}
        d="M2,6 Q5.5,3 9,6 T17,6 T25,6 T33,6 T41,6 T49,6 T57,6 T65,6 T73,6 T81,6 T89,6 T97,6 T105,6 T113,6 T121,6 T129,6 T137,6"
        delay={delay}
        duration={duration}
        fill="none"
        filter={`url(#${filterSoftId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2.2}
      />
    </svg>
  );
}

function CircleDecoration({
  animate,
  className,
  delay,
  duration,
  filterId,
  filterSoftId,
  reduceMotion,
}: DecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 220 64"
    >
      <DrawPath
        animate={animate}
        d="M40,40 C20,23 53,7 102,5 C153,3 207,11 211,29 C215,47 167,60 109,60
           C59,60 15,53 19,35 C21,27 27,22 37,20"
        delay={delay}
        duration={duration}
        fill="none"
        filter={`url(#${filterId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={3}
      />
      <DrawPath
        animate={animate}
        d="M43,37 C28,25 58,9 105,7 C151,6 199,14 206,29 C212,45 167,57 110,58"
        delay={delay + STAGGER_SECONDS}
        duration={duration}
        fill="none"
        filter={`url(#${filterSoftId})`}
        opacity={0.55}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function HighlightDecoration({
  animate,
  className,
  delay,
  duration,
  filterSoftId,
  reduceMotion,
}: DecorationProps) {
  const shouldAnimate = animate && !reduceMotion;

  return (
    <motion.svg
      aria-hidden="true"
      className={className}
      initial={shouldAnimate ? { scaleX: 0 } : undefined}
      preserveAspectRatio="none"
      style={shouldAnimate ? { transformOrigin: "0% 50%" } : undefined}
      transition={
        shouldAnimate
          ? { delay, duration: duration * 1.1, ease: DRAW_EASE }
          : undefined
      }
      viewBox="0 0 170 26"
      viewport={shouldAnimate ? { once: true } : undefined}
      whileInView={shouldAnimate ? { scaleX: 1 } : undefined}
    >
      <path
        d="M4,17 C2,11 5,7 12,6 C45,2 95,2 138,4 C152,5 164,7 166,13
           C167,18 163,21 155,22 C112,24 60,24 16,22 C8,21.5 4,20 4,17 Z"
        fill="currentColor"
        filter={`url(#${filterSoftId})`}
      />
    </motion.svg>
  );
}

function UnderlineDecoration({
  animate,
  className,
  delay,
  duration,
  filterSoftId,
  reduceMotion,
}: DecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 140 10"
    >
      <DrawPath
        animate={animate}
        d="M3,6 C40,3 100,3 137,5"
        delay={delay}
        duration={duration}
        fill="none"
        filter={`url(#${filterSoftId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2.4}
      />
    </svg>
  );
}

function LineDecoration({
  animate,
  className,
  delay,
  duration,
  reduceMotion,
}: DecorationProps) {
  const shouldAnimate = animate && !reduceMotion;

  return (
    <motion.span
      aria-hidden="true"
      className={cn("block rounded-full bg-current", className)}
      initial={shouldAnimate ? { scaleX: 0 } : undefined}
      style={shouldAnimate ? { transformOrigin: "0% 50%" } : undefined}
      transition={
        shouldAnimate ? { delay, duration, ease: DRAW_EASE } : undefined
      }
      viewport={shouldAnimate ? { once: true } : undefined}
      whileInView={shouldAnimate ? { scaleX: 1 } : undefined}
    />
  );
}

function DottedUnderlineDecoration({
  animate,
  className,
  delay,
  duration,
  reduceMotion,
}: DecorationProps) {
  const shouldAnimate = animate && !reduceMotion;

  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "bg-[radial-gradient(circle,currentColor_1.5px,transparent_1.5px)]",
        "bg-position-[0_100%] bg-size-[0.5em_100%] bg-repeat-x",
        className
      )}
      initial={shouldAnimate ? { scaleX: 0 } : undefined}
      style={shouldAnimate ? { transformOrigin: "0% 50%" } : undefined}
      transition={
        shouldAnimate ? { delay, duration, ease: DRAW_EASE } : undefined
      }
      viewport={shouldAnimate ? { once: true } : undefined}
      whileInView={shouldAnimate ? { scaleX: 1 } : undefined}
    />
  );
}

function DoubleUnderlineDecoration({
  animate,
  className,
  delay,
  duration,
  filterSoftId,
  reduceMotion,
}: DecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 140 16"
    >
      <DrawPath
        animate={animate}
        d="M3,5 C40,2 100,2 137,4"
        delay={delay}
        duration={duration}
        fill="none"
        filter={`url(#${filterSoftId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2.2}
      />
      <DrawPath
        animate={animate}
        d="M5,12 C42,9 98,10 135,11"
        delay={delay + STAGGER_SECONDS}
        duration={duration}
        fill="none"
        filter={`url(#${filterSoftId})`}
        opacity={0.75}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.8}
      />
    </svg>
  );
}

function StrikethroughDecoration({
  animate,
  className,
  delay,
  duration,
  filterSoftId,
  reduceMotion,
}: DecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 140 10"
    >
      <DrawPath
        animate={animate}
        d="M3,5 C40,7 100,3 137,5"
        delay={delay}
        duration={duration}
        fill="none"
        filter={`url(#${filterSoftId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2.4}
      />
    </svg>
  );
}

function CrossOutDecoration({
  animate,
  className,
  delay,
  duration,
  filterId,
  filterSoftId,
  reduceMotion,
}: DecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 140 40"
    >
      <DrawPath
        animate={animate}
        d="M4,32 C40,10 96,30 136,8"
        delay={delay}
        duration={duration}
        fill="none"
        filter={`url(#${filterId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2.4}
      />
      <DrawPath
        animate={animate}
        d="M6,10 C44,30 92,12 134,30"
        delay={delay + STAGGER_SECONDS}
        duration={duration}
        fill="none"
        filter={`url(#${filterSoftId})`}
        opacity={0.7}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2}
      />
    </svg>
  );
}

function ArrowUnderlineDecoration({
  animate,
  className,
  delay,
  duration,
  filterSoftId,
  reduceMotion,
}: DecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 150 18"
    >
      <DrawPath
        animate={animate}
        d="M3,7 C45,3 105,4 140,8"
        delay={delay}
        duration={duration}
        fill="none"
        filter={`url(#${filterSoftId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2.4}
      />
      <DrawPath
        animate={animate}
        d="M132,3 L142,8 L131,13"
        delay={delay + STAGGER_SECONDS}
        duration={duration}
        fill="none"
        filter={`url(#${filterSoftId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.4}
      />
    </svg>
  );
}

function BracketDecoration({
  animate,
  className,
  delay,
  duration,
  filterId,
  reduceMotion,
}: DecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 160 60"
    >
      <DrawPath
        animate={animate}
        d="M18,6 C9,7 6,12 6,30 C6,48 9,53 18,54"
        delay={delay}
        duration={duration}
        fill="none"
        filter={`url(#${filterId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2.6}
      />
      <DrawPath
        animate={animate}
        d="M142,6 C151,7 154,12 154,30 C154,48 151,53 142,54"
        delay={delay + STAGGER_SECONDS}
        duration={duration}
        fill="none"
        filter={`url(#${filterId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={2.6}
      />
    </svg>
  );
}

function BoxDecoration({
  animate,
  className,
  delay,
  duration,
  filterId,
  reduceMotion,
}: DecorationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 200 64"
    >
      <DrawPath
        animate={animate}
        d="M12,10 C60,6 140,6 188,10 C193,26 193,40 188,54
           C140,58 60,58 12,54 C7,40 7,26 12,10 Z"
        delay={delay}
        duration={duration}
        fill="none"
        filter={`url(#${filterId})`}
        reduceMotion={reduceMotion}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.6}
      />
    </svg>
  );
}

const annotationStyles = {
  wavy: {
    wrapper: "relative inline-block whitespace-nowrap",
    Decoration: WavyDecoration,
    decorationClassName:
      "pointer-events-none absolute bottom-[-0.4em] left-[-2%] h-[0.7em] w-[104%]",
    defaultColor: "text-purple-300",
  },
  circle: {
    wrapper: "relative inline-block px-1 whitespace-nowrap",
    Decoration: CircleDecoration,
    decorationClassName:
      "pointer-events-none absolute inset-[-0.6em_-0.55em] h-[calc(100%+1.2em)] w-[calc(100%+1.1em)]",
    defaultColor: "text-cyan-200",
  },
  highlight: {
    wrapper: "relative inline-block whitespace-nowrap",
    Decoration: HighlightDecoration,
    decorationClassName:
      "pointer-events-none absolute inset-x-[-4%] bottom-[-0.08em] z-0 h-[1.15em] w-[108%]",
    defaultColor: "text-yellow-300/60",
  },
  underline: {
    wrapper: "relative inline-block whitespace-nowrap",
    Decoration: UnderlineDecoration,
    decorationClassName:
      "pointer-events-none absolute bottom-[-0.32em] left-[-1%] h-[0.5em] w-[102%]",
    defaultColor: "text-purple-400",
  },
  line: {
    wrapper: "relative inline-block whitespace-nowrap",
    Decoration: LineDecoration,
    decorationClassName:
      "pointer-events-none absolute bottom-[-0.18em] left-[-1%] block h-[2px] w-[102%]",
    defaultColor: "text-neutral-500",
  },
  dottedUnderline: {
    wrapper: "relative inline-block whitespace-nowrap",
    Decoration: DottedUnderlineDecoration,
    decorationClassName:
      "pointer-events-none absolute bottom-[-0.35em] left-[-1%] block h-[0.55em] w-[102%]",
    defaultColor: "text-neutral-400",
  },
  doubleUnderline: {
    wrapper: "relative inline-block whitespace-nowrap",
    Decoration: DoubleUnderlineDecoration,
    decorationClassName:
      "pointer-events-none absolute bottom-[-0.5em] left-[-1%] h-[0.7em] w-[102%]",
    defaultColor: "text-emerald-400",
  },
  strikethrough: {
    wrapper: "relative inline-block whitespace-nowrap",
    Decoration: StrikethroughDecoration,
    decorationClassName:
      "pointer-events-none absolute top-1/2 left-[-1%] h-[0.5em] w-[102%] -translate-y-1/2",
    defaultColor: "text-red-400",
  },
  crossOut: {
    wrapper: "relative inline-block whitespace-nowrap",
    Decoration: CrossOutDecoration,
    decorationClassName:
      "pointer-events-none absolute top-1/2 left-[-2%] h-[1.4em] w-[104%] -translate-y-1/2",
    defaultColor: "text-red-400",
  },
  arrow: {
    wrapper: "relative inline-block whitespace-nowrap",
    Decoration: ArrowUnderlineDecoration,
    decorationClassName:
      "pointer-events-none absolute bottom-[-0.45em] left-[-1%] h-[0.8em] w-[106%]",
    defaultColor: "text-blue-400",
  },
  bracket: {
    wrapper: "relative inline-block px-[0.35em] whitespace-nowrap",
    Decoration: BracketDecoration,
    decorationClassName:
      "pointer-events-none absolute inset-y-[-0.25em] left-[-0.15em] h-[calc(100%+0.5em)] w-[calc(100%+0.3em)]",
    defaultColor: "text-neutral-500",
  },
  box: {
    wrapper: "relative inline-block px-[0.4em] whitespace-nowrap",
    Decoration: BoxDecoration,
    decorationClassName:
      "pointer-events-none absolute inset-[-0.4em_-0.4em] h-[calc(100%+0.8em)] w-[calc(100%+0.8em)]",
    defaultColor: "text-orange-400",
  },
} as const;

type AnnotationVariant = keyof typeof annotationStyles;

export type MarkerProps = Readonly<{
  /** Text (or inline content) to annotate. */
  children: ReactNode;
  /** Hand-drawn annotation style. @default "wavy" */
  variant?: AnnotationVariant;
  /** Overrides the variant's default ink color. Accepts a Tailwind text-color class. */
  color?: string;
  /** Whether the decoration draws itself in when scrolled into view. @default true */
  animate?: boolean;
  /** Draw duration in seconds for a single stroke. @default 0.7 */
  duration?: number;
  /** Delay in seconds before the draw-in starts. @default 0 */
  delay?: number;
  className?: string;
}>;

// Hand-drawn text annotations — wavy, circle, highlight, underline, and more
// — that draw themselves in like ink as they scroll into view, or render
// fully static when animate is off.
export const Marker = forwardRef<HTMLSpanElement, MarkerProps>(
  (
    {
      children,
      variant = "wavy",
      color,
      animate = true,
      duration = DEFAULT_DURATION,
      delay = 0,
      className,
    },
    ref
  ) => {
    // React's useId() wraps the id in colons (e.g. ":r0:"), which some
    // browsers fail to resolve inside an SVG url(#...) reference.
    const id = useId().replace(/:/g, "");
    const reduceMotion = useReducedMotion();
    const style = annotationStyles[variant];
    const Decoration = style.Decoration;
    const decorationClass = cn(
      style.decorationClassName,
      color ?? style.defaultColor
    );
    const filterId = `hd-rough-${id}`;
    const filterSoftId = `hd-rough-soft-${id}`;

    // The highlight fill sits behind the glyphs so it doesn't cover them.
    const isBehindText = variant === "highlight";

    const decoration = (
      <Decoration
        animate={animate}
        className={decorationClass}
        delay={delay}
        duration={duration}
        filterId={filterId}
        filterSoftId={filterSoftId}
        reduceMotion={reduceMotion}
      />
    );

    if (isBehindText) {
      return (
        <>
          <RoughFilters id={id} />
          <span className={cn(style.wrapper, className)} ref={ref}>
            <span className="relative z-10">{children}</span>
            {decoration}
          </span>
        </>
      );
    }

    return (
      <>
        <RoughFilters id={id} />
        <span className={cn(style.wrapper, className)} ref={ref}>
          {children}
          {decoration}
        </span>
      </>
    );
  }
);

Marker.displayName = "Marker";
