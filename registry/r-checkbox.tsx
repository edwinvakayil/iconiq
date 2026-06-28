"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const boxTransition = { type: "spring", stiffness: 500, damping: 30 } as const;
const instantTransition = { duration: 0 } as const;
const labelTransition = { duration: 0.2 } as const;

const checkmarkVariants = {
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.3, ease: [0.65, 0, 0.35, 1] },
      opacity: { duration: 0.05, delay: 0.06 },
    },
  },
  unchecked: {
    pathLength: 0,
    opacity: 0,
    transition: {
      pathLength: { duration: 0.25, ease: [0.65, 0, 0.35, 1] },
      opacity: { duration: 0.1, delay: 0.18 },
    },
  },
} as const;

const minusVariants = {
  indeterminate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.2, ease: [0.65, 0, 0.35, 1] },
      opacity: { duration: 0.05, delay: 0.06 },
    },
  },
  unchecked: {
    pathLength: 0,
    opacity: 0,
    transition: {
      pathLength: { duration: 0.2, ease: [0.65, 0, 0.35, 1] },
      opacity: { duration: 0.1, delay: 0.12 },
    },
  },
} as const;

const reducedCheckmarkVariants = {
  checked: { pathLength: 1, opacity: 1 },
  unchecked: { pathLength: 0, opacity: 0 },
} as const;

const reducedMinusVariants = {
  indeterminate: { pathLength: 1, opacity: 1 },
  unchecked: { pathLength: 0, opacity: 0 },
} as const;

export type CheckboxCheckedState = boolean | "indeterminate";
export type CheckboxSize = "default" | "lg" | "sm";

const sizeStyles: Record<
  CheckboxSize,
  { box: string; gap: string; icon: string; label: string }
> = {
  sm: {
    box: "h-4 w-4",
    gap: "gap-2",
    icon: "h-3 w-3",
    label: "text-xs",
  },
  default: {
    box: "h-5 w-5",
    gap: "gap-3",
    icon: "h-3.5 w-3.5",
    label: "text-sm",
  },
  lg: {
    box: "h-6 w-6",
    gap: "gap-3.5",
    icon: "h-4 w-4",
    label: "text-base",
  },
};

export interface CheckboxProps {
  checked?: CheckboxCheckedState;
  className?: string;
  defaultChecked?: CheckboxCheckedState;
  description?: React.ReactNode;
  descriptionClassName?: string;
  disabled?: boolean;
  form?: string;
  id?: string;
  invalid?: boolean;
  label?: React.ReactNode;
  labelClassName?: string;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  readOnly?: boolean;
  required?: boolean;
  size?: CheckboxSize;
  value?: string;
}

type CheckboxVisualState = {
  checked: boolean;
  indeterminate: boolean;
};

type IndicatorVisualState = "checked" | "indeterminate" | "unchecked";

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function parseCheckedState(state: CheckboxCheckedState | undefined) {
  if (state === "indeterminate") {
    return {
      checked: false,
      indeterminate: true,
    } satisfies CheckboxVisualState;
  }

  return {
    checked: Boolean(state),
    indeterminate: false,
  } satisfies CheckboxVisualState;
}

function getIndicatorState(state: CheckboxVisualState): IndicatorVisualState {
  if (state.indeterminate) {
    return "indeterminate";
  }

  return state.checked ? "checked" : "unchecked";
}

function toRadixChecked(state: CheckboxVisualState) {
  if (state.indeterminate) {
    return "indeterminate" as const;
  }

  return state.checked;
}

function getBoxColors(isFilled: boolean, invalid: boolean) {
  const backgroundColor = isFilled
    ? "var(--color-foreground)"
    : "var(--color-background)";

  if (invalid) {
    return { backgroundColor, borderColor: "var(--color-destructive)" };
  }

  const borderColor = isFilled
    ? "var(--color-foreground)"
    : "var(--color-border)";

  return { backgroundColor, borderColor };
}

function getTapScale(
  disabled: boolean,
  readOnly: boolean,
  prefersReducedMotion: boolean
) {
  if (disabled || readOnly || prefersReducedMotion) {
    return undefined;
  }

  return { scale: 0.88 };
}

function getRowClassName({
  className,
  disabled,
  gapClassName,
  hasText,
  readOnly,
}: {
  className?: string;
  disabled: boolean;
  gapClassName: string;
  hasText: boolean;
  readOnly: boolean;
}) {
  return cn(
    componentThemeClassName,
    "inline-flex select-none items-start",
    gapClassName,
    hasText && "cursor-pointer",
    disabled && "cursor-not-allowed opacity-50",
    readOnly && !disabled && "cursor-default",
    className
  );
}

function preventReadOnlyToggle(event: React.SyntheticEvent) {
  event.preventDefault();
}

function CheckboxIndicatorIcon({
  iconClassName,
  indicatorState,
  prefersReducedMotion,
}: {
  iconClassName: string;
  indicatorState: IndicatorVisualState;
  prefersReducedMotion: boolean;
}) {
  const checkVariants = prefersReducedMotion
    ? reducedCheckmarkVariants
    : checkmarkVariants;
  const dashVariants = prefersReducedMotion
    ? reducedMinusVariants
    : minusVariants;

  return (
    <motion.svg
      aria-hidden
      className={iconClassName}
      fill="none"
      initial={false}
      stroke="var(--color-background)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      viewBox="0 0 24 24"
    >
      <motion.path
        animate={indicatorState === "checked" ? "checked" : "unchecked"}
        d="M5 12.5l4.5 4.5L19 7.5"
        variants={checkVariants}
      />
      <motion.path
        animate={
          indicatorState === "indeterminate" ? "indeterminate" : "unchecked"
        }
        d="M7 12h10"
        variants={dashVariants}
      />
    </motion.svg>
  );
}

function CheckboxFieldText({
  description,
  descriptionClassName,
  descriptionId,
  label,
  labelClassName,
  labelId,
  labelMotionTransition,
  labelSizeClassName,
  required,
  visual,
}: {
  description?: React.ReactNode;
  descriptionClassName?: string;
  descriptionId?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  labelId?: string;
  labelMotionTransition: typeof labelTransition | typeof instantTransition;
  labelSizeClassName: string;
  required: boolean;
  visual: CheckboxVisualState;
}) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5 pt-px">
      {label ? (
        <motion.span
          animate={{ opacity: visual.checked ? 0.55 : 1 }}
          className={cn("text-foreground", labelSizeClassName, labelClassName)}
          id={labelId}
          transition={labelMotionTransition}
        >
          {label}
          {required ? (
            <span aria-hidden className="text-destructive">
              {" "}
              *
            </span>
          ) : null}
        </motion.span>
      ) : null}
      {description ? (
        <span
          className={cn(
            "text-muted-foreground text-xs leading-snug",
            descriptionClassName
          )}
          id={descriptionId}
        >
          {description}
        </span>
      ) : null}
    </span>
  );
}

function RadixCheckboxControl({
  controlId,
  descriptionId,
  disabled,
  form,
  indicatorState,
  invalid,
  isFilled,
  labelId,
  motionTransition,
  name,
  onCheckedChange,
  prefersReducedMotion,
  readOnly,
  ref,
  required,
  sizing,
  value,
  visual,
}: {
  controlId: string;
  descriptionId?: string;
  disabled: boolean;
  form?: string;
  indicatorState: IndicatorVisualState;
  invalid: boolean;
  isFilled: boolean;
  labelId?: string;
  motionTransition: typeof boxTransition | typeof instantTransition;
  name?: string;
  onCheckedChange: (nextChecked: boolean | "indeterminate") => void;
  prefersReducedMotion: boolean;
  readOnly: boolean;
  ref: React.ForwardedRef<HTMLButtonElement>;
  required: boolean;
  sizing: (typeof sizeStyles)[CheckboxSize];
  value?: string;
  visual: CheckboxVisualState;
}) {
  const boxColors = getBoxColors(isFilled, invalid);
  const tapScale = getTapScale(disabled, readOnly, prefersReducedMotion);

  return (
    <CheckboxPrimitive.Root
      asChild
      checked={toRadixChecked(visual)}
      disabled={disabled}
      form={form}
      id={controlId}
      name={name}
      onCheckedChange={onCheckedChange}
      required={required}
      value={value}
    >
      <motion.button
        animate={boxColors}
        aria-describedby={descriptionId}
        aria-invalid={invalid || undefined}
        aria-labelledby={labelId}
        aria-readonly={readOnly || undefined}
        className={cn(
          "relative mt-0.5 flex shrink-0 items-center justify-center rounded border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed",
          sizing.box
        )}
        initial={false}
        onClick={readOnly ? preventReadOnlyToggle : undefined}
        onKeyDown={
          readOnly
            ? (event) => {
                if (event.key === " " || event.key === "Enter") {
                  preventReadOnlyToggle(event);
                }
              }
            : undefined
        }
        ref={(node) => {
          setRef(ref, node);
        }}
        transition={motionTransition}
        type="button"
        whileTap={tapScale}
      >
        <CheckboxPrimitive.Indicator asChild forceMount>
          <CheckboxIndicatorIcon
            iconClassName={sizing.icon}
            indicatorState={indicatorState}
            prefersReducedMotion={prefersReducedMotion}
          />
        </CheckboxPrimitive.Indicator>
      </motion.button>
    </CheckboxPrimitive.Root>
  );
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked,
      className,
      defaultChecked = false,
      description,
      descriptionClassName,
      disabled = false,
      form,
      id,
      invalid = false,
      label,
      labelClassName,
      name,
      onCheckedChange,
      readOnly = false,
      required = false,
      size = "default",
      value,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const controlId = id ?? generatedId;
    const labelId = label ? `${controlId}-label` : undefined;
    const descriptionId = description ? `${controlId}-description` : undefined;
    const prefersReducedMotion = useReducedMotion() === true;
    const sizing = sizeStyles[size];
    const [internal, setInternal] = React.useState<CheckboxVisualState>(() =>
      parseCheckedState(defaultChecked)
    );
    const isControlled = checked !== undefined;
    const visual = isControlled ? parseCheckedState(checked) : internal;
    const indicatorState = getIndicatorState(visual);
    const isFilled = visual.indeterminate || visual.checked;
    const motionTransition = prefersReducedMotion
      ? instantTransition
      : boxTransition;
    const labelMotionTransition = prefersReducedMotion
      ? instantTransition
      : labelTransition;
    const hasText = Boolean(label || description);
    const Wrapper = hasText ? "label" : "div";

    const handleCheckedChange = React.useCallback(
      (nextChecked: boolean | "indeterminate") => {
        if (disabled || readOnly) {
          return;
        }

        if (!isControlled) {
          setInternal({
            checked: nextChecked === true,
            indeterminate: false,
          });
        }

        onCheckedChange?.(nextChecked === true);
      },
      [disabled, isControlled, onCheckedChange, readOnly]
    );

    return (
      <Wrapper
        className={getRowClassName({
          className,
          disabled,
          gapClassName: sizing.gap,
          hasText,
          readOnly,
        })}
        htmlFor={hasText ? controlId : undefined}
      >
        <RadixCheckboxControl
          controlId={controlId}
          descriptionId={descriptionId}
          disabled={disabled}
          form={form}
          indicatorState={indicatorState}
          invalid={invalid}
          isFilled={isFilled}
          labelId={labelId}
          motionTransition={motionTransition}
          name={name}
          onCheckedChange={handleCheckedChange}
          prefersReducedMotion={prefersReducedMotion}
          readOnly={readOnly}
          ref={ref}
          required={required}
          sizing={sizing}
          value={value}
          visual={visual}
        />

        {hasText ? (
          <CheckboxFieldText
            description={description}
            descriptionClassName={descriptionClassName}
            descriptionId={descriptionId}
            label={label}
            labelClassName={labelClassName}
            labelId={labelId}
            labelMotionTransition={labelMotionTransition}
            labelSizeClassName={sizing.label}
            required={required}
            visual={visual}
          />
        ) : null}
      </Wrapper>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox as checkbox };
export { Checkbox };
