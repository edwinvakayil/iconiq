import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useAnimationControls } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

type Ripple = {
  id: string;
  size: number;
  x: number;
  y: number;
};

function hasTextContent(node: React.ReactNode): boolean {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).trim().length > 0;
  }

  if (Array.isArray(node)) {
    return node.some(hasTextContent);
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return hasTextContent(node.props.children);
  }

  return false;
}

const toggleVariants = cva(
  "group/toggle relative inline-flex touch-manipulation select-none items-center justify-center gap-2 overflow-hidden rounded-lg border font-medium text-[14px] tracking-[-0.01em] transition-[background-color,border-color,color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-transparent bg-muted/58 text-foreground",
        outline:
          "border-border bg-background text-foreground hover:border-foreground/14",
      },
      size: {
        default: "h-10 min-w-10 px-4",
        sm: "h-9 min-w-9 px-3",
        lg: "h-11 min-w-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function getIdleBackground(variant: "default" | "outline" | null | undefined) {
  return variant === "outline" ? "var(--ic-background)" : "var(--ic-muted)";
}

function getIdleBorderColor(variant: "default" | "outline" | null | undefined) {
  return variant === "outline" ? "var(--ic-border)" : "transparent";
}

function getSurfaceStyle(
  pressed: boolean,
  variant: "default" | "outline" | null | undefined
) {
  return {
    backgroundColor: pressed
      ? "var(--ic-foreground)"
      : getIdleBackground(variant),
    borderColor: pressed ? "var(--ic-foreground)" : getIdleBorderColor(variant),
    boxShadow: pressed
      ? "0 8px 20px -16px rgba(17,17,17,0.4)"
      : "0 0 0 rgba(17,17,17,0)",
  };
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants> &
    ReducedMotionProp
>(
  (
    {
      className,
      variant,
      size,
      onPointerDown,
      onPressedChange,
      children,
      reducedMotion,
      ...props
    },
    ref
  ) => {
    const buttonControls = useAnimationControls();
    const iconControls = useAnimationControls();
    const resolvedReducedMotion = useResolvedReducedMotion(reducedMotion);
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const isIconOnly = !hasTextContent(children);
    const canAnimate = !(props.disabled || resolvedReducedMotion);
    const isPressedControlled = props.pressed !== undefined;
    const [uncontrolledPressed, setUncontrolledPressed] = React.useState(
      props.defaultPressed ?? false
    );
    const pressed = isPressedControlled
      ? props.pressed === true
      : uncontrolledPressed;

    const ariaLabel = props["aria-label"];
    const ariaLabelledBy = props["aria-labelledby"];
    const resolvedVariant = variant ?? "default";
    const surfaceStyle = getSurfaceStyle(pressed, resolvedVariant);

    React.useEffect(() => {
      if (process.env.NODE_ENV === "production") {
        return;
      }

      if (!(isIconOnly && !(ariaLabel || ariaLabelledBy))) {
        return;
      }

      console.warn(
        "Toggle: icon-only toggles should include aria-label or aria-labelledby so the control has a clear accessible name."
      );
    }, [ariaLabel, ariaLabelledBy, isIconOnly]);

    const spawnRipple = React.useCallback(
      (target: HTMLButtonElement, x: number, y: number) => {
        if (!canAnimate) {
          return;
        }

        const rect = target.getBoundingClientRect();
        const size =
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

        setRipples((current) => [...current, { id, size, x, y }]);
      },
      [canAnimate]
    );

    const runPressedMotion = React.useCallback(
      (pressed: boolean) => {
        buttonControls.start({
          scale: pressed ? [1, 0.952, 1.036, 1] : [1, 0.974, 1.014, 1],
          y: pressed ? [0, -1.6, -0.2, 0] : [0, -0.85, -0.1, 0],
          transition: {
            duration: 0.48,
            ease: [0.22, 1, 0.36, 1],
          },
        });

        iconControls.start({
          scale: pressed ? [1, 0.9, 1.12, 1.04] : [1, 0.97, 1.04, 1],
          rotate: pressed ? [0, -9, -3] : [-3, 4, 0],
          x: pressed ? [0, 2.8, 1.6] : [1.6, -0.8, 0],
          y: pressed ? [0, -1.1, -0.4] : [-0.4, 0.35, 0],
          transition: {
            type: "spring",
            stiffness: 210,
            damping: 15,
            mass: 0.85,
          },
        });
      },
      [buttonControls, iconControls]
    );

    const handlePressedChange = (pressed: boolean) => {
      if (!isPressedControlled) {
        setUncontrolledPressed(pressed);
      }

      if (canAnimate) {
        runPressedMotion(pressed);
      }

      onPressedChange?.(pressed);
    };

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <TogglePrimitive.Root
          asChild
          onPressedChange={handlePressedChange}
          ref={ref}
          {...props}
        >
          <motion.button
            animate={buttonControls}
            className={cn(
              componentThemeClassName,
              toggleVariants({ variant, size }),
              isIconOnly && "px-0",
              className
            )}
            onPointerDown={(event) => {
              onPointerDown?.(event);

              if (event.defaultPrevented || event.button !== 0) {
                return;
              }

              const rect = event.currentTarget.getBoundingClientRect();
              spawnRipple(
                event.currentTarget,
                event.clientX - rect.left,
                event.clientY - rect.top
              );
            }}
            style={surfaceStyle}
            whileHover={
              canAnimate
                ? {
                    scale: 1.008,
                    y: -0.5,
                    transition: { type: "spring", stiffness: 280, damping: 24 },
                  }
                : undefined
            }
            whileTap={canAnimate ? { scale: 0.978, y: 0.2 } : undefined}
          >
            <motion.span
              animate={
                pressed
                  ? {
                      opacity: 1,
                      x: 0,
                    }
                  : {
                      opacity: 0,
                      x: -8,
                    }
              }
              aria-hidden
              className="absolute inset-0 z-0 rounded-[inherit] bg-background/12 dark:bg-neutral-950/12"
              initial={false}
              transition={
                canAnimate
                  ? {
                      duration: 0.28,
                      ease: [0.22, 1, 0.36, 1],
                    }
                  : { duration: 0.14 }
              }
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
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
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}
            </span>
            <motion.span
              animate={
                canAnimate
                  ? {
                      x: pressed ? 1.1 : 0,
                      y: pressed ? -0.1 : 0,
                    }
                  : undefined
              }
              className="relative z-20 inline-flex"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
                mass: 0.9,
              }}
            >
              <motion.span
                animate={iconControls}
                className={cn(
                  "inline-flex items-center gap-2 transition-[color,transform] duration-200 [&_svg]:size-4 [&_svg]:shrink-0",
                  pressed
                    ? "text-background dark:text-neutral-950"
                    : "text-foreground",
                  isIconOnly && "gap-0"
                )}
                style={{ transformOrigin: "center" }}
              >
                {children}
              </motion.span>
            </motion.span>
          </motion.button>
        </TogglePrimitive.Root>
      </ReducedMotionConfig>
    );
  }
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
