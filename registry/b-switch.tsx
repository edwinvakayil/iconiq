"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

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
                registryTheme,
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
            registryTheme,
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
