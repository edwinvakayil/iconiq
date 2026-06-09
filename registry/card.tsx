"use client";

import {
  type MotionStyle,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const MotionDiv = motion.div;

/** Fluid hover — low bounce, long settle (same family as progress fill). */
const cardHoverSpring = {
  type: "spring" as const,
  stiffness: 95,
  damping: 19,
  mass: 0.92,
  restDelta: 0.001,
};

const cardLayoutTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 30,
  mass: 0.85,
};

const CARD_SHADOW_HOVER =
  "0 20px 42px -30px rgba(15,23,42,0.22), 0 0 0 1px rgba(15,23,42,0.06)";

type MotionSafeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

type CardProps = MotionSafeDivProps & {
  interactive?: boolean;
  onHoverEnd?: () => void;
  onHoverStart?: () => void;
};

type CardSectionProps = MotionSafeDivProps;

const cardSectionMotionProps = {
  layout: "position" as const,
  transition: cardLayoutTransition,
};

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function useCardHoverMotion(enabled: boolean) {
  const hoverTarget = useMotionValue(0);
  const hover = useSpring(hoverTarget, cardHoverSpring);

  const y = useTransform(hover, [0, 1], [0, -5]);
  const scale = useTransform(hover, [0, 1], [1, 1.006]);
  const shadowOpacity = useTransform(hover, [0, 1], [0, 1]);

  const setHover = React.useCallback(
    (active: boolean) => {
      if (!enabled) return;
      hoverTarget.set(active ? 1 : 0);
    },
    [enabled, hoverTarget]
  );

  React.useEffect(() => {
    if (!enabled) {
      hoverTarget.set(0);
    }
  }, [enabled, hoverTarget]);

  const hoverStyle: MotionStyle = { y, scale };

  return {
    hoverStyle,
    shadowOpacity,
    setHover,
  };
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      interactive = false,
      style: styleProp,
      onBlurCapture,
      onFocusCapture,
      onHoverEnd,
      onHoverStart,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    ref
  ) => {
    const motionEnabled = interactive;
    const focusWithinRef = React.useRef(false);
    const pointerInsideRef = React.useRef(false);
    const { hoverStyle, shadowOpacity, setHover } =
      useCardHoverMotion(motionEnabled);

    const activateHover = React.useCallback(() => {
      setHover(true);
    }, [setHover]);

    const deactivateHover = React.useCallback(() => {
      if (!(focusWithinRef.current || pointerInsideRef.current)) {
        setHover(false);
      }
    }, [setHover]);

    const handleHoverStart = React.useCallback(() => {
      onHoverStart?.();
      activateHover();
    }, [activateHover, onHoverStart]);

    const handleHoverEnd = React.useCallback(() => {
      onHoverEnd?.();
      deactivateHover();
    }, [deactivateHover, onHoverEnd]);

    const handlePointerEnter = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerEnter?.(event);
        if (event.defaultPrevented) return;
        pointerInsideRef.current = true;
        activateHover();
      },
      [activateHover, onPointerEnter]
    );

    const handlePointerLeave = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(event);
        if (event.defaultPrevented) return;
        pointerInsideRef.current = false;
        deactivateHover();
      },
      [deactivateHover, onPointerLeave]
    );

    const handleFocusCapture = React.useCallback(
      (event: React.FocusEvent<HTMLDivElement>) => {
        onFocusCapture?.(event);
        if (event.defaultPrevented) return;
        focusWithinRef.current = true;
        activateHover();
      },
      [activateHover, onFocusCapture]
    );

    const handleBlurCapture = React.useCallback(
      (event: React.FocusEvent<HTMLDivElement>) => {
        onBlurCapture?.(event);
        if (event.defaultPrevented) return;

        const next = event.relatedTarget;
        if (next instanceof Node && event.currentTarget.contains(next)) {
          return;
        }

        focusWithinRef.current = false;
        deactivateHover();
      },
      [deactivateHover, onBlurCapture]
    );

    return (
      <MotionDiv
        {...props}
        className={cn(
          componentThemeClassName,
          "relative flex transform-gpu flex-col gap-4 overflow-hidden rounded-lg border border-border/70 bg-card/95 py-4 text-card-foreground text-sm backdrop-blur-[2px]",
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-1 before:h-px before:bg-linear-to-r before:from-transparent before:via-foreground/12 before:to-transparent before:opacity-60",
          "has-[>img:first-child]:pt-0 has-data-[slot=card-footer]:pb-0",
          "[&>img:first-child]:rounded-t-[inherit] [&>img:last-child]:rounded-b-[inherit]",
          motionEnabled && [
            "shadow-[0_1px_0_rgba(15,23,42,0.02),0_0_0_1px_rgba(0,0,0,0.03)]",
            "transition-[background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "before:transition-opacity before:duration-500 hover:border-foreground/11 hover:bg-card hover:before:opacity-100",
            "focus-within:border-foreground/11 focus-within:bg-card focus-within:before:opacity-100",
          ],
          !interactive && [
            "transition-[border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          ],
          className
        )}
        data-interactive={interactive ? "true" : undefined}
        data-slot="card"
        initial={false}
        layout
        onBlurCapture={motionEnabled ? handleBlurCapture : onBlurCapture}
        onFocusCapture={motionEnabled ? handleFocusCapture : onFocusCapture}
        onHoverEnd={motionEnabled ? handleHoverEnd : onHoverEnd}
        onHoverStart={motionEnabled ? handleHoverStart : onHoverStart}
        onPointerEnter={motionEnabled ? handlePointerEnter : onPointerEnter}
        onPointerLeave={motionEnabled ? handlePointerLeave : onPointerLeave}
        ref={(node) => {
          assignRef(ref, node);
        }}
        style={motionEnabled ? { ...styleProp, ...hoverStyle } : styleProp}
        transition={cardLayoutTransition}
      >
        {motionEnabled ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
            style={{
              boxShadow: CARD_SHADOW_HOVER,
              opacity: shadowOpacity,
            }}
          />
        ) : null}
        {children}
      </MotionDiv>
    );
  }
);

Card.displayName = "Card";

function CardHeader({ className, ...props }: CardSectionProps) {
  return (
    <MotionDiv
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className
      )}
      data-slot="card-header"
      {...cardSectionMotionProps}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: CardSectionProps) {
  return (
    <MotionDiv
      className={cn(
        "cn-font-heading font-medium text-base leading-snug tracking-[-0.01em]",
        className
      )}
      data-slot="card-title"
      {...cardSectionMotionProps}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: CardSectionProps) {
  return (
    <MotionDiv
      className={cn("text-muted-foreground text-sm leading-6", className)}
      data-slot="card-description"
      {...cardSectionMotionProps}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: CardSectionProps) {
  return (
    <MotionDiv
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      data-slot="card-action"
      {...cardSectionMotionProps}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: CardSectionProps) {
  return (
    <MotionDiv
      className={cn("px-4", className)}
      data-slot="card-content"
      {...cardSectionMotionProps}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: CardSectionProps) {
  return (
    <MotionDiv
      className={cn(
        "flex items-center rounded-b-[inherit] border-border/60 border-t bg-muted/45 p-4 text-muted-foreground backdrop-blur-[1px] transition-colors duration-300",
        className
      )}
      data-slot="card-footer"
      {...cardSectionMotionProps}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
