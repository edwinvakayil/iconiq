"use client";

import type { InputChangeEventDetails } from "@base-ui/react/input";
import { Input as InputPrimitive } from "@base-ui/react/input";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const DEFAULT_SPRING = {
  stiffness: 500,
  damping: 30,
  mass: 0.5,
} as const;

const OPEN_EYELID_PATH =
  "M15.008,6.083l.881-1.441c.216-.354,.105-.815-.248-1.031-.354-.215-.815-.105-1.031,.248l-.907,1.482c-.678-.331-1.388-.588-2.124-.769l.333-1.655c.082-.406-.182-.802-.587-.883-.405-.078-.802,.181-.883,.587l-.339,1.685c-.364-.037-.732-.057-1.103-.057s-.739,.02-1.103,.057l-.339-1.685c-.082-.406-.48-.666-.883-.587-.406,.082-.669,.477-.587,.883l.333,1.655c-.736,.181-1.446,.438-2.124,.769l-.907-1.482c-.215-.353-.677-.463-1.031-.248-.353,.216-.464,.678-.248,1.031l.881,1.441c-.594,.402-1.154,.867-1.668,1.392-.29,.295-.285,.771,.011,1.061,.295,.29,.77,.285,1.061-.011,1.754-1.789,4.1-2.774,6.605-2.774s4.851,.985,6.605,2.774c.147,.15,.341,.225,.536,.225,.189,0,.379-.071,.525-.214,.296-.29,.301-.765,.011-1.061-.515-.525-1.074-.99-1.668-1.392Z";

const CLOSED_EYELID_PATH =
  "M16.666,6.734c-.295-.29-.77-.285-1.061,.011-1.754,1.789-4.1,2.774-6.605,2.774s-4.851-.985-6.605-2.774c-.29-.295-.765-.3-1.061-.011-.296,.29-.301,.765-.011,1.061,.515,.525,1.074,.99,1.669,1.393l-.881,1.441c-.216,.353-.105,.815,.249,1.031,.122,.075,.257,.11,.391,.11,.252,0,.499-.127,.64-.359l.906-1.482c.678,.331,1.388,.588,2.124,.769l-.333,1.655c-.082,.406,.182,.802,.587,.883,.05,.01,.1,.015,.149,.015,.35,0,.663-.246,.734-.602l.339-1.685c.364,.037,.732,.057,1.103,.057s.739-.02,1.103-.057l.339,1.685c.072,.356,.385,.602,.734,.602,.049,0,.099-.005,.149-.015,.406-.082,.669-.477,.587-.883l-.333-1.655c.736-.181,1.446-.438,2.124-.769l.906,1.482c.141,.231,.388,.359,.64,.359,.134,0,.269-.036,.391-.11,.354-.216,.465-.678,.249-1.031l-.881-1.441c.594-.403,1.154-.867,1.669-1.393,.29-.295,.285-.771-.011-1.061Z";

const EYE_MORPH_ORIGIN = "9px 10.5px";

const EYE_BLINK_TRANSITION = {
  type: "spring",
  stiffness: 640,
  damping: 34,
  mass: 0.38,
} as const;

const INSTANT_TRANSITION = { duration: 0 } as const;

const FIREFOX_USER_AGENT_PATTERN = /firefox|fxios/i;
const CHROME_USER_AGENT_PATTERN = /chrome|chromium|crios/i;

const SMOOTH_CARET_TYPES = new Set([
  "text",
  "search",
  "url",
  "email",
  "password",
  "tel",
]);

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const inputShellClassName = cn(
  "group flex w-full items-center gap-1 border border-input bg-background pr-1 pl-3.5 text-base transition-[color,box-shadow,border-color] sm:text-sm",
  "hover:border-ring/40",
  "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/25",
  "[&:has(input:disabled)]:cursor-not-allowed [&:has(input:disabled)]:opacity-50",
  "[&:has(input:read-only)]:bg-muted/30",
  "[&:has(input[aria-invalid=true])]:border-destructive [&:has(input[aria-invalid=true])]:ring-1 [&:has(input[aria-invalid=true])]:ring-destructive/20 dark:[&:has(input[aria-invalid=true])]:border-destructive/50 dark:[&:has(input[aria-invalid=true])]:ring-destructive/40"
);

const inputControlClassName = cn(
  "h-full w-full min-w-0 flex-1 bg-transparent text-[16px] text-foreground outline-none placeholder:text-muted-foreground sm:text-sm",
  "[-webkit-tap-highlight-color:transparent] read-only:cursor-default disabled:cursor-not-allowed"
);

const inputSizeClassNames = {
  default: "h-11",
  sm: "h-9",
} as const;

const inputActionClassName =
  "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md text-muted-foreground/70 transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

type InputSize = keyof typeof inputSizeClassNames;

type SpringConfig = {
  stiffness?: number;
  damping?: number;
  mass?: number;
};

type InputRenderProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
  style?: React.CSSProperties;
};

type InputProps = Omit<InputPrimitive.Props, "size" | "type"> & {
  children?: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  endAdornment?: ReactNode;
  errorMessage?: ReactNode;
  errorMessageClassName?: string;
  fontSize?: number;
  invalid?: boolean;
  label?: ReactNode;
  labelClassName?: string;
  required?: boolean;
  shellClassName?: string;
  showClear?: boolean;
  showPasswordToggle?: boolean;
  size?: InputSize;
  spring?: SpringConfig;
  startAdornment?: ReactNode;
  type?: React.HTMLInputTypeAttribute;
  wrapperClassName?: string;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function resolveInputRenderProps(inputProps: InputRenderProps) {
  const {
    className: primitiveClassName,
    ref: primitiveRef,
    style: primitiveStyle,
    ...resolvedInputProps
  } = inputProps;

  return {
    primitiveClassName,
    primitiveRef,
    primitiveStyle,
    resolvedInputProps,
  };
}

function getPasswordChar() {
  if (typeof navigator === "undefined") {
    return "\u2022";
  }

  return navigator.userAgent.match(FIREFOX_USER_AGENT_PATTERN)
    ? "\u25CF"
    : "\u2022";
}

function isChromeBrowser() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return Boolean(navigator.userAgent.match(CHROME_USER_AGENT_PATTERN));
}

function getCaretIndex(target: HTMLInputElement) {
  const selectionStart = target.selectionStart ?? 0;
  const selectionEnd = target.selectionEnd ?? 0;

  if (selectionStart === selectionEnd) {
    return selectionStart;
  }

  return target.selectionDirection === "backward"
    ? selectionStart
    : selectionEnd;
}

function scrollCaretIntoView(
  target: HTMLInputElement,
  absoluteWidth: number,
  isRtl: boolean
) {
  const styles = window.getComputedStyle(target);
  const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
  const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
  const visibleRight = target.scrollLeft + target.clientWidth - paddingRight;
  const visibleLeft = target.scrollLeft + paddingLeft;

  if (isRtl) {
    const scrollTarget = Math.max(
      0,
      target.scrollWidth - target.clientWidth - absoluteWidth + paddingLeft
    );

    if (target.scrollLeft > scrollTarget) {
      target.scrollLeft = scrollTarget;
    } else if (target.scrollLeft < scrollTarget - paddingRight) {
      target.scrollLeft = Math.min(scrollTarget, maxScroll);
    }

    return;
  }

  if (absoluteWidth > visibleRight) {
    target.scrollLeft = Math.min(
      absoluteWidth - target.clientWidth + paddingRight,
      maxScroll
    );
    return;
  }

  if (absoluteWidth < visibleLeft) {
    target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft);
  }
}

function supportsSmoothCaret(
  type?: string,
  hasCustomRender?: boolean,
  passwordVisible?: boolean
) {
  if (hasCustomRender) {
    return false;
  }

  if (type === "file" || type === "hidden") {
    return false;
  }

  if (type === "password" && passwordVisible) {
    return true;
  }

  return SMOOTH_CARET_TYPES.has(type ?? "text");
}

function clearNativeInputValue(input: HTMLInputElement) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;

  nativeInputValueSetter?.call(input, "");
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function IconClear({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height="14"
      viewBox="0 0 14 14"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 3.5l7 7M10.5 3.5l-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PasswordVisibilityIcon({
  prefersReducedMotion,
  visible,
}: {
  prefersReducedMotion: boolean;
  visible: boolean;
}) {
  const blinkTransition = prefersReducedMotion
    ? INSTANT_TRANSITION
    : EYE_BLINK_TRANSITION;
  const lidTransition = prefersReducedMotion
    ? INSTANT_TRANSITION
    : {
        ...EYE_BLINK_TRANSITION,
        delay: visible ? 0.02 : 0,
      };
  const pupilTransition = prefersReducedMotion
    ? INSTANT_TRANSITION
    : {
        ...EYE_BLINK_TRANSITION,
        delay: visible ? 0 : 0.05,
      };

  return (
    <motion.svg
      animate={{ rotate: 0, scale: 1 }}
      aria-hidden
      className="size-3.5 shrink-0"
      fill="currentColor"
      initial={false}
      transition={blinkTransition}
      viewBox="0 0 18 18"
    >
      <motion.g
        animate={{
          opacity: visible ? 1 : 0,
          scaleY: visible ? 1 : 0.42,
          y: visible ? 0 : 1.35,
        }}
        initial={false}
        style={{
          transformBox: "fill-box",
          transformOrigin: EYE_MORPH_ORIGIN,
        }}
        transition={lidTransition}
      >
        <path d={OPEN_EYELID_PATH} />
      </motion.g>
      <motion.g
        animate={{
          opacity: visible ? 0 : 1,
          scaleY: visible ? 0.42 : 1,
          y: visible ? -1.35 : 0,
        }}
        initial={false}
        style={{
          transformBox: "fill-box",
          transformOrigin: EYE_MORPH_ORIGIN,
        }}
        transition={lidTransition}
      >
        <path d={CLOSED_EYELID_PATH} />
      </motion.g>
      <motion.circle
        animate={{
          opacity: visible ? 1 : 0,
          r: visible ? 3.5 : 0,
        }}
        cx={9}
        cy={10.5}
        initial={false}
        transition={pupilTransition}
      />
    </motion.svg>
  );
}

function getFilledState(
  value: InputPrimitive.Props["value"] | undefined,
  defaultValue: InputPrimitive.Props["defaultValue"] | undefined
) {
  const resolved = value ?? defaultValue;
  if (resolved === undefined || resolved === null) {
    return false;
  }

  return String(resolved).length > 0;
}

function shouldIgnoreShellActivation(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  if (!element) {
    return true;
  }

  if (element.closest('[data-slot="input-action"]')) {
    return true;
  }

  if (element.closest('[data-slot="input"]')) {
    return true;
  }

  return false;
}

function getInputFieldMeta({
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
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;
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
    inputId,
    showInvalid,
  };
}

function useShellFocus(
  disabled: boolean | undefined,
  inputRef: React.RefObject<HTMLInputElement | null>
) {
  const focusInputFromShell = useCallback(() => {
    if (disabled) {
      return;
    }

    inputRef.current?.focus();
  }, [disabled, inputRef]);

  const handleShellMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || shouldIgnoreShellActivation(event.target)) {
        return;
      }

      event.preventDefault();
      focusInputFromShell();
    },
    [disabled, focusInputFromShell]
  );

  return { handleShellMouseDown };
}

type UseSmoothCaretOptions = {
  passwordVisible: boolean;
  prefersReducedMotion: boolean | null;
  spring: SpringConfig;
  userRender: InputProps["render"];
};

function useSmoothCaret({
  passwordVisible,
  prefersReducedMotion,
  spring,
  userRender,
}: UseSmoothCaretOptions) {
  const caretX = useMotionValue(0);
  const caretOpacity = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const caretXRef = useRef(caretX);
  caretXRef.current = caretX;
  const caretOpacityMotionRef = useRef(caretOpacity);
  caretOpacityMotionRef.current = caretOpacity;

  const springCaretX = useSpring(
    caretX,
    prefersReducedMotion
      ? { stiffness: 10_000, damping: 100, mass: 0.1 }
      : spring
  );

  const syncMeasureSpan = useCallback(() => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!(input && measureSpan)) {
      return;
    }

    const styles = window.getComputedStyle(input);
    const passwordChar = getPasswordChar();
    const isPassword = input.type === "password";

    let resolvedFontSize = styles.fontSize;
    if (passwordChar === "\u2022" && isPassword && !isChromeBrowser()) {
      resolvedFontSize = `${Number.parseFloat(resolvedFontSize) + 6.25}px`;
    }

    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${resolvedFontSize} ${styles.fontFamily}`;
    measureSpan.style.letterSpacing = styles.letterSpacing;
    measureSpan.style.fontFeatureSettings = styles.fontFeatureSettings;
    measureSpan.style.fontVariationSettings = styles.fontVariationSettings;
    measureSpan.style.direction = styles.direction;
  }, []);

  const measurePrefixWidth = useCallback(
    (text: string) => {
      const input = inputRef.current;
      const measureSpan = measureRef.current;
      if (!(input && measureSpan)) {
        return null;
      }

      syncMeasureSpan();
      measureSpan.textContent = text;

      const paddingLeft =
        Number.parseFloat(window.getComputedStyle(input).paddingLeft) || 0;

      return text.length > 0
        ? measureSpan.offsetWidth + paddingLeft
        : paddingLeft - 1;
    },
    [syncMeasureSpan]
  );

  const updateCaretFromInput = useCallback(
    (target: HTMLInputElement) => {
      if (
        !supportsSmoothCaret(target.type, Boolean(userRender), passwordVisible)
      ) {
        return;
      }

      const selectionStart = target.selectionStart ?? 0;
      const selectionEnd = target.selectionEnd ?? 0;
      const hasSelection = selectionStart !== selectionEnd;
      const caretIndex = getCaretIndex(target);
      const isPassword = target.type === "password";
      const passwordChar = getPasswordChar();
      const textBeforeCaret = isPassword
        ? passwordChar.repeat(caretIndex)
        : target.value.slice(0, caretIndex);

      const absoluteWidth = measurePrefixWidth(textBeforeCaret);
      if (absoluteWidth === null) {
        return;
      }

      const styles = window.getComputedStyle(target);
      const isRtl = styles.direction === "rtl";
      const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
      const paddingRight = Number.parseFloat(styles.paddingRight) || 0;

      scrollCaretIntoView(target, absoluteWidth, isRtl);

      let caretPosition = absoluteWidth - target.scrollLeft;

      if (isRtl) {
        const fullText = isPassword
          ? passwordChar.repeat(target.value.length)
          : target.value;
        const fullWidth = measurePrefixWidth(fullText) ?? paddingLeft;
        caretPosition =
          target.clientWidth - paddingRight - (fullWidth - absoluteWidth);
      }

      const minX = paddingLeft - 1;
      const maxX = target.clientWidth - paddingRight;
      const isCaretVisible = caretPosition >= minX && caretPosition <= maxX + 1;

      caretXRef.current.set(Math.min(Math.max(caretPosition, minX), maxX));

      if (!isCaretVisible || hasSelection) {
        caretOpacityMotionRef.current.set(0);
        return;
      }

      caretOpacityMotionRef.current.set(1);
    },
    [measurePrefixWidth, passwordVisible, userRender]
  );

  const updateCaretRef = useRef(updateCaretFromInput);
  updateCaretRef.current = updateCaretFromInput;
  const caretFrameRef = useRef<number | null>(null);

  const scheduleCaretUpdate = useCallback((target: HTMLInputElement) => {
    if (caretFrameRef.current !== null) {
      cancelAnimationFrame(caretFrameRef.current);
    }

    caretFrameRef.current = requestAnimationFrame(() => {
      caretFrameRef.current = null;
      updateCaretRef.current(target);
    });
  }, []);

  useEffect(
    () => () => {
      if (caretFrameRef.current !== null) {
        cancelAnimationFrame(caretFrameRef.current);
      }
    },
    []
  );

  return {
    caretOpacity,
    caretOpacityRef: caretOpacityMotionRef,
    containerRef,
    inputRef,
    measureRef,
    scheduleCaretUpdate,
    springCaretX,
    updateCaretRef,
  };
}

function useSmoothCaretListeners(
  smoothCaret: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  updateCaretRef: React.MutableRefObject<(target: HTMLInputElement) => void>
) {
  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!(input && container && smoothCaret)) {
      return;
    }

    const updateCaretIfFocused = () => {
      if (document.activeElement === input) {
        updateCaretRef.current(input);
      }
    };

    const handleSelectionChange = () => {
      if (document.activeElement !== input) {
        return;
      }

      requestAnimationFrame(() => {
        if (document.activeElement === input) {
          updateCaretRef.current(input);
        }
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.addEventListener("loadingdone", updateCaretIfFocused);
      document.fonts.ready.then(updateCaretIfFocused).catch(() => undefined);
    }
    input.addEventListener("scroll", updateCaretIfFocused);

    const resizeObserver = new ResizeObserver(updateCaretIfFocused);
    resizeObserver.observe(container);

    updateCaretIfFocused();

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.removeEventListener("loadingdone", updateCaretIfFocused);
      }
      input.removeEventListener("scroll", updateCaretIfFocused);
      resizeObserver.disconnect();
    };
  }, [containerRef, inputRef, smoothCaret, updateCaretRef]);
}

type InputShellProps = {
  ariaInvalidProp?: boolean | "false" | "true" | "grammar" | "spelling";
  caretOpacity: ReturnType<typeof useMotionValue<number>>;
  caretOpacityRef: React.MutableRefObject<
    ReturnType<typeof useMotionValue<number>>
  >;
  children?: ReactNode;
  className?: InputPrimitive.Props["className"];
  containerRef: React.RefObject<HTMLDivElement | null>;
  defaultValue?: InputPrimitive.Props["defaultValue"];
  describedBy?: string;
  disabled?: boolean;
  endAdornment?: ReactNode;
  filled: boolean;
  fontSize?: number;
  forwardRef: React.Ref<HTMLInputElement>;
  handleClear: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleShellMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleValueChange: NonNullable<InputPrimitive.Props["onValueChange"]>;
  hasFieldChrome: boolean;
  inputId: string;
  inputProps: Omit<
    InputPrimitive.Props,
    | "className"
    | "defaultValue"
    | "disabled"
    | "id"
    | "onBlur"
    | "onChange"
    | "onFocus"
    | "onKeyDown"
    | "onValueChange"
    | "placeholder"
    | "readOnly"
    | "render"
    | "required"
    | "type"
    | "value"
  >;
  inputRef: React.RefObject<HTMLInputElement | null>;
  measureRef: React.RefObject<HTMLSpanElement | null>;
  onBlur?: InputPrimitive.Props["onBlur"];
  onChange?: InputPrimitive.Props["onChange"];
  onFocus?: InputPrimitive.Props["onFocus"];
  onKeyDown?: InputPrimitive.Props["onKeyDown"];
  passwordVisible: boolean;
  placeholder?: string;
  prefersReducedMotion: boolean | null;
  readOnly?: boolean;
  required?: boolean;
  resolvedType: React.HTMLInputTypeAttribute;
  scheduleCaretUpdate: (target: HTMLInputElement) => void;
  setPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFilled: React.Dispatch<React.SetStateAction<boolean>>;
  shellClassName?: string;
  showClear: boolean;
  showInvalid: boolean;
  showPasswordToggle: boolean;
  size: InputSize;
  smoothCaret: boolean;
  springCaretX: ReturnType<typeof useSpring>;
  startAdornment?: ReactNode;
  style?: InputPrimitive.Props["style"];
  type: React.HTMLInputTypeAttribute;
  userRender: InputProps["render"];
  value?: InputPrimitive.Props["value"];
  wrapperClassName?: string;
};

function InputShell({
  ariaInvalidProp,
  caretOpacity,
  caretOpacityRef,
  children,
  className,
  containerRef,
  defaultValue,
  describedBy,
  disabled,
  endAdornment,
  filled,
  fontSize,
  forwardRef,
  handleClear,
  handleShellMouseDown,
  handleValueChange,
  hasFieldChrome,
  inputId,
  inputProps,
  inputRef,
  measureRef,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  passwordVisible,
  placeholder,
  prefersReducedMotion,
  readOnly,
  required,
  resolvedType,
  scheduleCaretUpdate,
  setFilled,
  setPasswordVisible,
  shellClassName,
  showClear,
  showInvalid,
  showPasswordToggle,
  size,
  smoothCaret,
  springCaretX,
  startAdornment,
  style,
  type,
  userRender,
  value,
  wrapperClassName,
}: InputShellProps) {
  return (
    <div
      className={cn(
        componentThemeClassName,
        controlCornerClassName,
        inputShellClassName,
        inputSizeClassNames[size],
        shellClassName,
        hasFieldChrome ? undefined : wrapperClassName
      )}
      data-size={size}
      data-slot="input-shell"
      onMouseDown={handleShellMouseDown}
    >
      {startAdornment ? (
        <span className="flex shrink-0 items-center text-muted-foreground">
          {startAdornment}
        </span>
      ) : null}
      <div
        className="relative grid min-w-0 flex-1 grid-cols-1"
        ref={containerRef}
        style={{
          ...(smoothCaret ? { caretColor: "transparent" } : undefined),
          ...(fontSize === undefined ? undefined : { fontSize }),
        }}
      >
        <InputPrimitive
          {...inputProps}
          aria-describedby={describedBy || undefined}
          aria-invalid={showInvalid ? true : ariaInvalidProp}
          className={cn(
            inputControlClassName,
            "col-start-1 col-end-2 row-start-1 row-end-2 text-inherit leading-none",
            className
          )}
          data-slot="input"
          defaultValue={defaultValue}
          disabled={disabled}
          id={inputId}
          onBlur={(event) => {
            if (smoothCaret) {
              caretOpacityRef.current.set(0);
            }
            onBlur?.(event);
          }}
          onChange={(event) => {
            setFilled(event.currentTarget.value.length > 0);
            onChange?.(event);
            scheduleCaretUpdate(event.currentTarget);
          }}
          onFocus={(event) => {
            onFocus?.(event);
            scheduleCaretUpdate(event.currentTarget);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            scheduleCaretUpdate(event.currentTarget);
          }}
          onValueChange={handleValueChange}
          placeholder={placeholder}
          readOnly={readOnly}
          render={(inputProps, state) => {
            if (userRender) {
              return typeof userRender === "function"
                ? userRender(inputProps, state)
                : userRender;
            }

            const {
              primitiveClassName,
              primitiveRef,
              primitiveStyle,
              resolvedInputProps,
            } = resolveInputRenderProps(inputProps);

            return (
              <input
                {...resolvedInputProps}
                className={primitiveClassName}
                ref={(node) => {
                  inputRef.current = node;
                  setRef(primitiveRef, node);
                  setRef(forwardRef, node);
                }}
                style={{ ...primitiveStyle, ...style }}
              />
            );
          }}
          required={required}
          type={resolvedType}
          {...(value !== undefined ? { value } : { defaultValue })}
        />
        {smoothCaret ? (
          <>
            <span
              aria-hidden
              className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
              ref={measureRef}
            />
            <motion.div
              className="pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-[1em] w-px self-center bg-foreground"
              style={{ opacity: caretOpacity, x: springCaretX }}
            />
          </>
        ) : null}
      </div>
      {showClear && filled && !disabled && !readOnly ? (
        <button
          aria-label="Clear input"
          className={inputActionClassName}
          data-slot="input-action"
          onClick={handleClear}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          type="button"
        >
          <IconClear />
        </button>
      ) : null}
      {showPasswordToggle && type === "password" && !disabled && !readOnly ? (
        <button
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          aria-pressed={passwordVisible}
          className={inputActionClassName}
          data-slot="input-action"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const input = inputRef.current;
            const selectionStart = input?.selectionStart ?? null;
            const selectionEnd = input?.selectionEnd ?? null;
            setPasswordVisible((current) => !current);
            if (input) {
              requestAnimationFrame(() => {
                input.focus();
                if (selectionStart !== null && selectionEnd !== null) {
                  input.setSelectionRange(selectionStart, selectionEnd);
                }
                scheduleCaretUpdate(input);
              });
            }
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          type="button"
        >
          <PasswordVisibilityIcon
            prefersReducedMotion={prefersReducedMotion === true}
            visible={passwordVisible}
          />
        </button>
      ) : null}
      {endAdornment ? (
        <span className="flex shrink-0 items-center text-muted-foreground">
          {endAdornment}
        </span>
      ) : null}
      {children}
    </div>
  );
}

function InputFieldWrapper({
  children,
  description,
  descriptionClassName,
  descriptionId,
  errorMessage,
  errorMessageClassName,
  errorId,
  label,
  inputId,
  labelClassName,
  required,
  wrapperClassName,
}: {
  children: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  descriptionId?: string;
  errorMessage?: ReactNode;
  errorMessageClassName?: string;
  errorId?: string;
  inputId: string;
  label?: ReactNode;
  labelClassName?: string;
  required: boolean;
  wrapperClassName?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
      {label ? (
        <label
          className={cn("font-medium text-foreground text-sm", labelClassName)}
          htmlFor={inputId}
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

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      "aria-describedby": ariaDescribedByProp,
      "aria-invalid": ariaInvalidProp,
      children,
      className,
      defaultValue,
      description,
      descriptionClassName,
      disabled,
      endAdornment,
      errorMessage,
      errorMessageClassName,
      fontSize,
      id,
      invalid = false,
      label,
      labelClassName,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      onValueChange,
      placeholder,
      readOnly,
      render: userRender,
      required = false,
      shellClassName,
      showClear = false,
      showPasswordToggle: showPasswordToggleProp,
      size = "default",
      spring = DEFAULT_SPRING,
      startAdornment,
      style,
      type = "text",
      value,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const fieldMeta = getInputFieldMeta({
      ariaDescribedByProp,
      ariaInvalidProp,
      description,
      errorMessage,
      generatedId,
      id,
      invalid,
      label,
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [filled, setFilled] = useState(() =>
      getFilledState(value, defaultValue)
    );
    const prefersReducedMotion = useReducedMotion();
    const showPasswordToggle =
      showPasswordToggleProp ?? (type === "password" && !readOnly && !disabled);
    const resolvedType = type === "password" && passwordVisible ? "text" : type;
    const smoothCaret = supportsSmoothCaret(
      resolvedType,
      Boolean(userRender),
      passwordVisible
    );

    const {
      caretOpacity,
      caretOpacityRef,
      containerRef,
      inputRef,
      measureRef,
      scheduleCaretUpdate,
      springCaretX,
      updateCaretRef,
    } = useSmoothCaret({
      passwordVisible,
      prefersReducedMotion,
      spring,
      userRender,
    });

    useSmoothCaretListeners(
      smoothCaret,
      containerRef,
      inputRef,
      updateCaretRef
    );

    const { handleShellMouseDown } = useShellFocus(disabled, inputRef);

    const handleValueChange = useCallback<
      NonNullable<InputPrimitive.Props["onValueChange"]>
    >(
      (nextValue, eventDetails) => {
        setFilled(nextValue.length > 0);
        onValueChange?.(nextValue, eventDetails);

        const target = inputRef.current;
        if (target) {
          scheduleCaretUpdate(target);
        }
      },
      [inputRef, onValueChange, scheduleCaretUpdate]
    );

    const handleClear = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const input = inputRef.current;
        if (!input || disabled || readOnly) {
          return;
        }

        clearNativeInputValue(input);
        setFilled(false);
        onValueChange?.("", {
          event: event.nativeEvent,
          reason: "none",
        } as unknown as InputChangeEventDetails);
        input.focus();
        scheduleCaretUpdate(input);
      },
      [disabled, inputRef, onValueChange, readOnly, scheduleCaretUpdate]
    );

    useEffect(() => {
      if (value !== undefined) {
        setFilled(getFilledState(value, defaultValue));
      }
    }, [defaultValue, value]);

    useEffect(() => {
      if (type !== "password") {
        setPasswordVisible(false);
      }
    }, [type]);

    const shell = (
      <InputShell
        ariaInvalidProp={ariaInvalidProp}
        caretOpacity={caretOpacity}
        caretOpacityRef={caretOpacityRef}
        className={className}
        containerRef={containerRef}
        defaultValue={defaultValue}
        describedBy={fieldMeta.describedBy}
        disabled={disabled}
        endAdornment={endAdornment}
        filled={filled}
        fontSize={fontSize}
        forwardRef={ref}
        handleClear={handleClear}
        handleShellMouseDown={handleShellMouseDown}
        handleValueChange={handleValueChange}
        hasFieldChrome={fieldMeta.hasFieldChrome}
        inputId={fieldMeta.inputId}
        inputProps={props}
        inputRef={inputRef}
        measureRef={measureRef}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        passwordVisible={passwordVisible}
        placeholder={placeholder}
        prefersReducedMotion={prefersReducedMotion}
        readOnly={readOnly}
        required={required}
        resolvedType={resolvedType}
        scheduleCaretUpdate={scheduleCaretUpdate}
        setFilled={setFilled}
        setPasswordVisible={setPasswordVisible}
        shellClassName={shellClassName}
        showClear={showClear}
        showInvalid={fieldMeta.showInvalid}
        showPasswordToggle={showPasswordToggle}
        size={size}
        smoothCaret={smoothCaret}
        springCaretX={springCaretX}
        startAdornment={startAdornment}
        style={style}
        type={type}
        userRender={userRender}
        value={value}
        wrapperClassName={wrapperClassName}
      >
        {children}
      </InputShell>
    );

    if (!fieldMeta.hasFieldChrome) {
      return shell;
    }

    return (
      <InputFieldWrapper
        description={description}
        descriptionClassName={descriptionClassName}
        descriptionId={fieldMeta.descriptionId}
        errorId={fieldMeta.errorId}
        errorMessage={errorMessage}
        errorMessageClassName={errorMessageClassName}
        inputId={fieldMeta.inputId}
        label={label}
        labelClassName={labelClassName}
        required={required}
        wrapperClassName={wrapperClassName}
      >
        {shell}
      </InputFieldWrapper>
    );
  }
);
Input.displayName = "Input";

export { Input };
export type { InputChangeEventDetails } from "@base-ui/react/input";
export type { InputProps, InputSize };
