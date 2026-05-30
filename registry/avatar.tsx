"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

type TooltipSide = "top" | "bottom" | "left" | "right";
type TooltipTriggerProps = React.HTMLAttributes<HTMLElement> & {
  "aria-describedby"?: string;
};
type TooltipTriggerElement = React.ReactElement<TooltipTriggerProps>;

interface AvatarBadgeProps
  extends React.ComponentProps<"span">,
    ReducedMotionProp {
  tooltip?: string;
  tooltipSide?: TooltipSide;
  tooltipDelay?: number;
  tooltipClassName?: string;
}

interface AvatarProps extends AvatarPrimitive.Root.Props, ReducedMotionProp {
  size?: "default" | "sm" | "lg";
  tooltip?: string;
  tooltipSide?: TooltipSide;
  tooltipDelay?: number;
  tooltipClassName?: string;
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

type TooltipPlacement = {
  left: number;
  side: TooltipSide;
  top: number;
  transformOrigin: string;
};

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

function AvatarTooltip({
  children,
  className,
  content,
  delay = 0.15,
  reducedMotion,
  side = "right",
}: {
  children: TooltipTriggerElement;
  className?: string;
  content: string;
  delay?: number;
  reducedMotion?: boolean;
  side?: TooltipSide;
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

  if (!isTooltipTriggerElement(children)) {
    throw new Error(
      "Avatar tooltip expects a single element child so it can forward hover, focus, and accessibility props."
    );
  }

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

  const childProps = children.props;
  const childAriaDescribedBy = childProps["aria-describedby"];
  const triggerDescription = open
    ? mergeDescribedBy(childAriaDescribedBy, tooltipId)
    : childAriaDescribedBy;

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

  const handleEnter = (event: React.SyntheticEvent) => {
    triggerRef.current = event.currentTarget as HTMLElement;
    setPlacement(null);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), delay * 1000);
  };

  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

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

  if (normalizedContent.length === 0) {
    return children;
  }

  const trigger = React.cloneElement(children, {
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
  });

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      {trigger}
      {typeof document === "undefined"
        ? null
        : createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  className={cn(
                    registryTheme,
                    "group/tooltip pointer-events-none fixed z-50 max-w-60 whitespace-normal rounded-lg bg-foreground px-3 py-1.5 font-medium text-background text-xs leading-snug shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]",
                    className
                  )}
                  data-side={placement?.side ?? side}
                  exit={{
                    opacity: 0,
                    scale: 0.92,
                    filter: "blur(4px)",
                  }}
                  id={tooltipId}
                  initial={{
                    opacity: 0,
                    scale: 0.92,
                    filter: "blur(4px)",
                  }}
                  ref={tooltipRef}
                  role="tooltip"
                  style={{
                    left: placement?.left ?? 0,
                    top: placement?.top ?? 0,
                    transformOrigin:
                      placement?.transformOrigin ??
                      getTooltipTransformOrigin(side),
                    visibility: placement ? undefined : "hidden",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 24,
                    mass: 0.6,
                  }}
                >
                  <motion.span
                    animate={{ scale: 1 }}
                    className="absolute h-2 w-2 rotate-45 bg-foreground group-data-[side=bottom]/tooltip:-top-1 group-data-[side=left]/tooltip:top-1/2 group-data-[side=right]/tooltip:top-1/2 group-data-[side=left]/tooltip:-right-1 group-data-[side=top]/tooltip:-bottom-1 group-data-[side=bottom]/tooltip:left-1/2 group-data-[side=right]/tooltip:-left-1 group-data-[side=top]/tooltip:left-1/2 group-data-[side=bottom]/tooltip:-translate-x-1/2 group-data-[side=top]/tooltip:-translate-x-1/2 group-data-[side=left]/tooltip:-translate-y-1/2 group-data-[side=right]/tooltip:-translate-y-1/2"
                    exit={{ scale: 0 }}
                    initial={{ scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 28,
                      delay: 0.03,
                    }}
                  />
                  {normalizedContent}
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )}
    </ReducedMotionConfig>
  );
}

function Avatar({
  className,
  reducedMotion,
  size = "default",
  tabIndex,
  tooltip,
  tooltipClassName,
  tooltipDelay,
  tooltipSide,
  ...props
}: AvatarProps) {
  const normalizedTooltip = tooltip?.trim() ?? "";
  const avatar = (
    <AvatarPrimitive.Root
      className={cn(
        "group/avatar relative flex size-8 shrink-0 select-none rounded-full after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className
      )}
      data-size={size}
      data-slot="avatar"
      tabIndex={tabIndex ?? (normalizedTooltip ? 0 : undefined)}
      {...props}
    />
  );

  if (!normalizedTooltip) {
    return avatar;
  }

  return (
    <AvatarTooltip
      className={tooltipClassName}
      content={normalizedTooltip}
      delay={tooltipDelay}
      reducedMotion={reducedMotion}
      side={tooltipSide}
    >
      {avatar}
    </AvatarTooltip>
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      data-slot="avatar-image"
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground text-sm group-data-[size=sm]/avatar:text-xs",
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

function AvatarBadge({
  "aria-label": ariaLabel,
  className,
  reducedMotion,
  role,
  tabIndex,
  tooltip,
  tooltipClassName,
  tooltipDelay,
  tooltipSide,
  ...props
}: AvatarBadgeProps) {
  const normalizedTooltip = tooltip?.trim() ?? "";
  const badgeLabel = ariaLabel ?? (normalizedTooltip || undefined);
  const badgeProps = {
    className: cn(
      "absolute right-0 bottom-0 inline-flex select-none items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-background",
      "before:absolute before:-inset-1 before:rounded-full before:content-['']",
      "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
      "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
      "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
      className
    ),
    "data-slot": "avatar-badge",
    tabIndex: tabIndex ?? (normalizedTooltip ? 0 : undefined),
    ...props,
  };
  const badge = badgeLabel ? (
    <span aria-label={badgeLabel} role="img" {...badgeProps} />
  ) : (
    <span role={role} {...badgeProps} />
  );

  if (!normalizedTooltip) {
    return badge;
  }

  return (
    <AvatarTooltip
      className={tooltipClassName}
      content={normalizedTooltip}
      delay={tooltipDelay}
      reducedMotion={reducedMotion}
      side={tooltipSide}
    >
      {badge}
    </AvatarTooltip>
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      data-slot="avatar-group"
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      data-slot="avatar-group-count"
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
