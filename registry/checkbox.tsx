"use client";
import { motion } from "motion/react";
import * as React from "react";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

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
        registryTheme,
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
