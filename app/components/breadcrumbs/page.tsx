import { Home } from "lucide-react";
import { BreadcrumbsPreview } from "@/components/breadcrumbs-preview";
import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import type { BreadcrumbItem } from "@/registry/breadcrumbs";

const demoItems: BreadcrumbItem[] = [
  { label: "Home", href: "/", icon: <Home className="h-3.5 w-3.5" /> },
  { label: "Docs", href: "/" },
  { label: "Components", href: "/components/alert" },
  { label: "Breadcrumb" },
];

const BREADCRUMBS_CODE = `import { AnimatedBreadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Home } from "lucide-react";

const items: BreadcrumbItem[] = [
  { label: "Home", href: "/", icon: <Home className="h-3.5 w-3.5" /> },
  { label: "Docs", href: "/" },
  { label: "Components", href: "/components/alert" },
  { label: "Breadcrumb" },
];

export function Example() {
  return <AnimatedBreadcrumbs items={items} />;
}`;

const BREADCRUMBS_PROPS = [
  {
    name: "items",
    type: "BreadcrumbItem[]",
    desc: "Array of items with label, optional href, and optional icon. The last item is the current page (no link).",
  },
  {
    name: "className",
    type: "string",
    desc: "Optional class applied to the nav wrapper.",
  },
];

export default function BreadcrumbPage() {
  return (
    <ComponentDocsLayout
      codeSample={BREADCRUMBS_CODE}
      componentName="breadcrumbs"
      description="Animated breadcrumb navigation with spring transitions, hover feedback, and a subtle shimmer on the current item. Built with Framer Motion."
      previewChildren={<BreadcrumbsPreview items={demoItems} />}
      previewDescription="Use it for page hierarchy and back-navigation. Pass an array of items with label and optional href and icon."
      propsRows={BREADCRUMBS_PROPS}
      propsTag="breadcrumbs"
      title="Breadcrumb"
    />
  );
}
