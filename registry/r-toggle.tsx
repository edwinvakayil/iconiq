"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { Toggle as TogglePrimitive } from "radix-ui";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const MAX_BUBBLES = 3;
const BUBBLE_FALLBACK_MS = 700;

const fillSpring = { type: "spring", stiffness: 420, damping: 24 } as const;
const iconSpring = { type: "spring", stiffness: 560, damping: 26 } as const;
const bubbleSpring = { type: "spring", stiffness: 260, damping: 22 } as const;
const reducedTransition = { duration: 0.12 } as const;

type Bubble = {
  id: string;
  size: number;
  x: number;
  y: number;
};

const toggleVariants = cva(
  "group/toggle relative inline-flex items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-lg font-medium text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent",
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ToggleProps = React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> &
  ReducedMotionProp;

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function createBubble(
  target: HTMLButtonElement | null,
  clientX: number,
  clientY: number
): Bubble | null {
  if (!target) {
    return null;
  }

  const rect = target.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const size =
    2 *
    Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y)
    );

  return {
    id: `bubble-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    size: Math.max(size, 1),
    x,
    y,
  };
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    className,
    variant = "default",
    size = "default",
    pressed,
    defaultPressed = false,
    disabled,
    onPointerDown,
    onPressedChange,
    children,
    reducedMotion,
    ...props
  },
  forwardedRef
) {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const bubbleIdRef = React.useRef(0);
  const bubbleTimeoutsRef = React.useRef<Map<string, number>>(new Map());
  const isControlled = pressed !== undefined;
  const [uncontrolledPressed, setUncontrolledPressed] =
    React.useState(defaultPressed);
  const [bubbles, setBubbles] = React.useState<Bubble[]>([]);
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const isPressed = isControlled ? Boolean(pressed) : uncontrolledPressed;

  React.useEffect(() => {
    if (!isControlled) {
      setUncontrolledPressed(defaultPressed);
    }
  }, [defaultPressed, isControlled]);

  React.useEffect(() => {
    if (disabled) {
      setBubbles([]);
    }
  }, [disabled]);

  React.useEffect(() => {
    const timeouts = bubbleTimeoutsRef.current;

    return () => {
      for (const timeoutId of timeouts.values()) {
        window.clearTimeout(timeoutId);
      }

      timeouts.clear();
    };
  }, []);

  const clearBubbleTimeout = React.useCallback((id: string) => {
    const timeoutId = bubbleTimeoutsRef.current.get(id);

    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      bubbleTimeoutsRef.current.delete(id);
    }
  }, []);

  const removeBubble = React.useCallback(
    (id: string) => {
      clearBubbleTimeout(id);
      setBubbles((current) => current.filter((bubble) => bubble.id !== id));
    },
    [clearBubbleTimeout]
  );

  const handlePressedChange = React.useCallback<
    NonNullable<
      React.ComponentProps<typeof TogglePrimitive.Root>["onPressedChange"]
    >
  >(
    (next) => {
      if (!isControlled) {
        setUncontrolledPressed(next);
      }

      onPressedChange?.(next);
    },
    [isControlled, onPressedChange]
  );

  const scheduleBubbleRemoval = React.useCallback(
    (id: string) => {
      clearBubbleTimeout(id);

      const timeoutId = window.setTimeout(() => {
        removeBubble(id);
      }, BUBBLE_FALLBACK_MS);

      bubbleTimeoutsRef.current.set(id, timeoutId);
    },
    [clearBubbleTimeout, removeBubble]
  );

  const spawnBubble = React.useCallback(
    (target: HTMLButtonElement | null, clientX: number, clientY: number) => {
      if (disabled || reduceMotion) {
        return;
      }

      const bubble = createBubble(target, clientX, clientY);

      if (!bubble) {
        return;
      }

      bubbleIdRef.current += 1;
      const nextBubble = { ...bubble, id: `bubble-${bubbleIdRef.current}` };

      setBubbles((current) => {
        const next = [...current, nextBubble];
        return next.length > MAX_BUBBLES
          ? next.slice(next.length - MAX_BUBBLES)
          : next;
      });
      scheduleBubbleRemoval(nextBubble.id);
    },
    [disabled, reduceMotion, scheduleBubbleRemoval]
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);

      if (event.defaultPrevented || disabled || event.button !== 0) {
        return;
      }

      const target = event.currentTarget ?? buttonRef.current;
      const { clientX, clientY } = event;

      spawnBubble(target, clientX, clientY);
    },
    [disabled, onPointerDown, spawnBubble]
  );

  const mergeRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      setRef(forwardedRef, node);
    },
    [forwardedRef]
  );

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <TogglePrimitive.Root
        {...props}
        className={cn(toggleVariants({ variant, size, className }))}
        data-slot="toggle"
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onPressedChange={handlePressedChange}
        pressed={pressed}
        ref={mergeRefs}
        {...(isControlled ? {} : { defaultPressed })}
      >
        <AnimatePresence initial={false}>
          {isPressed ? (
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 origin-center rounded-[inherit] bg-muted"
              exit={{ opacity: 0, scale: 0.72 }}
              initial={{ opacity: 0, scale: 0.72 }}
              key="toggle-fill"
              transition={reduceMotion ? reducedTransition : fillSpring}
            />
          ) : null}
        </AnimatePresence>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit]"
        >
          {bubbles.map((bubble) => (
            <motion.span
              animate={{ opacity: 0, scale: 1.25 }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/30 dark:bg-foreground/35"
              initial={{ opacity: 0.45, scale: 0 }}
              key={bubble.id}
              onAnimationComplete={() => removeBubble(bubble.id)}
              style={{
                height: bubble.size,
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
              }}
              transition={reduceMotion ? reducedTransition : bubbleSpring}
            />
          ))}
        </span>
        <span className="relative z-10 inline-flex origin-center items-center justify-center gap-1">
          <motion.span
            animate={{ scale: isPressed ? 1 : 0.92 }}
            className="inline-flex items-center justify-center gap-1"
            initial={false}
            transition={reduceMotion ? reducedTransition : iconSpring}
          >
            {children}
          </motion.span>
        </span>
      </TogglePrimitive.Root>
    </ReducedMotionConfig>
  );
});

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
