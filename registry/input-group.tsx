"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface InputgroupsProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onSuffixClick?: () => void;
}

function hasFieldValue(value: React.ComponentProps<"input">["value"]) {
  return value !== undefined && value !== null && String(value).length > 0;
}

function Inputgroups({
  className,
  label,
  error,
  id,
  prefixIcon,
  suffixIcon,
  onSuffixClick,
  ...props
}: InputgroupsProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(
    () => hasFieldValue(props.value) || hasFieldValue(props.defaultValue)
  );
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isActive = isFocused || hasValue;

  React.useEffect(() => {
    const currentValue = inputRef.current?.value;
    setHasValue(
      hasFieldValue(props.value) ||
        hasFieldValue(currentValue) ||
        hasFieldValue(props.defaultValue)
    );
  }, [props.value, props.defaultValue]);

  const handleContainerMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const target = event.target as HTMLElement;

    if (target === inputRef.current || target.closest("button")) {
      return;
    }

    event.preventDefault();
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div
        className="group relative flex cursor-text items-center gap-3 pt-5 pb-2"
        onMouseDown={handleContainerMouseDown}
      >
        {/* Prefix Icon */}
        {prefixIcon && (
          <motion.div
            animate={{
              color: isFocused
                ? "var(--color-foreground)"
                : "var(--color-muted-foreground)",
              scale: isFocused ? 1.05 : 1,
            }}
            className="flex-shrink-0 [&>svg]:size-5"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            {prefixIcon}
          </motion.div>
        )}

        <div className="relative flex-1">
          {/* Floating Label */}
          <motion.label
            animate={{
              y: isActive ? -18 : 0,
              scale: isActive ? 0.85 : 1,
              color: error
                ? "var(--color-destructive)"
                : isFocused
                  ? "var(--color-foreground)"
                  : "var(--color-muted-foreground)",
            }}
            className="pointer-events-none absolute top-0 left-0 origin-left cursor-text font-medium text-sm"
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
            className={cn(
              "w-full min-w-0 bg-transparent text-base outline-none",
              "placeholder:text-transparent focus:placeholder:text-muted-foreground/60",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "md:text-sm",
              className
            )}
            data-slot="input"
            id={inputId}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(hasFieldValue(e.target.value));
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(hasFieldValue(e.target.value));
              props.onChange?.(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            ref={inputRef}
            {...props}
          />
        </div>

        {/* Suffix Icon */}
        {suffixIcon && (
          <motion.button
            animate={{
              color: isFocused
                ? "var(--color-foreground)"
                : "var(--color-muted-foreground)",
              scale: isFocused ? 1.05 : 1,
            }}
            className="flex-shrink-0 cursor-pointer [&>svg]:size-5"
            onClick={(e) => {
              e.stopPropagation();
              onSuffixClick?.();
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {suffixIcon}
          </motion.button>
        )}

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
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 font-medium text-destructive text-xs"
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: -4 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
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

export { Inputgroups, InputGroup };
