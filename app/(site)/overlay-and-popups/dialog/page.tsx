"use client";

import { type ComponentType, type ReactNode, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseDialog from "@/registry/b-dialog";
import * as RadixDialog from "@/registry/r-dialog";

type DialogModule = {
  Dialog: ComponentType<{
    children: ReactNode;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
  }>;
  DialogAction: ComponentType<{
    children: ReactNode;
    className?: string;
  }>;
  DialogCancel: ComponentType<{
    children: ReactNode;
    className?: string;
  }>;
  DialogClose: ComponentType<{
    asChild?: boolean;
    children: ReactNode;
  }>;
  DialogContent: ComponentType<{
    children: ReactNode;
    open?: boolean;
  }>;
  DialogDescription: ComponentType<{
    children: ReactNode;
  }>;
  DialogFooter: ComponentType<{
    children: ReactNode;
  }>;
  DialogHeader: ComponentType<{
    children: ReactNode;
  }>;
  DialogTitle: ComponentType<{
    children: ReactNode;
  }>;
  DialogTrigger: ComponentType<{
    asChild?: boolean;
    children: ReactNode;
  }>;
  dialogThemeClassName: string;
  dialogTriggerClassName: string;
  dialogTriggerSmClassName: string;
};

type ProviderConfig = {
  componentName: "b-dialog" | "r-dialog";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: DialogModule;
  usageCode: string;
};

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-dialog": `"use client";

import { useState } from "react";
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  dialogTriggerClassName,
} from "@/components/ui/b-dialog";

export function DialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <button className={dialogTriggerClassName} type="button">
          Open dialog
        </button>
      </DialogTrigger>
      <DialogContent open={open}>
        <DialogHeader>
          <DialogTitle>Confirm publish</DialogTitle>
          <DialogDescription>
            This sends the draft live for everyone on the team. You can still
            roll back from history afterward.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel>Cancel</DialogCancel>
          <DialogAction>Continue</DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  "r-dialog": `"use client";

import { useState } from "react";
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  dialogTriggerClassName,
} from "@/components/ui/r-dialog";

export function DialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <button className={dialogTriggerClassName} type="button">
          Open dialog
        </button>
      </DialogTrigger>
      <DialogContent open={open}>
        <DialogHeader>
          <DialogTitle>Confirm publish</DialogTitle>
          <DialogDescription>
            This sends the draft live for everyone on the team. You can still
            roll back from history afterward.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel>Cancel</DialogCancel>
          <DialogAction>Continue</DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
};

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm";

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Overlay & Popups" },
  { label: "Dialog" },
];

function DialogPreview({ ui }: { ui: DialogModule }) {
  const {
    Dialog,
    DialogAction,
    DialogCancel,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    dialogThemeClassName,
    dialogTriggerSmClassName,
  } = ui;
  const [open, setOpen] = useState(false);

  return (
    <div className={dialogThemeClassName}>
      <div className="flex min-h-[18rem] items-center justify-center p-6">
        <Dialog onOpenChange={setOpen} open={open}>
          <p className={previewSentenceClassName}>
            <span>This goes live for the team.</span>
            <span>Tap</span>
            <DialogTrigger asChild>
              <button className={dialogTriggerSmClassName} type="button">
                Publish
              </button>
            </DialogTrigger>
            <span>to continue.</span>
          </p>
          <DialogContent open={open}>
            <DialogHeader>
              <DialogTitle>Confirm publish</DialogTitle>
              <DialogDescription>
                This sends the draft live for everyone on the team. You can
                still roll back from history afterward.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogCancel>Cancel</DialogCancel>
              <DialogAction>Continue</DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

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
          "Base UI owns the focus trap, dismissal, and portal lifecycle while the visible card uses the same dialog springs and the same modal styling direction as the alert dialog surface.",
          "The generated registry file is /r/b-dialog.json.",
        ],
        ui: BaseDialog,
        usageCode: usageCodeByProvider["b-dialog"],
      };
    }

    return {
      componentName: "r-dialog",
      dependencyLabel: "@radix-ui/react-dialog, motion, lucide-react",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix dialog with the same exported Dialog parts as the Base UI version.",
        "Uses the original dialog spring timing with the softer alert-dialog card styling, overlay blur, and updated surface treatment.",
        "The generated registry file is /r/r-dialog.json.",
      ],
      ui: RadixDialog,
      usageCode: usageCodeByProvider["r-dialog"],
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
              "Open and close controls. Both installs support asChild so you can turn custom buttons into trigger or dismiss elements without changing the outer API.",
          },
          {
            name: "DialogAction / DialogCancel",
            type: "ButtonHTMLAttributes<HTMLButtonElement>",
            description:
              "Styled footer buttons with squircle corners. Both close the dialog on click, matching the alert dialog action pattern.",
          },
          {
            name: "dialogTriggerClassName / dialogTriggerSmClassName",
            type: "string",
            description:
              "Exported trigger button class strings with squircle corners for custom asChild triggers.",
          },
          {
            name: "DialogContent",
            type: "Dialog popup props + { open?: boolean }",
            description:
              "Visible modal card wrapper. className is merged onto the animated surface, and the optional open prop can mirror the root state when you want explicit parity with the original dialog usage.",
          },
          {
            name: "DialogHeader / DialogFooter",
            type: "HTMLAttributes<HTMLDivElement>",
            description: "Layout helpers for the content body and action row.",
          },
          {
            name: "DialogTitle / DialogDescription",
            type: "Primitive text props",
            description:
              "Semantic title and description slots styled with the same modal treatment on both installs.",
          },
          {
            name: "DialogPortal",
            type: "Portal primitive",
            description:
              "Direct portal export for cases where you need to compose more advanced dialog structures manually.",
          },
        ],
        notes: [
          "Both installs render a built-in top-right close button inside DialogContent.",
          "The motion timing follows the original dialog component, while the card styling and overlay treatment follow the alert-dialog surface direction.",
        ],
      },
    ],
    [provider]
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Modal surface for focused tasks, forms, and decisions."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/overlay-and-popups/dialog/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="dialog"
      pageUrl="/overlay-and-popups/dialog"
      preview={<DialogPreview ui={provider.ui} />}
      previewDescription="Tap Publish in the sentence to open the confirmation dialog before sending a draft live."
      title="Dialog"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
