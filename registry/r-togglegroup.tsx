"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const toggleCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const toggleCornerSmClassName =
  "rounded-[min(var(--radius-md),12px)] supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[14px]";

const toggleGroupCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const toggleGroupCornerSmClassName =
  "data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:supports-[corner-shape:squircle]:corner-squircle data-[size=sm]:supports-[corner-shape:squircle]:rounded-[12px]";

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
    </>
  );
}

const toggleGroupItemVariants = cva(
  cn(
    toggleCornerClassName,
    "relative inline-flex shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap font-medium text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-muted-foreground data-[state=on]:text-foreground",
        outline:
          "border border-input bg-transparent text-muted-foreground data-[state=on]:text-foreground",
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

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleGroupItemVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  variant: "default",
  spacing: 1,
  orientation: "horizontal",
});

type MotionToggleGroupItemProps = React.ComponentProps<"button"> & {
  children: React.ReactNode;
};

const MotionToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  MotionToggleGroupItemProps
>(function MotionToggleGroupItem(
  { children, className, disabled, ...props },
  ref
) {
  const {
    onPointerDown,
    onPointerLeave,
    onPointerUp,
    "data-state": dataState,
    ...resolvedProps
  } = props as React.ComponentProps<"button"> & { "data-state"?: "on" | "off" };
  const isSelected = dataState === "on";
  const fluidMotion = useToggleFluidMotion(isSelected);

  return (
    <button
      className={className}
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
      type="button"
      {...resolvedProps}
      data-state={dataState}
    >
      <ToggleFluidMotionLayers {...fluidMotion}>
        {children}
      </ToggleFluidMotionLayers>
    </button>
  );
});

type ToggleGroupSharedProps = VariantProps<typeof toggleGroupItemVariants> & {
  spacing?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

type ToggleGroupSingleProps = ToggleGroupSharedProps &
  Omit<
    Extract<
      React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
      { type: "single" }
    >,
    "type"
  > & {
    type?: "single";
  };

type ToggleGroupMultipleProps = ToggleGroupSharedProps &
  Omit<
    Extract<
      React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
      { type: "multiple" }
    >,
    "type"
  > & {
    type?: "multiple";
  };

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 1,
  orientation = "horizontal",
  type = "multiple",
  children,
  ...props
}: ToggleGroupProps) {
  const groupClassName = cn(
    "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch",
    toggleGroupCornerClassName,
    toggleGroupCornerSmClassName,
    className
  );
  const groupStyle = { "--gap": spacing } as React.CSSProperties;
  const contextValue = {
    variant,
    size,
    spacing,
    orientation,
  } as const;

  return type === "single" ? (
    <ToggleGroupPrimitive.Root
      className={groupClassName}
      data-orientation={orientation}
      data-size={size}
      data-slot="toggle-group"
      data-spacing={spacing}
      data-variant={variant}
      style={groupStyle}
      type="single"
      {...(props as Omit<
        ToggleGroupSingleProps,
        keyof ToggleGroupSharedProps | "type"
      >)}
    >
      <ToggleGroupContext.Provider value={contextValue}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  ) : (
    <ToggleGroupPrimitive.Root
      className={groupClassName}
      data-orientation={orientation}
      data-size={size}
      data-slot="toggle-group"
      data-spacing={spacing}
      data-variant={variant}
      style={groupStyle}
      type="multiple"
      {...(props as Omit<
        ToggleGroupMultipleProps,
        keyof ToggleGroupSharedProps | "type"
      >)}
    >
      <ToggleGroupContext.Provider value={contextValue}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleGroupItemVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item asChild {...props}>
      <MotionToggleGroupItem
        className={cn(
          "focus:z-10 focus-visible:z-10",
          toggleGroupItemVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          className
        )}
        data-size={context.size || size}
        data-slot="toggle-group-item"
        data-spacing={context.spacing}
        data-variant={context.variant || variant}
      >
        {children}
      </MotionToggleGroupItem>
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem, toggleGroupItemVariants };
