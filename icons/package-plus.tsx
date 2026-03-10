"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface PackagePlusIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface PackagePlusIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const PackagePlusIcon = forwardRef<PackagePlusIconHandle, PackagePlusIconProps>(
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
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* box */}
          <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
          <path d="m7.5 4.27 9 5.15" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" x2="12" y1="22" y2="12" />

          {/* animated plus - stroke drawn */}
          <motion.path
            animate={controls}
            d="M16 16h6"
            transition={{ duration: 0.7, ease: "easeInOut" }}
            variants={{
              normal: { strokeDasharray: 8, strokeDashoffset: 0 },
              animate: { strokeDasharray: 8, strokeDashoffset: [0, 8, 0] },
            }}
          />
          <motion.path
            animate={controls}
            d="M19 13v6"
            transition={{ duration: 0.7, ease: "easeInOut", delay: 0.08 }}
            variants={{
              normal: { strokeDasharray: 8, strokeDashoffset: 0 },
              animate: { strokeDasharray: 8, strokeDashoffset: [0, 8, 0] },
            }}
          />
        </svg>
      </div>
    );
  }
);

PackagePlusIcon.displayName = "PackagePlusIcon";

export { PackagePlusIcon };
