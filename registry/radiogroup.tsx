"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

function getValidSelection(options: RadioOption[], candidate?: string) {
  if (candidate === undefined) {
    return options[0]?.value;
  }

  return options.some((option) => option.value === candidate)
    ? candidate
    : options[0]?.value;
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  layoutId?: string;
  name?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  defaultValue,
  layoutId,
  name,
  onChange,
  options,
  value,
}) => {
  const generatedId = React.useId();
  const isControlled = value !== undefined;
  const [uncontrolledSelected, setUncontrolledSelected] = React.useState<
    string | undefined
  >(() => getValidSelection(options, defaultValue));
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const selected = isControlled ? value : uncontrolledSelected;
  const resolvedLayoutId = layoutId ?? `radio-active-bg-${generatedId}`;
  const groupName = name ?? `radio-group-${generatedId}`;

  React.useEffect(() => {
    if (isControlled) {
      return;
    }

    const normalized = getValidSelection(options, uncontrolledSelected);

    if (normalized !== uncontrolledSelected) {
      setUncontrolledSelected(normalized);
    }
  }, [isControlled, options, uncontrolledSelected]);

  const handleSelect = React.useCallback(
    (nextValue: string) => {
      if (nextValue === selected) {
        return;
      }

      if (!isControlled) {
        setUncontrolledSelected(nextValue);
      }

      onChange?.(nextValue);
    },
    [isControlled, onChange, selected]
  );

  const focusAndSelect = React.useCallback(
    (index: number) => {
      const nextOption = options[index];

      if (!nextOption) {
        return;
      }

      inputRefs.current[index]?.focus();
      handleSelect(nextOption.value);
    },
    [handleSelect, options]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight": {
          event.preventDefault();
          focusAndSelect((index + 1) % options.length);
          break;
        }
        case "ArrowUp":
        case "ArrowLeft": {
          event.preventDefault();
          focusAndSelect((index - 1 + options.length) % options.length);
          break;
        }
        case "Home": {
          event.preventDefault();
          focusAndSelect(0);
          break;
        }
        case "End": {
          event.preventDefault();
          focusAndSelect(options.length - 1);
          break;
        }
        default:
          break;
      }
    },
    [focusAndSelect, options.length]
  );

  if (options.length === 0) {
    return null;
  }

  const tabStopValue = getValidSelection(options, selected);

  return (
    <div
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-orientation="vertical"
      className={cn("flex flex-col gap-0.5", className)}
      role="radiogroup"
    >
      {options.map((option, index) => {
        const isSelected = selected === option.value;
        const optionId = `${generatedId}-option-${index}`;
        const labelId = `${optionId}-label`;
        const descriptionId = option.description
          ? `${optionId}-description`
          : undefined;

        return (
          <motion.label
            animate={{ opacity: 1, y: 0 }}
            className="block cursor-pointer"
            initial={{ opacity: 0, y: 8 }}
            key={option.value}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              aria-describedby={descriptionId}
              aria-labelledby={labelId}
              checked={isSelected}
              className="peer sr-only"
              name={groupName}
              onChange={() => handleSelect(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(node) => {
                inputRefs.current[index] = node;
              }}
              tabIndex={option.value === tabStopValue ? 0 : -1}
              type="radio"
              value={option.value}
            />

            <div className="relative flex touch-manipulation select-none items-center gap-3.5 rounded-lg px-4 py-3.5 text-left outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
              {isSelected && (
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-lg bg-foreground/[0.04]"
                  layoutId={resolvedLayoutId}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 28,
                    mass: 0.8,
                  }}
                />
              )}

              <div
                aria-hidden
                className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center"
              >
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

              <div className="relative z-10 flex flex-col gap-0.5">
                <motion.span
                  animate={{
                    color: isSelected
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground))",
                    fontWeight: isSelected ? 500 : 400,
                  }}
                  className="text-[14px] leading-tight"
                  id={labelId}
                  transition={{ duration: 0.2 }}
                >
                  {option.label}
                </motion.span>

                {option.description && (
                  <motion.span
                    animate={{ opacity: isSelected ? 0.85 : 0.5 }}
                    className="text-muted-foreground/60 text-xs leading-snug"
                    id={descriptionId}
                    transition={{ duration: 0.2 }}
                  >
                    {option.description}
                  </motion.span>
                )}
              </div>
            </div>
          </motion.label>
        );
      })}
    </div>
  );
};

export default RadioGroup;
