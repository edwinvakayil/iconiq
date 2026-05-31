"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import {
  ReducedMotionConfig,
  type ReducedMotionProp,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

interface InputGroupFieldProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onSuffixClick?: () => void;
  suffixLabel?: string;
  suffixButtonProps?: Omit<
    React.ComponentProps<"button">,
    "onDrag" | "onDragEnd" | "onDragStart"
  >;
}

function hasFieldValue(value: React.ComponentProps<"input">["value"]) {
  return value !== undefined && value !== null && String(value).length > 0;
}

function mergeIds(...ids: Array<string | undefined>) {
  const mergedIds = ids.filter(Boolean);
  return mergedIds.length > 0 ? mergedIds.join(" ") : undefined;
}

function getFieldCursorClass({
  isDisabled,
  isReadOnly,
}: {
  isDisabled: boolean;
  isReadOnly: boolean;
}) {
  if (isDisabled) {
    return "cursor-not-allowed opacity-50";
  }

  if (isReadOnly) {
    return "cursor-default";
  }

  return "cursor-text";
}

function getLabelCursorClass({
  isDisabled,
  isReadOnly,
}: {
  isDisabled: boolean;
  isReadOnly: boolean;
}) {
  if (isDisabled) {
    return "cursor-not-allowed";
  }

  if (isReadOnly) {
    return "cursor-default";
  }

  return "cursor-text";
}

function getFieldAccentColor({
  hasError,
  isDisabled,
  isFocused,
}: {
  hasError: boolean;
  isDisabled: boolean;
  isFocused: boolean;
}) {
  if (isDisabled) {
    return "var(--color-muted-foreground)";
  }

  if (hasError) {
    return "var(--color-destructive)";
  }

  if (isFocused) {
    return "var(--color-foreground)";
  }

  return "var(--color-muted-foreground)";
}

function getFocusScale(isFocused: boolean, isDisabled: boolean) {
  return isFocused && !isDisabled ? 1.05 : 1;
}

function shouldDelegateFocus(
  target: HTMLElement,
  input: HTMLInputElement | null
) {
  return !(target === input || target.closest("button, input, a"));
}

function PrefixIconSlot({
  children,
  color,
  scale,
}: {
  children?: React.ReactNode;
  color: string;
  scale: number;
}) {
  if (!children) {
    return null;
  }

  return (
    <motion.div
      animate={{ color, scale }}
      className="flex-shrink-0 [&>svg]:size-5"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}

function SuffixActionButton({
  color,
  icon,
  isDisabled,
  isFocused,
  onSuffixClick,
  suffixButtonProps,
  suffixLabel,
}: {
  color: string;
  icon?: React.ReactNode;
  isDisabled: boolean;
  isFocused: boolean;
  onSuffixClick?: () => void;
  suffixButtonProps?: InputGroupFieldProps["suffixButtonProps"];
  suffixLabel?: string;
}) {
  if (!icon) {
    return null;
  }

  const { className, disabled, onClick, onPointerDown, ...buttonProps } =
    suffixButtonProps ?? {};
  const isButtonDisabled = isDisabled || Boolean(disabled);
  const accessibleLabel = suffixButtonProps?.["aria-label"] ?? suffixLabel;

  return (
    <motion.div
      animate={{
        color,
        scale: getFocusScale(isFocused, isButtonDisabled),
      }}
      className="shrink-0"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      whileHover={isButtonDisabled ? undefined : { scale: 1.05 }}
      whileTap={isButtonDisabled ? undefined : { scale: 0.96 }}
    >
      <button
        {...buttonProps}
        aria-label={accessibleLabel}
        className={cn(
          "flex size-10 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>svg]:size-5",
          isButtonDisabled ? "cursor-not-allowed" : "cursor-pointer",
          className
        )}
        disabled={isButtonDisabled}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(event);
          onSuffixClick?.();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          onPointerDown?.(event);
          if (!(event.defaultPrevented || isButtonDisabled)) {
            event.preventDefault();
          }
        }}
        type="button"
      >
        {icon}
      </button>
    </motion.div>
  );
}

function ErrorMessage({ error, errorId }: { error?: string; errorId: string }) {
  return (
    <AnimatePresence initial={false}>
      {error ? (
        <motion.div
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden"
          exit={{ height: 0, opacity: 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <motion.p
            animate={{ y: 0 }}
            aria-live="polite"
            className="pt-1.5 font-medium text-destructive text-xs"
            exit={{ y: -4 }}
            id={errorId}
            initial={{ y: -4 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            {error}
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function InputGroupField({
  className,
  label,
  error,
  id,
  prefixIcon,
  suffixIcon,
  onSuffixClick,
  suffixLabel,
  suffixButtonProps,
  disabled,
  readOnly,
  value,
  defaultValue,
  onBlur,
  onChange,
  onFocus,
  "aria-describedby": ariaDescribedBy,
  "aria-errormessage": ariaErrorMessage,
  "aria-invalid": ariaInvalid,
  ...props
}: InputGroupFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(
    () => hasFieldValue(value) || hasFieldValue(defaultValue)
  );
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isDisabled = Boolean(disabled);
  const isReadOnly = Boolean(readOnly);
  const hasError = Boolean(error);
  const isActive = isFocused || hasValue;
  const describedBy = mergeIds(ariaDescribedBy, hasError ? errorId : undefined);
  const errorMessage = mergeIds(
    ariaErrorMessage,
    hasError ? errorId : undefined
  );
  const fieldCursorClass = getFieldCursorClass({ isDisabled, isReadOnly });
  const labelCursorClass = getLabelCursorClass({ isDisabled, isReadOnly });
  const iconColor = getFieldAccentColor({
    hasError,
    isDisabled,
    isFocused,
  });
  const labelColor = getFieldAccentColor({
    hasError,
    isDisabled: false,
    isFocused,
  });

  React.useEffect(() => {
    const currentValue = inputRef.current?.value;
    setHasValue(
      hasFieldValue(value) ||
        hasFieldValue(currentValue) ||
        hasFieldValue(defaultValue)
    );
  }, [defaultValue, value]);

  const handleContainerPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (isDisabled) {
      return;
    }

    const target = event.target as HTMLElement;

    if (!shouldDelegateFocus(target, inputRef.current)) {
      return;
    }

    event.preventDefault();
    inputRef.current?.focus();
  };

  return (
    <div className={cn(componentThemeClassName, "relative w-full")}>
      <div
        className={cn(
          "group relative flex items-center gap-3 pt-5 pb-2 transition-opacity",
          fieldCursorClass
        )}
        data-disabled={isDisabled ? "true" : undefined}
        data-readonly={isReadOnly ? "true" : undefined}
        onPointerDown={handleContainerPointerDown}
      >
        {/* Prefix Icon */}
        <PrefixIconSlot
          color={iconColor}
          scale={getFocusScale(isFocused, isDisabled)}
        >
          {prefixIcon}
        </PrefixIconSlot>

        <div className="relative flex-1">
          {/* Floating Label */}
          <motion.label
            animate={{
              y: isActive ? -18 : 0,
              scale: isActive ? 0.85 : 1,
              color: labelColor,
            }}
            className={cn(
              "pointer-events-none absolute top-0 left-0 origin-left font-medium text-sm",
              labelCursorClass
            )}
            htmlFor={inputId}
            initial={false}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            {label}
          </motion.label>

          <input
            {...props}
            aria-describedby={describedBy}
            aria-errormessage={hasError ? errorMessage : ariaErrorMessage}
            aria-invalid={hasError ? true : ariaInvalid}
            className={cn(
              "w-full min-w-0 bg-transparent text-base outline-none",
              "placeholder:text-transparent focus:placeholder:text-muted-foreground/60",
              "disabled:pointer-events-none disabled:cursor-not-allowed",
              "read-only:cursor-default",
              "md:text-sm",
              className
            )}
            data-slot="input"
            defaultValue={defaultValue}
            disabled={disabled}
            id={inputId}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(hasFieldValue(e.target.value));
              onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(hasFieldValue(e.target.value));
              onChange?.(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            readOnly={readOnly}
            ref={inputRef}
            value={value}
          />
        </div>

        {/* Suffix Icon */}
        <SuffixActionButton
          color={iconColor}
          icon={suffixIcon}
          isDisabled={isDisabled}
          isFocused={isFocused}
          onSuffixClick={onSuffixClick}
          suffixButtonProps={suffixButtonProps}
          suffixLabel={suffixLabel}
        />

        {/* Bottom border - static base */}
        <div
          className={cn(
            "absolute right-0 bottom-0 left-0 h-px",
            error ? "bg-destructive/30" : "bg-border"
          )}
        />

        {/* Bottom border - animated active state from center */}
        <motion.div
          animate={{
            width: isFocused ? "100%" : "0%",
            opacity: isFocused ? 1 : 0,
          }}
          className={cn(
            "absolute bottom-0 left-1/2 h-[1.5px] -translate-x-1/2",
            error ? "bg-destructive" : "bg-foreground"
          )}
          initial={{ width: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 22,
          }}
        />
      </div>

      {/* Error message */}
      <ErrorMessage error={error} errorId={errorId} />
    </div>
  );
}

interface InputGroupProps
  extends React.ComponentProps<"div">,
    ReducedMotionProp {
  children: React.ReactNode;
}

function InputGroup({
  className,
  children,
  reducedMotion,
  ...props
}: InputGroupProps) {
  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <div
        className={cn(
          componentThemeClassName,
          "flex w-full flex-col gap-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ReducedMotionConfig>
  );
}

const Inputgroups = InputGroupField;

export { InputGroupField, Inputgroups, InputGroup };
