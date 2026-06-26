"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-chart-1:oklch(0.68_0.17_250)]";

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

const AUTOPLAY_DEFAULT_DELAY_MS = 4000;

type CarouselAspectRatio = keyof typeof carouselAspectRatioClasses;

type CarouselNavPlacement = "outside" | "responsive";

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  aspectRatio?: CarouselAspectRatio | `${number}/${number}`;
  navPlacement?: CarouselNavPlacement;
  autoplay?: boolean | number;
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

  return undefined;
}

function getCarouselAspectRatioStyle(
  aspectRatio?: CarouselProps["aspectRatio"]
): React.CSSProperties | undefined {
  if (!aspectRatio || aspectRatio in carouselAspectRatioClasses) {
    return undefined;
  }

  if (CUSTOM_ASPECT_RATIO_PATTERN.test(aspectRatio)) {
    const [width, height] = aspectRatio.split("/");

    return {
      aspectRatio: `${width} / ${height}`,
    };
  }

  return undefined;
}

function getAutoplayDelay(autoplay: boolean | number) {
  return typeof autoplay === "number" ? autoplay : AUTOPLAY_DEFAULT_DELAY_MS;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.isContentEditable ||
      target.closest(
        "input, textarea, select, [contenteditable=''], [contenteditable='true']"
      )
  );
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnapCount: number;
  navPlacement: CarouselNavPlacement;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

const CarouselSlideIndexContext = React.createContext<number | undefined>(
  undefined
);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const carouselNavPositionClasses = {
  horizontal: {
    responsive: {
      previous:
        "top-full right-10 mt-1.5 sm:top-1/2 sm:right-auto sm:mt-0 sm:-left-12 sm:-translate-y-1/2",
      next: "top-full right-0 mt-1.5 sm:top-1/2 sm:-right-12 sm:mt-0 sm:-translate-y-1/2",
    },
    outside: {
      previous: "top-1/2 -left-12 -translate-y-1/2",
      next: "top-1/2 -right-12 -translate-y-1/2",
    },
  },
  vertical: {
    responsive: {
      previous:
        "top-2 left-1/2 -translate-x-1/2 rotate-90 sm:-top-12 sm:translate-y-0",
      next: "bottom-2 left-1/2 -translate-x-1/2 rotate-90 sm:-bottom-12 sm:translate-y-0",
    },
    outside: {
      previous: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
      next: "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
    },
  },
} as const;

function getNavPlacementClasses(
  placement: CarouselNavPlacement,
  orientation: "horizontal" | "vertical",
  direction: "previous" | "next"
) {
  return carouselNavPositionClasses[orientation][placement][direction];
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  aspectRatio = "video",
  navPlacement = "responsive",
  autoplay,
  className,
  children,
  "aria-label": ariaLabel = "Carousel",
  ...props
}: React.ComponentProps<"section"> & CarouselProps) {
  const resolvedOrientation =
    orientation || (opts?.axis === "y" ? "vertical" : "horizontal");
  const emblaOptions = React.useMemo(
    () => ({
      ...opts,
      loop: Boolean(opts?.loop),
      axis:
        resolvedOrientation === "horizontal" ? ("x" as const) : ("y" as const),
    }),
    [opts, resolvedOrientation]
  );
  const optsRef = React.useRef(emblaOptions);
  optsRef.current = emblaOptions;
  const autoplayPausedUntilRef = React.useRef(0);
  const isAutoAdvancingRef = React.useRef(false);

  const [carouselRef, api] = useEmblaCarousel(emblaOptions, plugins);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnapCount, setScrollSnapCount] = React.useState(0);

  const onSelect = React.useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;

    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
    setSelectedIndex(carouselApi.selectedScrollSnap());
    setScrollSnapCount(carouselApi.scrollSnapList().length);
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const pauseAutoplay = React.useCallback(() => {
    if (!autoplay) return;

    autoplayPausedUntilRef.current = Date.now() + getAutoplayDelay(autoplay);
  }, [autoplay]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      const isVertical = resolvedOrientation === "vertical";

      if (!isVertical && event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
        return;
      }

      if (!isVertical && event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
        return;
      }

      if (isVertical && event.key === "ArrowUp") {
        event.preventDefault();
        scrollPrev();
        return;
      }

      if (isVertical && event.key === "ArrowDown") {
        event.preventDefault();
        scrollNext();
      }
    },
    [resolvedOrientation, scrollNext, scrollPrev]
  );

  React.useEffect(() => {
    if (!setApi) return;

    if (api) {
      setApi(api);
    }
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  React.useEffect(() => {
    if (!(api && autoplay)) return;

    const delay = getAutoplayDelay(autoplay);

    const onPointerDown = () => {
      pauseAutoplay();
    };

    const onManualSelect = () => {
      if (isAutoAdvancingRef.current) {
        isAutoAdvancingRef.current = false;
        return;
      }

      pauseAutoplay();
    };

    api.on("pointerDown", onPointerDown);
    api.on("select", onManualSelect);

    const intervalId = window.setInterval(() => {
      if (Date.now() < autoplayPausedUntilRef.current) {
        return;
      }

      if (api.canScrollNext()) {
        isAutoAdvancingRef.current = true;
        api.scrollNext();
        return;
      }

      if (optsRef.current.loop) {
        isAutoAdvancingRef.current = true;
        api.scrollTo(0);
      }
    }, delay);

    return () => {
      api.off("pointerDown", onPointerDown);
      api.off("select", onManualSelect);
      window.clearInterval(intervalId);
    };
  }, [api, autoplay, pauseAutoplay]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation: resolvedOrientation,
        aspectRatio,
        navPlacement,
        autoplay,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnapCount,
        setApi,
      }}
    >
      <section
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        className={cn(
          componentThemeClassName,
          "relative outline-none",
          className
        )}
        data-slot="carousel"
        onKeyDown={handleKeyDown}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: carousel keyboard navigation requires a focusable region
        tabIndex={0}
        {...props}
      >
        <div aria-atomic="true" aria-live="polite" className="sr-only">
          {scrollSnapCount > 0
            ? `Slide ${selectedIndex + 1} of ${scrollSnapCount}`
            : null}
        </div>
        {children}
      </section>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { carouselRef, orientation, aspectRatio } = useCarousel();
  const aspectClassName = getCarouselAspectRatioClassName(aspectRatio);
  const aspectStyle = getCarouselAspectRatioStyle(aspectRatio);
  const panClassName =
    orientation === "horizontal" ? "touch-pan-y" : "touch-pan-x";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        panClassName,
        aspectClassName
      )}
      data-slot="carousel-content"
      ref={carouselRef}
      style={aspectStyle}
    >
      <div
        className={cn(
          "flex select-none",
          aspectClassName || aspectStyle ? "h-full" : undefined,
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) {
            return child;
          }

          return (
            <CarouselSlideIndexContext.Provider
              key={child.key ?? index}
              value={index}
            >
              {child}
            </CarouselSlideIndexContext.Provider>
          );
        })}
      </div>
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const slideIndex = React.useContext(CarouselSlideIndexContext);
  const { orientation, aspectRatio, selectedIndex } = useCarousel();
  const hasAspectRatio = Boolean(
    getCarouselAspectRatioClassName(aspectRatio) ||
      getCarouselAspectRatioStyle(aspectRatio)
  );
  const isActive = slideIndex !== undefined && slideIndex === selectedIndex;

  return (
    // biome-ignore lint/a11y/useSemanticElements: fieldset implies form grouping, not slide content
    <div
      aria-hidden={slideIndex === undefined ? undefined : !isActive}
      aria-label={
        slideIndex === undefined ? undefined : `Slide ${slideIndex + 1}`
      }
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        hasAspectRatio && "h-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      data-slot="carousel-item"
      role="group"
      {...props}
    />
  );
}

const carouselNavButtonClassName =
  "absolute z-10 inline-flex size-8 touch-manipulation items-center justify-center rounded-full bg-muted/70 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35 sm:size-9 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 sm:[&_svg]:size-[1.125rem]";

function CarouselNavButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(carouselNavButtonClassName, className)}
      type="button"
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const {
    orientation = "horizontal",
    navPlacement = "responsive",
    scrollPrev,
    canScrollPrev,
  } = useCarousel();
  const placementClassName = getNavPlacementClasses(
    navPlacement,
    orientation,
    "previous"
  );

  return (
    <CarouselNavButton
      className={cn(placementClassName, className)}
      data-slot="carousel-previous"
      disabled={!canScrollPrev}
      onClick={(event) => {
        scrollPrev();
        onClick?.(event);
      }}
      {...props}
    >
      <ChevronLeftIcon className="cn-rtl-flip" strokeWidth={2.25} />
      <span className="sr-only">Previous slide</span>
    </CarouselNavButton>
  );
}

function CarouselNext({
  className,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const {
    orientation = "horizontal",
    navPlacement = "responsive",
    scrollNext,
    canScrollNext,
  } = useCarousel();
  const placementClassName = getNavPlacementClasses(
    navPlacement,
    orientation,
    "next"
  );

  return (
    <CarouselNavButton
      className={cn(placementClassName, className)}
      data-slot="carousel-next"
      disabled={!canScrollNext}
      onClick={(event) => {
        scrollNext();
        onClick?.(event);
      }}
      {...props}
    >
      <ChevronRightIcon className="cn-rtl-flip" strokeWidth={2.25} />
      <span className="sr-only">Next slide</span>
    </CarouselNavButton>
  );
}

export {
  type CarouselApi,
  type CarouselAspectRatio,
  type CarouselNavPlacement,
  type CarouselOptions,
  type CarouselPlugin,
  type CarouselProps,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
