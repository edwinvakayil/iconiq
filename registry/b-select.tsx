"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const controlCornerInheritClassName =
  "rounded-[inherit] supports-[corner-shape:squircle]:[corner-shape:inherit]";

const selectThemeClassName =
  "[--sel-surface:#ffffff] [--sel-foreground:#111111] [--sel-border:#d5dae0] [--sel-ring:rgba(17,17,17,0.16)] [--sel-muted-foreground:#6d7480] [--sel-accent:#e9edf2] dark:[--sel-surface:#111111] dark:[--sel-foreground:#f6f3ec] dark:[--sel-border:#3a3834] dark:[--sel-ring:rgba(246,243,236,0.18)] dark:[--sel-muted-foreground:#9a958a] dark:[--sel-accent:#1e1e1c] [--color-accent:var(--sel-accent)] [--color-accent-foreground:var(--sel-foreground)]";

const selectTriggerClassName = cn(
  controlCornerClassName,
  "flex min-h-11 w-full touch-manipulation items-center justify-between gap-2 border border-[color:var(--sel-border)] bg-[color:var(--sel-surface)] px-4 py-3 text-left font-medium text-[color:var(--sel-foreground)] text-sm transition-[background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent/72 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--sel-ring),transparent_50%)] disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-[color:var(--sel-muted-foreground)]"
);

const selectPanelChromeClassName = cn(
  controlCornerClassName,
  "z-[300] overflow-hidden border border-[color:color-mix(in_oklch,var(--sel-border,#d5dae0),transparent_40%)] bg-[var(--sel-surface,#ffffff)] text-[var(--sel-foreground,#111111)] shadow-none dark:border-[color:color-mix(in_oklch,var(--sel-border,#3a3834),transparent_40%)] dark:bg-[var(--sel-surface,#111111)] dark:text-[var(--sel-foreground,#f6f3ec)]"
);

const selectItemClassName = cn(
  controlCornerClassName,
  "group relative isolate flex min-h-11 cursor-pointer touch-manipulation select-none items-center gap-3 py-2.5 pr-8 pl-3 text-[color:var(--sel-foreground)] text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-[color:var(--sel-muted-foreground)] data-[disabled]:opacity-50"
);

const selectItemHighlightClassName = cn(
  controlCornerInheritClassName,
  "absolute inset-0 -z-10 bg-accent/68"
);

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
  itemVariants: typeof itemVariants;
  open: boolean;
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

const chevronTransition = {
  type: "spring" as const,
  stiffness: 360,
  damping: 32,
  mass: 0.82,
};

const HIGHLIGHT_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 41,
  mass: 0.82,
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

function isEmptySelectValue(
  value: SelectRootProps["value"] | undefined | null
) {
  return value == null || value === "";
}

function toPrimitiveSelectValue(value: SelectRootProps["value"] | undefined) {
  return isEmptySelectValue(value) ? null : value;
}

const selectValueClassName =
  "flex min-w-0 flex-1 items-center gap-2 truncate text-left [&_svg]:shrink-0";

function resolveItemContent({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  if (!icon) {
    return children;
  }

  return (
    <>
      {icon}
      {children}
    </>
  );
}

function resolveItemText({
  children,
  label,
  textValue,
  value,
}: {
  children?: React.ReactNode;
  label?: string;
  textValue?: string;
  value: string;
}) {
  return (
    label ??
    textValue ??
    (typeof children === "string" ? children : undefined) ??
    value
  );
}

function Select(allProps: SelectProps) {
  const {
    children,
    defaultOpen = false,
    defaultValue,
    onOpenChange,
    onValueChange,
    open: openProp,
    value: valueProp,
    ...props
  } = allProps;
  const internalActionsRef = React.useRef<SelectPrimitive.Root.Actions | null>(
    null
  );
  const actionsRef = internalActionsRef;
  const skipExitAnimationRef = React.useRef(false);
  const isOpenControlled = openProp !== undefined;
  const isValueControlled = Object.hasOwn(allProps, "value");
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<SelectRootProps["value"]>(defaultValue);
  const [activeValue, setActiveValue] = React.useState<string | undefined>();
  const nextItemIndexRef = React.useRef(0);
  const openStateRef = React.useRef(false);
  const open = isOpenControlled ? openProp : uncontrolledOpen;
  const selectedValue = isValueControlled ? valueProp : uncontrolledValue;
  const activeHighlightId = React.useId();

  if (open && !openStateRef.current) {
    nextItemIndexRef.current = 0;
  }
  openStateRef.current = open;

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

  const getItemIndex = React.useCallback(() => {
    const itemIndex = nextItemIndexRef.current;
    nextItemIndexRef.current += 1;
    return itemIndex;
  }, []);

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      actionsRef,
      activeHighlightId,
      activeValue,
      getItemIndex,
      itemVariants,
      open,
      selectedValue,
      setActiveValue,
      skipExitAnimationRef,
    }),
    [
      actionsRef,
      activeHighlightId,
      activeValue,
      getItemIndex,
      open,
      selectedValue,
    ]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <SelectPrimitive.Root
        {...props}
        actionsRef={actionsRef}
        defaultValue={isValueControlled ? undefined : defaultValue}
        onOpenChange={handleOpenChange}
        onValueChange={handleValueChange}
        open={open}
        {...(isValueControlled
          ? { value: toPrimitiveSelectValue(valueProp) }
          : {})}
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

type SelectValueProps = Omit<SelectPrimitive.Value.Props, "children"> & {
  children?: React.ReactNode | ((value: string | undefined) => React.ReactNode);
};

function SelectValue({
  children,
  className,
  placeholder,
  style,
  ...props
}: SelectValueProps) {
  const { selectedValue } = useSelectContext("SelectValue");
  const hasValue = !isEmptySelectValue(selectedValue);
  const resolvedValue =
    hasValue && typeof selectedValue === "string" ? selectedValue : undefined;
  const resolvedChildren =
    typeof children === "function" ? children(resolvedValue) : children;
  const { render: _render, ...valueProps } = props;
  const valueClassName =
    typeof className === "function" ? undefined : className;
  const valueStyle = typeof style === "function" ? undefined : style;

  if (!hasValue) {
    return (
      <span
        className={cn(
          selectValueClassName,
          "text-[color:var(--sel-muted-foreground)]",
          valueClassName
        )}
        data-placeholder=""
        data-slot="select-value"
        style={valueStyle}
        {...valueProps}
      >
        {placeholder}
      </span>
    );
  }

  return (
    <span
      className={cn(selectValueClassName, valueClassName)}
      data-slot="select-value"
      style={valueStyle}
      {...valueProps}
    >
      {resolvedChildren ?? resolvedValue}
    </span>
  );
}

function SelectFieldChrome({
  children,
  className,
  description,
  descriptionClassName,
  descriptionId,
  label,
  labelClassName,
  triggerId,
}: {
  children: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  descriptionClassName?: string;
  descriptionId?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  triggerId: string;
}) {
  if (!(label || description)) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2",
        typeof className === "string" ? className : undefined
      )}
    >
      {label ? (
        <label
          className={cn("font-medium text-foreground text-sm", labelClassName)}
          htmlFor={triggerId}
        >
          {label}
        </label>
      ) : null}
      {description ? (
        <p
          className={cn(
            "text-pretty text-muted-foreground text-xs leading-snug tracking-tight",
            descriptionClassName
          )}
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  description,
  descriptionClassName,
  id: idProp,
  label,
  labelClassName,
  ...props
}: SelectPrimitive.Trigger.Props & {
  description?: React.ReactNode;
  descriptionClassName?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  size?: "sm" | "default";
}) {
  const { open } = useSelectContext("SelectTrigger");
  const generatedId = React.useId();
  const triggerId = idProp ?? generatedId;
  const descriptionId = description ? `${triggerId}-description` : undefined;
  const hasFieldChrome = Boolean(label || description);

  return (
    <SelectFieldChrome
      className={
        hasFieldChrome && typeof className === "string" ? className : undefined
      }
      description={description}
      descriptionClassName={descriptionClassName}
      descriptionId={descriptionId}
      label={label}
      labelClassName={labelClassName}
      triggerId={triggerId}
    >
      <SelectPrimitive.Trigger
        {...props}
        render={(triggerProps, triggerState) => {
          const {
            resolvedTriggerProps,
            triggerClassName,
            triggerRef,
            triggerStyle,
          } = resolveTriggerProps(triggerProps as TriggerRenderProps);
          const describedBy = [
            resolvedTriggerProps["aria-describedby"],
            descriptionId,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              {...resolvedTriggerProps}
              aria-describedby={describedBy || undefined}
              className={cn(
                selectThemeClassName,
                selectTriggerClassName,
                triggerClassName,
                hasFieldChrome
                  ? undefined
                  : resolveStateClassName(className, triggerState)
              )}
              data-size={size}
              data-slot="select-trigger"
              id={triggerId}
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
    </SelectFieldChrome>
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
  textValue,
  value,
  ...props
}: SelectPrimitive.Item.Props & {
  icon?: React.ReactNode;
  label?: string;
  textValue?: string;
}) {
  const {
    activeHighlightId,
    activeValue,
    getItemIndex,
    itemVariants,
    selectedValue,
    setActiveValue,
  } = useSelectContext("SelectItem");
  const itemValue = typeof value === "string" ? value : undefined;
  const resolvedText = itemValue
    ? resolveItemText({
        children,
        label: typeof label === "string" ? label : undefined,
        textValue,
        value: itemValue,
      })
    : undefined;
  const itemContent = resolveItemContent({
    children: children ?? resolvedText,
    icon,
  });
  const itemIndexRef = React.useRef<number | null>(null);

  if (itemIndexRef.current === null) {
    itemIndexRef.current = getItemIndex();
  }

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      label={resolvedText}
      value={value}
      {...props}
      render={(itemProps, itemState) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as ItemRenderProps);
        const isDisabled = itemState.disabled;
        const isActive =
          !isDisabled && itemValue !== undefined && itemValue === activeValue;
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
              isDisabled &&
                "pointer-events-none cursor-not-allowed text-[color:var(--sel-muted-foreground)] opacity-50",
              itemClassName,
              resolveStateClassName(className, itemState)
            )}
            custom={itemIndexRef.current}
            data-disabled={isDisabled ? "" : undefined}
            exit="exit"
            initial="hidden"
            layout={false}
            onMouseEnter={composeEventHandlers(
              resolvedItemProps.onMouseEnter,
              () => {
                if (!isDisabled) {
                  setActiveValue(itemValue);
                }
              }
            )}
            onPointerMove={composeEventHandlers(
              resolvedItemProps.onPointerMove,
              () => {
                if (!isDisabled) {
                  setActiveValue(itemValue);
                }
              }
            )}
            ref={(node) => {
              setRef(itemRef, node);
            }}
            style={itemStyle}
            transition={PRESS_SPRING}
            variants={itemVariants}
            whileTap={isDisabled ? undefined : { scale: 0.96 }}
          >
            {isActive ? (
              <motion.span
                className={selectItemHighlightClassName}
                initial={false}
                layoutId={activeHighlightId}
                transition={HIGHLIGHT_SPRING}
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
