"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { motion, useAnimationControls } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

const settleEase = [0.32, 0.72, 0, 1] as const;

function runSelectionMotion(
  controls: {
    fill: ReturnType<typeof useAnimationControls>;
    label: ReturnType<typeof useAnimationControls>;
  },
  selected: boolean,
  reduceMotion: boolean
) {
  if (reduceMotion) {
    controls.fill.start({
      opacity: selected ? 1 : 0,
      scale: 1,
      transition: { duration: 0.12 },
    });
    controls.label.start({
      scale: 1,
      y: 0,
      transition: { duration: 0.12 },
    });
    return;
  }

  if (selected) {
    controls.fill.start({
      opacity: 1,
      scale: [0.94, 1.02, 1],
      transition: { duration: 0.38, ease: settleEase },
    });
    controls.label.start({
      scale: [0.98, 1.03, 1],
      y: [0.5, -1, 0],
      transition: { duration: 0.38, ease: settleEase },
    });
    return;
  }

  controls.fill.start({
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.26, ease: settleEase },
  });
  controls.label.start({
    scale: [1, 0.985, 1],
    y: [0, 0.35, 0],
    transition: { duration: 0.28, ease: settleEase },
  });
}

export interface ToggleGroupItem {
  ariaLabel?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: string;
}

type ToggleGroupSharedProps = ReducedMotionProp & {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
  disabled?: boolean;
  itemClassName?: string;
  items: ToggleGroupItem[];
  orientation?: "horizontal" | "vertical";
  size?: "default" | "sm";
};

type MultipleToggleGroupProps = ToggleGroupSharedProps & {
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  type?: "multiple";
  value?: string[];
};

type SingleToggleGroupProps = ToggleGroupSharedProps & {
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  type: "single";
  value?: string;
};

export type ToggleGroupProps =
  | SingleToggleGroupProps
  | MultipleToggleGroupProps;

function arraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function getResolvedGroupLabel(ariaLabel?: string, ariaLabelledBy?: string) {
  if (ariaLabelledBy) {
    return undefined;
  }

  return ariaLabel ?? "Toggle group";
}

function getGroupClasses(
  orientation: NonNullable<ToggleGroupSharedProps["orientation"]>,
  size: NonNullable<ToggleGroupSharedProps["size"]>
) {
  return cn(
    "inline-flex",
    size === "sm" ? "gap-0.5" : "gap-1",
    orientation === "vertical"
      ? "w-full flex-col items-stretch"
      : "w-fit flex-row items-center"
  );
}

function getItemSizeClasses(size: ToggleGroupSharedProps["size"]) {
  if (size === "sm") {
    return "h-8 min-w-8 rounded-md px-2.5 text-xs [&_svg]:size-3.5";
  }

  return "h-9 min-w-9 rounded-md px-3 text-sm [&_svg]:size-4";
}

function normalizeMultipleValue(
  items: ToggleGroupItem[],
  candidate?: readonly string[]
) {
  if (!(candidate && candidate.length > 0)) {
    return [];
  }

  const validValues = new Set(items.map((item) => item.value));
  const candidateSet = new Set(candidate);

  return items
    .map((item) => item.value)
    .filter((value) => validValues.has(value) && candidateSet.has(value));
}

function normalizeSingleValue(items: ToggleGroupItem[], candidate?: string) {
  if (candidate === undefined) {
    return undefined;
  }

  return items.some((item) => item.value === candidate) ? candidate : undefined;
}

type ToggleGroupSeparatorProps = {
  orientation: NonNullable<ToggleGroupSharedProps["orientation"]>;
};

function ToggleGroupSeparator({ orientation }: ToggleGroupSeparatorProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "shrink-0 bg-border/70",
        orientation === "vertical" ? "mx-2 h-px w-auto" : "h-4 w-px"
      )}
    />
  );
}

type ToggleGroupButtonOwnProps = {
  item: ToggleGroupItem;
  itemClassName?: string;
  orientation: NonNullable<ToggleGroupSharedProps["orientation"]>;
  reduceMotion: boolean;
  selected: boolean;
  size: NonNullable<ToggleGroupSharedProps["size"]>;
};

function resolveRadixButtonProps(
  props: React.ComponentPropsWithoutRef<"button">
) {
  const {
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
    ...resolvedProps
  } = props;

  return resolvedProps;
}

type ToggleGroupButtonProps = ToggleGroupButtonOwnProps &
  React.ComponentPropsWithoutRef<"button">;

const ToggleGroupButton = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupButtonProps
>(
  (
    {
      className,
      item,
      itemClassName,
      orientation,
      reduceMotion,
      selected,
      size,
      ...props
    },
    ref
  ) => {
    const resolvedProps = resolveRadixButtonProps(props);
    const resolvedDisabled = resolvedProps.disabled || item.disabled;
    const canAnimate = !(resolvedDisabled || reduceMotion);
    const fillControls = useAnimationControls();
    const labelControls = useAnimationControls();
    const hasMountedRef = React.useRef(false);

    React.useEffect(() => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        fillControls.set({
          opacity: selected ? 1 : 0,
          scale: 1,
        });
        labelControls.set({ scale: 1, y: 0 });
        return;
      }

      runSelectionMotion(
        { fill: fillControls, label: labelControls },
        selected,
        reduceMotion || Boolean(resolvedDisabled)
      );
    }, [fillControls, labelControls, reduceMotion, resolvedDisabled, selected]);

    return (
      <motion.button
        {...resolvedProps}
        aria-label={item.ariaLabel ?? resolvedProps["aria-label"]}
        className={cn(
          "relative inline-flex shrink-0 touch-manipulation select-none items-center justify-center whitespace-nowrap border-0 bg-transparent font-medium leading-none outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-30",
          getItemSizeClasses(size),
          orientation === "vertical" && "w-full justify-start",
          !selected && "hover:text-foreground",
          itemClassName,
          className
        )}
        ref={ref}
        type={resolvedProps.type ?? "button"}
        whileHover={
          canAnimate && !selected
            ? { scale: 1.015, transition: { duration: 0.22, ease: settleEase } }
            : undefined
        }
        whileTap={
          canAnimate
            ? {
                scale: [1, 0.975, 1.01, 1],
                transition: { duration: 0.32, ease: settleEase },
              }
            : undefined
        }
      >
        <motion.span
          animate={fillControls}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-accent"
          initial={false}
          style={{ transformOrigin: "center" }}
        />
        <motion.span
          animate={labelControls}
          className={cn(
            "relative z-10 inline-flex items-center gap-1.5",
            selected ? "text-accent-foreground" : "text-muted-foreground"
          )}
          initial={false}
          style={{ transformOrigin: "center" }}
        >
          {item.icon ? (
            <span className="inline-flex items-center justify-center [&_svg]:shrink-0">
              {item.icon}
            </span>
          ) : null}
          <span className="inline-flex items-center">{item.label}</span>
        </motion.span>
      </motion.button>
    );
  }
);

ToggleGroupButton.displayName = "ToggleGroupButton";

type ToggleGroupItemsProps = {
  disabled?: boolean;
  itemClassName?: string;
  items: ToggleGroupItem[];
  orientation: NonNullable<ToggleGroupSharedProps["orientation"]>;
  reduceMotion: boolean;
  selectedValues: Set<string>;
  size: NonNullable<ToggleGroupSharedProps["size"]>;
};

function ToggleGroupItems({
  disabled,
  itemClassName,
  items,
  orientation,
  reduceMotion,
  selectedValues,
  size,
}: ToggleGroupItemsProps) {
  return items.map((item, index) => (
    <React.Fragment key={item.value}>
      {index > 0 ? <ToggleGroupSeparator orientation={orientation} /> : null}
      <ToggleGroupPrimitive.Item
        asChild
        disabled={disabled || item.disabled}
        value={item.value}
      >
        <ToggleGroupButton
          item={item}
          itemClassName={itemClassName}
          orientation={orientation}
          reduceMotion={reduceMotion}
          selected={selectedValues.has(item.value)}
          size={size}
        />
      </ToggleGroupPrimitive.Item>
    </React.Fragment>
  ));
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      className,
      defaultValue,
      disabled,
      itemClassName,
      items,
      onValueChange,
      orientation = "horizontal",
      reducedMotion,
      size = "default",
      type,
      value,
    },
    ref
  ) => {
    const reduceMotion = useResolvedReducedMotion(reducedMotion);
    const isMultiple = type !== "single";
    const isControlled = value !== undefined;
    const normalizedControlledSingleValue = normalizeSingleValue(
      items,
      typeof value === "string" ? value : undefined
    );
    const normalizedControlledMultipleValue = normalizeMultipleValue(
      items,
      Array.isArray(value) ? value : undefined
    );
    const [uncontrolledSingleValue, setUncontrolledSingleValue] =
      React.useState<string | undefined>(() =>
        normalizeSingleValue(
          items,
          typeof defaultValue === "string" ? defaultValue : undefined
        )
      );
    const [uncontrolledMultipleValue, setUncontrolledMultipleValue] =
      React.useState<string[]>(() =>
        normalizeMultipleValue(
          items,
          Array.isArray(defaultValue) ? defaultValue : undefined
        )
      );

    React.useEffect(() => {
      if (isControlled) {
        return;
      }

      if (isMultiple) {
        setUncontrolledMultipleValue((current) => {
          const normalized = normalizeMultipleValue(items, current);
          return arraysEqual(current, normalized) ? current : normalized;
        });
        return;
      }

      setUncontrolledSingleValue((current) =>
        normalizeSingleValue(items, current)
      );
    }, [isControlled, isMultiple, items]);

    const selectedSingleValue = isControlled
      ? normalizedControlledSingleValue
      : uncontrolledSingleValue;
    const selectedMultipleValue = isControlled
      ? normalizedControlledMultipleValue
      : uncontrolledMultipleValue;
    const selectedValues = React.useMemo(
      () =>
        new Set(
          isMultiple
            ? selectedMultipleValue
            : selectedSingleValue
              ? [selectedSingleValue]
              : []
        ),
      [isMultiple, selectedMultipleValue, selectedSingleValue]
    );

    const rootClassName = cn(
      registryTheme,
      getGroupClasses(orientation, size),
      className
    );
    const itemsProps = {
      disabled,
      itemClassName,
      items,
      orientation,
      reduceMotion,
      selectedValues,
      size,
    };

    if (isMultiple) {
      const handleMultipleValueChange =
        onValueChange as MultipleToggleGroupProps["onValueChange"];

      return (
        <ReducedMotionConfig reducedMotion={reducedMotion}>
          <ToggleGroupPrimitive.Root
            aria-label={getResolvedGroupLabel(ariaLabel, ariaLabelledBy)}
            aria-labelledby={ariaLabelledBy}
            className={rootClassName}
            disabled={disabled}
            onValueChange={(nextValue) => {
              const normalized = normalizeMultipleValue(items, nextValue);

              if (!isControlled) {
                setUncontrolledMultipleValue(normalized);
              }

              handleMultipleValueChange?.(normalized);
            }}
            orientation={orientation}
            ref={ref}
            type="multiple"
            value={selectedMultipleValue}
          >
            <ToggleGroupItems {...itemsProps} />
          </ToggleGroupPrimitive.Root>
        </ReducedMotionConfig>
      );
    }

    const handleSingleValueChange =
      onValueChange as SingleToggleGroupProps["onValueChange"];

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <ToggleGroupPrimitive.Root
          aria-label={getResolvedGroupLabel(ariaLabel, ariaLabelledBy)}
          aria-labelledby={ariaLabelledBy}
          className={rootClassName}
          disabled={disabled}
          onValueChange={(nextValue) => {
            const normalized = normalizeSingleValue(
              items,
              nextValue || undefined
            );

            if (!isControlled) {
              setUncontrolledSingleValue(normalized);
            }

            handleSingleValueChange?.(normalized);
          }}
          orientation={orientation}
          ref={ref}
          type="single"
          value={selectedSingleValue}
        >
          <ToggleGroupItems {...itemsProps} />
        </ToggleGroupPrimitive.Root>
      </ReducedMotionConfig>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";

export { ToggleGroup };
