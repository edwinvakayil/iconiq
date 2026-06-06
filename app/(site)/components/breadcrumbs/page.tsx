"use client";

import { Home } from "lucide-react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { breadcrumbsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/breadcrumbs";

const previewSentenceClassName =
  "text-balance text-center text-[15px] text-muted-foreground leading-relaxed sm:text-base";

const previewContentClassName =
  "flex w-full max-w-lg flex-col items-center gap-4 text-center";

const usageCode = `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumbs";
import { Home } from "lucide-react";

export function BreadcrumbsPreview() {
  return (
    <div className="${previewContentClassName}">
      <Breadcrumb className="w-full">
        <BreadcrumbList className="justify-center">
          <BreadcrumbItem>
            <BreadcrumbLink className="inline-flex items-center gap-1.5" href="/">
              <Home className="size-3.5" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <p className={previewSentenceClassName}>
        Nested docs pages stay easy to navigate from here.
      </p>
    </div>
  );
}`;

function BreadcrumbsPreview() {
  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-8">
      <div className={previewContentClassName}>
        <Breadcrumb className="w-full">
          <BreadcrumbList className="justify-center">
            <BreadcrumbItem>
              <BreadcrumbLink
                className="inline-flex items-center gap-1.5"
                href="/"
              >
                <Home className="size-3.5" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className={previewSentenceClassName}>
          Nested docs pages stay easy to navigate from here.
        </p>
      </div>
    </div>
  );
}

const componentDetailsItems = breadcrumbsApiDetails;

export default function RadixBaseBreadcrumbsPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Breadcrumbs" },
      ]}
      componentName="breadcrumbs"
      description="Clear path navigation for nested pages and flows."
      details={componentDetailsItems}
      detailsDescription="The compound parts cover root semantics, linked segments, current-page state, separators, ellipsis, and the Motion transitions layered across the trail."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/breadcrumbs/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/breadcrumbs"
      preview={<BreadcrumbsPreview />}
      previewDescription="Breadcrumbs sit above page copy so users can see the trail and the content below it together."
      title="Breadcrumbs"
      usageCode={usageCode}
      usageDescription="Use the minimal trail below as the baseline, then expand into icons, current-state styling, ellipsis markers, and custom separators through the compound parts."
    />
  );
}
