"use client";

import { useMemo } from "react";

import { ButtonPlaygroundProvider } from "@/app/(site)/buttons-and-actions/button/_components/b-button-playground";
import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { buttonApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const usageCode = `import { Button } from "@/components/ui/b-button";

export function ButtonPreview() {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
      <span>When you are ready to ship with</span>
      <span className="font-medium text-foreground">default</span>
      <span>tap</span>
      <span className="inline-flex translate-y-px align-middle">
        <Button variant="default">Continue</Button>
      </span>
      <span>to finish.</span>
    </p>
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Buttons & Actions" },
  { label: "Button" },
];

function getDetails(): DetailItem[] {
  return buttonApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react, motion, class-variance-authority, lucide-react.",
        "Embedded Iconiq theme tokens ship inside the component, so colors resolve without a separate theme install.",
        "This page documents the Base UI install only, because Radix UI does not ship a separate button primitive.",
        "The generated registry file is /r/b-button.json.",
      ],
      registryPath: "b-button.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function RadixBaseButtonPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ButtonPlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="b-button"
          description="Action button for primary, secondary, inline, loading, and routed interactions."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/buttons-and-actions/button/page.tsx`}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          itemSlug="button"
          pageUrl="/buttons-and-actions/button"
          preview={preview}
          previewClassName="min-h-[280px] overflow-visible"
          previewDescription="Use the floating sliders control in the bottom-right corner to open settings and tune patterns, variants, sizes, icons, and loading."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Button"
          railNotes={[
            "Use the floating sliders button in the bottom-right of the preview to open settings.",
            "Pattern and option changes update the preview and Usage code together.",
            "Every preview keeps the same inline sentence layout so variants read in real copy.",
          ]}
          title="Button"
          usageCode={usageCode}
          usageDescription="This Base UI install includes embedded theme tokens, optional loading, href link rendering, ripple behavior, press spring, hover lift, and intrinsic-width animation."
          v0PageCode={usageCode}
        />
      )}
    </ButtonPlaygroundProvider>
  );
}
