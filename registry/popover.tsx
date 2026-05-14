"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type Side = "top" | "right" | "bottom" | "left";

type PopoverContextValue = {
  open: boolean;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

const initialOffset: Record<Side, { x: number; y: number }> = {
  top: { x: 0, y: 8 },
  right: { x: -8, y: 0 },
  bottom: { x: 0, y: -8 },
  left: { x: 8, y: 0 },
};

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
        !asChild &&
          "inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

type PopoverContentPanelProps = React.ComponentPropsWithoutRef<
  typeof motion.div
> & {
  "data-side"?: Side;
};

const PopoverContentPanel = React.forwardRef<
  HTMLDivElement,
  PopoverContentPanelProps
>(({ children, className, style, "data-side": dataSide, ...props }, ref) => {
  const resolvedSide = dataSide ?? "bottom";

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      className={cn(
        "z-50 w-72 rounded-lg border border-border bg-white p-4 text-foreground shadow-lg outline-none dark:bg-black",
        className
      )}
      exit={{
        opacity: 0,
        scale: 0.96,
        ...initialOffset[resolvedSide],
        transition: { duration: 0.15, ease: "easeIn" },
      }}
      initial={{
        opacity: 0,
        scale: 0.96,
        ...initialOffset[resolvedSide],
      }}
      layout="size"
      ref={ref}
      style={{
        transformOrigin: "var(--radix-popover-content-transform-origin)",
        ...style,
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 26,
        mass: 0.8,
      }}
      {...props}
    >
      {children}
    </motion.div>
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
        ref={ref}
        side={side}
        sideOffset={sideOffset}
        {...props}
      >
        <PopoverContentPanel className={className}>
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
