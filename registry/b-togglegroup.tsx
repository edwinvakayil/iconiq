"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { motion, useAnimationControls } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

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
  | MultipleToggleGroupProps
  | SingleToggleGroupProps;

type BaseToggleRenderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

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

const EMPTY_SELECTION: string[] = [];

function getInitialMultipleValue(
  items: ToggleGroupItem[],
  defaultValue: string | string[] | undefined
) {
  if (Array.isArray(defaultValue)) {
    return normalizeMultipleValue(items, defaultValue);
  }

  return EMPTY_SELECTION;
}

function getInitialSingleValue(
  items: ToggleGroupItem[],
  defaultValue: string | string[] | undefined
) {
  if (typeof defaultValue === "string") {
    return normalizeSingleValue(items, defaultValue);
  }

  return undefined;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
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

type ToggleGroupButtonProps = {
  disabled?: boolean;
  item: ToggleGroupItem;
  itemClassName?: string;
  orientation: NonNullable<ToggleGroupSharedProps["orientation"]>;
  reduceMotion: boolean;
  selected: boolean;
  size: NonNullable<ToggleGroupSharedProps["size"]>;
};

function resolveBaseButtonRenderProps(rootProps: BaseToggleRenderProps) {
  const {
    children: _children,
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
    style,
    ...resolvedRootProps
  } = rootProps;

  return {
    resolvedRootProps,
    rootClassName,
    rootRef,
    style,
  };
}

type ToggleGroupButtonViewProps = ToggleGroupButtonProps & {
  rootProps: BaseToggleRenderProps;
};

function ToggleGroupButtonView({
  disabled,
  item,
  itemClassName,
  orientation,
  reduceMotion,
  rootProps,
  selected,
  size,
}: ToggleGroupButtonViewProps) {
  const { resolvedRootProps, rootClassName, rootRef, style } =
    resolveBaseButtonRenderProps(rootProps);
  const resolvedDisabled = disabled || item.disabled;
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
      {...resolvedRootProps}
      aria-label={item.ariaLabel}
      className={cn(
        "relative inline-flex shrink-0 touch-manipulation select-none items-center justify-center whitespace-nowrap border-0 bg-transparent font-medium leading-none outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-30",
        getItemSizeClasses(size),
        orientation === "vertical" && "w-full justify-start",
        !selected && "hover:text-foreground",
        rootClassName,
        itemClassName
      )}
      ref={(node) => setRef(rootRef, node)}
      style={style}
      type={resolvedRootProps.type ?? "button"}
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

function ToggleGroupButton(props: ToggleGroupButtonProps) {
  return (rootProps: BaseToggleRenderProps) => (
    <ToggleGroupButtonView {...props} rootProps={rootProps} />
  );
}

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
      <TogglePrimitive
        disabled={disabled || item.disabled}
        render={ToggleGroupButton({
          disabled,
          item,
          itemClassName,
          orientation,
          reduceMotion,
          selected: selectedValues.has(item.value),
          size,
        })}
        value={item.value}
      />
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
        getInitialSingleValue(items, defaultValue)
      );
    const [uncontrolledMultipleValue, setUncontrolledMultipleValue] =
      React.useState<string[]>(() =>
        getInitialMultipleValue(items, defaultValue)
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
    const handleMultipleValueChange =
      onValueChange as MultipleToggleGroupProps["onValueChange"];
    const handleSingleValueChange =
      onValueChange as SingleToggleGroupProps["onValueChange"];
    const itemsProps = {
      disabled,
      itemClassName,
      items,
      orientation,
      reduceMotion,
      selectedValues,
      size,
    };

    return (
      <ReducedMotionConfig reducedMotion={reducedMotion}>
        <ToggleGroupPrimitive
          aria-label={getResolvedGroupLabel(ariaLabel, ariaLabelledBy)}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            componentThemeClassName,
            getGroupClasses(orientation, size),
            className
          )}
          disabled={disabled}
          multiple={isMultiple}
          onValueChange={(nextValue) => {
            const normalized = normalizeMultipleValue(items, nextValue);

            if (isMultiple) {
              if (!isControlled) {
                setUncontrolledMultipleValue(normalized);
              }

              handleMultipleValueChange?.(normalized);
              return;
            }

            const nextSingleValue = normalized[0];

            if (!isControlled) {
              setUncontrolledSingleValue(nextSingleValue);
            }

            handleSingleValueChange?.(nextSingleValue);
          }}
          orientation={orientation}
          ref={ref}
          value={
            isMultiple
              ? selectedMultipleValue
              : selectedSingleValue
                ? [selectedSingleValue]
                : []
          }
        >
          <ToggleGroupItems {...itemsProps} />
        </ToggleGroupPrimitive>
      </ReducedMotionConfig>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";

export { ToggleGroup };
