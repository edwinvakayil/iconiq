"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "framer-motion";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type PointerEvent,
  type ReactNode,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /* Use text-background on primary fills: --primary-foreground is not in @theme, so
           text-primary-foreground was a no-op and labels inherited --foreground (invisible on black primary). */
        default: "bg-primary text-background hover:bg-primary/90",
        destructive: "bg-red-600 text-white hover:bg-red-600/90",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        /* Neutral greys: light #e5e5e5 (neutral-200), dark #525252 (neutral-600) — works without --secondary-foreground in @theme */
        secondary:
          "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-600 dark:text-neutral-50 dark:hover:bg-neutral-500",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "cursor-pointer text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-8 text-base",
        custom: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type Ripple = { id: string; x: number; y: number; size: number };

/**
 * Prop names that exist on both DOM `button` and `motion.button` but with incompatible types
 * (Framer Motion uses them for gestures / layout animation, not DOM events).
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

type ButtonProps = ButtonHTMLAttributesForMotion &
  VariantProps<typeof buttonVariants> & {
    children?: ReactNode;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      onPointerDown,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const prefersReducedMotion = useReducedMotion();

    const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (disabled || e.button !== 0 || prefersReducedMotion) {
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
      setRipples((r) => [...r, { id, x, y, size: rippleSize }]);
    };

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled}
        onPointerDown={handlePointerDown}
        ref={ref}
        type={type}
        {...props}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        >
          {ripples.map((r) => (
            <motion.span
              animate={{ opacity: 0, scale: 1 }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
              initial={{ opacity: 0.4, scale: 0 }}
              key={r.id}
              onAnimationComplete={() => {
                setRipples((current) =>
                  current.filter((ripple) => ripple.id !== r.id)
                );
              }}
              style={{
                height: r.size,
                left: r.x,
                top: r.y,
                width: r.size,
              }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        </span>
        <span className="relative z-10 text-inherit">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
