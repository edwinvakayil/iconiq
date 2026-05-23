"use client";

import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/radix-base-ui/_components/provider-switch";
import { buttonApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Button } from "@/registry/b-button";

const usageCode = `import { Button } from "@/components/ui/b-button";

export function ButtonPreview() {
  return (
    <div className="mx-auto max-w-2xl space-y-3 text-center">
      <p className="text-balance text-lg font-medium leading-snug tracking-tight dark:text-neutral-100">
        When you are ready to ship.
      </p>
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance text-lg font-medium leading-snug tracking-tight dark:text-neutral-100">
        <span>Tap</span>
        <span className="inline-flex translate-y-px align-middle">
          <Button>Continue</Button>
        </span>
        <span>to finish.</span>
      </p>
    </div>
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Radix UI + Base UI" },
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
        "Dependencies: @base-ui/react, motion, class-variance-authority.",
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
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="b-button"
      description="Base UI button with the same Iconiq motion, variants, and sizing API."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/button/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="button"
      pageUrl="/radix-base-ui/button"
      preview={
        <div className="flex min-h-[280px] items-center justify-center px-4 py-2">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <p className="text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
              When you are ready to ship.
            </p>
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
              <span>Tap</span>
              <span className="inline-flex translate-y-px align-middle">
                <Button>Continue</Button>
              </span>
              <span>to finish.</span>
            </p>
          </div>
        </div>
      }
      title="Button"
      usageCode={usageCode}
      usageDescription="This Base UI install keeps the same public Button API, ripple behavior, press spring, hover lift, and optional intrinsic-width animation as the core Iconiq button."
      v0PageCode={usageCode}
    />
  );
}
