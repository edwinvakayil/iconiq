"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const POINTER_PATH =
  "M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z";

const DEFAULT_POINTER_COLOR = "#3b82f6";

export function Highlighter({
  children,
  rectangleClassName,
  pointerClassName,
  pointerColor = DEFAULT_POINTER_COLOR,
  containerClassName,
}: {
  children: React.ReactNode;
  rectangleClassName?: string;
  pointerClassName?: string;
  /** Pointer color (CSS value), e.g. "#22c55e" or "rgb(34 197 94)". Defaults to blue. */
  pointerColor?: string;
  containerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    const { width, height } = el.getBoundingClientRect();
    setDimensions({ width, height });
    ro.observe(el);
    return () => ro.unobserve(el);
  }, []);

  return (
    <div className={cn("relative w-fit", containerClassName)} ref={ref}>
      {children}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 0.95 }}
          style={{ transformOrigin: "0 0" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className={cn(
              "absolute top-0 left-0 border border-neutral-800 dark:border-neutral-200",
              rectangleClassName
            )}
            initial={{ width: 0, height: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true }}
            whileInView={{ width: dimensions.width, height: dimensions.height }}
          />
          <motion.div
            className="pointer-events-none absolute top-0 left-0"
            initial={{ opacity: 0, scale: 0.92 }}
            style={{ rotate: -90 }}
            transition={{
              opacity: { duration: 0.1, ease: "easeInOut" },
              duration: 1,
              ease: "easeInOut",
            }}
            viewport={{ once: true }}
            whileInView={{
              opacity: 1,
              scale: 1,
              x: dimensions.width + 4,
              y: dimensions.height + 4,
            }}
          >
            <span
              className="inline-flex shrink-0"
              style={{ color: pointerColor }}
            >
              <svg
                className={cn("size-5", pointerClassName)}
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={POINTER_PATH} />
              </svg>
            </span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
