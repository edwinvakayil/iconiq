"use client";

import { type ComponentType, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { separatorApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/avatar";
import * as BaseSeparator from "@/registry/b-separator";
import { Badge } from "@/registry/badge";
import * as RadixSeparator from "@/registry/r-separator";

type SeparatorModule = {
  Separator: ComponentType<{
    className?: string;
    decorative?: boolean;
    orientation?: "horizontal" | "vertical";
    variant?: "line" | "dashed" | "dotted";
  }>;
};

type ProviderConfig = {
  componentName: "b-separator" | "r-separator";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: SeparatorModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Separator" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-separator": `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/b-separator";

const members = [
  { fallback: "MA", name: "Maya", src: "/assets/av1.png" },
  { fallback: "NO", name: "Noah", src: "/assets/av2.png" },
  { fallback: "AR", name: "Ari", src: "/assets/av3.png" },
];

export function SeparatorPreview() {
  return (
    <div className="w-full max-w-md space-y-5">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {members.map((member) => (
              <Avatar
                className="size-10 border-2 border-background"
                key={member.name}
              >
                <AvatarImage alt={member.name} src={member.src} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div>
            <h3 className="font-medium text-sm">Design sync</h3>
            <p className="text-muted-foreground text-sm">3 people active now</p>
          </div>
        </div>
        <Badge color="emerald" size="sm" variant="dot">
          Live
        </Badge>
      </div>

      <Separator />

      <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center text-sm">
        <div className="min-w-0 text-center">
          <p className="font-medium">12</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Tasks</p>
        </div>
        <Separator className="h-9" orientation="vertical" />
        <div className="min-w-0 text-center">
          <p className="font-medium">98%</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Ready</p>
        </div>
        <Separator className="h-9" orientation="vertical" />
        <div className="min-w-0 text-center">
          <p className="font-medium">4m</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Avg reply</p>
        </div>
      </div>

      <Separator variant="dotted" />

      <div className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Maya moved wireframes</span>
          <span className="font-medium">Now</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Noah resolved comments</span>
          <span className="font-medium">2m ago</span>
        </div>
      </div>
    </div>
  );
}`,
  "r-separator": `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/r-separator";

const members = [
  { fallback: "MA", name: "Maya", src: "/assets/av1.png" },
  { fallback: "NO", name: "Noah", src: "/assets/av2.png" },
  { fallback: "AR", name: "Ari", src: "/assets/av3.png" },
];

export function SeparatorPreview() {
  return (
    <div className="w-full max-w-md space-y-5">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {members.map((member) => (
              <Avatar
                className="size-10 border-2 border-background"
                key={member.name}
              >
                <AvatarImage alt={member.name} src={member.src} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div>
            <h3 className="font-medium text-sm">Design sync</h3>
            <p className="text-muted-foreground text-sm">3 people active now</p>
          </div>
        </div>
        <Badge color="emerald" size="sm" variant="dot">
          Live
        </Badge>
      </div>

      <Separator />

      <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center text-sm">
        <div className="min-w-0 text-center">
          <p className="font-medium">12</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Tasks</p>
        </div>
        <Separator className="h-9" orientation="vertical" />
        <div className="min-w-0 text-center">
          <p className="font-medium">98%</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Ready</p>
        </div>
        <Separator className="h-9" orientation="vertical" />
        <div className="min-w-0 text-center">
          <p className="font-medium">4m</p>
          <p className="whitespace-nowrap text-muted-foreground text-xs">Avg reply</p>
        </div>
      </div>

      <Separator variant="dotted" />

      <div className="grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Maya moved wireframes</span>
          <span className="font-medium">Now</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Noah resolved comments</span>
          <span className="font-medium">2m ago</span>
        </div>
      </div>
    </div>
  );
}`,
};

const previewMembers = [
  { name: "Maya", src: "/assets/av1.png" },
  { name: "Noah", src: "/assets/av2.png" },
  { name: "Ari", src: "/assets/av3.png" },
];

function SeparatorPreview({ ui }: { ui: SeparatorModule }) {
  const { Separator } = ui;

  return (
    <div className="flex min-h-[340px] w-full items-center justify-center p-6">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex shrink-0 -space-x-3">
              {previewMembers.map((member) => (
                <Avatar
                  className="size-10 border-2 border-background"
                  key={member.name}
                >
                  <AvatarImage alt={member.name} src={member.src} />
                  <AvatarFallback>
                    {member.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground text-sm">
                Design sync
              </h3>
              <p className="text-muted-foreground text-sm">
                3 people active now
              </p>
            </div>
          </div>
          <Badge className="shrink-0" color="emerald" size="sm" variant="dot">
            Live
          </Badge>
        </div>

        <Separator />

        <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center text-foreground text-sm">
          <div className="min-w-0 text-center">
            <p className="font-medium">12</p>
            <p className="whitespace-nowrap text-muted-foreground text-xs">
              Tasks
            </p>
          </div>
          <Separator className="h-9" orientation="vertical" />
          <div className="min-w-0 text-center">
            <p className="font-medium">98%</p>
            <p className="whitespace-nowrap text-muted-foreground text-xs">
              Ready
            </p>
          </div>
          <Separator className="h-9" orientation="vertical" />
          <div className="min-w-0 text-center">
            <p className="font-medium">4m</p>
            <p className="whitespace-nowrap text-muted-foreground text-xs">
              Avg reply
            </p>
          </div>
        </div>

        <Separator variant="dotted" />

        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Maya moved wireframes</span>
            <span className="font-medium text-foreground">Now</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              Noah resolved comments
            </span>
            <span className="font-medium text-foreground">2m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return separatorApiDetails.map((item) => {
    if (item.id === "separator") {
      return {
        ...item,
        summary: `Horizontal or vertical separator with the same Iconiq line, dashed, and dotted variants layered over ${provider.libraryLabel} primitives.`,
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          ...(item.notes ?? []),
          ...provider.notes,
        ],
      };
    }

    if (item.id === "separator-semantics") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on the Base UI Separator primitive while preserving the same decorative default and semantic opt-in as the Radix version."
            : "Built on the Radix Separator primitive while preserving the same decorative default and semantic opt-in as the Base UI version.",
          ...(item.notes ?? []),
        ],
      };
    }

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

    return item;
  });
}

export default function RadixBaseSeparatorPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-separator",
        dependencyLabel: "@base-ui/react",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI separator with the same orientation, decorative, className, and variant API as the Radix version.",
          "Uses Base UI separator semantics under the same Iconiq line, dashed, and dotted visual treatments.",
        ],
        ui: BaseSeparator,
        usageCode: usageCodeByProvider["b-separator"],
      };
    }

    return {
      componentName: "r-separator",
      dependencyLabel: "@radix-ui/react-separator",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix separator with the same orientation, decorative, className, and variant API as the Base UI version.",
        "Uses the Radix separator primitive under the same Iconiq line, dashed, and dotted visual treatments.",
      ],
      ui: RadixSeparator,
      usageCode: usageCodeByProvider["r-separator"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Visual divider for grouping adjacent sections, rows, and compact controls."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/separator/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="separator"
      pageUrl="/components/separator"
      preview={<SeparatorPreview ui={provider.ui} />}
      title="Separator"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
