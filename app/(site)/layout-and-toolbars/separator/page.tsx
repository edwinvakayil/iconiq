"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  generateSeparatorCode,
  SEPARATOR_DEFAULT_STATE,
  SeparatorPlaygroundProvider,
} from "@/app/(site)/layout-and-toolbars/separator/_components/separator-playground";
import { separatorApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import type {
  SeparatorSpacing,
  SeparatorTone,
  SeparatorVariant,
} from "@/registry/b-separator";
import * as BaseSeparator from "@/registry/b-separator";
import * as RadixSeparator from "@/registry/r-separator";

type SharedSeparatorProps = {
  className?: string;
  decorative?: boolean;
  inset?: boolean;
  orientation?: "horizontal" | "vertical";
  spacing?: SeparatorSpacing;
  tone?: SeparatorTone;
  variant?: SeparatorVariant;
};

type SeparatorModule = {
  Separator: ComponentType<SharedSeparatorProps>;
  SeparatorLabel: ComponentType<{
    children: React.ReactNode;
    className?: string;
    tone?: SeparatorTone;
    variant?: SeparatorVariant;
  }>;
};

type ProviderConfig = {
  componentName: "b-separator" | "r-separator";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: SeparatorModule;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Layout & Toolbars" },
  { label: "Separator" },
];

const IMPORT_PATHS = {
  base: "@/components/ui/b-separator",
  radix: "@/components/ui/r-separator",
} as const;

function getDetails(provider: ProviderConfig): DetailItem[] {
  return separatorApiDetails.map((item) => {
    if (item.id === "separator") {
      return {
        ...item,
        summary: `Horizontal or vertical separator with line, dashed, and dotted variants, tone and spacing controls, and an optional labeled layout layered over ${provider.libraryLabel} primitives.`,
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          ...(item.notes ?? []),
          ...provider.notes,
        ],
      };
    }

    if (item.id === "separator-label") {
      return item;
    }

    if (item.id === "separator-semantics") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on the Base UI Separator primitive. Base UI has no decorative prop, so decorative presentation is applied manually with role, aria-hidden, and aria-orientation."
            : "Built on the Radix Separator primitive. Pass decorative={false} when the divider should be announced by assistive technology.",
          ...(item.notes ?? []),
          provider.libraryLabel === "Base UI"
            ? "Base UI also supports the render prop for polymorphic composition."
            : undefined,
        ].filter((note): note is string => Boolean(note)),
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
        importPath: IMPORT_PATHS.base,
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI separator with the same orientation, decorative, tone, spacing, inset, variant, and SeparatorLabel API as the Radix version.",
          "Vertical separators stretch with self-stretch inside flex rows and keep a min-h-4 fallback when height is not set.",
        ],
        ui: BaseSeparator,
      };
    }

    return {
      componentName: "r-separator",
      dependencyLabel: "@radix-ui/react-separator",
      importPath: IMPORT_PATHS.radix,
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix separator with the same orientation, decorative, tone, spacing, inset, variant, and SeparatorLabel API as the Base UI version.",
        "Vertical separators stretch with self-stretch inside flex rows and keep a min-h-4 fallback when height is not set.",
      ],
      ui: RadixSeparator,
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  const usageCode = generateSeparatorCode(
    SEPARATOR_DEFAULT_STATE,
    provider.importPath
  );

  return (
    <SeparatorPlaygroundProvider
      importPath={provider.importPath}
      key={provider.componentName}
      SeparatorModule={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Divider for sections, rows, menus, and compact controls."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/layout-and-toolbars/separator/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="separator"
          pageUrl="/layout-and-toolbars/separator"
          preview={preview}
          previewClassName="min-h-[18rem]"
          previewDescription="Use the playground to switch orientation, variant, tone, spacing, inset, and labeled layouts."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Separator"
          railNotes={[
            "Variants: line, dashed, and dotted share the same dash rhythm across horizontal and vertical orientations.",
            "Vertical separators use self-stretch in flex layouts. Pass a height class when the parent does not define one.",
            "Use inset for menu/list dividers and spacing for section gutters without repeating margin classes.",
            "SeparatorLabel renders the common centered-caption pattern with two matching dividers.",
          ]}
          title="Separator"
          usageCode={usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={usageCode}
        />
      )}
    </SeparatorPlaygroundProvider>
  );
}
