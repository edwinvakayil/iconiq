"use client";

import { Motorbike } from "lucide-react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface MotorbikeIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MotorbikeIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const MOTION_MOTORBIKE = motion(Motorbike);

const MotorbikeIcon = forwardRef<MotorbikeIconHandle, MotorbikeIconProps>(
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
        <MOTION_MOTORBIKE
          animate={controls}
          initial="normal"
          size={size}
          strokeWidth={2}
          variants={{
            normal: {
              x: 0,
              rotate: 0,
            },
            animate: {
              x: [0, 2, -2, 2, 0],
              rotate: [0, 1, -1, 1, 0],
              transition: {
                duration: 0.6,
                ease: "easeInOut",
              },
            },
          }}
        />
      </div>
    );
  }
);

MotorbikeIcon.displayName = "MotorbikeIcon";

export { MotorbikeIcon };
