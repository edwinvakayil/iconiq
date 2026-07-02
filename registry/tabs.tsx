"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  MotionConfig,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import {
  Children,
  type ComponentPropsWithoutRef,
  createContext,
  type ElementRef,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const springTransition: Transition = {
  type: "spring",
  stiffness: 170,
  damping: 24,
  mass: 1.2,
};

const instantTransition: Transition = { duration: 0 };

const EMPTY_INDICATOR = { height: 0, left: 0, top: 0, width: 0 };

type TabsVariant = "pill" | "underline";
type TabsOrientation = "horizontal" | "vertical";

type IndicatorRect = typeof EMPTY_INDICATOR;

type TabsContextType = {
  animateContent: boolean;
  baseId: string;
  listRef: React.RefObject<HTMLDivElement | null>;
  orientation: TabsOrientation;
  reduceMotion: boolean;
  registerTrigger: (value: string, node: HTMLButtonElement | null) => void;
  transition: Transition;
  triggerRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  variant: TabsVariant;
  value: string;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabsContext(componentName: string) {
  const context = useContext(TabsContext);
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

function isTabsContentElement(
  node: ReactNode
): node is ReactElement<{ value?: string }> {
  if (!isValidElement(node)) {
    return false;
  }

  const displayName =
    typeof node.type === "string"
      ? node.type
      : (node.type as { displayName?: string }).displayName;

  return displayName === "TabsContent";
}

function collectTabsContentValues(node: ReactNode): string[] {
  const values: string[] = [];

  const visit = (childNode: ReactNode) => {
    Children.forEach(childNode, (child) => {
      if (!isValidElement(child)) {
        return;
      }

      if (
        isTabsContentElement(child) &&
        typeof child.props.value === "string"
      ) {
        values.push(child.props.value);
        return;
      }

      const element = child as ReactElement<{ children?: ReactNode }>;
      if (element.props.children) {
        visit(element.props.children);
      }
    });
  };

  visit(node);
  return values;
}

function resolveTabValue(
  candidate: string | undefined,
  contentValueSet: Set<string>,
  fallback: string
) {
  if (candidate !== undefined && contentValueSet.has(candidate)) {
    return candidate;
  }

  return fallback;
}

function getOffsetWithinAncestor(
  element: HTMLElement,
  ancestor: HTMLElement
): IndicatorRect {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = element;

  while (node && node !== ancestor) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.parentElement;
  }

  return {
    height: element.offsetHeight,
    left,
    top,
    width: element.offsetWidth,
  };
}

function measureIndicatorRect(
  listElement: HTMLDivElement | null,
  triggerElement: HTMLButtonElement | null
): IndicatorRect | null {
  if (!(listElement && triggerElement)) {
    return null;
  }

  if (!listElement.contains(triggerElement)) {
    return null;
  }

  const rect = getOffsetWithinAncestor(triggerElement, listElement);

  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  return rect;
}

function useTabIndicator({
  listRef,
  triggerRefs,
  value,
}: {
  listRef: React.RefObject<HTMLDivElement | null>;
  triggerRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  value: string;
}) {
  const [indicatorRect, setIndicatorRect] =
    useState<IndicatorRect>(EMPTY_INDICATOR);

  const getActiveTrigger = useCallback(() => {
    if (!value) {
      return null;
    }

    return triggerRefs.current[value] ?? null;
  }, [triggerRefs, value]);

  const updateIndicator = useCallback(() => {
    const nextRect = measureIndicatorRect(listRef.current, getActiveTrigger());

    if (!nextRect) {
      setIndicatorRect((current) =>
        current.width === 0 && current.height === 0 ? current : EMPTY_INDICATOR
      );
      return;
    }

    setIndicatorRect((current) => {
      if (
        current.left === nextRect.left &&
        current.top === nextRect.top &&
        current.width === nextRect.width &&
        current.height === nextRect.height
      ) {
        return current;
      }

      return nextRect;
    });
  }, [getActiveTrigger, listRef]);

  useLayoutEffect(() => {
    updateIndicator();

    const listElement = listRef.current;
    if (!listElement) {
      return;
    }

    const handleUpdate = () => {
      updateIndicator();
    };

    listElement.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate);

    if (typeof ResizeObserver === "undefined") {
      return () => {
        listElement.removeEventListener("scroll", handleUpdate);
        window.removeEventListener("resize", handleUpdate);
      };
    }

    const observer = new ResizeObserver(handleUpdate);
    observer.observe(listElement);

    const activeTrigger = getActiveTrigger();
    if (activeTrigger) {
      observer.observe(activeTrigger);
    }

    return () => {
      observer.disconnect();
      listElement.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [getActiveTrigger, listRef, updateIndicator]);

  return {
    indicatorRect,
    showIndicator: indicatorRect.width > 0 && indicatorRect.height > 0,
  };
}

type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
  animateContent?: boolean;
  variant?: TabsVariant;
};

function Tabs({
  animateContent = false,
  children,
  className,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  value: valueProp,
  variant = "pill",
  ...props
}: TabsProps) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reduceMotion = useReducedMotion() ?? false;
  const transition = reduceMotion ? instantTransition : springTransition;

  const contentValues = useMemo(
    () => collectTabsContentValues(children),
    [children]
  );
  const contentValueSet = useMemo(
    () => new Set(contentValues),
    [contentValues]
  );
  const firstContentValue = contentValues[0] ?? "";
  const hasPanels = contentValues.length > 0;

  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    resolveTabValue(defaultValue, contentValueSet, firstContentValue)
  );

  const isControlled = valueProp !== undefined;
  const rawValue = isControlled ? valueProp : uncontrolledValue;
  const value = resolveTabValue(rawValue, contentValueSet, firstContentValue);

  const defaultValueWarningRef = useRef<string | undefined>(undefined);
  const valuePropWarningRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!isControlled && value !== uncontrolledValue) {
      setUncontrolledValue(value);
    }
  }, [isControlled, uncontrolledValue, value]);

  useEffect(() => {
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
        `Tabs received a defaultValue of "${defaultValue}" that does not match any TabsContent. Falling back to "${firstContentValue || "undefined"}".`
      );
    }

    if (
      valueProp !== undefined &&
      !contentValueSet.has(valueProp) &&
      valuePropWarningRef.current !== valueProp
    ) {
      valuePropWarningRef.current = valueProp;
      console.warn(
        `Tabs received a value of "${valueProp}" that does not match any TabsContent. Falling back to "${firstContentValue || "undefined"}".`
      );
    }
  }, [contentValueSet, defaultValue, firstContentValue, valueProp]);

  const handleValueChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  const registerTrigger = useCallback(
    (triggerValue: string, node: HTMLButtonElement | null) => {
      if (node) {
        triggerRefs.current[triggerValue] = node;
        return;
      }

      delete triggerRefs.current[triggerValue];
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      animateContent,
      baseId,
      listRef,
      orientation,
      reduceMotion,
      registerTrigger,
      transition,
      triggerRefs,
      variant,
      value,
    }),
    [
      animateContent,
      baseId,
      orientation,
      reduceMotion,
      registerTrigger,
      transition,
      variant,
      value,
    ]
  );

  const rootClassName = cn(
    componentThemeClassName,
    "relative",
    orientation === "vertical" && "flex gap-4",
    className
  );

  if (!hasPanels) {
    return (
      <div className={rootClassName} data-slot="tabs">
        {children}
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      <TabsContext.Provider value={contextValue}>
        <TabsPrimitive.Root
          {...props}
          className={rootClassName}
          data-slot="tabs"
          onValueChange={handleValueChange}
          orientation={orientation}
          value={value}
        >
          {children}
        </TabsPrimitive.Root>
      </TabsContext.Provider>
    </MotionConfig>
  );
}

type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  fullWidth?: boolean;
};

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ children, className, fullWidth = false, loop = true, ...props }, ref) => {
  const { listRef, orientation, transition, triggerRefs, variant, value } =
    useTabsContext("TabsList");

  const { indicatorRect, showIndicator } = useTabIndicator({
    listRef,
    triggerRefs,
    value,
  });

  const isVertical = orientation === "vertical";

  return (
    <TabsPrimitive.List
      className={cn(
        "no-scrollbar relative isolate max-w-full gap-1",
        fullWidth ? "flex w-full" : "inline-flex w-fit",
        isVertical
          ? "flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain"
          : "flex-row overflow-x-auto overflow-y-hidden overscroll-x-contain",
        variant === "pill"
          ? "rounded-2xl bg-muted p-2"
          : "whitespace-nowrap px-1 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:h-px after:bg-border/50 after:content-['']",
        className
      )}
      data-slot="tabs-list"
      loop={loop}
      ref={(node) => {
        listRef.current = node;
        setRefValue(ref, node);
      }}
      {...props}
    >
      {children}
      {showIndicator ? (
        <motion.div
          animate={
            variant === "pill"
              ? {
                  height: indicatorRect.height,
                  left: indicatorRect.left,
                  top: indicatorRect.top,
                  width: indicatorRect.width,
                }
              : isVertical
                ? {
                    height: indicatorRect.height,
                    top: indicatorRect.top,
                  }
                : {
                    left: indicatorRect.left,
                    width: indicatorRect.width,
                  }
          }
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-0 bg-foreground",
            variant === "pill"
              ? "rounded-lg shadow-[rgba(0,0,0,0.04)_0px_1px_6px] dark:shadow-[rgba(0,0,0,0.2)_0px_1px_6px]"
              : isVertical
                ? "right-0 w-px"
                : "bottom-0 h-px"
          )}
          initial={false}
          key={`${variant}-${orientation}`}
          transition={transition}
        />
      ) : null}
    </TabsPrimitive.List>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

type TabsTriggerProps = ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> & {
  badge?: ReactNode;
  icon?: ReactNode;
};

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(
  (
    { badge, children, className, icon, value: triggerValue, ...props },
    ref
  ) => {
    const { baseId, orientation, registerTrigger, variant, value } =
      useTabsContext("TabsTrigger");
    const isActive = value === triggerValue;
    const isVertical = orientation === "vertical";

    return (
      <TabsPrimitive.Trigger
        aria-controls={getContentId(baseId, triggerValue)}
        className={cn(
          "relative z-10 inline-flex min-h-9 min-w-0 shrink-0 touch-manipulation items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 font-medium text-sm outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
          variant === "pill"
            ? cn(
                "text-muted-foreground hover:text-foreground",
                "data-[state=active]:text-background",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )
            : cn(
                "rounded-md px-4 py-3 tracking-tight",
                "text-muted-foreground hover:text-foreground",
                "data-[state=active]:text-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
              ),
          isVertical && "w-full justify-start",
          className
        )}
        data-slot="tabs-trigger"
        data-value={triggerValue}
        id={getTriggerId(baseId, triggerValue)}
        ref={(node) => {
          registerTrigger(triggerValue, node);
          setRefValue(ref, node);
        }}
        value={triggerValue}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden
            className="inline-flex shrink-0 items-center [&>svg]:size-4"
          >
            {icon}
          </span>
        ) : null}
        <span className="truncate">{children}</span>
        {badge ? (
          <span
            className={cn(
              "inline-flex min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 font-medium text-[10px] tabular-nums",
              isActive && variant === "pill"
                ? "bg-background/15 text-inherit"
                : "bg-muted text-muted-foreground"
            )}
          >
            {badge}
          </span>
        ) : null}
      </TabsPrimitive.Trigger>
    );
  }
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ children, className, value: contentValue, ...props }, ref) => {
  const {
    animateContent,
    baseId,
    orientation,
    reduceMotion,
    transition,
    value,
  } = useTabsContext("TabsContent");
  const isActive = value === contentValue;

  const body =
    animateContent && isActive && !reduceMotion ? (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 8 }}
        key={contentValue}
        transition={{
          ...transition,
          opacity: { duration: 0.18, ease: "easeOut" },
        }}
      >
        {children}
      </motion.div>
    ) : (
      children
    );

  return (
    <TabsPrimitive.Content
      className={cn(
        "relative outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        orientation === "vertical" ? "mt-0 min-w-0 flex-1" : "mt-2",
        className
      )}
      data-slot="tabs-content"
      id={getContentId(baseId, contentValue)}
      ref={ref}
      value={contentValue}
      {...props}
    >
      {body}
    </TabsPrimitive.Content>
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsProps,
  type TabsTriggerProps,
  type TabsVariant,
};
