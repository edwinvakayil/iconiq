"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

const reducedTransition = { duration: 0.12 } as const;

function getRingTransition(reduceMotion: boolean) {
  if (reduceMotion) {
    return reducedTransition;
  }

  return {
    type: "spring" as const,
    stiffness: 400,
    damping: 22,
  };
}

function getDotMotion(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      initial: { opacity: 0 },
      transition: reducedTransition,
    };
  }

  return {
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
}

function getTextTransition(reduceMotion: boolean) {
  return reduceMotion ? reducedTransition : { duration: 0.2 };
}

function getRowTransition(reduceMotion: boolean, index: number) {
  return reduceMotion
    ? reducedTransition
    : { delay: index * 0.05, duration: 0.3 };
}

type RadioOptionRowProps = {
  description?: string;
  descriptionId?: string;
  index: number;
  isSelected: boolean;
  label: string;
  labelId: string;
  reduceMotion: boolean;
  value: string;
};

function RadioOptionRow({
  description,
  descriptionId,
  index,
  isSelected,
  label,
  labelId,
  reduceMotion,
  value,
}: RadioOptionRowProps) {
  const ringTransition = getRingTransition(reduceMotion);
  const dotMotion = getDotMotion(reduceMotion);
  const textTransition = getTextTransition(reduceMotion);

  return (
    <RadioGroupPrimitive.Item asChild value={value}>
      <motion.button
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        aria-describedby={descriptionId}
        aria-labelledby={labelId}
        className="relative flex w-full touch-manipulation select-none items-center gap-3.5 rounded-lg px-4 py-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        transition={getRowTransition(reduceMotion, index)}
        type="button"
        whileHover={reduceMotion ? undefined : { x: 2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      >
        <div
          aria-hidden
          className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center"
        >
          <motion.div
            animate={{
              borderWidth: isSelected ? 6 : 2,
              borderColor: isSelected
                ? "var(--primary)"
                : "color-mix(in srgb, var(--muted-foreground) 25%, transparent)",
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
                ? "var(--foreground)"
                : "var(--muted-foreground)",
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

export interface RadioGroupProps extends ReducedMotionProp {
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
      reducedMotion,
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
    const reduceMotion = useResolvedReducedMotion(reducedMotion);

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
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <RadioGroupPrimitive.Root
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn(registryTheme, "flex flex-col gap-0.5", className)}
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
                reduceMotion={reduceMotion}
                value={option.value}
              />
            );
          })}
        </RadioGroupPrimitive.Root>
      </ReducedMotionConfig>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup as radioGroup };
export { RadioGroup };
export default RadioGroup;
