import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useAnimationControls } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "group/toggle relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-md font-medium text-sm transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 min-w-9 px-3",
        sm: "h-8 min-w-8 px-2",
        lg: "h-10 min-w-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, onPressedChange, children, ...props }, ref) => {
  const buttonControls = useAnimationControls();
  const iconControls = useAnimationControls();
  const rippleControls = useAnimationControls();

  const handlePressedChange = (pressed: boolean) => {
    buttonControls.start({
      scale: [1, 0.85, 1.12, 0.97, 1],
      transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
    });

    rippleControls.set({ scale: 0, opacity: 0.4 });
    rippleControls.start({
      scale: 4,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    });

    iconControls.start({
      scale: pressed ? [1, 0.3, 1.5, 1] : [1, 1.4, 0.8, 1],
      rotate: pressed ? [0, -25, 20, 0] : [0, 20, -10, 0],
      y: pressed ? [0, 6, -8, 0] : [0, -6, 4, 0],
      transition: { type: "spring", stiffness: 260, damping: 11, mass: 0.8 },
    });

    onPressedChange?.(pressed);
  };

  return (
    <TogglePrimitive.Root
      asChild
      onPressedChange={handlePressedChange}
      ref={ref}
      {...props}
    >
      <motion.button
        animate={buttonControls}
        className={cn(toggleVariants({ variant, size, className }))}
        whileHover={{
          y: -2,
          transition: { type: "spring", stiffness: 400, damping: 15 },
        }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.span
          animate={rippleControls}
          aria-hidden
          className="pointer-events-none absolute inset-0 m-auto h-2 w-2 rounded-full bg-foreground/30"
          initial={{ scale: 0, opacity: 0 }}
        />
        <motion.span
          animate={iconControls}
          className="relative inline-flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0"
          style={{ transformOrigin: "center" }}
        >
          {children}
        </motion.span>
      </motion.button>
    </TogglePrimitive.Root>
  );
});

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
