"use client";

import { useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { tabsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/tabs";

const tabSections = [
  {
    body: "Keep the main summary visible while switching between planning, delivery, and support details without leaving the current surface.",
    detail:
      "The active pill slides between triggers with spring motion, so the selected tab stays visually anchored even when you jump back to a shorter panel.",
    heading: "Product workspace",
    value: "overview",
  },
  {
    body: "Review the last design review, implementation notes, and timeline updates in a compact panel that still feels grounded.",
    detail:
      "Radix handles keyboard navigation and focus management while the segmented list keeps each trigger easy to scan.",
    heading: "Recent handoff",
    value: "activity",
  },
  {
    body: "Attach decks, mockups, and implementation references while preserving a clear transition between each content block.",
    detail:
      "Each panel renders directly below the trigger row, so longer tab bodies stay separated from the navigation rail.",
    heading: "Shared assets",
    value: "files",
  },
] as const;

const usageCode = `"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const tabSections = [
  {
    body: "Keep the main summary visible while switching between planning, delivery, and support details without leaving the current surface.",
    detail:
      "The active pill slides between triggers with spring motion, so the selected tab stays visually anchored even when you jump back to a shorter panel.",
    heading: "Product workspace",
    value: "overview",
  },
  {
    body: "Review the last design review, implementation notes, and timeline updates in a compact panel that still feels grounded.",
    detail:
      "Radix handles keyboard navigation and focus management while the segmented list keeps each trigger easy to scan.",
    heading: "Recent handoff",
    value: "activity",
  },
  {
    body: "Attach decks, mockups, and implementation references while preserving a clear transition between each content block.",
    detail:
      "Each panel renders directly below the trigger row, so longer tab bodies stay separated from the navigation rail.",
    heading: "Shared assets",
    value: "files",
  },
] as const;

export function TabsPreview() {
  const [value, setValue] = useState("overview");

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>

      {tabSections.map((section) => (
        <TabsContent key={section.value} value={section.value}>
          <div className="space-y-3 p-4">
            <p className="text-[15px] font-medium tracking-[-0.02em] text-foreground">
              {section.heading}
            </p>
            <p className="text-[14px] leading-6 text-secondary">
              {section.body}
            </p>
            <p className="text-[14px] leading-6 text-secondary">
              {section.detail}
            </p>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}`;

function TabsPreview() {
  const [value, setValue] = useState("overview");

  return (
    <div className="flex min-h-[320px] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <Tabs onValueChange={setValue} value={value}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          {tabSections.map((section) => (
            <TabsContent key={section.value} value={section.value}>
              <div className="space-y-3 p-4">
                <p className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
                  {section.heading}
                </p>
                <p className="text-[14px] text-secondary leading-6">
                  {section.body}
                </p>
                <p className="text-[14px] text-secondary leading-6">
                  {section.detail}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default function TabsPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Navigation" },
        { label: "Tabs" },
      ]}
      componentName="tabs"
      description="Sectioned panels for switching between related views."
      details={tabsApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/navigation/tabs/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/navigation/tabs"
      preview={<TabsPreview />}
      previewCode={usageCode}
      title="Tabs"
      usageCode={usageCode}
      usageDescription="Pass `defaultValue` for uncontrolled usage, or hold the active tab in React state with `value` and `onValueChange`. Compose `TabsList`, `TabsTrigger`, and `TabsContent` inside the root."
      v0PageCode={usageCode}
    />
  );
}
