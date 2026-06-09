"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

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

function normalizeCheckedState(
  nextChecked: boolean | "indeterminate"
): boolean {
  return nextChecked === true;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    { checked, className, defaultChecked = false, id, label, onCheckedChange },
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
            transition={boxTransition}
            type="button"
            whileTap={{ scale: 0.88 }}
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
