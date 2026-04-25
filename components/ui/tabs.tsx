"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type * as React from "react";

import { cn } from "@/lib/utils";

type TabsProps = React.ComponentProps<typeof BaseTabs.Root>;

const Tabs = ({ className, ...props }: TabsProps) => {
  return (
    <BaseTabs.Root
      className={cn("flex flex-col", className)}
      data-slot="tabs"
      {...props}
    />
  );
};

type TabsListProps = React.ComponentProps<typeof BaseTabs.List>;

const TabsList = ({ className, children, ...props }: TabsListProps) => {
  return (
    <BaseTabs.List
      className={cn(
        "inline-flex items-center justify-start gap-3 border-border border-b pb-2",
        className
      )}
      data-slot="tabs-list"
      {...props}
    >
      {children}
    </BaseTabs.List>
  );
};

type TabsTriggerProps = React.ComponentProps<typeof BaseTabs.Tab>;

const TabsTrigger = ({ className, ...props }: TabsTriggerProps) => {
  return (
    <BaseTabs.Tab
      className={cn(
        "inline-flex cursor-pointer items-center justify-center whitespace-nowrap border-transparent border-b pb-0.5 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em] transition-colors duration-150 hover:text-foreground aria-selected:border-foreground aria-selected:text-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 dark:focus-visible:ring-foreground/30",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
};

const TabsContent = (props: React.ComponentProps<typeof BaseTabs.Panel>) => {
  return <BaseTabs.Panel data-slot="tabs-content" {...props} />;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
