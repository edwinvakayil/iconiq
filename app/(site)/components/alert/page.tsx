"use client";

import {
  CheckCircle2Icon,
  CircleAlert,
  type LucideIcon,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { alertApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { alertPreviewCode } from "@/lib/component-v0-pages";
import {
  Alert,
  type AlertAppearance,
  AlertDescription,
  type AlertPosition,
  AlertTitle,
} from "@/registry/alert";

const toastPositions: { value: AlertPosition; label: string }[] = [
  { value: "top-left", label: "Top left" },
  { value: "top-center", label: "Top center" },
  { value: "top-right", label: "Top right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-right", label: "Bottom right" },
];

const appearanceOptions: { value: AlertAppearance; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "warning", label: "Warning" },
  { value: "destructive", label: "Destructive" },
];

const appearanceContent: Record<
  AlertAppearance,
  { description: string; Icon: LucideIcon; title: string }
> = {
  default: {
    Icon: CheckCircle2Icon,
    title: "Changes saved",
    description: "The latest version is live for your team.",
  },
  warning: {
    Icon: TriangleAlert,
    title: "Unsaved changes detected",
    description: "Save now or recent edits may be lost.",
  },
  destructive: {
    Icon: CircleAlert,
    title: "Upload failed",
    description: "Try again in a moment.",
  },
};

const previewSelectClassName =
  "h-9 w-full rounded-md border border-border/80 bg-background px-2.5 text-[13px] text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const usageCode = `import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export function AlertDemo() {
  return (
    <Alert appearance="warning" className="max-w-[400px]">
      <TriangleAlert />
      <AlertTitle>Unsaved changes detected</AlertTitle>
      <AlertDescription>
        Save now or recent edits may be lost.
      </AlertDescription>
    </Alert>
  );
}`;

const details = alertApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: motion, class-variance-authority.",
      "This page lives in the Components section, but the install itself is the shared Iconiq alert primitive rather than a Radix UI or Base UI wrapper.",
      "The provider switch is shown for section consistency, but both Radix UI and Base UI options are disabled because Alert does not ship primitive-specific variants here.",
      "The generated registry file is /r/alert.json.",
    ],
    registryPath: "alert.json",
  };
});

function AlertPreview() {
  const [appearance, setAppearance] = useState<AlertAppearance>("warning");
  const [position, setPosition] = useState<AlertPosition>("top-right");
  const [showToast, setShowToast] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  const { description, Icon, title } = appearanceContent[appearance];

  const triggerToast = () => {
    setShowToast(true);
    setToastKey((current) => current + 1);
  };

  const handlePositionChange = (nextPosition: AlertPosition) => {
    setPosition(nextPosition);

    if (showToast) {
      setToastKey((current) => current + 1);
    }
  };

  return (
    <>
      <div className="grid w-full max-w-[400px] items-start gap-4">
        <Alert appearance={appearance}>
          <Icon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-[140px] flex-1 flex-col gap-1.5 text-[13px] text-secondary">
            <span>Appearance</span>
            <select
              className={previewSelectClassName}
              onChange={(event) =>
                setAppearance(event.target.value as AlertAppearance)
              }
              value={appearance}
            >
              {appearanceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-[140px] flex-1 flex-col gap-1.5 text-[13px] text-secondary">
            <span>Toast position</span>
            <select
              className={previewSelectClassName}
              onChange={(event) =>
                handlePositionChange(event.target.value as AlertPosition)
              }
              value={position}
            >
              {toastPositions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-border/80 bg-background px-3 font-medium text-[13px] text-foreground transition-colors hover:bg-muted/70"
            onClick={triggerToast}
            type="button"
          >
            Show toast
          </button>
        </div>
      </div>

      {showToast ? (
        <Alert
          appearance={appearance}
          key={toastKey}
          onDismiss={() => setShowToast(false)}
          position={position}
        >
          <Icon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
}

export default function RadixBaseAlertPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Alert" },
      ]}
      componentName="alert"
      description="Compact inline notices and viewport toasts with motion, dismiss controls, and default, warning, or destructive tones."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/alert/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/alert"
      preview={<AlertPreview />}
      previewClassName="lg:col-span-8"
      previewCode={alertPreviewCode}
      previewDescription="Switch between default, warning, and destructive tones, then trigger a toast to compare placement, auto-dismiss, and the close control."
      title="Alert"
      usageCode={usageCode}
      usageDescription={
        'Start with the compound inline alert, then pass a position or variant="toast" when you need viewport placement, timed dismissal, and polite live announcements. Use appearance="warning" or appearance="destructive" for caution and error feedback.'
      }
    />
  );
}
