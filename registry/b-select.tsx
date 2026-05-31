"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
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

type SelectRootProps = SelectPrimitive.Root.Props<string>;

type SelectProps = Omit<
  SelectRootProps,
  | "children"
  | "defaultOpen"
  | "defaultValue"
  | "onOpenChange"
  | "onValueChange"
  | "open"
  | "value"
> &
  ReducedMotionProp & {
    children?: React.ReactNode;
    defaultOpen?: SelectRootProps["defaultOpen"];
    defaultValue?: SelectRootProps["defaultValue"];
    onOpenChange?: SelectRootProps["onOpenChange"];
    onValueChange?: SelectRootProps["onValueChange"];
    open?: SelectRootProps["open"];
    value?: SelectRootProps["value"];
  };

type SelectContextValue = {
  activeHighlightId: string;
  activeValue?: string;
  getItemIndex: () => number;
  itemLabelsRef: React.RefObject<Record<string, React.ReactNode>>;
  itemVariants: ReturnType<typeof getItemVariants>;
  open: boolean;
  registerItemLabel: (value: string, label: React.ReactNode) => void;
  reduceMotion: boolean;
  selectedValue: SelectRootProps["value"];
  setActiveValue: React.Dispatch<React.SetStateAction<string | undefined>>;
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

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(componentName: string) {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error(`${componentName} must be used inside Select`);
  }

  return context;
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

function getPressTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : PRESS_SPRING;
}

function getPanelTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.14, ease: "easeOut" as const }
    : { duration: 0.22, ease: SOFT_EASE };
}

function getChevronTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { duration: 0.2, ease: SOFT_EASE };
}

function getCheckTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : CHECK_SPRING;
}

function getHighlightTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 600, damping: 38 };
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

function resolveStateClassName<State>(
  className: string | ((state: State) => string | undefined) | undefined,
  state: State
) {
  return typeof className === "function" ? className(state) : className;
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

function composeEventHandlers<Event extends React.SyntheticEvent>(
  originalEventHandler: ((event: Event) => void) | undefined,
  eventHandler: (event: Event) => void
) {
  return (event: Event) => {
    originalEventHandler?.(event);
    eventHandler(event);
  };
}

function Select({
  children,
  defaultOpen = false,
  defaultValue,
  onOpenChange,
  onValueChange,
  open: openProp,
  reducedMotion,
  value: valueProp,
  ...props
}: SelectProps) {
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const isOpenControlled = openProp !== undefined;
  const isValueControlled = valueProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<SelectRootProps["value"]>(defaultValue);
  const [activeValue, setActiveValue] = React.useState<string | undefined>();
  const itemLabelsRef = React.useRef<Record<string, React.ReactNode>>({});
  const nextItemIndexRef = React.useRef(0);
  const open = isOpenControlled ? openProp : uncontrolledOpen;
  const selectedValue = isValueControlled ? valueProp : uncontrolledValue;
  const activeHighlightId = React.useId();
  const itemVariants = React.useMemo(
    () => getItemVariants(reduceMotion),
    [reduceMotion]
  );

  const handleOpenChange = React.useCallback<
    NonNullable<SelectRootProps["onOpenChange"]>
  >(
    (nextOpen, eventDetails) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(nextOpen);
      }

      if (!nextOpen) {
        setActiveValue(undefined);
      }

      onOpenChange?.(nextOpen, eventDetails);
    },
    [isOpenControlled, onOpenChange]
  );

  const handleValueChange = React.useCallback<
    NonNullable<SelectRootProps["onValueChange"]>
  >(
    (nextValue, eventDetails) => {
      if (!isValueControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue, eventDetails);
    },
    [isValueControlled, onValueChange]
  );

  const registerItemLabel = React.useCallback(
    (itemValue: string, itemLabel: React.ReactNode) => {
      itemLabelsRef.current[itemValue] = itemLabel;
    },
    []
  );
  const getItemIndex = React.useCallback(() => {
    const itemIndex = nextItemIndexRef.current;
    nextItemIndexRef.current += 1;
    return itemIndex;
  }, []);

  React.useEffect(() => {
    if (!open) {
      nextItemIndexRef.current = 0;
    }
  }, [open]);

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <SelectContext.Provider
        value={{
          activeHighlightId,
          activeValue,
          getItemIndex,
          itemLabelsRef,
          itemVariants,
          open,
          registerItemLabel,
          reduceMotion,
          selectedValue,
          setActiveValue,
        }}
      >
        <SelectPrimitive.Root
          {...props}
          onOpenChange={handleOpenChange}
          onValueChange={handleValueChange}
          open={open}
          value={selectedValue}
        >
          {children}
        </SelectPrimitive.Root>
      </SelectContext.Provider>
    </ReducedMotionConfig>
  );
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      className={cn("space-y-1 pt-2 first:pt-0", className)}
      data-slot="select-group"
      {...props}
    />
  );
}

function SelectValue({
  children,
  className,
  placeholder,
  style,
  ...props
}: SelectPrimitive.Value.Props) {
  const { itemLabelsRef, selectedValue } = useSelectContext("SelectValue");
  const hasValue = !(selectedValue === undefined || selectedValue === null);
  const selectedLabel =
    typeof selectedValue === "string"
      ? itemLabelsRef.current[selectedValue]
      : undefined;
  const providedChildren =
    typeof children === "function" ? children(selectedValue) : children;
  const valueChildren = hasValue
    ? (providedChildren ?? selectedLabel ?? selectedValue)
    : placeholder;
  const { render: _render, ...valueProps } = props;
  const valueClassName =
    typeof className === "function" ? undefined : className;
  const valueStyle = typeof style === "function" ? undefined : style;

  return (
    <span
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 truncate text-left [&_svg]:shrink-0",
        valueClassName
      )}
      data-placeholder={hasValue ? undefined : ""}
      data-slot="select-value"
      style={valueStyle}
      {...valueProps}
    >
      {valueChildren}
    </span>
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) {
  const { open, reduceMotion } = useSelectContext("SelectTrigger");

  return (
    <SelectPrimitive.Trigger
      {...props}
      render={(triggerProps, triggerState) => {
        const {
          resolvedTriggerProps,
          triggerClassName,
          triggerRef,
          triggerStyle,
        } = resolveTriggerProps(triggerProps as TriggerRenderProps);

        return (
          <motion.button
            {...resolvedTriggerProps}
            className={cn(
              componentThemeClassName,
              "flex min-h-11 w-full touch-manipulation items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left font-medium text-foreground text-sm transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground",
              triggerClassName,
              resolveStateClassName(className, triggerState)
            )}
            data-size={size}
            data-slot="select-trigger"
            ref={(node) => {
              setRef(triggerRef, node);
            }}
            style={triggerStyle}
            transition={getPressTransition(reduceMotion)}
            type="button"
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          >
            {children}
            <SelectPrimitive.Icon
              render={
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  className="shrink-0"
                  transition={getChevronTransition(reduceMotion)}
                >
                  <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                </motion.span>
              }
            />
          </motion.button>
        );
      }}
    />
  );
}

function SelectContent({
  align = "start",
  alignItemWithTrigger = false,
  alignOffset = 0,
  children,
  className,
  collisionAvoidance = {
    align: "shift",
    fallbackAxisSide: "none",
    side: "none",
  },
  collisionPadding = 12,
  side = "bottom",
  sideOffset = 8,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    | "align"
    | "alignItemWithTrigger"
    | "alignOffset"
    | "collisionAvoidance"
    | "collisionPadding"
    | "side"
    | "sideOffset"
  >) {
  const { open, reduceMotion, setActiveValue } =
    useSelectContext("SelectContent");

  return (
    <AnimatePresence>
      {open ? (
        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner
            align={align}
            alignItemWithTrigger={alignItemWithTrigger}
            alignOffset={alignOffset}
            className="isolate z-[300]"
            collisionAvoidance={collisionAvoidance}
            collisionPadding={collisionPadding}
            side={side}
            sideOffset={sideOffset}
          >
            <SelectPrimitive.Popup
              {...props}
              render={(popupProps, popupState) => {
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
                      popupClassName,
                      resolveStateClassName(className, popupState)
                    )}
                    data-slot="select-content"
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                    key="select-dropdown"
                    ref={(node) => {
                      setRef(popupRef, node);
                    }}
                    style={{
                      transformOrigin: "var(--transform-origin)",
                      width: "var(--anchor-width)",
                      ...popupStyle,
                    }}
                    transition={getPanelTransition(reduceMotion)}
                  >
                    <SelectScrollUpButton />
                    <SelectPrimitive.List
                      className="overflow-y-auto overscroll-contain p-1.5 outline-none"
                      onPointerLeave={() => {
                        setActiveValue(undefined);
                      }}
                      style={{
                        maxHeight: `min(var(--available-height), ${MAX_MENU_HEIGHT}px)`,
                      }}
                    >
                      {children}
                    </SelectPrimitive.List>
                    <SelectScrollDownButton />
                  </motion.div>
                );
              }}
            />
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn(
        "px-3 pb-1.5 font-medium text-[10px] text-muted-foreground uppercase tracking-[0.16em]",
        className
      )}
      data-slot="select-label"
      {...props}
    />
  );
}

function SelectItem({
  children,
  className,
  icon,
  label,
  value,
  ...props
}: SelectPrimitive.Item.Props & {
  icon?: React.ReactNode;
}) {
  const {
    activeHighlightId,
    activeValue,
    getItemIndex,
    itemVariants,
    registerItemLabel,
    reduceMotion,
    selectedValue,
    setActiveValue,
  } = useSelectContext("SelectItem");
  const itemValue = typeof value === "string" ? value : undefined;
  const itemContent = icon ? (
    <>
      {icon}
      {children}
    </>
  ) : (
    children
  );
  const itemIndexRef = React.useRef<number | null>(null);

  if (itemIndexRef.current === null) {
    itemIndexRef.current = getItemIndex();
  }

  if (itemValue !== undefined) {
    registerItemLabel(itemValue, itemContent);
  }

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      label={label}
      value={value}
      {...props}
      render={(itemProps, itemState) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as ItemRenderProps);
        const isActive = itemValue !== undefined && itemValue === activeValue;
        const isSelected =
          itemState.selected ||
          (itemValue !== undefined && Object.is(itemValue, selectedValue));

        return (
          <motion.div
            {...resolvedItemProps}
            animate="visible"
            className={cn(
              "group relative isolate flex min-h-11 cursor-pointer touch-manipulation select-none items-center gap-3 rounded-lg py-2.5 pr-8 pl-3 text-foreground text-sm outline-none transition-colors",
              !isActive && "hover:bg-accent/60",
              itemClassName,
              resolveStateClassName(className, itemState)
            )}
            custom={itemIndexRef.current}
            exit="exit"
            initial="hidden"
            onMouseEnter={composeEventHandlers(
              resolvedItemProps.onMouseEnter,
              () => {
                setActiveValue(itemValue);
              }
            )}
            onPointerMove={composeEventHandlers(
              resolvedItemProps.onPointerMove,
              () => {
                setActiveValue(itemValue);
              }
            )}
            ref={(node) => {
              setRef(itemRef, node);
            }}
            style={itemStyle}
            transition={getPressTransition(reduceMotion)}
            variants={itemVariants}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          >
            {isActive ? (
              <motion.span
                className="absolute inset-0 -z-10 rounded-lg bg-accent/70"
                layoutId={activeHighlightId}
                transition={getHighlightTransition(reduceMotion)}
              />
            ) : null}
            <SelectPrimitive.ItemText className="relative z-10 flex min-w-0 flex-1 items-center gap-2 truncate text-left [&_svg]:shrink-0">
              {itemContent}
            </SelectPrimitive.ItemText>
            <span className="pointer-events-none absolute right-3 z-10 flex h-4 w-4 items-center justify-center">
              <AnimatePresence>
                {isSelected ? (
                  <motion.span
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-primary"
                    exit={{ opacity: 0, scale: 0.8, y: 1 }}
                    initial={{ opacity: 0, scale: 0.8, y: 1 }}
                    transition={getCheckTransition(reduceMotion)}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
          </motion.div>
        );
      }}
    />
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      data-slot="select-separator"
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-card py-1 text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-card py-1 text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
