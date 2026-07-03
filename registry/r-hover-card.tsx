"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const surfaceCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[12px]";

const hoverCardThemeClassName =
  "[--hc-surface:#ffffff] [--hc-foreground:#111111] [--hc-border:#e3e7ec] [--hc-ring:rgba(17,17,17,0.16)] dark:[--hc-surface:#111111] dark:[--hc-foreground:#f6f3ec] dark:[--hc-border:#2b2a25] dark:[--hc-ring:rgba(246,243,236,0.18)]";

const hoverCardPanelClassName = cn(
  surfaceCornerClassName,
  "relative z-50 w-72 transform-gpu border border-[color:var(--hc-border)] bg-[color:var(--hc-surface)] p-4 text-[color:var(--hc-foreground)] shadow-none outline-none"
);

const hoverCardTriggerClassName = cn(
  controlCornerClassName,
  "inline-flex min-h-9 cursor-pointer items-center px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--hc-ring),transparent_40%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--hc-surface)]"
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const HoverCardContext = React.createContext<HoverCardContextValue | null>(
  null
);

// ---------------------------------------------------------------------------
// Motion config
// ---------------------------------------------------------------------------

const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const HOVER_CARD_EXIT_EASE = [0.4, 0, 0.6, 1] as const;

const HOVER_CARD_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 18,
  mass: 0.65,
};

function getSideMotionOffset(side: Side): { x: number; y: number } {
  switch (side) {
    case "top":
      return { x: 0, y: 6 };
    case "right":
      return { x: -6, y: 0 };
    case "left":
      return { x: 6, y: 0 };
    default:
      return { x: 0, y: -6 };
  }
}

// We pre-compute variants keyed by side at render time so Framer Motion can
// interpolate all values cleanly (no CSS-variable strings mixed with numbers).
function getHoverCardVariants(side: Side) {
  const offset = getSideMotionOffset(side);

  return {
    open: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        opacity: { duration: 0.32, ease: FLUID_EASE },
        scale: HOVER_CARD_SPRING,
        x: HOVER_CARD_SPRING,
        y: HOVER_CARD_SPRING,
        filter: { duration: 0.28, ease: [0, 0, 0.2, 1] as const },
      },
    },
    closed: {
      opacity: 0,
      scale: 0.95,
      x: offset.x,
      y: offset.y,
      filter: "blur(8px)",
      transition: {
        opacity: { duration: 0.18, ease: HOVER_CARD_EXIT_EASE },
        scale: { duration: 0.18, ease: HOVER_CARD_EXIT_EASE },
        x: { duration: 0.18, ease: HOVER_CARD_EXIT_EASE },
        y: { duration: 0.18, ease: HOVER_CARD_EXIT_EASE },
        filter: { duration: 0.18, ease: HOVER_CARD_EXIT_EASE },
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Hover bridge — positioned via group-data-[side=...] on the inner motion.div.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Ref utilities
// ---------------------------------------------------------------------------

const assignRef = <T,>(ref: React.ForwardedRef<T>, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
};

// ---------------------------------------------------------------------------
// useHoverCard hook
// ---------------------------------------------------------------------------

const useHoverCard = () => {
  const context = React.useContext(HoverCardContext);

  if (!context) {
    throw new Error("HoverCard components must be used inside <HoverCard>");
  }

  return context;
};

// ---------------------------------------------------------------------------
// HoverCard — root
// ---------------------------------------------------------------------------

type HoverCardProps = {
  className?: string;
  openDelay?: number;
  closeDelay?: number;
  children?: React.ReactNode;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
};

const HoverCard = ({
  className,
  openDelay = 80,
  closeDelay = 120,
  children,
  open: openProp,
  onOpenChange,
  defaultOpen = false,
}: HoverCardProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const timeoutRef = React.useRef<number | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const isHoveringRef = React.useRef(false);
  const reactId = React.useId();

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Clear any pending timer when the component unmounts.
  React.useEffect(() => clearTimer, [clearTimer]);

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
  }, [clearTimer, openDelay, setOpen]);

  const scheduleClose = React.useCallback(() => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => setOpen(false), closeDelay);
  }, [clearTimer, closeDelay, setOpen]);

  const handleHoverStart = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;
      isHoveringRef.current = true;

      if (open) {
        // Already open — cancel any scheduled close.
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

      // Cursor moved into the other interactive zone (trigger ↔ content).
      if (nextTarget instanceof Node && containsInteractiveNode(nextTarget)) {
        return;
      }

      isHoveringRef.current = false;

      // Keep open if focus is still inside.
      if (hasFocusWithin()) return;

      scheduleClose();
    },
    [containsInteractiveNode, hasFocusWithin, scheduleClose]
  );

  const handleFocusStart = React.useCallback(() => {
    clearTimer();
    setOpen(true);
  }, [clearTimer, setOpen]);

  const handleFocusEnd = React.useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget;

      // Focus moved to another interactive zone — keep open.
      if (nextTarget instanceof Node && containsInteractiveNode(nextTarget)) {
        return;
      }

      // Cursor is still hovering — keep open (e.g. user clicked static text).
      if (isHoveringRef.current) return;

      clearTimer();
      setOpen(false);
    },
    [clearTimer, containsInteractiveNode, setOpen]
  );

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
      {/*
        Radix HoverCard.Root is used solely to handle the Radix portal and
        positioning. We bypass its own open/close timing by wiring open/onOpenChange
        from our own state and calling clearTimer before forwarding the event.
      */}
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

// ---------------------------------------------------------------------------
// HoverCardTrigger
// ---------------------------------------------------------------------------

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
            if (event.defaultPrevented) return;
            handleFocusEnd(event);
          }}
          onFocus={(event) => {
            onFocus?.(event);
            if (event.defaultPrevented) return;
            handleFocusStart();
          }}
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            if (event.defaultPrevented) return;
            handleHoverStart(event);
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            if (event.defaultPrevented) return;
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

// ---------------------------------------------------------------------------
// HoverCardContent types
// ---------------------------------------------------------------------------

type HoverCardContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.div>,
  "initial" | "animate" | "exit" | "transition" | "variants"
> & {
  align?: Align;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: CollisionPadding;
  side?: Side;
  sideOffset?: number;
};

// ---------------------------------------------------------------------------
// HoverCardContentBody — rendered panel, mounted only while open or animating.
//
// ARCHITECTURE NOTE:
// Radix sets `data-side` on its Content element when collision-detection flips
// the placement. We pass `asChild` so the outer <div> receives that attribute.
// The `group` class on the same element lets child `group-data-[side=...]`
// selectors control the bridge position correctly on all sides.
// ---------------------------------------------------------------------------

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

    // Variants are computed from the prop `side`. Radix may flip the actual
    // placement, but the initial closed state still needs numeric offsets so
    // Framer Motion can interpolate cleanly. The bridge CSS is handled via the
    // group-data-[side=...] selectors which read Radix's data-side attribute.
    const variants = getHoverCardVariants(side);

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
        {/*
          Radix renders its positioning wrapper here and sets data-side on it.
          The `group` class exposes that attribute to group-data-[side=...]
          utility classes on the inner panel.
        */}
        <div
          className="group outline-none"
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
              // Bridge pseudo-element positions itself relative to whatever side
              // Radix resolved at runtime via group-data-[side=...] selectors.
              "before:pointer-events-auto before:absolute before:bg-transparent before:content-['']",
              "group-data-[side=top]:before:right-0 group-data-[side=top]:before:bottom-[calc(var(--hover-card-bridge-size)*-1)] group-data-[side=top]:before:left-0 group-data-[side=top]:before:h-[var(--hover-card-bridge-size)]",
              "group-data-[side=bottom]:before:top-[calc(var(--hover-card-bridge-size)*-1)] group-data-[side=bottom]:before:right-0 group-data-[side=bottom]:before:left-0 group-data-[side=bottom]:before:h-[var(--hover-card-bridge-size)]",
              "group-data-[side=left]:before:top-0 group-data-[side=left]:before:right-[calc(var(--hover-card-bridge-size)*-1)] group-data-[side=left]:before:bottom-0 group-data-[side=left]:before:w-[var(--hover-card-bridge-size)]",
              "group-data-[side=right]:before:top-0 group-data-[side=right]:before:bottom-0 group-data-[side=right]:before:left-[calc(var(--hover-card-bridge-size)*-1)] group-data-[side=right]:before:w-[var(--hover-card-bridge-size)]",
              "transform-gpu",
              className
            )}
            exit="closed"
            id={contentId}
            initial="closed"
            onBlur={(event) => {
              onBlur?.(event);
              if (event.defaultPrevented) return;
              handleFocusEnd(event);
            }}
            onFocus={(event) => {
              onFocus?.(event);
              if (event.defaultPrevented) return;
              handleFocusStart();
            }}
            onPointerEnter={(event) => {
              onPointerEnter?.(event);
              if (event.defaultPrevented) return;
              handleHoverStart(event);
            }}
            onPointerLeave={(event) => {
              onPointerLeave?.(event);
              if (event.defaultPrevented) return;
              handleHoverEnd(event);
            }}
            ref={(node: HTMLDivElement | null) => {
              setContentNode(node);
              assignRef(ref, node);
            }}
            role="dialog"
            style={{
              transformOrigin:
                "var(--radix-hover-card-content-transform-origin)",
            }}
            variants={variants}
          >
            {children}
          </motion.div>
        </div>
      </HoverCardPrimitive.Content>
    );
  }
);
HoverCardContentBody.displayName = "HoverCardContentBody";

// ---------------------------------------------------------------------------
// HoverCardContent — AnimatePresence wrapper keeps the panel in the DOM until
// the exit animation finishes, then cleanly unmounts.
// ---------------------------------------------------------------------------

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
