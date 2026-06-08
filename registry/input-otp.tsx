"use client";

import { OTPFieldPreview as OTPField } from "@base-ui/react/otp-field";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

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

const reducedTransition = { duration: 0.12 } as const;

type OTPProps = React.ComponentPropsWithoutRef<typeof OTPField.Root> & {
  containerClassName?: string;
  /** @deprecated Use `length` instead. */
  maxLength?: number;
  /** Force reduced motion for slot animations. Defaults to the user OS preference. */
  reducedMotion?: boolean;
};

const OTP = React.forwardRef<HTMLDivElement, OTPProps>(
  (
    {
      children,
      className,
      containerClassName,
      length,
      maxLength,
      reducedMotion,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const resolvedLength = length ?? maxLength ?? 6;
    const resolveReducedMotion = reducedMotion ?? prefersReducedMotion;

    return (
      <OTPLengthContext.Provider value={resolvedLength}>
        <MotionConfig reducedMotion={resolveReducedMotion ? "always" : "user"}>
          <OTPField.Root
            className={cn(
              "flex items-center gap-3 data-disabled:opacity-50",
              containerClassName,
              className
            )}
            length={resolvedLength}
            ref={ref}
            {...props}
          >
            {children}
          </OTPField.Root>
        </MotionConfig>
      </OTPLengthContext.Provider>
    );
  }
);
OTP.displayName = "OTP";

const OTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    className={cn("flex items-center gap-3", className)}
    ref={ref}
    {...props}
  />
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

type OTPSlotState = {
  disabled: boolean;
  index: number;
  readOnly: boolean;
  value: string;
};

function OTPSlotCharacter({
  char,
  index,
  reduceMotion,
}: {
  char: string;
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.span
      animate={{ opacity: 1, y: 0, scale: 1 }}
      aria-hidden
      className="pointer-events-none inline-block select-none"
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.7 }}
      initial={
        reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.7 }
      }
      key={`${index}-${char}`}
      transition={reduceMotion ? reducedTransition : charSpring}
    >
      {char}
    </motion.span>
  );
}

function OTPSlotCaret({ reduceMotion }: { reduceMotion: boolean }) {
  const caretPulseTransition = reduceMotion
    ? { duration: 0.12 }
    : {
        duration: 1.2,
        ease: "easeInOut" as const,
        repeat: Number.POSITIVE_INFINITY,
      };

  const caretEnterTransition = reduceMotion
    ? { duration: 0.12 }
    : {
        opacity: { duration: 0.15 },
        scaleY: {
          type: "spring" as const,
          stiffness: 400,
          damping: 25,
        },
      };

  return (
    <motion.div
      animate={{
        opacity: 1,
        scaleY: 1,
        transition: caretEnterTransition,
      }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.1 } }}
      initial={{ opacity: 0, scaleY: 0 }}
    >
      <motion.div
        animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.3, 1] }}
        className="h-6 w-[2px] rounded-full bg-primary"
        transition={caretPulseTransition}
      />
    </motion.div>
  );
}

function OTPSlotSurface({
  className,
  inputClassName,
  inputRef,
  inputProps,
  reduceMotion,
  slotRef,
  state,
  tabIndex,
}: {
  className?: string;
  inputClassName?: string;
  inputProps: Omit<OTPSlotInputProps, "className" | "ref" | "tabIndex">;
  inputRef: React.Ref<HTMLInputElement> | undefined;
  reduceMotion: boolean;
  slotRef: React.Ref<HTMLInputElement>;
  state: OTPSlotState;
  tabIndex: number;
}) {
  const isActive = tabIndex === 0;
  const char = state.value;
  const showCaret = isActive && !char && !state.disabled && !state.readOnly;

  return (
    <motion.div
      animate={{
        borderColor: isActive ? "var(--color-primary)" : "var(--color-border)",
      }}
      className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-xl border-2 font-medium text-xl tabular-nums",
        "bg-background text-foreground",
        state.disabled && "cursor-not-allowed opacity-50",
        state.readOnly && "cursor-default",
        className
      )}
      initial={{ borderColor: "var(--color-border)" }}
      transition={reduceMotion ? reducedTransition : springTransition}
    >
      <input
        {...inputProps}
        className={cn(
          "absolute inset-0 z-10 cursor-text opacity-0",
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
        {char ? (
          <OTPSlotCharacter
            char={char}
            index={state.index}
            reduceMotion={reduceMotion}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCaret ? <OTPSlotCaret reduceMotion={reduceMotion} /> : null}
      </AnimatePresence>
    </motion.div>
  );
}

const OTPSlot = React.forwardRef<HTMLInputElement, OTPSlotProps>(
  ({ index: _index, className, ...props }, ref) => {
    const reduceMotion = useReducedMotion() ?? false;

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
              className={className}
              inputClassName={inputClassName}
              inputProps={resolvedInputProps}
              inputRef={inputRef}
              reduceMotion={reduceMotion}
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
          <svg fill="none" height="12" viewBox="0 0 12 12" width="12">
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
