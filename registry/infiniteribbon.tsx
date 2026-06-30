"use client";

import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] [--ribbon-warning-bg:#fef3c7] [--ribbon-warning-fg:#78350f] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)] dark:[--ribbon-warning-bg:#422006] dark:[--ribbon-warning-fg:#fde68a]";

const STYLE_ID = "iconiq-infinite-ribbon-styles";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DEFAULT_GAP = "2rem";
const DEFAULT_REPEAT = 5;
const DEFAULT_DURATION = 10;
const MIN_DURATION = 0.1;
const MIN_REPEAT_BUFFER = 2;
const SEGMENT_CLASS =
  "inline-flex shrink-0 items-center whitespace-nowrap pr-[var(--ribbon-gap)]";

const RIBBON_CSS = `
@keyframes iconiq-infinite-ribbon-x {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes iconiq-infinite-ribbon-x-reverse {
  from {
    transform: translate3d(-50%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

.iconiq-infinite-ribbon-track {
  animation-duration: var(--ribbon-duration, 10s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.iconiq-infinite-ribbon-track[data-animated="true"] {
  will-change: transform;
}

.iconiq-infinite-ribbon-track[data-direction="forward"] {
  animation-name: iconiq-infinite-ribbon-x;
}

.iconiq-infinite-ribbon-track[data-direction="reverse"] {
  animation-name: iconiq-infinite-ribbon-x-reverse;
}

.iconiq-infinite-ribbon-root[data-pause-on-hover="true"]:hover .iconiq-infinite-ribbon-track,
.iconiq-infinite-ribbon-root[data-pause-on-hover="true"]:focus-within .iconiq-infinite-ribbon-track,
.iconiq-infinite-ribbon-track[data-paused="true"] {
  animation-play-state: paused;
}

.iconiq-infinite-ribbon-viewport[data-fade-edges="true"] {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    #000 8%,
    #000 92%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    #000 8%,
    #000 92%,
    transparent 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .iconiq-infinite-ribbon-track {
    animation: none !important;
    transform: none !important;
  }
}
`;

const linkClassName =
  "underline decoration-current/40 underline-offset-2 transition-colors hover:decoration-current";

type InfiniteRibbonVariant = "default" | "brand" | "warning";

const variantClassNames = {
  default:
    "bg-[#f3f4f6] text-neutral-900 [--ribbon-link:#111111] dark:bg-muted dark:text-foreground dark:[--ribbon-link:var(--ic-foreground)]",
  brand:
    "bg-[var(--ic-brand)] text-white [--ribbon-link:#ffffff] dark:bg-[var(--ic-brand)] dark:text-white",
  warning:
    "bg-[var(--ribbon-warning-bg)] text-[var(--ribbon-warning-fg)] [--ribbon-link:var(--ribbon-warning-fg)]",
} as const satisfies Record<InfiniteRibbonVariant, string>;

export interface InfiniteRibbonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode;
  items?: string[];
  separator?: ReactNode;
  repeat?: number;
  duration?: number;
  speed?: number;
  reverse?: boolean;
  rotation?: number;
  variant?: InfiniteRibbonVariant;
  gap?: number | string;
  pauseOnHover?: boolean;
  pauseWhenHidden?: boolean;
  fadeEdges?: boolean;
  selectable?: boolean;
  href?: string;
  interactive?: boolean;
  "aria-label"?: string;
}

function ensureRibbonStyles() {
  if (typeof document === "undefined") {
    return;
  }

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  if (style.textContent !== RIBBON_CSS) {
    style.textContent = RIBBON_CSS;
  }
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onStoreChange);

  return () => {
    media.removeEventListener("change", onStoreChange);
  };
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

function clampRepeat(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_REPEAT;
  }

  return Math.max(1, Math.floor(value));
}

function clampDuration(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_DURATION;
  }

  return Math.max(MIN_DURATION, value);
}

function clampSpeed(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return value;
}

function clampRotation(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function resolveGap(gap?: number | string) {
  if (gap === undefined) {
    return DEFAULT_GAP;
  }

  if (typeof gap === "number") {
    return Number.isFinite(gap) ? `${gap}px` : DEFAULT_GAP;
  }

  return gap.trim() || DEFAULT_GAP;
}

function normalizeItems(items?: string[]) {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => item.trim()).filter(Boolean);
}

function nodeToPlainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(nodeToPlainText).join("");
  }

  return "";
}

function hasRibbonContent(items: string[], children?: ReactNode) {
  if (items.length > 0) {
    return true;
  }

  return nodeToPlainText(children).trim().length > 0;
}

function buildItemsContent(
  items: string[],
  separator: ReactNode,
  children: ReactNode | undefined
) {
  if (items.length > 0) {
    return items.map((item, index) => (
      <span className="inline-flex items-center" key={`${item}-${index}`}>
        {index > 0 ? (
          <span aria-hidden className="mx-[calc(var(--ribbon-gap)/2)]">
            {separator}
          </span>
        ) : null}
        {item}
      </span>
    ));
  }

  return children;
}

function getAccessibleLabel({
  ariaLabel,
  items,
  children,
}: {
  ariaLabel?: string;
  items: string[];
  children?: ReactNode;
}) {
  if (ariaLabel) {
    return ariaLabel;
  }

  if (items.length > 0) {
    return items.join(", ");
  }

  const text = nodeToPlainText(children).trim();
  return text || "Announcement";
}

const InfiniteRibbon = forwardRef<HTMLDivElement, InfiniteRibbonProps>(
  function InfiniteRibbon(
    {
      children,
      items,
      separator = " · ",
      repeat = DEFAULT_REPEAT,
      duration = DEFAULT_DURATION,
      speed,
      reverse = false,
      rotation = 0,
      variant = "default",
      gap,
      pauseOnHover = true,
      pauseWhenHidden = true,
      fadeEdges = false,
      selectable = true,
      href,
      interactive,
      "aria-label": ariaLabel,
      className,
      style,
      ...props
    },
    ref
  ) {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const probeRef = useRef<HTMLSpanElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const measureFrameRef = useRef<number | null>(null);

    const resolvedRepeat = clampRepeat(repeat);
    const resolvedDuration = clampDuration(duration);
    const resolvedSpeed = clampSpeed(speed);
    const resolvedRotation = clampRotation(rotation);
    const normalizedItems = useMemo(() => normalizeItems(items), [items]);
    const resolvedGap = resolveGap(gap);
    const segmentContent = useMemo(
      () => buildItemsContent(normalizedItems, separator, children),
      [children, normalizedItems, separator]
    );
    const hasContent = hasRibbonContent(normalizedItems, children);
    const accessibleLabel = getAccessibleLabel({
      ariaLabel,
      items: normalizedItems,
      children,
    });
    const reduceMotion = usePrefersReducedMotion();
    const isInteractive = interactive ?? Boolean(href);
    const direction = reverse ? "reverse" : "forward";
    const shouldAnimate = !reduceMotion;

    const [computedRepeat, setComputedRepeat] = useState(resolvedRepeat);
    const [loopDuration, setLoopDuration] = useState(resolvedDuration);
    const [hiddenPaused, setHiddenPaused] = useState(false);

    const setWrapperRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const layoutKey = `${resolvedGap}:${normalizedItems.join("\u0000")}:${nodeToPlainText(children)}`;

    const measureLayout = useCallback(() => {
      const viewport = viewportRef.current;
      const probe = probeRef.current;
      const track = trackRef.current;

      if (!(viewport && probe)) {
        return;
      }

      const viewportWidth = viewport.clientWidth;
      const segmentWidth = probe.offsetWidth;

      if (viewportWidth > 0 && segmentWidth > 0) {
        const minPerHalf =
          Math.ceil(viewportWidth / segmentWidth) + MIN_REPEAT_BUFFER;

        setComputedRepeat((current) => {
          const next = Math.max(resolvedRepeat, minPerHalf);
          return next === current ? current : next;
        });
      }

      if (track) {
        const halfTravel = track.scrollWidth / 2;

        if (resolvedSpeed && halfTravel > 0) {
          const nextDuration = Math.max(
            MIN_DURATION,
            halfTravel / resolvedSpeed
          );
          setLoopDuration((current) =>
            Math.abs(current - nextDuration) < 0.01 ? current : nextDuration
          );
          return;
        }
      }

      setLoopDuration((current) =>
        current === resolvedDuration ? current : resolvedDuration
      );
    }, [resolvedDuration, resolvedRepeat, resolvedSpeed]);

    const scheduleMeasure = useCallback(() => {
      if (measureFrameRef.current !== null) {
        cancelAnimationFrame(measureFrameRef.current);
      }

      measureFrameRef.current = requestAnimationFrame(() => {
        measureFrameRef.current = null;
        measureLayout();
      });
    }, [measureLayout]);

    useLayoutEffect(() => {
      ensureRibbonStyles();
    }, []);

    useLayoutEffect(() => {
      setComputedRepeat(resolvedRepeat);
    }, [resolvedRepeat]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: layoutKey triggers remeasure when ribbon copy or spacing changes.
    useLayoutEffect(() => {
      if (!(hasContent && shouldAnimate)) {
        return;
      }

      scheduleMeasure();
    }, [hasContent, layoutKey, scheduleMeasure, shouldAnimate]);

    useLayoutEffect(() => {
      if (!(hasContent && shouldAnimate)) {
        return;
      }

      const viewport = viewportRef.current;
      if (!viewport) {
        return;
      }

      const observer = new ResizeObserver(() => {
        scheduleMeasure();
      });

      observer.observe(viewport);
      return () => {
        observer.disconnect();
      };
    }, [hasContent, scheduleMeasure, shouldAnimate]);

    useLayoutEffect(() => {
      return () => {
        if (measureFrameRef.current !== null) {
          cancelAnimationFrame(measureFrameRef.current);
        }
      };
    }, []);

    useLayoutEffect(() => {
      if (!(pauseWhenHidden && shouldAnimate)) {
        setHiddenPaused(false);
        return;
      }

      const syncHiddenState = () => {
        setHiddenPaused(document.hidden);
      };

      syncHiddenState();
      document.addEventListener("visibilitychange", syncHiddenState);

      return () => {
        document.removeEventListener("visibilitychange", syncHiddenState);
      };
    }, [pauseWhenHidden, shouldAnimate]);

    const trackStyle = useMemo(
      () =>
        ({
          "--ribbon-duration": `${loopDuration}s`,
          "--ribbon-gap": resolvedGap,
        }) as CSSProperties,
      [loopDuration, resolvedGap]
    );

    const renderSegmentBody = (index: number) => {
      if (href) {
        if (index > 0) {
          return (
            <span aria-hidden className={linkClassName}>
              {segmentContent}
            </span>
          );
        }

        return (
          <a className={linkClassName} href={href}>
            {segmentContent}
          </a>
        );
      }

      return segmentContent;
    };

    const isDuplicateSegment = (index: number) =>
      isInteractive && index > 0 && !href;

    const trackSegments = Array.from(
      { length: computedRepeat * 2 },
      (_, index) => (
        <span
          aria-hidden={isDuplicateSegment(index) ? true : undefined}
          className={cn(SEGMENT_CLASS, !selectable && "select-none")}
          key={`ribbon-segment-${index}`}
        >
          {renderSegmentBody(index)}
        </span>
      )
    );

    if (!hasContent) {
      return null;
    }

    const staticContent = (
      <div className="flex w-full items-center justify-center px-4 py-1.5 text-center text-sm">
        {href ? (
          <a className={linkClassName} href={href}>
            {segmentContent}
          </a>
        ) : (
          segmentContent
        )}
      </div>
    );

    const animatedContent = (
      <>
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 opacity-0"
          ref={probeRef}
        >
          <span className={SEGMENT_CLASS} style={trackStyle}>
            {renderSegmentBody(0)}
          </span>
        </span>

        <div
          aria-hidden={isInteractive ? undefined : true}
          className="iconiq-infinite-ribbon-track flex w-max flex-row"
          data-animated={shouldAnimate ? "true" : "false"}
          data-direction={direction}
          data-paused={hiddenPaused ? "true" : "false"}
          key={`${computedRepeat}-${direction}-${resolvedGap}`}
          ref={trackRef}
          style={trackStyle}
        >
          {trackSegments}
        </div>
      </>
    );

    return (
      <div
        className={cn(
          "iconiq-infinite-ribbon-rotate-wrapper w-full max-w-full origin-center",
          className
        )}
        ref={setWrapperRef}
        style={{
          ...style,
          transform:
            resolvedRotation !== 0
              ? style?.transform
                ? `${style.transform} rotate(${resolvedRotation}deg)`
                : `rotate(${resolvedRotation}deg)`
              : style?.transform,
        }}
      >
        <section
          aria-label={accessibleLabel}
          className={cn(
            componentThemeClassName,
            "iconiq-infinite-ribbon-root w-full max-w-full text-sm",
            variantClassNames[variant]
          )}
          data-pause-on-hover={pauseOnHover && shouldAnimate ? "true" : "false"}
          {...props}
        >
          {isInteractive ? null : (
            <span className="sr-only">{segmentContent}</span>
          )}

          <div
            className="iconiq-infinite-ribbon-viewport relative w-full overflow-hidden py-1.5"
            data-fade-edges={fadeEdges ? "true" : "false"}
            ref={viewportRef}
          >
            {shouldAnimate ? animatedContent : staticContent}
          </div>
        </section>
      </div>
    );
  }
);

InfiniteRibbon.displayName = "InfiniteRibbon";

export { InfiniteRibbon };
