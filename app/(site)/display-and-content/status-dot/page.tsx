"use client";

import { useState } from "react";

import { InlinePreviewSelect } from "@/app/(site)/components/_components/inline-preview-select";
import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { statusDotApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { statusDotPreviewCode } from "@/lib/component-v0-pages";
import { StatusDot, type StatusDotProps } from "@/registry/status-dot";

type StatusState = StatusDotProps["state"];

const stateOptions: { label: string; value: StatusState }[] = [
  { value: "QUEUED", label: "Queued" },
  { value: "BUILDING", label: "Building" },
  { value: "ERROR", label: "Error" },
  { value: "READY", label: "Ready" },
  { value: "CANCELED", label: "Canceled" },
];

const stateTail: Record<StatusState, string> = {
  QUEUED: "waiting in the deploy queue.",
  BUILDING: "actively building on main.",
  READY: "live for every region.",
  ERROR: "blocked after a failed build.",
  CANCELED: "stopped before rollout.",
};

const previewSentenceClassName =
  "flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const usageCode = `import { StatusDot } from "@/components/ui/status-dot";

export function StatusDotPreview() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-lg leading-snug dark:text-neutral-100">
      <span>Right now, production is</span>
      <span className="inline-flex translate-y-px items-center align-middle">
        <StatusDot state="READY" />
      </span>
      <span>live for every region.</span>
    </p>
  );
}`;

function StatusDotPreview() {
  const [state, setState] = useState<StatusState>("BUILDING");

  return (
    <div className="flex min-h-[260px] w-full items-center justify-center px-4 py-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className={previewSentenceClassName}>
          <span>Right now, production is</span>
          <span className="inline-flex translate-y-px items-center gap-1.5 align-middle">
            <StatusDot label="" state={state} />
            <InlinePreviewSelect
              ariaLabel="Status dot state"
              menuKey="status-dot-state-menu"
              onChange={setState}
              options={stateOptions}
              value={state}
            />
          </span>
          <span>{stateTail[state]}</span>
        </p>
      </div>
    </div>
  );
}

export default function StatusDotPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Display & Content" },
        { label: "Status Dot" },
      ]}
      componentName="status-dot"
      description="Rippling status dot with deployment states."
      details={statusDotApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/status-dot/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/status-dot"
      preview={<StatusDotPreview />}
      previewClassName="overflow-visible"
      previewCode={statusDotPreviewCode}
      previewDescription="Pick a deployment state inline and watch the pulsing dot and sentence ending update together."
      title="Status Dot"
      usageCode={usageCode}
      usageDescription="Pass a `state` preset for color and default copy, or override the label when you need custom deployment messaging."
      v0PageCode={statusDotPreviewCode}
    />
  );
}
