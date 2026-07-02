"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { Check, ChevronRight } from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const controlCornerInheritClassName =
  "rounded-[inherit] supports-[corner-shape:squircle]:[corner-shape:inherit]";

const contextMenuThemeClassName =
  "[--cm-surface:var(--popover,#ffffff)] [--cm-foreground:var(--popover-foreground,#111111)] [--cm-border:var(--border,#e3e7ec)] [--cm-muted-foreground:var(--muted-foreground,#6d7480)] [--cm-accent:var(--accent,#f3f5f8)] [--color-accent:var(--cm-accent)] [--color-accent-foreground:var(--cm-accent-foreground)] [--cm-accent-foreground:var(--accent-foreground,#111111)] [--cm-destructive:var(--destructive,#dc2626)] [--cm-ring:var(--ring,rgba(17,17,17,0.16))] dark:[--cm-surface:var(--popover,#111111)] dark:[--cm-foreground:var(--popover-foreground,#f6f3ec)] dark:[--cm-border:var(--border,#2b2a25)] dark:[--cm-muted-foreground:var(--muted-foreground,#9a958a)] dark:[--cm-accent:var(--accent,#1a1a18)] dark:[--cm-accent-foreground:var(--accent-foreground,#f6f3ec)] dark:[--cm-destructive:var(--destructive,#f87171)] dark:[--cm-ring:var(--ring,rgba(246,243,236,0.18))]";

const ITEM_HEIGHT = 44;

const contextMenuPanelChromeClassName = cn(
  controlCornerClassName,
  "z-50 min-w-[232px] overflow-hidden border border-[color:color-mix(in_oklch,var(--cm-border),transparent_40%)] bg-[color:var(--cm-surface)] text-[color:var(--cm-foreground)] shadow-lg"
);

const contextMenuPanelScrollbarClassName =
  "z-10 my-1.5 mr-0.5 w-1 shrink-0 touch-none select-none opacity-0 transition-opacity duration-150 before:absolute before:left-1/2 before:h-full before:w-5 before:-translate-x-1/2 before:content-[''] data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0";

const contextMenuPanelThumbClassName =
  "relative rounded-full bg-[color:color-mix(in_oklch,var(--cm-muted-foreground),transparent_35%)]";

export const contextMenuTriggerClassName =
  "select-none outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--cm-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cm-surface)]";

const contextMenuItemHighlightClassName = cn(
  controlCornerInheritClassName,
  "absolute inset-0 bg-[color:var(--cm-accent)]"
);

const contextMenuItemClassName = cn(
  controlCornerClassName,
  "group/context-menu-item relative flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left font-medium text-sm outline-none transition-colors"
);

const contextMenuSubTriggerClassName = cn(
  controlCornerClassName,
  "group/context-menu-item relative flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left font-medium text-sm outline-none transition-colors"
);

const contextMenuIndicatorItemClassName = cn(
  controlCornerClassName,
  "group/context-menu-item relative flex w-full cursor-pointer items-center gap-2.5 py-2.5 pr-8 pl-3 text-left font-medium text-sm outline-none transition-colors"
);

const contextMenuItemDefaultClassName =
  "text-[color:color-mix(in_oklch,var(--cm-foreground),transparent_15%)]";

const contextMenuItemDestructiveClassName =
  "text-[color:var(--cm-destructive)]";

const contextMenuItemDisabledClassName =
  "pointer-events-none cursor-not-allowed text-[color:var(--cm-muted-foreground)] opacity-50 data-popup-open:bg-transparent data-popup-open:text-[color:var(--cm-muted-foreground)] [&_svg]:text-[color:var(--cm-muted-foreground)] [&_svg]:opacity-70";

const contextMenuSubTriggerOpenClassName =
  "data-popup-open:bg-[color:var(--cm-accent)] data-popup-open:text-[color:var(--cm-accent-foreground)]";

const contextMenuShortcutClassName =
  "relative z-10 ml-auto text-[color:color-mix(in_oklch,var(--cm-muted-foreground),transparent_30%)] text-xs tracking-widest opacity-70 transition-opacity group-focus-visible/context-menu-item:opacity-100 group-hover/context-menu-item:opacity-100 group-data-[disabled]/context-menu-item:text-[color:var(--cm-muted-foreground)] group-data-[disabled]/context-menu-item:opacity-50";

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

type TriggerElementProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
};

type TriggerChildElement = React.ReactElement<
  TriggerElementProps & React.RefAttributes<HTMLElement>
>;

type ContextMenuContextValue = {
  actionsRef: React.RefObject<ContextMenuPrimitive.Root.Actions | null>;
  open: boolean;
};

type PanelContextValue = {
  activeItemId: string | undefined;
  panelId: string;
  setActiveItemId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(
  null
);

const PanelContext = React.createContext<PanelContextValue | null>(null);

function useContextMenu(componentName: string) {
  const context = React.useContext(ContextMenuContext);

  if (!context) {
    throw new Error(`${componentName} must be used within ContextMenu.`);
  }

  return context;
}

function useContextMenuPanel(componentName: string) {
  const context = React.useContext(PanelContext);

  if (!context) {
    throw new Error(`${componentName} must be used within ContextMenuContent.`);
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

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T) => {
    for (const ref of refs) {
      setRef(ref, value);
    }
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

function getElementRef<T>(element: React.ReactElement) {
  return (
    (
      element as React.ReactElement & {
        ref?: React.Ref<T>;
        props: { ref?: React.Ref<T> };
      }
    ).ref ??
    (
      element as React.ReactElement & {
        ref?: React.Ref<T>;
        props: { ref?: React.Ref<T> };
      }
    ).props.ref
  );
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

function resolveStateClassName<State>(
  className: string | ((state: State) => string | undefined) | undefined,
  state: State
) {
  return typeof className === "function" ? className(state) : className;
}

const activeHighlightTransition = {
  type: "spring" as const,
  stiffness: 600,
  damping: 38,
};

const panelMotionVariants = {
  closed: { opacity: 0, scale: 0.96, y: -2 },
  open: { opacity: 1, scale: 1, y: 0 },
};

const reducedPanelMotionVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

function getItemEntranceTransition(reduceMotion: boolean) {
  if (reduceMotion) {
    return { duration: 0 };
  }

  return {
    duration: 0.12,
    ease: [0.16, 1, 0.3, 1] as const,
  };
}

function getPanelMotionTransition(reduceMotion: boolean) {
  if (reduceMotion) {
    return { duration: 0 };
  }

  return {
    duration: 0.14,
    ease: [0.16, 1, 0.3, 1] as const,
  };
}

function ContextMenuPanelProvider({ children }: { children: React.ReactNode }) {
  const panelId = React.useId();
  const [activeItemId, setActiveItemId] = React.useState<string | undefined>();

  return (
    <PanelContext.Provider value={{ activeItemId, panelId, setActiveItemId }}>
      {children}
    </PanelContext.Provider>
  );
}

function ContextMenuPanelScroll({ children }: { children: React.ReactNode }) {
  return (
    <ScrollAreaPrimitive.Root
      className="relative overflow-hidden"
      style={{ maxHeight: "calc(100vh - 32px)" }}
    >
      <ScrollAreaPrimitive.Viewport className="max-h-[inherit] min-h-0 overscroll-contain outline-none">
        <motion.div className="relative overflow-x-hidden p-1.5" layoutRoot>
          {children}
        </motion.div>
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

function renderContextMenuItemButton({
  activeItemId,
  baseClassName,
  children,
  className,
  disabled,
  dataVariant,
  highlighted,
  inset,
  itemClassName,
  itemId,
  itemRef,
  itemStyle,
  panelId,
  reduceMotion,
  ref,
  resolvedItemProps,
  setActiveItemId,
  slot,
  trailing,
  variantClassName,
}: {
  activeItemId: string | undefined;
  baseClassName: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  dataVariant?: string;
  highlighted: boolean;
  inset?: boolean;
  itemClassName?: string;
  itemId: string;
  itemRef?: React.Ref<HTMLButtonElement>;
  itemStyle?: React.CSSProperties;
  panelId: string;
  reduceMotion: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  resolvedItemProps: Omit<
    ButtonRenderProps,
    "children" | "className" | "ref" | "style"
  >;
  setActiveItemId: React.Dispatch<React.SetStateAction<string | undefined>>;
  slot: string;
  trailing?: React.ReactNode;
  variantClassName?: string;
}) {
  const showHighlight = !disabled && (highlighted || activeItemId === itemId);

  const activateItem = () => {
    if (!disabled) {
      setActiveItemId(itemId);
    }
  };

  return (
    <motion.button
      {...(resolvedItemProps as React.ComponentPropsWithoutRef<
        typeof motion.button
      >)}
      animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      aria-disabled={disabled}
      className={cn(
        baseClassName,
        variantClassName ?? contextMenuItemDefaultClassName,
        inset && "pl-7",
        itemClassName,
        className,
        disabled && contextMenuItemDisabledClassName
      )}
      data-disabled={disabled ? "" : undefined}
      data-inset={inset ? "" : undefined}
      data-slot={slot}
      data-variant={dataVariant}
      initial={reduceMotion ? false : { opacity: 0, x: -4 }}
      onFocus={composeEventHandlers(resolvedItemProps.onFocus, activateItem)}
      onMouseEnter={composeEventHandlers(
        resolvedItemProps.onMouseEnter,
        activateItem
      )}
      onPointerMove={composeEventHandlers(
        resolvedItemProps.onPointerMove,
        activateItem
      )}
      ref={composeRefs(itemRef, ref)}
      style={{
        ...itemStyle,
        minHeight: ITEM_HEIGHT,
      }}
      transition={getItemEntranceTransition(reduceMotion)}
      type="button"
    >
      {showHighlight ? (
        <motion.div
          className={contextMenuItemHighlightClassName}
          initial={false}
          layoutId={`${panelId}-context-menu-active`}
          transition={
            reduceMotion ? { duration: 0 } : activeHighlightTransition
          }
        />
      ) : null}
      <span className="relative z-10 flex flex-1 items-center gap-2.5">
        {children}
      </span>
      {trailing}
    </motion.button>
  );
}

function renderMotionPanel({
  actionsRef,
  children,
  className,
  popupClassName,
  popupRef,
  popupState,
  popupStyle,
  reduceMotion,
  resolvedPopupProps,
  unmountOnClose = true,
}: {
  actionsRef?: React.RefObject<ContextMenuPrimitive.Root.Actions | null>;
  children: React.ReactNode;
  className?: string;
  popupClassName?: string;
  popupRef?: React.Ref<HTMLDivElement>;
  popupState: { open: boolean; transitionStatus?: string };
  popupStyle?: React.CSSProperties;
  reduceMotion: boolean;
  resolvedPopupProps: Omit<
    DivRenderProps,
    "children" | "className" | "ref" | "style"
  >;
  unmountOnClose?: boolean;
}) {
  const panelVariants = reduceMotion
    ? reducedPanelMotionVariants
    : panelMotionVariants;

  return (
    <motion.div
      {...(resolvedPopupProps as React.ComponentPropsWithoutRef<
        typeof motion.div
      >)}
      animate={popupState.open ? "open" : "closed"}
      className={cn(
        contextMenuThemeClassName,
        contextMenuPanelChromeClassName,
        className,
        popupClassName
      )}
      initial={
        popupState.transitionStatus === "starting" && !reduceMotion
          ? "closed"
          : false
      }
      onAnimationComplete={() => {
        if (!popupState.open && unmountOnClose && actionsRef) {
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
      transition={getPanelMotionTransition(reduceMotion)}
      variants={panelVariants}
    >
      <ContextMenuPanelProvider>
        <ContextMenuPanelScroll>{children}</ContextMenuPanelScroll>
      </ContextMenuPanelProvider>
    </motion.div>
  );
}

type ContextMenuProps = Omit<
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>,
  "children" | "defaultOpen" | "onOpenChange" | "open"
> & {
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
  ...props
}: ContextMenuProps) {
  const actionsRef = React.useRef<ContextMenuPrimitive.Root.Actions | null>(
    null
  );
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <ContextMenuContext.Provider
      value={{
        actionsRef,
        open,
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    (onKeyDown as React.KeyboardEventHandler<HTMLDivElement> | undefined)?.(
      event
    );

    if (event.defaultPrevented || !isContextMenuKeyboardShortcut(event)) {
      return;
    }

    event.preventDefault();
    dispatchContextMenuFromKeyboard(event.currentTarget);
  };

  return (
    <ContextMenuPrimitive.Trigger
      {...props}
      className={className}
      data-slot="context-menu-trigger"
      render={(triggerProps) => {
        const { "aria-expanded": _ariaExpanded, ...resolvedTriggerProps } =
          triggerProps;

        const mergedClassName = cn(
          contextMenuThemeClassName,
          contextMenuTriggerClassName,
          className,
          resolvedTriggerProps.className
        );

        const mergedKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
          resolvedTriggerProps.onKeyDown?.(event);
          handleKeyDown(event);
        };

        if (asChild) {
          if (!React.isValidElement<TriggerElementProps>(children)) {
            throw new Error(
              "ContextMenuTrigger with asChild expects a single React element child."
            );
          }

          const child = React.Children.only(children) as TriggerChildElement;

          return React.cloneElement(child, {
            ...resolvedTriggerProps,
            "aria-haspopup": "menu",
            className: cn(mergedClassName, child.props.className),
            "data-state": open ? "open" : "closed",
            onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
              child.props.onKeyDown?.(event);
              mergedKeyDown(
                event as unknown as React.KeyboardEvent<HTMLDivElement>
              );
            },
            ref: composeRefs<HTMLElement>(
              getElementRef(child),
              resolvedTriggerProps.ref as React.Ref<HTMLElement>,
              ref as React.Ref<HTMLElement>
            ),
            tabIndex:
              child.props.tabIndex ?? resolvedTriggerProps.tabIndex ?? 0,
          } as TriggerElementProps & React.RefAttributes<HTMLElement>);
        }

        return (
          <div
            {...resolvedTriggerProps}
            aria-haspopup="menu"
            className={mergedClassName}
            data-state={open ? "open" : "closed"}
            onKeyDown={mergedKeyDown}
            ref={composeRefs(
              resolvedTriggerProps.ref as React.Ref<HTMLDivElement>,
              ref
            )}
            tabIndex={resolvedTriggerProps.tabIndex ?? 0}
          >
            {children}
          </div>
        );
      }}
    />
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
ContextMenuGroup.displayName = "ContextMenuGroup";

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}
ContextMenuPortal.displayName = "ContextMenuPortal";

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubmenuRoot>) {
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  );
}
ContextMenuSub.displayName = "ContextMenuSub";

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
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup";

type PositionerProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Positioner
>;

type ContextMenuContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Popup>,
  "children" | "className" | "render"
> & {
  align?: PositionerProps["align"];
  alignOffset?: PositionerProps["alignOffset"];
  children?: React.ReactNode;
  className?: string;
  collisionPadding?: PositionerProps["collisionPadding"];
  side?: PositionerProps["side"];
  sideOffset?: PositionerProps["sideOffset"];
};

const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(
  (
    {
      align,
      alignOffset,
      children,
      className,
      collisionPadding = 8,
      side,
      sideOffset,
      ...popupProps
    },
    ref
  ) => {
    const { actionsRef } = useContextMenu("ContextMenuContent");
    const reduceMotion = useReducedMotion() === true;

    return (
      <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
        <ContextMenuPrimitive.Portal>
          <ContextMenuPrimitive.Positioner
            align={align}
            alignOffset={alignOffset}
            className="z-50 outline-none"
            collisionPadding={collisionPadding}
            side={side}
            sideOffset={sideOffset}
          >
            <ContextMenuPrimitive.Popup
              {...popupProps}
              finalFocus
              render={(renderPopupProps, popupState) => {
                const {
                  popupClassName,
                  popupRef,
                  popupStyle,
                  resolvedPopupProps,
                } = resolvePopupProps(renderPopupProps);

                return renderMotionPanel({
                  actionsRef,
                  children,
                  className,
                  popupClassName,
                  popupRef: composeRefs(popupRef, ref),
                  popupState,
                  popupStyle,
                  reduceMotion,
                  resolvedPopupProps,
                  unmountOnClose: false,
                });
              }}
            />
          </ContextMenuPrimitive.Positioner>
        </ContextMenuPrimitive.Portal>
      </MotionConfig>
    );
  }
);
ContextMenuContent.displayName = "ContextMenuContent";

type ContextMenuItemProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Item
> & {
  closeOnClick?: boolean;
  inset?: boolean;
  variant?: "default" | "destructive";
};

const ContextMenuItem = React.forwardRef<
  HTMLButtonElement,
  ContextMenuItemProps
>(
  (
    {
      children,
      className,
      closeOnClick = true,
      disabled,
      inset,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const { activeItemId, panelId, setActiveItemId } =
      useContextMenuPanel("ContextMenuItem");
    const itemId = React.useId();
    const isDestructive = variant === "destructive";
    const reduceMotion = useReducedMotion() === true;

    return (
      <ContextMenuPrimitive.Item
        {...props}
        closeOnClick={closeOnClick}
        disabled={disabled}
        nativeButton
        render={(itemProps, itemState) => {
          const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
            resolveItemProps(itemProps as ButtonRenderProps);

          return renderContextMenuItemButton({
            activeItemId,
            baseClassName: contextMenuItemClassName,
            children,
            className: resolveStateClassName(className, itemState),
            disabled,
            dataVariant: variant,
            highlighted: itemState.highlighted,
            inset,
            itemClassName,
            itemId,
            itemRef,
            itemStyle,
            panelId,
            reduceMotion,
            ref,
            resolvedItemProps,
            setActiveItemId,
            slot: "context-menu-item",
            variantClassName: isDestructive
              ? contextMenuItemDestructiveClassName
              : undefined,
          });
        }}
      />
    );
  }
);
ContextMenuItem.displayName = "ContextMenuItem";

type ContextMenuSubTriggerProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubmenuTrigger
> & {
  inset?: boolean;
};

const ContextMenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  ContextMenuSubTriggerProps
>(
  (
    { children, className, closeDelay = 150, disabled, inset, ...props },
    ref
  ) => {
    const { activeItemId, panelId, setActiveItemId } = useContextMenuPanel(
      "ContextMenuSubTrigger"
    );
    const itemId = React.useId();
    const reduceMotion = useReducedMotion() === true;

    return (
      <ContextMenuPrimitive.SubmenuTrigger
        {...props}
        closeDelay={closeDelay}
        disabled={disabled}
        nativeButton
        render={(itemProps, itemState) => {
          const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
            resolveItemProps(itemProps as ButtonRenderProps);

          return renderContextMenuItemButton({
            activeItemId,
            baseClassName: cn(
              contextMenuSubTriggerClassName,
              contextMenuSubTriggerOpenClassName
            ),
            children,
            className: resolveStateClassName(className, itemState),
            disabled,
            highlighted: itemState.highlighted,
            inset,
            itemClassName,
            itemId,
            itemRef,
            itemStyle,
            panelId,
            reduceMotion,
            ref,
            resolvedItemProps,
            setActiveItemId,
            slot: "context-menu-sub-trigger",
            trailing: (
              <ChevronRight className="relative z-10 ml-auto size-4 opacity-70" />
            ),
          });
        }}
      />
    );
  }
);
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

type ContextMenuSubContentProps = {
  align?: PositionerProps["align"];
  alignOffset?: PositionerProps["alignOffset"];
  children?: React.ReactNode;
  className?: string;
  collisionPadding?: PositionerProps["collisionPadding"];
  side?: PositionerProps["side"];
  sideOffset?: PositionerProps["sideOffset"];
};

const ContextMenuSubContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuSubContentProps
>(
  (
    {
      align,
      alignOffset,
      children,
      className,
      collisionPadding = 8,
      side,
      sideOffset,
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion() === true;

    return (
      <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
        <ContextMenuPrimitive.Portal>
          <ContextMenuPrimitive.Positioner
            align={align}
            alignOffset={alignOffset}
            className="z-50 outline-none"
            collisionPadding={collisionPadding}
            side={side}
            sideOffset={sideOffset}
          >
            <ContextMenuPrimitive.Popup
              render={(renderPopupProps, popupState) => {
                const {
                  popupClassName,
                  popupRef,
                  popupStyle,
                  resolvedPopupProps,
                } = resolvePopupProps(renderPopupProps);

                return renderMotionPanel({
                  children,
                  className,
                  popupClassName,
                  popupRef: composeRefs(popupRef, ref),
                  popupState,
                  popupStyle,
                  reduceMotion,
                  resolvedPopupProps,
                  unmountOnClose: false,
                });
              }}
            />
          </ContextMenuPrimitive.Positioner>
        </ContextMenuPrimitive.Portal>
      </MotionConfig>
    );
  }
);
ContextMenuSubContent.displayName = "ContextMenuSubContent";

type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.CheckboxItem
> & {
  inset?: boolean;
};

const ContextMenuCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  ContextMenuCheckboxItemProps
>(({ checked, children, className, disabled, inset, ...props }, ref) => {
  const { activeItemId, panelId, setActiveItemId } = useContextMenuPanel(
    "ContextMenuCheckboxItem"
  );
  const itemId = React.useId();
  const reduceMotion = useReducedMotion() === true;

  return (
    <ContextMenuPrimitive.CheckboxItem
      {...props}
      checked={checked}
      disabled={disabled}
      nativeButton
      render={(itemProps, itemState) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as ButtonRenderProps);

        return renderContextMenuItemButton({
          activeItemId,
          baseClassName: contextMenuIndicatorItemClassName,
          children,
          className: resolveStateClassName(className, itemState),
          disabled,
          highlighted: itemState.highlighted,
          inset,
          itemClassName,
          itemId,
          itemRef,
          itemStyle,
          panelId,
          reduceMotion,
          ref,
          resolvedItemProps,
          setActiveItemId,
          slot: "context-menu-checkbox-item",
          trailing: (
            <span className="pointer-events-none absolute right-3 z-10">
              <ContextMenuPrimitive.CheckboxItemIndicator>
                <Check className="size-4" />
              </ContextMenuPrimitive.CheckboxItemIndicator>
            </span>
          ),
        });
      }}
    />
  );
});
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.RadioItem
> & {
  inset?: boolean;
};

const ContextMenuRadioItem = React.forwardRef<
  HTMLButtonElement,
  ContextMenuRadioItemProps
>(({ children, className, disabled, inset, ...props }, ref) => {
  const { activeItemId, panelId, setActiveItemId } = useContextMenuPanel(
    "ContextMenuRadioItem"
  );
  const itemId = React.useId();
  const reduceMotion = useReducedMotion() === true;

  return (
    <ContextMenuPrimitive.RadioItem
      {...props}
      disabled={disabled}
      nativeButton
      render={(itemProps, itemState) => {
        const { itemClassName, itemRef, itemStyle, resolvedItemProps } =
          resolveItemProps(itemProps as ButtonRenderProps);

        return renderContextMenuItemButton({
          activeItemId,
          baseClassName: contextMenuIndicatorItemClassName,
          children,
          className: resolveStateClassName(className, itemState),
          disabled,
          highlighted: itemState.highlighted,
          inset,
          itemClassName,
          itemId,
          itemRef,
          itemStyle,
          panelId,
          reduceMotion,
          ref,
          resolvedItemProps,
          setActiveItemId,
          slot: "context-menu-radio-item",
          trailing: (
            <span className="pointer-events-none absolute right-3 z-10">
              <ContextMenuPrimitive.RadioItemIndicator>
                <Check className="size-4" />
              </ContextMenuPrimitive.RadioItemIndicator>
            </span>
          ),
        });
      }}
    />
  );
});
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
      className={cn(contextMenuShortcutClassName, className)}
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
