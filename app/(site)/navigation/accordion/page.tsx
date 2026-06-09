"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { ComponentDemoCanvas } from "@/components/docs/component-demo-canvas";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  Accordion as BaseAccordion,
  AccordionContent as BaseAccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger as BaseAccordionTrigger,
} from "@/registry/b-accordion";
import {
  Accordion as RadixAccordion,
  AccordionContent as RadixAccordionContent,
  AccordionItem as RadixAccordionItem,
  AccordionTrigger as RadixAccordionTrigger,
} from "@/registry/r-accordion";

type ProviderConfig = {
  componentName: "b-accordion" | "r-accordion";
  dependencyLabel: string;
  installationPreview: ReactNode;
  installationPreviewCode: string;
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
      "Switch libraries above. The preview, install command, and registry files update together.",
  },
  {
    id: "api",
    title: "Does the public API stay the same?",
    content:
      "Yes. Both entries export the same compound parts, variants, and multi-open behavior.",
  },
  {
    id: "install",
    title: "What changes when I switch providers?",
    content: "Only the underlying implementation and dependency list change.",
  },
];

const previewAccordionClassName = "w-full max-w-xl";
const installationPreviewAccordionClassName = "mx-auto w-full max-w-xl";

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Navigation" },
  { label: "Accordion" },
];

function getBaseAccordionRows() {
  return demoItems.map((item) => (
    <BaseAccordionItem key={item.id} value={item.id}>
      <BaseAccordionTrigger>{item.title}</BaseAccordionTrigger>
      <BaseAccordionContent>{item.content}</BaseAccordionContent>
    </BaseAccordionItem>
  ));
}

function getRadixAccordionRows() {
  return demoItems.map((item) => (
    <RadixAccordionItem key={item.id} value={item.id}>
      <RadixAccordionTrigger>{item.title}</RadixAccordionTrigger>
      <RadixAccordionContent>{item.content}</RadixAccordionContent>
    </RadixAccordionItem>
  ));
}

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-accordion": `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/b-accordion";

export function AccordionPreview() {
  return (
    <Accordion defaultValue={["workflow"]} className="w-full max-w-xl">
      <AccordionItem value="workflow">
        <AccordionTrigger>How should I use this page?</AccordionTrigger>
        <AccordionContent>
          Switch libraries above. The preview, install command, and registry
          files update together.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="api">
        <AccordionTrigger>Does the public API stay the same?</AccordionTrigger>
        <AccordionContent>
          Yes. Both entries export the same compound parts, variants, and
          multi-open behavior.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="install">
        <AccordionTrigger>What changes when I switch providers?</AccordionTrigger>
        <AccordionContent>
          Only the underlying implementation and dependency list change.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
  "r-accordion": `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/r-accordion";

export function AccordionPreview() {
  return (
    <Accordion defaultValue={["workflow"]} className="${previewAccordionClassName}">
      <AccordionItem value="workflow">
        <AccordionTrigger>How should I use this page?</AccordionTrigger>
        <AccordionContent>
          Switch libraries above. The preview, install command, and registry
          files update together.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="api">
        <AccordionTrigger>Does the public API stay the same?</AccordionTrigger>
        <AccordionContent>
          Yes. Both entries export the same compound parts, variants, and
          multi-open behavior.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="install">
        <AccordionTrigger>What changes when I switch providers?</AccordionTrigger>
        <AccordionContent>
          Only the underlying implementation and dependency list change.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
};

const quietUsageCodeByProvider: Record<
  ProviderConfig["componentName"],
  string
> = {
  "b-accordion": `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/b-accordion";

export function QuietAccordionPreview() {
  return (
    <Accordion
      className="mx-auto w-full max-w-xl"
      defaultValue={["workflow"]}
      variant="quiet"
    >
      <AccordionItem value="workflow">
        <AccordionTrigger>How should I use this page?</AccordionTrigger>
        <AccordionContent>
          Switch libraries above. The preview, install command, and registry
          files update together.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="api">
        <AccordionTrigger>Does the public API stay the same?</AccordionTrigger>
        <AccordionContent>
          Yes. Both entries export the same compound parts, variants, and
          multi-open behavior.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="install">
        <AccordionTrigger>What changes when I switch providers?</AccordionTrigger>
        <AccordionContent>
          Only the underlying implementation and dependency list change.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
  "r-accordion": `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/r-accordion";

export function QuietAccordionPreview() {
  return (
    <Accordion
      className="mx-auto w-full max-w-xl"
      defaultValue={["workflow"]}
      variant="quiet"
    >
      <AccordionItem value="workflow">
        <AccordionTrigger>How should I use this page?</AccordionTrigger>
        <AccordionContent>
          Switch libraries above. The preview, install command, and registry
          files update together.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="api">
        <AccordionTrigger>Does the public API stay the same?</AccordionTrigger>
        <AccordionContent>
          Yes. Both entries export the same compound parts, variants, and
          multi-open behavior.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="install">
        <AccordionTrigger>What changes when I switch providers?</AccordionTrigger>
        <AccordionContent>
          Only the underlying implementation and dependency list change.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
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
          "Installs the Base UI accordion parts under the same compound Accordion API.",
          "Uses Base UI panel measurement plus motion-backed label and icon polish.",
          "The generated registry file is /r/b-accordion.json.",
        ],
        installationPreview: (
          <BaseAccordion
            className={installationPreviewAccordionClassName}
            defaultValue={["workflow"]}
            variant="quiet"
          >
            {getBaseAccordionRows()}
          </BaseAccordion>
        ),
        installationPreviewCode: quietUsageCodeByProvider["b-accordion"],
        preview: (
          <BaseAccordion
            className={previewAccordionClassName}
            defaultValue={["workflow"]}
          >
            {getBaseAccordionRows()}
          </BaseAccordion>
        ),
        usageCode: usageCodeByProvider["b-accordion"],
      };
    }

    return {
      componentName: "r-accordion",
      dependencyLabel: "@radix-ui/react-accordion, motion, lucide-react",
      libraryLabel: "Radix UI",
      notes: [
        "Installs the Radix accordion primitive under the same compound Accordion API.",
        "Uses the existing Motion + Radix content choreography with animated height, wipe, and copy transitions.",
        "The generated registry file is /r/r-accordion.json.",
      ],
      installationPreview: (
        <RadixAccordion
          className={installationPreviewAccordionClassName}
          defaultValue={["workflow"]}
          variant="quiet"
        >
          {getRadixAccordionRows()}
        </RadixAccordion>
      ),
      installationPreviewCode: quietUsageCodeByProvider["r-accordion"],
      preview: (
        <RadixAccordion
          className={previewAccordionClassName}
          defaultValue={["workflow"]}
        >
          {getRadixAccordionRows()}
        </RadixAccordion>
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

  const extraSections = useMemo(
    () => [
      {
        id: "quiet-variant",
        title: "Quiet variant",
        content: (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Use <code>variant="quiet"</code> for the lighter inline disclosure
              style while keeping the same compound Accordion API.
            </p>
            <ComponentDemoCanvas
              code={provider.installationPreviewCode}
              componentName={provider.componentName}
              preview={provider.installationPreview}
              v0PageCode={provider.installationPreviewCode}
            />
          </div>
        ),
      },
    ],
    [provider]
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Stacked sections for showing and hiding related content."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/navigation/accordion/page.tsx`}
      extraSections={extraSections}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="accordion"
      pageUrl="/navigation/accordion"
      preview={provider.preview}
      title="Accordion"
      usageCode={provider.usageCode}
      usageDescription="Use the compound parts directly. Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
