"use client";

import type { OTPFieldInput, OTPFieldRoot } from "@base-ui/react/otp-field";
import { OTPFieldPreview as OTPField } from "@base-ui/react/otp-field";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  Fragment,
  forwardRef,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";

import { cn } from "@/lib/utils";

const DEFAULT_OTP_LENGTH = 6;
const MAX_OTP_LENGTH = 12;

const controlCornerClassName =
  "rounded-[min(var(--radius-md),12px)] supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[14px]";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const otpGroupClassName =
  "flex w-full max-w-full items-center justify-center gap-2 sm:gap-3";

const otpSlotSizeClassNames = {
  default: "size-11 shrink-0 text-lg tabular-nums sm:size-14 sm:text-xl",
  sm: "size-9 shrink-0 text-base tabular-nums sm:size-10 sm:text-lg",
} as const;

const otpSlotBaseClassName =
  "relative flex items-center justify-center overflow-hidden border-2 font-medium";

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

const charMorphTransition = {
  ...charSpring,
  filter: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
  opacity: { duration: 0.16, ease: "easeOut" as const },
};

const charMorphEnter = {
  filter: "blur(8px)",
  opacity: 0.55,
  scale: 0.82,
  y: 10,
};

const charMorphActive = {
  filter: "blur(0px)",
  opacity: 1,
  scale: 1,
  y: 0,
};

const charMorphExit = {
  filter: "blur(6px)",
  opacity: 0,
  scale: 0.88,
  y: -8,
};

const INSTANT_TRANSITION = { duration: 0 } as const;

type OTPSize = keyof typeof otpSlotSizeClassNames;

type OTPConfig = {
  length: number;
  mask: boolean;
  prefersReducedMotion: boolean;
  showInvalid: boolean;
  size: OTPSize;
  slotPlaceholder?: string;
};

const OTPLengthContext = createContext<number | null>(null);
const OTPConfigContext = createContext<OTPConfig>({
  length: DEFAULT_OTP_LENGTH,
  mask: false,
  prefersReducedMotion: false,
  showInvalid: false,
  size: "default",
});

function useOTPConfig() {
  return useContext(OTPConfigContext);
}

function useOTPLength() {
  const length = useContext(OTPLengthContext);

  if (process.env.NODE_ENV !== "production" && length === null) {
    throw new Error("OTP slot components must be rendered inside <OTP>.");
  }

  return length ?? DEFAULT_OTP_LENGTH;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function resolveOTPLength(length?: number, maxLength?: number) {
  const raw = length ?? maxLength ?? DEFAULT_OTP_LENGTH;

  if (!Number.isFinite(raw)) {
    return DEFAULT_OTP_LENGTH;
  }

  const normalized = Math.floor(raw);

  if (normalized < 1) {
    return DEFAULT_OTP_LENGTH;
  }

  return Math.min(normalized, MAX_OTP_LENGTH);
}

function normalizeSeparators(
  separatorAfter: number | number[] | undefined,
  length: number
) {
  if (separatorAfter === undefined) {
    return new Set<number>();
  }

  const indices = Array.isArray(separatorAfter)
    ? separatorAfter
    : [separatorAfter];

  const normalized = indices.filter(
    (index) => Number.isInteger(index) && index > 0 && index < length
  );

  return new Set(normalized);
}

function resolveAriaInvalid(
  showInvalid: boolean,
  ariaInvalidProp?: boolean | "false" | "true" | "grammar" | "spelling"
) {
  if (showInvalid) {
    return true;
  }

  if (ariaInvalidProp === true) {
    return true;
  }

  return ariaInvalidProp;
}

function getOTPFieldMeta({
  ariaDescribedByProp,
  ariaInvalidProp,
  description,
  errorMessage,
  generatedId,
  id,
  invalid,
  label,
}: {
  ariaDescribedByProp?: string;
  ariaInvalidProp?: boolean | "false" | "true" | "grammar" | "spelling";
  description?: ReactNode;
  errorMessage?: ReactNode;
  generatedId: string;
  id?: string;
  invalid: boolean;
  label?: ReactNode;
}) {
  const otpId = id ?? generatedId;
  const descriptionId = description ? `${otpId}-description` : undefined;
  const errorId = errorMessage ? `${otpId}-error` : undefined;
  const showInvalid =
    invalid || Boolean(errorMessage) || ariaInvalidProp === true;
  const hasFieldChrome = Boolean(label || description || errorMessage);

  return {
    describedBy: [ariaDescribedByProp, descriptionId, errorId]
      .filter(Boolean)
      .join(" "),
    descriptionId,
    errorId,
    hasFieldChrome,
    otpId,
    showInvalid,
  };
}

function OTPFieldWrapper({
  children,
  description,
  descriptionClassName,
  descriptionId,
  errorId,
  errorMessage,
  errorMessageClassName,
  label,
  labelClassName,
  otpId,
  required,
  wrapperClassName,
}: {
  children: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  descriptionId?: string;
  errorId?: string;
  errorMessage?: ReactNode;
  errorMessageClassName?: string;
  label?: ReactNode;
  labelClassName?: string;
  otpId: string;
  required: boolean;
  wrapperClassName?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
      {label ? (
        <label
          className={cn("font-medium text-foreground text-sm", labelClassName)}
          htmlFor={otpId}
        >
          {label}
          {required ? (
            <span aria-hidden className="text-destructive">
              {" "}
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {description ? (
        <p
          className={cn(
            "text-muted-foreground text-xs leading-snug",
            descriptionClassName
          )}
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      {errorMessage ? (
        <p
          aria-live="polite"
          className={cn(
            "text-destructive text-xs leading-snug",
            errorMessageClassName
          )}
          id={errorId}
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

type OTPProps = React.ComponentPropsWithoutRef<typeof OTPField.Root> & {
  containerClassName?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  errorMessage?: ReactNode;
  errorMessageClassName?: string;
  invalid?: boolean;
  label?: ReactNode;
  labelClassName?: string;
  /** @deprecated Use `length` instead. */
  maxLength?: number;
  size?: OTPSize;
  wrapperClassName?: string;
};

const otpRootBaseClassName =
  "flex w-full max-w-full items-center justify-center gap-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 sm:gap-3";

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

const OTP = forwardRef<HTMLDivElement, OTPProps>(
  (
    {
      "aria-describedby": ariaDescribedByProp,
      "aria-invalid": ariaInvalidProp,
      children,
      className,
      containerClassName,
      description,
      descriptionClassName,
      errorMessage,
      errorMessageClassName,
      id,
      invalid = false,
      label,
      labelClassName,
      length,
      mask = false,
      maxLength,
      required = false,
      size = "default",
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const prefersReducedMotion = useReducedMotion() ?? false;
    const resolvedLength = resolveOTPLength(length, maxLength);
    const fieldMeta = getOTPFieldMeta({
      ariaDescribedByProp,
      ariaInvalidProp,
      description,
      errorMessage,
      generatedId,
      id,
      invalid,
      label,
    });

    const config = useMemo<OTPConfig>(
      () => ({
        length: resolvedLength,
        mask: Boolean(mask),
        prefersReducedMotion,
        showInvalid: fieldMeta.showInvalid,
        size,
      }),
      [fieldMeta.showInvalid, mask, prefersReducedMotion, resolvedLength, size]
    );

    const root = (
      <div className={cn(componentThemeClassName, "w-full")} data-slot="otp">
        <OTPConfigContext.Provider value={config}>
          <OTPLengthContext.Provider value={resolvedLength}>
            <OTPField.Root
              aria-describedby={fieldMeta.describedBy || undefined}
              aria-invalid={resolveAriaInvalid(
                fieldMeta.showInvalid,
                ariaInvalidProp
              )}
              className={resolveRootClassName(className, containerClassName)}
              data-slot="otp-root"
              id={fieldMeta.otpId}
              length={resolvedLength}
              mask={mask}
              ref={ref}
              required={required}
              {...props}
            >
              {children}
            </OTPField.Root>
          </OTPLengthContext.Provider>
        </OTPConfigContext.Provider>
      </div>
    );

    if (!fieldMeta.hasFieldChrome) {
      return root;
    }

    return (
      <OTPFieldWrapper
        description={description}
        descriptionClassName={descriptionClassName}
        descriptionId={fieldMeta.descriptionId}
        errorId={fieldMeta.errorId}
        errorMessage={errorMessage}
        errorMessageClassName={errorMessageClassName}
        label={label}
        labelClassName={labelClassName}
        otpId={fieldMeta.otpId}
        required={required}
        wrapperClassName={wrapperClassName}
      >
        {root}
      </OTPFieldWrapper>
    );
  }
);
OTP.displayName = "OTP";

const OTPGroup = forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    className={cn(otpGroupClassName, className)}
    data-slot="otp-group"
    ref={ref}
    {...props}
  />
));
OTPGroup.displayName = "OTPGroup";

type OTPSlotsProps = {
  className?: string;
  /** Hint shown in empty slots until the active slot is focused. */
  placeholder?: string;
  /**
   * Inserts `OTPSeparator` before the slot at each zero-based index.
   * Pass a single index or an array for multiple groups.
   */
  separatorAfter?: number | number[];
  slotClassName?: string;
};

function OTPSlots({
  className,
  placeholder,
  separatorAfter,
  slotClassName,
}: OTPSlotsProps) {
  const length = useOTPLength();
  const separators = useMemo(
    () => normalizeSeparators(separatorAfter, length),
    [length, separatorAfter]
  );
  const config = useOTPConfig();
  const mergedConfig = useMemo(
    () => (placeholder ? { ...config, slotPlaceholder: placeholder } : config),
    [config, placeholder]
  );

  return (
    <OTPConfigContext.Provider value={mergedConfig}>
      <OTPGroup className={className}>
        {Array.from({ length }, (_, index) => (
          <Fragment key={`otp-slot-${index}`}>
            {separators.has(index) ? <OTPSeparator /> : null}
            <OTPSlot
              aria-label={
                index === 0 ? undefined : `Character ${index + 1} of ${length}`
              }
              className={slotClassName}
              placeholder={placeholder}
            />
          </Fragment>
        ))}
      </OTPGroup>
    </OTPConfigContext.Provider>
  );
}
OTPSlots.displayName = "OTPSlots";

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

function getSlotBorderColor({
  isActive,
  showInvalid,
  slotInvalid,
}: {
  isActive: boolean;
  showInvalid: boolean;
  slotInvalid: boolean;
}) {
  if (showInvalid || slotInvalid) {
    return "var(--color-destructive)";
  }

  if (isActive) {
    return "var(--color-primary)";
  }

  return "var(--color-border)";
}

function OTPSlotCharacter({
  char,
  index,
  prefersReducedMotion,
  staticDisplay = false,
}: {
  char: string;
  index: number;
  prefersReducedMotion: boolean;
  staticDisplay?: boolean;
}) {
  if (prefersReducedMotion || staticDisplay) {
    return (
      <span
        aria-hidden
        className="pointer-events-none inline-block select-none"
      >
        {char}
      </span>
    );
  }

  return (
    <motion.span
      animate={charMorphActive}
      aria-hidden
      className="pointer-events-none inline-block select-none"
      exit={charMorphExit}
      initial={charMorphEnter}
      key={`${index}-${char}`}
      style={{ willChange: "filter, opacity, transform" }}
      transition={charMorphTransition}
    >
      {char}
    </motion.span>
  );
}

function OTPSlotCaret({
  prefersReducedMotion,
  size,
}: {
  prefersReducedMotion: boolean;
  size: OTPSize;
}) {
  const caretClassName = cn(
    "rounded-full bg-primary",
    size === "sm" ? "h-4 w-[2px]" : "h-5 w-[2px] sm:h-6"
  );

  if (prefersReducedMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className={caretClassName} />
      </div>
    );
  }

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
        className={caretClassName}
        transition={{
          duration: 1.2,
          ease: "easeInOut" as const,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </motion.div>
  );
}

function OTPSlotPlaceholderHint({
  hint,
  prefersReducedMotion,
}: {
  hint: string;
  prefersReducedMotion: boolean;
}) {
  if (prefersReducedMotion) {
    return (
      <span
        aria-hidden
        className="pointer-events-none select-none text-muted-foreground/50"
      >
        {hint}
      </span>
    );
  }

  return (
    <motion.span
      animate={{ filter: "blur(0px)", opacity: 1 }}
      aria-hidden
      className="pointer-events-none select-none text-muted-foreground/50"
      exit={{ filter: "blur(4px)", opacity: 0 }}
      initial={{ filter: "blur(4px)", opacity: 0 }}
      style={{ willChange: "filter, opacity" }}
      transition={{
        filter: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.14, ease: "easeOut" },
      }}
    >
      {hint}
    </motion.span>
  );
}

function getOTPSlotChar(state: OTPSlotState) {
  return state.value;
}

function getOTPSlotDisplayChar(char: string, mask: boolean, disabled: boolean) {
  if (disabled || !char) {
    return "";
  }

  return mask ? "\u2022" : char;
}

function isOTPSlotActive(state: OTPSlotState, tabIndex: number | undefined) {
  return !(state.readOnly || state.disabled) && (tabIndex ?? -1) === 0;
}

function shouldShowOTPSlotPlaceholderHint({
  char,
  isActive,
  placeholder,
  state,
}: {
  char: string;
  isActive: boolean;
  placeholder?: string;
  state: OTPSlotState;
}) {
  return (
    Boolean(placeholder) &&
    !char &&
    !isActive &&
    !state.disabled &&
    !state.readOnly
  );
}

function getOTPSlotSurfaceClassName({
  className,
  resolvedInvalid,
  size,
  state,
}: {
  className?: string;
  resolvedInvalid: boolean;
  size: OTPSize;
  state: OTPSlotState;
}) {
  return cn(
    controlCornerClassName,
    otpSlotBaseClassName,
    otpSlotSizeClassNames[size],
    "bg-background text-foreground",
    resolvedInvalid && "ring-1 ring-destructive/20 dark:ring-destructive/40",
    state.disabled && "cursor-not-allowed bg-muted/20",
    state.readOnly && "cursor-default bg-muted/30",
    className
  );
}

function OTPSlotSurfaceDecorations({
  displayChar,
  placeholder,
  prefersReducedMotion,
  showCaret,
  showPlaceholderHint,
  showStaticValue,
  size,
  state,
}: {
  displayChar: string;
  placeholder?: string;
  prefersReducedMotion: boolean;
  showCaret: boolean;
  showPlaceholderHint: boolean;
  showStaticValue: boolean;
  size: OTPSize;
  state: OTPSlotState;
}) {
  return (
    <>
      <AnimatePresence
        mode={prefersReducedMotion || showStaticValue ? undefined : "popLayout"}
      >
        {displayChar ? (
          <OTPSlotCharacter
            char={displayChar}
            index={state.index}
            prefersReducedMotion={prefersReducedMotion}
            staticDisplay={showStaticValue}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showPlaceholderHint && placeholder ? (
          <OTPSlotPlaceholderHint
            hint={placeholder}
            prefersReducedMotion={prefersReducedMotion}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCaret ? (
          <OTPSlotCaret
            prefersReducedMotion={prefersReducedMotion}
            size={size}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function OTPSlotSurface({
  className,
  inputClassName,
  inputRef,
  inputProps,
  placeholder,
  showInvalid,
  slotRef,
  state,
  tabIndex,
}: {
  className?: string;
  inputClassName?: string;
  inputProps: Omit<OTPSlotInputProps, "className" | "ref" | "tabIndex">;
  inputRef: React.Ref<HTMLInputElement> | undefined;
  placeholder?: string;
  showInvalid: boolean;
  slotRef: React.Ref<HTMLInputElement>;
  state: OTPSlotState;
  tabIndex: number | undefined;
}) {
  const { mask, prefersReducedMotion, size } = useOTPConfig();
  const char = getOTPSlotChar(state);
  const isActive = isOTPSlotActive(state, tabIndex);
  const slotInvalid = state.valid === false;
  const resolvedInvalid = showInvalid || slotInvalid;
  const displayChar = getOTPSlotDisplayChar(char, mask, state.disabled);
  const showStaticValue = state.readOnly;
  const showCaret = isActive && !char && !state.disabled && !state.readOnly;
  const showPlaceholderHint = shouldShowOTPSlotPlaceholderHint({
    char,
    isActive,
    placeholder,
    state,
  });
  const borderColor = getSlotBorderColor({
    isActive,
    showInvalid: resolvedInvalid,
    slotInvalid,
  });
  const motionTransition = prefersReducedMotion
    ? INSTANT_TRANSITION
    : springTransition;

  return (
    <motion.div
      animate={{ borderColor }}
      className={getOTPSlotSurfaceClassName({
        className,
        resolvedInvalid,
        size,
        state,
      })}
      data-slot="otp-slot"
      initial={{ borderColor: "var(--color-border)" }}
      transition={motionTransition}
    >
      <input
        {...inputProps}
        aria-invalid={resolvedInvalid ? true : inputProps["aria-invalid"]}
        className={cn(
          "absolute inset-0 z-10 cursor-text touch-manipulation opacity-0",
          state.disabled && "cursor-not-allowed",
          state.readOnly && "cursor-default",
          inputClassName
        )}
        placeholder={placeholder}
        ref={(node) => {
          setRef(inputRef, node);
          setRef(slotRef, node);
        }}
        tabIndex={state.disabled ? -1 : tabIndex}
      />

      <OTPSlotSurfaceDecorations
        displayChar={displayChar}
        placeholder={placeholder}
        prefersReducedMotion={prefersReducedMotion}
        showCaret={showCaret}
        showPlaceholderHint={showPlaceholderHint}
        showStaticValue={showStaticValue}
        size={size}
        state={state}
      />
    </motion.div>
  );
}

const OTPSlot = forwardRef<HTMLInputElement, OTPSlotProps>(
  ({ index: _index, className, placeholder, ...props }, ref) => {
    const { showInvalid, slotPlaceholder } = useOTPConfig();
    const resolvedPlaceholder = placeholder ?? slotPlaceholder;

    if (process.env.NODE_ENV !== "production" && _index !== undefined) {
      console.warn(
        "[OTP] The `index` prop on <OTPSlot> is ignored. Slot order is determined by render order."
      );
    }

    return (
      <OTPField.Input
        {...props}
        placeholder={resolvedPlaceholder}
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
              placeholder={resolvedPlaceholder}
              showInvalid={showInvalid}
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

const OTPSeparator = forwardRef<
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
          className={cn(separatorClassName, "pointer-events-none select-none")}
          data-slot="otp-separator"
          ref={(node) => {
            setRef(separatorRef, node);
            setRef(ref, node);
          }}
        >
          <svg
            aria-hidden
            className="size-2.5 sm:size-3"
            fill="none"
            viewBox="0 0 12 12"
          >
            <circle cx="2" cy="6" fill="currentColor" r="1.5" />
            <circle cx="10" cy="6" fill="currentColor" r="1.5" />
          </svg>
        </div>
      );
    }}
  />
));
OTPSeparator.displayName = "OTPSeparator";

export type { OTPProps, OTPSlotProps, OTPSlotsProps, OTPSize };
export { OTP, OTPGroup, OTPSeparator, OTPSlot, OTPSlots };
