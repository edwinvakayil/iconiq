"use client";

import type { ReactNode } from "react";
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
import { Accordion as BaseAccordion } from "@/registry/b-accordion";
import { Accordion as RadixAccordion } from "@/registry/r-accordion";

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
  { label: "Components" },
  { label: "Accordion" },
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

export default function RadixBaseAccordionPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

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
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/accordion/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="accordion"
      pageUrl="/components/accordion"
      preview={provider.preview}
      title="Accordion"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
