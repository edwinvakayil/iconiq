"use client";

import { type ComponentType, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/radix-base-ui/_components/provider-switch";
import { tabsApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseTabs from "@/registry/b-tabs";
import * as RadixTabs from "@/registry/r-tabs";

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
    body: "Attach decks, mockups, and implementation references while preserving a clear transition between each content block.",
    detail:
      "Longer panel content stretches the container with a spring instead of snapping, which makes the active view feel anchored even when each tab has a different amount of information.",
    heading: "Shared assets",
    value: "files",
  },
] as const;

type TabsModule = {
  Tabs: ComponentType<{
    activationMode?: "automatic" | "manual";
    children: React.ReactNode;
    className?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    reducedMotion?: boolean;
    value?: string;
  }>;
  TabsContent: ComponentType<{
    children: React.ReactNode;
    className?: string;
    value: string;
  }>;
  TabsList: ComponentType<{
    children: React.ReactNode;
    className?: string;
  }>;
  TabsTrigger: ComponentType<{
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    value: string;
  }>;
};

type ProviderConfig = {
  componentName: "b-tabs" | "r-tabs";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: TabsModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Tabs" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-tabs": `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/b-tabs";

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
    body: "Attach decks, mockups, and implementation references while preserving a clear transition between each content block.",
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
}`,
  "r-tabs": `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/r-tabs";

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
    body: "Attach decks, mockups, and implementation references while preserving a clear transition between each content block.",
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
}`,
};

function TabsPreview({ ui }: { ui: TabsModule }) {
  const { Tabs, TabsContent, TabsList, TabsTrigger } = ui;

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

function getTabsListProviderNote(provider: ProviderConfig) {
  return provider.libraryLabel === "Base UI"
    ? "Uses Base UI tabs list under the same scrollable trigger rail and motion underline shell, with selection-on-focus controlled through activateOnFocus."
    : "Uses Radix tabs list under the same scrollable trigger rail and motion underline shell, with manual or automatic activation controlled through the Radix root.";
}

function getTabsTriggerProviderNote(provider: ProviderConfig) {
  return provider.libraryLabel === "Base UI"
    ? "Built on Base UI tab primitives while preserving the same trigger sizing, text-color interpolation, and underline coordination as the core tabs component."
    : "Built on Radix trigger primitives while preserving the same trigger sizing, text-color interpolation, and underline coordination as the core tabs component.";
}

function getTabsContentProviderNote(provider: ProviderConfig) {
  return provider.libraryLabel === "Base UI"
    ? "The root still collects declarative TabsContent children and renders the active Base UI panel through the same measured motion shell."
    : "The root still collects declarative TabsContent children and renders the active Radix content panel through the same measured motion shell.";
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  const providerNotes = {
    "tabs-content": getTabsContentProviderNote(provider),
    "tabs-list": getTabsListProviderNote(provider),
    "tabs-trigger": getTabsTriggerProviderNote(provider),
  } as const;

  return tabsApiDetails.map((item) => {
    const providerNote = providerNotes[item.id as keyof typeof providerNotes];

    if (item.id === "registry" || item.registryPath) {
      return {
        ...item,
        notes: [
          `Dependencies: ${provider.dependencyLabel}.`,
          ...provider.notes,
          `The generated registry file is /r/${provider.componentName}.json.`,
        ],
        registryPath: `${provider.componentName}.json`,
      };
    }

    if (item.id === "tabs") {
      return {
        ...item,
        summary: `Root wrapper for measured tabs with the same animated underline, panel sizing, and content transition shell layered over ${provider.libraryLabel} primitives.`,
      };
    }

    if (providerNote) {
      return {
        ...item,
        notes: [providerNote, ...(item.notes ?? [])],
      };
    }

    return item;
  });
}

export default function RadixBaseTabsPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-tabs",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI tabs set with the same root, list, trigger, and content API as the Radix version.",
          "Keeps the exact Iconiq measured underline, motion-smoothed panel sizing, and keyed content transition shell from the core tabs component.",
        ],
        ui: BaseTabs,
        usageCode: usageCodeByProvider["b-tabs"],
      };
    }

    return {
      componentName: "r-tabs",
      dependencyLabel: "@radix-ui/react-tabs, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix tabs set with the same root, list, trigger, and content API as the Base UI version.",
        "Keeps the exact Iconiq measured underline, motion-smoothed panel sizing, and keyed content transition shell from the core tabs component.",
      ],
      ui: RadixTabs,
      usageCode: usageCodeByProvider["r-tabs"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same tabs API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/tabs/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="tabs"
      pageUrl="/radix-base-ui/tabs"
      preview={<TabsPreview ui={provider.ui} />}
      title="Tabs"
      usageCode={provider.usageCode}
      usageDescription='Switch libraries above to update the install command, registry JSON, preview code, and generated file set together. Pass `activationMode="automatic"` when arrow keys should change tabs immediately.'
      v0PageCode={provider.usageCode}
    />
  );
}
