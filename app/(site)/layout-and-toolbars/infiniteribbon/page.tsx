"use client";

import {
  generateInfiniteRibbonCode,
  INFINITE_RIBBON_DEFAULT_STATE,
  InfiniteRibbonPlaygroundProvider,
} from "@/app/(site)/layout-and-toolbars/infiniteribbon/_components/infiniteribbon-playground";
import { infiniteRibbonApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { infiniteRibbonPreviewCode } from "@/lib/component-v0-pages";
import * as InfiniteRibbonModule from "@/registry/infiniteribbon";

const IMPORT_PATH = "@/components/ui/infiniteribbon";

const usageCode = generateInfiniteRibbonCode(
  INFINITE_RIBBON_DEFAULT_STATE,
  IMPORT_PATH
);

export default function InfiniteRibbonPage() {
  return (
    <InfiniteRibbonPlaygroundProvider
      InfiniteRibbonModule={InfiniteRibbonModule}
      importPath={IMPORT_PATH}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Layout & Toolbars" },
            { label: "Infinite Ribbon" },
          ]}
          componentName="infiniteribbon"
          description="Looping marquee for banners and dividers—theme-aware, accessible, and seamless on any viewport width."
          details={infiniteRibbonApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/layout-and-toolbars/infiniteribbon/page.tsx`}
          fullWidthPreview
          itemSlug="infiniteribbon"
          pageUrl="/layout-and-toolbars/infiniteribbon"
          preview={preview}
          previewClassName="h-full min-h-[24rem] overflow-hidden bg-white p-0 dark:bg-background"
          previewDescription="Use the playground to tune variants, motion, spacing, link banners, crossed layouts, and accessibility behavior."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Infinite Ribbon"
          railNotes={[
            "Repeat count auto-expands to fill wide viewports so the loop never shows empty bands.",
            "Set `speed` when you want consistent pixel velocity regardless of copy length.",
            "Pass `href` for clickable banners—the first link stays keyboard focusable.",
            "Reduced-motion users see a static, centered copy instead of the animated track.",
          ]}
          title="Infinite Ribbon"
          usageCode={usageCode}
          usageDescription="Render one or more `InfiniteRibbon` instances with announcement copy or an `items` array. Use `reverse` and `rotation` for crossed banner layouts, `variant` for tone, and `fadeEdges` for soft viewport masks."
          v0PageCode={infiniteRibbonPreviewCode}
        />
      )}
    </InfiniteRibbonPlaygroundProvider>
  );
}
