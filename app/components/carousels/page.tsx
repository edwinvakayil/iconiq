"use client";

import { carouselApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Carousel, type Testimonial } from "@/registry/carousels";

const usageCode = `import { Carousel, type Testimonial } from "@/components/ui/carousels";

const testimonials: Testimonial[] = [
  {
    quote: "The registry dropped straight into our product workflow and gave the team a faster review loop.",
    name: "Mira",
    handle: "@mira",
    initials: "MI",
  },
  {
    quote: "We kept the source in our own codebase, adjusted the styling, and shipped without waiting on upstream changes.",
    name: "Andre",
    handle: "@andre",
    initials: "AN",
  },
  {
    quote: "The motion feels refined, and the interaction is simple enough to adapt to a range of product surfaces.",
    name: "Leah",
    handle: "@leah",
    initials: "LE",
  },
];

export function CustomerCarousel() {
  return <Carousel testimonials={testimonials} />;
}`;

const previewTestimonials: Testimonial[] = [
  {
    quote:
      "Go confidently in the direction of your dreams. Live the life you have imagined.",
    avatar: "/assets/av1.png",
    name: "Henry David Thoreau",
    handle: "@hdthoreau",
    initials: "HT",
  },
  {
    quote:
      "Far away there in the sunshine are my highest aspirations. I may not reach them, but I can look up.",
    avatar: "/assets/av2.png",
    name: "Louisa May Alcott",
    handle: "@lmalcott",
    initials: "LA",
  },
  {
    quote:
      "Be not afraid of greatness: some are born great, some achieve greatness, and some have greatness thrust upon them.",
    avatar: "/assets/av3.png",
    name: "William Shakespeare",
    handle: "@wshakespeare",
    initials: "WS",
  },
];

function CarouselPreview() {
  return (
    <div className="flex min-h-[320px] w-full flex-col items-center justify-center gap-6 px-4 py-10">
      <div className="w-full max-w-[21.5rem]">
        <Carousel testimonials={previewTestimonials} />
      </div>
      <p className="max-w-[23.5rem] text-center text-[13px] text-secondary leading-6">
        Drag across the panel or use the controls to inspect the spring
        transition, pagination state, and swipe threshold behavior.
      </p>
    </div>
  );
}

export default function CarouselsPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Carousel" },
      ]}
      componentName="carousels"
      description="Swipeable testimonial carousel with spring-driven slide transitions, compact pagination dots, and next/previous arrow controls."
      details={carouselApiDetails}
      preview={<CarouselPreview />}
      previewDescription="Swipe the card or use the arrows and dots to test the built-in direction state, animated slide transitions, and pagination controls."
      title="Carousel"
      usageCode={usageCode}
      usageDescription="Pass your own testimonial array into the component and let the built-in gesture, pagination, and arrow controls handle the interaction shell."
    />
  );
}
