"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MotionOutput = motion.create("output");

type SpinnerVariant = "ring" | "dots";

interface SpinnerProps {
  variant?: SpinnerVariant;
  className?: string;
}

const Spinner = ({ variant = "ring", className }: SpinnerProps) => {
  if (variant === "dots") {
    return (
      <output
        aria-label="Loading"
        aria-live="polite"
        className={cn(
          "inline-flex size-6 items-center justify-center gap-[18%]",
          className
        )}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            animate={{ y: ["0%", "-55%", "0%"] }}
            className="aspect-square w-[22%] shrink-0 rounded-full bg-primary"
            key={i}
            transition={{
              duration: 0.9,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </output>
    );
  }

  return (
    <MotionOutput
      animate={{ rotate: 360 }}
      aria-label="Loading"
      aria-live="polite"
      className={cn(
        "box-border size-6 rounded-full border-2 border-muted border-t-primary",
        className
      )}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  );
};

export default Spinner;
