"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type CollisionPadding = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
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
      <PopoverPrimitive.Root
        modal={false}
        onOpenChange={(nextOpen) => {
          clearTimer();
          setOpen(nextOpen);
        }}
        open={open}
      >
        <span className={cn("inline-flex w-fit", className)}>{children}</span>
      </PopoverPrimitive.Root>
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
      <PopoverPrimitive.Anchor asChild>
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
      </PopoverPrimitive.Anchor>
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
      <PopoverPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        asChild
        avoidCollisions={avoidCollisions}
        collisionPadding={collisionPadding}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
        side={side}
        sideOffset={sideOffset}
      >
        <motion.div
          animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
          aria-labelledby={triggerId}
          className={cn(
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
              transformOrigin: "var(--radix-popover-content-transform-origin)",
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
      </PopoverPrimitive.Content>
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
        <PopoverPrimitive.Portal forceMount>
          <HoverCardContentBody ref={ref} {...props} />
        </PopoverPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
});
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
