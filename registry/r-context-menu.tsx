"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--background:#ffffff] [--foreground:#111111] [--primary:#111111] [--secondary:#646b75] [--surface-border:#e9edf2] [--border:#e3e7ec] [--card:#ffffff] [--card-foreground:#111111] [--muted:#f5f7fa] [--muted-foreground:#6d7480] [--accent:#f3f5f8] [--accent-foreground:#111111] [--input:#e3e7ec] [--ring:rgba(17,17,17,0.16)] [--destructive:#dc2626] [--paper:#fcfcfd] [--popover-foreground:#111111] [--brand:#0ea5e9] [--brand-soft:#bae6fd] [--shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--chart-1:oklch(0.52_0.19_254)] [--chart-2:oklch(0.74_0.11_232)] [--chart-3:oklch(0.42_0.16_262)] [--chart-4:oklch(0.84_0.07_228)] [--chart-5:oklch(0.62_0.14_240)] [--color-background:var(--background)] [--color-foreground:var(--foreground)] [--color-primary:var(--primary)] [--color-secondary:var(--secondary)] [--color-border:var(--border)] [--color-card:var(--card)] [--color-card-foreground:var(--card-foreground)] [--color-muted:var(--muted)] [--color-muted-foreground:var(--muted-foreground)] [--color-accent:var(--accent)] [--color-accent-foreground:var(--accent-foreground)] [--color-input:var(--input)] [--color-ring:var(--ring)] [--color-destructive:var(--destructive)] [--color-paper:var(--paper)] [--color-popover-foreground:var(--popover-foreground)] [--color-brand:var(--brand)] [--color-brand-soft:var(--brand-soft)] [--color-chart-1:var(--chart-1)] [--color-chart-2:var(--chart-2)] [--color-chart-3:var(--chart-3)] [--color-chart-4:var(--chart-4)] [--color-chart-5:var(--chart-5)] dark:[--background:#111111] dark:[--foreground:#f6f3ec] dark:[--primary:#f6f3ec] dark:[--secondary:#cbc6bb] dark:[--surface-border:#2a2a25] dark:[--border:#2b2a25] dark:[--card:#111111] dark:[--card-foreground:#f6f3ec] dark:[--muted:#171716] dark:[--muted-foreground:#9a958a] dark:[--accent:#1a1a18] dark:[--accent-foreground:#f6f3ec] dark:[--input:#2b2a25] dark:[--ring:rgba(246,243,236,0.18)] dark:[--destructive:#f87171] dark:[--paper:#171716] dark:[--popover-foreground:#f6f3ec] dark:[--brand:#38bdf8] dark:[--brand-soft:#0c4a6e] dark:[--shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--chart-1:oklch(0.68_0.17_250)] dark:[--chart-2:oklch(0.82_0.09_225)] dark:[--chart-3:oklch(0.58_0.15_260)] dark:[--chart-4:oklch(0.75_0.12_235)] dark:[--chart-5:oklch(0.88_0.06_220)]";

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
      <ContextMenuPrimitive.Root onOpenChange={setOpen}>
        <ContextMenuPrimitive.Trigger asChild>
          <div
            className={cn(
              componentThemeClassName,
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
          >
            {children}
          </div>
        </ContextMenuPrimitive.Trigger>

        <AnimatePresence>
          {open ? (
            <ContextMenuPrimitive.Portal forceMount>
              <ContextMenuPrimitive.Content
                asChild
                collisionPadding={8}
                forceMount
              >
                <motion.div
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={cn(
                    componentThemeClassName,
                    "z-50 rounded-lg border border-border/60 bg-white p-1.5 text-popover-foreground shadow-2xl dark:border-neutral-800 dark:bg-black",
                    menuClassName
                  )}
                  exit={{ opacity: 0, scale: 0.96, y: -2 }}
                  initial={{ opacity: 0, scale: 0.94, y: -4 }}
                  style={{
                    width: MENU_WIDTH,
                    maxHeight: "calc(100vh - 16px)",
                    overflowY: "auto",
                    overscrollBehavior: "contain",
                    transformOrigin:
                      "var(--radix-context-menu-content-transform-origin)",
                  }}
                  transition={{
                    duration: 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {items.map((item, index) => (
                    <React.Fragment key={`${item.label}-${index}`}>
                      <ContextMenuPrimitive.Item
                        asChild
                        disabled={item.disabled}
                        onSelect={() => {
                          item.onSelect?.();
                        }}
                      >
                        <motion.button
                          animate={{ opacity: 1, x: 0 }}
                          aria-disabled={item.disabled}
                          className={cn(
                            "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-medium text-sm outline-none transition-colors",
                            "disabled:cursor-not-allowed disabled:opacity-40",
                            item.destructive
                              ? "text-destructive hover:bg-accent/70"
                              : "text-foreground/85 hover:bg-accent/70"
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
                          style={{ minHeight: ITEM_HEIGHT }}
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
                      </ContextMenuPrimitive.Item>

                      {item.separatorAfter && index < items.length - 1 ? (
                        <ContextMenuPrimitive.Separator className="my-1 h-px bg-border/60" />
                      ) : null}
                    </React.Fragment>
                  ))}
                </motion.div>
              </ContextMenuPrimitive.Content>
            </ContextMenuPrimitive.Portal>
          ) : null}
        </AnimatePresence>
      </ContextMenuPrimitive.Root>
    </ReducedMotionConfig>
  );
}

export { ContextMenu as contextMenu };
