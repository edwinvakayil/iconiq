"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const selectThemeClassName =
  "[--sel-surface:#ffffff] [--sel-foreground:#111111] [--sel-border:#e3e7ec] [--sel-ring:rgba(17,17,17,0.16)] [--sel-muted-foreground:#6d7480] [--sel-accent:#f3f5f8] dark:[--sel-surface:#111111] dark:[--sel-foreground:#f6f3ec] dark:[--sel-border:#2b2a25] dark:[--sel-ring:rgba(246,243,236,0.18)] dark:[--sel-muted-foreground:#9a958a] dark:[--sel-accent:#1a1a18] [--color-accent:var(--sel-accent)] [--color-accent-foreground:var(--sel-foreground)]";

const selectTriggerClassName =
  "flex min-h-11 w-full touch-manipulation items-center justify-between gap-2 rounded-lg border border-[color:var(--sel-border)] bg-[color:var(--sel-surface)] px-4 py-3 text-left font-medium text-[color:var(--sel-foreground)] text-sm transition-colors hover:bg-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--sel-ring),transparent_50%)] disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-[color:var(--sel-muted-foreground)]";

const selectPanelChromeClassName =
  "z-[300] overflow-hidden rounded-lg border border-[color:color-mix(in_oklch,var(--sel-border,#e3e7ec),transparent_40%)] bg-[var(--sel-surface,#ffffff)] text-[var(--sel-foreground,#111111)] shadow-none dark:border-[color:color-mix(in_oklch,var(--sel-border,#2b2a25),transparent_40%)] dark:bg-[var(--sel-surface,#111111)] dark:text-[var(--sel-foreground,#f6f3ec)]";

const selectItemClassName =
  "group relative isolate flex min-h-11 cursor-pointer touch-manipulation select-none items-center gap-3 rounded-lg py-2.5 pr-8 pl-3 text-[color:var(--sel-foreground)] text-sm outline-none transition-colors";

const selectItemHighlightClassName =
  "absolute inset-0 -z-10 rounded-lg bg-accent/60";

const MAX_MENU_HEIGHT = 320;
const INSTANT_CLOSE_TRANSITION = { duration: 0 } as const;

const selectListScrollbarClassName =
  "z-10 my-1.5 mr-0.5 w-1 shrink-0 touch-none select-none opacity-0 transition-opacity duration-150 before:absolute before:left-1/2 before:h-full before:w-5 before:-translate-x-1/2 before:content-[''] data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0";

const selectListThumbClassName =
  "relative rounded-full bg-muted-foreground/50 bg-[color:color-mix(in_oklch,var(--sel-muted-foreground),transparent_35%)]";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_EASE = [0.55, 0.06, 0.68, 0.19] as const;
const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const POPUP_EXIT_EASE = [0.4, 0, 0.6, 1] as const;
const POPUP_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.95,
};
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
> & {
  children?: React.ReactNode;
  defaultOpen?: SelectRootProps["defaultOpen"];
  defaultValue?: SelectRootProps["defaultValue"];
  onOpenChange?: SelectRootProps["onOpenChange"];
  onValueChange?: SelectRootProps["onValueChange"];
  open?: SelectRootProps["open"];
  value?: SelectRootProps["value"];
};

type SelectContextValue = {
  actionsRef: React.RefObject<SelectPrimitive.Root.Actions | null>;
  activeHighlightId: string;
  activeValue?: string;
  getItemIndex: () => number;
  itemLabelsRef: React.RefObject<Record<string, React.ReactNode>>;
  itemVariants: typeof itemVariants;
  open: boolean;
  registerItemLabel: (value: string, label: React.ReactNode) => void;
  selectedValue: SelectRootProps["value"];
  setActiveValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  skipExitAnimationRef: React.MutableRefObject<boolean>;
};

const RESIZE_OBSERVER_LOOP_ERROR =
  /ResizeObserver loop(?:\s+\w+)*|ResizeObserver loop limit exceeded/i;

let resizeObserverPatchCount = 0;
let nativeResizeObserver: typeof ResizeObserver | undefined;

function isResizeObserverLoopError(message: string) {
  return RESIZE_OBSERVER_LOOP_ERROR.test(message);
}

function patchResizeObserverLoop() {
  if (typeof ResizeObserver === "undefined") {
    return;
  }

  if (resizeObserverPatchCount === 0) {
    nativeResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class PatchedResizeObserver extends (
      nativeResizeObserver
    ) {
      constructor(callback: ResizeObserverCallback) {
        super((entries, observer) => {
          requestAnimationFrame(() => {
            callback(entries, observer);
          });
        });
      }
    };
  }

  resizeObserverPatchCount += 1;
}

function restoreResizeObserverLoopPatch() {
  if (resizeObserverPatchCount === 0) {
    return;
  }

  resizeObserverPatchCount -= 1;

  if (resizeObserverPatchCount === 0 && nativeResizeObserver) {
    window.ResizeObserver = nativeResizeObserver;
    nativeResizeObserver = undefined;
  }
}

function useSuppressResizeObserverLoopError() {
  React.useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (!isResizeObserverLoopError(event.message)) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason ?? "");

      if (!isResizeObserverLoopError(message)) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
    };

    patchResizeObserverLoop();
    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onUnhandledRejection, true);

    return () => {
      restoreResizeObserverLoopPatch();
      window.removeEventListener("error", onError, true);
      window.removeEventListener(
        "unhandledrejection",
        onUnhandledRejection,
        true
      );
    };
  }, []);
}

type TriggerRenderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

type ListRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
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

const itemVariants = {
  exit: (index: number) => ({
    opacity: 0,
    y: -2,
    transition: {
      delay: Math.min(index, 4) * 0.01,
      duration: 0.12,
      ease: EXIT_EASE,
    },
  }),
  hidden: {
    opacity: 0,
    y: -4,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(index, 4) * 0.02,
      duration: 0.18,
      ease: SOFT_EASE,
    },
  }),
};

const popupMotion = {
  animate: { opacity: 1, scale: 1, y: 0 },
  closed: { opacity: 0, scale: 0.985, y: -5 },
  initial: { opacity: 0, scale: 0.985, y: -5 },
  openTransition: {
    opacity: { duration: 0.34, ease: FLUID_EASE },
    scale: POPUP_SPRING,
    y: POPUP_SPRING,
  },
  closedTransition: {
    opacity: { duration: 0.22, ease: POPUP_EXIT_EASE },
    scale: { duration: 0.22, ease: POPUP_EXIT_EASE },
    y: { duration: 0.22, ease: POPUP_EXIT_EASE },
  },
};

const chevronTransition = { duration: 0.2, ease: SOFT_EASE };

const highlightTransition = {
  type: "spring" as const,
  stiffness: 600,
  damping: 38,
};

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
  value: valueProp,
  ...props
}: SelectProps) {
  const internalActionsRef = React.useRef<SelectPrimitive.Root.Actions | null>(
    null
  );
  const actionsRef = internalActionsRef;
  const skipExitAnimationRef = React.useRef(false);
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
  useSuppressResizeObserverLoopError();

  const handleOpenChange = React.useCallback<
    NonNullable<SelectRootProps["onOpenChange"]>
  >(
    (nextOpen, eventDetails) => {
      if (!nextOpen && eventDetails.reason === "item-press") {
        skipExitAnimationRef.current = true;
      } else if (nextOpen) {
        skipExitAnimationRef.current = false;
      }

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
    <SelectContext.Provider
      value={{
        actionsRef,
        activeHighlightId,
        activeValue,
        getItemIndex,
        itemLabelsRef,
        itemVariants,
        open,
        registerItemLabel,
        selectedValue,
        setActiveValue,
        skipExitAnimationRef,
      }}
    >
      <SelectPrimitive.Root
        {...props}
        actionsRef={actionsRef}
        onOpenChange={handleOpenChange}
        onValueChange={handleValueChange}
        open={open}
        value={selectedValue}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
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
  const { open } = useSelectContext("SelectTrigger");

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
          <button
            {...resolvedTriggerProps}
            className={cn(
              selectThemeClassName,
              selectTriggerClassName,
              triggerClassName,
              resolveStateClassName(className, triggerState)
            )}
            data-size={size}
            data-slot="select-trigger"
            ref={(node) => {
              setRef(triggerRef, node);
            }}
            style={triggerStyle}
            type="button"
          >
            {children}
            <SelectPrimitive.Icon
              render={
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  className="shrink-0"
                  transition={chevronTransition}
                >
                  <ChevronDownIcon className="h-4 w-4 text-[color:var(--sel-muted-foreground)]" />
                </motion.span>
              }
            />
          </button>
        );
      }}
    />
  );
}

function SelectContentPanel({
  children,
  className,
  popupClassName,
  popupRef,
  popupState,
  popupStyle,
  resolvedPopupProps,
}: {
  children: React.ReactNode;
  className?:
    | string
    | ((state: SelectPrimitive.Popup.State) => string | undefined);
  popupClassName?: string;
  popupRef?: React.Ref<HTMLDivElement>;
  popupState: SelectPrimitive.Popup.State;
  popupStyle?: React.CSSProperties;
  resolvedPopupProps: Omit<
    PopupRenderProps,
    "children" | "className" | "ref" | "style"
  >;
}) {
  const { actionsRef, skipExitAnimationRef } =
    useSelectContext("SelectContentPanel");
  const skipExitAnimation = !popupState.open && skipExitAnimationRef.current;

  return (
    <div
      {...resolvedPopupProps}
      ref={(node) => {
        setRef(popupRef, node);
      }}
      role="presentation"
      style={{
        ...popupStyle,
        transformOrigin: "var(--transform-origin)",
        width: "var(--anchor-width)",
      }}
    >
      <motion.div
        animate={popupState.open ? popupMotion.animate : popupMotion.closed}
        className={cn(
          selectThemeClassName,
          selectPanelChromeClassName,
          "flex transform-gpu flex-col",
          popupClassName,
          resolveStateClassName(className, popupState)
        )}
        data-slot="select-content"
        initial={
          popupState.transitionStatus === "starting"
            ? popupMotion.initial
            : false
        }
        onAnimationComplete={() => {
          if (!popupState.open) {
            skipExitAnimationRef.current = false;
            actionsRef.current?.unmount();
          }
        }}
        style={{
          pointerEvents: popupState.open ? undefined : "none",
          transformOrigin: "var(--transform-origin)",
        }}
        transition={
          popupState.open
            ? popupMotion.openTransition
            : skipExitAnimation
              ? INSTANT_CLOSE_TRANSITION
              : popupMotion.closedTransition
        }
      >
        {children}
      </motion.div>
    </div>
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
  const { setActiveValue } = useSelectContext("SelectContent");

  return (
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
            const { popupClassName, popupRef, popupStyle, resolvedPopupProps } =
              resolvePopupProps(popupProps as PopupRenderProps);

            return (
              <SelectContentPanel
                className={className}
                popupClassName={popupClassName}
                popupRef={popupRef}
                popupState={popupState}
                popupStyle={popupStyle}
                resolvedPopupProps={resolvedPopupProps}
              >
                <SelectScrollUpButton />
                <motion.div className="relative min-h-0 flex-1" layoutRoot>
                  <ScrollAreaPrimitive.Root
                    className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
                    style={{
                      maxHeight: `min(var(--available-height), ${MAX_MENU_HEIGHT}px)`,
                    }}
                  >
                    <SelectPrimitive.List
                      className="min-h-0 flex-1 p-1.5 outline-none"
                      onPointerLeave={() => {
                        setActiveValue(undefined);
                      }}
                      render={(listProps) => {
                        const {
                          children: listChildren,
                          className: listClassName,
                          ref: listRef,
                          style: listStyle,
                          ...resolvedListProps
                        } = listProps as ListRenderProps;

                        return (
                          <ScrollAreaPrimitive.Viewport
                            {...resolvedListProps}
                            className={cn(
                              "min-h-0 flex-1 overscroll-contain outline-none",
                              listClassName
                            )}
                            ref={(node) => {
                              setRef(listRef, node);
                            }}
                            style={listStyle}
                          >
                            {listChildren}
                          </ScrollAreaPrimitive.Viewport>
                        );
                      }}
                    >
                      {children}
                    </SelectPrimitive.List>
                    <ScrollAreaPrimitive.Scrollbar
                      className={selectListScrollbarClassName}
                      orientation="vertical"
                    >
                      <ScrollAreaPrimitive.Thumb
                        className={selectListThumbClassName}
                      />
                    </ScrollAreaPrimitive.Scrollbar>
                  </ScrollAreaPrimitive.Root>
                </motion.div>
                <SelectScrollDownButton />
              </SelectContentPanel>
            );
          }}
        />
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn(
        "px-3 pb-1.5 font-medium text-[10px] text-[color:var(--sel-muted-foreground)] uppercase tracking-[0.16em]",
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
              "transform-gpu",
              selectItemClassName,
              !isActive && "hover:bg-accent/60",
              itemClassName,
              resolveStateClassName(className, itemState)
            )}
            custom={itemIndexRef.current}
            exit="exit"
            initial="hidden"
            layout={false}
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
            transition={PRESS_SPRING}
            variants={itemVariants}
            whileTap={{ scale: 0.985 }}
          >
            {isActive ? (
              <motion.span
                className={selectItemHighlightClassName}
                layoutId={activeHighlightId}
                transition={highlightTransition}
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
                    className="text-[color:var(--sel-foreground)]"
                    exit={{ opacity: 0, scale: 0.8, y: 1 }}
                    initial={{ opacity: 0, scale: 0.8, y: 1 }}
                    transition={CHECK_SPRING}
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
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-[color:var(--sel-surface)] py-1 text-[color:var(--sel-muted-foreground)] [&_svg:not([class*='size-'])]:size-4",
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
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-[color:var(--sel-surface)] py-1 text-[color:var(--sel-muted-foreground)] [&_svg:not([class*='size-'])]:size-4",
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
