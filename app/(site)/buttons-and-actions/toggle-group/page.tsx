"use client";

import { useMemo, useState } from "react";

import { ToggleGroupPlaygroundProvider } from "@/app/(site)/buttons-and-actions/toggle-group/_components/toggle-group-playground";
import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { toggleGroupApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { nodeToText } from "@/lib/node-to-text";
import * as BaseToggleGroup from "@/registry/b-togglegroup";
import * as RadixToggleGroup from "@/registry/r-togglegroup";

type ToggleGroupModule = typeof BaseToggleGroup | typeof RadixToggleGroup;

type ProviderConfig = {
  componentName: "b-togglegroup" | "r-togglegroup";
  dependencyLabel: string;
  importPath: string;
  library: "base" | "radix";
  libraryLabel: string;
  notes: string[];
  ui: ToggleGroupModule;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Buttons & Actions" },
  { label: "Toggle Group" },
];

const usageCode = `"use client";

import { Bold, Italic, Underline } from "lucide-react";
import { useState } from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/r-togglegroup";

const options = [
  { value: "bold", label: "Bold", icon: Bold },
  { value: "italic", label: "Italic", icon: Italic },
  { value: "underline", label: "Underline", icon: Underline },
] as const;

export function ToggleGroupPreview() {
  const [formats, setFormats] = useState<string[]>(["bold"]);

  return (
    <ToggleGroup
      aria-label="Text formatting"
      onValueChange={setFormats}
      type="multiple"
      value={formats}
      variant="outline"
    >
      {options.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem
          aria-label={label}
          className="size-8 min-h-8 min-w-8 shrink-0 px-0"
          key={value}
          value={value}
        >
          <Icon className="size-4" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}`;

function filterToggleGroupFields(
  fields: DetailItem["fields"],
  library: ProviderConfig["library"]
) {
  if (!fields) {
    return fields;
  }

  const hiddenField = library === "base" ? "type" : "multiple";

  return fields.filter((entry) => nodeToText(entry.name) !== hiddenField);
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return toggleGroupApiDetails.map((item) => {
    if (item.id === "toggle-group") {
      return {
        ...item,
        summary: `Root container for toggle buttons with shared variant, spacing, and orientation, layered over ${provider.libraryLabel} toggle-group primitives.`,
        fields: filterToggleGroupFields(item.fields, provider.library),
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Base UI uses multiple={true} by default and string array values for both single and multiple selection."
            : 'Radix uses type="multiple" by default with string arrays; pass type="single" for a string value.',
          ...(item.notes ?? []),
        ],
      };
    }

    if (item.id === "toggle-group-item") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Items render as Base UI toggle buttons with the same fluid wipe fill, sheen sweep, and icon press feedback as the standalone toggle."
            : "Items render as Radix toggle-group buttons with the same fluid wipe fill, sheen sweep, and icon press feedback as the standalone toggle.",
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

export default function ToggleGroupPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-togglegroup",
        dependencyLabel: "@base-ui/react, class-variance-authority, motion",
        importPath: "@/components/ui/b-togglegroup",
        library: "base",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI toggle group with inline spring fill, sheen sweep, and press-scale motion in the same file.",
          "Default spacing leaves a 4px gap between each bordered item.",
          "Pass spacing={0} for a connected outline shell with one outer border and internal dividers.",
        ],
        ui: BaseToggleGroup,
      };
    }

    return {
      componentName: "r-togglegroup",
      dependencyLabel: "radix-ui, class-variance-authority, motion",
      importPath: "@/components/ui/r-togglegroup",
      library: "radix",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix toggle group with inline spring fill, sheen sweep, and press-scale motion in the same file.",
        "Default spacing leaves a 4px gap between each bordered item.",
        "Pass spacing={0} for a connected outline shell with one outer border and internal dividers.",
      ],
      ui: RadixToggleGroup,
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ToggleGroupPlaygroundProvider
      importPath={provider.importPath}
      library={provider.library}
      ui={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Segmented toggle controls for toolbars, filters, and formatting actions."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/buttons-and-actions/toggle-group/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="toggle-group"
          pageUrl="/buttons-and-actions/toggle-group"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewDescription="Pick a pattern first, then switch variant, orientation, spacing, and selection mode to see how the group behaves in toolbars and labeled layouts."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Toggle Group"
          railNotes={[
            "Use the floating sliders button in the bottom-right of the preview to open settings.",
            "Pattern stays selected while you switch variant, orientation, spacing, and selection mode.",
            "Pattern and control changes update the preview and Usage code together.",
          ]}
          title="Toggle Group"
          usageCode={usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={usageCode}
        />
      )}
    </ToggleGroupPlaygroundProvider>
  );
}
