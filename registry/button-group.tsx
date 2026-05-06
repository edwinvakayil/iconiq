"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

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

interface ButtonProps extends MotionSafeButtonProps {
  children: React.ReactNode;
}

interface RippleButtonProps extends MotionSafeButtonProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    {
      className,
      children,
      contentClassName,
      disabled,
      onPointerDown,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const prefersReducedMotion = useReducedMotion();

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);

      if (disabled || e.button !== 0 || prefersReducedMotion) {
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
        className={cn("relative overflow-hidden", className)}
        disabled={disabled}
        onPointerDown={handlePointerDown}
        ref={ref}
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
  ({ className, children, ...props }, ref) => {
    return (
      <RippleButton
        className={cn(
          "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 font-medium text-foreground text-sm transition-colors",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        ref={ref}
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
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <RippleButton
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:size-4 [&_svg]:shrink-0",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </RippleButton>
    );
  }
);
IconButton.displayName = "IconButton";

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  );
}

interface ButtonGroupItemsProps {
  children: React.ReactNode;
  className?: string;
}

function ButtonGroupItems({ children, className }: ButtonGroupItemsProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-lg border border-border bg-background",
        className
      )}
    >
      {childArray.map((child, index) => {
        if (!React.isValidElement<MotionSafeButtonProps>(child)) return null;

        const isFirst = index === 0;
        const isLast = index === childArray.length - 1;
        const {
          children: childChildren,
          className: childClassName,
          ...childProps
        } = child.props;

        return (
          <RippleButton
            className={cn(
              "relative inline-flex h-9 items-center justify-center px-4 font-medium text-foreground text-sm transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              "disabled:pointer-events-none disabled:opacity-50",
              isFirst && "rounded-l-[7px]",
              isLast && "rounded-r-[7px]",
              !isLast && "border-border border-r",
              childClassName
            )}
            key={index}
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
interface SegmentedControlProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  layoutId?: string;
}

function SegmentedControl({
  options,
  value,
  onChange,
  className,
  layoutId = "segmented-indicator",
}: SegmentedControlProps) {
  const [selected, setSelected] = React.useState(value ?? options[0]);
  const [isHovered, setIsHovered] = React.useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange?.(option);
  };

  React.useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "inline-flex h-11 items-center gap-1 rounded-xl border border-border bg-background p-1.5",
        className
      )}
      initial={{ opacity: 0, y: 8 }}
      role="group"
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      {options.map((option, index) => (
        <motion.button
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "relative z-10 inline-flex h-8 items-center justify-center whitespace-nowrap rounded-lg px-4 font-medium text-sm transition-colors",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected === option
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          initial={{ opacity: 0, x: -8 }}
          key={option}
          onClick={() => handleSelect(option)}
          onHoverEnd={() => setIsHovered(null)}
          onHoverStart={() => setIsHovered(option)}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            delay: index * 0.05,
          }}
          whileTap={{ scale: 0.96 }}
        >
          {selected === option && (
            <motion.span
              className="absolute inset-0 z-[-1] rounded-lg bg-muted shadow-sm"
              initial={false}
              layoutId={layoutId}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 35,
                mass: 0.8,
              }}
            />
          )}
          {isHovered === option && selected !== option && (
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-[-1] rounded-lg bg-muted/50"
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            />
          )}
          <motion.span
            animate={{
              y: selected === option ? -1 : 0,
              scale: selected === option ? 1.02 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            {option}
          </motion.span>
        </motion.button>
      ))}
    </motion.div>
  );
}

export { Button, IconButton, ButtonGroup, ButtonGroupItems, SegmentedControl };
