"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseAlertDialog from "@/registry/b-alert-dialog";
import * as RadixAlertDialog from "@/registry/r-alert-dialog";

type AlertDialogModule = typeof BaseAlertDialog;

type ProviderConfig = {
  componentName: "b-alert-dialog" | "r-alert-dialog";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: AlertDialogModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Alert Dialog" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-alert-dialog": `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/b-alert-dialog";

export function DeleteCollectionAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Open dialog</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently remove the item from your workspace,
            and you will not be able to recover it later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
  "r-alert-dialog": `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/r-alert-dialog";

export function DeleteCollectionAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Open dialog</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently remove the item from your workspace,
            and you will not be able to recover it later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
};

function AlertDialogPreview({ ui }: { ui: AlertDialogModule }) {
  const {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } = ui;

  return (
    <div className="flex min-h-[18rem] items-center justify-center p-6">
      <AlertDialog>
        <AlertDialogTrigger>Open dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently remove the item from your workspace,
              and you will not be able to recover it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function RadixBaseAlertDialogPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-alert-dialog",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI alert dialog with the same trigger, content, action, and cancel surface as the Radix version.",
          "Base UI keeps the focus and alertdialog semantics while the visible card uses the same motion direction and pacing as the Radix install.",
          "The generated registry file is /r/b-alert-dialog.json.",
        ],
        ui: BaseAlertDialog,
        usageCode: usageCodeByProvider["b-alert-dialog"],
      };
    }

    return {
      componentName: "r-alert-dialog",
      dependencyLabel: "@radix-ui/react-alert-dialog, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix alert dialog with the same higher-level trigger, content, action, and cancel API as the Base UI version.",
        "Uses Motion-driven overlay fade, spring card entry, and staggered inner sections for the confirm flow.",
        "The generated registry file is /r/r-alert-dialog.json.",
      ],
      ui: RadixAlertDialog,
      usageCode: usageCodeByProvider["r-alert-dialog"],
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () => [
      {
        id: "alert-dialog",
        title: "AlertDialog",
        summary:
          "Provider-switchable destructive-confirmation surface with the same product-facing API on both Base UI and Radix UI.",
        fields: [
          {
            name: "open",
            type: "boolean",
            description: "Optional controlled open state for the dialog root.",
          },
          {
            name: "defaultOpen",
            type: "boolean",
            defaultValue: "false",
            description:
              "Uncontrolled initial state for the dialog root when you want the component to manage its own visibility.",
          },
          {
            name: "onOpenChange",
            type: "(open: boolean) => void",
            description:
              "Called whenever the open state changes, regardless of which provider is installed underneath.",
          },
          {
            name: "reducedMotion",
            type: "boolean",
            description:
              "Turns the dialog root onto its quieter motion path immediately while still respecting system-level reduced motion preferences.",
          },
        ],
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          ...provider.notes,
        ],
      },
      {
        id: "exports",
        title: "Exports",
        summary:
          "Both registry entries ship the same higher-level parts so you can keep one alert-dialog composition style while swapping the headless library below it.",
        fields: [
          {
            name: "AlertDialogTrigger",
            type: "ButtonHTMLAttributes<HTMLButtonElement>",
            description:
              "Default trigger button with the section’s rounded, motion-aware action styling baked in.",
          },
          {
            name: "AlertDialogContent",
            type: "HTMLAttributes<HTMLDivElement>",
            description:
              "Visible dialog card wrapper. className is merged onto the animated surface rather than the outer viewport container.",
          },
          {
            name: "AlertDialogTitle",
            type: "HTMLAttributes<HTMLHeadingElement>",
            description:
              "Heading slot linked to the dialog semantics on both providers.",
          },
          {
            name: "AlertDialogDescription",
            type: "HTMLAttributes<HTMLParagraphElement>",
            description:
              "Body copy slot for irreversible-action context and consequences.",
          },
          {
            name: "AlertDialogCancel / AlertDialogAction",
            type: "ButtonHTMLAttributes<HTMLButtonElement>",
            description:
              "Pre-styled action row buttons for the safe path and the destructive confirm path.",
          },
        ],
      },
    ],
    [provider]
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same alert dialog API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/alert-dialog/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="alert-dialog"
      pageUrl="/components/alert-dialog"
      preview={<AlertDialogPreview ui={provider.ui} />}
      title="Alert Dialog"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
