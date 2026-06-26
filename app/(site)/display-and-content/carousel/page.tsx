"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { CarouselPlaygroundProvider } from "@/app/(site)/display-and-content/carousel/_components/carousel-playground";
import { carouselApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { carouselPreviewSlides } from "@/lib/component-v0-pages";
import * as CarouselModule from "@/registry/carousel";

const slidesCode = carouselPreviewSlides
  .map((slide) => `  ${JSON.stringify(slide)},`)
  .join("\n");

const usageCode = `"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
${slidesCode}
] as const;

export function CarouselUsage() {
  return (
    <Carousel className="w-full max-w-md sm:max-w-lg">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex h-full items-center justify-center p-1">
              <p className="px-6 text-center font-light text-lg leading-snug text-balance text-muted-foreground">
                {slide}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}`;

const carouselExamples: VariantItem[] = [
  {
    title: "Vertical slides",
    code: `"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = ["First", "Second", "Third"] as const;

export function CarouselVertical() {
  return (
    <Carousel
      aspectRatio="portrait"
      className="max-h-[28rem] w-full max-w-xs"
      orientation="vertical"
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">{slide}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}`,
  },
  {
    title: "Loop and autoplay",
    code: `"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = ["One", "Two", "Three"] as const;

export function CarouselAutoplay() {
  return (
    <Carousel
      autoplay={5000}
      className="w-full max-w-md"
      opts={{ loop: true }}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">{slide}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}`,
  },
  {
    title: "Image slides",
    code: `"use client";

import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  { alt: "Gradient artwork", src: "/assets/gradient.png" },
  { alt: "Gradient artwork", src: "/assets/gradient.png" },
  { alt: "Gradient artwork", src: "/assets/gradient.png" },
] as const;

export function CarouselImages() {
  return (
    <Carousel aspectRatio="video" className="w-full max-w-lg">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.src + image.alt}>
            <Image
              alt={image.alt}
              className="size-full object-cover"
              height={900}
              src={image.src}
              width={1600}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}`,
  },
  {
    title: "Embla autoplay plugin",
    code: `"use client";

import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = ["One", "Two", "Three"] as const;

export function CarouselEmblaAutoplay() {
  return (
    <Carousel
      className="w-full max-w-md"
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">{slide}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}`,
  },
];

const details = carouselApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: embla-carousel-react, lucide-react.",
      "Navigation controls are built into the carousel file — no separate button install is required.",
      "Built-in `autoplay` pauses after drag or manual navigation, then resumes after the configured delay. Pair with `opts={{ loop: true }}` for continuous playback.",
      "Custom aspect ratios such as `21/9` are applied with inline `aspect-ratio` styles so Tailwind JIT does not need a safelist entry.",
      "Default `navPlacement` is `responsive`: controls sit below the carousel on the right on mobile and outside from `sm` upward.",
      "The generated registry file is /r/carousel.json.",
    ],
    registryPath: "carousel.json",
  };
});

export default function CarouselPage() {
  return (
    <CarouselPlaygroundProvider
      CarouselModule={CarouselModule}
      importPath="@/components/ui/carousel"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Carousel" },
          ]}
          componentName="carousel"
          description="Embla-powered carousel with aspect-ratio presets and responsive navigation placement."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/carousel/page.tsx`}
          examples={carouselExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="carousel"
          pageUrl="/display-and-content/carousel"
          preview={preview}
          previewClassName="min-h-[28rem] overflow-visible"
          previewDescription="Use the playground to try loop, autoplay, and nav placement on the live preview."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Carousel"
          railNotes={[
            "Set `aspectRatio` on `Carousel` to shape the viewport (`video`, `square`, presets, or custom `21/9`).",
            'Use `navPlacement="responsive"` for mobile controls below the carousel on the right, and outside placement from `sm` upward.',
            "Call `setApi` when you need a custom slide index or external indicator.",
            "Pass `autoplay` for a simple timer, or wire `embla-carousel-autoplay` through `plugins` for richer behavior.",
            "Focus the carousel region and use arrow keys; vertical carousels also respond to ArrowUp and ArrowDown.",
          ]}
          title="Carousel"
          usageCode={usageCode}
          usageDescription="Compose `CarouselContent` and `CarouselItem` for the track, then add `CarouselPrevious` and `CarouselNext`."
        />
      )}
    </CarouselPlaygroundProvider>
  );
}
