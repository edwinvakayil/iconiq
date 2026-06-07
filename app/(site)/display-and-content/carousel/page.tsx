"use client";

import { useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { carouselApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import {
  buildCarouselPreviewCode,
  carouselPreviewSlides,
} from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";
import {
  Carousel,
  type CarouselAspectRatio,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/carousel";

const aspectRatioOptions: { label: string; value: CarouselAspectRatio }[] = [
  { label: "16:9", value: "video" },
  { label: "4:3", value: "4/3" },
  { label: "3:2", value: "3/2" },
  { label: "1:1", value: "square" },
  { label: "3:4", value: "portrait" },
];

type CarouselPreviewProps = {
  aspectRatio: CarouselAspectRatio;
  onAspectRatioChange: (aspectRatio: CarouselAspectRatio) => void;
};

function CarouselPreview({
  aspectRatio,
  onAspectRatioChange,
}: CarouselPreviewProps) {
  return (
    <div className="flex w-full flex-col items-center gap-6 px-12 py-10">
      <fieldset
        aria-label="Carousel aspect ratio"
        className="m-0 flex flex-wrap items-center justify-center gap-4 border-0 p-0"
      >
        {aspectRatioOptions.map((option) => {
          const isSelected = aspectRatio === option.value;

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                "text-xs tabular-nums transition-colors",
                isSelected
                  ? "font-medium text-foreground"
                  : "font-light text-muted-foreground hover:text-foreground"
              )}
              key={option.value}
              onClick={() => onAspectRatioChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </fieldset>
      <Carousel
        aspectRatio={aspectRatio}
        className="w-full max-w-md sm:max-w-lg"
      >
        <CarouselContent>
          {carouselPreviewSlides.map((slide) => (
            <CarouselItem key={slide}>
              <div className="flex h-full items-center justify-center p-1">
                <p className="text-balance px-6 text-center font-light text-lg text-muted-foreground leading-snug">
                  {slide}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default function CarouselPage() {
  const [aspectRatio, setAspectRatio] = useState<CarouselAspectRatio>("video");
  const previewCode = buildCarouselPreviewCode(aspectRatio);

  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Display & Content" },
        { label: "Carousel" },
      ]}
      componentName="carousel"
      description="Embla-powered carousel with aspect-ratio presets and horizontal or vertical slides."
      details={carouselApiDetails}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/carousel/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/carousel"
      preview={
        <CarouselPreview
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
        />
      }
      previewClassName="min-h-[12rem] overflow-visible"
      previewCode={previewCode}
      title="Carousel"
      usageCode={previewCode}
      usageDescription="Set `aspectRatio` on `Carousel` (`video`, `square`, `4/3`, `3/2`, `portrait`, or a custom ratio like `21/9`) to shape the slide viewport. Compose `CarouselContent` and `CarouselItem` for the track, then add `CarouselPrevious` and `CarouselNext`."
      v0PageCode={buildCarouselPreviewCode(aspectRatio, "v0")}
    />
  );
}
