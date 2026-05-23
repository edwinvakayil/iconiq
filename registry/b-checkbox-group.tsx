"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";
import { useEffect, useState } from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

const springFlow = {
  type: "spring" as const,
  stiffness: 280,
  damping: 24,
  mass: 0.65,
};

const springTap = {
  type: "spring" as const,
  stiffness: 520,
  damping: 36,
  mass: 0.35,
};

const springCheck = {
  type: "spring" as const,
  stiffness: 720,
  damping: 34,
  mass: 0.38,
};

const reducedTransition = { duration: 0.12 } as const;
const reducedExitTransition = { duration: 0.1 } as const;

export interface CheckboxGroupOption {
  description?: string;
  disabled?: boolean;
  disabledReason?: string;
  group?: string;
  label: string;
  value: string;
}

interface CheckboxGroupProps extends ReducedMotionProp {
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
  reduceMotion: boolean;
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

function CheckboxGroupIndicator({
  checked,
  reduceMotion,
}: Pick<CheckboxGroupRowProps, "checked" | "reduceMotion">) {
  if (!checked) {
    return null;
  }

  const animate = reduceMotion
    ? {
        opacity: 1,
        scale: 1,
      }
    : {
        opacity: 1,
        rotate: 0,
        scale: 1,
      };
  const exit = reduceMotion
    ? {
        opacity: 0,
        transition: reducedExitTransition,
      }
    : {
        opacity: 0,
        rotate: -8,
        scale: 0.86,
        transition: {
          duration: 0.12,
          ease: [0.4, 0, 1, 1] as const,
        },
      };
  const initial = reduceMotion
    ? {
        opacity: 0,
        scale: 1,
      }
    : {
        opacity: 0.92,
        rotate: -5,
        scale: 0.78,
      };

  return (
    <motion.div
      animate={animate}
      className="flex items-center justify-center"
      exit={exit}
      initial={initial}
      key="check"
      transition={reduceMotion ? reducedTransition : springCheck}
    >
      <Check className="h-4 w-4 text-primary" strokeWidth={3} />
    </motion.div>
  );
}

function CheckboxGroupCopy({
  option,
  reduceMotion,
}: Pick<CheckboxGroupRowProps, "option" | "reduceMotion">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col",
        reduceMotion
          ? "transition-none"
          : "transition-transform duration-520 ease-[cubic-bezier(0.22,1,0.36,1)]",
        !reduceMotion && "group-hover:translate-x-0.5"
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

function CheckboxGroupRow({
  checked,
  option,
  reduceMotion,
}: CheckboxGroupRowProps) {
  const disabled = option.disabled;
  const rowTransition = reduceMotion ? reducedTransition : springTap;
  const checkboxTransition = reduceMotion ? reducedTransition : springFlow;
  const whileTap =
    disabled || reduceMotion
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
              "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-left",
              reduceMotion
                ? "transition-colors duration-150"
                : "transition-[background-color] duration-480 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:bg-neutral-100/90 dark:hover:bg-neutral-800/50",
              "active:bg-neutral-100 dark:active:bg-neutral-800/78",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "disabled:active:bg-transparent disabled:hover:bg-transparent",
              "dark:disabled:active:bg-transparent dark:disabled:hover:bg-transparent",
              rootClassName
            )}
            ref={(node) => {
              setRef(rootRef, node);
            }}
            style={rootStyle}
            transition={rowTransition}
            whileTap={whileTap}
          >
            {rowChildren}
          </motion.button>
        );
      }}
      value={option.value}
    >
      <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        <motion.div
          className={cn(
            "flex h-[18px] w-[18px] items-center justify-center rounded transition-[border-color] duration-420 ease-[cubic-bezier(0.25,0.85,0.3,1)]",
            checked
              ? "border-0 bg-transparent"
              : [
                  "border-2 bg-transparent",
                  "border-neutral-300/90 group-hover:border-neutral-500/85",
                  "dark:border-neutral-600 dark:group-hover:border-neutral-400",
                ]
          )}
          layout={reduceMotion ? false : "position"}
          transition={checkboxTransition}
        >
          <AnimatePresence initial={false} mode="sync">
            <CheckboxGroupIndicator
              checked={checked}
              reduceMotion={reduceMotion}
            />
          </AnimatePresence>
        </motion.div>
      </div>

      <CheckboxGroupCopy option={option} reduceMotion={reduceMotion} />
    </CheckboxPrimitive.Root>
  );
}

function CheckboxGroup({
  options,
  value = [],
  onChange,
  className,
  maxVisible,
  reducedMotion,
  showMoreLabel = "Show more",
  showLessLabel = "Show less",
}: CheckboxGroupProps) {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useResolvedReducedMotion(reducedMotion);

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
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <CheckboxGroupPrimitive
        className={cn(registryTheme, "flex flex-col gap-1.5", className)}
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
                reduceMotion={reduceMotion}
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
    </ReducedMotionConfig>
  );
}

export { CheckboxGroup };
