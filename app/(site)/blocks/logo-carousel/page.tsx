"use client";

import Image from "next/image";

import { logosCarouselApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { LogosCarousel } from "@/registry/logo-carousal";

const usageCode = `"use client";

import Image from "next/image";

import { LogosCarousel } from "@/components/ui/logo-carousal";

export function LogosCarouselPreview() {
  return (
    <LogosCarousel columnCount={4} className="w-full max-w-2xl gap-8">
      <Image src="/sponsors/vercel-light.svg" alt="Vercel" width={120} height={40} className="dark:hidden" />
      <Image src="/sponsors/vercel-dark.svg" alt="Vercel" width={120} height={40} className="hidden dark:block" />
      <Image src="/sponsors/Mintlify-light.svg" alt="Mintlify" width={120} height={40} className="dark:hidden" />
      <Image src="/sponsors/Mintlify-dark.svg" alt="Mintlify" width={120} height={40} className="hidden dark:block" />
      <Image src="/sponsors/wordmark-logo-green.svg" alt="Wordmark" width={120} height={40} />
    </LogosCarousel>
  );
}`;

const sponsors = [
  { id: "vercel", src: "/sponsors/vercel-light.svg", alt: "Vercel" },
  { id: "mintlify", src: "/sponsors/Mintlify-light.svg", alt: "Mintlify" },
  { id: "wordmark", src: "/sponsors/wordmark-logo-green.svg", alt: "Wordmark" },
  { id: "vercel-2", src: "/sponsors/vercel-light.svg", alt: "Vercel" },
  { id: "mintlify-2", src: "/sponsors/Mintlify-light.svg", alt: "Mintlify" },
  {
    id: "wordmark-2",
    src: "/sponsors/wordmark-logo-green.svg",
    alt: "Wordmark",
  },
  { id: "vercel-3", src: "/sponsors/vercel-light.svg", alt: "Vercel" },
  { id: "mintlify-3", src: "/sponsors/Mintlify-light.svg", alt: "Mintlify" },
];

function LogosCarouselPreview() {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-6 py-12">
      <LogosCarousel className="w-full gap-8" columnCount={4}>
        {sponsors.map((logo) => (
          <Image
            alt={logo.alt}
            className="brightness-0 dark:invert"
            height={40}
            key={logo.id}
            src={logo.src}
            width={120}
          />
        ))}
      </LogosCarousel>
    </div>
  );
}

export default function LogosCarouselPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Logo Carousel" },
      ]}
      componentName="logo-carousal"
      description="Multi-column logo grid that cycles through sponsor logos with a staggered wave animation."
      details={logosCarouselApiDetails}
      detailsDescription="LogosCarousel distributes its children evenly across N columns and advances every column simultaneously on a fixed interval. Adjacent columns fire with a small stagger so transitions ripple across the grid like a wave. Animation is paused when the component scrolls out of view or the page loses focus, and collapses to an instant swap under reduced motion."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/logo-carousel/page.tsx`}
      itemSlug="logo-carousal"
      pageUrl="/blocks/logo-carousel"
      preview={<LogosCarouselPreview />}
      previewClassName="min-h-[20rem]"
      previewDescription="Each column independently cycles through its assigned logos on a 1.6 s interval. The swap ripples left-to-right with a 125 ms stagger between columns, so all four logos never change at the same moment."
      title="Logo Carousel"
      usageCode={usageCode}
      usageDescription="Wrap any set of logo elements inside `LogosCarousel`. The component distributes them automatically across `columnCount` columns (default 4) and cycles them on a fixed interval. Flip the `direction` prop to `rtl` to reverse the ripple."
    />
  );
}
