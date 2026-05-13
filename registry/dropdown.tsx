"use client";

import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type DropdownVariant = "select" | "action";

type DropdownAlign = "center" | "end" | "start";
type DropdownFocusStrategy = "first" | "last" | "selected";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const MAX_CONTENT_HEIGHT = 384;
const TYPEAHEAD_RESET_MS = 500;
const VIEWPORT_MARGIN = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getContentMotion(reduceMotion: boolean) {
  return {
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduceMotion ? 0 : -4 },
    initial: { opacity: 0, y: reduceMotion ? 0 : -4 },
    transition: {
      duration: reduceMotion ? 0.16 : 0.25,
      ease: reduceMotion ? ("easeOut" as const) : SOFT_EASE,
    },
  };
}

function getHorizontalOrigin(align: DropdownAlign) {
  if (align === "center") {
    return "center";
  }

  if (align === "end") {
    return "right";
  }

  return "left";
}

function getResolvedPlacement(
  contentHeight: number,
  triggerRect: DOMRect,
  viewportHeight: number,
  sideOffset: number
) {
  const availableBelow = Math.max(
    viewportHeight - triggerRect.bottom - sideOffset - VIEWPORT_MARGIN,
    0
  );
  const maxHeight =
    availableBelow > 0
      ? Math.min(MAX_CONTENT_HEIGHT, Math.min(contentHeight, availableBelow))
      : null;

  return { maxHeight };
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

function normalizeTypeaheadValue(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

type DropdownContextValue = {
  activeItemId: string | null;
  contentId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  labels: Record<string, string>;
  open: boolean;
  reduceMotion: boolean;
  setActiveItemId: (id: string | null) => void;
  setFocusStrategy: (strategy: DropdownFocusStrategy) => void;
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

function getResolvedHorizontalPosition({
  align,
  containerRect,
  contentWidth,
  triggerRect,
  viewportWidth,
}: {
  align: DropdownAlign;
  containerRect: DOMRect;
  contentWidth: number;
  triggerRect: DOMRect;
  viewportWidth: number;
}) {
  const desiredLeft =
    align === "center"
      ? triggerRect.left + (triggerRect.width - contentWidth) / 2
      : align === "end"
        ? triggerRect.right - contentWidth
        : triggerRect.left;
  const maxLeft = Math.max(
    VIEWPORT_MARGIN,
    viewportWidth - contentWidth - VIEWPORT_MARGIN
  );
  const clampedLeft = clamp(desiredLeft, VIEWPORT_MARGIN, maxLeft);
  const horizontalOrigin: "center" | "left" | "right" =
    Math.abs(clampedLeft - VIEWPORT_MARGIN) < 0.5
      ? "left"
      : Math.abs(clampedLeft - maxLeft) < 0.5
        ? "right"
        : getHorizontalOrigin(align);

  return {
    horizontalOrigin,
    left: clampedLeft - containerRect.left,
  };
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
  const contentId = React.useId();
  const focusStrategyRef = React.useRef<DropdownFocusStrategy>("selected");
  const typeaheadRef = React.useRef("");
  const typeaheadTimeoutRef = React.useRef<number | null>(null);
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

  const clearTypeahead = React.useCallback(() => {
    if (typeaheadTimeoutRef.current !== null) {
      window.clearTimeout(typeaheadTimeoutRef.current);
      typeaheadTimeoutRef.current = null;
    }

    typeaheadRef.current = "";
  }, []);

  const getEnabledItems = React.useCallback(() => {
    if (!containerRef.current) {
      return [];
    }

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        "[data-dropdown-item]:not([data-disabled])"
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
      const nextItem = items[nextIndex];
      nextItem?.focus();
      nextItem?.scrollIntoView({ block: "nearest" });
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

  const findMatchingItemIndex = React.useCallback(
    (query: string) => {
      const normalizedQuery = normalizeTypeaheadValue(query);

      if (!normalizedQuery) {
        return null;
      }

      const items = getEnabledItems();

      if (!items.length) {
        return null;
      }

      const activeElement = getActiveDropdownElement();
      const currentIndex = items.indexOf(activeElement as HTMLElement);
      const startIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;

      for (let offset = 0; offset < items.length; offset += 1) {
        const index = (startIndex + offset) % items.length;
        const candidate = items[index];
        const textValue = normalizeTypeaheadValue(
          candidate?.dataset.textValue ?? candidate?.textContent ?? ""
        );

        if (textValue.startsWith(normalizedQuery)) {
          return index;
        }
      }

      return null;
    },
    [getActiveDropdownElement, getEnabledItems]
  );

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

      const currentIndex = items.indexOf(activeElement as HTMLElement);

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

  const handleTypeaheadKey = React.useCallback(
    (key: string) => {
      const normalizedKey = normalizeTypeaheadValue(key);

      if (!normalizedKey) {
        return false;
      }

      const nextQuery =
        typeaheadRef.current === normalizedKey
          ? normalizedKey
          : `${typeaheadRef.current}${normalizedKey}`;
      const matchIndex = findMatchingItemIndex(nextQuery);

      typeaheadRef.current = nextQuery;

      if (typeaheadTimeoutRef.current !== null) {
        window.clearTimeout(typeaheadTimeoutRef.current);
      }

      typeaheadTimeoutRef.current = window.setTimeout(() => {
        typeaheadRef.current = "";
        typeaheadTimeoutRef.current = null;
      }, TYPEAHEAD_RESET_MS);

      if (matchIndex !== null) {
        focusItem(matchIndex);
        return true;
      }

      if (nextQuery !== normalizedKey) {
        typeaheadRef.current = normalizedKey;
        const fallbackMatchIndex = findMatchingItemIndex(normalizedKey);

        if (fallbackMatchIndex !== null) {
          focusItem(fallbackMatchIndex);
          return true;
        }
      }

      return false;
    },
    [findMatchingItemIndex, focusItem]
  );

  React.useEffect(() => {
    if (open) {
      return;
    }

    setActiveItemId(null);
    clearTypeahead();
  }, [clearTypeahead, open]);

  React.useEffect(() => clearTypeahead, [clearTypeahead]);

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
        event.key.length === 1 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        event.key.trim() &&
        handleTypeaheadKey(event.key)
      ) {
        event.preventDefault();
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
  }, [handleMenuNavigation, handleTypeaheadKey, open, setOpen]);

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
      contentId,
      containerRef,
      labels,
      open,
      reduceMotion,
      setActiveItemId,
      setFocusStrategy: (strategy: DropdownFocusStrategy) => {
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
      contentId,
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
      contentId,
      open,
      reduceMotion,
      setFocusStrategy,
      setOpen,
      triggerRef,
      variant,
    } = useDropdownContext("DropdownTrigger");

    return (
      <motion.button
        aria-controls={contentId}
        aria-expanded={open}
        aria-haspopup={variant === "action" ? "menu" : "listbox"}
        className={cn(
          "flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-left font-medium text-foreground text-sm transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        data-state={open ? "open" : "closed"}
        disabled={disabled}
        layout={reduceMotion ? false : "size"}
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
        <motion.span
          className="flex min-w-0 flex-1 items-center gap-2"
          layout={reduceMotion ? false : "position"}
        >
          {children}
        </motion.span>
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
  align?: DropdownAlign;
  sideOffset?: number;
}

export const DropdownContent = React.forwardRef<
  HTMLDivElement,
  DropdownContentProps
>(
  (
    { align = "start", children, className, sideOffset = 8, style, ...props },
    ref
  ) => {
    const { containerRef, contentId, open, reduceMotion, triggerRef, variant } =
      useDropdownContext("DropdownContent");
    const shellRef = React.useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = React.useState<{
      horizontalOrigin: "center" | "left" | "right";
      left: number;
      maxHeight: number | null;
    }>({
      horizontalOrigin: getHorizontalOrigin(align),
      left: 0,
      maxHeight: null,
    });

    const setContentRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        shellRef.current = node;
        setRefValue(ref, node);
      },
      [ref]
    );

    const updatePosition = React.useCallback(() => {
      const container = containerRef.current;
      const shell = shellRef.current;
      const trigger = triggerRef.current;

      if (!(container && shell && trigger)) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const shellRect = shell.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const contentWidth = shellRect.width || triggerRect.width;
      const { maxHeight } = getResolvedPlacement(
        shellRect.height || Math.min(MAX_CONTENT_HEIGHT, 240),
        triggerRect,
        window.innerHeight,
        sideOffset
      );
      const { horizontalOrigin, left } = getResolvedHorizontalPosition({
        align,
        containerRect,
        contentWidth,
        triggerRect,
        viewportWidth: window.innerWidth,
      });

      setPosition({
        horizontalOrigin,
        left,
        maxHeight,
      });
    }, [align, containerRef, sideOffset, triggerRef]);

    React.useEffect(() => {
      if (!open) {
        return;
      }

      const frame = window.requestAnimationFrame(updatePosition);
      const handleViewportChange = () => updatePosition();
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);

      const observer = new ResizeObserver(() => updatePosition());
      const observedNodes = [
        containerRef.current,
        shellRef.current,
        triggerRef.current,
      ].filter(Boolean);

      observedNodes.forEach((node) => {
        observer.observe(node as Element);
      });

      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
        observer.disconnect();
      };
    }, [containerRef, open, triggerRef, updatePosition]);

    const contentMotion = getContentMotion(reduceMotion);
    const innerContentMotion = getInnerContentMotion(reduceMotion);

    return (
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={contentMotion.animate}
            aria-orientation="vertical"
            className={cn(
              "absolute z-[300] min-w-[12rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-border/60 bg-card shadow-[0_14px_34px_-22px_hsl(var(--foreground)/0.28)]",
              className
            )}
            exit={contentMotion.exit}
            id={contentId}
            initial={contentMotion.initial}
            ref={setContentRef}
            role={variant === "action" ? "menu" : "listbox"}
            style={{
              ...style,
              left: position.left,
              top: `calc(100% + ${sideOffset}px)`,
              transformOrigin: `top ${position.horizontalOrigin}`,
            }}
            transition={contentMotion.transition}
            {...props}
          >
            <motion.div
              animate={innerContentMotion.animate}
              className="scroll-py-1 overflow-y-auto overscroll-contain p-1.5"
              exit={innerContentMotion.exit}
              initial={innerContentMotion.initial}
              style={{
                maxHeight: position.maxHeight ?? undefined,
              }}
              transition={innerContentMotion.transition}
            >
              {children}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }
);
DropdownContent.displayName = "DropdownContent";

export interface DropdownItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  textValue?: string;
  value?: string;
}

export const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    {
      children,
      className,
      disabled,
      onClick,
      onKeyDown,
      textValue,
      value,
      ...props
    },
    ref
  ) => {
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
    const resolvedTextValue = React.useMemo(
      () => (textValue ?? getTextContent(children)).trim(),
      [children, textValue]
    );

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      if (variant === "select" && value !== undefined) {
        setValue(value);
      }

      setOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.currentTarget.click();
      }
    };

    const itemContent = (
      <>
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
            className="relative z-10 flex size-5 shrink-0 items-center justify-center text-foreground"
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
      </>
    );

    const sharedProps = {
      ...props,
      "aria-disabled": disabled || undefined,
      className: cn(
        "group relative isolate flex min-h-11 w-full scroll-m-1 items-center justify-between gap-3 rounded-[0.65rem] px-3 py-2.5 text-left text-foreground text-sm transition-colors",
        "before:absolute before:inset-x-1 before:inset-y-0.5 before:-z-10 before:rounded-[0.5rem] before:bg-transparent before:transition-colors",
        "hover:before:bg-accent/65 focus-visible:text-foreground focus-visible:outline-none focus-visible:before:bg-accent/65",
        isActive && "before:bg-accent/65",
        isSelected &&
          variant === "select" &&
          "text-foreground before:bg-accent/45",
        isSelected && isActive && variant === "select" && "before:bg-accent/75",
        disabled && "pointer-events-none opacity-50",
        className
      ),
      "data-disabled": disabled ? "" : undefined,
      "data-dropdown-item": "",
      "data-state": isSelected ? "checked" : "unchecked",
      "data-text-value": resolvedTextValue,
      "data-value": value,
      id: itemId,
      onBlur: () => setActiveItemId(null),
      onClick: handleClick,
      onFocus: () => setActiveItemId(itemId),
      onKeyDown: handleKeyDown,
      onMouseEnter: () => setActiveItemId(itemId),
      onMouseLeave: () => setActiveItemId(null),
      ref,
    };

    if (variant === "select") {
      return (
        <div
          {...sharedProps}
          aria-selected={isSelected}
          role="option"
          tabIndex={disabled ? undefined : -1}
        >
          {itemContent}
        </div>
      );
    }

    return (
      <div
        {...sharedProps}
        role="menuitem"
        tabIndex={disabled ? undefined : -1}
      >
        {itemContent}
      </div>
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
    const groupLabelId = label ? generatedLabelId : ariaLabelledby;
    const hasAccessibleLabel = Boolean(label || ariaLabel || groupLabelId);

    return (
      <div
        className={cn("mt-2 space-y-0.5 first:mt-0", className)}
        ref={ref}
        {...(hasAccessibleLabel
          ? {
              "aria-label": ariaLabel,
              "aria-labelledby": groupLabelId,
              role: "group" as const,
            }
          : {})}
        {...props}
      >
        {label ? (
          <DropdownLabel className={labelClassName} id={generatedLabelId}>
            {label}
          </DropdownLabel>
        ) : null}
        {children}
      </div>
    );
  }
);
DropdownGroup.displayName = "DropdownGroup";

export const DropdownLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "px-3 pt-1 pb-1 font-medium text-[0.68rem] text-muted-foreground/80 uppercase tracking-[0.12em]",
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
  <div
    aria-hidden="true"
    className={cn("my-1 h-1 border-0", className)}
    ref={ref}
    {...props}
  />
));
DropdownSeparator.displayName = "DropdownSeparator";
