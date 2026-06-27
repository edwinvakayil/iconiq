"use client";

import { type ComponentType, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { ProgressPlaygroundProvider } from "@/app/(site)/display-and-content/progress/_components/progress-playground";
import { progressApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseProgress from "@/registry/b-progress";
import type { ProgressProps } from "@/registry/r-progress";
import * as RadixProgress from "@/registry/r-progress";

type ProgressModule = {
  Progress: ComponentType<ProgressProps>;
};

type ProviderConfig = {
  componentName: "b-progress" | "r-progress";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: ProgressModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Display & Content" },
  { label: "Progress" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-progress": `"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/b-progress";

const frames = [8, 14, 22, 31, 42, 55, 68, 80, 90, 96, 88, 76];

export function ProgressPreview() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, 340);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Progress
      className="w-full max-w-sm"
      helper="Smooth width animation keeps the bar and inline readout aligned as work advances."
      label="Registry sync"
      value={frames[frameIndex]}
    />
  );
}`,
  "r-progress": `"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/r-progress";

const frames = [8, 14, 22, 31, 42, 55, 68, 80, 90, 96, 88, 76];

export function ProgressPreview() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, 340);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Progress
      className="w-full max-w-sm"
      helper="Smooth width animation keeps the bar and inline readout aligned as work advances."
      label="Registry sync"
      value={frames[frameIndex]}
    />
  );
}`,
};

function getExamples(
  componentName: ProviderConfig["componentName"]
): VariantItem[] {
  const importPath = `@/components/ui/${componentName}`;

  return [
    {
      title: "Indeterminate",
      code: `import { Progress } from "${importPath}";

export function IndeterminateProgressPreview() {
  return (
    <Progress
      className="w-full max-w-sm"
      helper="Pass null when the exact completion amount is still unknown."
      indeterminateLabel="Syncing"
      label="Deploy queue"
      value={null}
    />
  );
}`,
    },
    {
      title: "Custom formatter",
      code: `import { Progress } from "${importPath}";

export function ProgressFormatterPreview() {
  return (
    <Progress
      className="w-full max-w-sm"
      formatValue={(value) => \`\${value} of 10 files\`}
      label="Asset upload"
      max={10}
      min={0}
      value={7}
    />
  );
}`,
    },
    {
      title: "Without value readout",
      code: `import { Progress } from "${importPath}";

export function ProgressMinimalPreview() {
  return (
    <Progress
      ariaLabel="Profile setup"
      className="w-full max-w-sm"
      showValue={false}
      value={42}
    />
  );
}`,
    },
    {
      title: "Tone and size",
      code: `import { Progress } from "${importPath}";

export function ProgressTonePreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress label="Deploy" size="sm" tone="brand" value={72} />
      <Progress label="Rollback" size="lg" tone="destructive" value={18} />
      <Progress label="Checks" tone="success" value={100} />
    </div>
  );
}`,
    },
    {
      title: "Circular",
      code: `import { Progress } from "${importPath}";

export function CircularProgressPreview() {
  return (
    <Progress
      helper="Ring layout keeps the readout centered inside the stroke."
      label="Storage"
      size="lg"
      tone="brand"
      value={68}
      variant="circular"
    />
  );
}`,
    },
  ];
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return progressApiDetails.map((item) => {
    if (item.id === "progress") {
      return {
        ...item,
        summary: `Spring-smoothed progress bar with the same Iconiq API layered over ${provider.libraryLabel} primitives.`,
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          ...(item.notes ?? []),
          ...provider.notes,
        ],
      };
    }

    if (item.id === "progress-motion") {
      return {
        ...item,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Built on Base UI Progress.Root, Progress.Track, and Progress.Indicator while the visible fill and inline value readout stay under the same minimal Motion shell as the Radix version."
            : "Built on Radix Progress.Root and Progress.Indicator while the visible fill and inline value readout stay under the same minimal Motion shell as the Base UI version.",
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

export default function RadixBaseProgressPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-progress",
        dependencyLabel: "@base-ui/react, motion",
        importPath: "@/components/ui/b-progress",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI progress bar with the same value, min, max, label, helper, indeterminate, and formatter API as the Radix version.",
          "Uses Base UI progress semantics under the same spring-smoothed track fill and restrained inline readout motion shell.",
        ],
        ui: BaseProgress,
        usageCode: usageCodeByProvider["b-progress"],
      };
    }

    return {
      componentName: "r-progress",
      dependencyLabel: "@radix-ui/react-progress, motion",
      importPath: "@/components/ui/r-progress",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix progress bar with the same value, min, max, label, helper, indeterminate, and formatter API as the Base UI version.",
        "Uses the Radix progress primitive under the same spring-smoothed track fill and restrained inline readout motion shell.",
      ],
      ui: RadixProgress,
      usageCode: usageCodeByProvider["r-progress"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);
  const examples = useMemo(
    () => getExamples(provider.componentName),
    [provider.componentName]
  );

  return (
    <ProgressPlaygroundProvider
      importPath={provider.importPath}
      key={provider.componentName}
      ProgressModule={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Determinate and indeterminate progress—with subtle motion."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/progress/page.tsx`}
          examples={examples}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="progress"
          pageUrl="/display-and-content/progress"
          preview={preview}
          previewDescription="Use the playground to switch variant, value, indeterminate mode, size, tone, label, helper, and value readout visibility."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Progress"
          railNotes={[
            "Pass `value={null}` when the job is active but the completion amount is still unknown.",
            'Set `variant="circular"` for ring layouts with the readout centered inside the stroke.',
            "Use `formatValue` for units, fractions, or file counts instead of a plain percentage.",
            "Set `showValue={false}` and `ariaLabel` for compact bars without a visible readout.",
            "Helper copy is announced through `aria-describedby` on both provider installs.",
          ]}
          title="Progress"
          usageCode={provider.usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </ProgressPlaygroundProvider>
  );
}
