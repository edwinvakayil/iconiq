"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const popoverThemeClassName =
  "[--po-surface:#ffffff] [--po-foreground:#111111] [--po-border:#e3e7ec] [--po-ring:rgba(17,17,17,0.16)] dark:[--po-surface:#111111] dark:[--po-foreground:#f6f3ec] dark:[--po-border:#2b2a25] dark:[--po-ring:rgba(246,243,236,0.18)]";

const popoverPanelClassName =
  "z-50 w-72 transform-gpu rounded-lg border border-[color:var(--po-border)] bg-[color:var(--po-surface)] p-4 text-[color:var(--po-foreground)] shadow-none outline-none";

const popoverTriggerClassName =
  "inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--po-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--po-surface)]";

type Side = "top" | "right" | "bottom" | "left";

type PopoverContextValue = {
  open: boolean;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const POPOVER_EXIT_EASE = [0.4, 0, 0.6, 1] as const;

const POPOVER_SPRING = {
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

function getPopoverMotion(side: Side) {
  const offset = getSideMotionOffset(side);

  return {
    animate: { opacity: 1, scale: 1, x: 0, y: 0 },
    closed: { opacity: 0, scale: 0.988, ...offset },
    initial: { opacity: 0, scale: 0.988, ...offset },
    openTransition: {
      opacity: { duration: 0.26, ease: FLUID_EASE },
      scale: POPOVER_SPRING,
      x: POPOVER_SPRING,
      y: POPOVER_SPRING,
    },
    closedTransition: {
      opacity: { duration: 0.16, ease: POPOVER_EXIT_EASE },
      scale: { duration: 0.16, ease: POPOVER_EXIT_EASE },
      x: { duration: 0.16, ease: POPOVER_EXIT_EASE },
      y: { duration: 0.16, ease: POPOVER_EXIT_EASE },
    },
  };
}

const usePopover = () => {
  const context = React.useContext(PopoverContext);

  if (!context) {
    throw new Error("Popover components must be used inside Popover");
  }

  return context;
};

type PopoverProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Root
>;

const Popover = ({
  children,
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  ...props
}: PopoverProps) => {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <PopoverContext.Provider value={{ open }}>
      <PopoverPrimitive.Root
        {...props}
        onOpenChange={handleOpenChange}
        open={open}
      >
        {children}
      </PopoverPrimitive.Root>
    </PopoverContext.Provider>
  );
};
Popover.displayName = "Popover";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Trigger
>;

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(({ asChild, className, ...props }, ref) => {
  return (
    <PopoverPrimitive.Trigger
      asChild={asChild}
      className={cn(
        !asChild && popoverThemeClassName,
        !asChild && popoverTriggerClassName,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverAnchor = PopoverPrimitive.Anchor;

type PopoverContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> & {
  open?: boolean;
};

type PopoverContentPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  "data-side"?: Side;
};

const PopoverContentPanel = React.forwardRef<
  HTMLDivElement,
  PopoverContentPanelProps
>(({ children, className, style, "data-side": dataSide, ...props }, ref) => {
  const resolvedSide = dataSide ?? "bottom";
  const popoverMotion = getPopoverMotion(resolvedSide);
  const panelVariants = {
    closed: {
      ...popoverMotion.closed,
      transition: popoverMotion.closedTransition,
    },
    open: {
      ...popoverMotion.animate,
      transition: popoverMotion.openTransition,
    },
  };

  return (
    <div ref={ref} style={style} {...props}>
      <motion.div
        animate="open"
        className={cn(popoverThemeClassName, popoverPanelClassName, className)}
        exit="closed"
        initial="closed"
        layout="size"
        style={{
          transformOrigin: "var(--radix-popover-content-transform-origin)",
        }}
        variants={panelVariants}
      >
        {children}
      </motion.div>
    </div>
  );
});
PopoverContentPanel.displayName = "PopoverContentPanel";

/**
 * Internal content body — uses Radix's placement data for direction-aware
 * motion and lets Motion smoothly animate size changes while content updates.
 */
const PopoverContentBody = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      align = "center",
      avoidCollisions = true,
      children,
      className,
      collisionPadding = 12,
      side = "bottom",
      sideOffset = 8,
      ...props
    },
    ref
  ) => {
    return (
      <PopoverPrimitive.Content
        align={align}
        asChild
        avoidCollisions={avoidCollisions}
        collisionPadding={collisionPadding}
        side={side}
        sideOffset={sideOffset}
        {...props}
      >
        <PopoverContentPanel className={className} ref={ref}>
          {children}
        </PopoverContentPanel>
      </PopoverPrimitive.Content>
    );
  }
);
PopoverContentBody.displayName = "PopoverContentBody";

/**
 * Wrap PopoverContent with AnimatePresence so exit animations play.
 * Presence follows the nearest Popover root state.
 * `open` is accepted for backwards compatibility but is no longer required.
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ open: _open, ...props }, ref) => {
  const { open: contextOpen } = usePopover();

  return (
    <AnimatePresence>
      {contextOpen ? (
        <PopoverPrimitive.Portal forceMount>
          <PopoverContentBody ref={ref} {...props} />
        </PopoverPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
