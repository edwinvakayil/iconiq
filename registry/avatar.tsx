"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

type AvatarSize = "default" | "sm" | "lg";
type TooltipSide = "top" | "bottom" | "left" | "right";
type AvatarBadgeVariant = "online" | "offline" | "busy" | "away";

type TooltipTriggerProps = React.HTMLAttributes<HTMLElement> & {
  "aria-describedby"?: string;
  ref?: React.Ref<HTMLElement>;
};
type TooltipTriggerElement = React.ReactElement<TooltipTriggerProps>;

export interface AvatarBadgeProps extends React.ComponentProps<"span"> {
  tooltip?: string;
  tooltipSide?: TooltipSide;
  tooltipDelay?: number;
  tooltipClassName?: string;
  variant?: AvatarBadgeVariant;
}

export interface AvatarProps extends AvatarPrimitive.Root.Props {
  size?: AvatarSize;
  name?: string;
  asChild?: boolean;
  tooltip?: string;
  tooltipSide?: TooltipSide;
  tooltipDelay?: number;
  tooltipClassName?: string;
}

function hasFallbackChildren(children: React.ReactNode) {
  if (children === undefined || children === null || children === false) {
    return false;
  }

  if (typeof children === "string") {
    return children.trim().length > 0;
  }

  if (Array.isArray(children)) {
    return children.some(hasFallbackChildren);
  }

  return true;
}

const MAX_TOOLTIP_CHARACTERS = 80;
const TOOLTIP_COLLISION_PADDING = 12;
const TOOLTIP_OFFSET = 10;
const DEFAULT_TOOLTIP_SIDE_ORDER: TooltipSide[] = [
  "right",
  "left",
  "top",
  "bottom",
];

const WHITESPACE_REGEX = /\s+/g;
const FALLBACK_SPLIT_REGEX = /[\s_-]+/;
const NON_ALPHANUMERIC_REGEX = /[^\p{L}\p{N}]+/gu;

const AVATAR_IMAGE_SIZE: Record<AvatarSize, number> = {
  sm: 24,
  default: 32,
  lg: 40,
};

const BADGE_VARIANT_CLASSNAME: Record<AvatarBadgeVariant, string> = {
  online: "bg-emerald-500",
  offline: "bg-muted-foreground",
  busy: "bg-destructive",
  away: "bg-amber-500",
};

const BADGE_VARIANT_LABEL: Record<AvatarBadgeVariant, string> = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
  away: "Away",
};

type TooltipPlacement = {
  left: number;
  side: TooltipSide;
  top: number;
  transformOrigin: string;
};

type AvatarContextValue = {
  name?: string;
  size: AvatarSize;
};

const AvatarContext = React.createContext<AvatarContextValue>({
  size: "default",
});

function useAvatarContext() {
  return React.useContext(AvatarContext);
}

function normalizeText(value?: string) {
  return value?.trim().replace(WHITESPACE_REGEX, " ") ?? "";
}

function firstCharacter(value: string) {
  return Array.from(value)[0] ?? "";
}

function getAvatarInitials(fallback?: string, name?: string, alt?: string) {
  const normalized = [fallback, name, alt].map(normalizeText).find(Boolean);

  if (!normalized) {
    return "?";
  }

  const words = normalized
    .split(FALLBACK_SPLIT_REGEX)
    .map((word) => word.replace(NON_ALPHANUMERIC_REGEX, ""))
    .filter(Boolean);

  if (words.length >= 2) {
    return `${firstCharacter(words[0])}${firstCharacter(words[1])}`.toUpperCase();
  }

  const compact = Array.from(
    words[0] ?? normalized.replace(WHITESPACE_REGEX, "")
  )
    .slice(0, 2)
    .join("");

  return compact.toUpperCase() || "?";
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}

function isTooltipTriggerElement(
  node: React.ReactNode
): node is TooltipTriggerElement {
  return React.isValidElement(node) && node.type !== React.Fragment;
}

function mergeDescribedBy(...ids: Array<string | undefined>) {
  const merged = ids.filter(Boolean).join(" ");

  return merged.length > 0 ? merged : undefined;
}

function composeEventHandlers(
  childHandler: React.EventHandler<React.SyntheticEvent> | undefined,
  ownHandler: React.EventHandler<React.SyntheticEvent>
) {
  return (event: React.SyntheticEvent) => {
    childHandler?.(event);

    if (!event.defaultPrevented) {
      ownHandler(event);
    }
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function getTooltipSideOrder(preferredSide?: TooltipSide) {
  if (!preferredSide || preferredSide === "right") {
    return DEFAULT_TOOLTIP_SIDE_ORDER;
  }

  return [
    preferredSide,
    ...DEFAULT_TOOLTIP_SIDE_ORDER.filter((side) => side !== preferredSide),
  ];
}

function getTooltipTransformOrigin(side: TooltipSide) {
  switch (side) {
    case "left":
      return "right center";
    case "top":
      return "center bottom";
    case "bottom":
      return "center top";
    default:
      return "left center";
  }
}

function hasPrimaryAxisSpace(
  side: TooltipSide,
  triggerRect: DOMRect,
  tooltipRect: DOMRect
) {
  switch (side) {
    case "left":
      return (
        triggerRect.left - TOOLTIP_OFFSET - tooltipRect.width >=
        TOOLTIP_COLLISION_PADDING
      );
    case "top":
      return (
        triggerRect.top - TOOLTIP_OFFSET - tooltipRect.height >=
        TOOLTIP_COLLISION_PADDING
      );
    case "bottom":
      return (
        triggerRect.bottom + TOOLTIP_OFFSET + tooltipRect.height <=
        window.innerHeight - TOOLTIP_COLLISION_PADDING
      );
    default:
      return (
        triggerRect.right + TOOLTIP_OFFSET + tooltipRect.width <=
        window.innerWidth - TOOLTIP_COLLISION_PADDING
      );
  }
}

function getTooltipCandidate(
  side: TooltipSide,
  triggerRect: DOMRect,
  tooltipRect: DOMRect
): TooltipPlacement {
  const maxLeft =
    window.innerWidth - TOOLTIP_COLLISION_PADDING - tooltipRect.width;
  const maxTop =
    window.innerHeight - TOOLTIP_COLLISION_PADDING - tooltipRect.height;
  const centeredLeft =
    triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
  const centeredTop =
    triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;

  switch (side) {
    case "left":
      return {
        left: clamp(
          triggerRect.left - TOOLTIP_OFFSET - tooltipRect.width,
          TOOLTIP_COLLISION_PADDING,
          maxLeft
        ),
        side,
        top: clamp(centeredTop, TOOLTIP_COLLISION_PADDING, maxTop),
        transformOrigin: getTooltipTransformOrigin(side),
      };
    case "top":
      return {
        left: clamp(centeredLeft, TOOLTIP_COLLISION_PADDING, maxLeft),
        side,
        top: clamp(
          triggerRect.top - TOOLTIP_OFFSET - tooltipRect.height,
          TOOLTIP_COLLISION_PADDING,
          maxTop
        ),
        transformOrigin: getTooltipTransformOrigin(side),
      };
    case "bottom":
      return {
        left: clamp(centeredLeft, TOOLTIP_COLLISION_PADDING, maxLeft),
        side,
        top: clamp(
          triggerRect.bottom + TOOLTIP_OFFSET,
          TOOLTIP_COLLISION_PADDING,
          maxTop
        ),
        transformOrigin: getTooltipTransformOrigin(side),
      };
    default:
      return {
        left: clamp(
          triggerRect.right + TOOLTIP_OFFSET,
          TOOLTIP_COLLISION_PADDING,
          maxLeft
        ),
        side,
        top: clamp(centeredTop, TOOLTIP_COLLISION_PADDING, maxTop),
        transformOrigin: getTooltipTransformOrigin(side),
      };
  }
}

function getTooltipPlacement(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  preferredSide?: TooltipSide
) {
  const sideOrder = getTooltipSideOrder(preferredSide);
  const resolvedSide =
    sideOrder.find((side) =>
      hasPrimaryAxisSpace(side, triggerRect, tooltipRect)
    ) ??
    sideOrder.at(-1) ??
    "bottom";

  return getTooltipCandidate(resolvedSide, triggerRect, tooltipRect);
}

const tooltipBubbleClassName =
  "group/tooltip pointer-events-none fixed z-50 max-w-60 whitespace-normal rounded-lg bg-foreground px-3 py-1.5 font-medium text-background text-xs leading-snug shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]";

const tooltipArrowClassName =
  "absolute h-2 w-2 rotate-45 bg-foreground group-data-[side=bottom]/tooltip:-top-1 group-data-[side=left]/tooltip:top-1/2 group-data-[side=right]/tooltip:top-1/2 group-data-[side=left]/tooltip:-right-1 group-data-[side=top]/tooltip:-bottom-1 group-data-[side=bottom]/tooltip:left-1/2 group-data-[side=right]/tooltip:-left-1 group-data-[side=top]/tooltip:left-1/2 group-data-[side=bottom]/tooltip:-translate-x-1/2 group-data-[side=top]/tooltip:-translate-x-1/2 group-data-[side=left]/tooltip:-translate-y-1/2 group-data-[side=right]/tooltip:-translate-y-1/2";

function getTooltipMotionConfig(reduceMotion: boolean | null) {
  const motionTransition = reduceMotion
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: 400,
        damping: 24,
        mass: 0.6,
      };

  const arrowTransition = reduceMotion
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: 500,
        damping: 28,
        delay: 0.03,
      };

  const visibleState = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, filter: "blur(0px)" };

  const hiddenState = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.92, filter: "blur(4px)" };

  return {
    arrowTransition,
    hiddenState,
    motionTransition,
    reduceMotion: Boolean(reduceMotion),
    visibleState,
  };
}

function useAvatarTooltip({
  content,
  delay,
  side,
}: {
  content: string;
  delay: number;
  side: TooltipSide;
}) {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<TooltipPlacement | null>(
    null
  );
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipId = React.useId();
  const normalizedContent = content.trim();

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      (normalizedContent.length > MAX_TOOLTIP_CHARACTERS ||
        normalizedContent.includes("\n"))
    ) {
      console.warn(
        "Avatar tooltip content should stay short, single-line, and non-interactive. Use Tooltip directly for richer content."
      );
    }
  }, [normalizedContent]);

  const updatePlacement = React.useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;

    if (!(trigger && tooltip)) {
      return;
    }

    setPlacement(
      getTooltipPlacement(
        trigger.getBoundingClientRect(),
        tooltip.getBoundingClientRect(),
        side
      )
    );
  }, [side]);

  const handleEnter = React.useCallback(
    (event: React.SyntheticEvent) => {
      triggerRef.current = event.currentTarget as HTMLElement;
      setPlacement(null);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setOpen(true), delay * 1000);
    },
    [delay]
  );

  const handleLeave = React.useCallback(() => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  }, []);

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleLeave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleLeave, open]);

  React.useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updatePlacement();
    const frameId = window.requestAnimationFrame(updatePlacement);

    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [open, updatePlacement]);

  return {
    handleEnter,
    handleLeave,
    normalizedContent,
    open,
    placement,
    tooltipId,
    tooltipRef,
    triggerRef,
  };
}

function attachTooltipTrigger(
  children: TooltipTriggerElement,
  {
    handleEnter,
    handleLeave,
    open,
    tooltipId,
    triggerRef,
  }: {
    handleEnter: (event: React.SyntheticEvent) => void;
    handleLeave: () => void;
    open: boolean;
    tooltipId: string;
    triggerRef: React.MutableRefObject<HTMLElement | null>;
  }
) {
  const childProps = children.props;
  const childAriaDescribedBy = childProps["aria-describedby"];
  const triggerDescription = open
    ? mergeDescribedBy(childAriaDescribedBy, tooltipId)
    : childAriaDescribedBy;

  return React.cloneElement(children, {
    "aria-describedby": triggerDescription,
    onBlur: composeEventHandlers(childProps.onBlur, handleLeave),
    onFocus: composeEventHandlers(childProps.onFocus, handleEnter),
    onMouseEnter: composeEventHandlers(childProps.onMouseEnter, handleEnter),
    onMouseLeave: composeEventHandlers(childProps.onMouseLeave, handleLeave),
    onPointerEnter: composeEventHandlers(
      childProps.onPointerEnter,
      handleEnter
    ),
    onPointerLeave: composeEventHandlers(
      childProps.onPointerLeave,
      handleLeave
    ),
    ref: mergeRefs(childProps.ref, (node: HTMLElement | null) => {
      triggerRef.current = node;
    }),
  });
}

function AvatarTooltipBubble({
  className,
  content,
  motionConfig,
  open,
  placement,
  side,
  tooltipId,
  tooltipRef,
}: {
  className?: string;
  content: string;
  motionConfig: ReturnType<typeof getTooltipMotionConfig>;
  open: boolean;
  placement: TooltipPlacement | null;
  side: TooltipSide;
  tooltipId: string;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (typeof document === "undefined") {
    return null;
  }

  const reduceMotion = motionConfig.reduceMotion;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={motionConfig.visibleState}
          className={cn(
            componentThemeClassName,
            tooltipBubbleClassName,
            className
          )}
          data-side={placement?.side ?? side}
          exit={motionConfig.hiddenState}
          id={tooltipId}
          initial={motionConfig.hiddenState}
          ref={tooltipRef}
          role="tooltip"
          style={{
            left: placement?.left ?? 0,
            top: placement?.top ?? 0,
            transformOrigin:
              placement?.transformOrigin ?? getTooltipTransformOrigin(side),
            visibility: placement ? undefined : "hidden",
          }}
          transition={motionConfig.motionTransition}
        >
          <motion.span
            animate={reduceMotion ? undefined : { scale: 1 }}
            className={tooltipArrowClassName}
            exit={reduceMotion ? undefined : { scale: 0.95, opacity: 0 }}
            initial={reduceMotion ? undefined : { scale: 0.95, opacity: 0 }}
            transition={motionConfig.arrowTransition}
          />
          {content}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

function AvatarTooltipImpl({
  children,
  className,
  content,
  delay = 0.15,
  side = "right",
}: {
  children: TooltipTriggerElement;
  className?: string;
  content: string;
  delay?: number;
  side?: TooltipSide;
}) {
  const reduceMotion = useReducedMotion();
  const motionConfig = getTooltipMotionConfig(reduceMotion);
  const {
    handleEnter,
    handleLeave,
    normalizedContent,
    open,
    placement,
    tooltipId,
    tooltipRef,
    triggerRef,
  } = useAvatarTooltip({ content, delay, side });

  if (normalizedContent.length === 0) {
    return children;
  }

  return (
    <>
      {attachTooltipTrigger(children, {
        handleEnter,
        handleLeave,
        open,
        tooltipId,
        triggerRef,
      })}
      <AvatarTooltipBubble
        className={className}
        content={normalizedContent}
        motionConfig={motionConfig}
        open={open}
        placement={placement}
        side={side}
        tooltipId={tooltipId}
        tooltipRef={tooltipRef}
      />
    </>
  );
}

function AvatarTooltip({
  children,
  className,
  content,
  delay = 0.15,
  side = "right",
}: {
  children: React.ReactNode;
  className?: string;
  content: string;
  delay?: number;
  side?: TooltipSide;
}) {
  if (!isTooltipTriggerElement(children)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Avatar tooltip expects a single element child so it can forward hover, focus, and accessibility props."
      );
    }

    return children;
  }

  return (
    <AvatarTooltipImpl
      className={className}
      content={content}
      delay={delay}
      side={side}
    >
      {children}
    </AvatarTooltipImpl>
  );
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      "aria-label": ariaLabel,
      asChild = false,
      className,
      name,
      render,
      size = "default",
      tabIndex,
      tooltip,
      tooltipClassName,
      tooltipDelay,
      tooltipSide,
      ...props
    },
    ref
  ) => {
    const normalizedTooltip = tooltip?.trim() ?? "";
    const accessibleLabel = ariaLabel ?? (normalizedTooltip || undefined);
    const avatarRoot = (
      <AvatarPrimitive.Root
        {...props}
        aria-label={accessibleLabel}
        className={cn(
          "group/avatar relative flex size-8 shrink-0 select-none rounded-full after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
          className
        )}
        data-size={size}
        data-slot="avatar"
        ref={ref}
        render={render ?? (asChild ? <Slot /> : undefined)}
        tabIndex={tabIndex ?? (normalizedTooltip ? 0 : undefined)}
      />
    );

    return (
      <AvatarContext.Provider value={{ name, size }}>
        {normalizedTooltip ? (
          <AvatarTooltip
            className={tooltipClassName}
            content={normalizedTooltip}
            delay={tooltipDelay}
            side={tooltipSide}
          >
            {avatarRoot}
          </AvatarTooltip>
        ) : (
          avatarRoot
        )}
      </AvatarContext.Provider>
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  AvatarPrimitive.Image.Props
>(({ className, height, width, ...props }, ref) => {
  const { size } = useAvatarContext();
  const dimension = AVATAR_IMAGE_SIZE[size];

  return (
    <AvatarPrimitive.Image
      className={cn(
        "aspect-square size-full overflow-hidden rounded-full object-cover",
        className
      )}
      data-slot="avatar-image"
      height={height ?? dimension}
      ref={ref}
      width={width ?? dimension}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  AvatarPrimitive.Fallback.Props
>(({ children, className, ...props }, ref) => {
  const { name } = useAvatarContext();
  const fallbackContent = hasFallbackChildren(children)
    ? children
    : getAvatarInitials(undefined, name);

  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground text-sm group-data-[size=lg]/avatar:text-base group-data-[size=sm]/avatar:text-xs",
        className
      )}
      data-slot="avatar-fallback"
      ref={ref}
      {...props}
    >
      {fallbackContent}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = "AvatarFallback";

const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  (
    {
      "aria-label": ariaLabel,
      className,
      tabIndex,
      tooltip,
      tooltipClassName,
      tooltipDelay,
      tooltipSide,
      variant = "online",
      ...props
    },
    ref
  ) => {
    const normalizedTooltip = tooltip?.trim() ?? "";
    const badgeLabel =
      ariaLabel ?? (normalizedTooltip || BADGE_VARIANT_LABEL[variant]);
    const badge = (
      <span
        aria-label={badgeLabel}
        className={cn(
          "absolute right-0 bottom-0 z-10 inline-flex size-2.5 shrink-0 select-none items-center justify-center rounded-full ring-2 ring-background group-data-[size=default]/avatar:size-2.5 group-data-[size=lg]/avatar:size-3 group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:[&>svg]:size-2",
          BADGE_VARIANT_CLASSNAME[variant],
          className
        )}
        data-slot="avatar-badge"
        role="img"
        tabIndex={tabIndex ?? (normalizedTooltip ? 0 : undefined)}
        {...props}
        ref={ref}
      />
    );

    if (!normalizedTooltip) {
      return badge;
    }

    return (
      <AvatarTooltip
        className={tooltipClassName}
        content={normalizedTooltip}
        delay={tooltipDelay}
        side={tooltipSide}
      >
        {badge}
      </AvatarTooltip>
    );
  }
);
AvatarBadge.displayName = "AvatarBadge";

const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:transition-[z-index] *:data-[slot=avatar-group-count]:hover:z-10 *:data-[slot=avatar]:hover:z-10 *:data-[slot=avatar-group-count]:focus-within:z-10 *:data-[slot=avatar]:focus-within:z-10",
        className
      )}
      data-slot="avatar-group"
      ref={ref}
      {...props}
    />
  );
});
AvatarGroup.displayName = "AvatarGroup";

const AvatarGroupCount = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=lg]/avatar-group:text-base group-has-data-[size=sm]/avatar-group:text-xs [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      data-slot="avatar-group-count"
      ref={ref}
      {...props}
    />
  );
});
AvatarGroupCount.displayName = "AvatarGroupCount";

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  getAvatarInitials,
  type AvatarBadgeVariant,
  type AvatarSize,
};
