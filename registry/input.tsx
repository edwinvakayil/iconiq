"use client";

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
  useLayoutEffect,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

const DEFAULT_SPRING = {
  stiffness: 500,
  damping: 30,
  mass: 0.5,
} as const;

const FIREFOX_USER_AGENT_PATTERN = /firefox|fxios/i;
const CHROME_USER_AGENT_PATTERN = /chrome|chromium|crios/i;

const inputShellClassName = cn(
  "relative w-full rounded-lg border border-input bg-background transition-[color,box-shadow,border-color]",
  "hover:border-ring/40",
  "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
  "[&:has(input:disabled)]:cursor-not-allowed [&:has(input:disabled)]:opacity-50",
  "[&:has(input[aria-invalid=true])]:border-destructive [&:has(input[aria-invalid=true])]:ring-2 [&:has(input[aria-invalid=true])]:ring-destructive/20"
);

const inputClassName = cn(
  "h-11 w-full bg-transparent px-3.5 text-base outline-none sm:text-sm",
  "text-foreground placeholder:text-muted-foreground",
  "[-webkit-tap-highlight-color:transparent]"
);

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

type InputProps = InputPrimitive.Props & {
  fontSize?: number;
  label?: ReactNode;
  labelClassName?: string;
  spring?: SpringConfig;
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

function scrollCaretIntoView(target: HTMLInputElement, absoluteWidth: number) {
  const styles = window.getComputedStyle(target);
  const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
  const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
  const visibleRight = target.scrollLeft + target.clientWidth - paddingRight;
  const visibleLeft = target.scrollLeft + paddingLeft;

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

function supportsSmoothCaret(type?: string) {
  return type !== "file" && type !== "hidden";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      defaultValue,
      disabled,
      fontSize,
      id,
      label,
      labelClassName,
      onBlur,
      onChange,
      onFocus,
      onValueChange,
      placeholder = "input",
      render: userRender,
      spring = DEFAULT_SPRING,
      style,
      type = "text",
      value,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const caretX = useMotionValue(0);
    const caretOpacity = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const smoothCaret = supportsSmoothCaret(type);

    const springCaretX = useSpring(
      caretX,
      prefersReducedMotion
        ? { stiffness: 10_000, damping: 100, mass: 0.1 }
        : spring
    );

    const syncMeasureSpan = () => {
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
    };

    const measurePrefixWidth = (text: string) => {
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
    };

    const updateCaretFromInput = (target: HTMLInputElement) => {
      if (!supportsSmoothCaret(target.type)) {
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

      scrollCaretIntoView(target, absoluteWidth);

      const styles = window.getComputedStyle(target);
      const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
      const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
      const caretPosition = absoluteWidth - target.scrollLeft;
      const minX = paddingLeft - 1;
      const maxX = target.clientWidth - paddingRight;
      const isCaretVisible = caretPosition >= minX && caretPosition <= maxX + 1;

      caretX.set(Math.min(caretPosition, maxX));

      if (!isCaretVisible || hasSelection) {
        caretOpacity.set(0);
        return;
      }

      caretOpacity.set(1);
    };

    const updateCaretRef = useRef(updateCaretFromInput);
    updateCaretRef.current = updateCaretFromInput;
    const caretOpacityRef = useRef(caretOpacity);
    caretOpacityRef.current = caretOpacity;

    const scheduleCaretUpdate = useCallback((target: HTMLInputElement) => {
      requestAnimationFrame(() => {
        updateCaretRef.current(target);
      });
    }, []);

    const handleValueChange = useCallback<
      NonNullable<InputPrimitive.Props["onValueChange"]>
    >(
      (nextValue, eventDetails) => {
        onValueChange?.(nextValue, eventDetails);

        const target = inputRef.current;
        if (target) {
          scheduleCaretUpdate(target);
        }
      },
      [onValueChange, scheduleCaretUpdate]
    );

    useLayoutEffect(() => {
      const input = inputRef.current;
      if (input && document.activeElement === input) {
        updateCaretRef.current(input);
      }
    });

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
      document.fonts.addEventListener("loadingdone", updateCaretIfFocused);
      document.fonts.ready.then(updateCaretIfFocused).catch(() => undefined);
      input.addEventListener("scroll", updateCaretIfFocused);

      const resizeObserver = new ResizeObserver(updateCaretIfFocused);
      resizeObserver.observe(container);

      updateCaretIfFocused();

      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
        document.fonts.removeEventListener("loadingdone", updateCaretIfFocused);
        input.removeEventListener("scroll", updateCaretIfFocused);
        resizeObserver.disconnect();
      };
    }, [smoothCaret]);

    const field = (
      <div
        className={cn(
          inputShellClassName,
          label ? undefined : wrapperClassName
        )}
      >
        <div
          className="relative grid h-11 grid-cols-1"
          ref={containerRef}
          style={{
            ...(smoothCaret ? { caretColor: "transparent" } : undefined),
            ...(fontSize === undefined ? undefined : { fontSize }),
          }}
        >
          <InputPrimitive
            {...props}
            className={cn(
              inputClassName,
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
              onChange?.(event);
              scheduleCaretUpdate(event.currentTarget);
            }}
            onFocus={(event) => {
              onFocus?.(event);
              scheduleCaretUpdate(event.currentTarget);
            }}
            onValueChange={handleValueChange}
            placeholder={placeholder}
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
                    setRef(ref, node);
                  }}
                  style={{ ...primitiveStyle, ...style }}
                />
              );
            }}
            type={type}
            {...(value !== undefined ? { value } : {})}
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
      </div>
    );

    if (!label) {
      return field;
    }

    return (
      <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
        <label
          className={cn("font-medium text-foreground text-sm", labelClassName)}
          htmlFor={inputId}
        >
          {label}
        </label>
        {field}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export type { InputChangeEventDetails } from "@base-ui/react/input";
export type { InputProps };
