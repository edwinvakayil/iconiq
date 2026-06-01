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
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

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
  const fillInitial = React.useMemo(
    () => ({ opacity: selected ? 1 : 0, scale: 1 }),
    [selected]
  );

  React.useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      fillControls.set(fillInitial);
      labelControls.set({ scale: 1, y: 0 });
      return;
    }

    runSelectionMotion(
      { fill: fillControls, label: labelControls },
      selected,
      reduceMotion || Boolean(resolvedDisabled)
    );
  }, [
    fillControls,
    fillInitial,
    labelControls,
    reduceMotion,
    resolvedDisabled,
    selected,
  ]);

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
        initial={fillInitial}
        style={{ transformOrigin: "center" }}
      />
      <motion.span
        animate={labelControls}
        className={cn(
          "relative z-10 inline-flex items-center gap-1.5",
          selected ? "text-accent-foreground" : "text-muted-foreground"
        )}
        initial={{ scale: 1, y: 0 }}
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
