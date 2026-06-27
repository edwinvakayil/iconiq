"use client";

import { SpinnerPlaygroundProvider } from "@/app/(site)/display-and-content/spinner/_components/spinner-playground";
import { spinnerApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { spinnerPreviewCode } from "@/lib/component-v0-pages";
import * as SpinnerModule from "@/registry/spinner";

const usageCode = `"use client";

import Spinner from "@/components/ui/spinner";

export function SpinnerPreview() {
  return (
    <p className="flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2.5 text-center text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
      <span className="text-neutral-500 dark:text-neutral-400">
        Every stall deserves a kinder signal —
      </span>
      <Spinner className="shrink-0" decorative size="sm" />
      <span className="font-medium text-sky-600 dark:text-sky-400">
        one tireless lap
      </span>
      <span className="text-neutral-400 dark:text-neutral-500">,</span>
      <span>or</span>
      <Spinner className="shrink-0" decorative variant="dots" />
      <span className="font-medium text-violet-600 dark:text-violet-400">
        three staggered taps
      </span>
      <span className="text-neutral-500 dark:text-neutral-400">
        — calm motion that still reads.
      </span>
    </p>
  );
}`;

const spinnerExamples: VariantItem[] = [
  {
    title: "Standalone status",
    code: `"use client";

import Spinner from "@/components/ui/spinner";

export function SpinnerStatusExample() {
  return <Spinner />;
}`,
  },
  {
    title: "Button loading",
    code: `"use client";

import Spinner from "@/components/ui/spinner";

export function SpinnerButtonExample() {
  return (
    <button
      aria-busy="true"
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      disabled
      type="button"
    >
      <Spinner decorative size="sm" />
      Saving
    </button>
  );
}`,
  },
  {
    title: "Busy container",
    code: `"use client";

import Spinner from "@/components/ui/spinner";

export function SpinnerOverlayExample() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading dashboard"
      className="flex min-h-40 w-full max-w-md flex-col items-center justify-center gap-3 rounded-xl border bg-card p-6"
    >
      <Spinner decorative size="lg" variant="dots" />
      <p className="text-sm text-muted-foreground">Refreshing metrics…</p>
    </div>
  );
}`,
  },
  {
    title: "Matrix",
    code: `"use client";

import Spinner from "@/components/ui/spinner";

export function SpinnerMatrixExample() {
  return <Spinner decorative size="lg" variant="matrix" />;
}`,
  },
  {
    title: "Sizes",
    code: `"use client";

import Spinner from "@/components/ui/spinner";

export function SpinnerSizesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Spinner decorative size="sm" />
      <Spinner decorative size="md" />
      <Spinner decorative size="lg" />
    </div>
  );
}`,
  },
];

export default function SpinnerPage() {
  return (
    <SpinnerPlaygroundProvider
      importPath="@/components/ui/spinner"
      SpinnerModule={SpinnerModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Spinner" },
          ]}
          componentName="spinner"
          description="Compact ring, dots, and matrix indicators for inline copy, buttons, and loading surfaces."
          details={spinnerApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/spinner/page.tsx`}
          examples={spinnerExamples}
          itemSlug="spinner"
          pageUrl="/display-and-content/spinner"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewCode={spinnerPreviewCode}
          previewDescription="Use the playground to switch ring, dots, or matrix variants inline inside copy, plus size and decorative options."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Spinner"
          railNotes={[
            "Use `decorative` when a parent already announces loading with `aria-busy` and `aria-label`.",
            "Choose `size` for sm, md, or lg presets instead of hand-tuning width and border classes.",
            "Wrap multi-element loading states in one container with `aria-busy` and a single label.",
            'Pick `variant="dots"` for staggered motion, `variant="matrix"` for a pixel-grid sweep, or keep the default ring.',
          ]}
          title="Spinner"
          usageCode={usageCode}
          usageDescription="Default export. Start with the compact snippet below, then expand into sizing, variants, and accessibility behavior through the API details."
          v0PageCode={usageCode}
        />
      )}
    </SpinnerPlaygroundProvider>
  );
}
