"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

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
          "hover:bg-accent/60 hover:text-foreground",
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
