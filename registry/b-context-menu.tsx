"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { Check, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

const ITEM_HEIGHT = 44;

const contextMenuPanelShellClassName =
  "z-50 min-w-[232px] overflow-y-auto overflow-x-hidden rounded-lg border border-border/60 p-1.5 text-popover-foreground shadow-2xl dark:border-neutral-800";

const contextMenuPanelSurfaceClassName = "bg-white dark:bg-[#111111]";

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
        componentThemeClassName,
        contextMenuPanelShellClassName,
        className,
        popupClassName,
        contextMenuPanelSurfaceClassName
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
      onPointerLeave={onPointerLeave}
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
      {children}
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
            componentThemeClassName,
            "select-none outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
        componentThemeClassName,
        "select-none outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
    <ContextMenuPrimitive.Portal keepMounted>
      <ContextMenuPrimitive.Positioner className="z-50 outline-none">
        <ContextMenuPrimitive.Popup
          finalFocus
          render={(popupProps, popupState) => {
            const { popupClassName, popupRef, popupStyle, resolvedPopupProps } =
              resolvePopupProps(popupProps);

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
                ? "text-destructive hover:bg-accent/70"
                : "text-foreground/85 hover:bg-accent/70",
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
                className="absolute inset-0 rounded-lg bg-accent"
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
              "text-foreground/85 hover:bg-accent/70 data-popup-open:bg-accent data-popup-open:text-accent-foreground",
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
                className="absolute inset-0 rounded-lg bg-accent"
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
              "text-foreground/85 hover:bg-accent/70",
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
                className="absolute inset-0 rounded-lg bg-accent"
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
              "text-foreground/85 hover:bg-accent/70",
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
                className="absolute inset-0 rounded-lg bg-accent"
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
        "px-3 py-1 font-medium text-muted-foreground text-xs",
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
      className={cn("my-1 h-px bg-border/60", className)}
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
        "relative z-10 ml-auto text-muted-foreground/70 text-xs tracking-widest",
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
