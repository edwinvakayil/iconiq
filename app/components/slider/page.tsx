import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import { AnimatedSlider } from "@/registry/slider";

const SLIDER_CODE = `import { AnimatedSlider } from "@/components/ui/slider";

export function Example() {
  return (
    <div className="w-full max-w-md space-y-6">
      <AnimatedSlider defaultValue={[50]} />
      <AnimatedSlider defaultValue={[75]} unit="%" />
      <AnimatedSlider min={0} max={500} defaultValue={[200]} unit=" px" />
    </div>
  );
}`;

const SLIDER_PROPS = [
  {
    name: "AnimatedSlider",
    type: "extends Radix Slider.Root",
    desc: 'min, max, value/defaultValue, onValueChange. Optional showValue (default true), unit (e.g. "%"), and className.',
  },
];

function SliderPreview() {
  return (
    <div className="max-w-md space-y-8">
      <div>
        <p className="mb-2 text-[13px] text-muted-foreground">
          Default (0–100)
        </p>
        <AnimatedSlider defaultValue={[50]} />
      </div>
      <div>
        <p className="mb-2 text-[13px] text-muted-foreground">
          With unit (e.g. %)
        </p>
        <AnimatedSlider defaultValue={[75]} unit="%" />
      </div>
      <div>
        <p className="mb-2 text-[13px] text-muted-foreground">
          Custom range (0–500)
        </p>
        <AnimatedSlider defaultValue={[200]} max={500} min={0} unit=" px" />
      </div>
    </div>
  );
}

export default function SliderPage() {
  return (
    <ComponentDocsLayout
      codeSample={SLIDER_CODE}
      componentName="slider"
      description="An animated range slider with shimmer, hover/drag feedback, and optional floating value tooltip. Uses Radix UI and Framer Motion."
      previewChildren={<SliderPreview />}
      previewDescription="Drag the thumb or hover to see the value tooltip. The track has a subtle shimmer and the thumb scales on hover and drag."
      propsRows={SLIDER_PROPS}
      propsTag="slider"
      title="Slider"
    />
  );
}
