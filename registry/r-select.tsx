"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as SelectPrimitive from "@radix-ui/react-select";
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

const selectListScrollbarClassName =
  "z-10 flex w-2 shrink-0 touch-none select-none bg-transparent p-px opacity-0 transition-opacity duration-150 data-[state=visible]:pointer-events-auto data-[state=visible]:opacity-100";

const selectListThumbClassName =
  "relative rounded-full bg-muted-foreground/50 bg-[color:color-mix(in_oklch,var(--sel-muted-foreground),transparent_35%)]";

const MAX_MENU_HEIGHT = 320;
const INSTANT_CLOSE_TRANSITION = { duration: 0 } as const;
const POPUP_TRANSFORM_ORIGIN = "top center";
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

type SelectRootProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
>;

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
  activeHighlightId: string;
  activeValue?: string;
  getItemIndex: () => number;
  itemLabelsRef: React.RefObject<Record<string, React.ReactNode>>;
  itemVariants: typeof itemVariants;
  open: boolean;
  registerItemLabel: (value: string, label: React.ReactNode) => void;
  selectedValue?: string;
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
    (nextOpen) => {
      if (nextOpen) {
        skipExitAnimationRef.current = false;
      }

      if (!isOpenControlled) {
        setUncontrolledOpen(nextOpen);
      }

      if (!nextOpen) {
        setActiveValue(undefined);
      }

      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange]
  );

  const handleValueChange = React.useCallback<
    NonNullable<SelectRootProps["onValueChange"]>
  >(
    (nextValue) => {
      if (!isValueControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
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

function SelectGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>) {
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
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>) {
  const { itemLabelsRef, selectedValue } = useSelectContext("SelectValue");
  const hasValue = Boolean(selectedValue);
  const selectedLabel = selectedValue
    ? itemLabelsRef.current[selectedValue]
    : undefined;
  const valueChildren = hasValue
    ? (children ?? selectedLabel ?? selectedValue)
    : placeholder;
  const { asChild: _asChild, ...valueProps } = props;

  return (
    <span
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 truncate text-left [&_svg]:shrink-0",
        className
      )}
      data-placeholder={hasValue ? undefined : ""}
      data-slot="select-value"
      {...valueProps}
    >
      {valueChildren}
    </span>
  );
}

function SelectTrigger({
  children,
  className,
  size = "default",
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  const { open } = useSelectContext("SelectTrigger");

  return (
    <SelectPrimitive.Trigger asChild {...props}>
      <button
        className={cn(selectThemeClassName, selectTriggerClassName, className)}
        data-size={size}
        data-slot="select-trigger"
        type="button"
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="shrink-0"
            transition={chevronTransition}
          >
            <ChevronDownIcon className="h-4 w-4 text-[color:var(--sel-muted-foreground)]" />
          </motion.span>
        </SelectPrimitive.Icon>
      </button>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  align = "start",
  avoidCollisions = false,
  children,
  className,
  collisionPadding = 12,
  position = "popper",
  side = "bottom",
  sideOffset = 8,
  style,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) {
  const { open, setActiveValue, skipExitAnimationRef } =
    useSelectContext("SelectContent");
  const panelVariants = {
    closed: {
      ...popupMotion.closed,
      transition: popupMotion.closedTransition,
    },
    closedInstant: {
      opacity: popupMotion.closed.opacity,
      scale: popupMotion.closed.scale,
      y: popupMotion.closed.y,
      transition: INSTANT_CLOSE_TRANSITION,
    },
    open: {
      ...popupMotion.animate,
      transition: popupMotion.openTransition,
    },
  };

  return (
    <AnimatePresence
      custom={skipExitAnimationRef}
      onExitComplete={() => {
        skipExitAnimationRef.current = false;
      }}
    >
      {open ? (
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            {...({
              align,
              asChild: true,
              avoidCollisions,
              collisionPadding,
              forceMount: true,
              position,
              side,
              sideOffset,
              ...props,
            } as React.ComponentPropsWithoutRef<
              typeof SelectPrimitive.Content
            >)}
          >
            <div
              style={{
                width: "var(--radix-select-trigger-width)",
                ...style,
              }}
            >
              <motion.div
                animate="open"
                className={cn(
                  selectThemeClassName,
                  selectPanelChromeClassName,
                  "flex transform-gpu flex-col",
                  className
                )}
                custom={skipExitAnimationRef}
                data-slot="select-content"
                exit={
                  ((
                    custom: React.MutableRefObject<boolean>
                  ): "closed" | "closedInstant" =>
                    custom.current ? "closedInstant" : "closed") as never
                }
                initial="closed"
                style={{ transformOrigin: POPUP_TRANSFORM_ORIGIN }}
                variants={panelVariants}
              >
                <SelectScrollUpButton />
                <motion.div className="relative min-h-0 flex-1" layoutRoot>
                  <ScrollAreaPrimitive.Root
                    className="relative flex min-h-0 flex-1 flex-col"
                    scrollHideDelay={100}
                    style={{
                      maxHeight: `min(var(--radix-select-content-available-height), ${MAX_MENU_HEIGHT}px)`,
                    }}
                    type="hover"
                  >
                    <ScrollAreaPrimitive.Viewport className="min-h-0 flex-1 overscroll-contain outline-none">
                      <SelectPrimitive.Viewport
                        className="p-1.5"
                        onPointerLeave={() => {
                          setActiveValue(undefined);
                        }}
                      >
                        {children}
                      </SelectPrimitive.Viewport>
                    </ScrollAreaPrimitive.Viewport>
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
              </motion.div>
            </div>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
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
  value,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
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
    skipExitAnimationRef,
  } = useSelectContext("SelectItem");
  const isActive = value === activeValue;
  const isSelected = value === selectedValue;
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

  registerItemLabel(value, itemContent);

  return (
    <SelectPrimitive.Item
      asChild
      onSelect={() => {
        skipExitAnimationRef.current = true;
      }}
      value={value}
      {...props}
    >
      <motion.div
        animate="visible"
        className={cn(
          "transform-gpu",
          selectItemClassName,
          !isActive && "hover:bg-accent/60",
          className
        )}
        custom={itemIndexRef.current}
        exit="exit"
        initial="hidden"
        layout={false}
        onMouseEnter={composeEventHandlers(props.onMouseEnter, () => {
          setActiveValue(value);
        })}
        onPointerMove={composeEventHandlers(props.onPointerMove, () => {
          setActiveValue(value);
        })}
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
        <SelectPrimitive.ItemText asChild>
          <span className="relative z-10 flex min-w-0 flex-1 items-center gap-2 truncate text-left [&_svg]:shrink-0">
            {itemContent}
          </span>
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
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-[color:color-mix(in_oklch,var(--sel-border),transparent_40%)]",
        className
      )}
      data-slot="select-separator"
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-[color:var(--sel-surface)] py-1 text-[color:var(--sel-muted-foreground)] [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-[color:var(--sel-surface)] py-1 text-[color:var(--sel-muted-foreground)] [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
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
