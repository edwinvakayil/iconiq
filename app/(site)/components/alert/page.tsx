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
import { cn } from "@/lib/utils";
import {
  Alert,
  type AlertAppearance,
  AlertDescription,
  AlertTitle,
} from "@/registry/alert";

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

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm";

const usageCode = `import {
  Alert,
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
}

export function AlertCustomWidthDemo() {
  return (
    <Alert appearance="default" width={440}>
      <TriangleAlert />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Pass width for a custom max width instead of a preset size.
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
  const [appearance, setAppearance] = useState<AlertAppearance>("default");
  const { description, Icon, title } = appearanceContent[appearance];

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 py-6 sm:px-8 sm:py-8">
      <p className={previewSentenceClassName}>
        <span>Preview a</span>
        <fieldset
          aria-label="Alert appearance"
          className="m-0 inline-flex flex-wrap items-center gap-x-3 border-0 p-0"
        >
          {appearanceOptions.map((option) => {
            const isSelected = appearance === option.value;

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "border-0 bg-transparent p-0 text-[length:inherit] leading-[inherit] underline-offset-4 transition-colors hover:underline",
                  isSelected
                    ? "font-medium text-foreground"
                    : "font-light text-muted-foreground hover:text-foreground"
                )}
                key={option.value}
                onClick={() => setAppearance(option.value)}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </fieldset>
        <span>alert below.</span>
      </p>

      <Alert appearance={appearance} className="w-full">
        <Icon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
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
      description="Polished inline notices and toast updates for concise feedback."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/alert/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/alert"
      preview={<AlertPreview />}
      previewClassName="lg:col-span-8"
      previewCode={alertPreviewCode}
      previewDescription="Tap default, warning, or destructive inline in the sentence, then compare tone and copy in the alert below."
      title="Alert"
      usageCode={usageCode}
      usageDescription={
        'Start with the compound inline alert, then pass a position or variant="toast" when you need viewport placement, timed dismissal, and polite live announcements. Use size="sm" | "md" | "lg" | "xl" for preset widths, or width for a custom max width.'
      }
    />
  );
}
