"use client";

import { infiniteRibbonApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { infiniteRibbonPreviewCode } from "@/lib/component-v0-pages";
import { InfiniteRibbon } from "@/registry/infiniteribbon";

const ribbonText =
  "Craft crisp dashboards, lively landing pages, and polished product flows with components that feel ready from the first click.";

const usageCode = `"use client";

import { InfiniteRibbon } from "@/components/ui/infiniteribbon";

export function InfiniteRibbonPreview() {
  return (
    <>
      <InfiniteRibbon className="absolute" duration={42} rotation={5}>
        Craft crisp dashboards, lively landing pages, and polished product flows
        with components that feel ready from the first click.
      </InfiniteRibbon>
      <InfiniteRibbon duration={42} reverse={true} rotation={-5}>
        Craft crisp dashboards, lively landing pages, and polished product flows
        with components that feel ready from the first click.
      </InfiniteRibbon>
    </>
  );
}`;

function InfiniteRibbonPreview() {
  return (
    <>
      <InfiniteRibbon className="absolute" duration={42} rotation={5}>
        {ribbonText}
      </InfiniteRibbon>
      <InfiniteRibbon duration={42} reverse={true} rotation={-5}>
        {ribbonText}
      </InfiniteRibbon>
    </>
  );
}

export default function InfiniteRibbonPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Special One" },
        { label: "Infinite Ribbon" },
      ]}
      componentName="infiniteribbon"
      description="A full-width looping ribbon for announcement strips, launch banners, and kinetic section dividers. It repeats the supplied content into a seamless track and can run in either direction."
      details={infiniteRibbonApiDetails}
      preview={<InfiniteRibbonPreview />}
      previewClassName="relative min-h-[20rem] overflow-hidden px-0 md:px-0 [&>div]:relative"
      title="Infinite Ribbon"
      usageCode={usageCode}
      usageDescription="Render one or more `InfiniteRibbon` instances with your announcement copy. Use `reverse` to change direction and `rotation` to create crossed banner layouts."
      v0PageCode={infiniteRibbonPreviewCode}
    />
  );
}
