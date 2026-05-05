"use client";

import { motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const MotionButton = motion.button;

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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <MotionButton
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 font-medium text-foreground text-sm",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        initial={{ opacity: 0, y: 8 }}
        ref={ref}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 0.8,
        }}
        whileHover={{
          scale: 1.02,
          backgroundColor: "var(--muted)",
        }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        <motion.span
          className="inline-flex items-center gap-2"
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          whileHover={{ x: 2 }}
        >
          {children}
        </motion.span>
      </MotionButton>
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
      <MotionButton
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:size-4 [&_svg]:shrink-0",
          className
        )}
        initial={{ opacity: 0, scale: 0.92, y: 6 }}
        ref={ref}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 28,
          mass: 0.72,
        }}
        whileHover={{
          scale: 1.035,
          y: -1,
          backgroundColor: "var(--muted)",
        }}
        whileTap={{ scale: 0.96, y: 0 }}
        {...props}
      >
        <motion.span
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 24,
            mass: 0.65,
          }}
          whileHover={{ rotate: -10, y: -0.75 }}
          whileTap={{ rotate: -4, scale: 0.96, y: 0 }}
        >
          {children}
        </motion.span>
      </MotionButton>
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
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-center gap-2", className)}
      initial={{ opacity: 0, y: 12 }}
      role="group"
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        staggerChildren: 0.05,
      }}
    >
      {children}
    </motion.div>
  );
}

interface ButtonGroupItemsProps {
  children: React.ReactNode;
  className?: string;
}

function ButtonGroupItems({ children, className }: ButtonGroupItemsProps) {
  const childArray = React.Children.toArray(children);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  const activeIndex = hoveredIndex ?? focusedIndex;

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={cn(
        "relative inline-flex items-center rounded-lg border border-border bg-background",
        className
      )}
      initial={{ opacity: 0, scale: 0.985, y: 8 }}
      role="group"
      transition={{
        type: "spring",
        stiffness: 360,
        damping: 32,
        mass: 0.85,
      }}
    >
      {childArray.map((child, index) => {
        if (!React.isValidElement<MotionSafeButtonProps>(child)) return null;

        const isFirst = index === 0;
        const isLast = index === childArray.length - 1;

        return (
          <MotionButton
            className={cn(
              "relative inline-flex h-9 items-center justify-center px-4 font-medium text-foreground text-sm",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              "disabled:pointer-events-none disabled:opacity-50",
              isFirst && "rounded-l-[7px]",
              isLast && "rounded-r-[7px]",
              !isLast && "border-border border-r"
            )}
            key={index}
            onBlur={() =>
              setFocusedIndex((current) => (current === index ? null : current))
            }
            onFocus={() => setFocusedIndex(index)}
            onHoverEnd={() =>
              setHoveredIndex((current) => (current === index ? null : current))
            }
            onHoverStart={() => setHoveredIndex(index)}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 28,
              mass: 0.9,
            }}
            whileTap={{ scale: 0.985, y: 0.25 }}
            {...(child.props as MotionSafeButtonProps)}
          >
            {activeIndex === index ? (
              <motion.span
                className="absolute inset-[2px] rounded-[7px]"
                initial={false}
                layoutId="button-group-hover"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                  mass: 0.82,
                }}
              />
            ) : null}
            <motion.span
              animate={{
                opacity: activeIndex === index ? 1 : 0.88,
                scale: activeIndex === index ? 1.01 : 1,
                x: activeIndex === index ? 1.5 : 0,
                y: activeIndex === index ? -0.35 : 0,
              }}
              className="relative z-10 inline-flex items-center gap-2"
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 24,
                mass: 0.85,
              }}
            >
              {child.props.children}
            </motion.span>
          </MotionButton>
        );
      })}
    </motion.div>
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
