"use client";

import { tabsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/tabs";

const tabSections = [
  {
    body: "Keep the main summary visible while switching between planning, delivery, and support details without leaving the current surface.",
    heading: "Product workspace",
    value: "overview",
  },
  {
    body: "Review the last design review, implementation notes, and timeline updates in a compact panel that still feels grounded.",
    heading: "Recent handoff",
    value: "activity",
  },
  {
    body: "Attach decks, mockups, and implementation references while preserving a clear animated transition between each content block.",
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

export function WorkspaceTabs() {
  return (
    <Tabs className="w-full" defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <p className="text-sm text-muted-foreground">
          A concise summary for the current workspace.
        </p>
      </TabsContent>

      <TabsContent value="activity">
        <p className="text-sm text-muted-foreground">
          Recent updates, comments, and handoff notes.
        </p>
      </TabsContent>

      <TabsContent value="files">
        <p className="text-sm text-muted-foreground">
          Attached assets and supporting documents.
        </p>
      </TabsContent>
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
      description="Animated tabs with measured active and hover underlines, plus a blurred content transition for the active panel."
      details={tabsApiDetails}
      preview={<TabsPreview />}
      previewDescription="Switch between the three views to test the underline tracking, hover state, and content transition timing."
      title="Tabs"
      usageCode={usageCode}
      usageDescription="Use the shadcn-style root, list, trigger, and content primitives while keeping the same underline treatment and panel motion."
    />
  );
}
