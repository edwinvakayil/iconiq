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
      className={cn("inline-flex items-center justify-start gap-6", className)}
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
        "inline-flex cursor-pointer items-center justify-center whitespace-nowrap border-transparent border-b-2 pb-1.5 font-medium text-neutral-500 text-xs uppercase tracking-[0.12em] transition-colors duration-150 hover:text-neutral-900 aria-selected:border-neutral-900 aria-selected:text-neutral-950 dark:text-neutral-400 dark:aria-selected:border-white dark:aria-selected:text-white dark:hover:text-white",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
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
