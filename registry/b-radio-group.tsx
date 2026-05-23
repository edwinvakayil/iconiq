"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

function getValidSelection(options: RadioOption[], candidate?: string) {
  if (candidate === undefined) {
    return options[0]?.value;
  }

  return options.some((option) => option.value === candidate)
    ? candidate
    : options[0]?.value;
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

type BaseRadioRootRenderProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    ref?: React.Ref<HTMLButtonElement>;
  };

type RadioOptionContentProps = {
  description?: string;
  descriptionId?: string;
  isSelected: boolean;
  label: string;
  labelId: string;
  layoutId: string;
};

type BaseRadioOptionButtonProps = RadioOptionContentProps & {
  index: number;
  rootProps: BaseRadioRootRenderProps;
};

function RadioOptionContent({
  description,
  descriptionId,
  isSelected,
  label,
  labelId,
  layoutId,
}: RadioOptionContentProps) {
  return (
    <>
      {isSelected ? (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-lg bg-foreground/[0.04]"
          layoutId={layoutId}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 28,
            mass: 0.8,
          }}
        />
      ) : null}

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
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 22,
          }}
        />

        <AnimatePresence>
          {isSelected ? (
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
          ) : null}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-col gap-0.5">
        <motion.span
          animate={{
            color: isSelected ? "var(--foreground)" : "var(--muted-foreground)",
            fontWeight: isSelected ? 500 : 400,
          }}
          className="text-[14px] leading-tight"
          id={labelId}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>

        {description ? (
          <motion.span
            animate={{ opacity: isSelected ? 0.85 : 0.5 }}
            className="text-muted-foreground/60 text-xs leading-snug"
            id={descriptionId}
            transition={{ duration: 0.2 }}
          >
            {description}
          </motion.span>
        ) : null}
      </div>
    </>
  );
}

function BaseRadioOptionButton({
  description,
  descriptionId,
  index,
  isSelected,
  label,
  labelId,
  layoutId,
  rootProps,
}: BaseRadioOptionButtonProps) {
  const {
    className: rootClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: rootRef,
    ...resolvedRootProps
  } = rootProps;

  return (
    <motion.button
      {...resolvedRootProps}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex w-full touch-manipulation select-none items-center gap-3.5 rounded-lg px-4 py-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
        rootClassName
      )}
      initial={{ opacity: 0, y: 8 }}
      ref={(node) => {
        setRef(rootRef, node);
      }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      type="button"
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <RadioOptionContent
        description={description}
        descriptionId={descriptionId}
        isSelected={isSelected}
        label={label}
        labelId={labelId}
        layoutId={layoutId}
      />
    </motion.button>
  );
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      className,
      defaultValue,
      layoutId,
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

    if (options.length === 0) {
      return null;
    }

    return (
      <RadioGroupPrimitive
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(registryTheme, "flex flex-col gap-0.5", className)}
        name={groupName}
        onValueChange={handleSelect}
        ref={ref}
        value={selected}
      >
        {options.map((option, index) => {
          const isSelected = selected === option.value;
          const optionId = `${generatedId}-option-${index}`;
          const labelId = `${optionId}-label`;
          const descriptionId = option.description
            ? `${optionId}-description`
            : undefined;

          return (
            <RadioPrimitive.Root
              aria-describedby={descriptionId}
              aria-labelledby={labelId}
              key={option.value}
              nativeButton
              render={(rootProps) => (
                <BaseRadioOptionButton
                  description={option.description}
                  descriptionId={descriptionId}
                  index={index}
                  isSelected={isSelected}
                  label={option.label}
                  labelId={labelId}
                  layoutId={resolvedLayoutId}
                  rootProps={rootProps}
                />
              )}
              value={option.value}
            />
          );
        })}
      </RadioGroupPrimitive>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup as radioGroup };
export { RadioGroup };
export default RadioGroup;
