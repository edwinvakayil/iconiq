"use client";

import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  activationMode: "automatic" | "manual";
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

function isArrowNavigationKey(key: string) {
  return (
    key === "ArrowRight" ||
    key === "ArrowLeft" ||
    key === "ArrowDown" ||
    key === "ArrowUp"
  );
}

function isActivationKey(key: string) {
  return key === "Enter" || key === " ";
}

function getArrowDirection(key: string) {
  return key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
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

function useMeasure<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  { width: number; height: number },
] {
  const [element, setElement] = React.useState<T | null>(null);
  const [bounds, setBounds] = React.useState({ width: 0, height: 0 });

  const ref = React.useCallback((node: T | null) => {
    setElement(node);
  }, []);

  React.useEffect(() => {
    if (!(element && typeof ResizeObserver !== "undefined")) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setBounds((current) => {
        const next = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        };

        if (current.width === next.width && current.height === next.height) {
          return current;
        }

        return next;
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds];
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
  activationMode?: "automatic" | "manual";
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}

export function Tabs({
  activationMode = "manual",
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
  const contentValues = React.useMemo(
    () => contentElements.map((element) => element.props.value),
    [contentElements]
  );
  const contentValueSet = React.useMemo(
    () => new Set(contentValues),
    [contentValues]
  );
  const firstContentValue = contentValues[0];
  const [contentRef, contentBounds] = useMeasure<HTMLDivElement>();
  const [value, setValue] = useControllableState<string | undefined>({
    defaultProp:
      defaultValue === undefined || contentValueSet.has(defaultValue)
        ? (defaultValue ?? firstContentValue)
        : firstContentValue,
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
  const defaultValueWarningRef = React.useRef<string | undefined>(undefined);
  const valuePropWarningRef = React.useRef<string | undefined>(undefined);
  const hasMountedRef = React.useRef(false);
  const baseId = React.useId();
  const resolvedValue =
    value !== undefined && contentValueSet.has(value)
      ? value
      : firstContentValue;

  React.useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  React.useEffect(() => {
    if (
      valueProp === undefined &&
      resolvedValue !== undefined &&
      value !== resolvedValue
    ) {
      setValue(resolvedValue);
    }
  }, [resolvedValue, setValue, value, valueProp]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    if (
      defaultValue !== undefined &&
      !contentValueSet.has(defaultValue) &&
      defaultValueWarningRef.current !== defaultValue
    ) {
      defaultValueWarningRef.current = defaultValue;
      console.warn(
        `Tabs received a defaultValue of "${defaultValue}" that does not match any TabsContent. Falling back to "${firstContentValue ?? "undefined"}".`
      );
    }

    if (
      valueProp !== undefined &&
      !contentValueSet.has(valueProp) &&
      valuePropWarningRef.current !== valueProp
    ) {
      valuePropWarningRef.current = valueProp;
      console.warn(
        `Tabs received a value of "${valueProp}" that does not match any TabsContent. Falling back to "${firstContentValue ?? "undefined"}".`
      );
    }
  }, [contentValueSet, defaultValue, firstContentValue, valueProp]);

  const activeContent =
    resolvedValue === undefined
      ? contentElements[0]
      : contentElements.find(
          (element) => element.props.value === resolvedValue
        );

  const activeContentRef = activeContent?.ref;
  const {
    children: activeContentChildren,
    className: activeContentClassName,
    value: _activeContentValue,
    ...activePanelProps
  } = activeContent?.props ?? {};

  const contextValue = React.useMemo(
    () => ({
      activationMode,
      baseId,
      hoveredValue,
      listRef,
      setHoveredValue,
      setValue: (nextValue: string) => setValue(nextValue),
      triggerRefs,
      value: resolvedValue,
    }),
    [activationMode, baseId, hoveredValue, resolvedValue, setValue]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("w-full", className)} {...props}>
        {children}
        {activeContent ? (
          <div className="relative mt-10">
            <motion.div
              animate={{
                height:
                  contentBounds.height > 0 ? contentBounds.height : "auto",
              }}
              className="overflow-hidden"
              initial={false}
              transition={{
                damping: 30,
                mass: 0.9,
                stiffness: 260,
                type: "spring",
              }}
            >
              <div ref={contentRef}>
                <motion.div
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  className="w-full"
                  initial={
                    hasMountedRef.current
                      ? {
                          filter: "blur(7px)",
                          opacity: 0.72,
                          scale: 0.988,
                          y: 8,
                        }
                      : false
                  }
                  key={activeContent.props.value}
                  layout
                  style={{ willChange: "filter, opacity, transform" }}
                  transition={{
                    damping: 24,
                    mass: 0.85,
                    stiffness: 220,
                    type: "spring",
                    filter: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.18, ease: "easeOut" },
                  }}
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
              </div>
            </motion.div>
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
    const getTriggerElement = React.useCallback(
      (tabValue: string | null) => {
        if (!tabValue) {
          return null;
        }

        return triggerRefs.current[tabValue] ?? null;
      },
      [triggerRefs]
    );

    const measure = React.useCallback(
      (tabValue: string | null) => {
        if (!tabValue) {
          return null;
        }

        const element = getTriggerElement(tabValue);
        const container = listRef.current;

        if (!(element && container)) {
          return null;
        }

        return {
          left: element.offsetLeft,
          width: element.offsetWidth,
        };
      },
      [getTriggerElement, listRef]
    );

    React.useLayoutEffect(() => {
      const rect = measure(value ?? null);
      if (rect) {
        setActiveRect(rect);
      }
    }, [measure, value]);

    React.useLayoutEffect(() => {
      const updateRects = () => {
        setActiveRect((current) => {
          const next = measure(value ?? null) ?? { left: 0, width: 0 };

          if (current.left === next.left && current.width === next.width) {
            return current;
          }

          return next;
        });
      };

      updateRects();

      const container = listRef.current;
      const activeTrigger = getTriggerElement(value ?? null);

      window.addEventListener("resize", updateRects);

      if (typeof ResizeObserver === "undefined") {
        return () => window.removeEventListener("resize", updateRects);
      }

      const observer = new ResizeObserver(updateRects);

      if (container) {
        observer.observe(container);
      }

      if (activeTrigger) {
        observer.observe(activeTrigger);
      }

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updateRects);
      };
    }, [getTriggerElement, listRef, measure, value]);

    return (
      <div
        {...props}
        aria-orientation="horizontal"
        className={cn(
          "no-scrollbar relative isolate inline-flex max-w-full items-center overflow-x-auto overscroll-x-contain whitespace-nowrap after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:h-px after:bg-border/50 after:content-['']",
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
          className="pointer-events-none absolute bottom-0 z-10 h-px"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--color-foreground) 88%, black)",
          }}
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
      activationMode,
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
    const automaticActivation = activationMode === "automatic";

    const moveFocus = React.useCallback(
      (nextElement: HTMLButtonElement, activate: boolean) => {
        nextElement.focus();
        const nextValue = nextElement.dataset.value;

        if (nextValue) {
          setHoveredValue(nextValue);

          if (activate) {
            setValue(nextValue);
          }
        }
      },
      [setHoveredValue, setValue]
    );
    const getEnabledTriggers = React.useCallback(() => {
      if (!listRef.current) {
        return [];
      }

      return Array.from(
        listRef.current.querySelectorAll<HTMLButtonElement>(
          '[role="tab"]:not([disabled])'
        )
      );
    }, [listRef]);
    const focusBoundaryTrigger = React.useCallback(
      (key: string, triggers: HTMLButtonElement[]) => {
        if (key === "Home") {
          moveFocus(triggers[0], automaticActivation);
          return true;
        }

        if (key === "End") {
          const lastTrigger = triggers.at(-1);

          if (lastTrigger) {
            moveFocus(lastTrigger, automaticActivation);
          }

          return true;
        }

        return false;
      },
      [automaticActivation, moveFocus]
    );
    const handleTriggerKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        const triggers = getEnabledTriggers();
        const currentIndex = triggers.indexOf(event.currentTarget);

        if (currentIndex === -1) {
          return;
        }

        if (focusBoundaryTrigger(event.key, triggers)) {
          event.preventDefault();
          return;
        }

        if (isActivationKey(event.key)) {
          event.preventDefault();
          setValue(value);
          return;
        }

        if (!isArrowNavigationKey(event.key)) {
          return;
        }

        event.preventDefault();

        const nextIndex =
          (currentIndex + getArrowDirection(event.key) + triggers.length) %
          triggers.length;

        moveFocus(triggers[nextIndex], automaticActivation);
      },
      [
        automaticActivation,
        focusBoundaryTrigger,
        getEnabledTriggers,
        moveFocus,
        onKeyDown,
        setValue,
        value,
      ]
    );

    return (
      <button
        {...props}
        aria-controls={getContentId(baseId, value)}
        aria-selected={isActive}
        className={cn(
          "relative inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md px-6 py-4 text-sm tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset",
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
        onKeyDown={handleTriggerKeyDown}
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
          transition: "color 160ms cubic-bezier(0.32, 0.72, 0, 1)",
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
