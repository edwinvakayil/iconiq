"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

const carouselAspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  portrait: "aspect-[3/4]",
} as const;

const CUSTOM_ASPECT_RATIO_PATTERN = /^\d+(\.\d+)?\/\d+(\.\d+)?$/;

type CarouselAspectRatio = keyof typeof carouselAspectRatioClasses;

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  aspectRatio?: CarouselAspectRatio | `${number}/${number}`;
  setApi?: (api: CarouselApi) => void;
};

function getCarouselAspectRatioClassName(
  aspectRatio?: CarouselProps["aspectRatio"]
) {
  if (!aspectRatio) {
    return undefined;
  }

  if (aspectRatio in carouselAspectRatioClasses) {
    return carouselAspectRatioClasses[aspectRatio as CarouselAspectRatio];
  }

  if (CUSTOM_ASPECT_RATIO_PATTERN.test(aspectRatio)) {
    return `aspect-[${aspectRatio}]`;
  }

  return undefined;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  aspectRatio,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!(api && setApi)) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        aspectRatio,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <section
        aria-label="Carousel"
        className={cn("relative cursor-pointer", className)}
        data-slot="carousel"
        onKeyDownCapture={handleKeyDown}
        {...props}
      >
        {children}
      </section>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation, aspectRatio } = useCarousel();
  const aspectClassName = getCarouselAspectRatioClassName(aspectRatio);

  return (
    <div
      className={cn(
        "cursor-pointer overflow-hidden rounded-lg border border-border",
        aspectClassName
      )}
      data-slot="carousel-content"
      ref={carouselRef}
    >
      <div
        className={cn(
          "flex",
          aspectClassName && "h-full",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({
  className,
  ...props
}: React.ComponentProps<"fieldset">) {
  const { orientation, aspectRatio } = useCarousel();
  const hasAspectRatio = Boolean(getCarouselAspectRatioClassName(aspectRatio));

  return (
    <fieldset
      className={cn(
        "m-0 min-w-0 shrink-0 grow-0 basis-full cursor-pointer border-0 p-0",
        hasAspectRatio && "h-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      data-slot="carousel-item"
      {...props}
    />
  );
}

const carouselNavButtonClassName =
  "absolute z-10 touch-manipulation rounded-full border-0 bg-muted text-foreground shadow-none hover:bg-muted/80 disabled:opacity-40 [&_svg]:size-5";

function CarouselPrevious({
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      className={cn(
        carouselNavButtonClassName,
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      data-slot="carousel-previous"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      size={size}
      variant={variant}
      {...props}
    >
      <ChevronLeftIcon className="cn-rtl-flip" strokeWidth={2.25} />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      className={cn(
        carouselNavButtonClassName,
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      data-slot="carousel-next"
      disabled={!canScrollNext}
      onClick={scrollNext}
      size={size}
      variant={variant}
      {...props}
    >
      <ChevronRightIcon className="cn-rtl-flip" strokeWidth={2.25} />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  type CarouselApi,
  type CarouselAspectRatio,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
