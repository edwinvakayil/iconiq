"use client";

import {
  BreadcrumbsPlaygroundProvider,
  getBreadcrumbsDefaultUsageCode,
} from "@/app/(site)/navigation/breadcrumbs/_components/breadcrumbs-playground";
import { breadcrumbsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const IMPORT_PATH = "@/components/ui/breadcrumbs";

export default function BreadcrumbsPage() {
  return (
    <BreadcrumbsPlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Navigation" },
            { label: "Breadcrumbs" },
          ]}
          componentName="breadcrumbs"
          description="Clear path navigation for nested pages and flows."
          details={breadcrumbsApiDetails}
          detailsDescription="Compound parts cover semantics, links, current-page state, separators, ellipsis menus, optional items-array rendering, JSON-LD, and Motion transitions across the trail."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/navigation/breadcrumbs/page.tsx`}
          pageUrl="/navigation/breadcrumbs"
          preview={preview}
          previewClassName="min-h-[220px]"
          previewDescription="Use the playground to switch between the items API and compound parts, collapse long paths, separators, icons, and truncation."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Breadcrumbs"
          railNotes={[
            "Use Breadcrumbs with an items array for quick trails, or compose the parts directly for full control.",
            "Pass maxItems to collapse middle segments into an ellipsis menu on long paths.",
            "Pair siteUrl with BreadcrumbJsonLd for structured breadcrumb metadata.",
          ]}
          title="Breadcrumbs"
          usageCode={getBreadcrumbsDefaultUsageCode(IMPORT_PATH)}
          usageDescription="Start with the items API for common trails, then drop into the compound parts for custom separators, router links, and manual ellipsis menus."
          v0PageCode={getBreadcrumbsDefaultUsageCode(IMPORT_PATH)}
        />
      )}
    </BreadcrumbsPlaygroundProvider>
  );
}
