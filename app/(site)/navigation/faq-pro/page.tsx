"use client";

import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { faqProApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
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

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Navigation" },
  { label: "FAQ Pro" },
];

function getDetails(): DetailItem[] {
  return faqProApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react/accordion, motion, lucide-react.",
        "This page documents the Base UI install only. FAQ Pro uses Base UI Accordion for single-open FAQ rows.",
        "The generated registry file is /r/faq-pro.json.",
      ],
      registryPath: "faq-pro.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function FaqProPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="faq-pro"
      description="Searchable FAQ with auto-expanded matches and query highlights."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/navigation/faq-pro/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="faq-pro"
      pageUrl="/navigation/faq-pro"
      preview={<FaqProPreview />}
      previewClassName="min-h-[28rem] overflow-visible"
      title="FAQ Pro"
      usageCode={usageCode}
      usageDescription={
        "Pass an `items` array of `{ id, question, answer }` objects. Built on Base UI Accordion. Search filters the list, opens matching rows, and highlights matched text. Use `defaultOpenFirst` to show the first item before typing."
      }
    />
  );
}
