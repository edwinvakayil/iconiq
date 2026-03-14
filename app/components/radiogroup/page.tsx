import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import {
  AnimatedRadioGroup,
  AnimatedRadioGroupItem,
} from "@/registry/radiogroup";

const RADIO_CODE = `import { AnimatedRadioGroup, AnimatedRadioGroupItem } from "@/components/ui/radiogroup";

export function Example() {
  return (
    <AnimatedRadioGroup defaultValue="pro" name="plan">
      <AnimatedRadioGroupItem
        label="Starter"
        value="starter"
        description="For individuals and side projects."
      />
      <AnimatedRadioGroupItem
        label="Pro"
        value="pro"
        description="For growing teams and production apps."
      />
      <AnimatedRadioGroupItem
        label="Enterprise"
        value="enterprise"
        description="For large teams and enterprises."
      />
    </AnimatedRadioGroup>
  );
}`;

const RADIO_PROPS = [
  {
    name: "AnimatedRadioGroup",
    type: "extends Radix RadioGroup.Root",
    desc: "defaultValue, value, onValueChange, name, etc. Optional className.",
  },
  {
    name: "AnimatedRadioGroupItem",
    type: "extends Radix RadioGroup.Item",
    desc: "Requires value. Optional label, description, and className.",
  },
];

function RadioPreview() {
  return (
    <div className="max-w-md">
      <AnimatedRadioGroup defaultValue="pro" name="plan">
        <AnimatedRadioGroupItem
          description="For individuals and side projects."
          label="Starter"
          value="starter"
        />
        <AnimatedRadioGroupItem
          description="For growing teams and production apps."
          label="Pro"
          value="pro"
        />
        <AnimatedRadioGroupItem
          description="For large teams and enterprises."
          label="Enterprise"
          value="enterprise"
        />
      </AnimatedRadioGroup>
    </div>
  );
}

export default function RadioGroupPage() {
  return (
    <ComponentDocsLayout
      codeSample={RADIO_CODE}
      componentName="radiogroup"
      description="An animated radio group with staggered entrance, hover and tap feedback, and a shimmer on the selected option. Built with Radix UI and Framer Motion."
      previewChildren={<RadioPreview />}
      previewDescription="Use it for single-choice options like plan selection or preferences. Each item can have a label and optional description."
      propsRows={RADIO_PROPS}
      propsTag="radiogroup"
      title="Radio Group"
    />
  );
}
