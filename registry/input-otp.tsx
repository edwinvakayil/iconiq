"use client";

import type { OTPFieldInput, OTPFieldRoot } from "@base-ui/react/otp-field";
import { OTPFieldPreview as OTPField } from "@base-ui/react/otp-field";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-[min(var(--radius-md),12px)] supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[14px]";

const otpGroupClassName =
  "flex w-full max-w-full items-center justify-center gap-2 sm:gap-3";

const otpSlotBaseClassName =
  "relative flex size-11 shrink-0 items-center justify-center overflow-hidden border-2 font-medium text-lg tabular-nums sm:size-14 sm:text-xl";

const otpPlaceholderSlotBaseClassName =
  "size-11 shrink-0 overflow-hidden border-2 border-border bg-background sm:size-14";

const OTPLengthContext = React.createContext(6);

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
  mass: 0.8,
};

const charSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

type OTPProps = React.ComponentPropsWithoutRef<typeof OTPField.Root> & {
  containerClassName?: string;
  /** @deprecated Use `length` instead. */
  maxLength?: number;
};

const otpRootBaseClassName =
  "flex w-full max-w-full items-center justify-center gap-2 data-disabled:opacity-50 sm:gap-3";

function resolveRootClassName(
  className: OTPProps["className"],
  containerClassName?: string
) {
  const baseClassName = cn(otpRootBaseClassName, containerClassName);

  if (typeof className === "function") {
    return (state: OTPFieldRoot.State) => cn(baseClassName, className(state));
  }

  return cn(baseClassName, className);
}

function resolvePlaceholderClassName(className: OTPProps["className"]) {
  return typeof className === "function" ? undefined : className;
}

function OTPPlaceholder({
  className,
  containerClassName,
  length,
  placeholderRef,
}: {
  className?: string;
  containerClassName?: string;
  length: number;
  placeholderRef: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      aria-hidden
      className={cn(otpGroupClassName, containerClassName, className)}
      ref={placeholderRef}
    >
      <div className={otpGroupClassName}>
        {Array.from({ length }, (_, index) => (
          <div
            className={cn(
              controlCornerClassName,
              otpPlaceholderSlotBaseClassName
            )}
            key={`otp-placeholder-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

const OTP = React.forwardRef<HTMLDivElement, OTPProps>(
  (
    { children, className, containerClassName, length, maxLength, ...props },
    ref
  ) => {
    const [mounted, setMounted] = React.useState(false);
    const resolvedLength = length ?? maxLength ?? 6;

    React.useEffect(() => {
      setMounted(true);
    }, []);

    return (
      <OTPLengthContext.Provider value={resolvedLength}>
        {mounted ? (
          <OTPField.Root
            className={resolveRootClassName(className, containerClassName)}
            length={resolvedLength}
            ref={ref}
            {...props}
          >
            {children}
          </OTPField.Root>
        ) : (
          <OTPPlaceholder
            className={resolvePlaceholderClassName(className)}
            containerClassName={containerClassName}
            length={resolvedLength}
            placeholderRef={ref}
          />
        )}
      </OTPLengthContext.Provider>
    );
  }
);
OTP.displayName = "OTP";

const OTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div className={cn(otpGroupClassName, className)} ref={ref} {...props} />
));
OTPGroup.displayName = "OTPGroup";

type OTPSlotsProps = {
  className?: string;
  /** Inserts `OTPSeparator` before the slot at this zero-based index. */
  separatorAfter?: number;
  slotClassName?: string;
};

function OTPSlots({ className, separatorAfter, slotClassName }: OTPSlotsProps) {
  const length = React.useContext(OTPLengthContext);

  return (
    <OTPGroup className={className}>
      {Array.from({ length }, (_, index) => (
        <React.Fragment key={`otp-slot-${index}`}>
          {separatorAfter === index ? <OTPSeparator /> : null}
          <OTPSlot
            aria-label={
              index === 0 ? undefined : `Character ${index + 1} of ${length}`
            }
            className={slotClassName}
          />
        </React.Fragment>
      ))}
    </OTPGroup>
  );
}

type OTPSlotProps = React.ComponentPropsWithoutRef<typeof OTPField.Input> & {
  /** Ignored. Slot order is determined by render order with Base UI OTP Field. */
  index?: number;
};

type OTPSlotInputProps = React.ComponentPropsWithoutRef<"input"> & {
  ref?: React.Ref<HTMLInputElement>;
};

type OTPSlotState = OTPFieldInput.State;

function resolveSlotClassName(
  className: OTPSlotProps["className"],
  state: OTPSlotState
) {
  return typeof className === "function" ? className(state) : className;
}

function OTPSlotCharacter({ char, index }: { char: string; index: number }) {
  return (
    <motion.span
      animate={{ opacity: 1, y: 0, scale: 1 }}
      aria-hidden
      className="pointer-events-none inline-block select-none"
      exit={{ opacity: 0, y: -12, scale: 0.7 }}
      initial={{ opacity: 0, y: 12, scale: 0.7 }}
      key={`${index}-${char}`}
      transition={charSpring}
    >
      {char}
    </motion.span>
  );
}

function OTPSlotCaret() {
  return (
    <motion.div
      animate={{
        opacity: 1,
        scaleY: 1,
        transition: {
          opacity: { duration: 0.15 },
          scaleY: {
            type: "spring" as const,
            stiffness: 400,
            damping: 25,
          },
        },
      }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.1 } }}
      initial={{ opacity: 0, scaleY: 0 }}
    >
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        className="h-5 w-[2px] rounded-full bg-primary sm:h-6"
        transition={{
          duration: 1.2,
          ease: "easeInOut" as const,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </motion.div>
  );
}

function OTPSlotSurface({
  className,
  inputClassName,
  inputRef,
  inputProps,
  slotRef,
  state,
  tabIndex,
}: {
  className?: string;
  inputClassName?: string;
  inputProps: Omit<OTPSlotInputProps, "className" | "ref" | "tabIndex">;
  inputRef: React.Ref<HTMLInputElement> | undefined;
  slotRef: React.Ref<HTMLInputElement>;
  state: OTPSlotState;
  tabIndex: number | undefined;
}) {
  const isActive = (tabIndex ?? -1) === 0;
  const char = state.value;
  const showCaret = isActive && !char && !state.disabled && !state.readOnly;

  return (
    <motion.div
      animate={{
        borderColor: isActive ? "var(--color-primary)" : "var(--color-border)",
      }}
      className={cn(
        controlCornerClassName,
        otpSlotBaseClassName,
        "bg-background text-foreground",
        state.disabled && "cursor-not-allowed opacity-50",
        state.readOnly && "cursor-default",
        className
      )}
      initial={{ borderColor: "var(--color-border)" }}
      transition={springTransition}
    >
      <input
        {...inputProps}
        className={cn(
          "absolute inset-0 z-10 cursor-text touch-manipulation opacity-0",
          state.disabled && "cursor-not-allowed",
          state.readOnly && "cursor-default",
          inputClassName
        )}
        ref={(node) => {
          setRef(inputRef, node);
          setRef(slotRef, node);
        }}
        tabIndex={tabIndex}
      />

      <AnimatePresence mode="popLayout">
        {char ? <OTPSlotCharacter char={char} index={state.index} /> : null}
      </AnimatePresence>

      <AnimatePresence>{showCaret ? <OTPSlotCaret /> : null}</AnimatePresence>
    </motion.div>
  );
}

const OTPSlot = React.forwardRef<HTMLInputElement, OTPSlotProps>(
  ({ index: _index, className, ...props }, ref) => {
    return (
      <OTPField.Input
        {...props}
        render={(inputProps, state) => {
          const {
            className: inputClassName,
            ref: inputRef,
            tabIndex,
            ...resolvedInputProps
          } = inputProps;

          return (
            <OTPSlotSurface
              className={resolveSlotClassName(className, state)}
              inputClassName={inputClassName}
              inputProps={resolvedInputProps}
              inputRef={inputRef}
              slotRef={ref}
              state={state}
              tabIndex={tabIndex}
            />
          );
        }}
      />
    );
  }
);
OTPSlot.displayName = "OTPSlot";

const OTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<typeof OTPField.Separator>
>(({ className, ...props }, ref) => (
  <OTPField.Separator
    {...props}
    className={cn("text-muted-foreground/40", className)}
    render={(separatorProps) => {
      const {
        className: separatorClassName,
        ref: separatorRef,
        ...resolvedSeparatorProps
      } = separatorProps;

      return (
        <div
          {...resolvedSeparatorProps}
          aria-hidden
          className={cn(separatorClassName, "pointer-events-none select-none")}
          ref={(node) => {
            setRef(separatorRef, node);
            setRef(ref, node);
          }}
        >
          <svg className="size-2.5 sm:size-3" fill="none" viewBox="0 0 12 12">
            <circle cx="2" cy="6" fill="currentColor" r="1.5" />
            <circle cx="10" cy="6" fill="currentColor" r="1.5" />
          </svg>
        </div>
      );
    }}
  />
));
OTPSeparator.displayName = "OTPSeparator";

export type { OTPProps, OTPSlotProps, OTPSlotsProps };
export { OTP, OTPGroup, OTPSeparator, OTPSlot, OTPSlots };
