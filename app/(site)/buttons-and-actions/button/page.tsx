"use client";

import { useMemo, useState } from "react";

import { InlinePreviewSelect } from "@/app/(site)/components/_components/inline-preview-select";
import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { buttonApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Button, type ButtonProps } from "@/registry/b-button";

type ButtonVariant = NonNullable<ButtonProps["variant"]>;

const variantOptions: { label: string; value: ButtonVariant }[] = [
  { value: "default", label: "Default" },
  { value: "outline", label: "Outline" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "destructive", label: "Destructive" },
  { value: "link", label: "Link" },
];

const sentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const usageCode = `import { Button } from "@/components/ui/b-button";

export function ButtonPreview() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="${sentenceClassName}">
        <span>When you are ready to ship with</span>
        <span className="font-medium text-foreground">Default</span>
        <span>Tap</span>
        <span className="inline-flex translate-y-px align-middle">
          <Button variant="default">Continue</Button>
        </span>
        <span>to finish.</span>
      </p>
    </div>
  );
}`;

function ButtonPreview() {
  const [variant, setVariant] = useState<ButtonVariant>("default");

  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-2">
      <div className="mx-auto max-w-2xl text-center">
        <p className={sentenceClassName}>
          <span>When you are ready to ship with</span>
          <InlinePreviewSelect
            ariaLabel="Button variant"
            menuKey="button-variant-menu"
            onChange={setVariant}
            options={variantOptions}
            value={variant}
          />
          <span>Tap</span>
          <span className="inline-flex translate-y-px align-middle">
            <Button variant={variant}>Continue</Button>
          </span>
          <span>to finish.</span>
        </p>
      </div>
    </div>
  );
}

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
      description="Action button for primary, secondary, and inline interactions."
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
      preview={<ButtonPreview />}
      previewDescription="Pick a variant inline in the sentence, then see how the Continue button reads in context."
      title="Button"
      usageCode={usageCode}
      usageDescription="This Base UI install keeps the same public Button API, ripple behavior, press spring, hover lift, and optional intrinsic-width animation as the core Iconiq button."
      v0PageCode={usageCode}
    />
  );
}
