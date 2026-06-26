"use client";

import { Slot } from "@radix-ui/react-slot";
import {
  type MotionStyle,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image, { type ImageProps } from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const cardCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[12px]";

const cardCornerInheritClassName =
  "rounded-[inherit] supports-[corner-shape:squircle]:[corner-shape:inherit]";

const cardMediaVarsClassName =
  "[--card-media-padding:1.5px] [--card-media-radius:max(0px,calc(var(--radius-lg)-var(--card-media-padding)))]";

const cardImageFrameClassName =
  "overflow-hidden rounded-[var(--card-media-radius)] supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[max(0px,calc(12px-var(--card-media-padding)))]";

const cardImageMediaClassName =
  "[&_img]:block [&_img]:size-full [&_img]:rounded-none [&_img]:object-cover [&_picture]:size-full [&_picture]:rounded-none";

const MotionDiv = motion.div;

const motionTitleElements = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  div: MotionDiv,
  span: motion.span,
} as const;

const motionDescriptionElements = {
  p: motion.p,
  div: MotionDiv,
  span: motion.span,
} as const;

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

const cardInteractiveSurfaceClassName =
  "shadow-[0_1px_0_rgba(15,23,42,0.02),0_0_0_1px_rgba(0,0,0,0.03)] transition-[background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none before:transition-opacity before:duration-500 before:motion-reduce:transition-none hover:border-foreground/11 hover:bg-card hover:before:opacity-100 focus-within:border-foreground/11 focus-within:bg-card focus-within:before:opacity-100";

const cardCssHoverMotionClassName =
  "transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[5px] hover:scale-[1.006] hover:shadow-[0_20px_42px_-30px_rgba(15,23,42,0.22),0_0_0_1px_rgba(15,23,42,0.06)] focus-within:-translate-y-[5px] focus-within:scale-[1.006] focus-within:shadow-[0_20px_42px_-30px_rgba(15,23,42,0.22),0_0_0_1px_rgba(15,23,42,0.06)] motion-reduce:transform-none motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:hover:shadow-none motion-reduce:focus-within:transform-none motion-reduce:focus-within:shadow-none";

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
  asChild?: boolean;
  interactive?: boolean;
  onHoverEnd?: () => void;
  onHoverStart?: () => void;
};

type CardSectionProps = MotionSafeDivProps;

type CardTitleElement = keyof typeof motionTitleElements;
type CardDescriptionElement = keyof typeof motionDescriptionElements;

type CardTitleProps = CardSectionProps & {
  as?: CardTitleElement;
};

type CardDescriptionProps = CardSectionProps & {
  as?: CardDescriptionElement;
};

type CardImageProps = Omit<ImageProps, "alt"> & {
  inset?: boolean;
  alt: string;
};

type CardMediaProps = CardSectionProps & {
  inset?: boolean;
};

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

function useCardSectionMotionProps() {
  const reduceMotion = useReducedMotion();

  return reduceMotion ? {} : cardSectionMotionProps;
}

function getCardSurfaceClassName({
  className,
  interactive,
  useCssHoverMotion,
}: {
  className?: string;
  interactive: boolean;
  useCssHoverMotion: boolean;
}) {
  return cn(
    componentThemeClassName,
    cardCornerClassName,
    cardMediaVarsClassName,
    "relative flex transform-gpu flex-col gap-4 overflow-hidden border border-border/70 bg-card/95 py-4 text-card-foreground text-sm backdrop-blur-[2px]",
    "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-1 before:h-px before:bg-linear-to-r before:from-transparent before:via-foreground/12 before:to-transparent before:opacity-60",
    "has-[>[data-slot=card-image]:first-child]:pt-0 has-[>img:first-child]:pt-0 has-data-[slot=card-footer]:pb-0",
    "[&>img]:rounded-none [&_[data-slot=card-image]_img]:rounded-none",
    "[&>*:not([aria-hidden=true])]:relative [&>*:not([aria-hidden=true])]:z-[1]",
    interactive && [
      cardInteractiveSurfaceClassName,
      useCssHoverMotion && cardCssHoverMotionClassName,
    ],
    !interactive && [
      "transition-[border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
    ],
    className
  );
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

function useCardInteractiveHandlers({
  activateHover,
  deactivateHover,
  includeMotionHoverEvents,
  motionEnabled,
  onBlurCapture,
  onFocusCapture,
  onHoverEnd,
  onHoverStart,
  onPointerEnter,
  onPointerLeave,
}: {
  activateHover: () => void;
  deactivateHover: (canDeactivate: boolean) => void;
  includeMotionHoverEvents: boolean;
  motionEnabled: boolean;
  onBlurCapture?: React.FocusEventHandler<HTMLDivElement>;
  onFocusCapture?: React.FocusEventHandler<HTMLDivElement>;
  onHoverEnd?: () => void;
  onHoverStart?: () => void;
  onPointerEnter?: React.PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
}) {
  const focusWithinRef = React.useRef(false);
  const pointerInsideRef = React.useRef(false);

  const notifyHoverStart = React.useCallback(() => {
    if (!includeMotionHoverEvents) {
      onHoverStart?.();
    }
  }, [includeMotionHoverEvents, onHoverStart]);

  const notifyHoverEnd = React.useCallback(() => {
    if (!includeMotionHoverEvents) {
      onHoverEnd?.();
    }
  }, [includeMotionHoverEvents, onHoverEnd]);

  const handleHoverStart = React.useCallback(() => {
    onHoverStart?.();
    activateHover();
  }, [activateHover, onHoverStart]);

  const handleHoverEnd = React.useCallback(() => {
    onHoverEnd?.();
    deactivateHover(!(focusWithinRef.current || pointerInsideRef.current));
  }, [deactivateHover, onHoverEnd]);

  const handlePointerEnter = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(event);
      if (event.defaultPrevented) return;
      pointerInsideRef.current = true;
      activateHover();
      notifyHoverStart();
    },
    [activateHover, notifyHoverStart, onPointerEnter]
  );

  const handlePointerLeave = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event);
      if (event.defaultPrevented) return;
      pointerInsideRef.current = false;
      const canDeactivate = !focusWithinRef.current;
      deactivateHover(canDeactivate);
      if (canDeactivate) {
        notifyHoverEnd();
      }
    },
    [deactivateHover, notifyHoverEnd, onPointerLeave]
  );

  const handleFocusCapture = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      onFocusCapture?.(event);
      if (event.defaultPrevented) return;
      focusWithinRef.current = true;
      activateHover();
      notifyHoverStart();
    },
    [activateHover, notifyHoverStart, onFocusCapture]
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
      const canDeactivate = !pointerInsideRef.current;
      deactivateHover(canDeactivate);
      if (canDeactivate) {
        notifyHoverEnd();
      }
    },
    [deactivateHover, notifyHoverEnd, onBlurCapture]
  );

  if (!motionEnabled) {
    return {
      onBlurCapture,
      onFocusCapture,
      onHoverEnd,
      onHoverStart,
      onPointerEnter,
      onPointerLeave,
    };
  }

  const pointerFocusHandlers = {
    onBlurCapture: handleBlurCapture,
    onFocusCapture: handleFocusCapture,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
  };

  if (!includeMotionHoverEvents) {
    return pointerFocusHandlers;
  }

  return {
    ...pointerFocusHandlers,
    onHoverEnd: handleHoverEnd,
    onHoverStart: handleHoverStart,
  };
}

const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      asChild = false,
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
    const reduceMotion = useReducedMotion();
    const useSpringHover = interactive && !reduceMotion && !asChild;
    const useCssHoverMotion = interactive && asChild && !reduceMotion;
    const animateLayout = !(reduceMotion || useSpringHover);
    const surfaceClassName = getCardSurfaceClassName({
      className,
      interactive,
      useCssHoverMotion,
    });
    const { hoverStyle, shadowOpacity, setHover } =
      useCardHoverMotion(useSpringHover);

    const interactiveHandlers = useCardInteractiveHandlers({
      activateHover: () => {
        setHover(true);
      },
      deactivateHover: (canDeactivate) => {
        if (canDeactivate) {
          setHover(false);
        }
      },
      includeMotionHoverEvents: !asChild,
      motionEnabled: interactive,
      onBlurCapture,
      onFocusCapture,
      onHoverEnd,
      onHoverStart,
      onPointerEnter,
      onPointerLeave,
    });

    if (asChild) {
      return (
        <Slot
          {...props}
          {...interactiveHandlers}
          className={surfaceClassName}
          data-interactive={interactive ? "true" : undefined}
          data-slot="card"
          ref={ref}
          style={styleProp}
        >
          {children}
        </Slot>
      );
    }

    return (
      <MotionDiv
        {...props}
        {...interactiveHandlers}
        className={surfaceClassName}
        data-interactive={interactive ? "true" : undefined}
        data-slot="card"
        initial={false}
        layout={animateLayout ? "position" : undefined}
        ref={(node) => {
          assignRef(ref, node);
        }}
        style={useSpringHover ? { ...styleProp, ...hoverStyle } : styleProp}
        transition={cardLayoutTransition}
      >
        {useSpringHover ? (
          <motion.div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 z-0",
              cardCornerInheritClassName
            )}
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

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  function CardImage(
    { className, inset = true, alt, fill, width, height, sizes, ...props },
    ref
  ) {
    const useFill = fill ?? (width === undefined && height === undefined);
    const imageClassName = cn(
      "rounded-none object-cover",
      useFill ? "size-full" : "block w-full",
      className
    );

    const image = (
      <Image
        alt={alt}
        className={imageClassName}
        fill={useFill || undefined}
        height={useFill ? undefined : height}
        ref={ref}
        sizes={sizes ?? "(max-width: 768px) 100vw, 400px"}
        width={useFill ? undefined : width}
        {...props}
      />
    );

    if (!inset) {
      return (
        <div
          className={cn("relative w-full", useFill && "aspect-[16/10]")}
          data-slot="card-image"
        >
          {image}
        </div>
      );
    }

    return (
      <div
        className="p-[var(--card-media-padding)] pb-0"
        data-slot="card-image"
      >
        <div
          className={cn(
            cardImageFrameClassName,
            useFill && "relative aspect-[16/10] w-full"
          )}
          data-slot="card-image-frame"
        >
          {image}
        </div>
      </div>
    );
  }
);

CardImage.displayName = "CardImage";

function CardMedia({
  className,
  inset = true,
  children,
  ...props
}: CardMediaProps) {
  const sectionMotionProps = useCardSectionMotionProps();

  if (!inset) {
    return (
      <MotionDiv
        className={cn(
          "w-full shrink-0 overflow-hidden",
          cardImageMediaClassName,
          className
        )}
        data-slot="card-image"
        {...sectionMotionProps}
        {...props}
      >
        {children}
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      className={cn(
        "w-full shrink-0 p-[var(--card-media-padding)] pb-0",
        className
      )}
      data-slot="card-image"
      {...sectionMotionProps}
      {...props}
    >
      <div
        className={cn(cardImageFrameClassName, cardImageMediaClassName)}
        data-slot="card-image-frame"
      >
        {children}
      </div>
    </MotionDiv>
  );
}

function CardHeader({ className, ...props }: CardSectionProps) {
  const sectionMotionProps = useCardSectionMotionProps();

  return (
    <MotionDiv
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className
      )}
      data-slot="card-header"
      {...sectionMotionProps}
      {...props}
    />
  );
}

function CardTitle({ as = "h3", className, ...props }: CardTitleProps) {
  const sectionMotionProps = useCardSectionMotionProps();
  const MotionTitle = motionTitleElements[as];

  return (
    <MotionTitle
      className={cn(
        "cn-font-heading font-medium text-base leading-snug tracking-[-0.01em]",
        className
      )}
      data-slot="card-title"
      {...sectionMotionProps}
      {...props}
    />
  );
}

function CardDescription({
  as = "p",
  className,
  ...props
}: CardDescriptionProps) {
  const sectionMotionProps = useCardSectionMotionProps();
  const MotionDescription = motionDescriptionElements[as];

  return (
    <MotionDescription
      className={cn("text-muted-foreground text-sm leading-6", className)}
      data-slot="card-description"
      {...sectionMotionProps}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: CardSectionProps) {
  const sectionMotionProps = useCardSectionMotionProps();

  return (
    <MotionDiv
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      data-slot="card-action"
      {...sectionMotionProps}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: CardSectionProps) {
  const sectionMotionProps = useCardSectionMotionProps();

  return (
    <MotionDiv
      className={cn("px-4", className)}
      data-slot="card-content"
      {...sectionMotionProps}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: CardSectionProps) {
  const sectionMotionProps = useCardSectionMotionProps();

  return (
    <MotionDiv
      className={cn(
        "flex items-center rounded-b-[inherit] border-border/60 border-t bg-muted/45 p-4 text-muted-foreground backdrop-blur-[1px] transition-colors duration-300 supports-[corner-shape:squircle]:[corner-shape:inherit]",
        className
      )}
      data-slot="card-footer"
      {...sectionMotionProps}
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
  CardImage,
  CardMedia,
};
export type {
  CardDescriptionProps,
  CardImageProps,
  CardMediaProps,
  CardProps,
  CardSectionProps,
  CardTitleProps,
};
