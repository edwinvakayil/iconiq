"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { Toggle as TogglePrimitive } from "radix-ui";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const ICON_REST = 0.93;

const FLUID_FILL = {
  type: "spring" as const,
  stiffness: 210,
  damping: 28,
  mass: 1.08,
};
const FLUID_ICON = {
  type: "spring" as const,
  stiffness: 340,
  damping: 32,
  mass: 0.92,
};
const FLUID_TAP = {
  type: "spring" as const,
  stiffness: 520,
  damping: 34,
  mass: 0.72,
};
const FLUID_SNAP = {
  type: "spring" as const,
  duration: 0.45,
  bounce: 0.32,
};
const FLUID_SHEEN = {
  duration: 0.58,
  ease: [0.22, 1, 0.36, 1] as const,
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

function runSheenSweep(
  sheenX: ReturnType<typeof useMotionValue<number>>,
  sheenOpacity: ReturnType<typeof useMotionValue<number>>
) {
  sheenX.set(-0.4);
  sheenOpacity.set(0.85);

  animate(sheenX, 1.4, FLUID_SHEEN);
  animate(sheenOpacity, 0, {
    duration: 0.58,
    ease: [0.4, 0, 0.2, 1],
  });
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
    onPointerLeave,
    onPointerUp,
    onPressedChange,
    children,
    reducedMotion,
    ...props
  },
  forwardedRef
) {
  const isControlled = pressed !== undefined;
  const [uncontrolledPressed, setUncontrolledPressed] =
    React.useState(defaultPressed);
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const isPressed = isControlled ? Boolean(pressed) : uncontrolledPressed;

  const fillProgress = useMotionValue(isPressed ? 1 : 0);
  const iconScale = useMotionValue(isPressed ? 1 : ICON_REST);
  const iconScaleX = useMotionValue(1);
  const iconScaleY = useMotionValue(1);
  const sheenX = useMotionValue(-0.4);
  const sheenOpacity = useMotionValue(0);

  const fillScaleX = useTransform(fillProgress, [0, 1], [0, 1]);
  const fillOpacity = useTransform(fillProgress, [0, 0.1, 1], [0, 0.92, 1]);
  const sheenLeft = useTransform(sheenX, (value) => `${value * 100}%`);

  const [wipeOrigin, setWipeOrigin] = React.useState("left center");
  const prevPressedRef = React.useRef(isPressed);
  const isPointerDownRef = React.useRef(false);

  React.useEffect(() => {
    if (prevPressedRef.current === isPressed) {
      return;
    }

    prevPressedRef.current = isPressed;
    setWipeOrigin(isPressed ? "left center" : "right center");

    if (reduceMotion) {
      fillProgress.set(isPressed ? 1 : 0);
      iconScale.set(isPressed ? 1 : ICON_REST);
      iconScaleX.set(1);
      iconScaleY.set(1);
      sheenOpacity.set(0);
      return;
    }

    animate(fillProgress, isPressed ? 1 : 0, FLUID_FILL);
    animate(iconScale, isPressed ? 1 : ICON_REST, FLUID_ICON);
    runSheenSweep(sheenX, sheenOpacity);

    animate(iconScaleX, 1.1, FLUID_TAP).then(() => {
      animate(iconScaleX, 1, FLUID_SNAP);
    });
    animate(iconScaleY, 0.91, FLUID_TAP).then(() => {
      animate(iconScaleY, 1, FLUID_SNAP);
    });
  }, [
    fillProgress,
    iconScale,
    iconScaleX,
    iconScaleY,
    isPressed,
    reduceMotion,
    sheenOpacity,
    sheenX,
  ]);

  React.useEffect(() => {
    if (!isControlled) {
      setUncontrolledPressed(defaultPressed);
    }
  }, [defaultPressed, isControlled]);

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

  const resetTapScale = React.useCallback(() => {
    if (reduceMotion) {
      iconScaleX.set(1);
      iconScaleY.set(1);
      return;
    }

    animate(iconScaleX, 1, FLUID_SNAP);
    animate(iconScaleY, 1, FLUID_SNAP);
  }, [iconScaleX, iconScaleY, reduceMotion]);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);

      if (event.defaultPrevented || disabled || event.button !== 0) {
        return;
      }

      isPointerDownRef.current = true;

      if (!reduceMotion) {
        animate(iconScaleX, 0.86, FLUID_TAP);
        animate(iconScaleY, 1.08, FLUID_TAP);
      }
    },
    [disabled, iconScaleX, iconScaleY, onPointerDown, reduceMotion]
  );

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(event);

      if (!isPointerDownRef.current) {
        return;
      }

      isPointerDownRef.current = false;
      resetTapScale();
    },
    [onPointerUp, resetTapScale]
  );

  const handlePointerLeave = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(event);

      if (!isPointerDownRef.current) {
        return;
      }

      isPointerDownRef.current = false;
      resetTapScale();
    },
    [onPointerLeave, resetTapScale]
  );

  const mergeRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
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
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
        onPressedChange={handlePressedChange}
        pressed={pressed}
        ref={mergeRefs}
        {...(isControlled ? {} : { defaultPressed })}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-muted"
          style={{
            opacity: fillOpacity,
            scaleX: fillScaleX,
            transformOrigin: wipeOrigin,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit]"
        >
          <motion.span
            className="absolute inset-y-[-20%] w-[42%] -skew-x-[18deg] bg-gradient-to-r from-transparent via-foreground/18 to-transparent dark:via-foreground/26"
            style={{
              left: sheenLeft,
              opacity: sheenOpacity,
            }}
          />
        </span>
        <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <motion.span
            className="inline-flex origin-center items-center justify-center"
            style={{ scale: iconScale }}
          >
            <motion.span
              className="inline-flex origin-center items-center justify-center [&_svg]:block"
              style={{
                scaleX: iconScaleX,
                scaleY: iconScaleY,
              }}
            >
              {children}
            </motion.span>
          </motion.span>
        </span>
      </TogglePrimitive.Root>
    </ReducedMotionConfig>
  );
});

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
