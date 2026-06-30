"use client";

import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import {
  type AccordionModule,
  AccordionPlaygroundProvider,
  getAccordionDefaultUsageCode,
} from "@/app/(site)/navigation/accordion/_components/accordion-playground";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseAccordion from "@/registry/b-accordion";
import * as RadixAccordion from "@/registry/r-accordion";

type ProviderConfig = {
  componentName: "b-accordion" | "r-accordion";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: AccordionModule;
  usageCode: string;
};

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Navigation" },
  { label: "Accordion" },
];

const IMPORT_PATHS = {
  base: "@/components/ui/b-accordion",
  radix: "@/components/ui/r-accordion",
} as const;

export default function RadixBaseAccordionPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-accordion",
        dependencyLabel: "@base-ui/react, motion",
        importPath: IMPORT_PATHS.base,
        libraryLabel: "Base UI",
        notes: [
          "Installs the Base UI accordion parts under the same compound Accordion API.",
          "Uses Base UI panel measurement plus motion-backed label and icon polish.",
          "The generated registry file is /r/b-accordion.json.",
        ],
        ui: BaseAccordion as AccordionModule,
        usageCode: getAccordionDefaultUsageCode(IMPORT_PATHS.base),
      };
    }

    return {
      componentName: "r-accordion",
      dependencyLabel: "@radix-ui/react-accordion, motion",
      importPath: IMPORT_PATHS.radix,
      libraryLabel: "Radix UI",
      notes: [
        "Installs the Radix accordion primitive under the same compound Accordion API.",
        "Uses motion-backed height and content transitions on top of Radix content semantics.",
        "The generated registry file is /r/r-accordion.json.",
      ],
      ui: RadixAccordion as AccordionModule,
      usageCode: getAccordionDefaultUsageCode(IMPORT_PATHS.radix),
    };
  }, [selectedProvider]);

  const details = useMemo<DetailItem[]>(
    () => [
      {
        id: "accordion-item",
        title: "AccordionItem",
        summary:
          "Groups one trigger and one content panel under the value used for open-state tracking.",
        fields: [
          {
            name: "value",
            type: "string",
            required: true,
            description:
              "Stable identifier used by defaultValue, value, and the underlying primitive.",
          },
          {
            name: "children",
            type: "ReactNode",
            required: true,
            description:
              "Usually an AccordionTrigger followed by AccordionContent.",
          },
          {
            name: "className",
            type: "string",
            description:
              "Merged onto the primitive item while preserving the default or quiet row styling.",
          },
        ],
      },
      {
        id: "accordion-trigger",
        title: "AccordionTrigger",
        summary:
          "Renders the clickable row label with the active variant's indicator treatment.",
        fields: [
          {
            name: "children",
            type: "ReactNode",
            required: true,
            description: "Trigger text or inline content.",
          },
          {
            name: "className",
            type: "string",
            description:
              "Merged onto the trigger button after the variant's layout and focus classes.",
          },
        ],
      },
      {
        id: "accordion-content",
        title: "AccordionContent",
        summary:
          "Renders the animated panel body for the active item and keeps rich text styling intact.",
        fields: [
          {
            name: "children",
            type: "ReactNode",
            required: true,
            description:
              "Panel content, including paragraphs, lists, links, or richer fragments.",
          },
          {
            name: "className",
            type: "string",
            description:
              "Merged onto the inner copy wrapper so text and rich content can be styled per panel.",
          },
          {
            name: "keepMounted",
            type: "boolean",
            defaultValue: "true",
            description:
              "Keep panel content mounted while closed so height animation can finish cleanly. Radix installs also accept forceMount as an alias.",
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
            name: "children",
            type: "ReactNode",
            required: true,
            description:
              "AccordionItem children rendered in display order. The legacy items prop remains supported for older installs.",
          },
          {
            name: "defaultValue",
            type: "string[]",
            description:
              "Uncontrolled list of item values that should be open on first render.",
          },
          {
            name: "value",
            type: "string[]",
            description:
              "Controlled list of open item values. Pair with onValueChange.",
          },
          {
            name: "onValueChange",
            type: "(value: string[]) => void",
            description:
              "Called with the next open-value array for both Base UI and Radix UI variants.",
          },
          {
            name: "className",
            type: "string",
            description:
              "Merged onto the max-w-2xl root wrapper so you can stretch, align, or reposition the accordion in your layout.",
          },
          {
            name: "collapsible",
            type: "boolean",
            defaultValue: "true",
            description:
              "Single-open mode only. When false, the open row cannot be collapsed by clicking it again.",
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
            type: '"default" | "quiet"',
            defaultValue: '"default"',
            description:
              "Switches between the standard divided list and the quieter inline plus/minus treatment.",
          },
        ],
        notes: [
          `Current install target: ${provider.libraryLabel}.`,
          `Dependencies declared by this registry entry: ${provider.dependencyLabel}.`,
          "The old items array shortcut still works, but the documented API now mirrors the shadcn-style compound parts.",
          ...provider.notes,
        ],
      },
    ],
    [provider]
  );

  return (
    <AccordionPlaygroundProvider
      importPath={provider.importPath}
      key={provider.componentName}
      ui={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Stacked sections for showing and hiding related content."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/navigation/accordion/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="accordion"
          pageUrl="/navigation/accordion"
          preview={preview}
          previewClassName="min-h-[20rem]"
          previewDescription="Use the playground to switch variant, multi-open, collapsible, default open, and mount behavior."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Accordion"
          railNotes={[
            "Variants: default uses divided rows with a plus/minus icon; quiet uses inline plus/minus labels.",
            "Single-open is the default. Pass multiple when you want a keep-open FAQ or settings list.",
            "Use collapsible={false} when one section should always stay open in single mode.",
            "Pass keepMounted={false} on AccordionContent for heavy panels you want removed from the DOM when closed.",
          ]}
          title="Accordion"
          usageCode={provider.usageCode}
          usageDescription="Use the compound parts directly. Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </AccordionPlaygroundProvider>
  );
}
