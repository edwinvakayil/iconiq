"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface MonitorCogIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MonitorCogIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const MonitorCogIcon = forwardRef<MonitorCogIconHandle, MonitorCogIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
        >
          {/* monitor stand */}
          <path d="M12 17v4" />
          {/* monitor body */}
          <path d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
          {/* monitor base */}
          <path d="M8 21h8" />

          {/* spinning cog in the top-right corner */}
          <motion.g
            animate={controls}
            style={{ transformOrigin: "18px 6px" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            variants={{
              normal: { rotate: 0 },
              animate: { rotate: 360 },
            }}
          >
            <path d="m15.2 4.9-.9-.4" />
            <path d="m15.2 7.1-.9.4" />
            <path d="m16.9 3.2-.4-.9" />
            <path d="m16.9 8.8-.4.9" />
            <path d="m19.5 2.3-.4.9" />
            <path d="m19.5 9.7-.4-.9" />
            <path d="m21.7 4.5-.9.4" />
            <path d="m21.7 7.5-.9-.4" />
            <circle cx="18" cy="6" r="3" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

MonitorCogIcon.displayName = "MonitorCogIcon";

export { MonitorCogIcon };
