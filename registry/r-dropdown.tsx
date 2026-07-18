"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { Check, ChevronDown, ChevronRight, Circle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const corner =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const theme =
  "[--dd-surface:#ffffff] [--dd-foreground:#111111] [--dd-border:#e3e7ec] [--dd-ring:rgba(17,17,17,0.16)] [--dd-muted-foreground:#6d7480] [--dd-accent:#f3f5f8] [--color-accent:var(--dd-accent)] [--color-accent-foreground:var(--dd-foreground)] dark:[--dd-surface:#111111] dark:[--dd-foreground:#f6f3ec] dark:[--dd-border:#2b2a25] dark:[--dd-ring:rgba(246,243,236,0.18)] dark:[--dd-muted-foreground:#9a958a] dark:[--dd-accent:#1a1a18]";

const triggerClass =
  "flex min-h-11 w-full touch-manipulation items-center justify-between gap-2 border border-[color:var(--dd-border)] bg-[color:var(--dd-surface)] px-4 py-3 text-left font-medium text-[color:var(--dd-foreground)] text-sm transition-colors hover:bg-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dd-ring),transparent_50%)] disabled:cursor-not-allowed disabled:opacity-60";

const panelClass = cn(
  corner,
  "z-[300] min-w-[12rem] max-w-[calc(100vw-1.5rem)] overflow-hidden border border-[color:color-mix(in_oklch,var(--dd-border),transparent_40%)] bg-[color:var(--dd-surface)] shadow-[0_14px_34px_-22px_color-mix(in_oklch,var(--dd-foreground),transparent_72%)] outline-none"
);

const itemClass = cn(
  corner,
  "relative flex min-h-11 w-full cursor-default select-none scroll-m-1 items-center justify-between gap-3 px-3 py-2.5 text-left text-[color:var(--dd-foreground)] text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

const highlightClass = cn(
  "rounded-[inherit] supports-[corner-shape:squircle]:[corner-shape:inherit]",
  "absolute inset-0 bg-[color:var(--dd-accent)]"
);

const scrollbarClass =
  "z-10 flex w-2 shrink-0 touch-none select-none bg-transparent p-px opacity-0 transition-opacity duration-150 data-[state=visible]:pointer-events-auto data-[state=visible]:opacity-100";

const thumbClass =
  "relative rounded-full bg-[color:color-mix(in_oklch,var(--dd-muted-foreground),transparent_35%)]";

const LABEL_ITEMS = new Set(["DropdownItem", "DropdownRadioItem"]);
const MAX_HEIGHT = 384;
const VIEWPORT_PADDING = 12;
const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_EASE = [0.4, 0, 0.6, 1] as const;
const SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.95,
};

const HIGHLIGHT_SPRING = {
  type: "spring" as const,
  stiffness: 600,
  damping: 38,
};

const CHECK_SPRING = {
  type: "spring" as const,
  stiffness: 460,
  damping: 24,
  mass: 0.5,
};

export type DropdownVariant = "select" | "action";
export type DropdownAlign = "center" | "end" | "start";
export type DropdownSide = "bottom" | "left" | "right" | "top";

type FocusTarget = "first" | "last" | "selected";

type DropdownContextValue = {
  activeItemId: string | undefined;
  contentId: string;
  disabled: boolean;
  focusTargetRef: React.MutableRefObject<FocusTarget>;
  labels: Record<string, string>;
  open: boolean;
  setActiveItemId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOpen: (open: boolean) => void;
  setValue: (value: string | undefined) => void;
  skipCloseAnimationRef: React.MutableRefObject<boolean>;
  value: string | undefined;
  variant: DropdownVariant;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdown(name: string) {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error(`${name} must be used within Dropdown.`);
  }
  return context;
}

function mergeRefs<T>(ref: React.ForwardedRef<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (ref) {
    ref.current = value;
  }
}

function getText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getText).join("");
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getText(node.props.children);
  }
  return "";
}

function collectLabels(node: React.ReactNode): Record<string, string> {
  const labels: Record<string, string> = {};

  const visit = (child: React.ReactNode) => {
    if (!React.isValidElement(child)) {
      if (Array.isArray(child)) {
        child.forEach(visit);
      }
      return;
    }

    const element = child as React.ReactElement<{
      children?: React.ReactNode;
      textValue?: string;
      value?: string;
    }>;
    const name =
      typeof element.type === "string"
        ? element.type
        : (element.type as { displayName?: string }).displayName;

    if (name && LABEL_ITEMS.has(name) && element.props.value) {
      labels[element.props.value] = (
        element.props.textValue ?? getText(element.props.children)
      ).trim();
    }

    React.Children.forEach(element.props.children, visit);
  };

  React.Children.forEach(node, visit);
  return labels;
}

function useControllable<T>({
  defaultValue,
  onChange,
  value: valueProp,
}: {
  defaultValue: T;
  onChange?: (value: T) => void;
  value?: T;
}) {
  const [internal, setInternal] = React.useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : internal;

  const setValue = React.useCallback(
    (next: T) => {
      if (!controlled) {
        setInternal(next);
      }
      onChange?.(next);
    },
    [controlled, onChange]
  );

  return [value, setValue] as const;
}

function sideOffset(side: DropdownSide) {
  switch (side) {
    case "top":
      return { x: 0, y: 5 };
    case "left":
      return { x: 5, y: 0 };
    case "right":
      return { x: -5, y: 0 };
    default:
      return { x: 0, y: -5 };
  }
}

function panelOrigin(side: DropdownSide, align: DropdownAlign) {
  if (side === "top") {
    return align === "end"
      ? "bottom right"
      : align === "center"
        ? "bottom center"
        : "bottom left";
  }
  if (side === "bottom") {
    return align === "end"
      ? "top right"
      : align === "center"
        ? "top center"
        : "top left";
  }
  return side === "left" ? "center right" : "center left";
}

function panelMotion(side: DropdownSide) {
  const offset = sideOffset(side);
  return {
    animate: { opacity: 1, scale: 1, x: 0, y: 0 },
    closed: { opacity: 0, scale: 0.985, ...offset },
    open: {
      opacity: { duration: 0.34, ease: FLUID_EASE },
      scale: SPRING,
      x: SPRING,
      y: SPRING,
    },
    close: {
      opacity: { duration: 0.22, ease: EXIT_EASE },
      scale: { duration: 0.22, ease: EXIT_EASE },
      x: { duration: 0.22, ease: EXIT_EASE },
      y: { duration: 0.22, ease: EXIT_EASE },
    },
  };
}

function focusMenuItem(
  root: HTMLElement | null,
  target: FocusTarget,
  value?: string
) {
  const items = root
    ? Array.from(
        root.querySelectorAll<HTMLElement>(
          "[data-dropdown-item]:not([data-disabled])"
        )
      )
    : [];

  if (!items.length) {
    return;
  }

  let index = 0;
  if (target === "last") {
    index = items.length - 1;
  } else if (target === "selected" && value) {
    const selected = items.findIndex((item) => item.dataset.value === value);
    index = selected >= 0 ? selected : 0;
  }

  items[index]?.focus();
}

function hasClassToken(className: string | undefined, token: string) {
  return new RegExp(`(?:^|\\s)${token}(?:\\s|$)`).test(className ?? "");
}

function ItemHighlight({
  active,
  layoutId,
}: {
  active: boolean;
  layoutId: string;
}) {
  if (!active) {
    return null;
  }

  return (
    <motion.span
      className={highlightClass}
      layoutId={layoutId}
      transition={HIGHLIGHT_SPRING}
    />
  );
}

function useRowHighlight(disabled?: boolean) {
  const { activeItemId, contentId, setActiveItemId } =
    useDropdown("DropdownRow");
  const itemId = React.useId();
  const layoutId = `${contentId}-dropdown-active-item`;

  const activate = React.useCallback(() => {
    if (!disabled) {
      setActiveItemId(itemId);
    }
  }, [disabled, itemId, setActiveItemId]);

  return {
    highlight: (
      <ItemHighlight active={activeItemId === itemId} layoutId={layoutId} />
    ),
    rowHandlers: {
      onFocus: activate,
      onMouseEnter: activate,
      onPointerMove: activate,
    },
  };
}

export interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  modal?: boolean;
  name?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | undefined) => void;
  open?: boolean;
  required?: boolean;
  value?: string;
  variant?: DropdownVariant;
}

export function Dropdown({
  children,
  className,
  defaultOpen = false,
  defaultValue,
  disabled = false,
  modal = false,
  name,
  onOpenChange,
  onValueChange,
  open: openProp,
  required = false,
  value: valueProp,
  variant = "select",
}: DropdownProps) {
  const contentId = React.useId();
  const focusTargetRef = React.useRef<FocusTarget>("selected");
  const skipCloseAnimationRef = React.useRef(false);
  const [open, setOpen] = useControllable({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: openProp,
  });
  const [value, setValue] = useControllable<string | undefined>({
    defaultValue,
    onChange: onValueChange,
    value: valueProp,
  });
  const [activeItemId, setActiveItemId] = React.useState<string | undefined>();
  const labels = React.useMemo(() => collectLabels(children), [children]);

  const context = React.useMemo(
    () => ({
      activeItemId,
      contentId,
      disabled,
      focusTargetRef,
      labels,
      open,
      setActiveItemId,
      setOpen,
      setValue,
      skipCloseAnimationRef,
      value,
      variant,
    }),
    [
      activeItemId,
      contentId,
      disabled,
      labels,
      open,
      setOpen,
      setValue,
      value,
      variant,
    ]
  );

  return (
    <DropdownContext.Provider value={context}>
      <DropdownMenuPrimitive.Root
        modal={modal}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            skipCloseAnimationRef.current = false;
          } else {
            setActiveItemId(undefined);
          }
          setOpen(nextOpen);
        }}
        open={open}
      >
        <div className={cn(theme, "relative inline-block", className)}>
          {variant === "select" && name ? (
            <input
              aria-hidden
              name={name}
              required={required}
              tabIndex={-1}
              type="hidden"
              value={value ?? ""}
            />
          ) : null}
          {children}
        </div>
      </DropdownMenuPrimitive.Root>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.button>,
    "children"
  > {
  children?: React.ReactNode;
  showChevron?: boolean;
  triggerShape?: "default" | "avatar";
}

export const DropdownTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(
  (
    {
      children,
      className,
      disabled: disabledProp,
      onKeyDown,
      onPointerDown,
      showChevron = true,
      triggerShape = "default",
      ...props
    },
    ref
  ) => {
    const {
      contentId,
      disabled: rootDisabled,
      focusTargetRef,
      open,
      setOpen,
      variant,
    } = useDropdown("DropdownTrigger");
    const disabled = disabledProp ?? rootDisabled;

    return (
      <DropdownMenuPrimitive.Trigger asChild disabled={disabled}>
        <motion.button
          aria-controls={contentId}
          aria-expanded={open}
          aria-haspopup={variant === "action" ? "menu" : "listbox"}
          className={cn(
            triggerClass,
            triggerShape !== "avatar" && corner,
            className
          )}
          data-state={open ? "open" : "closed"}
          disabled={disabled}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented || disabled) {
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              focusTargetRef.current = "first";
              setOpen(true);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              focusTargetRef.current = "last";
              setOpen(true);
            }
            if (event.key === "Enter" || event.key === " ") {
              focusTargetRef.current = "selected";
            }
          }}
          onPointerDown={(event) => {
            onPointerDown?.(event);
            if (!(event.defaultPrevented || disabled)) {
              focusTargetRef.current = "selected";
            }
          }}
          ref={(node) => mergeRefs(ref, node)}
          type="button"
          whileTap={disabled ? undefined : { scale: 0.96 }}
          {...props}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {children}
          </span>
          {showChevron ? (
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              className="text-[color:var(--dd-muted-foreground)]"
              transition={SPRING}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          ) : null}
        </motion.button>
      </DropdownMenuPrimitive.Trigger>
    );
  }
);
DropdownTrigger.displayName = "DropdownTrigger";

export interface DropdownValueProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const DropdownValue = React.forwardRef<
  HTMLSpanElement,
  DropdownValueProps
>(({ className, placeholder = "Select an option", ...props }, ref) => {
  const { labels, value } = useDropdown("DropdownValue");
  const label = value ? (labels[value] ?? value) : undefined;

  return (
    <span
      className={cn(
        "truncate",
        !label && "text-[color:var(--dd-muted-foreground)]",
        className
      )}
      ref={ref}
      {...props}
    >
      {label ?? placeholder}
    </span>
  );
});
DropdownValue.displayName = "DropdownValue";

export interface DropdownContentProps {
  align?: DropdownAlign;
  avoidCollisions?: boolean;
  children?: React.ReactNode;
  className?: string;
  side?: DropdownSide;
  sideOffset?: number;
  style?: React.CSSProperties;
}

export const DropdownContent = React.forwardRef<
  HTMLDivElement,
  DropdownContentProps
>(
  (
    {
      align = "start",
      avoidCollisions = true,
      children,
      className,
      side = "bottom",
      sideOffset = 8,
      style,
    },
    ref
  ) => {
    const dropdown = useDropdown("DropdownContent");
    const {
      contentId,
      focusTargetRef,
      open,
      setActiveItemId,
      skipCloseAnimationRef,
      value,
      variant,
    } = dropdown;
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const motionConfig = React.useMemo(() => panelMotion(side), [side]);
    const matchTriggerWidth = hasClassToken(className, "w-full");
    const panelVariants = {
      closed: {
        ...motionConfig.closed,
        transition: motionConfig.close,
      },
      closedInstant: {
        ...motionConfig.closed,
        transition: { duration: 0 },
      },
      open: {
        ...motionConfig.animate,
        transition: motionConfig.open,
      },
    };

    React.useEffect(() => {
      if (!open) {
        return;
      }
      const frame = requestAnimationFrame(() => {
        focusMenuItem(listRef.current, focusTargetRef.current, value);
      });
      return () => cancelAnimationFrame(frame);
    }, [focusTargetRef, open, value]);

    return (
      <AnimatePresence
        custom={skipCloseAnimationRef}
        onExitComplete={() => {
          skipCloseAnimationRef.current = false;
        }}
      >
        {open ? (
          <DropdownMenuPrimitive.Portal forceMount>
            <DropdownMenuPrimitive.Content
              align={align}
              avoidCollisions={avoidCollisions}
              className="z-[300] max-h-none overflow-visible border-0 bg-transparent p-0 shadow-none outline-none"
              collisionPadding={VIEWPORT_PADDING}
              forceMount
              loop
              onCloseAutoFocus={() => {
                focusTargetRef.current = "selected";
              }}
              ref={(node) => mergeRefs(ref, node)}
              side={side}
              sideOffset={sideOffset}
              style={{
                ...style,
                width: matchTriggerWidth
                  ? "var(--radix-dropdown-menu-trigger-width)"
                  : style?.width,
                maxWidth: "calc(100vw - 1.5rem)",
                maxHeight: "unset",
                overflow: "visible",
              }}
            >
              <motion.div
                animate="open"
                className={cn(theme, panelClass, "transform-gpu", className)}
                custom={skipCloseAnimationRef}
                exit={
                  ((
                    custom: React.MutableRefObject<boolean>
                  ): "closed" | "closedInstant" =>
                    custom.current ? "closedInstant" : "closed") as never
                }
                id={contentId}
                initial="closed"
                role={variant === "action" ? "menu" : "listbox"}
                style={{ transformOrigin: panelOrigin(side, align) }}
                variants={panelVariants}
              >
                <ScrollAreaPrimitive.Root
                  className="relative min-h-0"
                  scrollHideDelay={100}
                  style={{
                    maxHeight: `min(${MAX_HEIGHT}px, var(--radix-dropdown-menu-content-available-height, ${MAX_HEIGHT}px))`,
                  }}
                  type="hover"
                >
                  <ScrollAreaPrimitive.Viewport className="min-h-0 overscroll-contain outline-none">
                    <div
                      className="p-1.5"
                      onPointerLeave={(event) => {
                        const related = event.relatedTarget as Node | null;
                        if (!listRef.current?.contains(related)) {
                          setActiveItemId(undefined);
                        }
                      }}
                      ref={listRef}
                    >
                      {children}
                    </div>
                  </ScrollAreaPrimitive.Viewport>
                  <ScrollAreaPrimitive.Scrollbar
                    className={scrollbarClass}
                    orientation="vertical"
                  >
                    <ScrollAreaPrimitive.Thumb className={thumbClass} />
                  </ScrollAreaPrimitive.Scrollbar>
                </ScrollAreaPrimitive.Root>
              </motion.div>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    );
  }
);
DropdownContent.displayName = "DropdownContent";

function useItemSelect({
  disabled,
  onClick,
  value,
}: {
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  value?: string;
}) {
  const { setValue, skipCloseAnimationRef, variant } =
    useDropdown("DropdownItem");

  return (event: Event) => {
    if (!(disabled || event.defaultPrevented)) {
      skipCloseAnimationRef.current = true;
    }

    onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);

    if (event.defaultPrevented || disabled) {
      return;
    }

    if (variant === "select" && value !== undefined) {
      setValue(value);
    }
  };
}

export interface DropdownItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  textValue?: string;
  value?: string;
}

export const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    { children, className, disabled, onClick, textValue, value, ...props },
    ref
  ) => {
    const { value: selected, variant } = useDropdown("DropdownItem");
    const label = (textValue ?? getText(children)).trim();
    const isSelected =
      variant === "select" && value !== undefined && selected === value;
    const handleSelect = useItemSelect({ disabled, onClick, value });
    const { highlight, rowHandlers } = useRowHighlight(disabled);

    return (
      <DropdownMenuPrimitive.Item
        asChild
        disabled={disabled}
        onSelect={handleSelect}
        textValue={label}
      >
        <div
          {...props}
          {...rowHandlers}
          aria-disabled={disabled || undefined}
          className={cn(itemClass, className)}
          data-disabled={disabled ? "" : undefined}
          data-dropdown-item=""
          data-state={isSelected ? "checked" : "unchecked"}
          data-text-value={label}
          data-value={value}
          ref={ref}
          role={variant === "select" ? "option" : "menuitem"}
          {...(variant === "select" ? { "aria-selected": isSelected } : {})}
        >
          {highlight}
          <motion.span
            className="relative z-10 flex min-w-0 flex-1 items-center gap-2 truncate"
            transition={SPRING}
          >
            {children}
          </motion.span>
          {isSelected ? (
            <motion.span
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative z-10 flex size-5 shrink-0 items-center justify-center text-[color:var(--dd-foreground)]"
              initial={{ opacity: 0, scale: 0.96, y: 1 }}
              transition={CHECK_SPRING}
            >
              <Check className="h-4 w-4" />
            </motion.span>
          ) : null}
        </div>
      </DropdownMenuPrimitive.Item>
    );
  }
);
DropdownItem.displayName = "DropdownItem";

export interface DropdownCheckboxItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    "onSelect"
  > {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const DropdownCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownCheckboxItemProps
>(({ children, className, disabled, onClick, ...props }, ref) => {
  const { skipCloseAnimationRef } = useDropdown("DropdownCheckboxItem");
  const { highlight, rowHandlers } = useRowHighlight(disabled);

  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(itemClass, "pr-8", className)}
      disabled={disabled}
      onSelect={(event) => {
        if (!(disabled || event.defaultPrevented)) {
          skipCloseAnimationRef.current = true;
        }
        onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
      }}
      ref={ref}
      {...rowHandlers}
      {...props}
    >
      {highlight}
      <span className="relative z-10 flex min-w-0 flex-1 items-center gap-2 truncate">
        {children}
      </span>
      <DropdownMenuPrimitive.ItemIndicator className="absolute right-3 flex size-5 items-center justify-center text-[color:var(--dd-foreground)]">
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
DropdownCheckboxItem.displayName = "DropdownCheckboxItem";

export interface DropdownRadioGroupProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.RadioGroup
  > {}

export const DropdownRadioGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioGroup>,
  DropdownRadioGroupProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioGroup
    className={cn("space-y-0.5", className)}
    ref={ref}
    {...props}
  />
));
DropdownRadioGroup.displayName = "DropdownRadioGroup";

export interface DropdownRadioItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>,
    "onSelect"
  > {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  textValue?: string;
}

export const DropdownRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownRadioItemProps
>(
  (
    { children, className, disabled, onClick, textValue, value, ...props },
    ref
  ) => {
    const label = (textValue ?? getText(children)).trim();
    const handleSelect = useItemSelect({ disabled, onClick, value });
    const { highlight, rowHandlers } = useRowHighlight(disabled);

    return (
      <DropdownMenuPrimitive.RadioItem
        className={cn(itemClass, "pr-8", className)}
        disabled={disabled}
        onSelect={handleSelect}
        ref={ref}
        textValue={label}
        value={value}
        {...rowHandlers}
        {...props}
      >
        {highlight}
        <span className="relative z-10 flex min-w-0 flex-1 items-center gap-2 truncate">
          {children}
        </span>
        <DropdownMenuPrimitive.ItemIndicator className="absolute right-3 flex size-5 items-center justify-center text-[color:var(--dd-foreground)]">
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </DropdownMenuPrimitive.RadioItem>
    );
  }
);
DropdownRadioItem.displayName = "DropdownRadioItem";

export const DropdownSub = DropdownMenuPrimitive.Sub;

export interface DropdownSubTriggerProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubTrigger
  > {}

export const DropdownSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownSubTriggerProps
>(({ children, className, ...props }, ref) => {
  const { highlight, rowHandlers } = useRowHighlight();

  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(itemClass, className)}
      ref={ref}
      {...rowHandlers}
      {...props}
    >
      {highlight}
      <span className="relative z-10 flex min-w-0 flex-1 items-center gap-2 truncate">
        {children}
      </span>
      <ChevronRight className="relative z-10 ml-auto h-4 w-4 text-[color:var(--dd-muted-foreground)]" />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownSubTrigger.displayName = "DropdownSubTrigger";

export interface DropdownSubContentProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubContent
  > {}

export const DropdownSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownSubContentProps
>(({ children, className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    className={cn(theme, panelClass, "min-w-[10rem] p-1.5", className)}
    ref={ref}
    sideOffset={sideOffset}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.SubContent>
));
DropdownSubContent.displayName = "DropdownSubContent";

export const DropdownShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    className={cn(
      "ml-auto pl-3 text-[0.68rem] text-[color:var(--dd-muted-foreground)] tracking-[0.12em]",
      className
    )}
    ref={ref}
    {...props}
  />
));
DropdownShortcut.displayName = "DropdownShortcut";

export interface DropdownGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  labelClassName?: string;
}

export const DropdownGroup = React.forwardRef<
  HTMLDivElement,
  DropdownGroupProps
>(
  (
    {
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      children,
      className,
      label,
      labelClassName,
      ...props
    },
    ref
  ) => {
    const labelId = React.useId();

    return (
      <DropdownMenuPrimitive.Group
        aria-label={ariaLabel}
        aria-labelledby={label ? labelId : ariaLabelledby}
        className={cn("space-y-0.5", label && "mt-2 first:mt-0", className)}
        ref={ref}
        {...props}
      >
        {label ? (
          <DropdownLabel className={labelClassName} id={labelId}>
            {label}
          </DropdownLabel>
        ) : null}
        {children}
      </DropdownMenuPrimitive.Group>
    );
  }
);
DropdownGroup.displayName = "DropdownGroup";

export const DropdownLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    className={cn(
      "px-3 pt-1 pb-1 font-medium text-[0.68rem] text-[color:color-mix(in_oklch,var(--dd-muted-foreground),transparent_20%)] uppercase tracking-[0.12em]",
      className
    )}
    ref={ref}
    {...props}
  />
));
DropdownLabel.displayName = "DropdownLabel";

export const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    aria-hidden="true"
    className={cn(
      "my-1 h-px bg-[color:color-mix(in_oklch,var(--dd-border),transparent_40%)]",
      className
    )}
    ref={ref}
    {...props}
  />
));
DropdownSeparator.displayName = "DropdownSeparator";

export const DropdownMenu = Dropdown;
export const DropdownMenuTrigger = DropdownTrigger;
export const DropdownMenuValue = DropdownValue;
export const DropdownMenuContent = DropdownContent;
export const DropdownMenuItem = DropdownItem;
export const DropdownMenuCheckboxItem = DropdownCheckboxItem;
export const DropdownMenuRadioGroup = DropdownRadioGroup;
export const DropdownMenuRadioItem = DropdownRadioItem;
export const DropdownMenuSub = DropdownSub;
export const DropdownMenuSubTrigger = DropdownSubTrigger;
export const DropdownMenuSubContent = DropdownSubContent;
export const DropdownMenuShortcut = DropdownShortcut;
export const DropdownMenuGroup = DropdownGroup;
export const DropdownMenuLabel = DropdownLabel;
export const DropdownMenuSeparator = DropdownSeparator;
