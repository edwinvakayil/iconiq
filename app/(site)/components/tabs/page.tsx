"use client";

import { tabsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/tabs";

const tabSections = [
  {
    body: "Keep the main summary visible while switching between planning, delivery, and support details without leaving the current surface.",
    detail:
      "The root now keeps the panel shell measured, so this shorter overview state still lands cleanly when you switch back from denser content.",
    heading: "Product workspace",
    value: "overview",
  },
  {
    body: "Review the last design review, implementation notes, and timeline updates in a compact panel that still feels grounded.",
    detail:
      "Arrow keys move focus across the triggers first, then Enter or Space commits the next panel. That makes quick keyboard scanning feel lighter while still keeping the content transition deliberate.",
    heading: "Recent handoff",
    value: "activity",
  },
  {
    body: "Attach decks, mockups, and implementation references while preserving a clear animated transition between each content block.",
    detail:
      "Longer panel content stretches the container with a spring instead of snapping, which makes the active view feel anchored even when each tab has a different amount of information.",
    heading: "Shared assets",
    value: "files",
  },
] as const;

const usageCode = `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const tabSections = [
  {
    body: "Keep the main summary visible while switching between planning, delivery, and support details without leaving the current surface.",
    detail:
      "The root now keeps the panel shell measured, so this shorter overview state still lands cleanly when you switch back from denser content.",
    heading: "Product workspace",
    value: "overview",
  },
  {
    body: "Review the last design review, implementation notes, and timeline updates in a compact panel that still feels grounded.",
    detail:
      "Arrow keys move focus across the triggers first, then Enter or Space commits the next panel. That makes quick keyboard scanning feel lighter while still keeping the content transition deliberate.",
    heading: "Recent handoff",
    value: "activity",
  },
  {
    body: "Attach decks, mockups, and implementation references while preserving a clear animated transition between each content block.",
    detail:
      "Longer panel content stretches the container with a spring instead of snapping, which makes the active view feel anchored even when each tab has a different amount of information.",
    heading: "Shared assets",
    value: "files",
  },
] as const;

export function TabsPreview() {
  return (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>

      {tabSections.map((section) => (
        <TabsContent key={section.value} value={section.value}>
          <div className="space-y-3">
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
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <Tabs className="w-full" defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          {tabSections.map((section) => (
            <TabsContent key={section.value} value={section.value}>
              <div className="space-y-3">
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
        { label: "Components" },
        { label: "Tabs" },
      ]}
      componentName="tabs"
      description="Segmented tabs with a measured active underline, spring-smoothed panel sizing, and softened content transitions."
      details={tabsApiDetails}
      preview={<TabsPreview />}
      previewDescription="Switch between the three views or use the keyboard to feel the measured underline, manual activation flow, and fluid panel resize."
      title="Tabs"
      usageCode={usageCode}
      usageDescription='Use the root, list, trigger, and content primitives for the default manual-activation pattern. Pass `activationMode="automatic"` when arrow keys should change tabs immediately.'
    />
  );
}
