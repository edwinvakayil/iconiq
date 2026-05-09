"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

type PopoverContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> & {
  open?: boolean;
};

/**
 * Internal content body — uses Radix's data-side to derive an origin-aware
 * transform so the popover appears to grow out of its trigger.
 */
const PopoverContentBody = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    { className, align = "center", sideOffset = 8, children, ...props },
    ref
  ) => {
    return (
      <PopoverPrimitive.Content
        align={align}
        asChild
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      >
        <motion.div
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 320,
              damping: 26,
              mass: 0.8,
            },
          }}
          className={cn(
            "z-50 w-72 rounded-lg border border-border bg-white p-4 text-foreground shadow-lg outline-none dark:bg-black",
            className
          )}
          exit={{
            opacity: 0,
            scale: 0.96,
            y: -4,
            transition: { duration: 0.15, ease: "easeIn" },
          }}
          initial={{ opacity: 0, scale: 0.92, y: -6 }}
          style={{
            transformOrigin: "var(--radix-popover-content-transform-origin)",
          }}
        >
          <motion.div
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.08, duration: 0.25, ease: "easeOut" },
            }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            initial={{ opacity: 0, y: 4 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </PopoverPrimitive.Content>
    );
  }
);
PopoverContentBody.displayName = "PopoverContentBody";

/**
 * Wrap PopoverContent with AnimatePresence so exit animations play.
 * `open` must be passed in (controlled) for AnimatePresence to track mount/unmount.
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ open, ...props }, ref) => {
  return (
    <AnimatePresence>
      {open ? (
        <PopoverPrimitive.Portal forceMount>
          <PopoverContentBody ref={ref} {...props} />
        </PopoverPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
