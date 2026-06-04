"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { Check, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const contextMenuThemeClassName =
  "[--cm-surface:#ffffff] [--cm-foreground:#111111] [--cm-border:#e3e7ec] [--cm-muted-foreground:#6d7480] [--cm-accent:#f3f5f8] [--color-accent:var(--cm-accent)] [--color-accent-foreground:var(--cm-accent-foreground)] [--cm-accent-foreground:#111111] [--cm-destructive:#dc2626] [--cm-ring:rgba(17,17,17,0.16)] dark:[--cm-surface:#111111] dark:[--cm-foreground:#f6f3ec] dark:[--cm-border:#2b2a25] dark:[--cm-muted-foreground:#9a958a] dark:[--cm-accent:#1a1a18] [--color-accent:var(--cm-accent)] [--color-accent-foreground:var(--cm-accent-foreground)] dark:[--cm-accent-foreground:#f6f3ec] dark:[--cm-destructive:#f87171] dark:[--cm-ring:rgba(246,243,236,0.18)]";

const ITEM_HEIGHT = 44;

const contextMenuPanelChromeClassName =
  "z-50 min-w-[232px] overflow-hidden rounded-lg border border-[color:color-mix(in_oklch,var(--cm-border),transparent_40%)] bg-[color:var(--cm-surface)] text-[color:var(--cm-foreground)] shadow-2xl";

const contextMenuPanelScrollbarClassName =
  "z-10 my-1.5 mr-0.5 w-1 shrink-0 touch-none select-none opacity-0 transition-opacity duration-150 before:absolute before:left-1/2 before:h-full before:w-5 before:-translate-x-1/2 before:content-[''] data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0";

const contextMenuPanelThumbClassName =
  "relative rounded-full bg-muted-foreground/50 bg-[color:color-mix(in_oklch,var(--cm-muted-foreground),transparent_35%)]";

const contextMenuTriggerClassName =
  "select-none outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--cm-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cm-surface)]";

const contextMenuItemHighlightClassName =
  "absolute inset-0 rounded-lg bg-[color:var(--cm-accent)]";

const contextMenuItemDefaultClassName =
  "text-[color:color-mix(in_oklch,var(--cm-foreground),transparent_15%)] hover:bg-accent/60";

const contextMenuItemDestructiveClassName =
  "text-[color:var(--cm-destructive)] hover:bg-accent/60";

const contextMenuSubTriggerOpenClassName =
  "data-popup-open:bg-[color:var(--cm-accent)] data-popup-open:text-[color:var(--cm-accent-foreground)]";

type DivRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

type ButtonRenderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

type ContextMenuContextValue = {
  actionsRef: React.RefObject<ContextMenuPrimitive.Root.Actions | null>;
  contentId: string;
  hoveredItemId: string | undefined;
  open: boolean;
  reduceMotion: boolean;
  setHoveredItemId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(
  null
);

function useContextMenu(componentName: string) {
  const context = React.useContext(ContextMenuContext);

  if (!context) {
    throw new Error(`${componentName} must be used within ContextMenu.`);
  }

  return context;
}

function isContextMenuKeyboardShortcut(
  event: React.KeyboardEvent<HTMLElement>
) {
  return event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");
}

function dispatchContextMenuFromKeyboard(target: HTMLElement) {
  const rect = target.getBoundingClientRect();

  target.dispatchEvent(
    new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + Math.min(rect.width / 2, 24),
      clientY: rect.bottom,
    })
  );
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function resolvePopupProps(popupProps: DivRenderProps) {
  const {
    children: _popupChildren,
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

function resolveItemProps(itemProps: ButtonRenderProps) {
  const {
    children: _itemChildren,
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

function getActiveHighlightTransition(reduceMotion: boolean) {
  return reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 600, damping: 38 };
}

function getItemEntranceTransition() {
  return {
    duration: 0.12,
    ease: [0.16, 1, 0.3, 1] as const,
  };
}

function getContentMotionTransition() {
  return {
    duration: 0.14,
    ease: [0.16, 1, 0.3, 1] as const,
  };
}

function ContextMenuPanelScroll({
  children,
  onPointerLeave,
}: {
  children: React.ReactNode;
  onPointerLeave?: () => void;
}) {
  return (
    <ScrollAreaPrimitive.Root className="relative h-full max-h-full overflow-hidden">
      <ScrollAreaPrimitive.Viewport className="h-full max-h-full min-h-0 overscroll-contain outline-none">
        <div
          className="overflow-x-hidden p-1.5"
          onPointerLeave={onPointerLeave}
        >
          {children}
        </div>
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        className={contextMenuPanelScrollbarClassName}
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className={contextMenuPanelThumbClassName} />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
}

function renderMotionPanel({
  actionsRef,
  children,
  className,
  onPointerLeave,
  popupClassName,
  popupRef,
  popupState,
  popupStyle,
  resolvedPopupProps,
  unmountOnClose = true,
}: {
  actionsRef: React.RefObject<ContextMenuPrimitive.Root.Actions | null>;
  children: React.ReactNode;
  className?: string;
  onPointerLeave?: () => void;
  popupClassName?: string;
  popupRef?: React.Ref<HTMLDivElement>;
  popupState: { open: boolean; transitionStatus?: string };
  popupStyle?: React.CSSProperties;
  resolvedPopupProps: Omit<
    DivRenderProps,
    "children" | "className" | "ref" | "style"
  >;
  unmountOnClose?: boolean;
}) {
  return (
    <motion.div
      {...(resolvedPopupProps as React.ComponentPropsWithoutRef<
        typeof motion.div
      >)}
      animate={popupState.open ? { scale: 1, y: 0 } : { scale: 0.96, y: -2 }}
      className={cn(
        contextMenuThemeClassName,
        contextMenuPanelChromeClassName,
        className,
        popupClassName
      )}
      initial={
        popupState.transitionStatus === "starting"
          ? { scale: 0.94, y: -4 }
          : false
      }
      onAnimationComplete={() => {
        if (!popupState.open && unmountOnClose) {
          actionsRef.current?.unmount();
        }
      }}
      ref={(node) => {
        setRef(popupRef, node);
      }}
      style={{
        ...popupStyle,
        maxHeight: "calc(100vh - 16px)",
        overscrollBehavior: "contain",
        pointerEvents: popupState.open ? undefined : "none",
        transformOrigin: "var(--transform-origin)",
      }}
      transition={getContentMotionTransition()}
    >
      <ContextMenuPanelScroll onPointerLeave={onPointerLeave}>
        {children}
      </ContextMenuPanelScroll>
    </motion.div>
  );
}

type ContextMenuProps = Omit<
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>,
  "children" | "defaultOpen" | "onOpenChange" | "open"
> &
  ReducedMotionProp & {
    children?: React.ReactNode;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
  };

function ContextMenu({
  children,
  defaultOpen = false,
  onOpenChange,
  open: openProp,
  reducedMotion,
  ...props
}: ContextMenuProps) {
  const contentId = React.useId();
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const actionsRef = React.useRef<ContextMenuPrimitive.Root.Actions | null>(
    null
  );
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const [hoveredItemId, setHoveredItemId] = React.useState<
    string | undefined
  >();

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (!open) {
      setHoveredItemId(undefined);
    }
  }, [open]);

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <ContextMenuContext.Provider
        value={{
          actionsRef,
          contentId,
          hoveredItemId,
          open,
          reduceMotion,
          setHoveredItemId,
        }}
      >
        <ContextMenuPrimitive.Root
          {...props}
          actionsRef={actionsRef}
          onOpenChange={handleOpenChange}
          open={open}
        >
          {children}
        </ContextMenuPrimitive.Root>
      </ContextMenuContext.Provider>
    </ReducedMotionConfig>
  );
}
ContextMenu.displayName = "ContextMenu";

type ContextMenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Trigger
> & {
  asChild?: boolean;
};

const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuTriggerProps
>(({ asChild, children, className, onKeyDown, ...props }, ref) => {
  const { open } = useContextMenu("ContextMenuTrigger");

  const handleKeyDown: ContextMenuTriggerProps["onKeyDown"] = (event) => {
    onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      !isContextMenuKeyboardShortcut(
        event as React.KeyboardEvent<HTMLDivElement>
      )
    ) {
      return;
    }

    event.preventDefault();
    dispatchContextMenuFromKeyboard(event.currentTarget);
  };

  if (asChild) {
    if (!React.isValidElement<React.HTMLAttributes<HTMLElement>>(children)) {
      throw new Error(
        "ContextMenuTrigger with asChild expects a single React element child."
      );
    }

    const child = React.Children.only(children);

    return (
      <ContextMenuPrimitive.Trigger
        {...props}
        aria-expanded={open}
        aria-haspopup="menu"
        className={className}
        data-slot="context-menu-trigger"
        onKeyDown={handleKeyDown}
        ref={ref}
        render={React.cloneElement(child, {
          className: cn(
            contextMenuThemeClassName,
            contextMenuTriggerClassName,
            className,
            child.props.className
          ),
        })}
      />
    );
  }

  return (
    <ContextMenuPrimitive.Trigger
      {...props}
      aria-expanded={open}
      aria-haspopup="menu"
      className={cn(
        contextMenuThemeClassName,
        contextMenuTriggerClassName,
        className
      )}
      data-slot="context-menu-trigger"
      onKeyDown={handleKeyDown}
      ref={ref}
      tabIndex={0}
    >
      {children}
    </ContextMenuPrimitive.Trigger>
  );
});
ContextMenuTrigger.displayName = "ContextMenuTrigger";

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubmenuRoot>) {
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  );
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

type ContextMenuContentProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Popup
> & {
  className?: string;
};

function ContextMenuContent({ children, className }: ContextMenuContentProps) {
  const { actionsRef, setHoveredItemId } = useContextMenu("ContextMenuContent");

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner className="z-50 outline-none">
        <ContextMenuPrimitive.Popup
          finalFocus
          render={(popupProps, popupState) => {
            const { popupClassName, popupRef, popupStyle, resolvedPopupProps } =
              resolvePopupProps(popupProps);

            if (!popupState.open) {
              return (
                <div
                  {...(resolvedPopupProps as React.HTMLAttributes<HTMLDivElement>)}
                  hidden
                  ref={(node) => {
                    setRef(popupRef, node);
                  }}
                />
              );
            }

            return renderMotionPanel({
              actionsRef,
              children,
              className,
              onPointerLeave: () => {
                setHoveredItemId(undefined);
              },
              popupClassName,
              popupRef,
              popupState,
              popupStyle,
              resolvedPopupProps,
              unmountOnClose: false,
            });
          }}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}
ContextMenuContent.displayName = "ContextMenuContent";

type ContextMenuItemProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Item
> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};

function ContextMenuItem({
  children,
  className,
  disabled,
  inset,
  variant = "default",
  ...props
}: ContextMenuItemProps) {
  const { contentId, hoveredItemId, reduceMotion, setHoveredItemId } =
    useContextMenu("ContextMenuItem");
  const itemId = React.useId();
  const isHovered = hoveredItemId === itemId;
  const isDestructive = variant === "destructive";

  return (
    <ContextMenuPrimitive.Item
      closeOnClick
      disabled={disabled}
      render={(itemProps) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as ButtonRenderProps);

        return (
          <motion.button
            {...resolvedItemProps}
            animate={{ opacity: 1, x: 0 }}
            aria-disabled={disabled}
            className={cn(
              "group/context-menu-item relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-medium text-sm outline-none transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-40",
              isDestructive
                ? contextMenuItemDestructiveClassName
                : contextMenuItemDefaultClassName,
              inset && "pl-7",
              itemClassName,
              className
            )}
            data-inset={inset ? "" : undefined}
            data-slot="context-menu-item"
            data-variant={variant}
            initial={{ opacity: 0, x: -4 }}
            onFocus={() => {
              if (!disabled) {
                setHoveredItemId(itemId);
              }
            }}
            onMouseEnter={() => {
              if (!disabled) {
                setHoveredItemId(itemId);
              }
            }}
            onPointerMove={() => {
              if (!disabled) {
                setHoveredItemId(itemId);
              }
            }}
            ref={(node) => {
              setRef(itemRef, node);
            }}
            style={{
              ...itemStyle,
              minHeight: ITEM_HEIGHT,
            }}
            tabIndex={disabled ? -1 : undefined}
            transition={getItemEntranceTransition()}
            type="button"
          >
            {isHovered && !disabled ? (
              <motion.div
                className={contextMenuItemHighlightClassName}
                layoutId={`${contentId}-context-menu-active`}
                transition={getActiveHighlightTransition(reduceMotion)}
              />
            ) : null}
            <span className="relative z-10 flex flex-1 items-center gap-2.5">
              {children}
            </span>
          </motion.button>
        );
      }}
      {...props}
    />
  );
}
ContextMenuItem.displayName = "ContextMenuItem";

type ContextMenuSubTriggerProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubmenuTrigger
> & {
  inset?: boolean;
};

function ContextMenuSubTrigger({
  children,
  className,
  inset,
  ...props
}: ContextMenuSubTriggerProps) {
  const { contentId, hoveredItemId, reduceMotion, setHoveredItemId } =
    useContextMenu("ContextMenuSubTrigger");
  const itemId = React.useId();
  const isHovered = hoveredItemId === itemId;

  return (
    <ContextMenuPrimitive.SubmenuTrigger
      render={(itemProps) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as ButtonRenderProps);

        return (
          <motion.button
            {...resolvedItemProps}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-medium text-sm outline-none transition-colors",
              contextMenuItemDefaultClassName,
              contextMenuSubTriggerOpenClassName,
              inset && "pl-7",
              itemClassName,
              className
            )}
            data-inset={inset ? "" : undefined}
            data-slot="context-menu-sub-trigger"
            initial={{ opacity: 0, x: -4 }}
            onFocus={() => {
              setHoveredItemId(itemId);
            }}
            onMouseEnter={() => {
              setHoveredItemId(itemId);
            }}
            onPointerMove={() => {
              setHoveredItemId(itemId);
            }}
            ref={(node) => {
              setRef(itemRef, node);
            }}
            style={{
              ...itemStyle,
              minHeight: ITEM_HEIGHT,
            }}
            transition={getItemEntranceTransition()}
            type="button"
          >
            {isHovered ? (
              <motion.div
                className={contextMenuItemHighlightClassName}
                layoutId={`${contentId}-context-menu-active`}
                transition={getActiveHighlightTransition(reduceMotion)}
              />
            ) : null}
            <span className="relative z-10 flex flex-1 items-center gap-2.5">
              {children}
            </span>
            <ChevronRight className="relative z-10 ml-auto size-4 opacity-70" />
          </motion.button>
        );
      }}
      {...props}
    />
  );
}
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

type ContextMenuSubContentProps = {
  children?: React.ReactNode;
  className?: string;
};

function ContextMenuSubContent({
  children,
  className,
}: ContextMenuSubContentProps) {
  const { actionsRef, setHoveredItemId } = useContextMenu(
    "ContextMenuSubContent"
  );

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner className="z-50 outline-none">
        <ContextMenuPrimitive.Popup
          render={(popupProps, popupState) => {
            const { popupClassName, popupRef, popupStyle, resolvedPopupProps } =
              resolvePopupProps(popupProps);

            if (!popupState.open) {
              return (
                <div
                  {...(resolvedPopupProps as React.HTMLAttributes<HTMLDivElement>)}
                  hidden
                  ref={(node) => {
                    setRef(popupRef, node);
                  }}
                />
              );
            }

            return renderMotionPanel({
              actionsRef,
              children,
              className,
              onPointerLeave: () => {
                setHoveredItemId(undefined);
              },
              popupClassName,
              popupRef,
              popupState,
              popupStyle,
              resolvedPopupProps,
              unmountOnClose: false,
            });
          }}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}
ContextMenuSubContent.displayName = "ContextMenuSubContent";

type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.CheckboxItem
> & {
  inset?: boolean;
};

function ContextMenuCheckboxItem({
  checked,
  children,
  className,
  disabled,
  inset,
  ...props
}: ContextMenuCheckboxItemProps) {
  const { contentId, hoveredItemId, reduceMotion, setHoveredItemId } =
    useContextMenu("ContextMenuCheckboxItem");
  const itemId = React.useId();
  const isHovered = hoveredItemId === itemId;

  return (
    <ContextMenuPrimitive.CheckboxItem
      checked={checked}
      disabled={disabled}
      render={(itemProps) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as ButtonRenderProps);

        return (
          <motion.button
            {...resolvedItemProps}
            animate={{ opacity: disabled ? 0.5 : 1, x: 0 }}
            aria-disabled={disabled}
            className={cn(
              "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 pr-8 pl-3 text-left font-medium text-sm outline-none transition-colors",
              contextMenuItemDefaultClassName,
              "disabled:cursor-not-allowed data-[disabled]:pointer-events-none",
              inset && "pl-7",
              itemClassName,
              className
            )}
            data-disabled={disabled ? "" : undefined}
            data-inset={inset ? "" : undefined}
            data-slot="context-menu-checkbox-item"
            disabled={disabled}
            initial={{ opacity: 0, x: -4 }}
            onFocus={() => {
              if (!disabled) {
                setHoveredItemId(itemId);
              }
            }}
            onMouseEnter={() => {
              if (!disabled) {
                setHoveredItemId(itemId);
              }
            }}
            onPointerMove={() => {
              if (!disabled) {
                setHoveredItemId(itemId);
              }
            }}
            ref={(node) => {
              setRef(itemRef, node);
            }}
            style={{
              ...itemStyle,
              minHeight: ITEM_HEIGHT,
            }}
            tabIndex={disabled ? -1 : undefined}
            transition={getItemEntranceTransition()}
            type="button"
          >
            {isHovered && !disabled ? (
              <motion.div
                className={contextMenuItemHighlightClassName}
                layoutId={`${contentId}-context-menu-active`}
                transition={getActiveHighlightTransition(reduceMotion)}
              />
            ) : null}
            <span className="relative z-10 flex flex-1 items-center gap-2.5">
              {children}
            </span>
            <span className="pointer-events-none absolute right-3 z-10">
              <ContextMenuPrimitive.CheckboxItemIndicator>
                <Check className="size-4" />
              </ContextMenuPrimitive.CheckboxItemIndicator>
            </span>
          </motion.button>
        );
      }}
      {...props}
    />
  );
}
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.RadioItem
> & {
  inset?: boolean;
};

function ContextMenuRadioItem({
  children,
  className,
  disabled,
  inset,
  ...props
}: ContextMenuRadioItemProps) {
  const { contentId, hoveredItemId, reduceMotion, setHoveredItemId } =
    useContextMenu("ContextMenuRadioItem");
  const itemId = React.useId();
  const isHovered = hoveredItemId === itemId;

  return (
    <ContextMenuPrimitive.RadioItem
      disabled={disabled}
      render={(itemProps) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as ButtonRenderProps);

        return (
          <motion.button
            {...resolvedItemProps}
            animate={{ opacity: 1, x: 0 }}
            aria-disabled={disabled}
            className={cn(
              "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 pr-8 pl-3 text-left font-medium text-sm outline-none transition-colors",
              contextMenuItemDefaultClassName,
              "disabled:cursor-not-allowed disabled:opacity-40",
              inset && "pl-7",
              itemClassName,
              className
            )}
            data-inset={inset ? "" : undefined}
            data-slot="context-menu-radio-item"
            initial={{ opacity: 0, x: -4 }}
            onFocus={() => {
              if (!disabled) {
                setHoveredItemId(itemId);
              }
            }}
            onMouseEnter={() => {
              if (!disabled) {
                setHoveredItemId(itemId);
              }
            }}
            onPointerMove={() => {
              if (!disabled) {
                setHoveredItemId(itemId);
              }
            }}
            ref={(node) => {
              setRef(itemRef, node);
            }}
            style={{
              ...itemStyle,
              minHeight: ITEM_HEIGHT,
            }}
            tabIndex={disabled ? -1 : undefined}
            transition={getItemEntranceTransition()}
            type="button"
          >
            {isHovered && !disabled ? (
              <motion.div
                className={contextMenuItemHighlightClassName}
                layoutId={`${contentId}-context-menu-active`}
                transition={getActiveHighlightTransition(reduceMotion)}
              />
            ) : null}
            <span className="relative z-10 flex flex-1 items-center gap-2.5">
              {children}
            </span>
            <span className="pointer-events-none absolute right-3 z-10">
              <ContextMenuPrimitive.RadioItemIndicator>
                <Check className="size-4" />
              </ContextMenuPrimitive.RadioItemIndicator>
            </span>
          </motion.button>
        );
      }}
      {...props}
    />
  );
}
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

type ContextMenuLabelProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.GroupLabel
> & {
  inset?: boolean;
};

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.GroupLabel
      className={cn(
        "px-3 py-1 font-medium text-[color:var(--cm-muted-foreground)] text-xs",
        inset && "pl-7",
        className
      )}
      data-inset={inset ? "" : undefined}
      data-slot="context-menu-label"
      {...props}
    />
  );
}
ContextMenuLabel.displayName = "ContextMenuLabel";

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn(
        "my-1 h-px bg-[color:color-mix(in_oklch,var(--cm-border),transparent_40%)]",
        className
      )}
      data-slot="context-menu-separator"
      {...props}
    />
  );
}
ContextMenuSeparator.displayName = "ContextMenuSeparator";

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "relative z-10 ml-auto text-[color:color-mix(in_oklch,var(--cm-muted-foreground),transparent_30%)] text-xs tracking-widest",
        className
      )}
      data-slot="context-menu-shortcut"
      {...props}
    />
  );
}
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
