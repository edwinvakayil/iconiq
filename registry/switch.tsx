"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

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
          componentThemeClassName,
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
          style={{ backgroundColor: "var(--ic-accent)" }}
        />

        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: "var(--ic-foreground)",
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

    if (!label) {
      return switchEl;
    }

    return (
      <div
        className={cn(
          componentThemeClassName,
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
