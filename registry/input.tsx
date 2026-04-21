"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  useEffect,
  useId,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/** HTML `pattern` body (full-value match). Local part @ domain with at least one dot in domain. */
const EMAIL_PATTERN = String.raw`[^\s@]+@[^\s@]+\.[^\s@]+`;
const EMAIL_REGEX = new RegExp(`^${EMAIL_PATTERN}$`);

/** Ease-out curve — quick start, soft landing (feels closer to system UI than a bouncy spring). */
const EYE_MOTION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type NativeInputRest = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "id" | "type" | "value"
>;

type SharedHandlers = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
};

function EyeOpenIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 12s4.5-7 11-7 11 7 11 7-4.5 7-11 7S1 12 1 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

function EyeClosedIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m15 18-.722-3.25" />
      <path d="M2 8a10.645 10.645 0 0 0 20 0" />
      <path d="m20 15-1.726-2.05" />
      <path d="m4 15 1.726-2.05" />
      <path d="m9 18 .722-3.25" />
    </svg>
  );
}

function PasswordField({
  interactive,
  id,
  nativeProps,
  passwordVisible,
  sharedHandlers,
  togglePassword,
  value,
}: {
  interactive: boolean;
  id: string;
  nativeProps: NativeInputRest;
  passwordVisible: boolean;
  sharedHandlers: SharedHandlers;
  togglePassword: () => void;
  value: string;
}) {
  return (
    <>
      <input
        className="h-full min-h-10 w-full min-w-0 flex-1 border-0 bg-transparent pr-9 text-foreground text-sm outline-none selection:bg-foreground/20"
        id={id}
        type={passwordVisible ? "text" : "password"}
        value={value}
        {...nativeProps}
        {...sharedHandlers}
      />
      <button
        aria-label={passwordVisible ? "Hide password" : "Show password"}
        aria-pressed={passwordVisible}
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground/40 focus-visible:outline-offset-2"
        disabled={!interactive}
        onClick={togglePassword}
        onMouseDown={(e) => e.preventDefault()}
        type="button"
      >
        <span className="relative flex size-4 items-center justify-center [perspective:320px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              animate={{
                opacity: 1,
                rotateX: 0,
                scale: 1,
                y: 0,
              }}
              className="absolute inset-0 flex items-center justify-center"
              exit={{
                opacity: 0,
                rotateX: passwordVisible ? -10 : 10,
                scale: 0.94,
                y: passwordVisible ? -3 : 3,
              }}
              initial={{
                opacity: 0,
                rotateX: passwordVisible ? 10 : -10,
                scale: 0.94,
                y: passwordVisible ? 3 : -3,
              }}
              key={passwordVisible ? "shown" : "hidden"}
              style={{ transformStyle: "preserve-3d" }}
              transition={{
                duration: 0.22,
                ease: EYE_MOTION_EASE,
                opacity: { duration: 0.16, ease: EYE_MOTION_EASE },
              }}
            >
              {passwordVisible ? (
                <EyeClosedIcon className="size-4 shrink-0" />
              ) : (
                <EyeOpenIcon className="size-4 shrink-0" />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </>
  );
}

function OverlayField({
  clearSearch,
  emailFieldProps,
  id,
  interactive,
  isSearch,
  nativeProps,
  sharedHandlers,
  showSearchClear,
  type,
  value,
}: {
  clearSearch: () => void;
  emailFieldProps: Record<string, unknown>;
  id: string;
  interactive: boolean;
  isSearch: boolean;
  nativeProps: NativeInputRest;
  sharedHandlers: SharedHandlers;
  showSearchClear: boolean;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  value: string;
}) {
  return (
    <>
      <input
        className={cn(
          "absolute inset-0 h-full w-full border-0 bg-transparent px-3 text-sm text-transparent leading-5 caret-foreground outline-none [font-kerning:none] [font-variant-ligatures:none] selection:bg-foreground/20 selection:text-transparent",
          isSearch &&
            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          showSearchClear && "pr-9"
        )}
        id={id}
        type={type}
        value={value}
        {...nativeProps}
        {...emailFieldProps}
        {...sharedHandlers}
      />

      <div
        aria-hidden
        className={cn(
          "pointer-events-none block min-w-0 whitespace-pre text-foreground text-sm leading-5 [font-kerning:none] [font-variant-ligatures:none]",
          showSearchClear && "pr-9"
        )}
      >
        <AnimatePresence initial={false}>
          {value.split("").map((char, i) => (
            <motion.span
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              className="inline-block align-baseline"
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.6,
                filter: "blur(6px)",
              }}
              initial={{
                opacity: 0,
                y: 10,
                scale: 0.6,
                filter: "blur(6px)",
              }}
              key={`${i}-${char}`}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
                mass: 0.6,
              }}
            >
              {char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {showSearchClear && interactive ? (
        <button
          aria-label="Clear search"
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground/40 focus-visible:outline-offset-2"
          onClick={clearSearch}
          onMouseDown={(e) => e.preventDefault()}
          type="button"
        >
          <svg
            aria-hidden
            className="size-3.5 shrink-0"
            fill="none"
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.25 2.25l7.5 7.5M9.75 2.25l-7.5 7.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.125"
            />
          </svg>
        </button>
      ) : null}
    </>
  );
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function input({
  label = "Type here",
  className,
  disabled,
  id: providedId,
  readOnly,
  value: controlledValue,
  onChange,
  type = "text",
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const [internal, setInternal] = useState("");
  const [focused, setFocused] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const value = controlledValue ?? internal;
  const isControlled = controlledValue !== undefined;

  const isPassword = type === "password";
  const isNumber = type === "number";
  const isSearch = type === "search";
  const isEmail = type === "email";
  const interactive = !(disabled || readOnly);

  useEffect(() => {
    if (!isEmail) {
      setEmailInvalid(false);
    }
    if (!isPassword) {
      setPasswordVisible(false);
    }
  }, [isEmail, isPassword]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e.target.value);
    if (isEmail) {
      setEmailInvalid(false);
    }
  };

  const showSearchClear = isSearch && value.length > 0;

  const clearSearch = () => {
    if (!isControlled) setInternal("");
    onChange?.("");
  };

  const sharedHandlers: SharedHandlers = {
    onBlur: (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      if (isEmail) {
        const v = e.target.value;
        setEmailInvalid(v.length > 0 && !EMAIL_REGEX.test(v));
      }
      props.onBlur?.(e);
    },
    onChange: handleChange,
    onFocus: (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      if (isEmail) {
        setEmailInvalid(false);
      }
      props.onFocus?.(e);
    },
  };

  const emailFieldProps = isEmail
    ? {
        "aria-invalid": emailInvalid || undefined,
        pattern: EMAIL_PATTERN,
        title: "Enter a valid email address (e.g. name@example.com)",
      }
    : {};

  const nativeProps = { ...props, disabled, readOnly } as NativeInputRest;

  return (
    <div className={cn("w-full max-w-sm space-y-1.5", className)}>
      <label
        className={cn(
          "block font-medium text-foreground text-sm leading-none",
          disabled && "cursor-not-allowed opacity-70"
        )}
        htmlFor={id}
      >
        {label}
      </label>

      <motion.div
        animate={{
          borderColor: emailInvalid
            ? "hsl(var(--destructive))"
            : focused
              ? "hsl(var(--foreground))"
              : "hsl(var(--border))",
          boxShadow: emailInvalid
            ? "0 0 0 2px hsl(var(--destructive) / 0.12)"
            : focused
              ? "0 0 0 2px hsl(var(--foreground) / 0.06)"
              : "0 0 0 0px hsl(var(--foreground) / 0)",
        }}
        className={cn(
          "relative flex h-10 items-center rounded-md border bg-background px-3 shadow-sm",
          isNumber || isPassword || isSearch
            ? "overflow-visible"
            : "overflow-hidden",
          disabled && "opacity-70"
        )}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {isPassword ? (
          <PasswordField
            id={id}
            interactive={interactive}
            nativeProps={nativeProps}
            passwordVisible={passwordVisible}
            sharedHandlers={sharedHandlers}
            togglePassword={() => setPasswordVisible((v) => !v)}
            value={value}
          />
        ) : (
          <OverlayField
            clearSearch={clearSearch}
            emailFieldProps={emailFieldProps}
            id={id}
            interactive={interactive}
            isSearch={isSearch}
            nativeProps={nativeProps}
            sharedHandlers={sharedHandlers}
            showSearchClear={showSearchClear}
            type={type}
            value={value}
          />
        )}
      </motion.div>
    </div>
  );
}

export { input as Input };
