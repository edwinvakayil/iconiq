"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const dropdownThemeClassName =
  "[--dd-surface:#ffffff] [--dd-foreground:#111111] [--dd-border:#e3e7ec] [--dd-ring:rgba(17,17,17,0.16)] [--dd-muted-foreground:#6d7480] [--dd-accent:#f3f5f8] [--color-accent:var(--dd-accent)] [--color-accent-foreground:var(--dd-foreground)] dark:[--dd-surface:#111111] dark:[--dd-foreground:#f6f3ec] dark:[--dd-border:#2b2a25] dark:[--dd-ring:rgba(246,243,236,0.18)] dark:[--dd-muted-foreground:#9a958a] dark:[--dd-accent:#1a1a18] [--color-accent:var(--dd-accent)] [--color-accent-foreground:var(--dd-foreground)]";

const dropdownTriggerClassName =
  "flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-[color:var(--dd-border)] bg-[color:var(--dd-surface)] px-4 py-3 text-left font-medium text-[color:var(--dd-foreground)] text-sm transition-colors hover:bg-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--dd-ring),transparent_50%)]";

const dropdownPanelClassName =
  "z-[300] min-w-[12rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-[color:color-mix(in_oklch,var(--dd-border),transparent_40%)] bg-[color:var(--dd-surface)] outline-none";

const dropdownItemClassName =
  "relative flex min-h-11 w-full scroll-m-1 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[color:var(--dd-foreground)] text-sm outline-none transition-colors focus-visible:text-[color:var(--dd-foreground)] focus-visible:outline-none";

const dropdownItemHighlightClassName =
  "absolute inset-0 rounded-lg bg-[color:var(--dd-accent)]";

const dropdownListScrollClassName =
  "min-h-0 overflow-y-auto overscroll-contain p-1.5 pr-1 outline-none [scrollbar-color:color-mix(in_oklch,var(--dd-muted-foreground,#6d7480),transparent_55%)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[color:color-mix(in_oklch,var(--dd-muted-foreground,#6d7480),transparent_55%)] [&::-webkit-scrollbar-track]:bg-transparent";

export type DropdownVariant = "select" | "action";

type DropdownAlign = "center" | "end" | "start";
type DropdownFocusStrategy = "first" | "last" | "selected";

const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_EASE = [0.4, 0, 0.6, 1] as const;
const INSTANT_CLOSE_TRANSITION = { duration: 0 } as const;
const MAX_CONTENT_HEIGHT = 384;
const VIEWPORT_MARGIN = 12;
const CLASSNAME_TOKEN_SPLIT = /\s+/;

const POPUP_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.95,
};
const POPUP_TRANSFORM_ORIGIN = "top center";

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
    opacity: { duration: 0.22, ease: EXIT_EASE },
    scale: { duration: 0.22, ease: EXIT_EASE },
    y: { duration: 0.22, ease: EXIT_EASE },
  },
};

type DropdownContextValue = {
  contentId: string;
  focusStrategyRef: React.MutableRefObject<DropdownFocusStrategy>;
  hoveredItemId: string | undefined;
  labels: Record<string, string>;
  open: boolean;
  setFocusStrategy: (strategy: DropdownFocusStrategy) => void;
  setHoveredItemId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOpen: (open: boolean) => void;
  setValue: (value: string | undefined) => void;
  skipExitAnimationRef: React.MutableRefObject<boolean>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  value: string | undefined;
  variant: DropdownVariant;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext(componentName: string) {
  const context = React.useContext(DropdownContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Dropdown.`);
  }

  return context;
}

function setRefValue<T>(
  ref: React.ForwardedRef<T> | undefined,
  value: T | null
) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return getTextContent(element.props.children);
  }

  return "";
}

function collectDropdownLabels(node: React.ReactNode): Record<string, string> {
  const labels: Record<string, string> = {};

  const visit = (childNode: React.ReactNode) => {
    if (!React.isValidElement(childNode)) {
      if (Array.isArray(childNode)) {
        childNode.forEach(visit);
      }

      return;
    }

    const element = childNode as React.ReactElement<{
      children?: React.ReactNode;
      textValue?: string;
      value?: string;
    }>;
    const displayName =
      typeof element.type === "string"
        ? element.type
        : (element.type as { displayName?: string }).displayName;

    if (displayName === "DropdownItem" && element.props.value) {
      labels[element.props.value] = (
        element.props.textValue ?? getTextContent(element.props.children)
      ).trim();
    }

    if (element.props.children) {
      React.Children.forEach(element.props.children, visit);
    }
  };

  React.Children.forEach(node, visit);
  return labels;
}

function useControllableState<T>({
  defaultProp,
  onChange,
  prop,
}: {
  defaultProp: T;
  onChange?: (value: T) => void;
  prop?: T;
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  const setValue = React.useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [isControlled, onChange]
  );

  return [value, setValue] as const;
}

function getEnabledItems(content: HTMLDivElement | null) {
  if (!content) {
    return [];
  }

  return Array.from(
    content.querySelectorAll<HTMLElement>(
      "[data-dropdown-item]:not([data-disabled])"
    )
  );
}

function focusItem(items: HTMLElement[], index: number) {
  if (!items.length) {
    return;
  }

  const nextIndex = Math.min(Math.max(index, 0), items.length - 1);
  items[nextIndex]?.focus();
}

function classNameHasToken(className: string | undefined, token: string) {
  return className?.split(CLASSNAME_TOKEN_SPLIT).includes(token) ?? false;
}

export interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | undefined) => void;
  open?: boolean;
  value?: string;
  variant?: DropdownVariant;
}

export function Dropdown({
  children,
  className,
  defaultOpen = false,
  defaultValue,
  onOpenChange,
  onValueChange,
  open: openProp,
  value: valueProp,
  variant = "select",
}: DropdownProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentId = React.useId();
  const focusStrategyRef = React.useRef<DropdownFocusStrategy>("selected");
  const skipExitAnimationRef = React.useRef(false);
  const [open, setOpen] = useControllableState<boolean>({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: openProp,
  });
  const [hoveredItemId, setHoveredItemId] = React.useState<
    string | undefined
  >();
  const [value, setValue] = useControllableState<string | undefined>({
    defaultProp: defaultValue,
    onChange: onValueChange,
    prop: valueProp,
  });
  const labels = React.useMemo(
    () => collectDropdownLabels(children),
    [children]
  );

  const contextValue = React.useMemo(
    () => ({
      contentId,
      focusStrategyRef,
      hoveredItemId,
      labels,
      open,
      setFocusStrategy: (strategy: DropdownFocusStrategy) => {
        focusStrategyRef.current = strategy;
      },
      setHoveredItemId,
      setOpen,
      setValue,
      skipExitAnimationRef,
      triggerRef,
      value,
      variant,
    }),
    [contentId, hoveredItemId, labels, open, setOpen, setValue, value, variant]
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <DropdownMenuPrimitive.Root
        modal={false}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            skipExitAnimationRef.current = false;
          }

          setOpen(nextOpen);

          if (!nextOpen) {
            setHoveredItemId(undefined);
          }
        }}
        open={open}
      >
        <div
          className={cn(
            dropdownThemeClassName,
            "relative inline-block",
            className
          )}
        >
          {children}
        </div>
      </DropdownMenuPrimitive.Root>
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "children"> {
  children?: React.ReactNode;
  showChevron?: boolean;
}

export const DropdownTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(
  (
    {
      children,
      className,
      disabled,
      onKeyDown,
      onPointerDown,
      showChevron = true,
      ...props
    },
    ref
  ) => {
    const { contentId, open, setFocusStrategy, setOpen, triggerRef, variant } =
      useDropdownContext("DropdownTrigger");

    return (
      <DropdownMenuPrimitive.Trigger asChild disabled={disabled}>
        <button
          aria-controls={contentId}
          aria-expanded={open}
          aria-haspopup={variant === "action" ? "menu" : "listbox"}
          className={cn(
            dropdownTriggerClassName,
            disabled && "cursor-not-allowed opacity-60",
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
              setFocusStrategy("first");
              return;
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setFocusStrategy("last");
              setOpen(true);
              return;
            }

            if (event.key === "Enter" || event.key === " ") {
              setFocusStrategy("selected");
            }
          }}
          onPointerDown={(event) => {
            onPointerDown?.(event);

            if (event.defaultPrevented || disabled) {
              return;
            }

            setFocusStrategy("selected");
          }}
          ref={(node) => {
            triggerRef.current = node;
            setRefValue(ref, node);
          }}
          type="button"
          {...props}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {children}
          </span>
          {showChevron ? (
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              className="text-[color:var(--dd-muted-foreground)]"
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                mass: 0.72,
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          ) : null}
        </button>
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
  const { labels, value } = useDropdownContext("DropdownValue");
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
  children?: React.ReactNode;
  className?: string;
  sideOffset?: number;
  style?: React.CSSProperties;
}

export const DropdownContent = React.forwardRef<
  HTMLDivElement,
  DropdownContentProps
>(({ align = "start", children, className, sideOffset = 8, style }, ref) => {
  const {
    focusStrategyRef,
    open,
    setHoveredItemId,
    skipExitAnimationRef,
    value,
  } = useDropdownContext("DropdownContent");
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const shouldMatchTriggerWidth = classNameHasToken(className, "w-full");
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

  const setContentRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      contentRef.current = node;
      setRefValue(ref, node);
    },
    [ref]
  );

  const focusContentByStrategy = React.useCallback(() => {
    const items = getEnabledItems(contentRef.current);

    if (!items.length) {
      return;
    }

    if (focusStrategyRef.current === "first") {
      focusItem(items, 0);
      return;
    }

    if (focusStrategyRef.current === "last") {
      focusItem(items, items.length - 1);
      return;
    }

    const selectedIndex =
      value === undefined
        ? -1
        : items.findIndex((item) => item.dataset.value === value);

    focusItem(items, selectedIndex >= 0 ? selectedIndex : 0);
  }, [focusStrategyRef, value]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      focusContentByStrategy();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [focusContentByStrategy, open]);

  return (
    <AnimatePresence
      custom={skipExitAnimationRef}
      onExitComplete={() => {
        skipExitAnimationRef.current = false;
      }}
    >
      {open ? (
        <DropdownMenuPrimitive.Portal forceMount>
          <DropdownMenuPrimitive.Content
            align={align}
            avoidCollisions={false}
            className="z-[300] max-h-none overflow-visible border-0 bg-transparent p-0 shadow-none outline-none"
            collisionPadding={VIEWPORT_MARGIN}
            forceMount
            loop
            onCloseAutoFocus={() => {
              focusStrategyRef.current = "selected";
            }}
            ref={setContentRef}
            side="bottom"
            sideOffset={sideOffset}
            style={{
              ...style,
              width: shouldMatchTriggerWidth
                ? "var(--radix-dropdown-menu-trigger-width)"
                : style?.width,
              maxWidth: "calc(100vw - 1.5rem)",
              maxHeight: "unset",
              overflow: "visible",
            }}
          >
            <motion.div
              animate="open"
              className={cn(
                dropdownThemeClassName,
                dropdownPanelClassName,
                "transform-gpu",
                className
              )}
              custom={skipExitAnimationRef}
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
              <div
                className={dropdownListScrollClassName}
                onPointerLeave={() => {
                  setHoveredItemId(undefined);
                }}
                style={{
                  maxHeight: `min(${MAX_CONTENT_HEIGHT}px, var(--radix-dropdown-menu-content-available-height, ${MAX_CONTENT_HEIGHT}px))`,
                }}
              >
                {children as React.ReactNode}
              </div>
            </motion.div>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
});
DropdownContent.displayName = "DropdownContent";

export interface DropdownItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  textValue?: string;
  value?: string;
}

export const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    { children, className, disabled, onClick, textValue, value, ...props },
    ref
  ) => {
    const {
      contentId,
      hoveredItemId,
      setHoveredItemId,
      setValue,
      skipExitAnimationRef,
      value: currentValue,
      variant,
    } = useDropdownContext("DropdownItem");
    const itemId = React.useId();
    const isSelected =
      variant === "select" && value !== undefined && currentValue === value;
    const isHovered = hoveredItemId === itemId;
    const resolvedTextValue = React.useMemo(
      () => (textValue ?? getTextContent(children)).trim(),
      [children, textValue]
    );

    return (
      <DropdownMenuPrimitive.Item
        asChild
        disabled={disabled}
        onSelect={(event) => {
          if (!(disabled || event.defaultPrevented)) {
            skipExitAnimationRef.current = true;
          }

          onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);

          if (event.defaultPrevented || disabled) {
            return;
          }

          if (variant === "select" && value !== undefined) {
            setValue(value);
          }
        }}
        textValue={resolvedTextValue}
      >
        <div
          {...props}
          aria-disabled={disabled || undefined}
          className={cn(
            dropdownItemClassName,
            disabled && "pointer-events-none opacity-50",
            className
          )}
          data-disabled={disabled ? "" : undefined}
          data-dropdown-item=""
          data-state={isSelected ? "checked" : "unchecked"}
          data-text-value={resolvedTextValue}
          data-value={value}
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
          ref={ref}
        >
          {isHovered ? (
            <motion.span
              className={dropdownItemHighlightClassName}
              layoutId={`${contentId}-dropdown-active-item`}
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 38,
              }}
            />
          ) : null}
          <motion.span
            className="relative z-10 flex min-w-0 flex-1 items-center gap-2 truncate"
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 28,
              mass: 0.55,
            }}
          >
            {children}
          </motion.span>
          {isSelected ? (
            <motion.span
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative z-10 flex size-5 shrink-0 items-center justify-center text-[color:var(--dd-foreground)]"
              initial={{ opacity: 0, scale: 0.78, y: 1 }}
              transition={{
                type: "spring",
                stiffness: 460,
                damping: 24,
                mass: 0.5,
              }}
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
    const generatedLabelId = React.useId();

    return (
      <DropdownMenuPrimitive.Group
        aria-label={ariaLabel}
        aria-labelledby={label ? generatedLabelId : ariaLabelledby}
        className={cn("mt-2 space-y-0.5 first:mt-0", className)}
        ref={ref}
        {...props}
      >
        {label ? (
          <DropdownLabel className={labelClassName} id={generatedLabelId}>
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
    className={cn("my-1 h-1 border-0", className)}
    ref={ref}
    {...props}
  />
));
DropdownSeparator.displayName = "DropdownSeparator";
