"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TRACK_W = 44;
const TRACK_H = 26;
const THUMB_SIZE = 20;
const THUMB_TRAVEL = TRACK_W - THUMB_SIZE - 4; // px from left to right (margin 2px each side)

const spring = { type: "spring" as const, duration: 0.35, bounce: 0.3 };
const springFast = { type: "spring" as const, duration: 0.15, bounce: 0 };
const springSnap = { type: "spring" as const, duration: 0.4, bounce: 0.5 };

interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    "asChild"
  > {
  label?: string;
  /** @default "right" */
  labelSide?: "left" | "right";
}

const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    {
      checked,
      onCheckedChange,
      label,
      labelSide = "right",
      className,
      disabled,
      defaultChecked,
      ...props
    },
    ref
  ) => {
    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(
      Boolean(defaultChecked)
    );
    const internalChecked = isControlled ? checked : uncontrolledChecked;

    const thumbX = useMotionValue(internalChecked ? THUMB_TRAVEL : 0);
    const thumbScaleX = useMotionValue(1);
    const thumbScaleY = useMotionValue(1);

    const fillOpacity = useTransform(thumbX, [0, THUMB_TRAVEL], [0, 1]);

    const prevChecked = useRef(internalChecked);
    const directionRef = useRef<1 | -1>(1);

    useEffect(() => {
      if (prevChecked.current === internalChecked) return;
      prevChecked.current = internalChecked;
      animate(thumbX, internalChecked ? THUMB_TRAVEL : 0, spring);
    }, [internalChecked, thumbX]);

    const handlePointerDown = () => {
      // Flatten thumb on press (squeeze effect)
      animate(thumbScaleX, 0.82, springFast);
      animate(thumbScaleY, 1.1, springFast);
    };

    const handlePointerUp = () => {
      // Snap back with bounce
      animate(thumbScaleX, 1, springSnap);
      animate(thumbScaleY, 1, springSnap);
    };

    const handleCheckedChange = (next: boolean) => {
      directionRef.current = next ? 1 : -1;

      if (!isControlled) {
        setUncontrolledChecked(next);
      }

      // Squeeze in direction of travel on release
      animate(thumbScaleX, 1.15, springFast).then(() => {
        animate(thumbScaleX, 1, springSnap);
      });
      animate(thumbScaleY, 0.88, springFast).then(() => {
        animate(thumbScaleY, 1, springSnap);
      });

      animate(thumbX, next ? THUMB_TRAVEL : 0, spring);
      onCheckedChange?.(next);
    };

    const toggleFromLabel = () => {
      if (disabled) return;
      handleCheckedChange(!internalChecked);
    };

    const switchEl = (
      <SwitchPrimitive.Root
        checked={internalChecked}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerUp}
        onPointerUp={handlePointerUp}
        ref={ref}
        style={{ width: TRACK_W, height: TRACK_H }}
        {...props}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "var(--accent)" }}
        />

        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: "var(--foreground)",
            opacity: fillOpacity,
          }}
        />

        <SwitchPrimitive.Thumb asChild>
          <motion.span
            className="pointer-events-none z-10 block rounded-full"
            style={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              x: thumbX,
              scaleX: thumbScaleX,
              scaleY: thumbScaleY,
              marginLeft: 2,
              backgroundColor: "white",
              boxShadow:
                "0 1px 4px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
            }}
          />
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    );

    if (!label) return switchEl;

    return (
      <div
        className={cn(
          "flex cursor-pointer select-none items-center gap-2.5",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {labelSide === "left" && (
          <button
            className="bg-transparent p-0 text-foreground text-sm"
            disabled={disabled}
            onClick={toggleFromLabel}
            type="button"
          >
            {label}
          </button>
        )}
        {switchEl}
        {labelSide === "right" && (
          <button
            className="bg-transparent p-0 text-foreground text-sm"
            disabled={disabled}
            onClick={toggleFromLabel}
            type="button"
          >
            {label}
          </button>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch, type SwitchProps };
