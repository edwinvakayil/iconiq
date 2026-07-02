"use client";

import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import {
  FaqProPlaygroundProvider,
  getFaqProDefaultUsageCode,
} from "@/app/(site)/navigation/faq-pro/_components/faq-pro-playground";
import { faqProApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const IMPORT_PATH = "@/components/ui/faq-pro";

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
    <FaqProPlaygroundProvider>
      {({ preview, renderSettings }) => (
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
          preview={preview}
          previewClassName="min-h-[28rem] overflow-visible"
          previewDescription="Toggle the search field, default open, keywords, a disabled row, and the themed surface."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="FAQ Pro"
          title="FAQ Pro"
          usageCode={getFaqProDefaultUsageCode(IMPORT_PATH)}
          usageDescription={
            "Pass an `items` array of `{ id, question, answer }` objects (answer accepts ReactNode). Built on Base UI Accordion. Multi-term search filters the list, opens matching rows, and highlights matched text. Use `value`/`onOpenChange` for controlled state, `filter` for custom matching, and `hideSearch` to render the list only."
          }
          v0PageCode={getFaqProDefaultUsageCode(IMPORT_PATH)}
        />
      )}
    </FaqProPlaygroundProvider>
  );
}
