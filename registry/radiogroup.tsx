"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedRadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  className?: string;
  children?: React.ReactNode;
}
const AnimatedRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  AnimatedRadioGroupProps
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      ref={ref}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          animate={{ opacity: 1, x: 0, scale: 1 }}
          initial={{ opacity: 0, x: -16, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 22,
            delay: index * 0.07,
          }}
        >
          {child}
        </motion.div>
      ))}
    </RadioGroupPrimitive.Root>
  );
});
AnimatedRadioGroup.displayName = "AnimatedRadioGroup";
export interface AnimatedRadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string;
  description?: string;
  className?: string;
}
const AnimatedRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  AnimatedRadioGroupItemProps
>(({ className, label, description, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item asChild ref={ref} {...props}>
      <motion.div
        className={cn(
          "group relative flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-card px-4 py-3.5",
          "transition-colors hover:border-primary/40 hover:bg-accent/40",
          "shadow-sm data-[state=checked]:border-primary/60 data-[state=checked]:bg-primary/4 data-[state=checked]:shadow-md",
          className
        )}
        whileHover={{ scale: 1.015, y: -1 }}
        whileTap={{ scale: 0.985 }}
      >
        {/* Shimmer on checked */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-primary/6 to-transparent opacity-0 data-[state=checked]:opacity-100"
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />
        </div>

        <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <div
            className={cn(
              "flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-muted-foreground/30",
              "ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "data-[state=checked]:border-primary"
            )}
          >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <AnimatePresence>
                <motion.div
                  key="indicator"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                  }}
                  className="h-2.5 w-2.5 rounded-full bg-primary"
                />
              </AnimatePresence>
            </RadioGroupPrimitive.Indicator>
          </div>

          {/* Ping ring on selection */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary opacity-0 data-[state=checked]:opacity-100"
            animate={{
              scale: [1, 1.8],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
              ease: "easeOut",
            }}
          />
        </div>

        {(label || description) && (
          <div className="relative flex flex-col gap-0.5">
            {label && (
              <span className="font-medium text-foreground text-sm leading-tight">
                {label}
              </span>
            )}
            {description && (
              <span className="text-muted-foreground text-xs leading-snug">
                {description}
              </span>
            )}
          </div>
        )}
      </motion.div>
    </RadioGroupPrimitive.Item>
  );
});
AnimatedRadioGroupItem.displayName = "AnimatedRadioGroupItem";
export { AnimatedRadioGroup, AnimatedRadioGroupItem };
