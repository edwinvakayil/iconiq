"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  const [selected, setSelected] = React.useState(value ?? options[0]?.value);

  React.useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const handleSelect = (val: string) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div className={cn("flex flex-col gap-0.5", className)} role="radiogroup">
      {options.map((option, i) => {
        const isSelected = selected === option.value;
        return (
          <motion.button
            animate={{ opacity: 1, y: 0 }}
            aria-checked={isSelected}
            className="relative flex cursor-pointer items-center gap-3.5 rounded-lg px-4 py-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
            initial={{ opacity: 0, y: 8 }}
            key={option.value}
            onClick={() => handleSelect(option.value)}
            role="radio"
            transition={{ delay: i * 0.05, duration: 0.3 }}
            type="button"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Sliding background */}
            {isSelected && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-foreground/[0.04]"
                layoutId="radio-active-bg"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 28,
                  mass: 0.8,
                }}
              />
            )}

            {/* Radio circle */}
            <div className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
              {/* Outer ring */}
              <motion.div
                animate={{
                  borderWidth: isSelected ? 6 : 2,
                  borderColor: isSelected
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted-foreground) / 0.25)",
                }}
                className="absolute inset-0 rounded-full"
                style={{ borderStyle: "solid" }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              />
              {/* Inner white dot for contrast */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute h-1.5 w-1.5 rounded-full bg-background"
                    exit={{ scale: 0, opacity: 0 }}
                    initial={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                      delay: 0.05,
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Label */}
            <div className="relative z-10 flex flex-col gap-0.5">
              <motion.span
                animate={{
                  color: isSelected
                    ? "hsl(var(--foreground))"
                    : "hsl(var(--muted-foreground))",
                  fontWeight: isSelected ? 500 : 400,
                }}
                className="text-[14px] leading-tight"
                transition={{ duration: 0.2 }}
              >
                {option.label}
              </motion.span>
              {option.description && (
                <motion.span
                  animate={{ opacity: isSelected ? 0.85 : 0.5 }}
                  className="text-muted-foreground/60 text-xs leading-snug"
                  transition={{ duration: 0.2 }}
                >
                  {option.description}
                </motion.span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default RadioGroup;
