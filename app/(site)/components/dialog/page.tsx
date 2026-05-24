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
    reducedMotion?: boolean;
  }>;
  DialogClose: ComponentType<{
    asChild?: boolean;
    children: ReactNode;
  }>;
  DialogContent: ComponentType<{
    children: ReactNode;
    open?: boolean;
    reducedMotion?: boolean;
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
};

type ProviderConfig = {
  componentName: "b-dialog" | "r-dialog";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: DialogModule;
  usageCode: string;
};

const triggerButtonClassName =
  "inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2.5 font-medium text-[14px] text-background tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const cancelButtonClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-muted/55 px-4 py-2.5 font-medium text-[14px] text-muted-foreground tracking-[-0.01em] transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const actionButtonClassName =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-foreground px-4 py-2.5 font-medium text-[14px] text-background tracking-[-0.01em] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Dialog" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-dialog": `"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/b-dialog";

const triggerButtonClassName =
  "${triggerButtonClassName}";

const cancelButtonClassName =
  "${cancelButtonClassName}";

const actionButtonClassName =
  "${actionButtonClassName}";

export function DialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <button className={triggerButtonClassName} type="button">
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
          <DialogClose asChild>
            <button className={cancelButtonClassName} type="button">
              Cancel
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button className={actionButtonClassName} type="button">
              Continue
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  "r-dialog": `"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/r-dialog";

const triggerButtonClassName =
  "${triggerButtonClassName}";

const cancelButtonClassName =
  "${cancelButtonClassName}";

const actionButtonClassName =
  "${actionButtonClassName}";

export function DialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <button className={triggerButtonClassName} type="button">
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
          <DialogClose asChild>
            <button className={cancelButtonClassName} type="button">
              Cancel
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button className={actionButtonClassName} type="button">
              Continue
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
};

function DialogPreview({ ui }: { ui: DialogModule }) {
  const {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } = ui;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[18rem] items-center justify-center p-6">
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <button className={triggerButtonClassName} type="button">
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
            <DialogClose asChild>
              <button className={cancelButtonClassName} type="button">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button className={actionButtonClassName} type="button">
                Continue
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          {
            name: "reducedMotion",
            type: "boolean",
            description:
              "Turns the dialog onto its quieter motion path immediately while still respecting system-level reduced motion preferences.",
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
            name: "DialogContent",
            type: "Dialog popup props + { open?: boolean; reducedMotion?: boolean }",
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
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/dialog/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="dialog"
      pageUrl="/components/dialog"
      preview={<DialogPreview ui={provider.ui} />}
      title="Dialog"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
