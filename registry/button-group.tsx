"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { LayoutGroup, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

type ButtonGroupSize = "sm" | "md" | "lg";
type ButtonVariant = "default" | "destructive" | "ghost" | "outline";

type ButtonGroupContextValue = {
  connected: boolean;
  size: ButtonGroupSize;
};

const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(
  null
);

function useButtonGroupContext() {
  return React.useContext(ButtonGroupContext);
}

function resolveButtonGroupSize(
  size: ButtonGroupSize | undefined,
  context: ButtonGroupContextValue | null
) {
  return size ?? context?.size ?? "md";
}

function shouldApplyTheme(context: ButtonGroupContextValue | null) {
  return !context?.connected;
}

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  decorative?: boolean;
  orientation?: "horizontal" | "vertical";
};

function Separator({
  className,
  decorative = true,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <div
      aria-hidden={decorative || undefined}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      data-slot="separator"
      role={decorative ? "presentation" : "separator"}
      {...props}
    />
  );
}

const buttonGroupVariants = cva(
  "flex w-fit items-stretch overflow-hidden rounded-lg border border-border bg-background has-[>[data-slot=button-group-items]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>[data-slot]]:rounded-none [&>[data-slot]~[data-slot]]:border-border [&>[data-slot]~[data-slot]]:border-l",
        vertical:
          "flex-col [&>[data-slot]]:rounded-none [&>[data-slot]~[data-slot]]:border-border [&>[data-slot]~[data-slot]]:border-t",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

const actionButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap py-0 font-medium outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
        destructive:
          "bg-background text-destructive hover:bg-destructive/10 hover:text-destructive",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        outline:
          "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
      },
      connected: {
        true: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        false:
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      },
    },
    defaultVariants: {
      variant: "default",
      connected: false,
    },
  }
);

const MotionButton = motion.button;

type Ripple = { id: string; x: number; y: number; size: number };

type MotionSafeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragStart"
>;

type ButtonGroupChild = React.ReactElement<MotionSafeButtonProps>;

const rootSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "min-h-8 rounded-md px-2.5 text-xs",
  md: "min-h-9 rounded-lg px-3 text-sm",
  lg: "min-h-10 rounded-lg px-4 text-sm",
};

const connectedRootSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "min-h-8 px-2.5 text-xs",
  md: "min-h-9 px-3 text-sm",
  lg: "min-h-10 px-4 text-sm",
};

const iconSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "size-8 rounded-md",
  md: "size-9 rounded-lg",
  lg: "size-10 rounded-lg",
};

const connectedIconSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "size-8",
  md: "size-9",
  lg: "size-10",
};

const textSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "px-2 text-xs",
  md: "px-2.5 text-sm",
  lg: "px-3 text-sm",
};

const groupItemSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "min-h-8 min-w-8 px-2.5 text-xs",
  md: "min-h-9 min-w-9 px-3 text-sm",
  lg: "min-h-10 min-w-10 px-4 text-sm",
};

const segmentedShellSizeStyles: Record<
  ButtonGroupSize,
  { horizontal: string; vertical: string }
> = {
  sm: {
    horizontal: "gap-0.5 p-0.5",
    vertical: "gap-0.5 p-0.5",
  },
  md: {
    horizontal: "gap-0.5 p-0.5",
    vertical: "gap-0.5 p-0.5",
  },
  lg: {
    horizontal: "gap-1 p-1",
    vertical: "gap-1 p-1",
  },
};

const segmentedItemSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "min-h-7 flex-1 px-2.5 text-xs",
  md: "min-h-8 flex-1 px-3 text-sm",
  lg: "min-h-9 flex-1 px-4 text-sm",
};

const segmentedIndicatorTransition = {
  type: "spring" as const,
  stiffness: 170,
  damping: 21,
  mass: 0.9,
  bounce: 0,
};

const contentSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "gap-1.5 [&_svg]:size-3.5 [&_svg]:shrink-0",
  md: "gap-1.5 [&_svg]:size-4 [&_svg]:shrink-0",
  lg: "gap-2 [&_svg]:size-4 [&_svg]:shrink-0",
};

interface ButtonProps extends MotionSafeButtonProps {
  children: React.ReactNode;
  disableRipple?: boolean;
  showBorder?: boolean;
  size?: ButtonGroupSize;
  variant?: ButtonVariant;
}

interface RippleButtonProps extends MotionSafeButtonProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  disableRipple?: boolean;
  themed?: boolean;
}

function getButtonGroupItemKey(child: ButtonGroupChild, index: number) {
  if (child.key != null) {
    return child.key;
  }

  const { children, name, value } = child.props;
  const ariaLabel = child.props["aria-label"];

  if (typeof value === "string" || typeof value === "number") {
    return `value-${value}-${index}`;
  }

  if (typeof name === "string" && name.length > 0) {
    return `name-${name}-${index}`;
  }

  if (typeof ariaLabel === "string" && ariaLabel.length > 0) {
    return `label-${ariaLabel}-${index}`;
  }

  if (typeof children === "string" && children.trim().length > 0) {
    return `text-${children.trim()}-${index}`;
  }

  return `button-group-item-${index}`;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    {
      className,
      children,
      contentClassName,
      disabled,
      disableRipple,
      onPointerDown,
      themed = true,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);

      if (disabled || disableRipple || e.button !== 0) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
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

      setRipples((current) => [...current, { id, x, y, size }]);
    };

    return (
      <MotionButton
        className={cn(
          themed && componentThemeClassName,
          "relative cursor-pointer touch-manipulation select-none overflow-hidden",
          className
        )}
        data-slot="button"
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
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        </span>
        <span
          className={cn(
            "relative z-10 inline-flex items-center gap-2",
            contentClassName
          )}
        >
          {children}
        </span>
      </MotionButton>
    );
  }
);
RippleButton.displayName = "RippleButton";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      disableRipple = false,
      showBorder = true,
      size,
      variant = "default",
      disabled,
      ...props
    },
    ref
  ) => {
    const groupContext = useButtonGroupContext();
    const resolvedSize = resolveButtonGroupSize(size, groupContext);
    const connected = groupContext?.connected ?? false;
    const showStandaloneBorder =
      !connected && variant !== "ghost" && showBorder;

    return (
      <RippleButton
        className={cn(
          actionButtonVariants({
            variant,
            connected,
          }),
          showStandaloneBorder && "border border-border",
          connected
            ? connectedRootSizeStyles[resolvedSize]
            : rootSizeStyles[resolvedSize],
          className
        )}
        contentClassName={contentSizeStyles[resolvedSize]}
        disabled={disabled}
        disableRipple={disableRipple}
        ref={ref}
        themed={shouldApplyTheme(groupContext)}
        {...props}
      >
        {children}
      </RippleButton>
    );
  }
);
Button.displayName = "Button";

interface IconButtonProps extends MotionSafeButtonProps {
  children: React.ReactNode;
  disableRipple?: boolean;
  showBorder?: boolean;
  size?: ButtonGroupSize;
  variant?: ButtonVariant;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      children,
      disableRipple = false,
      showBorder = true,
      size,
      variant = "default",
      disabled,
      ...props
    },
    ref
  ) => {
    const groupContext = useButtonGroupContext();
    const resolvedSize = resolveButtonGroupSize(size, groupContext);
    const connected = groupContext?.connected ?? false;
    const showStandaloneBorder =
      !connected && variant !== "ghost" && showBorder;

    return (
      <RippleButton
        className={cn(
          actionButtonVariants({
            variant,
            connected,
          }),
          showStandaloneBorder && "border border-border",
          connected
            ? connectedIconSizeStyles[resolvedSize]
            : iconSizeStyles[resolvedSize],
          className
        )}
        contentClassName={contentSizeStyles[resolvedSize]}
        disabled={disabled}
        disableRipple={disableRipple}
        ref={ref}
        themed={shouldApplyTheme(groupContext)}
        {...props}
      >
        {children}
      </RippleButton>
    );
  }
);
IconButton.displayName = "IconButton";

type ButtonGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof buttonGroupVariants> & {
    size?: ButtonGroupSize;
  };

function ButtonGroup({
  className,
  orientation,
  role = "group",
  size = "md",
  children,
  ...props
}: ButtonGroupProps) {
  const contextValue = React.useMemo(
    () => ({
      connected: true,
      size,
    }),
    [size]
  );

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div
        className={cn(
          componentThemeClassName,
          buttonGroupVariants({ orientation }),
          "*:focus-visible:relative *:focus-visible:z-10",
          className
        )}
        data-orientation={orientation ?? "horizontal"}
        data-slot="button-group"
        role={role}
        {...props}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const groupContext = useButtonGroupContext();
  const resolvedSize = resolveButtonGroupSize(undefined, groupContext);
  const connected = groupContext?.connected ?? false;

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          shouldApplyTheme(groupContext) && componentThemeClassName,
          "flex items-center gap-2 font-medium text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
          connected
            ? "rounded-none border-0 bg-muted"
            : "rounded-lg border border-border bg-muted",
          textSizeStyles[resolvedSize],
          className
        ),
      },
      {
        ...props,
        "data-slot": "button-group-text",
      } as typeof props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  });
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        "relative self-stretch bg-input data-horizontal:mx-px data-vertical:my-px data-vertical:h-auto data-horizontal:w-auto",
        className
      )}
      data-horizontal={orientation === "horizontal" ? "" : undefined}
      data-orientation={orientation}
      data-slot="button-group-separator"
      data-vertical={orientation === "vertical" ? "" : undefined}
      orientation={orientation}
      {...props}
    />
  );
}

interface ButtonGroupItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disableRipple?: boolean;
  showDividers?: boolean;
  size?: ButtonGroupSize;
}

type HoverFrame = {
  height: number;
  width: number;
  x: number;
  y: number;
};

function ButtonGroupItems({
  children,
  className,
  disableRipple = false,
  onPointerLeave,
  role = "group",
  showDividers = true,
  size: sizeProp,
  ...props
}: ButtonGroupItemsProps) {
  const groupContext = useButtonGroupContext();
  const resolvedSize = resolveButtonGroupSize(sizeProp, groupContext);
  const connected = groupContext?.connected ?? false;
  const [activeHoverIndex, setActiveHoverIndex] = React.useState<number | null>(
    null
  );
  const [hoverFrame, setHoverFrame] = React.useState<HoverFrame | null>(null);
  const groupRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const childArray = React.Children.toArray(children).filter(
    (child): child is ButtonGroupChild =>
      React.isValidElement<MotionSafeButtonProps>(child)
  );
  const usesSharedHover = !showDividers;

  const updateHoverFrame = React.useCallback((index: number) => {
    const group = groupRef.current;
    const node = itemRefs.current[index];

    if (!(group && node)) {
      return;
    }

    const groupRect = group.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const next = {
      height: nodeRect.height,
      width: nodeRect.width,
      x: nodeRect.left - groupRect.left,
      y: nodeRect.top - groupRect.top,
    };

    setHoverFrame((current) => {
      if (
        current?.height === next.height &&
        current?.width === next.width &&
        current?.x === next.x &&
        current?.y === next.y
      ) {
        return current;
      }

      return next;
    });
  }, []);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const allChildren = React.Children.toArray(children);

    if (allChildren.length === 0) {
      console.warn("[ButtonGroupItems] Pass at least one button-like child.");
      return;
    }

    if (childArray.length !== allChildren.length) {
      console.warn(
        "[ButtonGroupItems] Only valid button-like React elements are rendered. Non-element children are ignored."
      );
    }
  }, [childArray.length, children]);

  React.useEffect(() => {
    if (!usesSharedHover || activeHoverIndex === null) {
      return;
    }

    const group = groupRef.current;
    const activeNode = itemRefs.current[activeHoverIndex];

    if (!group) {
      return;
    }

    const handleMeasure = () => {
      updateHoverFrame(activeHoverIndex);
    };

    const resizeObserver = new ResizeObserver(handleMeasure);
    resizeObserver.observe(group);

    if (activeNode) {
      resizeObserver.observe(activeNode);
    }

    window.addEventListener("resize", handleMeasure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleMeasure);
    };
  }, [activeHoverIndex, updateHoverFrame, usesSharedHover]);

  if (childArray.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        shouldApplyTheme(groupContext) && componentThemeClassName,
        "relative inline-flex items-stretch bg-background",
        connected
          ? "rounded-none border-0"
          : ["rounded-lg", showDividers && "border border-border"],
        className
      )}
      data-slot="button-group-items"
      onPointerLeave={(event) => {
        onPointerLeave?.(event);

        if (usesSharedHover) {
          setActiveHoverIndex(null);
          setHoverFrame(null);
        }
      }}
      ref={groupRef}
      role={role}
      {...props}
    >
      {usesSharedHover && hoverFrame ? (
        <motion.span
          animate={{
            height: hoverFrame.height,
            left: hoverFrame.x,
            opacity: 1,
            top: hoverFrame.y,
            width: hoverFrame.width,
          }}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 z-0 rounded-md bg-muted/45"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 34,
            mass: 0.8,
          }}
        />
      ) : null}
      {childArray.map((child, index) => {
        const itemKey = getButtonGroupItemKey(child, index);
        const isFirst = index === 0;
        const isLast = index === childArray.length - 1;
        const {
          children: childChildren,
          className: childClassName,
          onBlur: childOnBlur,
          onFocus: childOnFocus,
          onPointerEnter: childOnPointerEnter,
          onPointerLeave: childOnPointerLeave,
          ...childProps
        } = child.props;
        const showSharedHover = usesSharedHover && activeHoverIndex === index;

        return (
          <RippleButton
            className={cn(
              "relative inline-flex items-center justify-center whitespace-nowrap py-0 font-medium text-muted-foreground transition-colors hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              "disabled:pointer-events-none disabled:opacity-50",
              groupItemSizeStyles[resolvedSize],
              showDividers
                ? [isFirst && "rounded-l-[7px]", isLast && "rounded-r-[7px]"]
                : "rounded-md",
              showSharedHover && "text-foreground",
              !(usesSharedHover || showDividers) && "hover:bg-muted",
              showDividers && "hover:bg-muted",
              showDividers && !isLast && "border-border border-r",
              childClassName
            )}
            contentClassName={contentSizeStyles[resolvedSize]}
            disableRipple={disableRipple}
            key={itemKey}
            onBlur={(event) => {
              childOnBlur?.(event);

              if (
                groupRef.current?.contains(event.relatedTarget as Node | null)
              ) {
                return;
              }

              setActiveHoverIndex((current) =>
                current === index ? null : current
              );
              setHoverFrame(null);
            }}
            onFocus={(event) => {
              childOnFocus?.(event);

              if (usesSharedHover) {
                setActiveHoverIndex(index);
                updateHoverFrame(index);
              }
            }}
            onPointerEnter={(event) => {
              childOnPointerEnter?.(event);

              if (usesSharedHover) {
                setActiveHoverIndex(index);
                updateHoverFrame(index);
              }
            }}
            onPointerLeave={childOnPointerLeave}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            themed={false}
            {...childProps}
          >
            {childChildren}
          </RippleButton>
        );
      })}
    </div>
  );
}

type SegmentedControlOptionObject = {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type SegmentedControlOption = string | SegmentedControlOptionObject;

type NormalizedSegmentedOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value?: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  disabled?: boolean;
  layoutId?: string;
  name?: string;
  orientation?: "horizontal" | "vertical";
  size?: ButtonGroupSize;
}

function normalizeSegmentedOptions(
  options: SegmentedControlOption[]
): NormalizedSegmentedOption[] {
  return options.map((option) => {
    if (typeof option === "string") {
      return {
        value: option,
        label: option,
      };
    }

    return {
      value: option.value,
      label: option.label ?? option.value,
      disabled: option.disabled,
      icon: option.icon,
    };
  });
}

function getEnabledOptionIndex(
  options: NormalizedSegmentedOption[],
  startIndex: number,
  direction: 1 | -1
) {
  if (options.length === 0) {
    return -1;
  }

  let index = startIndex;

  for (const _option of options) {
    index = (index + direction + options.length) % options.length;

    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function isRtlElement(element: HTMLElement | null) {
  if (!element) {
    return false;
  }

  const dir = window.getComputedStyle(element).direction;

  return dir === "rtl";
}

function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  ariaLabelledBy,
  className,
  disabled = false,
  layoutId,
  name,
  orientation = "horizontal",
  size = "md",
}: SegmentedControlProps) {
  const instanceId = React.useId();
  const resolvedLayoutId = layoutId ?? `segmented-indicator-${instanceId}`;
  const normalizedOptions = React.useMemo(
    () => normalizeSegmentedOptions(options),
    [options]
  );
  const initialValue = normalizedOptions.find(
    (option) => !option.disabled
  )?.value;
  const [selected, setSelected] = React.useState(value ?? initialValue ?? "");
  const [isHovered, setIsHovered] = React.useState<string | null>(null);
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const groupRef = React.useRef<HTMLDivElement | null>(null);
  const resolvedSelected =
    normalizedOptions.find(
      (option) => option.value === selected && !option.disabled
    )?.value ??
    normalizedOptions.find((option) => !option.disabled)?.value ??
    "";

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    if (!(ariaLabel || ariaLabelledBy)) {
      console.warn(
        "[SegmentedControl] Provide ariaLabel or ariaLabelledBy for accessibility."
      );
    }

    const values = normalizedOptions.map((option) => option.value);
    const uniqueValues = new Set(values);

    if (uniqueValues.size !== values.length) {
      console.warn(
        "[SegmentedControl] Option values must be unique. Duplicate values can break selection."
      );
    }
  }, [ariaLabel, ariaLabelledBy, normalizedOptions]);

  React.useEffect(() => {
    buttonRefs.current.length = normalizedOptions.length;
  }, [normalizedOptions.length]);

  React.useEffect(() => {
    if (value !== undefined) {
      const next =
        normalizedOptions.find(
          (option) => option.value === value && !option.disabled
        )?.value ??
        normalizedOptions.find((option) => !option.disabled)?.value ??
        "";

      setSelected((current) => (current === next ? current : next));
      return;
    }

    setSelected((current) => {
      const stillValid = normalizedOptions.some(
        (option) => option.value === current && !option.disabled
      );

      if (stillValid) {
        return current;
      }

      return normalizedOptions.find((option) => !option.disabled)?.value ?? "";
    });
  }, [normalizedOptions, value]);

  const handleSelect = (nextValue: string) => {
    const option = normalizedOptions.find((item) => item.value === nextValue);

    if (!option || option.disabled || disabled) {
      return;
    }

    if (nextValue === resolvedSelected) {
      return;
    }

    setSelected(nextValue);
    onChange?.(nextValue);
  };

  const focusOption = (index: number) => {
    buttonRefs.current[index]?.focus();
  };

  const moveSelection = (index: number) => {
    const option = normalizedOptions[index];

    if (!option || option.disabled) {
      return;
    }

    handleSelect(option.value);
    focusOption(index);
  };

  const moveByDirection = (index: number, direction: 1 | -1) => {
    const nextIndex = getEnabledOptionIndex(
      normalizedOptions,
      index,
      direction
    );

    if (nextIndex === -1) {
      return;
    }

    moveSelection(nextIndex);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const rtl = isRtlElement(groupRef.current);
    const horizontalNext = rtl ? -1 : 1;
    const horizontalPrevious = rtl ? 1 : -1;

    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault();
        moveByDirection(
          index,
          orientation === "horizontal" ? horizontalNext : 1
        );
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        moveByDirection(
          index,
          orientation === "horizontal" ? horizontalPrevious : -1
        );
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        moveByDirection(index, orientation === "vertical" ? 1 : horizontalNext);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        moveByDirection(
          index,
          orientation === "vertical" ? -1 : horizontalPrevious
        );
        break;
      }
      case "Home": {
        event.preventDefault();
        moveSelection(getEnabledOptionIndex(normalizedOptions, -1, 1));
        break;
      }
      case "End": {
        event.preventDefault();
        moveSelection(getEnabledOptionIndex(normalizedOptions, 0, -1));
        break;
      }
      default:
        break;
    }
  };

  if (normalizedOptions.length === 0) {
    return null;
  }

  return (
    <div
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-orientation={orientation}
      className={cn(
        componentThemeClassName,
        "relative inline-flex items-stretch rounded-lg border border-border bg-background",
        orientation === "vertical" ? "flex-col" : "flex-row",
        segmentedShellSizeStyles[size][orientation],
        disabled && "pointer-events-none opacity-60",
        className
      )}
      ref={groupRef}
      role="radiogroup"
    >
      {name && !disabled ? (
        <input name={name} type="hidden" value={resolvedSelected} />
      ) : null}
      <LayoutGroup id={resolvedLayoutId}>
        {normalizedOptions.map((option, index) => {
          const isSelected = resolvedSelected === option.value;
          const showHover = isHovered === option.value && !isSelected;
          const isOptionDisabled = disabled || option.disabled;

          return (
            <motion.button
              aria-checked={isSelected}
              aria-disabled={isOptionDisabled || undefined}
              className={cn(
                "relative z-10 inline-flex cursor-pointer touch-manipulation select-none items-center justify-center whitespace-nowrap rounded-md py-0 font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                segmentedItemSizeStyles[size],
                isSelected ? "text-foreground" : "text-muted-foreground",
                isOptionDisabled && "cursor-not-allowed opacity-50"
              )}
              disabled={isOptionDisabled}
              key={option.value}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPointerEnter={() => {
                if (!isOptionDisabled) {
                  setIsHovered(option.value);
                }
              }}
              onPointerLeave={() =>
                setIsHovered((current) =>
                  current === option.value ? null : current
                )
              }
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              role="radio"
              tabIndex={isSelected && !isOptionDisabled ? 0 : -1}
              type="button"
              whileTap={isOptionDisabled ? undefined : { scale: 0.96 }}
            >
              {isSelected ? (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 z-0 rounded-md bg-accent will-change-[transform,width,height]"
                  initial={false}
                  layoutId={resolvedLayoutId}
                  transition={segmentedIndicatorTransition}
                />
              ) : null}
              <motion.span
                animate={{
                  opacity: showHover ? 1 : 0,
                }}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 rounded-md bg-muted/40"
                initial={false}
                transition={{
                  duration: 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <motion.span
                animate={{
                  opacity: isSelected ? 1 : 0.72,
                }}
                className="relative z-10 inline-flex items-center gap-1.5"
                transition={{
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {option.icon}
                {option.label}
              </motion.span>
            </motion.button>
          );
        })}
      </LayoutGroup>
    </div>
  );
}

export {
  Button,
  IconButton,
  ButtonGroup,
  ButtonGroupItems,
  ButtonGroupSeparator,
  ButtonGroupText,
  SegmentedControl,
  actionButtonVariants,
  buttonGroupVariants,
};

export type {
  ButtonGroupSize,
  ButtonVariant,
  ButtonProps,
  IconButtonProps,
  ButtonGroupProps,
  ButtonGroupItemsProps,
  SegmentedControlProps,
  SegmentedControlOption,
  SegmentedControlOptionObject,
};
