"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

const boxTransition = { type: "spring", stiffness: 500, damping: 30 } as const;
const labelTransition = { duration: 0.2 } as const;
const reducedBoxTransition = { duration: 0.12 } as const;
const reducedLabelTransition = { duration: 0.12 } as const;

function getCheckmarkVariants(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      checked: {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { duration: 0.12 },
          opacity: { duration: 0.01 },
        },
      },
      unchecked: {
        pathLength: 0,
        opacity: 1,
        transition: {
          pathLength: { duration: 0.12 },
        },
      },
    } as const;
  }

  return {
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
}

export interface CheckboxProps extends ReducedMotionProp {
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

function normalizeCheckedState(
  nextChecked: boolean | "indeterminate"
): boolean {
  return nextChecked === true;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked,
      className,
      defaultChecked = false,
      id,
      label,
      onCheckedChange,
      reducedMotion,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const labelId = label ? `${id ?? generatedId}-label` : undefined;
    const [internal, setInternal] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const value = isControlled ? checked : internal;
    const reduceMotion = useResolvedReducedMotion(reducedMotion);
    const checkmarkVariants = getCheckmarkVariants(reduceMotion);

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
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <div
          className={cn(
            registryTheme,
            "inline-flex select-none items-center gap-3",
            className
          )}
        >
          <CheckboxPrimitive.Root
            asChild
            checked={value}
            id={id}
            onCheckedChange={(nextChecked) => {
              handleCheckedChange(normalizeCheckedState(nextChecked));
            }}
          >
            <motion.button
              animate={{
                backgroundColor: value
                  ? "var(--color-foreground)"
                  : "var(--color-background)",
                borderColor: value
                  ? "var(--color-foreground)"
                  : "var(--color-border)",
              }}
              aria-labelledby={labelId}
              className="relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              initial={false}
              ref={(node) => {
                buttonRef.current = node;
                setRef(ref, node);
              }}
              transition={reduceMotion ? reducedBoxTransition : boxTransition}
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.88 }}
            >
              <CheckboxPrimitive.Indicator asChild forceMount>
                <motion.svg
                  animate={value ? "checked" : "unchecked"}
                  className="h-3.5 w-3.5"
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
              </CheckboxPrimitive.Indicator>
            </motion.button>
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
              transition={
                reduceMotion ? reducedLabelTransition : labelTransition
              }
            >
              {label}
            </motion.span>
          ) : null}
        </div>
      </ReducedMotionConfig>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox as checkbox };
export { Checkbox };
