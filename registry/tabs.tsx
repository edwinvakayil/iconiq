"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { MotionConfig, motion, type Transition } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ElementRef,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const transition: Transition = {
  type: "spring",
  stiffness: 170,
  damping: 24,
  mass: 1.2,
};

type TabsContextType = {
  layoutId: string;
  value: string;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within Tabs.");
  }
  return context;
}

type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

function Tabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const instanceId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? ""
  );
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  const handleValueChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  const contextValue = useMemo(
    () => ({
      layoutId: `${instanceId}-active-tab-pill`,
      value,
    }),
    [instanceId, value]
  );

  return (
    <MotionConfig transition={transition}>
      <TabsContext.Provider value={contextValue}>
        <TabsPrimitive.Root
          {...props}
          className={cn("relative", className)}
          onValueChange={handleValueChange}
          value={value}
        >
          {children}
        </TabsPrimitive.Root>
      </TabsContext.Provider>
    </MotionConfig>
  );
}

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    className={cn(
      "isolate inline-flex w-fit max-w-full items-center justify-start gap-1 overflow-hidden rounded-2xl bg-neutral-100 p-2 dark:bg-neutral-800",
      className
    )}
    ref={ref}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, value: triggerValue, ...props }, ref) => {
  const { layoutId, value } = useTabsContext();
  const isActive = value === triggerValue;

  return (
    <div className="relative flex shrink-0">
      {isActive ? (
        <motion.div
          className="absolute inset-0 rounded-lg bg-black shadow-[rgba(0,0,0,0.04)_0px_1px_6px] dark:bg-white dark:shadow-[rgba(0,0,0,0.2)_0px_1px_6px]"
          initial={false}
          layoutId={layoutId}
          style={{ borderRadius: 8 }}
          transition={transition}
        />
      ) : null}
      <TabsPrimitive.Trigger
        className={cn(
          "relative z-10 inline-flex min-w-0 items-center justify-center whitespace-nowrap rounded-lg bg-transparent px-3 py-1.5 font-medium text-sm text-white mix-blend-exclusion outline-none transition-opacity focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 hover:data-[state=inactive]:opacity-70",
          className
        )}
        ref={ref}
        value={triggerValue}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    </div>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    className={cn(
      "relative mt-2 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    ref={ref}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent, type TabsProps };
