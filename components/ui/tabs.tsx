"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type * as React from "react";
import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const TabsIdContext = createContext<string | null>(null);

function getTabTriggerId(tabsId: string, value: BaseTabs.Tab.Value) {
  return `${tabsId}-tab-${String(value)}`;
}

function getTabPanelId(tabsId: string, value: BaseTabs.Tab.Value) {
  return `${tabsId}-panel-${String(value)}`;
}

function Tabs({
  className,
  id,
  ...props
}: React.ComponentProps<typeof BaseTabs.Root> & { id?: string }) {
  return (
    <TabsIdContext.Provider value={id ?? null}>
      <BaseTabs.Root
        className={cn("flex flex-col gap-2", className)}
        data-slot="tabs"
        {...props}
      />
    </TabsIdContext.Provider>
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
  id,
  value,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab>) {
  const tabsId = useContext(TabsIdContext);
  const resolvedId =
    id ?? (tabsId !== null ? getTabTriggerId(tabsId, value) : undefined);

  return (
    <BaseTabs.Tab
      className={cn(
        "inline-flex h-7 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 font-medium text-foreground text-sm transition-[background-color,color] duration-150 dark:text-muted-foreground",
        "hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/15 dark:focus-visible:ring-foreground/20",
        "data-[active]:bg-neutral-200 data-[active]:text-foreground data-[active]:shadow-none dark:data-[active]:bg-neutral-800",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      data-slot="tabs-trigger"
      id={resolvedId}
      value={value}
      {...props}
    />
  );
}

function TabsContent({
  className,
  id,
  value,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  const tabsId = useContext(TabsIdContext);
  const resolvedId =
    id ?? (tabsId !== null ? getTabPanelId(tabsId, value) : undefined);

  return (
    <BaseTabs.Panel
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      id={resolvedId}
      value={value}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
