"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/radix-base-ui/_components/provider-switch";
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
  libraryLabel: string;
  notes: string[];
  ui: CollapsibleModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Collapsible" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-collapsible": `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/b-collapsible";

export function ReleaseNote() {
  return (
    <Collapsible className="w-full max-w-xl">
      <CollapsibleTrigger>What changed in this release?</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4">
          <p>
            This release focuses on reducing friction across setup, review, and
            team handoff.
          </p>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4 border-border/50 border-t pt-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Setup flow</p>
                <p>Workspace creation now takes three fewer steps.</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                3 steps saved
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-border/50 border-t pt-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Dashboard states</p>
                <p>Empty and loading states were reduced into one cleaner path.</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                Cleaner
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-border/50 border-t pt-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Approval handoff</p>
                <p>Frequent review flows now need fewer confirmation screens.</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                Faster review
              </span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}`,
  "r-collapsible": `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/r-collapsible";

export function ReleaseNote() {
  return (
    <Collapsible className="w-full max-w-xl">
      <CollapsibleTrigger>What changed in this release?</CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4">
          <p>
            This release focuses on reducing friction across setup, review, and
            team handoff.
          </p>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4 border-border/50 border-t pt-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Setup flow</p>
                <p>Workspace creation now takes three fewer steps.</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                3 steps saved
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-border/50 border-t pt-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Dashboard states</p>
                <p>Empty and loading states were reduced into one cleaner path.</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                Cleaner
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-border/50 border-t pt-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Approval handoff</p>
                <p>Frequent review flows now need fewer confirmation screens.</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                Faster review
              </span>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}`,
};

function CollapsiblePreview({ ui }: { ui: CollapsibleModule }) {
  const { Collapsible, CollapsibleContent, CollapsibleTrigger } = ui;

  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Collapsible className="w-full">
          <CollapsibleTrigger>What changed in this release?</CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4">
              <p>
                This release focuses on reducing friction across setup, review,
                and team handoff.
              </p>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4 border-border/50 border-t pt-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Setup flow</p>
                    <p>Workspace creation now takes three fewer steps.</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                    3 steps saved
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 border-border/50 border-t pt-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      Dashboard states
                    </p>
                    <p>
                      Empty and loading states were reduced into one cleaner
                      path.
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                    Cleaner
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 border-border/50 border-t pt-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      Approval handoff
                    </p>
                    <p>
                      Frequent review flows now need fewer confirmation screens.
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                    Faster review
                  </span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

export default function RadixBaseCollapsiblePage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-collapsible",
        dependencyLabel: "@base-ui/react, motion, lucide-react",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI collapsible with the same trigger and content API as the Radix version.",
          "Base UI supplies the root, trigger, and panel semantics while Motion drives the same height, icon, and copy transitions.",
          "The generated registry file is /r/b-collapsible.json.",
        ],
        ui: BaseCollapsible,
        usageCode: usageCodeByProvider["b-collapsible"],
      };
    }

    return {
      componentName: "r-collapsible",
      dependencyLabel: "@radix-ui/react-collapsible, motion, lucide-react",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix collapsible with the same trigger and content API as the Base UI version.",
        "Uses Motion-driven height expansion, chevron rotation, and inner copy easing on top of Radix content semantics.",
        "The generated registry file is /r/r-collapsible.json.",
      ],
      ui: RadixCollapsible,
      usageCode: usageCodeByProvider["r-collapsible"],
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
              "Merged onto the rounded card shell that wraps the trigger and content.",
          },
          {
            name: "reducedMotion",
            type: "boolean",
            description:
              "Forces the quieter motion path immediately while still respecting system-level reduced motion preferences.",
          },
        ],
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          ...provider.notes,
        ],
      },
      {
        id: "exports",
        title: "Exports",
        summary:
          "Both registry entries ship the same three-part composition so you can keep one collapsible structure while swapping the headless library below it.",
        fields: [
          {
            name: "CollapsibleTrigger",
            type: "ButtonHTMLAttributes<HTMLButtonElement>",
            description:
              "Pre-styled trigger button with the built-in chevron and motion-aware press and hover feedback.",
          },
          {
            name: "CollapsibleContent",
            type: "HTMLAttributes<HTMLDivElement>",
            description:
              "Animated content region with height expansion and an inner text wrapper that eases independently.",
          },
        ],
      },
    ],
    [provider]
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same collapsible API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/collapsible/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="collapsible"
      pageUrl="/radix-base-ui/collapsible"
      preview={<CollapsiblePreview ui={provider.ui} />}
      title="Collapsible"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
