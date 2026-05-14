import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

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
  "group/toggle relative inline-flex touch-manipulation select-none items-center justify-center gap-2 rounded-lg border border-transparent font-medium text-sm transition-[background-color,color,box-shadow,transform] before:pointer-events-auto before:absolute before:-inset-1 before:rounded-[inherit] before:content-[''] hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-sm data-[state=on]:ring-1 data-[state=on]:ring-foreground/10 data-[state=on]:ring-inset",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-11 min-w-11 px-4",
        sm: "h-10 min-w-10 px-3",
        lg: "h-12 min-w-12 px-5",
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
    VariantProps<typeof toggleVariants>
>(
  (
    {
      className,
      variant,
      size,
      onPointerDown,
      onPressedChange,
      children,
      ...props
    },
    ref
  ) => {
    const buttonControls = useAnimationControls();
    const iconControls = useAnimationControls();
    const prefersReducedMotion = useReducedMotion() ?? false;
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const isIconOnly = !hasTextContent(children);
    const canAnimate = !(props.disabled || prefersReducedMotion);

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

    const handlePressedChange = (pressed: boolean) => {
      if (canAnimate) {
        buttonControls.start({
          scale: [1, 0.985, 1.01, 1],
          y: [0, -0.5, 0],
          transition: {
            duration: 0.34,
            ease: [0.16, 1, 0.3, 1],
          },
        });

        iconControls.start({
          scale: pressed ? [1, 0.97, 1.02, 1] : [1, 0.985, 1.015, 1],
          rotate: pressed ? [0, -4, 0] : [0, 3, 0],
          x: pressed ? [0, 1.2, 0] : [0, -0.8, 0],
          y: pressed ? [0, -0.6, 0] : [0, 0.35, 0],
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 0.9,
          },
        });
      }

      onPressedChange?.(pressed);
    };

    return (
      <TogglePrimitive.Root
        asChild
        onPressedChange={handlePressedChange}
        ref={ref}
        {...props}
      >
        <motion.button
          animate={buttonControls}
          className={cn(
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
          whileHover={
            canAnimate
              ? {
                  scale: 1.006,
                  y: -0.5,
                  transition: { type: "spring", stiffness: 320, damping: 26 },
                }
              : undefined
          }
          whileTap={canAnimate ? { scale: 0.985, y: 0 } : undefined}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
          >
            {ripples.map((ripple) => (
              <motion.span
                animate={{ opacity: 0, scale: 1 }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
                initial={{ opacity: 0.16, scale: 0 }}
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
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </span>
          <motion.span
            animate={iconControls}
            className={cn(
              "relative z-10 inline-flex items-center gap-2 transition-transform [&_svg]:size-4 [&_svg]:shrink-0 group-data-[state=on]/toggle:[&_svg]:scale-105",
              isIconOnly && "gap-0"
            )}
            style={{ transformOrigin: "center" }}
          >
            {children}
          </motion.span>
        </motion.button>
      </TogglePrimitive.Root>
    );
  }
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
