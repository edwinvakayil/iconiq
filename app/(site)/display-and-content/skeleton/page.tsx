"use client";

import { SkeletonPlaygroundProvider } from "@/app/(site)/display-and-content/skeleton/_components/skeleton-playground";
import { skeletonApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { skeletonPreviewCode } from "@/lib/component-v0-pages";
import * as SkeletonModule from "@/registry/skeleton";

const usageCode = `"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPreview() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading profile"
      className="w-full max-w-sm rounded-lg bg-card p-4"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" rounded="sm" />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[92%]" />
        <Skeleton className="h-3 w-[78%]" />
      </div>
    </div>
  );
}`;

const skeletonExamples: VariantItem[] = [
  {
    title: "List rows",
    code: `"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonListExample() {
  return (
    <div aria-busy="true" aria-label="Loading notifications" className="w-full max-w-md space-y-3">
      {[0, 1, 2].map((row) => (
        <div className="flex items-center gap-3 rounded-lg border p-3" key={row}>
          <Skeleton className="size-10" rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}`,
  },
  {
    title: "Fade",
    code: `"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonFadeExample() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <Skeleton className="h-4 w-40" variant="fade" />
      <Skeleton className="h-3 w-full" variant="fade" />
      <Skeleton className="h-3 w-[84%]" variant="fade" />
    </div>
  );
}`,
  },
  {
    title: "Presets",
    code: `"use client";

import {
  SkeletonAvatar,
  SkeletonButton,
  SkeletonText,
} from "@/components/ui/skeleton";

export function SkeletonPresetExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonAvatar />
      <SkeletonText className="w-36" />
      <SkeletonButton />
    </div>
  );
}`,
  },
  {
    title: "Standalone status",
    code: `"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonStatusExample() {
  return (
    <Skeleton
      className="h-10 w-56"
      decorative={false}
      label="Loading dashboard"
      rounded="lg"
    />
  );
}`,
  },
];

export default function SkeletonPage() {
  return (
    <SkeletonPlaygroundProvider
      importPath="@/components/ui/skeleton"
      SkeletonModule={SkeletonModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Skeleton" },
          ]}
          componentName="skeleton"
          description="Loading placeholder for text, media, and layout scaffolding."
          details={skeletonApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/skeleton/page.tsx`}
          examples={skeletonExamples}
          itemSlug="skeleton"
          pageUrl="/display-and-content/skeleton"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible"
          previewCode={skeletonPreviewCode}
          previewDescription="Use the playground to switch profile, list, table, media, and single-block patterns, plus shimmer or fade variants, radius, animation, and accessibility options."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Skeleton"
          railNotes={[
            "Skeletons default to `decorative` so grouped placeholders stay silent in screen readers.",
            "Wrap multi-skeleton layouts in one container with `aria-busy` and a single `aria-label`.",
            "Use `decorative={false}` and `label` when one skeleton should announce loading on its own.",
            'Choose `variant="fade"` for opacity breathing or keep the default shimmer sweep.',
            "Set `animate={false}` when you need a static placeholder block.",
            "Use `SkeletonAvatar`, `SkeletonText`, and `SkeletonButton` for common preset sizes.",
          ]}
          title="Skeleton"
          usageCode={usageCode}
          usageDescription="Use the same primitive for avatar circles, title lines, body rows, and larger content blocks by changing only size and radius."
          v0PageCode={usageCode}
        />
      )}
    </SkeletonPlaygroundProvider>
  );
}
