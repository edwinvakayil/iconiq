"use client";

import { type ComponentType, useEffect, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { progressApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseProgress from "@/registry/b-progress";
import * as RadixProgress from "@/registry/r-progress";

type ProgressModule = {
  Progress: ComponentType<{
    ariaLabel?: string;
    className?: string;
    formatValue?: (value: number, percent: number) => string;
    getValueLabel?: (value: number, percent: number) => string;
    helper?: string;
    indeterminateLabel?: string;
    label?: string;
    max?: number;
    min?: number;
    showValue?: boolean;
    value?: number | null;
  }>;
};

type ProviderConfig = {
  componentName: "b-progress" | "r-progress";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: ProgressModule;
  usageCode: string;
  indeterminateUsageCode: string;
};

const progressFrames = [
  8, 14, 22, 31, 42, 55, 68, 80, 90, 96, 88, 76, 63, 49, 36, 25, 16, 10,
];

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

const indeterminateCodeByProvider: Record<
  ProviderConfig["componentName"],
  string
> = {
  "b-progress": `import { Progress } from "@/components/ui/b-progress";

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
  "r-progress": `import { Progress } from "@/components/ui/r-progress";

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
};

function ProgressPreview({ ui }: { ui: ProgressModule }) {
  const { Progress } = ui;
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % progressFrames.length);
    }, 340);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg">
      <Progress
        helper="Smooth width animation keeps the bar and inline readout aligned as work advances."
        label="Registry sync"
        value={progressFrames[frameIndex]}
      />
    </div>
  );
}

function IndeterminatePreview({ ui }: { ui: ProgressModule }) {
  const { Progress } = ui;

  return (
    <div className="w-full max-w-lg">
      <Progress
        helper="Use the indeterminate motion while the job is active but the final completion amount is still unknown."
        indeterminateLabel="Syncing"
        label="Deploy queue"
        value={null}
      />
    </div>
  );
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
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI progress bar with the same value, min, max, label, helper, indeterminate, and formatter API as the Radix version.",
          "Uses Base UI progress semantics under the same spring-smoothed track fill and restrained inline readout motion shell.",
        ],
        ui: BaseProgress,
        usageCode: usageCodeByProvider["b-progress"],
        indeterminateUsageCode: indeterminateCodeByProvider["b-progress"],
      };
    }

    return {
      componentName: "r-progress",
      dependencyLabel: "@radix-ui/react-progress, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix progress bar with the same value, min, max, label, helper, indeterminate, and formatter API as the Base UI version.",
        "Uses the Radix progress primitive under the same spring-smoothed track fill and restrained inline readout motion shell.",
      ],
      ui: RadixProgress,
      usageCode: usageCodeByProvider["r-progress"],
      indeterminateUsageCode: indeterminateCodeByProvider["r-progress"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);
  const examples = useMemo(
    () => [
      {
        title: "Indeterminate",
        preview: <IndeterminatePreview ui={provider.ui} />,
        code: provider.indeterminateUsageCode,
      },
    ],
    [provider]
  );

  return (
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
      preview={<ProgressPreview ui={provider.ui} />}
      title="Progress"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
