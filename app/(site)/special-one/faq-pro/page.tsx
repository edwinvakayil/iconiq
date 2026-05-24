"use client";

import { faqProApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { FaqPro, type FaqProItem } from "@/registry/faq-pro";

const demoItems: FaqProItem[] = [
  {
    id: "what-is-iconiq",
    question: "What is Iconiq?",
    answer:
      "Iconiq is an open-source library of motion-powered React components built around the shadcn registry workflow. Browse polished UI primitives, install them as local files, and adapt them inside your own codebase.",
  },
  {
    id: "install-iconiq",
    question: "How do I install an Iconiq component?",
    answer:
      "Install components with shadcn using commands like npx shadcn@latest add @iconiq/b-button, or use a direct registry URL from iconiqui.com/r/b-button.json.",
  },
  {
    id: "iconiq-free",
    question: "Is Iconiq free to use?",
    answer:
      "Yes. Iconiq is open source and free to use for personal and commercial projects.",
  },
];

function formatItemsForUsageCode(items: FaqProItem[]) {
  return items
    .map(
      (item) => `  {
    id: "${item.id}",
    question: ${JSON.stringify(item.question)},
    answer: ${JSON.stringify(item.answer)},
  }`
    )
    .join(",\n");
}

const usageCode = `"use client";

import { FaqPro, type FaqProItem } from "@/components/ui/faq-pro";

const items: FaqProItem[] = [
${formatItemsForUsageCode(demoItems)}
];

export function FaqProPreview() {
  return <FaqPro className="w-full" defaultOpenFirst items={items} />;
}`;

function FaqProPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-10">
      <FaqPro className="w-full" defaultOpenFirst items={demoItems} />
    </div>
  );
}

export default function FaqProPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Special One" },
        { label: "FAQ Pro" },
      ]}
      componentName="faq-pro"
      description="Searchable FAQ accordion with rounded cards, smooth panel motion, automatic expansion for matches, and inline highlight styling for the active query."
      details={faqProApiDetails}
      preview={<FaqProPreview />}
      previewClassName="min-h-[28rem] overflow-visible"
      title="FAQ Pro"
      usageCode={usageCode}
      usageDescription={
        "Pass an `items` array of `{ id, question, answer }` objects. Search filters the list, opens matching rows, and highlights matched text. Use `defaultOpenFirst` to show the first item before typing."
      }
    />
  );
}
