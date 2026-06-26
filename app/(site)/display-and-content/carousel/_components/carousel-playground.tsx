"use client";

import {
  type ComponentProps,
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { carouselPreviewSlides } from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";
import type {
  CarouselAspectRatio,
  CarouselContent,
  CarouselItem,
  CarouselNavPlacement,
  CarouselNext,
  CarouselPrevious,
  CarouselProps,
} from "@/registry/carousel";

type CarouselModule = {
  Carousel: ComponentType<CarouselProps & ComponentProps<"section">>;
  CarouselContent: typeof CarouselContent;
  CarouselItem: typeof CarouselItem;
  CarouselNext: typeof CarouselNext;
  CarouselPrevious: typeof CarouselPrevious;
};

type CarouselPlaygroundState = {
  aspectRatio: CarouselAspectRatio;
  autoplay: boolean;
  loop: boolean;
  navPlacement: CarouselNavPlacement;
};

const DEFAULT_STATE: CarouselPlaygroundState = {
  aspectRatio: "video",
  autoplay: false,
  loop: false,
  navPlacement: "responsive",
};

const ASPECT_RATIO_OPTIONS: Array<{
  label: string;
  value: CarouselAspectRatio;
}> = [
  { label: "16:9", value: "video" },
  { label: "4:3", value: "4/3" },
  { label: "3:2", value: "3/2" },
  { label: "1:1", value: "square" },
  { label: "3:4", value: "portrait" },
];

const NAV_PLACEMENT_OPTIONS: Array<{
  label: string;
  value: CarouselNavPlacement;
}> = [
  { label: "Responsive", value: "responsive" },
  { label: "Outside", value: "outside" },
];

const CarouselPlaygroundContext = createContext<{
  CarouselModule: CarouselModule;
  state: CarouselPlaygroundState;
} | null>(null);

function useCarouselPlayground() {
  const context = useContext(CarouselPlaygroundContext);

  if (!context) {
    throw new Error(
      "CarouselPlayground components must be used within CarouselPlaygroundProvider."
    );
  }

  return context;
}

function buildCarouselProps(state: CarouselPlaygroundState) {
  const props: string[] = [`aspectRatio="${state.aspectRatio}"`];

  if (state.navPlacement !== "responsive") {
    props.push(`navPlacement="${state.navPlacement}"`);
  }

  props.push(`opts={{ loop: ${state.loop} }}`);

  if (state.autoplay) {
    props.push("autoplay");
  }

  return props.join(" ");
}

function generateCarouselCode(
  state: CarouselPlaygroundState,
  importPath: string
) {
  const carouselProps = buildCarouselProps(state);
  const slidesCode = carouselPreviewSlides
    .map((slide) => `  ${JSON.stringify(slide)},`)
    .join("\n");

  return `"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "${importPath}";

const slides = [
${slidesCode}
] as const;

export function CarouselDemo() {
  return (
    <Carousel ${carouselProps} className="w-full max-w-md sm:max-w-lg">
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
}

function CarouselPlaygroundPreview() {
  const { CarouselModule, state } = useCarouselPlayground();
  const {
    Carousel: CarouselRoot,
    CarouselContent: Content,
    CarouselItem: Item,
    CarouselNext: Next,
    CarouselPrevious: Previous,
  } = CarouselModule;

  const shellClassName = cn(
    "w-full max-w-md sm:max-w-lg",
    state.navPlacement === "outside" && "px-12",
    state.navPlacement === "responsive" && "sm:px-12"
  );

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 py-8">
      <CarouselRoot
        aspectRatio={state.aspectRatio}
        autoplay={state.autoplay || undefined}
        className={shellClassName}
        navPlacement={state.navPlacement}
        opts={{ loop: state.loop }}
      >
        <Content>
          {carouselPreviewSlides.map((slide) => (
            <Item key={slide}>
              <div className="flex h-full items-center justify-center p-1">
                <p className="text-balance px-6 text-center font-light text-lg text-muted-foreground leading-snug">
                  {slide}
                </p>
              </div>
            </Item>
          ))}
        </Content>
        <Previous />
        <Next />
      </CarouselRoot>
    </div>
  );
}

function CarouselPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<CarouselPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: CarouselPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Carousel"
    >
      <DocsPlaygroundSelectField
        label="Aspect ratio"
        onChange={(aspectRatio) => onChange({ aspectRatio })}
        options={ASPECT_RATIO_OPTIONS}
        value={state.aspectRatio}
      />
      <DocsPlaygroundSelectField
        label="Nav placement"
        onChange={(navPlacement) => onChange({ navPlacement })}
        options={NAV_PLACEMENT_OPTIONS}
        value={state.navPlacement}
      />
      <DocsPlaygroundToggleField
        checked={state.loop}
        label="Loop"
        onChange={(loop) => onChange({ loop })}
      />
      <DocsPlaygroundToggleField
        checked={state.autoplay}
        label="Autoplay"
        onChange={(autoplay) => onChange({ autoplay })}
      />
    </DocsPlaygroundPanel>
  );
}

type CarouselPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function CarouselPlaygroundProvider({
  CarouselModule,
  importPath,
  children,
}: {
  CarouselModule: CarouselModule;
  importPath: string;
  children: (props: CarouselPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<CarouselPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<CarouselPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateCarouselCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <CarouselPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <CarouselPlaygroundContext.Provider value={{ CarouselModule, state }}>
      {children({
        preview: <CarouselPlaygroundPreview />,
        renderSettings,
      })}
    </CarouselPlaygroundContext.Provider>
  );
}
