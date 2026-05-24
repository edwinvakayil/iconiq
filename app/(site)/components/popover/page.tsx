"use client";

import { Bell, BellRing } from "lucide-react";
import { type ComponentType, type ReactNode, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { popoverApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BasePopover from "@/registry/b-popover";
import * as RadixPopover from "@/registry/r-popover";

type PopoverModule = {
  Popover: ComponentType<{
    children: ReactNode;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    reducedMotion?: boolean;
  }>;
  PopoverContent: ComponentType<{
    children: ReactNode;
    className?: string;
    open?: boolean;
  }>;
  PopoverTrigger: ComponentType<{
    asChild?: boolean;
    children: ReactNode;
    className?: string;
  }>;
};

type ProviderConfig = {
  componentName: "b-popover" | "r-popover";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: PopoverModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Popover" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-popover": `"use client";

import { Bell, BellRing } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/b-popover";

export function PopoverPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button
            aria-label="Open popover"
            className="inline-flex size-12 items-center justify-center text-foreground transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:hover:text-neutral-300"
            type="button"
          >
            <Bell className="size-4.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px]">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                <BellRing className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="text-[15px] font-medium text-foreground">
                  Release reminder
                </p>
                <p className="text-[13px] leading-5 text-secondary">
                  Design review · 20 min
                </p>
              </div>
            </div>
            <p className="text-[14px] leading-6 text-secondary">
              Final pass on motion, copy, and interaction polish is still open
              before the build moves to sign-off.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
  "r-popover": `"use client";

import { Bell, BellRing } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/r-popover";

export function PopoverPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button
            aria-label="Open popover"
            className="inline-flex size-12 items-center justify-center text-foreground transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:hover:text-neutral-300"
            type="button"
          >
            <Bell className="size-4.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px]">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                <BellRing className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="text-[15px] font-medium text-foreground">
                  Release reminder
                </p>
                <p className="text-[13px] leading-5 text-secondary">
                  Design review · 20 min
                </p>
              </div>
            </div>
            <p className="text-[14px] leading-6 text-secondary">
              Final pass on motion, copy, and interaction polish is still open
              before the build moves to sign-off.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}`,
};

function PopoverPreview({ ui }: { ui: PopoverModule }) {
  const { Popover, PopoverContent, PopoverTrigger } = ui;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-5 px-4 py-10">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button
            aria-label="Open popover"
            className="inline-flex size-12 items-center justify-center text-foreground transition-colors hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:hover:text-neutral-300"
            type="button"
          >
            <Bell className="size-4.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px]">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                <BellRing className="size-4" />
              </span>
              <div className="space-y-1">
                <p className="font-medium text-[15px] text-foreground">
                  Release reminder
                </p>
                <p className="text-[13px] text-secondary leading-5">
                  Design review · 20 min
                </p>
              </div>
            </div>
            <p className="text-[14px] text-secondary leading-6">
              Final pass on motion, copy, and interaction polish is still open
              before the build moves to sign-off.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <p className="max-w-sm text-center text-[13px] text-secondary leading-6">
        Open the popover to compare the same surface, state model, and motion on
        different headless primitives.
      </p>
    </div>
  );
}

function getPopoverRootNotes(provider: ProviderConfig) {
  return [
    provider.libraryLabel === "Base UI"
      ? "Wraps Base UI Popover.Root and keeps the resolved open state in local context so PopoverContent can own presence and exit timing."
      : "Wraps Radix Popover.Root and keeps the resolved open state in local context so PopoverContent can infer presence automatically.",
    "Controlled and uncontrolled usage are both supported.",
  ];
}

function getPopoverTriggerNotes(provider: ProviderConfig) {
  return [
    provider.libraryLabel === "Base UI"
      ? "PopoverTrigger is backed by Base UI Popover.Trigger, while PopoverAnchor is a thin local anchor wrapper that feeds the Base UI positioner when you want placement to follow a different node."
      : "PopoverTrigger is a light wrapper around the Radix trigger with a larger default hit area when not using asChild, while PopoverAnchor remains the Radix positioning anchor.",
    "Both exports still accept the remaining interactive props for event handling and accessibility wiring.",
  ];
}

function getPopoverContentDetail(item: DetailItem, provider: ProviderConfig) {
  return {
    ...item,
    summary:
      provider.libraryLabel === "Base UI"
        ? "Animated content wrapper built on Base UI Popover.Positioner and Popover.Popup."
        : item.summary,
    notes: [
      provider.libraryLabel === "Base UI"
        ? "Remaining placement props are forwarded through to the Base UI positioner and popup primitives, including side, collision padding, and focus behavior."
        : "Remaining Radix content props are forwarded through to PopoverPrimitive.Content, including side, collisionPadding, onEscapeKeyDown, and accessibility props.",
      provider.libraryLabel === "Base UI"
        ? "The panel uses the Base UI transform-origin CSS variable, keeps the same side-aware spring motion as the core popover, and delays primitive unmount until the close animation completes."
        : "The component always renders inside a Radix portal, reads the resolved placement for direction-aware motion, and uses the Radix transform-origin CSS variable so scaling stays anchored to the trigger.",
      "Content size changes animate while the popover is open, so progressive disclosure and copy swaps do not snap abruptly.",
      "Entry and exit animation are owned internally, so Motion-specific props such as initial, animate, exit, and transition are not part of the public prop surface.",
    ],
  };
}

function getPopoverRegistryDetail(item: DetailItem, provider: ProviderConfig) {
  return {
    ...item,
    notes: [
      `Dependencies: ${provider.dependencyLabel}.`,
      ...provider.notes,
      `The generated registry file is /r/${provider.componentName}.json.`,
    ],
    registryPath: `${provider.componentName}.json`,
  };
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return popoverApiDetails.map((item) => {
    if (item.id === "popover-root") {
      return {
        ...item,
        notes: getPopoverRootNotes(provider),
      };
    }

    if (item.id === "popover-trigger") {
      return {
        ...item,
        notes: getPopoverTriggerNotes(provider),
      };
    }

    if (item.id === "popover-content") {
      return getPopoverContentDetail(item, provider);
    }

    if (item.id === "registry" || item.registryPath) {
      return getPopoverRegistryDetail(item, provider);
    }

    return item;
  });
}

export default function RadixBasePopoverPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-popover",
        dependencyLabel: "@base-ui/react, motion",
        libraryLabel: "Base UI",
        notes: [
          "Uses Base UI popover primitives for root, trigger, positioner, portal, and popup ownership.",
          "Preserves the same side-aware panel motion and size-aware content animation as the core popover.",
        ],
        ui: BasePopover,
        usageCode: usageCodeByProvider["b-popover"],
      };
    }

    return {
      componentName: "r-popover",
      dependencyLabel: "@radix-ui/react-popover, motion",
      libraryLabel: "Radix UI",
      notes: [
        "Uses the dedicated Radix Popover primitive for root, trigger, anchor, content, and portal ownership.",
        "Preserves the same side-aware panel motion and size-aware content animation as the core popover.",
      ],
      ui: RadixPopover,
      usageCode: usageCodeByProvider["r-popover"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Floating surface for compact context and secondary actions."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/popover/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="popover"
      pageUrl="/components/popover"
      preview={<PopoverPreview ui={provider.ui} />}
      previewDescription="Open the surface to compare the same controlled state, anchor positioning, and size-aware panel motion on both primitives."
      title="Popover"
      usageCode={provider.usageCode}
      usageDescription="Control open state from React when you need it, but let PopoverContent follow the root automatically unless you have a reason to override presence yourself."
      v0PageCode={provider.usageCode}
    />
  );
}
