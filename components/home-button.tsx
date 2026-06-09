"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import Link from "next/link";
import {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type FocusEventHandler,
  forwardRef,
  type KeyboardEvent,
  type KeyboardEventHandler,
  memo,
  type PointerEvent,
  type PointerEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const buttonThemeClassName =
  "[--button-destructive:#dc2626] [--button-input:#e3e7ec] [--button-primary-foreground:#ffffff] [--button-ring:rgba(17,17,17,0.16)] [--button-ripple:color-mix(in_oklch,var(--foreground),transparent_72%)] [--button-secondary-foreground:#ffffff] dark:[--button-destructive:#f87171] dark:[--button-input:#2b2a25] dark:[--button-primary-foreground:#111111] dark:[--button-ring:rgba(246,243,236,0.18)] dark:[--button-ripple:color-mix(in_oklch,var(--foreground),transparent_72%)] dark:[--button-secondary-foreground:#111111]";

const buttonVariants = cva(
  cn(
    buttonThemeClassName,
    "group/button relative inline-flex shrink-0 cursor-pointer touch-manipulation select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm no-underline outline-none transition-[background-color,border-color,color,box-shadow] focus-visible:border-[color:var(--button-ring)] focus-visible:ring-3 focus-visible:ring-[color:color-mix(in_oklch,var(--button-ring),transparent_50%)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[color:var(--button-destructive)] aria-invalid:ring-3 aria-invalid:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:aria-invalid:border-[color:color-mix(in_oklch,var(--button-destructive),transparent_50%)] dark:aria-invalid:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default:
          "visited:!text-primary-foreground hover:!text-primary-foreground focus-visible:!text-primary-foreground active:!text-primary-foreground bg-primary text-primary-foreground [--button-ripple:color-mix(in_oklch,var(--primary-foreground),transparent_45%)] hover:bg-primary dark:[--button-ripple:color-mix(in_oklch,#111111,transparent_10%)] [&_svg]:text-primary-foreground",
        outline:
          "hover:!text-foreground aria-expanded:!text-foreground border-border bg-background [--button-ripple:color-mix(in_oklch,var(--foreground),transparent_52%)] hover:bg-accent/60 aria-expanded:bg-muted dark:border-[color:var(--button-input)] dark:bg-[color-mix(in_oklch,var(--button-input),transparent_70%)] dark:hover:bg-[color-mix(in_oklch,var(--button-input),transparent_50%)] dark:[--button-ripple:color-mix(in_oklch,var(--foreground),transparent_28%)]",
        secondary:
          "aria-expanded:!text-secondary-foreground hover:!text-secondary-foreground bg-secondary text-secondary-foreground [--button-ripple:color-mix(in_oklch,var(--secondary-foreground),transparent_45%)] hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary dark:[--button-ripple:color-mix(in_oklch,var(--secondary-foreground),transparent_15%)] [&_svg]:text-secondary-foreground",
        ghost:
          "hover:!text-foreground aria-expanded:!text-foreground hover:bg-accent/60 aria-expanded:bg-muted dark:hover:bg-muted/50",
        destructive:
          "hover:!text-[color:var(--button-destructive)] bg-[color-mix(in_oklch,var(--button-destructive),transparent_90%)] text-[color:var(--button-destructive)] [--button-ripple:color-mix(in_oklch,var(--button-destructive),transparent_55%)] hover:bg-[color-mix(in_oklch,var(--button-destructive),transparent_80%)] focus-visible:border-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] focus-visible:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:bg-[color-mix(in_oklch,var(--button-destructive),transparent_80%)] dark:focus-visible:ring-[color:color-mix(in_oklch,var(--button-destructive),transparent_60%)] dark:hover:bg-[color-mix(in_oklch,var(--button-destructive),transparent_70%)]",
        link: "",
      },
      linkUnderline: {
        motion: "",
        static: "",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-4 text-base leading-5 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        icon: "size-8",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 in-data-[slot=button-group]:rounded-lg rounded-[min(var(--radius-md),12px)]",
        "icon-lg": "size-9",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        linkUnderline: "motion",
        class:
          "hover:!text-foreground focus-visible:!text-foreground px-0 text-foreground shadow-none active:translate-y-0 [&_[data-link-label]]:font-medium [&_[data-link-label]]:text-[1em]",
      },
      {
        variant: "link",
        linkUnderline: "static",
        class:
          "hover:!text-foreground focus-visible:!text-foreground px-0 text-foreground underline-offset-4 hover:underline [&_[data-link-label]]:font-medium [&_[data-link-label]]:text-[1em]",
      },
      {
        variant: "link",
        size: "default",
        class: "h-8 px-0 text-sm leading-5",
      },
      {
        variant: "link",
        size: "lg",
        class: "h-10 px-0 text-base leading-5",
      },
      {
        variant: "link",
        size: "sm",
        class: "h-7 px-0 text-[0.8rem]",
      },
      {
        variant: "link",
        size: "xs",
        class: "h-6 px-0 text-xs",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      linkUnderline: "motion",
    },
  }
);

const linkUnderlineFillTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 36,
  mass: 0.65,
};

const MAX_RIPPLES = 3;

const LinkUnderlineLabel = memo(function LinkUnderlineLabel({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <span className="relative inline-block pb-px font-medium text-[1em] leading-[inherit]">
      <span className="relative z-10" data-link-label>
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-muted-foreground/50"
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-foreground"
        transition={linkUnderlineFillTransition}
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
      />
    </span>
  );
});

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

function useMeasure<T extends HTMLElement = HTMLElement>(
  enabled: boolean
): [(node: T | null) => void, { width: number; height: number }] {
  const [element, setElement] = useState<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!(enabled && element && typeof ResizeObserver !== "undefined")) {
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
  }, [element, enabled]);

  return [ref, enabled ? bounds : { width: 0, height: 0 }];
}

const MotionLink = motion.create(Link);

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

function omitLinkMotionConflicts<T extends Record<string, unknown>>(props: T) {
  const {
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
    ...rest
  } = props;

  return rest;
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

const RippleLayer = memo(function RippleLayer({
  onRippleComplete,
  ripples,
}: {
  ripples: Ripple[];
  onRippleComplete: (id: string) => void;
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
          onAnimationComplete={() => onRippleComplete(ripple.id)}
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
});

type ButtonInteractionElement = HTMLButtonElement | HTMLAnchorElement;

type ButtonInteractionHandlers = {
  onBlur?: FocusEventHandler<ButtonInteractionElement>;
  onKeyDown?: KeyboardEventHandler<ButtonInteractionElement>;
  onKeyUp?: KeyboardEventHandler<ButtonInteractionElement>;
  onPointerCancel?: PointerEventHandler<ButtonInteractionElement>;
  onPointerDown?: PointerEventHandler<ButtonInteractionElement>;
  onPointerLeave?: PointerEventHandler<ButtonInteractionElement>;
  onPointerUp?: PointerEventHandler<ButtonInteractionElement>;
};

export type ButtonProps = Omit<
  ButtonHTMLAttributesForMotion,
  keyof ButtonInteractionHandlers
> &
  ButtonInteractionHandlers &
  VariantProps<typeof buttonVariants> & {
    animateSize?: boolean;
    children?: ReactNode;
    disableRipple?: boolean;
    href?: string;
    icon?: ReactNode;
    iconPosition?: "start" | "end";
  };

const ButtonInner = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      animateSize = false,
      children,
      className,
      disabled,
      disableRipple = false,
      href,
      icon,
      iconPosition = "start",
      linkUnderline,
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
    const buttonNodeRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(
      null
    );
    const rippleIdRef = useRef(0);
    const [horizontalInset, setHorizontalInset] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const shouldAnimateSize = animateSize && style?.width == null;
    const [contentRef, bounds] = useMeasure<HTMLSpanElement>(shouldAnimateSize);
    const resolvedLinkUnderline =
      variant === "link" ? (linkUnderline ?? "motion") : undefined;
    const useLinkMotionUnderline = resolvedLinkUnderline === "motion";

    const canAnimate = !disabled;
    const allowsRipple = !disableRipple && variant !== "link" && canAnimate;
    const animatedWidth =
      shouldAnimateSize && bounds.width > 0
        ? Math.ceil(bounds.width + horizontalInset)
        : undefined;

    const setButtonRef = useCallback(
      (node: HTMLButtonElement | HTMLAnchorElement | null) => {
        buttonNodeRef.current = node;
        setRef(ref, node);
      },
      [ref]
    );

    useLayoutEffect(() => {
      const buttonNode = buttonNodeRef.current;
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
    }, [animateSize]);

    const handleRippleComplete = useCallback((id: string) => {
      setRipples((current) => current.filter((item) => item.id !== id));
    }, []);

    useEffect(() => {
      if (disabled) {
        setIsPressed(false);
      }
    }, [disabled]);

    const handlePointerDown = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
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
      rippleIdRef.current += 1;
      const id = `ripple-${rippleIdRef.current}`;

      setRipples((current) => {
        const next = [...current, { id, x, y, size: rippleSize }];
        return next.length > MAX_RIPPLES
          ? next.slice(next.length - MAX_RIPPLES)
          : next;
      });
    };

    const handlePointerUp = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
      onPointerUp?.(e);
      setIsPressed(false);
    };

    const handlePointerLeave = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
      onPointerLeave?.(e);
      setIsPressed(false);
    };

    const handlePointerCancel = (
      e: PointerEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
      onPointerCancel?.(e);
      setIsPressed(false);
    };

    const handleKeyDown = (e: KeyboardEvent<ButtonInteractionElement>) => {
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

    const handleKeyUp = (e: KeyboardEvent<ButtonInteractionElement>) => {
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

    const rootClassName = cn(
      buttonVariants({
        className,
        linkUnderline: resolvedLinkUnderline,
        size,
        variant,
      }),
      disabled && "pointer-events-none opacity-50"
    );

    const buttonLabel = (
      <LinkUnderlineLabel enabled={resolvedLinkUnderline === "motion"}>
        {children}
      </LinkUnderlineLabel>
    );

    const motionAnimate = useMemo(
      () => getButtonAnimate(canAnimate, isPressed, animatedWidth),
      [animatedWidth, canAnimate, isPressed]
    );

    const motionSurfaceProps = useMemo(
      () =>
        useLinkMotionUnderline
          ? {
              animate: motionAnimate,
              "data-pressed": isPressed ? "true" : "false",
              initial: "rest" as const,
              transition: buttonTransition,
              variants: { rest: {}, hover: {} },
              whileHover: "hover" as const,
            }
          : {
              animate: motionAnimate,
              "data-pressed": isPressed ? "true" : "false",
              initial: false as const,
              transition: buttonTransition,
              whileHover:
                canAnimate && variant !== "link" ? { y: -1 } : undefined,
            },
      [canAnimate, isPressed, motionAnimate, useLinkMotionUnderline, variant]
    );

    const buttonSurface = (
      <>
        <RippleLayer
          onRippleComplete={handleRippleComplete}
          ripples={ripples}
        />
        <span
          className={buttonContentClassName}
          ref={shouldAnimateSize ? contentRef : undefined}
        >
          {iconPosition === "start" ? renderedIcon : null}
          {buttonLabel}
          {iconPosition === "end" ? renderedIcon : null}
        </span>
      </>
    );

    if (href) {
      const { onClick, ...linkProps } = omitLinkMotionConflicts(
        props as ComponentPropsWithoutRef<typeof Link>
      );

      return (
        <MotionLink
          {...motionSurfaceProps}
          {...linkProps}
          aria-disabled={disabled || undefined}
          className={rootClassName}
          data-slot="button"
          href={href}
          onBlur={(e) => {
            onBlur?.(e);
            setIsPressed(false);
          }}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
            }
            onClick?.(e);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);

            if (
              e.defaultPrevented ||
              disabled ||
              e.repeat ||
              e.key !== "Enter"
            ) {
              return;
            }

            setIsPressed(true);
          }}
          onKeyUp={(e) => {
            onKeyUp?.(e);

            if (e.key === "Enter") {
              setIsPressed(false);
            }
          }}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          onPointerUp={handlePointerUp}
          ref={setButtonRef}
          style={style}
          tabIndex={disabled ? -1 : undefined}
        >
          {buttonSurface}
        </MotionLink>
      );
    }

    return (
      <ButtonPrimitive
        className={rootClassName}
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
              {...motionSurfaceProps}
              className={primitiveClassName}
              ref={(node) => {
                setButtonRef(node);
                setRef(primitiveRef, node);
                setRef(ref, node);
              }}
              style={primitiveStyle}
              type={type}
            >
              {buttonSurface}
            </motion.button>
          );
        }}
        style={style}
        type={type}
        {...props}
      />
    );
  }
);

ButtonInner.displayName = "Button";

const Button = memo(ButtonInner);

export { Button, buttonVariants };
