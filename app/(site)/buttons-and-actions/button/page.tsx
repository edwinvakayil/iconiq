"use client";

import { Plus, Settings } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

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
type ButtonSize = NonNullable<ButtonProps["size"]>;

type IconPreviewMode = "labeled" | "icon-only";

const variantOptions: { label: string; value: ButtonVariant }[] = [
  { value: "default", label: "Default" },
  { value: "outline", label: "Outline" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "destructive", label: "Destructive" },
  { value: "link", label: "Link" },
];

const sizeOptions: { label: string; value: ButtonSize }[] = [
  { value: "xs", label: "xs" },
  { value: "sm", label: "sm" },
  { value: "default", label: "md" },
  { value: "lg", label: "lg" },
];

const iconModeOptions: { label: string; value: IconPreviewMode }[] = [
  { value: "labeled", label: "With label" },
  { value: "icon-only", label: "Icon only" },
];

const sentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const buttonInlineClassName = "inline-flex translate-y-px align-middle";

function SentencePreview({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-2">
      <div className="mx-auto max-w-2xl text-center">
        <p className={sentenceClassName}>{children}</p>
      </div>
    </div>
  );
}

const usageCode = `import { Button } from "@/components/ui/b-button";

export function ButtonPreview() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="${sentenceClassName}">
        <span>When you are ready to ship with</span>
        <span className="font-medium text-foreground">md</span>
        <span>Tap</span>
        <span className="${buttonInlineClassName}">
          <Button variant="default">Continue</Button>
        </span>
        <span>to finish.</span>
      </p>
    </div>
  );
}`;

const loadingCode = `import { Button } from "@/components/ui/b-button";

export function SavingButton() {
  const [loading, setLoading] = useState(false);

  return (
    <p className="${sentenceClassName}">
      <span>When your draft is ready,</span>
      <span>tap</span>
      <span className="${buttonInlineClassName}">
        <Button
          animateSize
          loading={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1500);
          }}
          type="button"
        >
          {loading ? "Saving" : "Save changes"}
        </Button>
      </span>
      <span>to publish.</span>
    </p>
  );
}`;

const sizesCode = `import { Button } from "@/components/ui/b-button";

export function ButtonSizes() {
  return (
    <p className="${sentenceClassName}">
      <span>When you are building at</span>
      <span className="font-medium text-foreground">md</span>
      <span>size, tap</span>
      <span className="${buttonInlineClassName}">
        <Button size="default">Continue</Button>
      </span>
      <span>to finish.</span>
    </p>
  );
}`;

const iconCode = `import { Settings } from "lucide-react";

import { Button } from "@/components/ui/b-button";

export function IconButtons() {
  return (
    <p className="${sentenceClassName}">
      <span>When you need to adjust things,</span>
      <span>tap</span>
      <span className="${buttonInlineClassName}">
        <Button icon={<Settings aria-hidden />} iconPosition="start" variant="outline">
          Settings
        </Button>
      </span>
      <span>to continue.</span>
    </p>
  );
}`;

const hrefCode = `import { Button } from "@/components/ui/b-button";

export function DocsLinkButton() {
  return (
    <p className="${sentenceClassName}">
      <span>Need more detail?</span>
      <span>Read the</span>
      <span className="${buttonInlineClassName}">
        <Button href="/docs" target="_blank" variant="outline">
          docs
        </Button>
      </span>
      <span>in a new tab.</span>
    </p>
  );
}`;

function ButtonPreview() {
  const [variant, setVariant] = useState<ButtonVariant>("default");

  return (
    <SentencePreview>
      <span>When you are ready to ship with</span>
      <InlinePreviewSelect
        ariaLabel="Button variant"
        menuKey="button-variant-menu"
        onChange={setVariant}
        options={variantOptions}
        value={variant}
      />
      <span>tap</span>
      <span className={buttonInlineClassName}>
        <Button variant={variant}>Continue</Button>
      </span>
      <span>to finish.</span>
    </SentencePreview>
  );
}

function LoadingPreview() {
  const [loading, setLoading] = useState(false);

  return (
    <SentencePreview>
      <span>When your draft is ready,</span>
      <span>tap</span>
      <span className={buttonInlineClassName}>
        <Button
          animateSize
          loading={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1500);
          }}
          type="button"
        >
          {loading ? "Saving" : "Save changes"}
        </Button>
      </span>
      <span>to publish.</span>
    </SentencePreview>
  );
}

function SizesPreview() {
  const [size, setSize] = useState<ButtonSize>("default");

  return (
    <SentencePreview>
      <span>When you are building at</span>
      <InlinePreviewSelect
        ariaLabel="Button size"
        menuKey="button-size-menu"
        onChange={setSize}
        options={sizeOptions}
        value={size}
      />
      <span>size, tap</span>
      <span className={buttonInlineClassName}>
        <Button size={size}>Continue</Button>
      </span>
      <span>to finish.</span>
    </SentencePreview>
  );
}

function IconPreview() {
  const [mode, setMode] = useState<IconPreviewMode>("labeled");

  return (
    <SentencePreview>
      {mode === "labeled" ? (
        <>
          <span>When you need to adjust things,</span>
          <InlinePreviewSelect
            ariaLabel="Icon button mode"
            menuKey="button-icon-mode-menu"
            onChange={setMode}
            options={iconModeOptions}
            value={mode}
          />
          <span>tap</span>
          <span className={buttonInlineClassName}>
            <Button
              icon={<Settings aria-hidden />}
              iconPosition="start"
              variant="outline"
            >
              Settings
            </Button>
          </span>
          <span>to continue.</span>
        </>
      ) : (
        <>
          <span>Need a quick action?</span>
          <InlinePreviewSelect
            ariaLabel="Icon button mode"
            menuKey="button-icon-mode-menu"
            onChange={setMode}
            options={iconModeOptions}
            value={mode}
          />
          <span>tap</span>
          <span className={buttonInlineClassName}>
            <Button
              icon={<Plus aria-hidden />}
              iconLabel="Create item"
              size="icon"
              variant="default"
            />
          </span>
          <span>to add something new.</span>
        </>
      )}
    </SentencePreview>
  );
}

function HrefPreview() {
  return (
    <SentencePreview>
      <span>Need more detail?</span>
      <span>Read the</span>
      <span className={buttonInlineClassName}>
        <Button href="/" target="_blank" variant="outline">
          docs
        </Button>
      </span>
      <span>in a new tab.</span>
    </SentencePreview>
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
  const examples = useMemo(
    () => [
      {
        title: "Loading",
        preview: <LoadingPreview />,
        code: loadingCode,
      },
      {
        title: "Sizes",
        preview: <SizesPreview />,
        code: sizesCode,
      },
      {
        title: "Icons",
        preview: <IconPreview />,
        code: iconCode,
      },
      {
        title: "Href link",
        preview: <HrefPreview />,
        code: hrefCode,
      },
    ],
    []
  );

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="b-button"
      description="Action button for primary, secondary, inline, loading, and routed interactions."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/buttons-and-actions/button/page.tsx`}
      examples={examples}
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
      previewDescription="Every preview uses the same inline sentence layout so variants, loading, sizes, icons, and links read in real copy."
      title="Button"
      usageCode={usageCode}
      usageDescription="This Base UI install includes embedded theme tokens, optional loading, href link rendering, ripple behavior, press spring, hover lift, and intrinsic-width animation."
      v0PageCode={usageCode}
    />
  );
}
