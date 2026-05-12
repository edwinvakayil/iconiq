"use client";

import { carouselApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { Carousel, type Testimonial } from "@/registry/carousels";

const usageCode = `import { Carousel, type Testimonial } from "@/components/ui/carousels";

const testimonials: Testimonial[] = [
  {
    quote:
      "If one advances confidently in the direction of his dreams, and endeavors to live the life which he has imagined, he will meet with a success unexpected in common hours.",
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

export function CarouselPreview() {
  return <Carousel testimonials={testimonials} />;
}`;

const previewTestimonials: Testimonial[] = [
  {
    quote:
      "If one advances confidently in the direction of his dreams, and endeavors to live the life which he has imagined, he will meet with a success unexpected in common hours.",
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
    <div className="flex min-h-[320px] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-[21.5rem]">
        <Carousel testimonials={previewTestimonials} />
      </div>
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
      description="Swipeable testimonial carousel with spring-driven slide transitions and next/previous arrow controls."
      details={carouselApiDetails}
      preview={<CarouselPreview />}
      previewDescription="Swipe the card or use the arrows to test the built-in direction state and animated slide transitions."
      title="Carousel"
      usageCode={usageCode}
      usageDescription="Pass your own testimonial array into the component and let the built-in gesture and arrow controls handle the interaction shell."
    />
  );
}
