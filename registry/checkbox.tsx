"use client";
import { motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  className,
  id,
}: CheckboxProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const value = isControlled ? checked : internal;

  const toggle = () => {
    const next = !value;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <label
      className={cn(
        componentThemeClassName,
        "inline-flex cursor-pointer select-none items-center gap-3",
        className
      )}
      htmlFor={id}
    >
      <input
        checked={value}
        className="sr-only"
        id={id}
        onChange={toggle}
        type="checkbox"
      />
      <motion.span
        animate={{
          backgroundColor: value
            ? "var(--color-foreground)"
            : "var(--color-background)",
          borderColor: value
            ? "var(--color-foreground)"
            : "var(--color-border)",
        }}
        aria-hidden
        className="relative flex h-5 w-5 items-center justify-center rounded border"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        whileTap={{ scale: 0.88 }}
      >
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
            variants={{
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
            }}
          />
        </motion.svg>
      </motion.span>
      {label && (
        <motion.span
          animate={{ opacity: value ? 0.55 : 1 }}
          className="text-foreground text-sm"
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      )}
    </label>
  );
}
