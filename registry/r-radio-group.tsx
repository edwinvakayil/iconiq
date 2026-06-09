"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const ringTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 22,
};

const dotMotion = {
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  initial: { scale: 0, opacity: 0 },
  transition: {
    type: "spring" as const,
    stiffness: 500,
    damping: 25,
    delay: 0.05,
  },
};

const textTransition = { duration: 0.2 };

type RadioOptionRowProps = {
  description?: string;
  descriptionId?: string;
  index: number;
  isSelected: boolean;
  label: string;
  labelId: string;
  value: string;
};

function RadioOptionRow({
  description,
  descriptionId,
  index,
  isSelected,
  label,
  labelId,
  value,
}: RadioOptionRowProps) {
  return (
    <RadioGroupPrimitive.Item asChild value={value}>
      <motion.button
        animate={{ opacity: 1, y: 0 }}
        aria-describedby={descriptionId}
        aria-labelledby={labelId}
        className="relative flex w-full touch-manipulation select-none items-center gap-3.5 rounded-lg px-4 py-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        initial={{ opacity: 0, y: 8 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        type="button"
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          aria-hidden
          className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center"
        >
          <motion.div
            animate={{
              borderWidth: isSelected ? 6 : 2,
              borderColor: isSelected
                ? "var(--ic-primary)"
                : "color-mix(in srgb, var(--ic-muted-foreground) 25%, transparent)",
            }}
            className="absolute inset-0 rounded-full"
            style={{ borderStyle: "solid" }}
            transition={ringTransition}
          />

          <AnimatePresence>
            {isSelected ? (
              <motion.div
                animate={dotMotion.animate}
                className="absolute h-1.5 w-1.5 rounded-full bg-background"
                exit={dotMotion.exit}
                initial={dotMotion.initial}
                transition={dotMotion.transition}
              />
            ) : null}
          </AnimatePresence>
        </div>

        <div className="relative z-10 flex flex-col gap-0.5">
          <motion.span
            animate={{
              color: isSelected
                ? "var(--ic-foreground)"
                : "var(--ic-muted-foreground)",
              fontWeight: isSelected ? 500 : 400,
            }}
            className="text-[14px] leading-tight"
            id={labelId}
            transition={textTransition}
          >
            {label}
          </motion.span>

          {description ? (
            <motion.span
              animate={{ opacity: isSelected ? 0.85 : 0.5 }}
              className="text-muted-foreground/60 text-xs leading-snug"
              id={descriptionId}
              transition={textTransition}
            >
              {description}
            </motion.span>
          ) : null}
        </div>
      </motion.button>
    </RadioGroupPrimitive.Item>
  );
}

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

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      className,
      defaultValue,
      name,
      onChange,
      options,
      value,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const isControlled = value !== undefined;
    const [uncontrolledSelected, setUncontrolledSelected] = React.useState<
      string | undefined
    >(() => getValidSelection(options, defaultValue));
    const selected = isControlled ? value : uncontrolledSelected;
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

    if (options.length === 0) {
      return null;
    }

    return (
      <RadioGroupPrimitive.Root
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          componentThemeClassName,
          "flex flex-col gap-0.5",
          className
        )}
        name={groupName}
        onValueChange={handleSelect}
        orientation="vertical"
        ref={ref}
        value={selected}
      >
        {options.map((option, index) => {
          const optionId = `${generatedId}-option-${index}`;

          return (
            <RadioOptionRow
              description={option.description}
              descriptionId={
                option.description ? `${optionId}-description` : undefined
              }
              index={index}
              isSelected={selected === option.value}
              key={option.value}
              label={option.label}
              labelId={`${optionId}-label`}
              value={option.value}
            />
          );
        })}
      </RadioGroupPrimitive.Root>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup as radioGroup };
export { RadioGroup };
export default RadioGroup;
