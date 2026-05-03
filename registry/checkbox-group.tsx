"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Soft settle — fluid, low bounce (water-like). */
const springFlow = {
  type: "spring" as const,
  stiffness: 280,
  damping: 24,
  mass: 0.65,
};

const springTap = {
  type: "spring" as const,
  stiffness: 520,
  damping: 36,
  mass: 0.35,
};

/** Snappy tick — must feel instant after click. */
const springCheck = {
  type: "spring" as const,
  stiffness: 720,
  damping: 34,
  mass: 0.38,
};

export interface CheckboxGroupOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxGroupOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

function CheckboxGroup({
  options,
  value = [],
  onChange,
  className,
}: CheckboxGroupProps) {
  const toggle = (optionValue: string) => {
    const next = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(next);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {options.map((option) => {
        const checked = value.includes(option.value);
        const disabled = option.disabled;

        return (
          <motion.button
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-left",
              "transition-[background-color] duration-480 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:bg-neutral-100/90 dark:hover:bg-neutral-800/50",
              "active:bg-neutral-100 dark:active:bg-neutral-800/78",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "disabled:active:bg-transparent disabled:hover:bg-transparent",
              "dark:disabled:active:bg-transparent dark:disabled:hover:bg-transparent"
            )}
            disabled={disabled}
            key={option.value}
            onClick={() => toggle(option.value)}
            transition={springTap}
            type="button"
            whileTap={
              disabled
                ? undefined
                : {
                    scale: 0.985,
                    y: 0,
                    transition: springTap,
                  }
            }
          >
            <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
              <motion.div
                className={cn(
                  "flex h-[18px] w-[18px] items-center justify-center rounded transition-[border-color] duration-420 ease-[cubic-bezier(0.25,0.85,0.3,1)]",
                  checked
                    ? "border-0 bg-transparent"
                    : [
                        "border-2 bg-transparent",
                        "border-neutral-300/90 group-hover:border-neutral-500/85",
                        "dark:border-neutral-600 dark:group-hover:border-neutral-400",
                      ]
                )}
                layout="position"
                transition={springFlow}
              >
                <AnimatePresence initial={false} mode="sync">
                  {checked ? (
                    <motion.div
                      animate={{
                        opacity: 1,
                        rotate: 0,
                        scale: 1,
                      }}
                      className="flex items-center justify-center"
                      exit={{
                        opacity: 0,
                        rotate: -8,
                        scale: 0.86,
                        transition: {
                          duration: 0.12,
                          ease: [0.4, 0, 1, 1],
                        },
                      }}
                      initial={{
                        opacity: 0.92,
                        rotate: -5,
                        scale: 0.78,
                      }}
                      key="check"
                      transition={springCheck}
                    >
                      <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </div>

            <div
              className={cn(
                "flex min-w-0 flex-col transition-transform duration-520 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:translate-x-0.5"
              )}
            >
              <span className="font-medium text-foreground text-sm">
                {option.label}
              </span>
              {option.description && (
                <span className="text-muted-foreground text-xs">
                  {option.description}
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export { CheckboxGroup };
