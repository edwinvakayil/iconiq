"use client";

import { BannerPlaygroundProvider } from "@/app/(site)/blocks/banner/_components/banner-playground";
import { bannerApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const usageCode = `import { Banner } from "@/components/ui/banner";

export function Example() {
  return (
    <Banner actionHref="/changelog" actionLabel="Learn more">
      Important message
    </Banner>
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Blocks" },
  { label: "Banner" },
];

export default function BannerPage() {
  return (
    <BannerPlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="banner"
          description="Top-of-screen announcement bar with four gradient tones and an action that morphs the bar into a confirmation pill."
          details={bannerApiDetails}
          detailsDescription="Banner renders a full-bleed announcement bar meant to sit above the page header: a ringed icon and the message sit on the left, and the outlined action button plus the dismiss X sit at the right end. Four gradient tones cover the range — the inverted default is a near-black bar that flips to white in dark mode, while info, success, and error sweep sky-to-indigo, emerald-to-teal, and rose-to-red. A soft light sheen loops across every surface continuously. When morphMessage is set, clicking the action plays the fluid morph — the full-width bar shrinks and rounds into a centered confirmation pill in one spring-driven motion while the content crossfades through a soft blur, lingers, then collapses away. Dismissing folds the banner's height shut so the page content slides up smoothly, and every animation drops to instant state changes under prefers-reduced-motion."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/banner/page.tsx`}
          fullWidthPreview
          itemSlug="banner"
          pageUrl="/blocks/banner"
          preview={preview}
          previewClassName="min-h-[20rem] overflow-visible"
          previewDescription="Use the floating sliders control in the bottom-right corner to open settings and tune the variant, action type, icon, and dismissal. The banner is centered here so it is easy to look at — in a real app it sits at the very top of the page. Pick the Morph action and click it to watch the bar melt into a confirmation pill; the banner returns a moment later so you can replay it."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Banner"
          railNotes={[
            "Use the floating sliders button in the bottom-right of the preview to open settings.",
            "Variant and action changes update the preview and Usage code together.",
            "The banner is centered in this preview for readability — in a real app it renders full-bleed at the very top of the page.",
            "Dismissed and morphed banners respawn after a moment so every animation can be replayed.",
          ]}
          title="Banner"
          usageCode={usageCode}
          usageDescription="Place the banner at the very top of your layout, above the header, or pass `fixed` to pin it to the viewport. Pick a tone with `variant`, add a CTA with `actionLabel` plus `actionHref` (link with hover arrow) or `onAction` (button), and set `morphMessage` to play the bar-to-pill morph when the action is clicked. The banner is dismissible by default — listen with `onDismiss`, or drive visibility yourself via `open`."
        />
      )}
    </BannerPlaygroundProvider>
  );
}
