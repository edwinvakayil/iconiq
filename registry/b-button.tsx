"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
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

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const buttonThemeClassName =
  "[--button-destructive:#dc2626] [--button-input:#e3e7ec] [--button-primary-foreground:#ffffff] [--button-ring:rgba(17,17,17,0.16)] [--button-secondary-foreground:#ffffff] dark:[--button-destructive:#f87171] dark:[--button-input:#2b2a25] dark:[--button-primary-foreground:#111111] dark:[--button-ring:rgba(246,243,236,0.18)] dark:[--button-secondary-foreground:#111111]";

const buttonVariants = cva(
  cn(
    buttonThemeClassName,
    "group/button relative inline-flex shrink-0 cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-[color:var(--button-ring)] focus-visible:ring-3 focus-visible:ring-[color:color-mix(in_oklch,var(--button-ring),transparent_50%)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[color:var(--button-destructive)] aria-invalid:ring-3 aria-invalid:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:aria-invalid:border-[color:color-mix(in_oklch,var(--button-destructive),transparent_50%)] dark:aria-invalid:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-[color:var(--button-primary-foreground)] hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-[color:var(--button-input)] dark:bg-[color-mix(in_oklch,var(--button-input),transparent_70%)] dark:hover:bg-[color-mix(in_oklch,var(--button-input),transparent_50%)]",
        secondary:
          "bg-secondary text-[color:var(--button-secondary-foreground)] hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-[color:var(--button-secondary-foreground)]",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-[color-mix(in_oklch,var(--button-destructive),transparent_90%)] text-[color:var(--button-destructive)] hover:bg-[color-mix(in_oklch,var(--button-destructive),transparent_80%)] focus-visible:border-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] focus-visible:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:bg-[color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:focus-visible:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] dark:hover:bg-[color-mix(in_oklch,var(--button-destructive),transparent_70%)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)]",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonContentClassName =
  "relative z-10 inline-flex items-center justify-center [gap:inherit] whitespace-nowrap text-inherit";

type Ripple = { id: string; x: number; y: number; size: number };

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

type ButtonRenderProps = React.HTMLAttributes<HTMLButtonElement> & {
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

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

const buttonTransition = {
  scale: {
    type: "spring",
    stiffness: 640,
    damping: 38,
    mass: 0.85,
  },
  width: {
    type: "spring",
    stiffness: 420,
    damping: 34,
    mass: 0.9,
  },
  y: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
} as const;

function getButtonAnimate(
  canAnimate: boolean,
  isPressed: boolean,
  animatedWidth: number | undefined
) {
  if (animatedWidth) {
    return {
      scale: canAnimate && isPressed ? 0.985 : 1,
      width: animatedWidth,
    };
  }

  return {
    scale: canAnimate && isPressed ? 0.985 : 1,
  };
}

function resolvePrimitiveButtonProps(buttonProps: ButtonRenderProps) {
  const {
    children: _buttonChildren,
    className: primitiveClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: primitiveRef,
    style: primitiveStyle,
    ...resolvedButtonProps
  } = buttonProps;

  return {
    primitiveClassName,
    primitiveRef,
    primitiveStyle,
    resolvedButtonProps,
  };
}

function RippleLayer({
  ripples,
  setRipples,
}: {
  ripples: Ripple[];
  setRipples: React.Dispatch<React.SetStateAction<Ripple[]>>;
}) {
  return (
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
  );
}

export type ButtonProps = ButtonHTMLAttributesForMotion &
  VariantProps<typeof buttonVariants> & {
    animateSize?: boolean;
    children?: ReactNode;
    disableRipple?: boolean;
    icon?: ReactNode;
    iconPosition?: "start" | "end";
  } & ReducedMotionProp;

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
      reducedMotion,
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
    const [horizontalInset, setHorizontalInset] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const resolvedReducedMotion = useResolvedReducedMotion(reducedMotion);

    const canAnimate = !(disabled || resolvedReducedMotion);
    const allowsRipple = !disableRipple && variant !== "link" && canAnimate;
    const shouldAnimateSize =
      animateSize && !resolvedReducedMotion && style?.width == null;
    const animatedWidth =
      shouldAnimateSize && bounds.width > 0
        ? Math.ceil(bounds.width + horizontalInset)
        : undefined;

    const setButtonRef = useCallback(
      (node: HTMLButtonElement | null) => {
        setButtonNode(node);
        setRef(ref, node);
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
        (Number.parseFloat(styles.borderRightWidth) || 0) +
        (Number.parseFloat(styles.paddingLeft) || 0) +
        (Number.parseFloat(styles.paddingRight) || 0);

      setHorizontalInset((current) => (current === next ? current : next));
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
      <span
        aria-hidden
        className="inline-flex shrink-0 items-center"
        data-icon={iconPosition === "end" ? "inline-end" : "inline-start"}
      >
        {icon}
      </span>
    ) : null;

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <ButtonPrimitive
          className={cn(buttonVariants({ className, size, variant }))}
          data-slot="button"
          disabled={disabled}
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
          render={(buttonProps) => {
            const {
              primitiveClassName,
              primitiveRef,
              primitiveStyle,
              resolvedButtonProps,
            } = resolvePrimitiveButtonProps(buttonProps);

            return (
              <motion.button
                {...resolvedButtonProps}
                animate={getButtonAnimate(canAnimate, isPressed, animatedWidth)}
                className={primitiveClassName}
                data-pressed={isPressed ? "true" : "false"}
                initial={false}
                ref={(node) => {
                  setButtonRef(node);
                  setRef(primitiveRef, node);
                }}
                style={primitiveStyle}
                transition={buttonTransition}
                whileHover={
                  canAnimate && variant !== "link" ? { y: -1 } : undefined
                }
              >
                <RippleLayer ripples={ripples} setRipples={setRipples} />
                <span
                  className={buttonContentClassName}
                  ref={shouldAnimateSize ? contentRef : undefined}
                >
                  {iconPosition === "start" ? renderedIcon : null}
                  {children}
                  {iconPosition === "end" ? renderedIcon : null}
                </span>
              </motion.button>
            );
          }}
          style={style}
          type={type}
          {...props}
        />
      </ReducedMotionConfig>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
