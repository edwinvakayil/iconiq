"use client";

import { motion } from "motion/react";
import * as React from "react";

import { PACKAGE_MANAGER } from "@/constants";
import { cn } from "@/lib/utils";

type PackageManagerSwitcherProps = {
  value: (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER];
  onValueChange: (
    value: (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER]
  ) => void;
  className?: string;
};

export function PackageManagerSwitcher({
  value,
  onValueChange,
  className,
}: PackageManagerSwitcherProps) {
  const railRef = React.useRef<HTMLDivElement>(null);
  const triggerRefs = React.useRef<
    Partial<
      Record<
        (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER],
        HTMLButtonElement | null
      >
    >
  >({});
  const [activeRect, setActiveRect] = React.useState({ left: 0, width: 0 });
  const [hoveredValue, setHoveredValue] = React.useState<
    (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER] | null
  >(null);
  const [hoverRect, setHoverRect] = React.useState({ left: 0, width: 0 });

  const measure = React.useCallback(
    (
      packageManager:
        | (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER]
        | null
    ) => {
      if (!packageManager) {
        return null;
      }

      const trigger = triggerRefs.current[packageManager];
      const rail = railRef.current;

      if (!(trigger && rail)) {
        return null;
      }

      const triggerRect = trigger.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();

      return {
        left: triggerRect.left - railRect.left,
        width: triggerRect.width,
      };
    },
    []
  );

  React.useLayoutEffect(() => {
    const rect = measure(value);
    if (rect) {
      setActiveRect(rect);
    }
  }, [measure, value]);

  React.useLayoutEffect(() => {
    const rect = measure(hoveredValue);
    if (rect) {
      setHoverRect(rect);
    }
  }, [hoveredValue, measure]);

  React.useLayoutEffect(() => {
    const updateRects = () => {
      setActiveRect(measure(value) ?? { left: 0, width: 0 });
      setHoverRect(measure(hoveredValue) ?? { left: 0, width: 0 });
    };

    updateRects();

    const rail = railRef.current;
    if (!(rail && typeof ResizeObserver !== "undefined")) {
      window.addEventListener("resize", updateRects);
      return () => window.removeEventListener("resize", updateRects);
    }

    const observer = new ResizeObserver(updateRects);
    observer.observe(rail);

    return () => observer.disconnect();
  }, [hoveredValue, measure, value]);

  const showHover = hoveredValue !== null && hoveredValue !== value;

  return (
    <div className={cn("mb-3", className)}>
      <div
        className="relative inline-flex items-center border-border/55 border-b"
        onMouseLeave={() => setHoveredValue(null)}
        ref={railRef}
      >
        {Object.values(PACKAGE_MANAGER).map((packageManager) => {
          const isActive = value === packageManager;
          const isHover = hoveredValue === packageManager;

          return (
            <button
              className="relative px-4 py-3 font-mono text-[10px] uppercase tracking-[0.24em] outline-none transition-colors duration-300 sm:px-5"
              key={packageManager}
              onClick={() => onValueChange(packageManager)}
              onFocus={() => setHoveredValue(packageManager)}
              onMouseEnter={() => setHoveredValue(packageManager)}
              ref={(node) => {
                triggerRefs.current[packageManager] = node;
              }}
              style={{
                color: isActive
                  ? "var(--color-foreground)"
                  : isHover
                    ? "color-mix(in oklab, var(--color-foreground) 72%, transparent)"
                    : "color-mix(in oklab, var(--color-foreground) 42%, transparent)",
              }}
              type="button"
            >
              <span className="relative z-10">{packageManager}</span>
            </button>
          );
        })}
        <motion.div
          animate={{ left: activeRect.left, width: activeRect.width }}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px h-[1.5px] bg-foreground"
          transition={{
            type: "spring",
            stiffness: 360,
            damping: 34,
            mass: 0.7,
          }}
        />
        <motion.div
          animate={{
            left: hoverRect.left,
            opacity: showHover ? 1 : 0,
            width: hoverRect.width,
          }}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px h-[1.5px]"
          initial={false}
          style={{
            background:
              "color-mix(in oklab, var(--color-foreground) 25%, transparent)",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 40,
            mass: 0.5,
            opacity: { duration: 0.2 },
          }}
        />
      </div>
    </div>
  );
}
