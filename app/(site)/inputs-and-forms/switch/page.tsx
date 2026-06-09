"use client";

import { type ComponentType, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { switchApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseSwitch from "@/registry/b-switch";
import * as RadixSwitch from "@/registry/r-switch";

type SwitchModule = {
  Switch: ComponentType<{
    "aria-label"?: string;
    checked?: boolean;
    className?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    label?: string;
    labelSide?: "left" | "right";
    onCheckedChange?: (checked: boolean) => void;
  }>;
};

type ProviderConfig = {
  componentName: "b-switch" | "r-switch";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: SwitchModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Switch" },
];

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm";

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-switch": `"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/b-switch";

export function MotionSwitch() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm">
        <span>Turn motion on or off with</span>
        <span className="inline-flex translate-y-px align-middle">
          <Switch
            aria-label="Enable motion"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </span>
        <span>for this workspace.</span>
      </p>
    </div>
  );
}`,
  "r-switch": `"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/r-switch";

export function MotionSwitch() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm">
        <span>Turn motion on or off with</span>
        <span className="inline-flex translate-y-px align-middle">
          <Switch
            aria-label="Enable motion"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </span>
        <span>for this workspace.</span>
      </p>
    </div>
  );
}`,
};

function SwitchPreview({ ui }: { ui: SwitchModule }) {
  const { Switch } = ui;
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex min-h-[18rem] items-center justify-center px-4 py-6">
      <p className={previewSentenceClassName}>
        <span>Turn motion on or off with</span>
        <span className="inline-flex translate-y-px align-middle">
          <Switch
            aria-label="Enable motion"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </span>
        <span>for this workspace.</span>
      </p>
    </div>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return switchApiDetails.map((item) => {
    if (item.id === "switch") {
      return {
        ...item,
        summary: `Binary on or off control with the same Iconiq thumb travel, squash response, and foreground fill sweep layered over ${provider.libraryLabel} primitives.`,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Additional Base UI switch props such as id, name, value, form, required, readOnly, and inputRef are forwarded to the root control."
            : "Additional Radix switch props such as aria-label, name, value, required, and form are forwarded to the root control.",
          "If you provide label, the component keeps the same adjacent text button treatment as the core switch so the label still toggles the control.",
        ],
      };
    }

    if (item.id === "switch-motion") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on Base UI switch root and thumb primitives while preserving the same motion values for thumb travel, thumb squash, and track fill opacity as the core switch."
            : "Built on Radix switch root and thumb primitives while preserving the same motion values for thumb travel, thumb squash, and track fill opacity as the core switch.",
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

export default function RadixBaseSwitchPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-switch",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI switch with the same checked, defaultChecked, label, and labelSide API as the Radix version.",
          "Uses Base UI switch primitives under the exact same Iconiq track, thumb, and press-motion shell as the core switch component.",
        ],
        ui: BaseSwitch,
        usageCode: usageCodeByProvider["b-switch"],
      };
    }

    return {
      componentName: "r-switch",
      dependencyLabel: "@radix-ui/react-switch, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix switch with the same checked, defaultChecked, label, and labelSide API as the Base UI version.",
        "Uses Radix switch primitives under the exact same Iconiq track, thumb, and press-motion shell as the core switch component.",
      ],
      ui: RadixSwitch,
      usageCode: usageCodeByProvider["r-switch"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="On/off control for settings, preferences, and feature states."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/switch/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="switch"
      pageUrl="/inputs-and-forms/switch"
      preview={<SwitchPreview ui={provider.ui} />}
      previewDescription="Inline sentence with the motion switch embedded on one line."
      title="Switch"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
