"use client";

import { CheckCircle2Icon } from "lucide-react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { alertApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Alert, AlertDescription, AlertTitle } from "@/registry/alert";

const usageCode = `import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export function AlertDemo() {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>
          Your workspace has been updated. The latest version is now available
          to everyone on your team.
        </AlertDescription>
      </Alert>
    </div>
  );
}`;

const componentDetailsItems = alertApiDetails;

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
      details={componentDetailsItems}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/alert/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/alert"
      preview={
        <div className="grid w-full max-w-md items-start gap-4">
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle>Changes saved</AlertTitle>
            <AlertDescription>
              Your workspace has been updated. The latest version is now
              available to everyone on your team.
            </AlertDescription>
          </Alert>
        </div>
      }
      previewClassName="lg:col-span-8"
      title="Alert"
      usageCode={usageCode}
      usageDescription={
        'Use the compound parts for static inline alerts. Add variant="toast" or a position when you want viewport positioning, timed dismissal, and polite live announcements.'
      }
    />
  );
}
