"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { motion } from "motion/react";
import * as React from "react";

import {
  ReducedMotionConfig,
  type ReducedMotionProp,
} from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

type TabsContextValue = {
  activationMode: "automatic" | "manual";
  baseId: string;
  hoveredValue: string | null;
  listRef: React.RefObject<HTMLDivElement | null>;
  setHoveredValue: (value: string | null) => void;
  triggerRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
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

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ReducedMotionProp {
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
  reducedMotion,
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
  const triggerRefs = React.useRef<Record<string, HTMLElement | null>>({});
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
      triggerRefs,
      value: resolvedValue,
    }),
    [activationMode, baseId, hoveredValue, resolvedValue]
  );

  return (
    <ReducedMotionConfig reducedMotion={reducedMotion}>
      <TabsPrimitive.Root
        onValueChange={(nextValue) => setValue(String(nextValue))}
        value={resolvedValue}
      >
        <TabsContext.Provider value={contextValue}>
          <div
            className={cn(componentThemeClassName, "w-full", className)}
            {...props}
          >
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
                      <TabsPrimitive.Panel
                        {...activePanelProps}
                        className={activeContentClassName}
                        id={getContentId(baseId, activeContent.props.value)}
                        ref={(node) => setRefValue(activeContentRef, node)}
                        value={activeContent.props.value}
                      >
                        {activeContentChildren}
                      </TabsPrimitive.Panel>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </div>
        </TabsContext.Provider>
      </TabsPrimitive.Root>
    </ReducedMotionConfig>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, onMouseLeave, ...props }, ref) => {
    const { activationMode, listRef, setHoveredValue, triggerRefs, value } =
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
      <TabsPrimitive.List
        {...props}
        activateOnFocus={activationMode === "automatic"}
        className={cn(
          "no-scrollbar relative isolate inline-flex max-w-full items-center overflow-x-auto overscroll-x-contain whitespace-nowrap after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:h-px after:bg-border/50 after:content-['']",
          className
        )}
        loopFocus
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
      </TabsPrimitive.List>
    );
  }
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLElement, TabsTriggerProps>(
  (
    {
      children,
      className,
      onBlur,
      onFocus,
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
      triggerRefs,
      value: activeValue,
    } = useTabsContext("TabsTrigger");
    const isActive = activeValue === value;
    const isHover = hoveredValue === value;

    return (
      <TabsPrimitive.Tab
        {...props}
        aria-controls={getContentId(baseId, value)}
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
        onFocus={(event) => {
          onFocus?.(event);

          if (!event.defaultPrevented) {
            setHoveredValue(value);
          }
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
        style={{
          ...style,
          color: isActive
            ? "var(--color-foreground)"
            : isHover
              ? "color-mix(in oklab, var(--color-foreground) 75%, transparent)"
              : "color-mix(in oklab, var(--color-foreground) 40%, transparent)",
          transition: "color 160ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        value={value}
      >
        <span className="relative z-10">{children}</span>
      </TabsPrimitive.Tab>
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
