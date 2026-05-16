"use client";

import { skeletonApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { skeletonV0Page } from "@/lib/component-v0-pages";
import { ShimmerSkeleton } from "@/registry/skeleton";

const usageCode = `import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPreview() {
  return (
    <div className="w-full max-w-sm rounded-lg border border-border/80 bg-card p-4">
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

function SkeletonPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border border-border/80 bg-card p-4">
        <div className="flex items-center gap-3">
          <ShimmerSkeleton className="h-11 w-11" rounded="full" />
          <div className="flex-1 space-y-2">
            <ShimmerSkeleton className="h-4 w-32" />
            <ShimmerSkeleton className="h-3 w-24" rounded="sm" />
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          <ShimmerSkeleton className="h-3 w-full" />
          <ShimmerSkeleton className="h-3 w-[92%]" />
          <ShimmerSkeleton className="h-3 w-[78%]" />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Skeleton" },
      ]}
      componentName="skeleton"
      description="Shimmer loading placeholder with configurable corner radius, optional animation, and a lightweight API for building calmer loading states."
      details={skeletonApiDetails}
      preview={<SkeletonPreview />}
      title="Skeleton"
      usageCode={usageCode}
      usageDescription="Use the same primitive for avatar circles, title lines, body rows, and larger content blocks by changing only size and radius."
      v0PageCode={skeletonV0Page}
    />
  );
}
