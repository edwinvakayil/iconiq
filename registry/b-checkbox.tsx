"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { motion } from "motion/react";
import * as React from "react";

import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

const boxTransition = { type: "spring", stiffness: 500, damping: 30 } as const;
const labelTransition = { duration: 0.2 } as const;

const checkmarkVariants = {
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.3, ease: [0.65, 0, 0.35, 1] },
      opacity: { duration: 0.05 },
    },
  },
  unchecked: {
    pathLength: 0,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.25, ease: [0.65, 0, 0.35, 1] },
    },
  },
} as const;

export interface CheckboxProps {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  id?: string;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
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

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    { checked, defaultChecked = false, onCheckedChange, label, className, id },
    ref
  ) => {
    const generatedId = React.useId();
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const labelId = label ? `${id ?? generatedId}-label` : undefined;
    const [internal, setInternal] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const value = isControlled ? checked : internal;

    const handleCheckedChange = React.useCallback(
      (nextChecked: boolean) => {
        if (!isControlled) {
          setInternal(nextChecked);
        }

        onCheckedChange?.(nextChecked);
      },
      [isControlled, onCheckedChange]
    );

    return (
      <div
        className={cn(
          registryTheme,
          "inline-flex select-none items-center gap-3",
          className
        )}
      >
        <CheckboxPrimitive.Root
          checked={value}
          id={id}
          nativeButton
          onCheckedChange={(nextChecked) => {
            handleCheckedChange(nextChecked);
          }}
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
                animate={{
                  backgroundColor: value
                    ? "var(--color-foreground)"
                    : "var(--color-background)",
                  borderColor: value
                    ? "var(--color-foreground)"
                    : "var(--color-border)",
                }}
                aria-labelledby={labelId}
                className={cn(
                  "relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  rootClassName
                )}
                initial={false}
                ref={(node) => {
                  buttonRef.current = node;
                  setRef(rootRef, node);
                  setRef(ref, node);
                }}
                transition={boxTransition}
                type="button"
                whileTap={{ scale: 0.88 }}
              />
            );
          }}
        >
          <CheckboxPrimitive.Indicator
            keepMounted
            render={(indicatorProps) => {
              const {
                className: indicatorClassName,
                children: _children,
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
                ...resolvedIndicatorProps
              } = indicatorProps;

              return (
                <motion.svg
                  {...resolvedIndicatorProps}
                  animate={value ? "checked" : "unchecked"}
                  className={cn("h-3.5 w-3.5", indicatorClassName)}
                  fill="none"
                  initial={false}
                  stroke="var(--color-background)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    variants={checkmarkVariants}
                  />
                </motion.svg>
              );
            }}
          />
        </CheckboxPrimitive.Root>

        {label ? (
          <motion.span
            animate={{ opacity: value ? 0.55 : 1 }}
            className="cursor-pointer text-foreground text-sm"
            id={labelId}
            onClick={() => {
              buttonRef.current?.click();
              buttonRef.current?.focus();
            }}
            transition={labelTransition}
          >
            {label}
          </motion.span>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox as checkbox };
export { Checkbox };
