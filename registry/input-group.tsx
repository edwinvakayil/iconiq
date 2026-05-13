"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

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
    <div className="relative w-full">
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

interface InputGroupProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

function InputGroup({ className, children, ...props }: InputGroupProps) {
  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      {children}
    </div>
  );
}

const Inputgroups = InputGroupField;

export { InputGroupField, Inputgroups, InputGroup };
