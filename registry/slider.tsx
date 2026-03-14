"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion, useMotionValue } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValue?: boolean;
  unit?: string;
  className?: string;
}

const AnimatedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  AnimatedSliderProps
>(
  (
    {
      className,
      showValue = true,
      unit = "",
      value,
      defaultValue,
      onValueChange,
      min: minProp,
      max: maxProp,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      (value as number[] | undefined)?.[0] ??
        (defaultValue as number[] | undefined)?.[0] ??
        50
    );
    const [isHovered, setIsHovered] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const currentValue = (value as number[] | undefined)?.[0] ?? internalValue;
    const motionVal = useMotionValue(currentValue);
    React.useEffect(() => {
      motionVal.set(currentValue);
    }, [currentValue, motionVal]);
    const min = minProp ?? 0;
    const max = maxProp ?? 100;
    const pct = ((currentValue - min) / (max - min)) * 100;
    const handleValueChange = (v: number[]) => {
      setInternalValue(v[0]);
      onValueChange?.(v);
    };
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full"
        initial={{ opacity: 0, y: 8 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      >
        <SliderPrimitive.Root
          className={cn(
            "relative flex w-full touch-none select-none items-center py-2",
            className
          )}
          max={max}
          min={min}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          onValueChange={handleValueChange}
          ref={ref}
          value={[currentValue]}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            {/* Animated fill */}
            <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary dark:bg-neutral-400" />
            {/* Shimmer sweep on track */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-primary/20 to-transparent dark:via-white/20"
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
            {/* Glow under fill */}
            <motion.div
              animate={{
                opacity: isDragging ? 0.8 : isHovered ? 0.5 : 0.25,
              }}
              className="pointer-events-none absolute h-full rounded-full bg-primary/30 blur-sm dark:bg-white/25"
              style={{ width: `${pct}%` }}
              transition={{ duration: 0.3 }}
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb asChild>
            <motion.span
              animate={{
                boxShadow: isDragging
                  ? "0 0 0 6px hsl(var(--primary) / 0.15), 0 0 16px hsl(var(--primary) / 0.2)"
                  : isHovered
                    ? "0 0 0 4px hsl(var(--primary) / 0.1)"
                    : "0 0 0 0px hsl(var(--primary) / 0)",
              }}
              className={cn(
                "block h-5 w-5 rounded-full border-2 border-primary bg-background",
                "dark:border-neutral-400 dark:bg-white",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "cursor-grab active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50"
              )}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 1.1 }}
            >
              {/* Ping ring */}
              <motion.span
                animate={{
                  scale: [1, 2.2],
                  opacity: [0.4, 0],
                }}
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                  ease: "easeOut",
                }}
              />
            </motion.span>
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
        {/* Floating value tooltip */}
        {showValue && (
          <motion.div
            animate={{
              opacity: isHovered || isDragging ? 1 : 0,
              y: isHovered || isDragging ? 0 : 6,
              scale: isHovered || isDragging ? 1 : 0.8,
            }}
            className="pointer-events-none absolute -top-8 flex items-center justify-center"
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            style={{ left: `${pct}%`, x: "-50%" }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
          >
            <span className="rounded-md bg-neutral-900 px-2 py-0.5 font-semibold text-[11px] text-white tabular-nums shadow-md dark:bg-neutral-100 dark:text-neutral-900">
              {Math.round(currentValue)}
              {unit}
            </span>
          </motion.div>
        )}
      </motion.div>
    );
  }
);
AnimatedSlider.displayName = "AnimatedSlider";
export { AnimatedSlider };
