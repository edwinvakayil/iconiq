"use client";

import { type ComponentType, useMemo, useState } from "react";

import { TogglePlaygroundProvider } from "@/app/(site)/buttons-and-actions/toggle/_components/toggle-playground";
import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { toggleApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseToggle from "@/registry/b-toggle";
import * as RadixToggle from "@/registry/r-toggle";

type ToggleModule = {
  Toggle: ComponentType<{
    "aria-label"?: string;
    className?: string;
    defaultPressed?: boolean;
    disabled?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    pressed?: boolean;
    size?: "default" | "lg" | "sm";
    variant?: "default" | "outline";
    children?: React.ReactNode;
  }>;
};

type ProviderConfig = {
  componentName: "b-toggle" | "r-toggle";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: ToggleModule;
  importPath: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Buttons & Actions" },
  { label: "Toggle" },
];

const usageCode = `"use client";

import { Bold } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/b-toggle";

export function TogglePreview() {
  const [bold, setBold] = useState(false);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
        <span>Ship the</span>
        <span
          className={
            bold
              ? "font-bold text-neutral-950 transition-[font-weight,color] duration-200 dark:text-neutral-50"
              : "text-neutral-800 transition-[font-weight,color] duration-200 dark:text-neutral-100"
          }
        >
          release notes
        </span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <Toggle
            aria-label="Toggle bold"
            className="size-8 min-h-8 min-w-8 shrink-0 px-2 py-2"
            onPressedChange={setBold}
            pressed={bold}
            size="sm"
            variant="outline"
          >
            <Bold className="size-4" />
          </Toggle>
        </span>
      </p>
    </div>
  );
}`;

function getDetails(provider: ProviderConfig): DetailItem[] {
  return toggleApiDetails.map((item) => {
    if (item.id === "toggle") {
      return {
        ...item,
        summary: `Two-state button with bouncy press feedback and a muted fill that pops in when pressed, layered over ${provider.libraryLabel} primitives.`,
      };
    }

    if (item.id === "toggle-motion") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on Base UI toggle primitives while preserving the same bouncy fill pop, icon snap, and press scale as the Radix version."
            : "Built on Radix toggle primitives while preserving the same bouncy fill pop, icon snap, and press scale as the Base UI version.",
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

export default function TogglePage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-toggle",
        dependencyLabel: "@base-ui/react, class-variance-authority, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI toggle with inline spring fill, sheen sweep, and press-scale motion in the same file.",
          "Uses Base UI toggle primitives under the same spring background, content lift, and press scale shell.",
        ],
        ui: BaseToggle,
        importPath: "@/components/ui/b-toggle",
      };
    }

    return {
      componentName: "r-toggle",
      dependencyLabel: "radix-ui, class-variance-authority, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix toggle with inline spring fill, sheen sweep, and press-scale motion in the same file.",
        "Uses Radix toggle primitives under the same spring background, content lift, and press scale shell.",
      ],
      ui: RadixToggle,
      importPath: "@/components/ui/r-toggle",
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <TogglePlaygroundProvider
      importPath={provider.importPath}
      Toggle={provider.ui.Toggle}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Two-state button for toolbar actions, filters, and formatting controls."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/buttons-and-actions/toggle/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="toggle"
          pageUrl="/buttons-and-actions/toggle"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewDescription="Pick a variant first, then switch patterns to see how default and outline behave inline, with labels, and when disabled."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Toggle"
          railNotes={[
            "Use the floating sliders button in the bottom-right of the preview to open settings.",
            "Variant stays selected while you switch between Inline, Labeled, and Disabled patterns.",
            "Pattern and variant changes update the preview and Usage code together.",
          ]}
          title="Toggle"
          usageCode={usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={usageCode}
        />
      )}
    </TogglePlaygroundProvider>
  );
}
