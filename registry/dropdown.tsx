"use client";

import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type DropdownVariant = "select" | "action";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

function getContentAlignmentClasses(align: "center" | "end" | "start") {
  if (align === "center") {
    return "left-1/2 -translate-x-1/2";
  }

  if (align === "end") {
    return "right-0";
  }

  return "left-0";
}

function getContentTransformOrigin(align: "center" | "end" | "start") {
  if (align === "center") {
    return "top center";
  }

  if (align === "end") {
    return "top right";
  }

  return "top left";
}

function getInnerContentMotion(reduceMotion: boolean) {
  return {
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduceMotion ? 0 : -2 },
    initial: { opacity: 0, y: reduceMotion ? 0 : 3 },
    transition: {
      delay: reduceMotion ? 0 : 0.03,
      duration: reduceMotion ? 0.12 : 0.18,
      ease: reduceMotion ? ("easeOut" as const) : SOFT_EASE,
    },
  };
}

function getContentMotion(reduceMotion: boolean) {
  return {
    animate: { opacity: 1, y: 0, scaleY: 1 },
    exit: { opacity: 0, y: -4, scaleY: 0.92 },
    initial: { opacity: 0, y: -4, scaleY: 0.92 },
    transition: {
      duration: reduceMotion ? 0.16 : 0.25,
      ease: reduceMotion ? ("easeOut" as const) : SOFT_EASE,
    },
  };
}

type DropdownContextValue = {
  activeItemId: string | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  labels: Record<string, string>;
  open: boolean;
  reduceMotion: boolean;
  setActiveItemId: (id: string | null) => void;
  setFocusStrategy: (strategy: "first" | "last" | "selected") => void;
  setOpen: (open: boolean) => void;
  setValue: (value: string | undefined) => void;
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
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const focusStrategyRef = React.useRef<"first" | "last" | "selected">(
    "selected"
  );
  const [open, setOpen] = useControllableState<boolean>({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: openProp,
  });
  const [activeItemId, setActiveItemId] = React.useState<string | null>(null);
  const [value, setValue] = useControllableState<string | undefined>({
    defaultProp: defaultValue,
    onChange: onValueChange,
    prop: valueProp,
  });
  const labels = React.useMemo(
    () => collectDropdownLabels(children),
    [children]
  );

  const getEnabledItems = React.useCallback(() => {
    if (!containerRef.current) {
      return [];
    }

    return Array.from(
      containerRef.current.querySelectorAll<HTMLButtonElement>(
        "[data-dropdown-item]:not([disabled])"
      )
    );
  }, []);

  const focusItem = React.useCallback(
    (index: number) => {
      const items = getEnabledItems();

      if (!items.length) {
        return;
      }

      const nextIndex = Math.min(Math.max(index, 0), items.length - 1);
      items[nextIndex]?.focus();
    },
    [getEnabledItems]
  );

  const getActiveDropdownElement = React.useCallback(() => {
    const activeElement = document.activeElement;

    if (
      !(
        containerRef.current &&
        activeElement &&
        containerRef.current.contains(activeElement)
      )
    ) {
      return null;
    }

    return activeElement;
  }, []);

  const handleMenuNavigation = React.useCallback(
    (key: "ArrowDown" | "ArrowUp" | "Home" | "End") => {
      const activeElement = getActiveDropdownElement();

      if (!activeElement) {
        return false;
      }

      const items = getEnabledItems();

      if (!items.length) {
        return false;
      }

      if (key === "Home") {
        focusItem(0);
        return true;
      }

      if (key === "End") {
        focusItem(items.length - 1);
        return true;
      }

      const currentIndex = items.indexOf(activeElement as HTMLButtonElement);

      if (currentIndex === -1) {
        focusItem(key === "ArrowUp" ? items.length - 1 : 0);
        return true;
      }

      const nextIndex =
        key === "ArrowUp"
          ? (currentIndex - 1 + items.length) % items.length
          : (currentIndex + 1) % items.length;

      focusItem(nextIndex);
      return true;
    },
    [focusItem, getActiveDropdownElement, getEnabledItems]
  );

  React.useEffect(() => {
    if (open) {
      return;
    }

    setActiveItemId(null);
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        setOpen(false);
        return;
      }

      if (
        (event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "Home" ||
          event.key === "End") &&
        handleMenuNavigation(event.key)
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMenuNavigation, open, setOpen]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const items = getEnabledItems();

      if (!items.length) {
        return;
      }

      const selectedIndex =
        value === undefined
          ? -1
          : items.findIndex((item) => item.dataset.value === value);

      if (focusStrategyRef.current === "first") {
        focusItem(0);
        return;
      }

      if (focusStrategyRef.current === "last") {
        focusItem(items.length - 1);
        return;
      }

      focusItem(selectedIndex >= 0 ? selectedIndex : 0);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [focusItem, getEnabledItems, open, value]);

  const contextValue = React.useMemo(
    () => ({
      activeItemId,
      containerRef,
      labels,
      open,
      reduceMotion,
      setActiveItemId,
      setFocusStrategy: (strategy: "first" | "last" | "selected") => {
        focusStrategyRef.current = strategy;
      },
      setOpen,
      setValue,
      triggerRef,
      value,
      variant,
    }),
    [
      activeItemId,
      labels,
      open,
      reduceMotion,
      setOpen,
      setValue,
      value,
      variant,
    ]
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div
        className={cn("relative inline-block", className)}
        ref={containerRef}
      >
        {children}
      </div>
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
      onClick,
      onKeyDown,
      showChevron = true,
      ...props
    },
    ref
  ) => {
    const {
      open,
      reduceMotion,
      setFocusStrategy,
      setOpen,
      triggerRef,
      variant,
    } = useDropdownContext("DropdownTrigger");

    return (
      <motion.button
        aria-expanded={open}
        aria-haspopup={variant === "action" ? "menu" : "listbox"}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left font-medium text-foreground text-sm transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        disabled={disabled}
        onClick={(event) => {
          onClick?.(event);

          if (event.defaultPrevented || disabled) {
            return;
          }

          setFocusStrategy("selected");
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.defaultPrevented || disabled) {
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setFocusStrategy("first");
            setOpen(true);
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setFocusStrategy("last");
            setOpen(true);
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setFocusStrategy("selected");
            setOpen(!open);
          }
        }}
        ref={(node) => {
          triggerRef.current = node;
          setRefValue(ref, node);
        }}
        type="button"
        whileTap={disabled ? undefined : { scale: 0.98 }}
        {...props}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {children}
        </span>
        {showChevron ? (
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="text-muted-foreground"
            transition={
              reduceMotion
                ? { duration: 0.14, ease: "easeOut" }
                : { type: "spring", stiffness: 260, damping: 22, mass: 0.72 }
            }
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        ) : null}
      </motion.button>
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
      className={cn("truncate", !label && "text-muted-foreground", className)}
      ref={ref}
      {...props}
    >
      {label ?? placeholder}
    </span>
  );
});
DropdownValue.displayName = "DropdownValue";

export interface DropdownContentProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  align?: "center" | "end" | "start";
  sideOffset?: number;
}

export const DropdownContent = React.forwardRef<
  HTMLDivElement,
  DropdownContentProps
>(({ align = "start", children, className, sideOffset = 8, ...props }, ref) => {
  const { open, reduceMotion, variant } = useDropdownContext("DropdownContent");
  const contentMotion = getContentMotion(reduceMotion);
  const innerContentMotion = getInnerContentMotion(reduceMotion);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={contentMotion.animate}
          className={cn(
            "absolute z-[300] min-w-[12rem] overflow-hidden rounded-lg border border-border bg-card shadow-lg",
            getContentAlignmentClasses(align),
            className
          )}
          exit={contentMotion.exit}
          initial={contentMotion.initial}
          ref={ref}
          role={variant === "action" ? "menu" : "listbox"}
          style={{
            top: `calc(100% + ${sideOffset}px)`,
            transformOrigin: getContentTransformOrigin(align),
            originY: 0,
          }}
          transition={contentMotion.transition}
          {...props}
        >
          <motion.div
            animate={innerContentMotion.animate}
            className="p-1.5"
            exit={innerContentMotion.exit}
            initial={innerContentMotion.initial}
            transition={innerContentMotion.transition}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
});
DropdownContent.displayName = "DropdownContent";

export interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textValue?: string;
  value?: string;
}

export const DropdownItem = React.forwardRef<
  HTMLButtonElement,
  DropdownItemProps
>(({ children, className, disabled, onClick, value, ...props }, ref) => {
  const {
    activeItemId,
    reduceMotion,
    setActiveItemId,
    setOpen,
    setValue,
    value: currentValue,
    variant,
  } = useDropdownContext("DropdownItem");
  const itemId = React.useId();
  const isActive = activeItemId === itemId && !disabled;
  const isSelected =
    variant === "select" && value !== undefined && currentValue === value;

  return (
    <button
      className={cn(
        "group relative flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-foreground text-sm transition-colors",
        "hover:bg-accent focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none",
        isActive && "bg-accent text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      data-dropdown-item=""
      data-state={isSelected ? "checked" : "unchecked"}
      data-value={value}
      disabled={disabled}
      onBlur={() => setActiveItemId(null)}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented || disabled) {
          return;
        }

        if (variant === "select" && value !== undefined) {
          setValue(value);
        }

        setOpen(false);
      }}
      onFocus={() => setActiveItemId(itemId)}
      onMouseEnter={() => setActiveItemId(itemId)}
      onMouseLeave={() => setActiveItemId(null)}
      ref={ref}
      role={variant === "action" ? "menuitem" : "option"}
      type="button"
      {...props}
    >
      <motion.span
        className="relative z-10 flex min-w-0 flex-1 items-center gap-2 truncate"
        transition={
          reduceMotion
            ? undefined
            : { type: "spring", stiffness: 360, damping: 28, mass: 0.55 }
        }
      >
        {children}
      </motion.span>
      {isSelected ? (
        <motion.span
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 shrink-0 text-primary"
          initial={{ opacity: 0, scale: 0.78, y: 1 }}
          transition={
            reduceMotion
              ? { duration: 0.14, ease: "easeOut" }
              : { type: "spring", stiffness: 460, damping: 24, mass: 0.5 }
          }
        >
          <Check className="h-4 w-4" />
        </motion.span>
      ) : null}
    </button>
  );
});
DropdownItem.displayName = "DropdownItem";

export const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn("my-1 h-px bg-border/60", className)}
    ref={ref}
    {...props}
  />
));
DropdownSeparator.displayName = "DropdownSeparator";
