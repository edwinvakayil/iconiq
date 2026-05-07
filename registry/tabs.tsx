"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  baseId: string;
  hoveredValue: string | null;
  listRef: React.RefObject<HTMLDivElement | null>;
  setHoveredValue: (value: string | null) => void;
  setValue: (value: string) => void;
  triggerRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  value: string | undefined;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Tabs.`);
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

function getTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`;
}

function getContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`;
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

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

type TabsContentElement = React.ReactElement<TabsContentProps> & {
  ref?: React.Ref<HTMLDivElement>;
};

function isTabsContentElement(
  node: React.ReactNode
): node is React.ReactElement<TabsContentProps> {
  if (!React.isValidElement(node)) {
    return false;
  }

  const displayName =
    typeof node.type === "string"
      ? node.type
      : (node.type as { displayName?: string }).displayName;

  return displayName === "TabsContent";
}

function collectTabsContentElements(
  node: React.ReactNode
): TabsContentElement[] {
  const elements: TabsContentElement[] = [];

  const visit = (childNode: React.ReactNode) => {
    React.Children.forEach(childNode, (child) => {
      if (!React.isValidElement(child)) {
        return;
      }

      if (isTabsContentElement(child)) {
        elements.push(child as TabsContentElement);
        return;
      }

      const element = child as React.ReactElement<{
        children?: React.ReactNode;
      }>;

      if (element.props.children) {
        visit(element.props.children);
      }
    });
  };

  visit(node);
  return elements;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}

export function Tabs({
  children,
  className,
  defaultValue,
  onValueChange,
  value: valueProp,
  ...props
}: TabsProps) {
  const contentElements = React.useMemo(
    () => collectTabsContentElements(children),
    [children]
  );
  const firstContentValue = contentElements[0]?.props.value;
  const [value, setValue] = useControllableState<string | undefined>({
    defaultProp: defaultValue ?? firstContentValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) {
        onValueChange?.(nextValue);
      }
    },
    prop: valueProp,
  });
  const [hoveredValue, setHoveredValue] = React.useState<string | null>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>(
    {}
  );
  const baseId = React.useId();

  const activeContent =
    value === undefined
      ? contentElements[0]
      : contentElements.find((element) => element.props.value === value);

  const activeContentRef = activeContent?.ref;
  const {
    children: activeContentChildren,
    className: activeContentClassName,
    value: _activeContentValue,
    ...activePanelProps
  } = activeContent?.props ?? {};

  const contextValue = React.useMemo(
    () => ({
      baseId,
      hoveredValue,
      listRef,
      setHoveredValue,
      setValue: (nextValue: string) => setValue(nextValue),
      triggerRefs,
      value,
    }),
    [baseId, hoveredValue, setValue, value]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("w-full", className)} {...props}>
        {children}
        {activeContent ? (
          <div className="relative mt-10 overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                exit={{ filter: "blur(8px)", opacity: 0, y: -12 }}
                initial={{ filter: "blur(8px)", opacity: 0, y: 12 }}
                key={activeContent.props.value}
                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              >
                <div
                  {...activePanelProps}
                  aria-labelledby={getTriggerId(
                    baseId,
                    activeContent.props.value
                  )}
                  className={activeContentClassName}
                  id={getContentId(baseId, activeContent.props.value)}
                  ref={(node) => setRefValue(activeContentRef, node)}
                  role="tabpanel"
                >
                  {activeContentChildren}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, onMouseLeave, ...props }, ref) => {
    const { listRef, setHoveredValue, triggerRefs, value } =
      useTabsContext("TabsList");
    const [activeRect, setActiveRect] = React.useState({ left: 0, width: 0 });

    const measure = React.useCallback(
      (tabValue: string | null) => {
        if (!tabValue) {
          return null;
        }

        const element = triggerRefs.current[tabValue];
        const container = listRef.current;

        if (!(element && container)) {
          return null;
        }

        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return {
          left: elementRect.left - containerRect.left,
          width: elementRect.width,
        };
      },
      [listRef, triggerRefs]
    );

    React.useLayoutEffect(() => {
      const rect = measure(value ?? null);
      if (rect) {
        setActiveRect(rect);
      }
    }, [measure, value]);

    React.useLayoutEffect(() => {
      const updateRects = () => {
        setActiveRect(measure(value ?? null) ?? { left: 0, width: 0 });
      };

      updateRects();

      const container = listRef.current;
      if (!(container && typeof ResizeObserver !== "undefined")) {
        window.addEventListener("resize", updateRects);
        return () => window.removeEventListener("resize", updateRects);
      }

      const observer = new ResizeObserver(updateRects);
      observer.observe(container);

      return () => observer.disconnect();
    }, [listRef, measure, value]);

    return (
      <div
        {...props}
        aria-orientation="horizontal"
        className={cn(
          "relative inline-flex items-center border-border/50 border-b",
          className
        )}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);

          if (!event.defaultPrevented) {
            setHoveredValue(null);
          }
        }}
        ref={(node) => {
          listRef.current = node;
          setRefValue(ref, node);
        }}
        role="tablist"
      >
        {children}
        <motion.div
          animate={{ left: activeRect.left, width: activeRect.width }}
          aria-hidden
          className="pointer-events-none absolute -bottom-px h-[1.5px] bg-foreground"
          transition={{
            damping: 34,
            mass: 0.7,
            stiffness: 360,
            type: "spring",
          }}
        />
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(
  (
    {
      children,
      className,
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      onMouseEnter,
      style,
      value,
      ...props
    },
    ref
  ) => {
    const {
      baseId,
      hoveredValue,
      listRef,
      setHoveredValue,
      setValue,
      triggerRefs,
      value: activeValue,
    } = useTabsContext("TabsTrigger");
    const isActive = activeValue === value;
    const isHover = hoveredValue === value;

    const moveFocus = React.useCallback(
      (nextElement: HTMLButtonElement) => {
        nextElement.focus();
        const nextValue = nextElement.dataset.value;

        if (nextValue) {
          setHoveredValue(nextValue);
          setValue(nextValue);
        }
      },
      [setHoveredValue, setValue]
    );

    return (
      <button
        {...props}
        aria-controls={getContentId(baseId, value)}
        aria-selected={isActive}
        className={cn(
          "relative px-6 py-4 text-sm tracking-tight outline-none",
          className
        )}
        data-state={isActive ? "active" : "inactive"}
        data-value={value}
        id={getTriggerId(baseId, value)}
        onBlur={(event) => {
          onBlur?.(event);

          if (
            !(
              event.defaultPrevented ||
              listRef.current?.contains(event.relatedTarget as Node | null)
            )
          ) {
            setHoveredValue(null);
          }
        }}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            setValue(value);
          }
        }}
        onFocus={(event) => {
          onFocus?.(event);

          if (!event.defaultPrevented) {
            setHoveredValue(value);
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (event.defaultPrevented || !listRef.current) {
            return;
          }

          const triggers = Array.from(
            listRef.current.querySelectorAll<HTMLButtonElement>(
              '[role="tab"]:not([disabled])'
            )
          );
          const currentIndex = triggers.indexOf(event.currentTarget);

          if (currentIndex === -1) {
            return;
          }

          if (event.key === "Home") {
            event.preventDefault();
            moveFocus(triggers[0]);
            return;
          }

          if (event.key === "End") {
            event.preventDefault();
            const lastTrigger = triggers.at(-1);
            if (lastTrigger) {
              moveFocus(lastTrigger);
            }
            return;
          }

          if (
            event.key !== "ArrowRight" &&
            event.key !== "ArrowLeft" &&
            event.key !== "ArrowDown" &&
            event.key !== "ArrowUp"
          ) {
            return;
          }

          event.preventDefault();

          const direction =
            event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
          const nextIndex =
            (currentIndex + direction + triggers.length) % triggers.length;
          moveFocus(triggers[nextIndex]);
        }}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);

          if (!event.defaultPrevented) {
            setHoveredValue(value);
          }
        }}
        ref={(node) => {
          triggerRefs.current[value] = node;
          setRefValue(ref, node);
        }}
        role="tab"
        style={{
          ...style,
          color: isActive
            ? "var(--color-foreground)"
            : isHover
              ? "color-mix(in oklab, var(--color-foreground) 75%, transparent)"
              : "color-mix(in oklab, var(--color-foreground) 40%, transparent)",
          transition: "color 400ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        type="button"
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  (_props, _ref) => {
    useTabsContext("TabsContent");
    return null;
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs as tabs };
