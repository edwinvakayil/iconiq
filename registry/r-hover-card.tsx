"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

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

const initialOffset: Record<Side, { x: number; y: number }> = {
  top: { x: 0, y: 8 },
  right: { x: -8, y: 0 },
  bottom: { x: 0, y: -8 },
  left: { x: 8, y: 0 },
};

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

type HoverCardProps = ReducedMotionProp & {
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
  reducedMotion,
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
    <ReducedMotionConfig reducedMotion={reducedMotion}>
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
              componentThemeClassName,
              "inline-flex w-fit",
              className
            )}
          >
            {children}
          </span>
        </HoverCardPrimitive.Root>
      </HoverCardContext.Provider>
    </ReducedMotionConfig>
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
              : "inline-flex min-h-9 cursor-pointer items-center rounded-md px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2",
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
      open,
      setContentNode,
      handleFocusEnd,
      handleFocusStart,
      handleHoverEnd,
      handleHoverStart,
    } = useHoverCard();

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
        <motion.div
          animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
          aria-labelledby={triggerId}
          className={cn(
            componentThemeClassName,
            "relative z-50 w-72 rounded-lg border border-border bg-white p-4 text-foreground shadow-2xl outline-none dark:bg-black",
            hoverBridgeStyles[side],
            className
          )}
          data-state={open ? "open" : "closed"}
          exit={{
            opacity: 0,
            scale: 0.97,
            filter: "blur(6px)",
            ...initialOffset[side],
          }}
          id={contentId}
          initial={{
            opacity: 0,
            scale: 0.96,
            filter: "blur(8px)",
            ...initialOffset[side],
          }}
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
          style={
            {
              "--hover-card-bridge-size": `${sideOffset}px`,
              transformOrigin:
                "var(--radix-hover-card-content-transform-origin)",
              ...style,
            } as React.CSSProperties
          }
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
            mass: 0.55,
          }}
          {...props}
        >
          {children}
        </motion.div>
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
