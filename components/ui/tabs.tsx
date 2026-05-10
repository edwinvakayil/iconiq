"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      className={cn("flex flex-col gap-2", className)}
      data-slot="tabs"
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center gap-1 rounded-lg bg-muted/60 p-1 text-muted-foreground",
        className
      )}
      data-slot="tabs-list"
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      className={cn(
        "inline-flex h-7 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 font-medium text-foreground text-sm transition-[background-color,color,box-shadow] duration-150 dark:text-muted-foreground",
        "hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/15 dark:focus-visible:ring-foreground/20",
        "data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.08)] dark:data-[active]:bg-[#0B0B09] dark:data-[active]:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_18px_rgba(0,0,0,0.18)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
