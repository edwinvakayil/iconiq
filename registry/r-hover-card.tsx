"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const hoverCardThemeClassName =
  "[--hc-surface:#ffffff] [--hc-foreground:#111111] [--hc-border:#e3e7ec] [--hc-ring:rgba(17,17,17,0.16)] dark:[--hc-surface:#111111] dark:[--hc-foreground:#f6f3ec] dark:[--hc-border:#2b2a25] dark:[--hc-ring:rgba(246,243,236,0.18)]";

const hoverCardPanelClassName =
  "relative z-50 w-72 transform-gpu rounded-lg border border-[color:var(--hc-border)] bg-[color:var(--hc-surface)] p-4 text-[color:var(--hc-foreground)] shadow-none outline-none";

const hoverCardTriggerClassName =
  "inline-flex min-h-9 cursor-pointer items-center rounded-md px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--hc-ring),transparent_40%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--hc-surface)]";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type CollisionPadding = React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Content
>["collisionPadding"];

type HoverCardContextValue = {
  open: boolean;
  contentId: string;
  triggerId: string;
  setContentNode: (node: HTMLDivElement | null) => void;
  setTriggerNode: (node: HTMLElement | null) => void;
  handleFocusEnd: (event: React.FocusEvent<HTMLElement>) => void;
  handleFocusStart: () => void;
  handleHoverEnd: (event: React.PointerEvent<HTMLElement>) => void;
  handleHoverStart: (event: React.PointerEvent<HTMLElement>) => void;
};

const HoverCardContext = React.createContext<HoverCardContextValue | null>(
  null
);

const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const HOVER_CARD_EXIT_EASE = [0.4, 0, 0.6, 1] as const;

const HOVER_CARD_SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 30,
  mass: 0.72,
};

function getSideMotionOffset(side: Side) {
  switch (side) {
    case "top":
      return { x: 0, y: 4 };
    case "right":
      return { x: -4, y: 0 };
    case "left":
      return { x: 4, y: 0 };
    default:
      return { x: 0, y: -4 };
  }
}

function getHoverCardMotion(side: Side) {
  const offset = getSideMotionOffset(side);

  return {
    animate: { opacity: 1, scale: 1, x: 0, y: 0 },
    closed: { opacity: 0, scale: 0.988, ...offset },
    initial: { opacity: 0, scale: 0.988, ...offset },
    openTransition: {
      opacity: { duration: 0.26, ease: FLUID_EASE },
      scale: HOVER_CARD_SPRING,
      x: HOVER_CARD_SPRING,
      y: HOVER_CARD_SPRING,
    },
    closedTransition: {
      opacity: { duration: 0.16, ease: HOVER_CARD_EXIT_EASE },
      scale: { duration: 0.16, ease: HOVER_CARD_EXIT_EASE },
      x: { duration: 0.16, ease: HOVER_CARD_EXIT_EASE },
      y: { duration: 0.16, ease: HOVER_CARD_EXIT_EASE },
    },
  };
}

const hoverBridgeStyles: Record<Side, string> = {
  top: "before:pointer-events-auto before:absolute before:right-0 before:bottom-[calc(var(--hover-card-bridge-size)*-1)] before:left-0 before:h-[var(--hover-card-bridge-size)] before:bg-transparent before:content-['']",
  right:
    "before:pointer-events-auto before:absolute before:top-0 before:bottom-0 before:left-[calc(var(--hover-card-bridge-size)*-1)] before:w-[var(--hover-card-bridge-size)] before:bg-transparent before:content-['']",
  bottom:
    "before:pointer-events-auto before:absolute before:top-[calc(var(--hover-card-bridge-size)*-1)] before:right-0 before:left-0 before:h-[var(--hover-card-bridge-size)] before:bg-transparent before:content-['']",
  left: "before:pointer-events-auto before:absolute before:top-0 before:right-[calc(var(--hover-card-bridge-size)*-1)] before:bottom-0 before:w-[var(--hover-card-bridge-size)] before:bg-transparent before:content-['']",
};

const assignRef = <T,>(ref: React.ForwardedRef<T>, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
};

const useHoverCard = () => {
  const context = React.useContext(HoverCardContext);

  if (!context) {
    throw new Error("HoverCard components must be used inside HoverCard");
  }

  return context;
};

type HoverCardProps = {
  className?: string;
  openDelay?: number;
  closeDelay?: number;
  children?: React.ReactNode;
};

const HoverCard = ({
  className,
  openDelay = 80,
  closeDelay = 120,
  children,
}: HoverCardProps) => {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const reactId = React.useId();

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const containsInteractiveNode = React.useCallback((node: Node | null) => {
    return Boolean(
      node &&
        (triggerRef.current?.contains(node) ||
          contentRef.current?.contains(node))
    );
  }, []);

  const hasFocusWithin = React.useCallback(() => {
    const activeElement = document.activeElement;
    return (
      activeElement instanceof Node && containsInteractiveNode(activeElement)
    );
  }, [containsInteractiveNode]);

  const scheduleOpen = React.useCallback(() => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => setOpen(true), openDelay);
  }, [clearTimer, openDelay]);

  const scheduleClose = React.useCallback(() => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => setOpen(false), closeDelay);
  }, [clearTimer, closeDelay]);

  const handleHoverStart = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;

      if (open) {
        clearTimer();
        return;
      }

      scheduleOpen();
    },
    [clearTimer, open, scheduleOpen]
  );

  const handleHoverEnd = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;

      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && containsInteractiveNode(nextTarget)) {
        return;
      }

      if (hasFocusWithin()) return;

      scheduleClose();
    },
    [containsInteractiveNode, hasFocusWithin, scheduleClose]
  );

  const handleFocusStart = React.useCallback(() => {
    clearTimer();
    setOpen(true);
  }, [clearTimer]);

  const handleFocusEnd = React.useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && containsInteractiveNode(nextTarget)) {
        return;
      }

      clearTimer();
      setOpen(false);
    },
    [clearTimer, containsInteractiveNode]
  );

  React.useEffect(() => clearTimer, [clearTimer]);

  return (
    <HoverCardContext.Provider
      value={{
        open,
        contentId: `${reactId}-content`,
        triggerId: `${reactId}-trigger`,
        setContentNode: (node) => {
          contentRef.current = node;
        },
        setTriggerNode: (node) => {
          triggerRef.current = node;
        },
        handleFocusEnd,
        handleFocusStart,
        handleHoverEnd,
        handleHoverStart,
      }}
    >
      <HoverCardPrimitive.Root
        onOpenChange={(nextOpen) => {
          clearTimer();
          setOpen(nextOpen);
        }}
        open={open}
      >
        <span
          className={cn(
            hoverCardThemeClassName,
            "inline-flex w-fit",
            className
          )}
        >
          {children}
        </span>
      </HoverCardPrimitive.Root>
    </HoverCardContext.Provider>
  );
};

type HoverCardTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

const HoverCardTrigger = React.forwardRef<
  HTMLButtonElement,
  HoverCardTriggerProps
>(
  (
    {
      asChild,
      className,
      onBlur,
      onFocus,
      onPointerEnter,
      onPointerLeave,
      type,
      ...props
    },
    ref
  ) => {
    const {
      open,
      contentId,
      triggerId,
      setTriggerNode,
      handleFocusEnd,
      handleFocusStart,
      handleHoverEnd,
      handleHoverStart,
    } = useHoverCard();
    const Comp = asChild ? Slot : "button";

    return (
      <HoverCardPrimitive.Trigger asChild>
        <Comp
          aria-controls={contentId}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            asChild
              ? "inline-flex cursor-pointer items-center focus-visible:outline-none"
              : hoverCardTriggerClassName,
            className
          )}
          data-state={open ? "open" : "closed"}
          id={triggerId}
          onBlur={(event) => {
            onBlur?.(event);

            if (event.defaultPrevented) {
              return;
            }

            handleFocusEnd(event);
          }}
          onFocus={(event) => {
            onFocus?.(event);

            if (event.defaultPrevented) {
              return;
            }

            handleFocusStart();
          }}
          onPointerEnter={(event) => {
            onPointerEnter?.(event);

            if (event.defaultPrevented) {
              return;
            }

            handleHoverStart(event);
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);

            if (event.defaultPrevented) {
              return;
            }

            handleHoverEnd(event);
          }}
          ref={(node: HTMLButtonElement | null) => {
            setTriggerNode(node);
            assignRef(ref, node);
          }}
          type={asChild ? undefined : (type ?? "button")}
          {...props}
        />
      </HoverCardPrimitive.Trigger>
    );
  }
);
HoverCardTrigger.displayName = "HoverCardTrigger";

type HoverCardContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.div>,
  "initial" | "animate" | "exit" | "transition"
> & {
  align?: Align;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: CollisionPadding;
  side?: Side;
  sideOffset?: number;
};

const HoverCardContentBody = React.forwardRef<
  HTMLDivElement,
  HoverCardContentProps
>(
  (
    {
      className,
      children,
      style,
      onBlur,
      onFocus,
      onPointerEnter,
      onPointerLeave,
      align = "center",
      alignOffset = 0,
      avoidCollisions = true,
      collisionPadding = 12,
      side = "bottom",
      sideOffset = 12,
      ...props
    },
    ref
  ) => {
    const {
      contentId,
      triggerId,
      setContentNode,
      handleFocusEnd,
      handleFocusStart,
      handleHoverEnd,
      handleHoverStart,
    } = useHoverCard();
    const cardMotion = getHoverCardMotion(side);
    const panelVariants = {
      closed: {
        ...cardMotion.closed,
        transition: cardMotion.closedTransition,
      },
      open: {
        ...cardMotion.animate,
        transition: cardMotion.openTransition,
      },
    };

    return (
      <HoverCardPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        asChild
        avoidCollisions={avoidCollisions}
        collisionPadding={collisionPadding}
        side={side}
        sideOffset={sideOffset}
      >
        <div
          style={
            {
              "--hover-card-bridge-size": `${sideOffset}px`,
              ...style,
            } as React.CSSProperties
          }
        >
          <motion.div
            {...props}
            animate="open"
            aria-labelledby={triggerId}
            className={cn(
              hoverCardThemeClassName,
              hoverCardPanelClassName,
              hoverBridgeStyles[side],
              "transform-gpu",
              className
            )}
            data-state="open"
            exit="closed"
            id={contentId}
            initial="closed"
            onBlur={(event) => {
              onBlur?.(event);

              if (event.defaultPrevented) {
                return;
              }

              handleFocusEnd(event);
            }}
            onFocus={(event) => {
              onFocus?.(event);

              if (event.defaultPrevented) {
                return;
              }

              handleFocusStart();
            }}
            onPointerEnter={(event) => {
              onPointerEnter?.(event);

              if (event.defaultPrevented) {
                return;
              }

              handleHoverStart(event);
            }}
            onPointerLeave={(event) => {
              onPointerLeave?.(event);

              if (event.defaultPrevented) {
                return;
              }

              handleHoverEnd(event);
            }}
            ref={(node: HTMLDivElement | null) => {
              setContentNode(node);
              assignRef(ref, node);
            }}
            style={{
              transformOrigin:
                "var(--radix-hover-card-content-transform-origin)",
            }}
            variants={panelVariants}
          >
            {children}
          </motion.div>
        </div>
      </HoverCardPrimitive.Content>
    );
  }
);
HoverCardContentBody.displayName = "HoverCardContentBody";

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  HoverCardContentProps
>((props, ref) => {
  const { open } = useHoverCard();

  return (
    <AnimatePresence>
      {open ? (
        <HoverCardPrimitive.Portal forceMount>
          <HoverCardContentBody ref={ref} {...props} />
        </HoverCardPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
