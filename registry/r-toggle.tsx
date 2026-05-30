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
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

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
  "group/toggle relative inline-flex touch-manipulation select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md font-medium text-sm transition-[color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-foreground hover:bg-muted hover:text-foreground",
        outline:
          "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-4.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants> &
    ReducedMotionProp
>(
  (
    {
      children,
      className,
      onPressedChange,
      reducedMotion,
      size,
      variant,
      ...props
    },
    ref
  ) => {
    const buttonControls = useAnimationControls();
    const iconControls = useAnimationControls();
    const resolvedReducedMotion = useResolvedReducedMotion(reducedMotion);
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

    const runPressedMotion = React.useCallback(
      (nextPressed: boolean) => {
        buttonControls.start({
          scale: nextPressed ? [1, 0.968, 1.022, 1] : [1, 0.982, 1.01, 1],
          y: nextPressed ? [0, -0.8, 0] : [0, -0.3, 0],
          transition: {
            duration: 0.34,
            ease: [0.22, 1, 0.36, 1],
          },
        });

        iconControls.start({
          scale: nextPressed ? [1, 0.9, 1.08, 1] : [1, 0.96, 1.02, 1],
          rotate: nextPressed ? [0, -8, 0] : [0, 4, 0],
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 18,
            mass: 0.8,
          },
        });
      },
      [buttonControls, iconControls]
    );

    const handlePressedChange = (nextPressed: boolean) => {
      if (!isPressedControlled) {
        setUncontrolledPressed(nextPressed);
      }

      if (canAnimate) {
        runPressedMotion(nextPressed);
      }

      onPressedChange?.(nextPressed);
    };

    const selectedClasses =
      "border-border bg-accent text-accent-foreground shadow-sm";
    const overlayTransition = canAnimate
      ? {
          duration: 0.26,
          ease: [0.22, 1, 0.36, 1] as const,
        }
      : { duration: 0.14 };

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
              pressed && selectedClasses,
              isIconOnly && "px-0",
              className
            )}
            style={undefined}
            whileHover={
              canAnimate
                ? {
                    scale: 1.01,
                    y: -0.5,
                    transition: { type: "spring", stiffness: 300, damping: 24 },
                  }
                : undefined
            }
            whileTap={canAnimate ? { scale: 0.985, y: 0.15 } : undefined}
          >
            <motion.span
              animate={
                pressed
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }
                  : {
                      opacity: 0,
                      scale: 0.92,
                      y: 2,
                    }
              }
              aria-hidden
              className="absolute inset-0 z-0 rounded-[inherit] bg-accent"
              initial={false}
              transition={overlayTransition}
            />
            <motion.span
              animate={
                canAnimate
                  ? {
                      x: pressed ? 0.8 : 0,
                    }
                  : undefined
              }
              className="relative z-10 inline-flex items-center gap-2"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 20,
                mass: 0.85,
              }}
            >
              <motion.span
                animate={iconControls}
                className={cn(
                  "inline-flex items-center gap-2 transition-colors duration-200",
                  pressed ? "text-accent-foreground" : "text-foreground",
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
