"use client";

import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { cn } from "@/lib/utils";
import { Accordion as BaseAccordion } from "@/registry/b-accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/popover";
import { Accordion as RadixAccordion } from "@/registry/r-accordion";

type ProviderKey = "base" | "radix";

type ProviderConfig = {
  componentName: "b-accordion" | "r-accordion";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  preview: ReactNode;
  usageCode: string;
};

type AccordionDemoItem = {
  id: string;
  title: string;
  content: ReactNode;
};

const demoItems: AccordionDemoItem[] = [
  {
    id: "workflow",
    title: "How should I use this page?",
    content:
      "Switch between Base UI and Radix UI above. The preview, install command, and generated registry files update together so you can compare the same surface on top of two different headless foundations.",
  },
  {
    id: "api",
    title: "Does the public API stay the same?",
    content:
      "Yes. Both registry entries export Accordion and AccordionItem, accept the same items array, support default and editorial variants, and let you opt into multiple open rows with a single prop.",
  },
  {
    id: "install",
    title: "What changes when I switch providers?",
    content:
      "Only the underlying implementation and runtime dependency list. The Radix version ships the Radix accordion primitive, while the Base UI version installs the Base UI accordion parts and keeps the same product-facing shape.",
  },
];

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Radix UI + Base UI" },
  { label: "Accordion" },
];

const providerOptions: Array<{
  key: ProviderKey;
  label: "Base UI" | "Radix UI";
}> = [
  { key: "base", label: "Base UI" },
  { key: "radix", label: "Radix UI" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-accordion": `import { Accordion, type AccordionItem } from "@/components/ui/b-accordion";

const items: AccordionItem[] = [
  {
    id: "workflow",
    title: "How should I use this page?",
    content:
      "Switch between Base UI and Radix UI above. The preview, install command, and generated registry files update together so you can compare the same surface on top of two different headless foundations.",
  },
  {
    id: "api",
    title: "Does the public API stay the same?",
    content:
      "Yes. Both registry entries export Accordion and AccordionItem, accept the same items array, support default and editorial variants, and let you opt into multiple open rows with a single prop.",
  },
  {
    id: "install",
    title: "What changes when I switch providers?",
    content:
      "Only the underlying implementation and runtime dependency list. The Base UI version installs the Base UI accordion parts and keeps the same product-facing shape.",
  },
];

export function AccordionPreview() {
  return <Accordion className="w-full max-w-none" items={items} />;
}`,
  "r-accordion": `import { Accordion, type AccordionItem } from "@/components/ui/r-accordion";

const items: AccordionItem[] = [
  {
    id: "workflow",
    title: "How should I use this page?",
    content:
      "Switch between Base UI and Radix UI above. The preview, install command, and generated registry files update together so you can compare the same surface on top of two different headless foundations.",
  },
  {
    id: "api",
    title: "Does the public API stay the same?",
    content:
      "Yes. Both registry entries export Accordion and AccordionItem, accept the same items array, support default and editorial variants, and let you opt into multiple open rows with a single prop.",
  },
  {
    id: "install",
    title: "What changes when I switch providers?",
    content:
      "Only the underlying implementation and runtime dependency list. The Radix version installs the Radix accordion primitive and keeps the same product-facing shape.",
  },
];

export function AccordionPreview() {
  return <Accordion className="w-full max-w-none" items={items} />;
}`,
};

function ProviderSwitch({
  selectedProvider,
  onSelect,
}: {
  selectedProvider: ProviderKey;
  onSelect: (provider: ProviderKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const activeOption =
    providerOptions.find((option) => option.key === selectedProvider) ??
    providerOptions[0];

  return (
    <div className="mr-2 inline-flex h-8 shrink-0 items-center gap-3 whitespace-nowrap rounded-md px-3 text-sm">
      <span className="text-muted-foreground">Primitive</span>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button
            aria-expanded={open}
            aria-haspopup="menu"
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            type="button"
          >
            <span>{activeOption.label}</span>
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="z-20 mt-2 w-44 rounded-2xl border border-border/80 bg-background p-1.5 shadow-[0_20px_60px_rgba(15,23,42,0.12)] dark:bg-neutral-950"
          open={open}
          side="bottom"
          sideOffset={8}
        >
          {providerOptions.map((option) => {
            const isActive = option.key === selectedProvider;

            return (
              <button
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[14px] text-foreground transition-colors hover:bg-muted/70",
                  isActive && "bg-muted/55"
                )}
                key={option.key}
                onClick={() => {
                  onSelect(option.key);
                  setOpen(false);
                }}
                type="button"
              >
                <span>{option.label}</span>
                <Check
                  className={cn(
                    "size-4 text-emerald-500 transition-opacity",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function RadixBaseAccordionPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderKey>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-accordion",
        dependencyLabel: "@base-ui/react, motion, lucide-react",
        libraryLabel: "Base UI",
        notes: [
          "Installs the Base UI accordion parts under the same product-facing Accordion API.",
          "Uses Base UI panel measurement plus motion-backed label and icon polish.",
          "The generated registry file is /r/b-accordion.json.",
        ],
        preview: (
          <BaseAccordion className="w-full max-w-none" items={demoItems} />
        ),
        usageCode: usageCodeByProvider["b-accordion"],
      };
    }

    return {
      componentName: "r-accordion",
      dependencyLabel: "@radix-ui/react-accordion, motion, lucide-react",
      libraryLabel: "Radix UI",
      notes: [
        "Installs the Radix accordion primitive under the same product-facing Accordion API.",
        "Uses the existing Motion + Radix content choreography with animated height, wipe, and copy transitions.",
        "The generated registry file is /r/r-accordion.json.",
      ],
      preview: (
        <RadixAccordion className="w-full max-w-none" items={demoItems} />
      ),
      usageCode: usageCodeByProvider["r-accordion"],
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () => [
      {
        id: "accordion-item",
        title: "AccordionItem",
        summary:
          "Each row is described by a plain object so both provider-backed installs expose the same content contract.",
        fields: [
          {
            name: "id",
            type: "string",
            required: true,
            description:
              "Stable identifier used for open-state tracking and the underlying primitive value.",
          },
          {
            name: "title",
            type: "string",
            required: true,
            description: "Text rendered in the trigger row.",
          },
          {
            name: "content",
            type: "ReactNode",
            required: true,
            description:
              "Any body content rendered inside the expanded panel, including paragraphs, lists, links, or richer fragments.",
          },
        ],
      },
      {
        id: "accordion",
        title: "Accordion",
        summary:
          "Provider-switchable accordion surface with the same exported API regardless of whether you install the Base UI or Radix UI registry entry.",
        fields: [
          {
            name: "items",
            type: "AccordionItem[]",
            required: true,
            description: "Rows to render in display order.",
          },
          {
            name: "className",
            type: "string",
            description:
              "Merged onto the max-w-2xl root wrapper so you can stretch, align, or reposition the accordion in your layout.",
          },
          {
            name: "multiple",
            type: "boolean",
            defaultValue: "false",
            description:
              "Allows multiple rows to stay open at the same time. When omitted, opening a row closes the previous one.",
          },
          {
            name: "variant",
            type: '"default" | "editorial"',
            defaultValue: '"default"',
            description:
              "Switches between the standard divided list and the lighter editorial layout with numbered rows and chevron disclosure.",
          },
          {
            name: "reducedMotion",
            type: "boolean",
            description:
              "Forces the quieter motion path immediately while still respecting OS-level reduced motion preferences.",
          },
        ],
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          ...provider.notes,
        ],
      },
    ],
    [provider]
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same accordion API on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/accordion/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="accordion"
      pageUrl="/radix-base-ui/accordion"
      preview={provider.preview}
      title="Accordion"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
