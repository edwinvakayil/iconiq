"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

const TRACK_W = 44;
const TRACK_H = 26;
const THUMB_SIZE = 20;
const THUMB_TRAVEL = TRACK_W - THUMB_SIZE - 4;

const spring = { type: "spring" as const, duration: 0.35, bounce: 0.3 };
const springFast = { type: "spring" as const, duration: 0.15, bounce: 0 };
const springSnap = { type: "spring" as const, duration: 0.4, bounce: 0.5 };

export interface SwitchProps extends ReducedMotionProp {
  "aria-label"?: string;
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  form?: string;
  id?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  label?: string;
  labelSide?: "left" | "right";
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      "aria-label": ariaLabel,
      checked,
      className,
      defaultChecked,
      disabled,
      form,
      id,
      inputRef,
      label,
      labelSide = "right",
      name,
      onCheckedChange,
      readOnly,
      reducedMotion,
      required,
      value,
    },
    ref
  ) => {
    const isControlled = checked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
      Boolean(defaultChecked)
    );
    const internalChecked = isControlled ? checked : uncontrolledChecked;

    const thumbX = useMotionValue(internalChecked ? THUMB_TRAVEL : 0);
    const thumbScaleX = useMotionValue(1);
    const thumbScaleY = useMotionValue(1);

    const fillOpacity = useTransform(thumbX, [0, THUMB_TRAVEL], [0, 1]);
    const reduceMotion = useResolvedReducedMotion(reducedMotion);

    const prevChecked = React.useRef(internalChecked);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
      if (prevChecked.current === internalChecked) {
        return;
      }

      prevChecked.current = internalChecked;
      if (reduceMotion) {
        thumbX.set(internalChecked ? THUMB_TRAVEL : 0);
        return;
      }

      animate(thumbX, internalChecked ? THUMB_TRAVEL : 0, spring);
    }, [internalChecked, reduceMotion, thumbX]);

    const handlePointerDown = () => {
      if (reduceMotion) {
        return;
      }

      animate(thumbScaleX, 0.82, springFast);
      animate(thumbScaleY, 1.1, springFast);
    };

    const handlePointerUp = () => {
      if (reduceMotion) {
        thumbScaleX.set(1);
        thumbScaleY.set(1);
        return;
      }

      animate(thumbScaleX, 1, springSnap);
      animate(thumbScaleY, 1, springSnap);
    };

    const handleCheckedChange = (next: boolean) => {
      if (!isControlled) {
        setUncontrolledChecked(next);
      }

      if (reduceMotion) {
        thumbScaleX.set(1);
        thumbScaleY.set(1);
        thumbX.set(next ? THUMB_TRAVEL : 0);
        onCheckedChange?.(next);
        return;
      }

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
      if (disabled || readOnly) {
        return;
      }

      handleCheckedChange(!internalChecked);
      buttonRef.current?.focus();
    };

    const switchEl = (
      <SwitchPrimitive.Root
        checked={internalChecked}
        disabled={disabled}
        form={form}
        id={id}
        inputRef={inputRef}
        name={name}
        nativeButton
        onCheckedChange={(nextChecked) => {
          handleCheckedChange(nextChecked);
        }}
        readOnly={readOnly}
        render={(rootProps) => {
          const {
            className: rootClassName,
            onAnimationEnd: _onAnimationEnd,
            onAnimationIteration: _onAnimationIteration,
            onAnimationStart: _onAnimationStart,
            onDrag: _onDrag,
            onDragEnd: _onDragEnd,
            onDragEnter: _onDragEnter,
            onDragExit: _onDragExit,
            onDragLeave: _onDragLeave,
            onDragOver: _onDragOver,
            onDragStart: _onDragStart,
            onDrop: _onDrop,
            ref: rootRef,
            ...resolvedRootProps
          } = rootProps;

          return (
            <motion.button
              {...resolvedRootProps}
              aria-label={ariaLabel}
              className={cn(
                componentThemeClassName,
                "relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:cursor-not-allowed disabled:opacity-50",
                rootClassName,
                className
              )}
              disabled={disabled}
              initial={false}
              onPointerDown={(event) => {
                rootProps.onPointerDown?.(event);
                handlePointerDown();
              }}
              onPointerLeave={(event) => {
                rootProps.onPointerLeave?.(event);
                handlePointerUp();
              }}
              onPointerUp={(event) => {
                rootProps.onPointerUp?.(event);
                handlePointerUp();
              }}
              ref={(node) => {
                buttonRef.current = node;
                setRef(rootRef, node);
                setRef(ref, node);
              }}
              style={{ width: TRACK_W, height: TRACK_H }}
              type="button"
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

              {resolvedRootProps.children}
            </motion.button>
          );
        }}
        required={required}
        value={value}
      >
        <SwitchPrimitive.Thumb
          render={(thumbProps) => {
            const {
              className: thumbClassName,
              onAnimationEnd: _onAnimationEnd,
              onAnimationIteration: _onAnimationIteration,
              onAnimationStart: _onAnimationStart,
              onDrag: _onDrag,
              onDragEnd: _onDragEnd,
              onDragEnter: _onDragEnter,
              onDragExit: _onDragExit,
              onDragLeave: _onDragLeave,
              onDragOver: _onDragOver,
              onDragStart: _onDragStart,
              onDrop: _onDrop,
              ...resolvedThumbProps
            } = thumbProps;

            return (
              <motion.span
                {...resolvedThumbProps}
                className={cn(
                  "pointer-events-none z-10 block rounded-full",
                  thumbClassName
                )}
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
            );
          }}
        />
      </SwitchPrimitive.Root>
    );

    if (!label) {
      return (
        <ReducedMotionConfig reducedMotion={reducedMotion}>
          {switchEl}
        </ReducedMotionConfig>
      );
    }

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <div
          className={cn(
            componentThemeClassName,
            "flex cursor-pointer select-none items-center gap-2.5",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {labelSide === "left" ? (
            <button
              className="bg-transparent p-0 text-foreground text-sm"
              disabled={disabled}
              onClick={toggleFromLabel}
              type="button"
            >
              {label}
            </button>
          ) : null}
          {switchEl}
          {labelSide === "right" ? (
            <button
              className="bg-transparent p-0 text-foreground text-sm"
              disabled={disabled}
              onClick={toggleFromLabel}
              type="button"
            >
              {label}
            </button>
          ) : null}
        </div>
      </ReducedMotionConfig>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
