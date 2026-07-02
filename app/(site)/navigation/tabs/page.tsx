"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  getTabsDefaultUsageCode,
  type TabsModule,
  TabsPlaygroundProvider,
} from "@/app/(site)/navigation/tabs/_components/tabs-playground";
import { tabsApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseTabs from "@/registry/b-tabs";
import * as RadixTabs from "@/registry/tabs";

type ProviderConfig = {
  componentName: "b-tabs" | "tabs";
  dependencyLabel: string;
  details: DetailItem[];
  importPath: string;
  libraryLabel: string;
  notes: string[];
  supportsVariant: boolean;
  ui: TabsModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Navigation" },
  { label: "Tabs" },
];

const IMPORT_PATHS = {
  base: "@/components/ui/b-tabs",
  radix: "@/components/ui/tabs",
} as const;

export default function TabsPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-tabs",
        dependencyLabel: "@base-ui/react, motion",
        details: tabsApiDetails,
        importPath: IMPORT_PATHS.base,
        libraryLabel: "Base UI",
        notes: [
          "Installs the Base UI tabs entry with measured underline motion and animated panel shell.",
          "Uses the same compound Tabs, TabsList, TabsTrigger, and TabsContent names, with content panels hoisted by the root.",
          "The generated registry file is /r/b-tabs.json.",
        ],
        supportsVariant: false,
        ui: BaseTabs as TabsModule,
        usageCode: getTabsDefaultUsageCode(IMPORT_PATHS.base, false),
      };
    }

    return {
      componentName: "tabs",
      dependencyLabel: "@radix-ui/react-tabs, motion",
      details: tabsApiDetails,
      importPath: IMPORT_PATHS.radix,
      libraryLabel: "Radix UI",
      notes: [
        "Installs the Radix tabs entry with pill or underline variants, icon and badge triggers, and optional content motion.",
        "Falls back to the first TabsContent value when defaultValue or value does not match a panel.",
        "The generated registry file is /r/tabs.json. For the alternate underline-only Radix entry, see r-tabs.",
      ],
      supportsVariant: true,
      ui: RadixTabs as TabsModule,
      usageCode: getTabsDefaultUsageCode(IMPORT_PATHS.radix, true),
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () =>
      provider.details.map((detail) =>
        detail.id === "tabs"
          ? {
              ...detail,
              notes: [
                `Current install target: ${provider.libraryLabel}.`,
                `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
                ...(detail.notes ?? []),
                ...provider.notes,
              ],
            }
          : detail
      ),
    [provider]
  );

  return (
    <TabsPlaygroundProvider
      importPath={provider.importPath}
      key={provider.componentName}
      supportsVariant={provider.supportsVariant}
      ui={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Sectioned panels for switching between related views."
          details={details}
          detailsDescription="Compound parts cover pill and underline variants, controlled and uncontrolled state, icons, badges, overflow scrolling, orientation, activation mode, and optional content motion."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/navigation/tabs/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="tabs"
          pageUrl="/navigation/tabs"
          preview={preview}
          previewClassName="min-h-[320px]"
          previewDescription="Use the playground to switch variant, orientation, activation mode, controlled state, icons, badges, overflow tabs, and disabled triggers."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Tabs"
          railNotes={[
            "tabs is the Radix registry entry with pill and underline variants. b-tabs and r-tabs are alternate installs with a hoisted panel shell.",
            "Pass defaultValue for uncontrolled usage, or hold the active tab in React state with value and onValueChange.",
            "Use icon and badge on TabsTrigger for compact status rails. TabsList fullWidth stretches the trigger row across the container.",
            'Set activationMode="manual" when panels should change on Enter or Space instead of focus alone.',
          ]}
          title="Tabs"
          usageCode={provider.usageCode}
          usageDescription="Compose TabsList, TabsTrigger, and TabsContent inside the root. Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </TabsPlaygroundProvider>
  );
}
