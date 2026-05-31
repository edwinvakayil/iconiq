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

const contextMenuThemeClassName =
  "[--cm-surface:#ffffff] [--cm-foreground:#111111] [--cm-border:#e3e7ec] [--cm-muted-foreground:#6d7480] [--cm-accent:#f3f5f8] [--cm-accent-foreground:#111111] [--cm-destructive:#dc2626] [--cm-ring:rgba(17,17,17,0.16)] dark:[--cm-surface:#111111] dark:[--cm-foreground:#f6f3ec] dark:[--cm-border:#2b2a25] dark:[--cm-muted-foreground:#9a958a] dark:[--cm-accent:#1a1a18] dark:[--cm-accent-foreground:#f6f3ec] dark:[--cm-destructive:#f87171] dark:[--cm-ring:rgba(246,243,236,0.18)]";

const ITEM_HEIGHT = 44;

const contextMenuPanelShellClassName =
  "z-50 min-w-[232px] overflow-y-auto overflow-x-hidden rounded-lg border border-[color:color-mix(in_oklch,var(--cm-border),transparent_40%)] bg-[color:var(--cm-surface)] p-1.5 text-[color:var(--cm-foreground)] shadow-2xl";

const contextMenuTriggerClassName =
  "select-none outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--cm-ring),transparent_50%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cm-surface)]";

const contextMenuItemHighlightClassName =
  "absolute inset-0 rounded-lg bg-[color:var(--cm-accent)]";

const contextMenuItemDefaultClassName =
  "text-[color:color-mix(in_oklch,var(--cm-foreground),transparent_15%)] hover:bg-[color:color-mix(in_oklch,var(--cm-accent),transparent_30%)]";

const contextMenuItemDestructiveClassName =
  "text-[color:var(--cm-destructive)] hover:bg-[color:color-mix(in_oklch,var(--cm-accent),transparent_30%)]";

const contextMenuSubTriggerOpenClassName =
  "data-[state=open]:bg-[color:var(--cm-accent)] data-[state=open]:text-[color:var(--cm-accent-foreground)]";

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
        contextMenuThemeClassName,
        contextMenuTriggerClassName,
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
        animate={{ scale: 1, y: 0 }}
        className={cn(
          contextMenuThemeClassName,
          contextMenuPanelShellClassName,
          className
        )}
        exit={{ scale: 0.96, y: -2 }}
        initial={{ scale: 0.94, y: -4 }}
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
              ? contextMenuItemDestructiveClassName
              : contextMenuItemDefaultClassName,
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
              className={contextMenuItemHighlightClassName}
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
          contextMenuItemDefaultClassName,
          contextMenuSubTriggerOpenClassName,
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
        contextMenuThemeClassName,
        contextMenuPanelShellClassName,
        "overflow-hidden",
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
          contextMenuItemDefaultClassName,
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
            className={contextMenuItemHighlightClassName}
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
          contextMenuItemDefaultClassName,
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
            className={contextMenuItemHighlightClassName}
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
