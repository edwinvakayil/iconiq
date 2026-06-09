"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { motion } from "motion/react";
import type * as React from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const springTap = {
  type: "spring" as const,
  stiffness: 520,
  damping: 36,
  mass: 0.35,
};

const pathEase = [0.65, 0, 0.35, 1] as const;

const checkmarkVariants = {
  checked: {
    pathLength: 1,
    pathOffset: 0,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.3, ease: pathEase },
      opacity: {
        duration: 0.05,
        delay: 0.06,
      },
    },
  },
  unchecked: {
    pathLength: 0,
    pathOffset: 0,
    opacity: 0,
    transition: {
      pathLength: { duration: 0.3, ease: pathEase },
      opacity: {
        duration: 0.1,
        delay: 0.18,
      },
    },
  },
} as const;

export interface CheckboxGroupOption {
  description?: string;
  disabled?: boolean;
  disabledReason?: string;
  group?: string;
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  className?: string;
  maxVisible?: number;
  onChange?: (value: string[]) => void;
  options: CheckboxGroupOption[];
  showLessLabel?: string;
  showMoreLabel?: string;
  value?: string[];
}

interface CheckboxGroupSection {
  key: string;
  label?: string;
  options: CheckboxGroupOption[];
}

type CheckboxRootRenderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

type CheckboxGroupRowProps = {
  checked: boolean;
  option: CheckboxGroupOption;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function buildSections(options: CheckboxGroupOption[]): CheckboxGroupSection[] {
  return options.reduce<CheckboxGroupSection[]>((sections, option, index) => {
    const label = option.group?.trim();
    const previousSection = sections.at(-1);

    if (previousSection && previousSection.label === label) {
      previousSection.options.push(option);
      return sections;
    }

    sections.push({
      key: label ? `${label}-${index}` : `section-${index}`,
      label,
      options: [option],
    });

    return sections;
  }, []);
}

function getOrderedValues(
  options: CheckboxGroupOption[],
  nextSelected: string[]
): string[] {
  const nextSet = new Set(nextSelected);
  const visibleValues = new Set(options.map((option) => option.value));

  const orderedVisibleValues = options
    .filter((option) => nextSet.has(option.value))
    .map((option) => option.value);

  const extraValues = nextSelected.filter((value) => !visibleValues.has(value));

  return [...orderedVisibleValues, ...extraValues];
}

function resolveRootRenderProps(rootProps: CheckboxRootRenderProps) {
  const {
    children: rowChildren,
    className: rootClassName,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: rootRef,
    style: rootStyle,
    ...resolvedRootProps
  } = rootProps;

  return {
    resolvedRootProps,
    rootClassName,
    rootRef,
    rootStyle,
    rowChildren,
  };
}

function CheckboxGroupCopy({ option }: Pick<CheckboxGroupRowProps, "option">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col",
        "transition-transform duration-520 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "group-hover:translate-x-0.5"
      )}
    >
      <span className="font-medium text-foreground text-sm">
        {option.label}
      </span>
      {option.description ? (
        <span className="text-muted-foreground text-xs">
          {option.description}
        </span>
      ) : null}
      {option.disabled && option.disabledReason ? (
        <span className="text-[11px] text-muted-foreground/90">
          {option.disabledReason}
        </span>
      ) : null}
    </div>
  );
}

function CheckboxGroupRow({ checked, option }: CheckboxGroupRowProps) {
  const disabled = option.disabled;
  const whileTap = disabled
    ? undefined
    : {
        scale: 0.985,
        y: 0,
        transition: springTap,
      };

  return (
    <CheckboxPrimitive.Root
      disabled={disabled}
      nativeButton
      render={(rootProps) => {
        const {
          resolvedRootProps,
          rootClassName,
          rootRef,
          rootStyle,
          rowChildren,
        } = resolveRootRenderProps(rootProps);

        return (
          <motion.button
            {...resolvedRootProps}
            className={cn(
              "group relative flex appearance-none items-center gap-3 rounded-lg px-4 py-3 text-left",
              "transition-[background-color] duration-480 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              rootClassName
            )}
            ref={(node) => {
              setRef(rootRef, node);
            }}
            style={rootStyle}
            transition={springTap}
            whileTap={whileTap}
          >
            {rowChildren}
          </motion.button>
        );
      }}
      value={option.value}
    >
      <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        <div
          className={cn(
            "flex h-[18px] w-[18px] items-center justify-center rounded bg-transparent transition-[border-color] duration-420 ease-[cubic-bezier(0.25,0.85,0.3,1)]",
            checked
              ? "border-0 bg-transparent"
              : [
                  "border-2 bg-transparent",
                  "border-neutral-300/90 group-hover:border-neutral-500/85",
                  "dark:border-neutral-600 dark:group-hover:border-neutral-400",
                ]
          )}
        >
          <CheckboxPrimitive.Indicator
            keepMounted
            render={(indicatorProps) => {
              const {
                className: indicatorClassName,
                children: _children,
                onAnimationEnd: _onAnimationEnd,
                onAnimationIteration: _onAnimationIteration,
                onAnimationStart: _onAnimationStart,
                onDrag: _onDrag,
                onDragEnd: _onDragEnd,
                onDragEnter: _onDragEnter,
                onDragExit: _onDragExit,
                onDragLeave: _onDragLeave,
                onDragOver: _onDragOver,
                onDragStart: _onDragStart,
                onDrop: _onDrop,
                ...resolvedIndicatorProps
              } = indicatorProps;

              return (
                <motion.svg
                  {...resolvedIndicatorProps}
                  animate={checked ? "checked" : "unchecked"}
                  className={cn("h-4 w-4 text-primary", indicatorClassName)}
                  fill="none"
                  initial={false}
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    d="M4 12 L9 17 L20 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    variants={checkmarkVariants}
                  />
                </motion.svg>
              );
            }}
          />
        </div>
      </div>

      <CheckboxGroupCopy option={option} />
    </CheckboxPrimitive.Root>
  );
}

function CheckboxGroup({
  options,
  value = [],
  onChange,
  className,
  maxVisible,
  showMoreLabel = "Show more",
  showLessLabel = "Show less",
}: CheckboxGroupProps) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setOptimisticValue(value);
  }, [value]);

  const canCollapse =
    typeof maxVisible === "number" &&
    maxVisible > 0 &&
    options.length > maxVisible;
  const forcedExpanded =
    canCollapse &&
    !expanded &&
    options
      .slice(maxVisible)
      .some((option) => optimisticValue.includes(option.value));
  const isExpanded = expanded || forcedExpanded;
  const visibleOptions =
    canCollapse && !isExpanded ? options.slice(0, maxVisible) : options;
  const hiddenCount = canCollapse ? options.length - visibleOptions.length : 0;
  const sections = buildSections(visibleOptions);

  const handleValueChange = (nextSelected: string[]) => {
    const next = getOrderedValues(options, nextSelected);

    setOptimisticValue(next);
    onChange?.(next);
  };

  return (
    <CheckboxGroupPrimitive
      className={cn(
        componentThemeClassName,
        "flex flex-col gap-1.5",
        className
      )}
      onValueChange={handleValueChange}
      value={optimisticValue}
    >
      {sections.map((section) => (
        <div className="flex flex-col gap-1" key={section.key}>
          {section.label ? (
            <p className="px-4 pt-2 font-medium text-[11px] text-muted-foreground/80 uppercase tracking-[0.16em]">
              {section.label}
            </p>
          ) : null}

          {section.options.map((option) => (
            <CheckboxGroupRow
              checked={optimisticValue.includes(option.value)}
              key={option.value}
              option={option}
            />
          ))}
        </div>
      ))}

      {canCollapse && !forcedExpanded ? (
        <button
          className={cn(
            "self-start rounded-md px-4 py-2 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          onClick={() => setExpanded((previous) => !previous)}
          type="button"
        >
          {expanded ? showLessLabel : `${showMoreLabel} (${hiddenCount})`}
        </button>
      ) : null}
    </CheckboxGroupPrimitive>
  );
}

export { CheckboxGroup };
