"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  type DialogModule,
  DialogPlaygroundProvider,
  getDialogDefaultUsageCode,
} from "@/app/(site)/overlay-and-popups/dialog/_components/dialog-playground";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseDialog from "@/registry/b-dialog";
import * as RadixDialog from "@/registry/r-dialog";

type ProviderConfig = {
  componentName: "b-dialog" | "r-dialog";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: DialogModule;
  usageCode: string;
};

const IMPORT_PATHS = {
  base: "@/components/ui/b-dialog",
  radix: "@/components/ui/r-dialog",
} as const;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Overlay & Popups" },
  { label: "Dialog" },
];

export default function RadixBaseDialogPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-dialog",
        dependencyLabel:
          "@base-ui/react, @radix-ui/react-slot, motion, lucide-react",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI dialog with the same exported Dialog parts as the Radix version.",
          "Base UI owns focus trap, dismissal, and portal lifecycle while the card waits for the exit animation before unmounting.",
          "Supports reduced motion, size variants, async actions, optional close button, and scrollable DialogBody.",
          "The generated registry file is /r/b-dialog.json.",
        ],
        ui: BaseDialog as DialogModule,
        usageCode: getDialogDefaultUsageCode(IMPORT_PATHS.base),
      };
    }

    return {
      componentName: "r-dialog",
      dependencyLabel: "@radix-ui/react-dialog, motion, lucide-react",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix dialog with the same higher-level API as the Base UI version.",
        "The animated surface owns the primitive content semantics and forwarded ref, while overlay and dismiss props flow through the Radix content primitive.",
        "Supports reduced motion, size variants, async actions, optional close button, and scrollable DialogBody.",
        "The generated registry file is /r/r-dialog.json.",
      ],
      ui: RadixDialog as DialogModule,
      usageCode: getDialogDefaultUsageCode(IMPORT_PATHS.radix),
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () => [
      {
        id: "dialog",
        title: "Dialog",
        summary:
          "Provider-switchable modal surface with the same exported Dialog parts on both Base UI and Radix UI.",
        fields: [
          {
            name: "open",
            type: "boolean",
            description:
              "Optional controlled open state for the dialog root when the parent owns visibility.",
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
            name: "modal",
            type: "boolean",
            description:
              "Forwarded to the underlying primitive root. Set to false for non-modal dialogs that should not trap focus.",
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
          "Both registry entries ship the same higher-level parts so you can keep one dialog composition style while swapping the headless library below it.",
        fields: [
          {
            name: "DialogTrigger / DialogClose",
            type: "ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }",
            description:
              "Open and close controls. DialogTrigger applies the default trigger styling automatically when asChild is false.",
          },
          {
            name: "DialogAction / DialogCancel",
            type: 'ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; closeOnClick?: boolean; variant?: "default" | "destructive" }',
            description:
              'Styled footer buttons with squircle corners. Use closeOnClick={false} for async submit flows and variant="destructive" for high-stakes actions.',
          },
          {
            name: "DialogContent",
            type: 'Primitive popup/content props + { showCloseButton?: boolean; size?: "sm" | "default" | "lg" | "full"; open?: boolean }',
            description:
              "Visible modal card wrapper. className merges onto the animated surface. showCloseButton defaults to true. size controls card width. open is optional and reads from context when omitted.",
          },
          {
            name: "DialogOverlay",
            type: "Overlay/backdrop primitive",
            description:
              "Standalone overlay export for advanced portal composition. DialogContent already renders the overlay internally.",
          },
          {
            name: "DialogHeader / DialogBody / DialogFooter / DialogMedia",
            type: "HTMLAttributes<HTMLDivElement>",
            description:
              "Layout helpers for title area, scrollable body, action row, and optional icon slot.",
          },
          {
            name: "DialogTitle / DialogDescription",
            type: "Primitive text props",
            description:
              "Semantic title and description slots styled with the same modal treatment on both installs.",
          },
        ],
        notes: [
          "DialogContent respects prefers-reduced-motion and uses safe-area-aware max height with internal scrolling.",
          "Radix installs forward onEscapeKeyDown, onPointerDownOutside, and related dismiss props through DialogContent.",
          "Base UI installs forward the equivalent popup props through DialogContent.",
        ],
      },
    ],
    [provider]
  );

  return (
    <DialogPlaygroundProvider
      importPath={
        selectedProvider === "base" ? IMPORT_PATHS.base : IMPORT_PATHS.radix
      }
      key={provider.componentName}
      ui={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Modal surface for focused tasks, forms, and decisions."
          details={details}
          detailsDescription="Compound parts cover custom triggers, controlled and uncontrolled state, destructive or default actions, async confirmation, size variants, optional close button, scrollable body, and reduced-motion behavior."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/overlay-and-popups/dialog/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="dialog"
          pageUrl="/overlay-and-popups/dialog"
          preview={preview}
          previewClassName="min-h-[18rem]"
          previewDescription="Use the playground to switch action tone, size, controlled state, custom triggers, async close behavior, close button visibility, and scrollable body."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Dialog"
          railNotes={[
            "Use DialogTrigger asChild when the trigger is already a design-system button or inline control.",
            "Omit open on DialogContent when the root already owns visibility — context keeps both installs in sync.",
            "Use DialogBody for long forms so the header and footer stay visible while the middle section scrolls.",
          ]}
          title="Dialog"
          usageCode={provider.usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </DialogPlaygroundProvider>
  );
}
