"use client";

import { motion } from "motion/react";
import * as React from "react";
import {
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

const MotionButton = motion.button;

type Ripple = { id: string; x: number; y: number; size: number };
type ButtonGroupSize = "sm" | "md" | "lg";

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

const iconSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "size-8 rounded-md",
  md: "size-9 rounded-lg",
  lg: "size-10 rounded-lg",
};

const groupItemSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "min-h-8 min-w-8 px-2.5 text-xs",
  md: "min-h-9 min-w-9 px-3 text-sm",
  lg: "min-h-10 min-w-10 px-4 text-sm",
};

const segmentedShellSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "gap-0.5 p-0.5",
  md: "gap-0.5 p-0.5",
  lg: "gap-1 p-1",
};

const segmentedItemSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "min-h-7 min-w-8 rounded-sm px-2.5 text-xs",
  md: "min-h-8 min-w-9 rounded-md px-3 text-sm",
  lg: "min-h-9 min-w-10 rounded-md px-4 text-sm",
};

const contentSizeStyles: Record<ButtonGroupSize, string> = {
  sm: "gap-1.5 [&_svg]:size-3.5 [&_svg]:shrink-0",
  md: "gap-1.5 [&_svg]:size-4 [&_svg]:shrink-0",
  lg: "gap-2 [&_svg]:size-4 [&_svg]:shrink-0",
};

interface ButtonProps extends MotionSafeButtonProps, ReducedMotionProp {
  children: React.ReactNode;
  disableRipple?: boolean;
  size?: ButtonGroupSize;
  showBorder?: boolean;
}

interface RippleButtonProps extends MotionSafeButtonProps, ReducedMotionProp {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  disableRipple?: boolean;
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
      reducedMotion,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const prefersReducedMotion = useResolvedReducedMotion(reducedMotion);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);

      if (disabled || disableRipple || e.button !== 0 || prefersReducedMotion) {
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
          componentThemeClassName,
          "relative cursor-pointer touch-manipulation select-none overflow-hidden",
          className
        )}
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
      size = "md",
      reducedMotion,
      ...props
    },
    ref
  ) => {
    return (
      <RippleButton
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap bg-background py-0 font-medium text-muted-foreground transition-colors hover:bg-muted/55 hover:text-foreground",
          showBorder && "border border-border",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          rootSizeStyles[size],
          className
        )}
        contentClassName={contentSizeStyles[size]}
        disableRipple={disableRipple}
        reducedMotion={reducedMotion}
        ref={ref}
        {...props}
      >
        {children}
      </RippleButton>
    );
  }
);
Button.displayName = "Button";

interface IconButtonProps extends MotionSafeButtonProps, ReducedMotionProp {
  children: React.ReactNode;
  disableRipple?: boolean;
  size?: ButtonGroupSize;
  showBorder?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      children,
      disableRipple = false,
      showBorder = true,
      size = "md",
      reducedMotion,
      ...props
    },
    ref
  ) => {
    return (
      <RippleButton
        className={cn(
          "inline-flex items-center justify-center bg-background text-muted-foreground transition-colors hover:bg-muted/55 hover:text-foreground",
          showBorder && "border border-border",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          iconSizeStyles[size],
          className
        )}
        contentClassName={contentSizeStyles[size]}
        disableRipple={disableRipple}
        reducedMotion={reducedMotion}
        ref={ref}
        {...props}
      >
        {children}
      </RippleButton>
    );
  }
);
IconButton.displayName = "IconButton";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function ButtonGroup({ children, className, ...props }: ButtonGroupProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

interface ButtonGroupItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disableRipple?: boolean;
  reducedMotion?: boolean;
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
  reducedMotion,
  role = "group",
  showDividers = true,
  size = "md",
  ...props
}: ButtonGroupItemsProps) {
  const prefersReducedMotion = useResolvedReducedMotion(reducedMotion);
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
  const usesSharedHover = !(showDividers || prefersReducedMotion);

  const updateHoverFrame = React.useCallback((index: number) => {
    const node = itemRefs.current[index];

    if (!node) {
      return;
    }

    const next = {
      height: node.offsetHeight,
      width: node.offsetWidth,
      x: node.offsetLeft,
      y: node.offsetTop,
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

  if (childArray.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        componentThemeClassName,
        "relative inline-flex items-stretch rounded-lg bg-background",
        showDividers && "border border-border",
        className
      )}
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
      {usesSharedHover && hoverFrame && (
        <motion.span
          animate={{
            height: hoverFrame.height,
            opacity: 1,
            width: hoverFrame.width,
            x: hoverFrame.x,
            y: hoverFrame.y,
          }}
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-md bg-muted/45"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 34,
            mass: 0.8,
          }}
        />
      )}
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
              groupItemSizeStyles[size],
              showDividers
                ? [isFirst && "rounded-l-[7px]", isLast && "rounded-r-[7px]"]
                : "rounded-md",
              showSharedHover && "text-foreground",
              !(usesSharedHover || showDividers) && "hover:bg-muted/45",
              showDividers && "hover:bg-muted/55",
              showDividers && !isLast && "border-border border-r",
              childClassName
            )}
            contentClassName={contentSizeStyles[size]}
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
            reducedMotion={reducedMotion}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            {...childProps}
          >
            {childChildren}
          </RippleButton>
        );
      })}
    </div>
  );
}

// Segmented control variant with animated indicator
interface SegmentedControlProps extends ReducedMotionProp {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  layoutId?: string;
  size?: ButtonGroupSize;
}

function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  ariaLabelledBy,
  className,
  layoutId = "segmented-indicator",
  reducedMotion,
  size = "md",
}: SegmentedControlProps) {
  const prefersReducedMotion = useResolvedReducedMotion(reducedMotion);
  const [selected, setSelected] = React.useState(value ?? options[0] ?? "");
  const [isHovered, setIsHovered] = React.useState<string | null>(null);
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const resolvedSelected = options.includes(selected)
    ? selected
    : (options[0] ?? "");

  React.useEffect(() => {
    if (value !== undefined) {
      const next = options.includes(value) ? value : (options[0] ?? "");

      setSelected((current) => (current === next ? current : next));
      return;
    }

    setSelected((current) => {
      if (current.length > 0 && options.includes(current)) {
        return current;
      }

      return options[0] ?? "";
    });
  }, [options, value]);

  const handleSelect = (option: string) => {
    if (option === resolvedSelected) {
      return;
    }

    setSelected(option);
    onChange?.(option);
  };

  const focusOption = (index: number) => {
    buttonRefs.current[index]?.focus();
  };

  const moveSelection = (index: number) => {
    const option = options[index];

    if (option === undefined) {
      return;
    }

    handleSelect(option);
    focusOption(index);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        moveSelection((index + 1) % options.length);
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        moveSelection((index - 1 + options.length) % options.length);
        break;
      }
      case "Home": {
        event.preventDefault();
        moveSelection(0);
        break;
      }
      case "End": {
        event.preventDefault();
        moveSelection(options.length - 1);
        break;
      }
      default:
        break;
    }
  };

  if (options.length === 0) {
    return null;
  }

  return (
    <div
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-orientation="horizontal"
      className={cn(
        componentThemeClassName,
        "inline-flex items-center rounded-lg border border-border bg-background",
        segmentedShellSizeStyles[size],
        className
      )}
      role="radiogroup"
    >
      {options.map((option, index) => {
        const isSelected = resolvedSelected === option;
        const showHover = isHovered === option && !isSelected;

        return (
          <motion.button
            aria-checked={isSelected}
            className={cn(
              "relative inline-flex cursor-pointer touch-manipulation select-none items-center justify-center whitespace-nowrap py-0 font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              segmentedItemSizeStyles[size],
              isSelected
                ? "text-foreground"
                : "text-muted-foreground hover:bg-muted/55 hover:text-foreground"
            )}
            key={option}
            onClick={() => handleSelect(option)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPointerEnter={() => setIsHovered(option)}
            onPointerLeave={() =>
              setIsHovered((current) => (current === option ? null : current))
            }
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            role="radio"
            tabIndex={isSelected ? 0 : -1}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }
            }
            type="button"
            whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
          >
            {isSelected && (
              <motion.span
                aria-hidden
                className="absolute inset-0 z-0 rounded-md bg-muted shadow-sm"
                initial={false}
                layoutId={prefersReducedMotion ? undefined : layoutId}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 500,
                        damping: 36,
                        mass: 0.8,
                      }
                }
              />
            )}
            <motion.span
              animate={{
                opacity: showHover ? 1 : 0,
                scale: showHover ? 1 : 0.98,
              }}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 rounded-md bg-muted/50"
              initial={false}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
            />
            <span className="relative z-10">{option}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

export { Button, IconButton, ButtonGroup, ButtonGroupItems, SegmentedControl };
