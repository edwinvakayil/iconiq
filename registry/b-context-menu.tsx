"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

export type ContextMenuItem = {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  separatorAfter?: boolean;
};

export interface ContextMenuProps extends ReducedMotionProp {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
  menuClassName?: string;
}

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

const MENU_WIDTH = 232;
const ITEM_HEIGHT = 44;

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

function getFirstEnabledIndex(items: ContextMenuItem[]) {
  return items.findIndex((item) => !item.disabled);
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

function MenuItemRow({
  active,
  item,
}: {
  active: boolean;
  item: ContextMenuItem;
}) {
  return (
    <>
      {active && !item.disabled ? (
        <motion.div
          className="absolute inset-0 rounded-lg bg-accent"
          layoutId="context-menu-active"
          transition={{ type: "spring", stiffness: 600, damping: 38 }}
        />
      ) : null}
      <span className="relative z-10 flex flex-1 items-center gap-2.5">
        {item.icon ? (
          <span className="flex h-4 w-4 items-center justify-center opacity-70">
            {item.icon}
          </span>
        ) : null}
        <span className="truncate">{item.label}</span>
      </span>
      {item.shortcut ? (
        <span className="relative z-10 text-muted-foreground/70 text-xs tracking-widest">
          {item.shortcut}
        </span>
      ) : null}
    </>
  );
}

export function ContextMenu({
  items,
  children,
  className,
  menuClassName,
  reducedMotion,
}: ContextMenuProps) {
  const actionsRef = React.useRef<ContextMenuPrimitive.Root.Actions | null>(
    null
  );
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (open) {
      const firstEnabledIndex = getFirstEnabledIndex(items);
      setActiveIndex(firstEnabledIndex >= 0 ? firstEnabledIndex : null);
      return;
    }

    setActiveIndex(null);
  }, [items, open]);

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <ContextMenuPrimitive.Root
        actionsRef={actionsRef}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
        }}
        open={open}
      >
        <ContextMenuPrimitive.Trigger
          aria-expanded={open}
          aria-haspopup="menu"
          className={cn(
            registryTheme,
            "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className
          )}
          onKeyDown={(event) => {
            if (!isContextMenuKeyboardShortcut(event)) {
              return;
            }

            event.preventDefault();
            dispatchContextMenuFromKeyboard(event.currentTarget);
          }}
          tabIndex={0}
        >
          {children}
        </ContextMenuPrimitive.Trigger>

        <ContextMenuPrimitive.Portal keepMounted>
          <ContextMenuPrimitive.Positioner className="z-50 outline-none">
            <ContextMenuPrimitive.Popup
              finalFocus
              render={(popupProps, popupState) => {
                const {
                  popupClassName,
                  popupRef,
                  popupStyle,
                  resolvedPopupProps,
                } = resolvePopupProps(popupProps);

                return (
                  <motion.div
                    {...resolvedPopupProps}
                    animate={
                      popupState.open
                        ? { opacity: 1, scale: 1, y: 0 }
                        : { opacity: 0, scale: 0.96, y: -2 }
                    }
                    className={cn(
                      registryTheme,
                      "rounded-lg border border-border/60 bg-white p-1.5 text-popover-foreground shadow-2xl dark:border-neutral-800 dark:bg-black",
                      menuClassName,
                      popupClassName
                    )}
                    initial={
                      popupState.transitionStatus === "starting"
                        ? { opacity: 0, scale: 0.94, y: -4 }
                        : false
                    }
                    onAnimationComplete={() => {
                      if (!popupState.open) {
                        actionsRef.current?.unmount();
                      }
                    }}
                    ref={(node) => {
                      setRef(popupRef, node);
                    }}
                    style={{
                      ...popupStyle,
                      width: MENU_WIDTH,
                      maxHeight: "calc(100vh - 16px)",
                      overflowY: "auto",
                      overscrollBehavior: "contain",
                    }}
                    transition={{
                      duration: 0.14,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {items.map((item, index) => (
                      <React.Fragment key={`${item.label}-${index}`}>
                        <ContextMenuPrimitive.Item
                          closeOnClick
                          disabled={item.disabled}
                          onClick={() => {
                            item.onSelect?.();
                          }}
                          render={(itemProps) => {
                            const {
                              itemClassName,
                              itemRef,
                              itemStyle,
                              resolvedItemProps,
                            } = resolveItemProps(itemProps);

                            return (
                              <motion.button
                                {...resolvedItemProps}
                                animate={{ opacity: 1, x: 0 }}
                                aria-disabled={item.disabled}
                                className={cn(
                                  "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-medium text-sm outline-none transition-colors",
                                  "disabled:cursor-not-allowed disabled:opacity-40",
                                  item.destructive
                                    ? "text-destructive hover:bg-accent/70"
                                    : "text-foreground/85 hover:bg-accent/70",
                                  itemClassName
                                )}
                                initial={{ opacity: 0, x: -4 }}
                                onFocus={() => {
                                  if (!item.disabled) {
                                    setActiveIndex(index);
                                  }
                                }}
                                onMouseEnter={() => {
                                  if (!item.disabled) {
                                    setActiveIndex(index);
                                  }
                                }}
                                onPointerMove={() => {
                                  if (!item.disabled) {
                                    setActiveIndex(index);
                                  }
                                }}
                                ref={(node) => {
                                  setRef(itemRef, node);
                                }}
                                style={{
                                  ...itemStyle,
                                  minHeight: ITEM_HEIGHT,
                                }}
                                tabIndex={item.disabled ? -1 : undefined}
                                transition={{
                                  duration: 0.12,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                type="button"
                              >
                                <MenuItemRow
                                  active={activeIndex === index}
                                  item={item}
                                />
                              </motion.button>
                            );
                          }}
                        />

                        {item.separatorAfter && index < items.length - 1 ? (
                          <ContextMenuPrimitive.Separator className="my-1 h-px bg-border/60" />
                        ) : null}
                      </React.Fragment>
                    ))}
                  </motion.div>
                );
              }}
            />
          </ContextMenuPrimitive.Positioner>
        </ContextMenuPrimitive.Portal>
      </ContextMenuPrimitive.Root>
    </ReducedMotionConfig>
  );
}

export { ContextMenu as contextMenu };
