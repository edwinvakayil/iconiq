"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
  useResolvedReducedMotion,
} from "@/lib/reduced-motion";
import { registryTheme } from "@/lib/registry-theme";
import { cn } from "@/lib/utils";

export type DropdownVariant = "select" | "action";

type DropdownAlign = "center" | "end" | "start";
type DropdownFocusStrategy = "first" | "last" | "selected";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const MAX_CONTENT_HEIGHT = 384;
const VIEWPORT_MARGIN = 12;
const CLASSNAME_TOKEN_SPLIT = /\s+/;

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

type DropdownContextValue = {
  contentId: string;
  focusStrategyRef: React.MutableRefObject<DropdownFocusStrategy>;
  labels: Record<string, string>;
  open: boolean;
  reduceMotion: boolean;
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

export interface DropdownProps extends ReducedMotionProp {
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
  reducedMotion,
  value: valueProp,
  variant = "select",
}: DropdownProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const reduceMotion = useResolvedReducedMotion(reducedMotion);
  const contentId = React.useId();
  const focusStrategyRef = React.useRef<DropdownFocusStrategy>("selected");
  const [open, setOpen] = useControllableState<boolean>({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: openProp,
  });
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
      labels,
      open,
      reduceMotion,
      setFocusStrategy: (strategy: DropdownFocusStrategy) => {
        focusStrategyRef.current = strategy;
      },
      setOpen,
      setValue,
      triggerRef,
      value,
      variant,
    }),
    [contentId, labels, open, reduceMotion, setOpen, setValue, value, variant]
  );

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <DropdownContext.Provider value={contextValue}>
        <DropdownMenuPrimitive.Root
          modal={false}
          onOpenChange={setOpen}
          open={open}
        >
          <div
            className={cn(registryTheme, "relative inline-block", className)}
          >
            {children}
          </div>
        </DropdownMenuPrimitive.Root>
      </DropdownContext.Provider>
    </ReducedMotionConfig>
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
      onKeyDown,
      onPointerDown,
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
      <DropdownMenuPrimitive.Trigger asChild disabled={disabled}>
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
    const { focusStrategyRef, open, reduceMotion, value } =
      useDropdownContext("DropdownContent");
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const contentMotion = getContentMotion(reduceMotion);
    const innerContentMotion = getInnerContentMotion(reduceMotion);
    const shouldMatchTriggerWidth = classNameHasToken(className, "w-full");

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
      <AnimatePresence>
        {open ? (
          <DropdownMenuPrimitive.Portal forceMount>
            <DropdownMenuPrimitive.Content
              align={align}
              asChild
              avoidCollisions={false}
              collisionPadding={VIEWPORT_MARGIN}
              forceMount
              loop
              onCloseAutoFocus={() => {
                focusStrategyRef.current = "selected";
              }}
              side="bottom"
              sideOffset={sideOffset}
            >
              <motion.div
                animate={contentMotion.animate}
                className={cn(
                  registryTheme,
                  "z-[300] min-w-[12rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-border/60 bg-card shadow-[0_14px_34px_-22px_hsl(var(--foreground)/0.28)] outline-none",
                  className
                )}
                exit={contentMotion.exit}
                initial={contentMotion.initial}
                ref={setContentRef}
                style={{
                  ...style,
                  transformOrigin:
                    "var(--radix-dropdown-menu-content-transform-origin)",
                  width: shouldMatchTriggerWidth
                    ? "var(--radix-dropdown-menu-trigger-width)"
                    : style?.width,
                  maxWidth: "calc(100vw - 1.5rem)",
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
                    maxHeight: `min(${MAX_CONTENT_HEIGHT}px, var(--radix-dropdown-menu-content-available-height, ${MAX_CONTENT_HEIGHT}px))`,
                  }}
                  transition={innerContentMotion.transition}
                >
                  {children}
                </motion.div>
              </motion.div>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
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
    { children, className, disabled, onClick, textValue, value, ...props },
    ref
  ) => {
    const {
      reduceMotion,
      setValue,
      value: currentValue,
      variant,
    } = useDropdownContext("DropdownItem");
    const isSelected =
      variant === "select" && value !== undefined && currentValue === value;
    const resolvedTextValue = React.useMemo(
      () => (textValue ?? getTextContent(children)).trim(),
      [children, textValue]
    );

    return (
      <DropdownMenuPrimitive.Item
        asChild
        disabled={disabled}
        onSelect={(event) => {
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
            "group relative isolate flex min-h-11 w-full scroll-m-1 items-center justify-between gap-3 rounded-[0.65rem] px-3 py-2.5 text-left text-foreground text-sm outline-none transition-colors",
            "before:absolute before:inset-x-1 before:inset-y-0.5 before:-z-10 before:rounded-[0.5rem] before:bg-transparent before:transition-colors",
            "hover:before:bg-accent/65 focus-visible:text-foreground focus-visible:outline-none focus-visible:before:bg-accent/65",
            "data-[highlighted]:before:bg-accent/65",
            isSelected &&
              variant === "select" &&
              "text-foreground before:bg-accent/45 data-[highlighted]:before:bg-accent/75",
            disabled && "pointer-events-none opacity-50",
            className
          )}
          data-disabled={disabled ? "" : undefined}
          data-dropdown-item=""
          data-state={isSelected ? "checked" : "unchecked"}
          data-text-value={resolvedTextValue}
          data-value={value}
          ref={ref}
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
  <DropdownMenuPrimitive.Separator
    aria-hidden="true"
    className={cn("my-1 h-1 border-0", className)}
    ref={ref}
    {...props}
  />
));
DropdownSeparator.displayName = "DropdownSeparator";
