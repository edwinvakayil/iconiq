"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

const ICON_CELL_PX = 36;
const EXPAND_DURATION = 0.62;
const COLLAPSE_DURATION = 0.48;
const FLUID_EASE = [0.16, 1, 0.3, 1] as const;

type IconBarContextValue = {
  selectedValue: string | null;
  setSelectedValue: (value: string) => void;
};

const IconBarContext = React.createContext<IconBarContextValue | null>(null);

function useIconBarContext(componentName: string) {
  const context = React.useContext(IconBarContext);

  if (!context) {
    throw new Error(`${componentName} must be used within IconBar.`);
  }

  return context;
}

type IconBarProps = {
  className?: string;
  children?: React.ReactNode;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  value?: string | null;
};

function IconBar({
  className,
  children,
  defaultValue,
  onValueChange,
  value: valueProp,
}: IconBarProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | null
  >(defaultValue ?? null);
  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? (valueProp ?? null) : uncontrolledValue;

  const setSelectedValue = React.useCallback(
    (nextValue: string) => {
      const resolved = selectedValue === nextValue ? null : nextValue;

      if (!isControlled) {
        setUncontrolledValue(resolved);
      }
      onValueChange?.(resolved);
    },
    [isControlled, onValueChange, selectedValue]
  );

  const contextValue = React.useMemo(
    () => ({ selectedValue, setSelectedValue }),
    [selectedValue, setSelectedValue]
  );

  return (
    <IconBarContext.Provider value={contextValue}>
      <div
        aria-orientation="horizontal"
        className={cn(
          componentThemeClassName,
          "flex flex-wrap items-center gap-2",
          className
        )}
        role="toolbar"
      >
        {children}
      </div>
    </IconBarContext.Provider>
  );
}
IconBar.displayName = "IconBar";

type IconBarItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof motion.button>,
  "children" | "aria-expanded" | "aria-label" | "aria-pressed"
> & {
  icon: LucideIcon;
  label: string;
  value?: string;
};

const IconBarItem = React.forwardRef<HTMLButtonElement, IconBarItemProps>(
  (
    {
      className,
      disabled = false,
      icon: Icon,
      label,
      onBlur: onBlurProp,
      onClick,
      onFocus: onFocusProp,
      value,
      ...buttonProps
    },
    ref
  ) => {
    const { selectedValue, setSelectedValue } =
      useIconBarContext("IconBarItem");
    const itemValue = value ?? label;
    const [hoverPreview, setHoverPreview] = React.useState(false);
    const measureRef = React.useRef<HTMLSpanElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);

    const isSelected = !disabled && selectedValue === itemValue;
    const expanded = !disabled && (isSelected || hoverPreview);

    React.useLayoutEffect(() => {
      const node = measureRef.current;
      if (!node) return;

      const measure = () => {
        setLabelWidth(Math.ceil(node.getBoundingClientRect().width));
      };

      measure();

      const observer = new ResizeObserver(measure);
      observer.observe(node);

      const fonts = document.fonts;
      if (fonts?.ready) {
        fonts.ready.then(measure).catch(() => undefined);
      }

      return () => observer.disconnect();
    }, []);

    const widthTransition = {
      duration: expanded ? EXPAND_DURATION : COLLAPSE_DURATION,
      ease: FLUID_EASE,
    };

    const showLabel = expanded && labelWidth > 0;

    return (
      <motion.button
        {...buttonProps}
        aria-expanded={showLabel}
        aria-label={label}
        aria-pressed={isSelected}
        className={cn(
          "relative inline-flex h-9 shrink-0 items-center overflow-hidden rounded-xl bg-muted text-muted-foreground outline-none",
          "transition-[background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "hover:bg-accent hover:text-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          isSelected && "bg-accent text-foreground",
          className
        )}
        disabled={disabled}
        onBlur={(event) => {
          setHoverPreview(false);
          onBlurProp?.(event);
        }}
        onClick={(event) => {
          if (disabled) return;

          const willDeselect = isSelected;
          setSelectedValue(itemValue);

          if (willDeselect) {
            setHoverPreview(false);
            event.currentTarget.blur();
          }

          onClick?.(event);
        }}
        onFocus={(event) => {
          onFocusProp?.(event);
          if (disabled || event.defaultPrevented) return;
          if (event.currentTarget.matches(":focus-visible")) {
            setHoverPreview(true);
          }
        }}
        onHoverEnd={() => {
          if (!disabled) setHoverPreview(false);
        }}
        onHoverStart={() => {
          if (!disabled) setHoverPreview(true);
        }}
        ref={ref}
        type="button"
      >
        <span className="flex size-9 shrink-0 items-center justify-center">
          <Icon aria-hidden className="size-[18px] stroke-[1.5]" />
        </span>

        <motion.div
          animate={{ width: showLabel ? labelWidth : 0 }}
          className="overflow-hidden"
          initial={false}
          transition={widthTransition}
        >
          <span className="block whitespace-nowrap pr-3 font-medium text-[14px] tracking-[-0.01em]">
            {label}
          </span>
        </motion.div>

        <span
          aria-hidden
          className="pointer-events-none absolute top-0 whitespace-nowrap pr-3 font-medium text-[14px] tracking-[-0.01em] opacity-0"
          ref={measureRef}
          style={{ left: ICON_CELL_PX }}
        >
          {label}
        </span>
      </motion.button>
    );
  }
);
IconBarItem.displayName = "IconBarItem";

export { IconBar, IconBarItem };
export type { IconBarItemProps, IconBarProps };
