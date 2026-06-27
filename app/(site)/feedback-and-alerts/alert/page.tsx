"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { AlertPlaygroundProvider } from "@/app/(site)/feedback-and-alerts/alert/_components/alert-playground";
import { alertApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { alertPreviewCode } from "@/lib/component-v0-pages";
import * as AlertModule from "@/registry/alert";

const usageCode = `"use client";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export function AlertDemo() {
  return (
    <Alert appearance="warning">
      <TriangleAlert />
      <AlertTitle>Unsaved changes detected</AlertTitle>
      <AlertDescription>
        Save now or recent edits may be lost.
      </AlertDescription>
    </Alert>
  );
}`;

const alertExamples: VariantItem[] = [
  {
    title: "Dismissible inline",
    code: `"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function AlertDismissibleExample() {
  return (
    <Alert appearance="info" dismissible timeout={0}>
      <InfoIcon />
      <AlertTitle>Read-only mode</AlertTitle>
      <AlertDescription>
        Billing is locked until your workspace owner returns.
      </AlertDescription>
    </Alert>
  );
}`,
  },
  {
    title: "Action row",
    code: `"use client";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";

export function AlertActionExample() {
  return (
    <Alert appearance="destructive">
      <CircleAlert />
      <AlertTitle>Upload failed</AlertTitle>
      <AlertDescription>Try again in a moment.</AlertDescription>
      <AlertAction>
        <button className="font-medium text-sm underline-offset-4 hover:underline" type="button">
          Retry upload
        </button>
      </AlertAction>
    </Alert>
  );
}`,
  },
  {
    title: "Toast notification",
    code: `"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export function AlertToastExample() {
  const [toastKey, setToastKey] = useState(0);

  return (
    <button
      className="rounded-lg border border-border px-3 py-2 text-sm"
      onClick={() => setToastKey((current) => current + 1)}
      type="button"
    >
      Save changes
      {toastKey > 0 ? (
        <Alert
          appearance="success"
          key={toastKey}
          position="top-right"
          variant="toast"
        >
          <CheckCircle2Icon />
          <AlertTitle>Changes saved</AlertTitle>
          <AlertDescription>Your draft is synced.</AlertDescription>
        </Alert>
      ) : null}
    </button>
  );
}`,
  },
  {
    title: "Controlled visibility",
    code: `"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function AlertControlledExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-3">
      <button
        className="rounded-lg border border-border px-3 py-2 text-sm"
        onClick={() => setOpen(true)}
        type="button"
      >
        Show alert
      </button>
      <Alert
        dismissible
        onOpenChange={setOpen}
        open={open}
        timeout={0}
      >
        <AlertTitle>Invite sent</AlertTitle>
        <AlertDescription>We emailed the invite link.</AlertDescription>
      </Alert>
    </div>
  );
}`,
  },
  {
    title: "Custom width",
    code: `"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function AlertCustomWidthExample() {
  return (
    <Alert appearance="default" width={440}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Pass width for a custom max width instead of a preset size.
      </AlertDescription>
    </Alert>
  );
}`,
  },
];

const details = alertApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: motion, class-variance-authority.",
      "Install into components/ui/alert.tsx (or your preferred UI folder) so imports match the usage examples.",
      "The provider switch is shown for section consistency, but both Radix UI and Base UI options are disabled because Alert does not ship primitive-specific variants here.",
      "The generated registry file is /r/alert.json.",
    ],
    registryPath: "alert.json",
  };
});

export default function AlertPage() {
  return (
    <AlertPlaygroundProvider
      AlertModule={AlertModule}
      importPath="@/components/ui/alert"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Feedback & Alerts" },
            { label: "Alert" },
          ]}
          componentName="alert"
          description="Polished inline notices and toast updates for concise feedback."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/feedback-and-alerts/alert/page.tsx`}
          examples={alertExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="alert"
          pageUrl="/feedback-and-alerts/alert"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible lg:col-span-8"
          previewCode={alertPreviewCode}
          previewDescription="Tune appearance, inline vs toast behavior, dismissal, timeout, and action rows from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Alert"
          railNotes={[
            "Default compound inline alerts stay static; pass dismissible or switch to toast when you need a close button or timed dismissal.",
            "Use open and onOpenChange when parent state should control visibility instead of remounting with a new key.",
            "Toast alerts portal to document.body, stack per corner, and honor prefers-reduced-motion automatically.",
            "Press Escape while focused on a dismissible alert to close it without reaching for the button.",
            "Use AlertAction for follow-up buttons or links beneath the description.",
          ]}
          title="Alert"
          usageCode={usageCode}
          usageDescription={
            'Start with the compound inline alert, then pass variant="toast" or a position when you need viewport placement, timed dismissal, and polite live announcements. Use size presets or width for layout, and appearance="success" | "info" for semantic tones.'
          }
          v0PageCode={alertPreviewCode}
        />
      )}
    </AlertPlaygroundProvider>
  );
}
