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
    <Breadcrumb>
      <BreadcrumbList>
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
  );
}`;

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
      preview={
        <div className="flex min-h-[280px] items-center justify-center">
          <Breadcrumb>
            <BreadcrumbList>
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
        </div>
      }
      title="Breadcrumbs"
      usageCode={usageCode}
      usageDescription="Use the minimal trail below as the baseline, then expand into icons, current-state styling, ellipsis markers, and custom separators through the compound parts."
    />
  );
}
