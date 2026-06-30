"use client";

import { useMemo, useState } from "react";
import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  CollapsiblePlaygroundProvider,
  getCollapsibleDefaultUsageCode,
} from "@/app/(site)/layout-and-toolbars/collapsible/_components/collapsible-playground";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseCollapsible from "@/registry/b-collapsible";
import * as RadixCollapsible from "@/registry/r-collapsible";

type CollapsibleModule = typeof BaseCollapsible;

type ProviderConfig = {
  componentName: "b-collapsible" | "r-collapsible";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: CollapsibleModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Layout & Toolbars" },
  { label: "Collapsible" },
];

export default function RadixBaseCollapsiblePage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-collapsible",
        dependencyLabel: "@base-ui/react, motion, lucide-react",
        importPath: "@/components/ui/b-collapsible",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI collapsible with the same trigger and content API as the Radix version.",
          "Base UI supplies the root, trigger, and panel semantics while Motion drives height, icon, and copy transitions.",
          "The generated registry file is /r/b-collapsible.json.",
        ],
        ui: BaseCollapsible,
        usageCode: getCollapsibleDefaultUsageCode(
          "@/components/ui/b-collapsible"
        ),
      };
    }

    return {
      componentName: "r-collapsible",
      dependencyLabel: "@radix-ui/react-collapsible, motion, lucide-react",
      importPath: "@/components/ui/r-collapsible",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix collapsible with the same trigger and content API as the Base UI version.",
        "Uses Motion-driven height expansion, chevron rotation, and inner copy easing on top of Radix content semantics.",
        "The generated registry file is /r/r-collapsible.json.",
      ],
      ui: RadixCollapsible,
      usageCode: getCollapsibleDefaultUsageCode(
        "@/components/ui/r-collapsible"
      ),
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () => [
      {
        id: "collapsible",
        title: "Collapsible",
        summary:
          "Provider-switchable disclosure surface with the same root, trigger, and content API on Base UI and Radix UI.",
        fields: [
          {
            name: "open",
            type: "boolean",
            description:
              "Controlled open state for the root. Pass this when a parent needs to own expansion.",
          },
          {
            name: "defaultOpen",
            type: "boolean",
            defaultValue: "false",
            description:
              "Initial open state for uncontrolled usage. The component manages future toggles internally.",
          },
          {
            name: "onOpenChange",
            type: "(open: boolean) => void",
            description:
              "Called whenever the root opens or closes, regardless of which provider is installed underneath.",
          },
          {
            name: "disabled",
            type: "boolean",
            defaultValue: "false",
            description:
              "Disables the root and prevents trigger interaction on both providers.",
          },
          {
            name: "className",
            type: "string",
            description:
              "Merged onto the root shell that wraps the trigger and content.",
          },
        ],
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          "Use Accordion when you need multiple sections with shared open-state rules.",
          ...provider.notes,
        ],
      },
      {
        id: "collapsible-trigger",
        title: "CollapsibleTrigger",
        summary:
          "Pre-styled trigger button with a built-in chevron, press feedback, and optional composition.",
        fields: [
          {
            name: "asChild",
            type: "boolean",
            defaultValue: "false",
            description:
              "Merge trigger semantics onto a single child element instead of rendering the default button.",
          },
          {
            name: "showIcon",
            type: "boolean",
            defaultValue: "true",
            description:
              "Show the built-in indicator. Ignored when asChild is true.",
          },
          {
            name: "icon",
            type: "ReactNode",
            description: "Custom indicator node. Defaults to a chevron.",
          },
          {
            name: "iconPosition",
            type: '"start" | "end"',
            defaultValue: '"end"',
            description:
              "Indicator position when using the default trigger layout.",
          },
          {
            name: "className",
            type: "string",
            description: "Merged onto the trigger button.",
          },
        ],
      },
      {
        id: "collapsible-content",
        title: "CollapsibleContent",
        summary:
          "Animated content region with height expansion, prose-friendly defaults, and optional composition.",
        fields: [
          {
            name: "asChild",
            type: "boolean",
            defaultValue: "false",
            description:
              "Merge panel semantics onto a single child element instead of rendering animated wrappers.",
          },
          {
            name: "contentClassName",
            type: "string",
            description:
              "Classes for the inner content wrapper. Ignored when asChild is true.",
          },
          {
            name: "forceMount",
            type: "boolean",
            defaultValue: "true",
            description:
              "Keep content mounted while closed so exit animation can run. Set false for heavy panels you want removed from the DOM.",
          },
          {
            name: "className",
            type: "string",
            description: "Merged onto the animated outer shell.",
          },
        ],
        notes: [
          "Closed panels set aria-hidden and inert so focus cannot enter hidden content.",
          "Motion respects prefers-reduced-motion and falls back to opacity and height only.",
        ],
      },
    ],
    [provider]
  );

  return (
    <CollapsiblePlaygroundProvider
      importPath={provider.importPath}
      ui={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Simple disclosure for showing and hiding supporting content."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/layout-and-toolbars/collapsible/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="collapsible"
          pageUrl="/layout-and-toolbars/collapsible"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewDescription="Use the playground to switch controlled state, icon layout, and force mount while keeping the preview and Usage code in sync."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Collapsible"
          railNotes={[
            "Use the floating sliders button in the bottom-right of the preview to open settings.",
            "Controlled state and icon options update the preview and Usage code together.",
            "Switch libraries above to compare Base UI and Radix installs without changing the composition API.",
          ]}
          title="Collapsible"
          usageCode={provider.usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </CollapsiblePlaygroundProvider>
  );
}
