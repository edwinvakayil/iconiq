"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const springConfig = { stiffness: 100, damping: 5 };

export interface AnimatedTooltipProps {
  /** Element that triggers the tooltip on hover */
  children: ReactNode;
  /** Tooltip content (can be string or JSX) */
  content: ReactNode;
  /** Optional class for the tooltip popup */
  className?: string;
  /** Optional class for the trigger wrapper */
  wrapperClassName?: string;
  /** Optional class for the tooltip background (e.g. "bg-blue-600", "bg-amber-500"). Defaults to "bg-black". */
  backgroundClassName?: string;
}

export function AnimatedTooltip({
  children,
  content,
  className,
  wrapperClassName,
  backgroundClassName,
}: AnimatedTooltipProps) {
  const [open, setOpen] = useState(false);
  const x = useMotionValue(0);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const halfWidth = target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div
      className={cn("relative", wrapperClassName)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 10,
              },
            }}
            className={cn(
              "absolute -top-12 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md px-4 py-2 text-xs shadow-xl",
              backgroundClassName ?? "bg-black",
              className
            )}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX,
              rotate,
              whiteSpace: "nowrap",
            }}
          >
            <motion.div
              animate={{ scaleX: 1 }}
              aria-hidden
              className="absolute inset-x-0 -bottom-px z-30 h-px origin-center bg-linear-to-r from-transparent via-emerald-500 to-transparent"
              exit={{ scaleX: 0 }}
              initial={{ scaleX: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
            <motion.div
              animate={{ scaleX: 1 }}
              aria-hidden
              className="absolute inset-x-0 -bottom-px z-30 h-px origin-center bg-linear-to-r from-transparent via-sky-500 to-transparent"
              exit={{ scaleX: 0 }}
              initial={{ scaleX: 0 }}
              transition={{
                type: "tween",
                duration: 0.9,
                delay: 0.15,
                ease: "easeOut",
              }}
            />
            <span className="relative z-30 text-white">{content}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}
