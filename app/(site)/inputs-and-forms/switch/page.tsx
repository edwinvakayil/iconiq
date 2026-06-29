"use client";

import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { switchApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { LINK } from "@/constants";
import { useDocStore } from "@/hooks/use-doc-store";
import type { SwitchProps, SwitchSize } from "@/registry/b-switch";
import * as BaseSwitch from "@/registry/b-switch";
import * as RadixSwitch from "@/registry/r-switch";

type SwitchModule = {
  Switch: ComponentType<SwitchProps>;
};

type SwitchPattern = "default" | "disabled" | "invalid" | "readonly";

type SwitchPlaygroundState = {
  checked: boolean;
  labelSide: "left" | "right";
  pattern: SwitchPattern;
  required: boolean;
  showDescription: boolean;
  showLabel: boolean;
  size: SwitchSize;
};

type ProviderConfig = {
  componentName: "b-switch" | "r-switch";
  dependencyLabel: string;
  importPath: string;
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

const FIELD_LABEL = "Enable motion";
const FIELD_DESCRIPTION =
  "Turn animated transitions on or off for this workspace.";

const DEFAULT_PLAYGROUND_STATE: SwitchPlaygroundState = {
  checked: true,
  labelSide: "right",
  pattern: "default",
  required: false,
  showDescription: true,
  showLabel: true,
  size: "default",
};

const SIZE_OPTIONS: Array<{ label: string; value: SwitchSize }> = [
  { label: "Small", value: "sm" },
  { label: "Default", value: "default" },
  { label: "Large", value: "lg" },
];

const PATTERN_OPTIONS: Array<{ label: string; value: SwitchPattern }> = [
  { label: "Default", value: "default" },
  { label: "Disabled", value: "disabled" },
  { label: "Invalid", value: "invalid" },
  { label: "Read only", value: "readonly" },
];

const LABEL_SIDE_OPTIONS: Array<{ label: string; value: "left" | "right" }> = [
  { label: "Right", value: "right" },
  { label: "Left", value: "left" },
];

function formatSizeAttr(size: SwitchSize) {
  return size === "default" ? "" : `\n        size="${size}"`;
}

function formatOptionalFlags(state: SwitchPlaygroundState) {
  const flags: string[] = [];

  if (state.required) {
    flags.push("required");
  }

  if (state.pattern === "disabled") {
    flags.push("disabled");
  }

  if (state.pattern === "invalid") {
    flags.push("invalid");
  }

  if (state.pattern === "readonly") {
    flags.push("readOnly");
  }

  if (state.labelSide === "left") {
    flags.push('labelSide="left"');
  }

  if (flags.length === 0) {
    return "";
  }

  return `\n        ${flags.join("\n        ")}`;
}

function generateSwitchCode(state: SwitchPlaygroundState, importPath: string) {
  const labelBlock = state.showLabel ? `\n        label="${FIELD_LABEL}"` : "";
  const descriptionBlock = state.showDescription
    ? `\n        description="${FIELD_DESCRIPTION}"`
    : "";

  if (state.pattern === "disabled") {
    return `"use client";

import { Switch } from "${importPath}";

export function SwitchDisabledExample() {
  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Switch
        checked
        disabled
        id="motion-disabled"
        label="${FIELD_LABEL}"${formatSizeAttr(state.size)}
      />
    </div>
  );
}`;
  }

  if (state.pattern === "readonly") {
    return `"use client";

import { Switch } from "${importPath}";

export function SwitchReadOnlyExample() {
  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Switch
        checked
        id="motion-readonly"
        label="Motion enabled during onboarding"
        readOnly${formatSizeAttr(state.size)}
      />
    </div>
  );
}`;
  }

  return `"use client";

import { useState } from "react";
import { Switch } from "${importPath}";

export function SwitchPreview() {
  const [enabled, setEnabled] = useState(${state.checked ? "true" : "false"});

  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Switch
        checked={enabled}
        id="motion-enabled"
        onCheckedChange={setEnabled}${labelBlock}${descriptionBlock}${formatSizeAttr(state.size)}${formatOptionalFlags(state)}
      />
    </div>
  );
}`;
}

function getUsageCode(importPath: string) {
  return generateSwitchCode(DEFAULT_PLAYGROUND_STATE, importPath);
}

function SwitchPlaygroundPreview({
  Switch,
  state,
}: {
  Switch: ComponentType<SwitchProps>;
  state: SwitchPlaygroundState;
}) {
  const [checked, setChecked] = useState(state.checked);

  useEffect(() => {
    setChecked(state.checked);
  }, [state.checked]);

  const sharedProps = {
    id: "motion-playground",
    size: state.size,
  } satisfies Partial<SwitchProps>;

  if (state.pattern === "disabled") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <Switch {...sharedProps} checked disabled label={FIELD_LABEL} />
      </div>
    );
  }

  if (state.pattern === "readonly") {
    return (
      <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
        <Switch
          {...sharedProps}
          checked
          label="Motion enabled during onboarding"
          readOnly
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[14rem] w-full max-w-md items-center justify-center px-4 py-6">
      <Switch
        {...sharedProps}
        checked={checked}
        description={state.showDescription ? FIELD_DESCRIPTION : undefined}
        invalid={state.pattern === "invalid"}
        label={state.showLabel ? FIELD_LABEL : undefined}
        labelSide={state.labelSide}
        onCheckedChange={setChecked}
        required={state.required}
      />
    </div>
  );
}

function SwitchPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<SwitchPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: SwitchPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Switch"
    >
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {state.pattern === "default" || state.pattern === "invalid" ? (
        <>
          <DocsPlaygroundSelectField
            label="Label side"
            onChange={(labelSide) => onChange({ labelSide })}
            options={LABEL_SIDE_OPTIONS}
            value={state.labelSide}
          />
          <DocsPlaygroundToggleField
            checked={state.showLabel}
            label="Show label"
            onChange={(showLabel) => onChange({ showLabel })}
          />
          <DocsPlaygroundToggleField
            checked={state.showDescription}
            label="Show description"
            onChange={(showDescription) => onChange({ showDescription })}
          />
          <DocsPlaygroundToggleField
            checked={state.checked}
            label="Checked"
            onChange={(checked) => onChange({ checked })}
          />
          <DocsPlaygroundToggleField
            checked={state.required}
            label="Required"
            onChange={(required) => onChange({ required })}
          />
        </>
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type SwitchPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

function SwitchPlaygroundProvider({
  SwitchModule,
  importPath,
  children,
}: {
  SwitchModule: SwitchModule;
  importPath: string;
  children: (props: SwitchPlaygroundRenderProps) => ReactNode;
}) {
  const { Switch } = SwitchModule;
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<SwitchPlaygroundState>(
    DEFAULT_PLAYGROUND_STATE
  );

  const updateState = (next: Partial<SwitchPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_PLAYGROUND_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateSwitchCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <SwitchPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <SwitchPlaygroundPreview Switch={Switch} state={state} />,
    renderSettings,
  });
}

const switchExamples: VariantItem[] = [
  {
    title: "Inline",
    code: `"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/b-switch";

export function InlineSwitchExample() {
  const [enabled, setEnabled] = useState(true);

  return (
    <p className="flex flex-wrap items-center gap-x-2 text-muted-foreground text-sm">
      <span>Turn motion on or off with</span>
      <Switch
        aria-label="Enable motion"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <span>for this workspace.</span>
    </p>
  );
}`,
  },
  {
    title: "Form field",
    code: `"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/b-switch";

export function SwitchFormExample() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Switch
      checked={enabled}
      description="Animated transitions stay on until you turn them off."
      id="motion-enabled"
      label="Enable motion"
      name="motion-enabled"
      onCheckedChange={setEnabled}
      required
      value="on"
    />
  );
}`,
  },
  {
    title: "Read only",
    code: `"use client";

import { Switch } from "@/components/ui/b-switch";

export function SwitchReadOnlyExample() {
  return (
    <Switch
      checked
      description="This preference was locked during onboarding."
      id="motion-readonly"
      label="Motion enabled"
      readOnly
    />
  );
}`,
  },
];

function getDetails(provider: ProviderConfig): DetailItem[] {
  return switchApiDetails.map((item) => {
    if (item.id === "switch") {
      return {
        ...item,
        summary: `Binary on or off control with the same Iconiq thumb travel, squash response, and foreground fill sweep layered over ${provider.libraryLabel} primitives.`,
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
        importPath: "@/components/ui/b-switch",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI switch with the same label, description, size, validation, and readOnly API as the Radix version.",
          "Uses Base UI switch primitives under the exact same Iconiq track, thumb, and press-motion shell as the core switch component.",
        ],
        ui: BaseSwitch,
        usageCode: getUsageCode("@/components/ui/b-switch"),
      };
    }

    return {
      componentName: "r-switch",
      dependencyLabel: "@radix-ui/react-switch, motion",
      importPath: "@/components/ui/r-switch",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix switch with the same label, description, size, validation, and readOnly API as the Base UI version.",
        "Uses Radix switch primitives under the exact same Iconiq track, thumb, and press-motion shell as the core switch component.",
      ],
      ui: RadixSwitch,
      usageCode: getUsageCode("@/components/ui/r-switch"),
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <SwitchPlaygroundProvider
      importPath={provider.importPath}
      key={provider.componentName}
      SwitchModule={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="On/off control for settings, preferences, and feature states."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/switch/page.tsx`}
          examples={switchExamples}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="switch"
          pageUrl="/inputs-and-forms/switch"
          preview={preview}
          previewClassName="min-h-[14rem] lg:col-span-8"
          previewDescription="Tune size, label side, validation, disabled, and read-only states from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Switch"
          railNotes={[
            `Current install target: ${provider.libraryLabel}.`,
            "Label and description render beside the control inside a native label element when text is provided.",
            "Pass aria-label when the switch is used inline without visible label text.",
            "name, value, required, and form props forward to the hidden input for native form submission.",
            "Thumb travel, squash, and fill animations honor prefers-reduced-motion automatically.",
          ]}
          title="Switch"
          usageCode={provider.usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </SwitchPlaygroundProvider>
  );
}
