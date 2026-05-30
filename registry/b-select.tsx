"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

const MAX_MENU_HEIGHT = 320;
const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_EASE = [0.55, 0.06, 0.68, 0.19] as const;
const CHECK_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 28,
  mass: 0.55,
} as const;
const PRESS_SPRING = {
  type: "spring",
  stiffness: 560,
  damping: 32,
  mass: 0.48,
} as const;

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  group?: string;
}

export interface SelectProps extends ReducedMotionProp {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

type SelectSection = {
  items: Array<{
    index: number;
    option: SelectOption;
  }>;
  key: string;
  label?: string;
};

type TriggerRenderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

type PopupRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

type ItemRenderProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLElement>;
  style?: React.CSSProperties;
};

type SelectItemRowProps = {
  activeHighlightId: string;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  itemVariants: ReturnType<typeof getItemVariants>;
  option: SelectOption;
  reduceMotion: boolean;
  setHoveredValue: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function getSelectSections(options: SelectOption[]) {
  const nextSections: SelectSection[] = [];

  options.forEach((option, index) => {
    const groupLabel = option.group?.trim();
    const previousSection = nextSections.at(-1);

    if (groupLabel) {
      if (previousSection?.label === groupLabel) {
        previousSection.items.push({ index, option });
        return;
      }

      nextSections.push({
        items: [{ index, option }],
        key: `${groupLabel}-${nextSections.length}`,
        label: groupLabel,
      });
      return;
    }

    nextSections.push({
      items: [{ index, option }],
      key: `ungrouped-${index}`,
    });
  });

  return nextSections;
}

function getItemVariants(reduceMotion: boolean) {
  return {
    exit: (index: number) => ({
      opacity: 0,
      y: reduceMotion ? 0 : -2,
      transition: {
        delay: reduceMotion ? 0 : Math.min(index, 4) * 0.01,
        duration: reduceMotion ? 0.1 : 0.12,
        ease: reduceMotion ? ("easeOut" as const) : EXIT_EASE,
      },
    }),
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : -4,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduceMotion ? 0 : Math.min(index, 4) * 0.02,
        duration: reduceMotion ? 0.12 : 0.18,
        ease: reduceMotion ? ("easeOut" as const) : SOFT_EASE,
      },
    }),
  };
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

function resolveTriggerProps(triggerProps: TriggerRenderProps) {
  const {
    children: _children,
    className: triggerClassName,
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
    ref: triggerRef,
    style: triggerStyle,
    ...resolvedTriggerProps
  } = triggerProps;

  return {
    resolvedTriggerProps,
    triggerClassName,
    triggerRef,
    triggerStyle,
  };
}

function resolvePopupProps(popupProps: PopupRenderProps) {
  const {
    children: _children,
    className: popupClassName,
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
    ref: popupRef,
    style: popupStyle,
    ...resolvedPopupProps
  } = popupProps;

  return {
    popupClassName,
    popupRef,
    popupStyle,
    resolvedPopupProps,
  };
}

function resolveItemProps(itemProps: ItemRenderProps) {
  const {
    children: _children,
    className: itemClassName,
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
    ref: itemRef,
    style: itemStyle,
    ...resolvedItemProps
  } = itemProps;

  return {
    itemClassName,
    itemRef,
    itemStyle,
    resolvedItemProps,
  };
}

function SelectItemRow({
  activeHighlightId,
  index,
  isHovered,
  isSelected,
  itemVariants,
  option,
  reduceMotion,
  setHoveredValue,
}: SelectItemRowProps) {
  const pressTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : PRESS_SPRING;
  const hoverTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 600, damping: 38 };
  const checkTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : CHECK_SPRING;

  return (
    <SelectPrimitive.Item
      label={option.label}
      render={(itemProps) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as ItemRenderProps);

        return (
          <motion.div
            {...resolvedItemProps}
            animate="visible"
            className={cn(
              "relative flex min-h-11 cursor-pointer touch-manipulation select-none items-center gap-3 rounded-lg px-3 py-2.5 text-foreground text-sm outline-none transition-colors",
              itemClassName
            )}
            custom={index}
            exit="exit"
            initial="hidden"
            onMouseEnter={() => {
              setHoveredValue(option.value);
            }}
            onPointerMove={() => {
              setHoveredValue(option.value);
            }}
            ref={(node) => {
              setRef(itemRef, node);
            }}
            style={itemStyle}
            transition={pressTransition}
            variants={itemVariants}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          >
            {isHovered ? (
              <motion.span
                className="absolute inset-0 rounded-lg bg-accent"
                layoutId={activeHighlightId}
                transition={hoverTransition}
              />
            ) : null}
            {option.icon ? (
              <span className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
                {option.icon}
              </span>
            ) : null}
            <SelectPrimitive.ItemText className="relative z-10 min-w-0 flex-1 truncate text-left">
              {option.label}
            </SelectPrimitive.ItemText>
            <span className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center">
              <AnimatePresence>
                {isSelected ? (
                  <motion.span
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-primary"
                    exit={{ opacity: 0, scale: 0.8, y: 1 }}
                    initial={{ opacity: 0, scale: 0.8, y: 1 }}
                    transition={checkTransition}
                  >
                    <Check className="h-4 w-4" />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
          </motion.div>
        );
      }}
      value={option.value}
    />
  );
}

function SelectMenuSection({
  activeHighlightId,
  hoveredValue,
  itemVariants,
  reduceMotion,
  section,
  setHoveredValue,
  value,
}: {
  activeHighlightId: string;
  hoveredValue?: string;
  itemVariants: ReturnType<typeof getItemVariants>;
  reduceMotion: boolean;
  section: SelectSection;
  setHoveredValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  value?: string;
}) {
  const items = section.items.map((option) => (
    <SelectItemRow
      activeHighlightId={activeHighlightId}
      index={option.index}
      isHovered={option.option.value === hoveredValue}
      isSelected={option.option.value === value}
      itemVariants={itemVariants}
      key={option.option.value}
      option={option.option}
      reduceMotion={reduceMotion}
      setHoveredValue={setHoveredValue}
    />
  ));

  if (!section.label) {
    return <div className="space-y-1">{items}</div>;
  }

  return (
    <SelectPrimitive.Group className="pt-2 first:pt-0">
      <SelectPrimitive.GroupLabel className="px-3 pb-1.5 font-medium text-[10px] text-muted-foreground uppercase tracking-[0.16em]">
        {section.label}
      </SelectPrimitive.GroupLabel>
      <div className="space-y-1">{items}</div>
    </SelectPrimitive.Group>
  );
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option…",
  className,
  reducedMotion,
}: SelectProps) {
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const [open, setOpen] = React.useState(false);
  const [hoveredValue, setHoveredValue] = React.useState<string | undefined>();
  const selected = options.find((option) => option.value === value);
  const itemVariants = React.useMemo(
    () => getItemVariants(reduceMotion),
    [reduceMotion]
  );
  const buttonTransition = reduceMotion
    ? { duration: 0.1, ease: "easeOut" as const }
    : PRESS_SPRING;
  const panelTransition = reduceMotion
    ? { duration: 0.14, ease: "easeOut" as const }
    : { duration: 0.22, ease: SOFT_EASE };
  const chevronTransition = reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { duration: 0.2, ease: SOFT_EASE };
  const sections = React.useMemo(() => getSelectSections(options), [options]);

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <div
        className={cn(
          componentThemeClassName,
          "relative w-72 max-w-full",
          className
        )}
      >
        <SelectPrimitive.Root
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            setHoveredValue(undefined);
          }}
          onValueChange={(nextValue) => {
            if (typeof nextValue === "string") {
              onChange?.(nextValue);
            }
          }}
          open={open}
          value={value}
        >
          <SelectPrimitive.Trigger
            render={(triggerProps) => {
              const {
                resolvedTriggerProps,
                triggerClassName,
                triggerRef,
                triggerStyle,
              } = resolveTriggerProps(triggerProps as TriggerRenderProps);

              return (
                <motion.button
                  {...resolvedTriggerProps}
                  aria-label={selected ? selected.label : placeholder}
                  className={cn(
                    "flex min-h-11 w-full touch-manipulation items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left font-medium text-foreground text-sm transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    triggerClassName
                  )}
                  data-state={open ? "open" : "closed"}
                  ref={(node) => {
                    setRef(triggerRef, node);
                  }}
                  style={triggerStyle}
                  transition={buttonTransition}
                  type="button"
                  whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                >
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate",
                      selected ? "text-foreground" : "text-muted-foreground"
                    )}
                    title={selected ? selected.label : placeholder}
                  >
                    {selected ? selected.label : placeholder}
                  </span>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    className="shrink-0"
                    transition={chevronTransition}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.span>
                </motion.button>
              );
            }}
          />

          <AnimatePresence>
            {open ? (
              <SelectPrimitive.Portal>
                <SelectPrimitive.Positioner
                  align="start"
                  alignItemWithTrigger={false}
                  collisionPadding={12}
                  sideOffset={8}
                >
                  <SelectPrimitive.Popup
                    render={(popupProps) => {
                      const {
                        popupClassName,
                        popupRef,
                        popupStyle,
                        resolvedPopupProps,
                      } = resolvePopupProps(popupProps as PopupRenderProps);

                      return (
                        <motion.div
                          {...resolvedPopupProps}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            componentThemeClassName,
                            "z-[300] overflow-hidden rounded-lg border border-border bg-card shadow-lg",
                            popupClassName
                          )}
                          exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                          initial={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                          key="select-dropdown"
                          ref={(node) => {
                            setRef(popupRef, node);
                          }}
                          style={{
                            maxHeight: `min(var(--available-height), ${MAX_MENU_HEIGHT}px)`,
                            transformOrigin: "var(--transform-origin)",
                            width: "var(--anchor-width)",
                            ...popupStyle,
                          }}
                          transition={panelTransition}
                        >
                          <SelectPrimitive.List
                            className="overflow-y-auto overscroll-contain p-1.5 outline-none"
                            onPointerLeave={() => {
                              setHoveredValue(undefined);
                            }}
                          >
                            {options.length === 0 ? (
                              <div className="px-3 py-3 text-muted-foreground text-sm">
                                No options available.
                              </div>
                            ) : (
                              sections.map((section) => (
                                <SelectMenuSection
                                  activeHighlightId="select-active-option"
                                  hoveredValue={hoveredValue}
                                  itemVariants={itemVariants}
                                  key={section.key}
                                  reduceMotion={reduceMotion}
                                  section={section}
                                  setHoveredValue={setHoveredValue}
                                  value={value}
                                />
                              ))
                            )}
                          </SelectPrimitive.List>
                        </motion.div>
                      );
                    }}
                  />
                </SelectPrimitive.Positioner>
              </SelectPrimitive.Portal>
            ) : null}
          </AnimatePresence>
        </SelectPrimitive.Root>
      </div>
    </ReducedMotionConfig>
  );
}

export { Select as select };
