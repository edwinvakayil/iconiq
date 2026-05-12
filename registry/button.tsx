"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const buttonVariantStyles = {
  default: "bg-primary text-background hover:bg-primary/90",
  destructive: "bg-red-600 text-white hover:bg-red-600/90",
  outline:
    "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
  secondary:
    "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-600 dark:text-neutral-50 dark:hover:bg-neutral-500",
  ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

const buttonSizeStyles = {
  sm: "min-h-11 px-3.5 text-xs",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-8 text-base",
  unstyled: "min-h-11 min-w-11 px-0 py-0 text-sm",
} as const;

const buttonVariants = cva(
  "relative inline-flex cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: buttonVariantStyles,
      size: buttonSizeStyles,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const buttonRootVariants = cva(
  "relative inline-flex cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden rounded-lg font-medium transition-[background-color,color,filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[pressed=true]:brightness-95",
  {
    variants: {
      variant: buttonVariantStyles,
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const buttonContentVariants = cva(
  "relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap text-inherit [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      size: buttonSizeStyles,
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type Ripple = { id: string; x: number; y: number; size: number };

/**
 * Prop names that exist on both DOM `button` and `motion.button` but with incompatible types
 * (Motion uses them for gestures / layout animation, not DOM events).
 */
type ButtonHTMLAttributesForMotion = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

function useMeasure<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  { width: number; height: number },
] {
  const [element, setElement] = useState<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!(element && typeof ResizeObserver !== "undefined")) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setBounds((current) => {
        const next = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };

        if (current.width === next.width && current.height === next.height) {
          return current;
        }

        return next;
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds];
}

export type ButtonProps = ButtonHTMLAttributesForMotion &
  VariantProps<typeof buttonVariants> & {
    animateSize?: boolean;
    children?: ReactNode;
    disableRipple?: boolean;
    icon?: ReactNode;
    iconPosition?: "start" | "end";
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      animateSize = false,
      children,
      className,
      disabled,
      disableRipple = false,
      icon,
      iconPosition = "start",
      onBlur,
      onKeyDown,
      onKeyUp,
      onPointerCancel,
      onPointerDown,
      onPointerLeave,
      onPointerUp,
      size,
      style,
      type = "button",
      variant,
      ...props
    },
    ref
  ) => {
    const [buttonNode, setButtonNode] = useState<HTMLButtonElement | null>(
      null
    );
    const [contentRef, bounds] = useMeasure<HTMLSpanElement>();
    const [borderWidth, setBorderWidth] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const prefersReducedMotion = useReducedMotion();

    const canAnimate = !(disabled || prefersReducedMotion);
    const allowsRipple = !disableRipple && variant !== "link" && canAnimate;
    const shouldAnimateSize =
      animateSize && !prefersReducedMotion && style?.width == null;
    const animatedWidth =
      shouldAnimateSize && bounds.width > 0
        ? Math.ceil(bounds.width + borderWidth)
        : undefined;

    const setButtonRef = useCallback(
      (node: HTMLButtonElement | null) => {
        setButtonNode(node);

        if (typeof ref === "function") {
          ref(node);
          return;
        }

        if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    useLayoutEffect(() => {
      if (!(buttonNode && animateSize)) {
        return;
      }

      const styles = window.getComputedStyle(buttonNode);
      const next =
        (Number.parseFloat(styles.borderLeftWidth) || 0) +
        (Number.parseFloat(styles.borderRightWidth) || 0);

      setBorderWidth((current) => (current === next ? current : next));
    });

    useEffect(() => {
      if (disabled) {
        setIsPressed(false);
      }
    }, [disabled]);

    const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);

      if (e.defaultPrevented || disabled) {
        return;
      }

      setIsPressed(true);

      if (!(allowsRipple && e.button === 0)) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleSize =
        2 *
        Math.max(
          Math.hypot(x, y),
          Math.hypot(rect.width - x, y),
          Math.hypot(x, rect.height - y),
          Math.hypot(rect.width - x, rect.height - y)
        );
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      setRipples((current) => [...current, { id, x, y, size: rippleSize }]);
    };

    const handlePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(e);
      setIsPressed(false);
    };

    const handlePointerLeave = (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      setIsPressed(false);
    };

    const handlePointerCancel = (e: PointerEvent<HTMLButtonElement>) => {
      onPointerCancel?.(e);
      setIsPressed(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);

      if (
        e.defaultPrevented ||
        disabled ||
        e.repeat ||
        (e.key !== " " && e.key !== "Enter")
      ) {
        return;
      }

      setIsPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyUp?.(e);

      if (e.key === " " || e.key === "Enter") {
        setIsPressed(false);
      }
    };

    const renderedIcon = icon ? (
      <span aria-hidden className="inline-flex shrink-0 items-center">
        {icon}
      </span>
    ) : null;

    return (
      <motion.button
        animate={
          animatedWidth
            ? {
                scale: canAnimate && isPressed ? 0.985 : 1,
                width: animatedWidth,
              }
            : {
                scale: canAnimate && isPressed ? 0.985 : 1,
              }
        }
        className={cn(buttonRootVariants({ variant }), className)}
        data-pressed={isPressed ? "true" : "false"}
        disabled={disabled}
        initial={false}
        onBlur={(e) => {
          onBlur?.(e);
          setIsPressed(false);
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
        ref={setButtonRef}
        style={style}
        transition={{
          scale: { type: "spring", stiffness: 640, damping: 38, mass: 0.85 },
          width: { type: "spring", stiffness: 420, damping: 34, mass: 0.9 },
          y: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
        }}
        type={type}
        whileHover={canAnimate && variant !== "link" ? { y: -1 } : undefined}
        {...props}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        >
          {ripples.map((ripple) => (
            <motion.span
              animate={{ opacity: 0, scale: 1 }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
              initial={{ opacity: 0.22, scale: 0 }}
              key={ripple.id}
              onAnimationComplete={() => {
                setRipples((current) =>
                  current.filter((item) => item.id !== ripple.id)
                );
              }}
              style={{
                height: ripple.size,
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
              }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        </span>
        <span
          className={buttonContentVariants({ size })}
          ref={shouldAnimateSize ? contentRef : undefined}
        >
          {iconPosition === "start" ? renderedIcon : null}
          {children}
          {iconPosition === "end" ? renderedIcon : null}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
