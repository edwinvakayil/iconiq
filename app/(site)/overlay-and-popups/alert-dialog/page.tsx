"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  type AlertDialogModule,
  AlertDialogPlaygroundProvider,
  getAlertDialogDefaultUsageCode,
} from "@/app/(site)/overlay-and-popups/alert-dialog/_components/alert-dialog-playground";
import { alertDialogApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseAlertDialog from "@/registry/b-alert-dialog";
import * as RadixAlertDialog from "@/registry/r-alert-dialog";

type ProviderConfig = {
  componentName: "b-alert-dialog" | "r-alert-dialog";
  dependencyLabel: string;
  details: DetailItem[];
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: AlertDialogModule;
  usageCode: string;
};

const IMPORT_PATHS = {
  base: "@/components/ui/b-alert-dialog",
  radix: "@/components/ui/r-alert-dialog",
} as const;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Overlay & Popups" },
  { label: "Alert Dialog" },
];

export default function RadixBaseAlertDialogPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-alert-dialog",
        dependencyLabel: "@base-ui/react, @radix-ui/react-slot, motion",
        details: alertDialogApiDetails,
        importPath: IMPORT_PATHS.base,
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI alert dialog with asChild triggers and actions, controlled open state, action variants, and reduced-motion aware Motion transitions.",
          "Base UI owns focus and alertdialog semantics while the card waits for the exit animation before unmounting.",
          "The generated registry file is /r/b-alert-dialog.json.",
        ],
        ui: BaseAlertDialog as AlertDialogModule,
        usageCode: getAlertDialogDefaultUsageCode(IMPORT_PATHS.base),
      };
    }

    return {
      componentName: "r-alert-dialog",
      dependencyLabel: "@radix-ui/react-alert-dialog, motion",
      details: alertDialogApiDetails,
      importPath: IMPORT_PATHS.radix,
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix alert dialog with the same higher-level API as the Base UI version, including asChild, controlled content animation, and action variants.",
        "The animated surface now owns the primitive content semantics and forwarded ref, while the overlay receives the Radix props through asChild.",
        "The generated registry file is /r/r-alert-dialog.json.",
      ],
      ui: RadixAlertDialog as AlertDialogModule,
      usageCode: getAlertDialogDefaultUsageCode(IMPORT_PATHS.radix),
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () =>
      provider.details.map((detail) =>
        detail.id === "alert-dialog"
          ? {
              ...detail,
              notes: [
                `Current install target: ${provider.libraryLabel}.`,
                `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
                ...(detail.notes ?? []),
                ...provider.notes,
              ],
            }
          : detail
      ),
    [provider]
  );

  return (
    <AlertDialogPlaygroundProvider
      importPath={provider.importPath}
      key={provider.componentName}
      ui={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Confirmation dialog for destructive or high-stakes actions."
          details={details}
          detailsDescription="Compound parts cover custom triggers, controlled and uncontrolled state, destructive or default actions, async confirmation, media slots, and reduced-motion behavior."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/overlay-and-popups/alert-dialog/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="alert-dialog"
          pageUrl="/overlay-and-popups/alert-dialog"
          preview={preview}
          previewClassName="min-h-[320px]"
          previewDescription="Use the playground to switch destructive/default tone, controlled state, custom triggers, async close behavior, and the media slot."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Alert Dialog"
          railNotes={[
            "Use AlertDialogTrigger asChild when the trigger is already a design-system button or inline control.",
            'Use AlertDialogAction variant="default" for high-stakes but non-destructive confirmations.',
            "For async actions, pass closeOnClick={false}, keep the root controlled, and close it after the request succeeds.",
            "AlertDialogContent accepts open so controlled Radix and Base installs can keep exit animations in sync.",
          ]}
          title="Alert Dialog"
          usageCode={provider.usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </AlertDialogPlaygroundProvider>
  );
}
