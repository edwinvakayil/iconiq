"use client";

import { accordionApiDetails } from "@/components/docs/component-api";
import { ComponentDemoCanvas } from "@/components/docs/component-demo-canvas";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Accordion, type AccordionItem } from "@/registry/accordion";

const demoItems: AccordionItem[] = [
  {
    id: "1",
    title: "What makes this accordion special?",
    content:
      "It uses spring-based physics animations powered by Motion, creating fluid and natural feeling transitions that respond organically to user interaction.",
  },
  {
    id: "2",
    title: "How does the animation work?",
    content:
      "Each element — the icon rotation, content reveal, and background shift — animates independently with carefully tuned spring parameters for a layered, premium feel.",
  },
  {
    id: "3",
    title: "Can I customize the content?",
    content: (
      <>
        <p>
          Absolutely. Content now accepts any React node, so you can break
          things into smaller, easier-to-scan chunks.
        </p>
        <ul>
          <li>Paragraphs for context</li>
          <li>Lists for quick scanning</li>
          <li>Links or inline emphasis where needed</li>
        </ul>
      </>
    ),
  },
  {
    id: "4",
    title: "Is it accessible?",
    content:
      "Yes. It uses semantic button elements, proper ARIA attributes, and supports full keyboard navigation out of the box.",
  },
];

const usageCode = `import { Accordion, type AccordionItem } from "@/components/ui/accordion";

const items: AccordionItem[] = [
  {
    id: "1",
    title: "What makes this accordion special?",
    content:
      "It uses spring-based physics animations powered by Motion, creating fluid and natural feeling transitions that respond organically to user interaction.",
  },
  {
    id: "2",
    title: "How does the animation work?",
    content:
      "Each element — the icon rotation, content reveal, and background shift — animates independently with carefully tuned spring parameters for a layered, premium feel.",
  },
  {
    id: "3",
    title: "Can I customize the content?",
    content: (
      <>
        <p>
          Absolutely. Content accepts any React node, so you can break things
          into smaller, easier-to-scan chunks.
        </p>
        <ul>
          <li>Paragraphs for context</li>
          <li>Lists for quick scanning</li>
          <li>Links or inline emphasis where needed</li>
        </ul>
      </>
    ),
  },
  {
    id: "4",
    title: "Is it accessible?",
    content:
      "Yes. It uses semantic button elements, proper ARIA attributes, and supports full keyboard navigation out of the box.",
  },
];

export function AccordionPreview() {
  return <Accordion className="w-full max-w-none" items={items} />;
}`;

const editorialVariantCode = `import { Accordion, type AccordionItem } from "@/components/ui/accordion";

const items: AccordionItem[] = [
  {
    id: "1",
    title: "What makes this accordion special?",
    content:
      "It uses spring-based physics animations powered by Motion, creating fluid and natural feeling transitions that respond organically to user interaction.",
  },
  {
    id: "2",
    title: "How does the animation work?",
    content:
      "Each element — the icon rotation, content reveal, and background shift — animates independently with carefully tuned spring parameters for a layered, premium feel.",
  },
  {
    id: "3",
    title: "Can I customize the content?",
    content: (
      <>
        <p>
          Absolutely. Content accepts any React node, so you can break things
          into smaller, easier-to-scan chunks.
        </p>
        <ul>
          <li>Paragraphs for context</li>
          <li>Lists for quick scanning</li>
          <li>Links or inline emphasis where needed</li>
        </ul>
      </>
    ),
  },
  {
    id: "4",
    title: "Is it accessible?",
    content:
      "Yes. It uses semantic button elements, proper ARIA attributes, and supports full keyboard navigation out of the box.",
  },
];

export function AccordionEditorialPreview() {
  return (
    <Accordion
      className="w-full max-w-none"
      items={items}
      variant="editorial"
    />
  );
}`;

const multipleOpenCode = `import { Accordion, type AccordionItem } from "@/components/ui/accordion";

const items: AccordionItem[] = [
  {
    id: "1",
    title: "What makes this accordion special?",
    content:
      "It uses spring-based physics animations powered by Motion, creating fluid and natural feeling transitions that respond organically to user interaction.",
  },
  {
    id: "2",
    title: "How does the animation work?",
    content:
      "Each element — the icon rotation, content reveal, and background shift — animates independently with carefully tuned spring parameters for a layered, premium feel.",
  },
  {
    id: "3",
    title: "Can I customize the content?",
    content: (
      <>
        <p>
          Absolutely. Content accepts any React node, so you can break things
          into smaller, easier-to-scan chunks.
        </p>
        <ul>
          <li>Paragraphs for context</li>
          <li>Lists for quick scanning</li>
          <li>Links or inline emphasis where needed</li>
        </ul>
      </>
    ),
  },
  {
    id: "4",
    title: "Is it accessible?",
    content:
      "Yes. It uses semantic button elements, proper ARIA attributes, and supports full keyboard navigation out of the box.",
  },
];

export function AccordionMultiplePreview() {
  return <Accordion className="w-full max-w-none" items={items} multiple />;
}`;

const componentDetailsItems = accordionApiDetails;

export default function AccordionPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Accordion" },
      ]}
      componentName="accordion"
      description="Animated accordion with composable items, spring reveal, and theme-aware disclosure chrome. Designed for FAQs, settings, and structured help content."
      details={componentDetailsItems}
      extraSections={[
        {
          id: "variants",
          title: "Variants",
          content: (
            <ComponentDemoCanvas
              code={editorialVariantCode}
              componentName="accordion"
              preview={
                <Accordion
                  className="w-full max-w-none"
                  items={demoItems}
                  variant="editorial"
                />
              }
            />
          ),
        },
        {
          id: "multiple-open",
          title: "Multiple Open",
          content: (
            <ComponentDemoCanvas
              code={multipleOpenCode}
              componentName="accordion"
              preview={
                <Accordion
                  className="w-full max-w-none"
                  items={demoItems}
                  multiple
                />
              }
            />
          ),
        },
      ]}
      preview={<Accordion className="w-full max-w-none" items={demoItems} />}
      title="Accordion"
      usageCode={usageCode}
      usageDescription='Use the default item array pattern below, pass `variant="editorial"` when you want a lighter editorial treatment, add `multiple` to let several rows stay open at once, and pass `content` as any `ReactNode` when paragraphs or lists scan better than a single string.'
    />
  );
}
