"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const toggleCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const toggleCornerSmClassName =
  "rounded-[min(var(--radius-md),12px)] supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[14px]";

const togglePressedTextBase =
  "text-muted-foreground aria-pressed:text-foreground data-pressed:text-foreground";

const toggleFillClassName =
  "pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-muted supports-[corner-shape:squircle]:[corner-shape:inherit]";

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

function resolveIsPressed({
  isPressed,
  "data-state": dataState,
  "data-pressed": dataPressed,
  "aria-pressed": ariaPressed,
}: {
  isPressed?: boolean;
  "data-state"?: string;
  "data-pressed"?: string | boolean;
  "aria-pressed"?: boolean | "true" | "false" | "mixed";
}) {
  if (isPressed !== undefined) {
    return isPressed;
  }

  if (dataState === "on") {
    return true;
  }

  if (dataState === "off") {
    return false;
  }

  if (dataPressed === true || dataPressed === "true" || dataPressed === "") {
    return true;
  }

  if (dataPressed === false || dataPressed === "false") {
    return false;
  }

  if (ariaPressed === true || ariaPressed === "true") {
    return true;
  }

  if (ariaPressed === false || ariaPressed === "false") {
    return false;
  }

  return false;
}

function setToggleRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function useToggleFluidMotion(isPressed: boolean) {
  const fillProgress = useMotionValue(isPressed ? 1 : 0);
  const iconScale = useMotionValue(isPressed ? 1 : ICON_REST);
  const iconScaleX = useMotionValue(1);
  const iconScaleY = useMotionValue(1);
  const sheenX = useMotionValue(-0.4);
  const sheenOpacity = useMotionValue(0);

  const fillOpacity = useTransform(fillProgress, [0, 1], [0, 1]);
  const sheenLeft = useTransform(sheenX, (value) => `${value * 100}%`);

  const prevPressedRef = React.useRef(isPressed);
  const isPointerDownRef = React.useRef(false);

  React.useEffect(() => {
    if (prevPressedRef.current === isPressed) {
      return;
    }

    prevPressedRef.current = isPressed;

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
    sheenOpacity,
    sheenX,
  ]);

  const resetTapScale = React.useCallback(() => {
    animate(iconScaleX, 1, FLUID_SNAP);
    animate(iconScaleY, 1, FLUID_SNAP);
  }, [iconScaleX, iconScaleY]);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, disabled?: boolean) => {
      if (event.defaultPrevented || disabled || event.button !== 0) {
        return;
      }

      isPointerDownRef.current = true;

      animate(iconScaleX, 0.86, FLUID_TAP);
      animate(iconScaleY, 1.08, FLUID_TAP);
    },
    [iconScaleX, iconScaleY]
  );

  const handlePointerUp = React.useCallback(() => {
    if (!isPointerDownRef.current) {
      return;
    }

    isPointerDownRef.current = false;
    resetTapScale();
  }, [resetTapScale]);

  const handlePointerLeave = React.useCallback(() => {
    if (!isPointerDownRef.current) {
      return;
    }

    isPointerDownRef.current = false;
    resetTapScale();
  }, [resetTapScale]);

  return {
    fillOpacity,
    sheenLeft,
    sheenOpacity,
    iconScale,
    iconScaleX,
    iconScaleY,
    handlePointerDown,
    handlePointerUp,
    handlePointerLeave,
  };
}

function ToggleFluidMotionLayers({
  children,
  fillOpacity,
  sheenLeft,
  sheenOpacity,
  iconScale,
  iconScaleX,
  iconScaleY,
}: ReturnType<typeof useToggleFluidMotion> & {
  children: React.ReactNode;
}) {
  return (
    <>
      <motion.span
        aria-hidden
        className={toggleFillClassName}
        style={{
          opacity: fillOpacity,
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
      <span className="relative z-10 inline-flex items-center justify-center gap-[inherit] [&_svg]:shrink-0">
        <motion.span
          className="inline-flex origin-center items-center justify-center gap-[inherit]"
          style={{ scale: iconScale }}
        >
          <motion.span
            className="inline-flex origin-center items-center justify-center gap-[inherit] [&_svg]:block"
            style={{
              scaleX: iconScaleX,
              scaleY: iconScaleY,
            }}
          >
            {children}
          </motion.span>
        </motion.span>
      </span>
    </>
  );
}

type FluidToggleButtonProps = React.ComponentProps<"button"> & {
  children: React.ReactNode;
  isPressed?: boolean;
  "data-pressed"?: string | boolean;
  "data-state"?: "on" | "off" | string;
};

const FluidToggleButton = React.forwardRef<
  HTMLButtonElement,
  FluidToggleButtonProps
>(function FluidToggleButton(
  {
    children,
    className,
    disabled,
    isPressed: isPressedProp,
    onPointerDown,
    onPointerLeave,
    onPointerUp,
    type = "button",
    "aria-pressed": ariaPressed,
    "data-pressed": dataPressed,
    "data-state": dataState,
    ...props
  },
  ref
) {
  const isPressed = resolveIsPressed({
    isPressed: isPressedProp,
    "aria-pressed": ariaPressed,
    "data-pressed": dataPressed,
    "data-state": dataState,
  });
  const fluidMotion = useToggleFluidMotion(isPressed);

  return (
    <button
      aria-pressed={ariaPressed}
      className={className}
      data-pressed={dataPressed}
      data-state={dataState}
      disabled={disabled}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        fluidMotion.handlePointerDown(event, disabled);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        fluidMotion.handlePointerLeave();
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        fluidMotion.handlePointerUp();
      }}
      ref={ref}
      type={type}
      {...props}
    >
      <ToggleFluidMotionLayers {...fluidMotion}>
        {children}
      </ToggleFluidMotionLayers>
    </button>
  );
});

FluidToggleButton.displayName = "FluidToggleButton";
const toggleVariants = cva(
  cn(
    toggleCornerClassName,
    "group/toggle relative inline-flex cursor-pointer items-center justify-center gap-1 overflow-hidden whitespace-nowrap font-medium text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default: cn("bg-transparent", togglePressedTextBase),
        outline: cn(
          "border border-input bg-transparent",
          togglePressedTextBase
        ),
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: cn(
          "h-7 min-w-7 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
          toggleCornerSmClassName
        ),
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ToggleProps = TogglePrimitive.Props & VariantProps<typeof toggleVariants>;

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    className,
    variant = "default",
    size = "default",
    pressed,
    defaultPressed = false,
    disabled,
    children,
    ...props
  },
  forwardedRef
) {
  const isControlled = pressed !== undefined;
  const rootClassName = cn(toggleVariants({ variant, size, className }));

  return (
    <TogglePrimitive
      {...props}
      data-slot="toggle"
      defaultPressed={isControlled ? undefined : defaultPressed}
      disabled={disabled}
      pressed={pressed}
      render={(renderProps, state) => {
        const {
          className: renderClassName,
          onPointerDown: _onPointerDown,
          onPointerLeave: _onPointerLeave,
          onPointerUp: _onPointerUp,
          ref: renderRef,
          ...resolvedRenderProps
        } = renderProps;

        return (
          <FluidToggleButton
            {...resolvedRenderProps}
            className={cn(rootClassName, renderClassName)}
            isPressed={state.pressed}
            ref={(node) => {
              setToggleRef(forwardedRef, node);
              setToggleRef(renderRef, node);
            }}
          >
            {children}
          </FluidToggleButton>
        );
      }}
    />
  );
});

Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
export type { ToggleProps };
