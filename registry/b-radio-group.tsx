"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const ringTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 22,
};

const instantTransition = { duration: 0 } as const;

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

export type RadioGroupOrientation = "horizontal" | "vertical";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  form?: string;
  invalid?: boolean;
  label?: string;
  labelClassName?: string;
  name?: string;
  orientation?: RadioGroupOrientation;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

function getFirstSelectableValue(options: RadioOption[]) {
  return options.find((option) => !option.disabled)?.value ?? options[0]?.value;
}

function isSelectableOption(options: RadioOption[], candidate: string) {
  const option = options.find((item) => item.value === candidate);
  return Boolean(option && !option.disabled);
}

function getValidSelection(
  options: RadioOption[],
  candidate?: string,
  groupDisabled = false
) {
  const fallback = groupDisabled
    ? options[0]?.value
    : getFirstSelectableValue(options);

  if (candidate === undefined) {
    return fallback;
  }

  if (groupDisabled) {
    return options.some((option) => option.value === candidate)
      ? candidate
      : fallback;
  }

  if (isSelectableOption(options, candidate)) {
    return candidate;
  }

  return fallback;
}

function resolveGroupValue(
  options: RadioOption[],
  candidate: string | undefined,
  allowFallback: boolean
) {
  if (
    candidate !== undefined &&
    options.some((option) => option.value === candidate)
  ) {
    return candidate;
  }

  return allowFallback ? getFirstSelectableValue(options) : undefined;
}

function getRingBorderColor(isSelected: boolean, invalid: boolean) {
  if (isSelected) {
    return "var(--ic-primary)";
  }

  if (invalid) {
    return "color-mix(in srgb, var(--ic-destructive) 45%, transparent)";
  }

  return "color-mix(in srgb, var(--ic-muted-foreground) 25%, transparent)";
}

function getRadioRowMotionConfig(index: number, prefersReducedMotion: boolean) {
  return {
    dotMotionTransition: prefersReducedMotion
      ? instantTransition
      : dotMotion.transition,
    entranceTransition: prefersReducedMotion
      ? instantTransition
      : { delay: index * 0.05, duration: 0.3 },
    labelMotionTransition: prefersReducedMotion
      ? instantTransition
      : textTransition,
    ringMotionTransition: prefersReducedMotion
      ? instantTransition
      : ringTransition,
  };
}

function getRadioRowClassName({
  invalid,
  orientation,
  rowDisabled,
}: {
  invalid: boolean;
  orientation: RadioGroupOrientation;
  rowDisabled: boolean;
}) {
  return cn(
    "relative flex touch-manipulation select-none items-center gap-3.5 rounded-lg py-3.5 text-left outline-none focus-visible:ring-2",
    orientation === "horizontal" ? "min-w-[10rem] flex-1" : "w-full",
    invalid ? "focus-visible:ring-destructive/40" : "focus-visible:ring-ring",
    rowDisabled && "cursor-not-allowed opacity-50"
  );
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

type BaseRadioRootRenderProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    ref?: React.Ref<HTMLButtonElement>;
  };

type RadioOptionIndicatorProps = {
  invalid: boolean;
  isSelected: boolean;
  prefersReducedMotion: boolean;
  ringMotionTransition: typeof ringTransition | typeof instantTransition;
  dotMotionTransition: typeof dotMotion.transition | typeof instantTransition;
};

function RadioOptionIndicator({
  invalid,
  isSelected,
  prefersReducedMotion,
  ringMotionTransition,
  dotMotionTransition,
}: RadioOptionIndicatorProps) {
  return (
    <div
      aria-hidden
      className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center"
    >
      <motion.div
        animate={{
          borderWidth: isSelected ? 6 : 2,
          borderColor: getRingBorderColor(isSelected, invalid),
        }}
        className="absolute inset-0 rounded-full"
        style={{ borderStyle: "solid" }}
        transition={ringMotionTransition}
      />

      <AnimatePresence>
        {isSelected ? (
          <motion.div
            animate={dotMotion.animate}
            className="absolute h-1.5 w-1.5 rounded-full bg-background"
            exit={prefersReducedMotion ? undefined : dotMotion.exit}
            initial={prefersReducedMotion ? false : dotMotion.initial}
            transition={dotMotionTransition}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type RadioOptionCopyProps = {
  description?: string;
  descriptionId?: string;
  isSelected: boolean;
  label: string;
  labelId: string;
  labelMotionTransition: typeof textTransition | typeof instantTransition;
};

function RadioOptionCopy({
  description,
  descriptionId,
  isSelected,
  label,
  labelId,
  labelMotionTransition,
}: RadioOptionCopyProps) {
  return (
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
        transition={labelMotionTransition}
      >
        {label}
      </motion.span>

      {description ? (
        <motion.span
          animate={{ opacity: isSelected ? 0.85 : 0.5 }}
          className="text-muted-foreground/60 text-xs leading-snug"
          id={descriptionId}
          transition={labelMotionTransition}
        >
          {description}
        </motion.span>
      ) : null}
    </div>
  );
}

type BaseRadioOptionButtonProps = {
  description?: string;
  descriptionId?: string;
  index: number;
  invalid: boolean;
  isSelected: boolean;
  label: string;
  labelId: string;
  orientation: RadioGroupOrientation;
  prefersReducedMotion: boolean;
  rowDisabled: boolean;
  rootProps: BaseRadioRootRenderProps;
};

function BaseRadioOptionButton({
  description,
  descriptionId,
  index,
  invalid,
  isSelected,
  label,
  labelId,
  orientation,
  prefersReducedMotion,
  rowDisabled,
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

  const rowInteractive = !rowDisabled;
  const motionConfig = getRadioRowMotionConfig(index, prefersReducedMotion);

  return (
    <motion.button
      {...resolvedRootProps}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        getRadioRowClassName({ invalid, orientation, rowDisabled }),
        rootClassName
      )}
      data-slot="radio-row"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      ref={(node) => {
        setRef(rootRef, node);
      }}
      transition={motionConfig.entranceTransition}
      type="button"
      whileHover={
        rowInteractive && !prefersReducedMotion ? { x: 2 } : undefined
      }
      whileTap={
        rowInteractive && !prefersReducedMotion ? { scale: 0.98 } : undefined
      }
    >
      <RadioOptionIndicator
        dotMotionTransition={motionConfig.dotMotionTransition}
        invalid={invalid}
        isSelected={isSelected}
        prefersReducedMotion={prefersReducedMotion}
        ringMotionTransition={motionConfig.ringMotionTransition}
      />

      <RadioOptionCopy
        description={description}
        descriptionId={descriptionId}
        isSelected={isSelected}
        label={label}
        labelId={labelId}
        labelMotionTransition={motionConfig.labelMotionTransition}
      />
    </motion.button>
  );
}

function RadioGroupLegend({
  groupLabelId,
  label,
  labelClassName,
  required,
}: {
  groupLabelId: string;
  label: string;
  labelClassName?: string;
  required?: boolean;
}) {
  return (
    <legend
      className={cn(
        "mb-0 block w-full max-w-full px-0 pt-0 font-medium text-foreground text-sm [margin-inline:0] [padding-inline:0]",
        labelClassName
      )}
      id={groupLabelId}
    >
      {label}
      {required ? (
        <span aria-hidden className="text-destructive">
          {" "}
          *
        </span>
      ) : null}
    </legend>
  );
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      className,
      defaultValue,
      disabled = false,
      form,
      invalid = false,
      label,
      labelClassName,
      name,
      onChange,
      options,
      orientation = "vertical",
      required,
      value,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const prefersReducedMotion = Boolean(useReducedMotion());
    const isControlled = value !== undefined;
    const [uncontrolledSelected, setUncontrolledSelected] = React.useState<
      string | undefined
    >(() => getValidSelection(options, defaultValue, disabled));
    const selected = isControlled ? value : uncontrolledSelected;
    const groupName = name ?? `radio-group-${generatedId}`;
    const groupLabelId = `${generatedId}-group-label`;
    const resolvedAriaLabelledBy = label ? groupLabelId : ariaLabelledBy;
    const resolvedAriaLabel =
      label || resolvedAriaLabelledBy ? undefined : ariaLabel;
    const primitiveValue = resolveGroupValue(options, selected, !isControlled);

    React.useEffect(() => {
      if (isControlled) {
        return;
      }

      const normalized = getValidSelection(
        options,
        uncontrolledSelected,
        disabled
      );

      if (normalized !== uncontrolledSelected) {
        setUncontrolledSelected(normalized);
      }
    }, [disabled, isControlled, options, uncontrolledSelected]);

    const handleSelect = React.useCallback(
      (nextValue: string) => {
        if (disabled || nextValue === selected) {
          return;
        }

        if (!isSelectableOption(options, nextValue)) {
          return;
        }

        if (!isControlled) {
          setUncontrolledSelected(nextValue);
        }

        onChange?.(nextValue);
      },
      [disabled, isControlled, onChange, options, selected]
    );

    if (options.length === 0) {
      return null;
    }

    return (
      <fieldset
        className="m-0 flex w-full min-w-0 flex-col gap-2 border-0 p-0 [padding-inline:0]"
        disabled={disabled || undefined}
      >
        {label ? (
          <RadioGroupLegend
            groupLabelId={groupLabelId}
            label={label}
            labelClassName={labelClassName}
            required={required}
          />
        ) : null}
        <div className="w-full min-w-0">
          <RadioGroupPrimitive
            aria-describedby={ariaDescribedBy}
            aria-invalid={invalid || undefined}
            aria-label={resolvedAriaLabel}
            aria-labelledby={resolvedAriaLabelledBy}
            aria-orientation={orientation}
            aria-required={required || undefined}
            className={cn(
              componentThemeClassName,
              orientation === "horizontal"
                ? "flex flex-row flex-wrap gap-2"
                : "flex flex-col gap-0.5",
              className
            )}
            disabled={disabled}
            form={form}
            name={groupName}
            onValueChange={handleSelect}
            ref={ref}
            required={required}
            value={primitiveValue}
          >
            {options.map((option, index) => {
              const isSelected = selected === option.value;
              const rowDisabled = disabled || Boolean(option.disabled);
              const optionId = `${generatedId}-option-${index}`;
              const labelId = `${optionId}-label`;
              const descriptionId = option.description
                ? `${optionId}-description`
                : undefined;

              return (
                <RadioPrimitive.Root
                  aria-describedby={descriptionId}
                  aria-labelledby={labelId}
                  disabled={rowDisabled}
                  key={`${option.value}-${index}`}
                  nativeButton
                  render={(rootProps) => (
                    <BaseRadioOptionButton
                      description={option.description}
                      descriptionId={descriptionId}
                      index={index}
                      invalid={invalid}
                      isSelected={isSelected}
                      label={option.label}
                      labelId={labelId}
                      orientation={orientation}
                      prefersReducedMotion={prefersReducedMotion}
                      rootProps={rootProps}
                      rowDisabled={rowDisabled}
                    />
                  )}
                  value={option.value}
                />
              );
            })}
          </RadioGroupPrimitive>
        </div>
      </fieldset>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup as radioGroup };
export { RadioGroup };
export default RadioGroup;
