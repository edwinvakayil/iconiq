"use client";

import { Home } from "lucide-react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/radix-base-ui/_components/provider-switch";
import { breadcrumbsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { type BreadcrumbItem, Breadcrumbs } from "@/registry/breadcrumbs";

const demoItems: BreadcrumbItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home className="size-3.5" />,
  },
  { label: "Components", href: "/radix-base-ui/breadcrumbs" },
  { label: "Breadcrumbs" },
];

const usageCode = `import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Home } from "lucide-react";

const items: BreadcrumbItem[] = [
  {
    label: "Home",
    href: "/",
    icon: <Home className="size-3.5" />,
  },
  { label: "Components", href: "/radix-base-ui/breadcrumbs" },
  { label: "Breadcrumbs" },
];

export function BreadcrumbsPreview() {
  return <Breadcrumbs items={items} />;
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
      detailsDescription="Each item expands into the segment contract, current-state behavior, and the motion details that affect usage."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/radix-base-ui/breadcrumbs/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/radix-base-ui/breadcrumbs"
      preview={
        <div className="flex min-h-[280px] items-center justify-center">
          <Breadcrumbs items={demoItems} />
        </div>
      }
      title="Breadcrumbs"
      usageCode={usageCode}
      usageDescription="Use the minimal trail below as the baseline, then expand into icons, current-state styling, and custom separators through the API details."
    />
  );
}
