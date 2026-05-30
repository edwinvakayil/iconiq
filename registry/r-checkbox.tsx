"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

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
            componentThemeClassName,
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
