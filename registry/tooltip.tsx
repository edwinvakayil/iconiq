"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: Side;
  delay?: number;
  className?: string;
}

const wrapperStyles: Record<Side, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 pb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 pt-2",
  left: "right-full top-1/2 -translate-y-1/2 pr-2",
  right: "left-full top-1/2 -translate-y-1/2 pl-2",
};

const initialOffset: Record<Side, { x: number; y: number }> = {
  top: { x: 0, y: 6 },
  bottom: { x: 0, y: -6 },
  left: { x: 6, y: 0 },
  right: { x: -6, y: 0 },
};

const arrowStyles: Record<Side, string> = {
  top: "-bottom-1 left-1/2 -translate-x-1/2",
  bottom: "-top-1 left-1/2 -translate-x-1/2",
  left: "-right-1 top-1/2 -translate-y-1/2",
  right: "-left-1 top-1/2 -translate-y-1/2",
};

export function Tooltip({
  children,
  content,
  side = "top",
  delay = 0.15,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), delay * 1000);
  };
  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div
      className="relative inline-flex"
      onBlur={handleLeave}
      onFocus={handleEnter}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      <AnimatePresence>
        {open && (
          <div
            className={cn(
              "pointer-events-none absolute z-50",
              wrapperStyles[side]
            )}
          >
            <motion.div
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                x: 0,
                y: 0,
              }}
              className={cn(
                "relative whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 font-medium text-background text-xs shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]",
                className
              )}
              exit={{
                opacity: 0,
                scale: 0.85,
                filter: "blur(4px)",
                ...initialOffset[side],
              }}
              initial={{
                opacity: 0,
                scale: 0.85,
                filter: "blur(4px)",
                ...initialOffset[side],
              }}
              role="tooltip"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 22,
                mass: 0.6,
              }}
            >
              <motion.span
                animate={{ scale: 1 }}
                className={cn(
                  "absolute h-2 w-2 rotate-45 bg-foreground",
                  arrowStyles[side]
                )}
                exit={{ scale: 0 }}
                initial={{ scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                  delay: 0.03,
                }}
              />
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Tooltip as tooltip };
