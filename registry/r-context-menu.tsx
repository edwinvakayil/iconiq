"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
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

type ContextMenuContextValue = {
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

type ContextMenuRootProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Root
> &
  ReducedMotionProp;

function ContextMenu({
  children,
  onOpenChange,
  reducedMotion,
  ...props
}: ContextMenuRootProps) {
  const contentId = React.useId();
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const [open, setOpen] = React.useState(false);
  const [hoveredItemId, setHoveredItemId] = React.useState<
    string | undefined
  >();

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange]
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
          contentId,
          hoveredItemId,
          open,
          reduceMotion,
          setHoveredItemId,
        }}
      >
        <ContextMenuPrimitive.Root {...props} onOpenChange={handleOpenChange}>
          {children}
        </ContextMenuPrimitive.Root>
      </ContextMenuContext.Provider>
    </ReducedMotionConfig>
  );
}
ContextMenu.displayName = "ContextMenu";

type ContextMenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Trigger
>;

const ContextMenuTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Trigger>,
  ContextMenuTriggerProps
>(({ asChild, className, onKeyDown, ...props }, ref) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || !isContextMenuKeyboardShortcut(event)) {
      return;
    }

    event.preventDefault();
    dispatchContextMenuFromKeyboard(event.currentTarget);
  };

  return (
    <ContextMenuPrimitive.Trigger
      asChild={asChild}
      className={cn(
        componentThemeClassName,
        "select-none outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      data-slot="context-menu-trigger"
      onKeyDown={handleKeyDown}
      ref={ref}
      {...props}
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
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
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

type ContextMenuContentProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Content
>;

const ContextMenuContentBody = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ children, className, collisionPadding = 8, ...props }, ref) => {
  const { setHoveredItemId } = useContextMenu("ContextMenuContent");

  return (
    <ContextMenuPrimitive.Content
      asChild
      collisionPadding={collisionPadding}
      ref={ref}
      {...props}
    >
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn(
          componentThemeClassName,
          "z-50 min-w-[232px] overflow-y-auto overflow-x-hidden rounded-lg border border-border/60 bg-white p-1.5 text-popover-foreground shadow-2xl dark:border-neutral-800 dark:bg-black",
          className
        )}
        exit={{ opacity: 0, scale: 0.96, y: -2 }}
        initial={{ opacity: 0, scale: 0.94, y: -4 }}
        onPointerLeave={() => {
          setHoveredItemId(undefined);
        }}
        style={{
          maxHeight: "calc(100vh - 16px)",
          overscrollBehavior: "contain",
          transformOrigin: "var(--radix-context-menu-content-transform-origin)",
        }}
        transition={getContentMotionTransition()}
      >
        {children}
      </motion.div>
    </ContextMenuPrimitive.Content>
  );
});
ContextMenuContentBody.displayName = "ContextMenuContentBody";

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ ...props }, ref) => {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuContentBody ref={ref} {...props} />
    </ContextMenuPrimitive.Portal>
  );
});
ContextMenuContent.displayName = "ContextMenuContent";

type ContextMenuItemProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Item
> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(
  (
    { children, className, disabled, inset, variant = "default", ...props },
    ref
  ) => {
    const { contentId, hoveredItemId, reduceMotion, setHoveredItemId } =
      useContextMenu("ContextMenuItem");
    const itemId = React.useId();
    const isHovered = hoveredItemId === itemId;
    const isDestructive = variant === "destructive";

    return (
      <ContextMenuPrimitive.Item
        asChild
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <motion.button
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "group/context-menu-item relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-medium text-sm outline-none transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-40",
            isDestructive
              ? "text-destructive hover:bg-accent/70"
              : "text-foreground/85 hover:bg-accent/70",
            inset && "pl-7",
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
          style={{ minHeight: ITEM_HEIGHT }}
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
      </ContextMenuPrimitive.Item>
    );
  }
);
ContextMenuItem.displayName = "ContextMenuItem";

type ContextMenuSubTriggerProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubTrigger
> & {
  inset?: boolean;
};

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(({ children, className, inset, ...props }, ref) => {
  const { contentId, hoveredItemId, reduceMotion, setHoveredItemId } =
    useContextMenu("ContextMenuSubTrigger");
  const itemId = React.useId();
  const isHovered = hoveredItemId === itemId;

  return (
    <ContextMenuPrimitive.SubTrigger asChild ref={ref} {...props}>
      <motion.button
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left font-medium text-sm outline-none transition-colors",
          "text-foreground/85 hover:bg-accent/70 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          inset && "pl-7",
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
        style={{ minHeight: ITEM_HEIGHT }}
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
    </ContextMenuPrimitive.SubTrigger>
  );
});
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ children, className, ...props }, ref) => {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(
        componentThemeClassName,
        "z-50 min-w-[232px] overflow-hidden rounded-lg border border-border/60 bg-white p-1.5 text-popover-foreground shadow-2xl dark:border-neutral-800 dark:bg-black",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.SubContent>
  );
});
ContextMenuSubContent.displayName = "ContextMenuSubContent";

type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.CheckboxItem
> & {
  inset?: boolean;
};

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ checked, children, className, disabled, inset, ...props }, ref) => {
  const { contentId, hoveredItemId, reduceMotion, setHoveredItemId } =
    useContextMenu("ContextMenuCheckboxItem");
  const itemId = React.useId();
  const isHovered = hoveredItemId === itemId;

  return (
    <ContextMenuPrimitive.CheckboxItem
      asChild
      checked={checked}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      <motion.button
        animate={{ opacity: disabled ? 0.5 : 1, x: 0 }}
        className={cn(
          "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 pr-8 pl-3 text-left font-medium text-sm outline-none transition-colors",
          "text-foreground/85 hover:bg-accent/70",
          "disabled:cursor-not-allowed data-[disabled]:pointer-events-none",
          inset && "pl-7",
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
        style={{ minHeight: ITEM_HEIGHT }}
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
          <ContextMenuPrimitive.ItemIndicator>
            <Check className="size-4" />
          </ContextMenuPrimitive.ItemIndicator>
        </span>
      </motion.button>
    </ContextMenuPrimitive.CheckboxItem>
  );
});
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.RadioItem
> & {
  inset?: boolean;
};

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ContextMenuRadioItemProps
>(({ children, className, disabled, inset, ...props }, ref) => {
  const { contentId, hoveredItemId, reduceMotion, setHoveredItemId } =
    useContextMenu("ContextMenuRadioItem");
  const itemId = React.useId();
  const isHovered = hoveredItemId === itemId;

  return (
    <ContextMenuPrimitive.RadioItem
      asChild
      disabled={disabled}
      ref={ref}
      {...props}
    >
      <motion.button
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 pr-8 pl-3 text-left font-medium text-sm outline-none transition-colors",
          "text-foreground/85 hover:bg-accent/70",
          "disabled:cursor-not-allowed disabled:opacity-40",
          inset && "pl-7",
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
        style={{ minHeight: ITEM_HEIGHT }}
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
          <ContextMenuPrimitive.ItemIndicator>
            <Check className="size-4" />
          </ContextMenuPrimitive.ItemIndicator>
        </span>
      </motion.button>
    </ContextMenuPrimitive.RadioItem>
  );
});
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

type ContextMenuLabelProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Label
> & {
  inset?: boolean;
};

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.Label
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
