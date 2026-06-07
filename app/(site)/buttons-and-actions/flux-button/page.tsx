"use client";

import { Check } from "lucide-react";
import { useMemo, useState } from "react";

import { InlinePreviewSelect } from "@/app/(site)/components/_components/inline-preview-select";
import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { fluxButtonApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { FluxButton, type FluxButtonProps } from "@/registry/flux-button";

type VisualVariant = NonNullable<FluxButtonProps["variant"]>;

const variantOptions: { label: string; value: VisualVariant }[] = [
  { value: "default", label: "Default" },
  { value: "outline", label: "Outline" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "destructive", label: "Destructive" },
  { value: "link", label: "Link" },
];

const sentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const usageCode = `"use client";

import { Check } from "lucide-react";

import { FluxButton } from "@/components/ui/flux-button";

export function FluxButtonPreview() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="${sentenceClassName}">
        <span>When the form is ready,</span>
        <span className="font-medium text-foreground">Default</span>
        <span>Tap</span>
        <span className="inline-flex translate-y-px align-middle">
          <FluxButton
            idleLabel="Submit"
            loadingLabel="Submitting"
            successIcon={<Check aria-hidden className="size-4" strokeWidth={2.5} />}
            successLabel="Submitted"
            onAction={async () => {
              await new Promise((resolve) => setTimeout(resolve, 1500));
            }}
            type="button"
            variant="default"
          />
        </span>
        <span>to finish.</span>
      </p>
    </div>
  );
}`;

function simulateAction() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1500);
  });
}

function FluxButtonPreview() {
  const [variant, setVariant] = useState<VisualVariant>("default");

  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-2">
      <div className="mx-auto max-w-2xl text-center">
        <p className={sentenceClassName}>
          <span>When the form is ready,</span>
          <InlinePreviewSelect
            ariaLabel="Flux button variant"
            menuKey="flux-button-variant-menu"
            onChange={setVariant}
            options={variantOptions}
            value={variant}
          />
          <span>Tap</span>
          <span className="inline-flex translate-y-px align-middle">
            <FluxButton
              idleLabel="Submit"
              loadingLabel="Submitting"
              onAction={simulateAction}
              successIcon={
                <Check aria-hidden className="size-4" strokeWidth={2.5} />
              }
              successLabel="Submitted"
              type="button"
              variant={variant}
            />
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
  { label: "Flux Button" },
];

function getDetails(): DetailItem[] {
  return fluxButtonApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react/button, class-variance-authority, lucide-react, motion.",
        "This page documents the Base UI install only. Flux Button builds on the Base UI button primitive.",
        "The generated registry file is /r/flux-button.json.",
      ],
      registryPath: "flux-button.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function FluxButtonPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="flux-button"
      description="Async button with idle, loading, and success states."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/buttons-and-actions/flux-button/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      pageUrl="/buttons-and-actions/flux-button"
      preview={<FluxButtonPreview />}
      previewDescription="Pick a variant inline in the sentence, then click the button to see the idle → loading → success flow."
      title="Flux Button"
      usageCode={usageCode}
      usageDescription={
        'Pass `idleLabel`, `loadingLabel`, `successLabel`, an optional `successIcon`, and an async `onAction` handler. Style with `variant`. Use `type="submit"` inside forms, or `type="button"` (default) for standalone async actions. The loading spinner is built in. Flux Button is built on the Base UI button primitive.'
      }
    />
  );
}
