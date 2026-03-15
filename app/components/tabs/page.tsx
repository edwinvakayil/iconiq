"use client";

import { useState } from "react";
import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import AnimatedTabs from "@/registry/tabs";

const TABS = ["Overview", "Integrations", "Activity", "Settings"];

const TABS_CODE = `import { useState } from "react";
import AnimatedTabs from "@/components/ui/tabs";

export default function Demo() {
  const [value, setValue] = useState("Overview");

  return (
    <>
      {/* Spotlight: outlined capsule */}
      <AnimatedTabs
        variant="spotlight"
        value={value}
        onValueChange={setValue}
      />

      {/* Underline */}
      <AnimatedTabs
        variant="underline"
        value={value}
        onValueChange={setValue}
      />

      {/* Chip: solid inverted */}
      <AnimatedTabs
        variant="chip"
        value={value}
        onValueChange={setValue}
      />
    </>
  );
}`;

const TABS_PROPS = [
  {
    name: "variant",
    type: '"pill" | "underline" | "ghost"',
    desc: 'Visual style. "pill" = filled track with sliding pill; "underline" = bottom border indicator; "ghost" = subtle background on active.',
  },
  {
    name: "value",
    type: "string",
    desc: "The currently active tab (must match one of the items in tabs).",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    desc: "Called when the user selects a tab.",
  },
  {
    name: "tabs",
    type: "string[]",
    desc: 'Optional. Tab labels. Defaults to ["Overview", "Integrations", "Activity", "Settings"].',
  },
  {
    name: "className",
    type: "string",
    desc: "Optional className for the wrapper.",
  },
];

function TabsPreview() {
  const [spotlightValue, setSpotlightValue] = useState(TABS[0]);
  const [underlineValue, setUnderlineValue] = useState(TABS[0]);
  const [chipValue, setChipValue] = useState(TABS[0]);

  return (
    <div className="space-y-12">
      <section className="space-y-3">
        <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          Spotlight
        </h3>
        <AnimatedTabs
          onValueChange={setSpotlightValue}
          tabs={TABS}
          value={spotlightValue}
          variant="spotlight"
        />
      </section>
      <section className="space-y-3">
        <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          Underline
        </h3>
        <AnimatedTabs
          onValueChange={setUnderlineValue}
          tabs={TABS}
          value={underlineValue}
          variant="underline"
        />
      </section>
      <section className="space-y-3">
        <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          Chip
        </h3>
        <AnimatedTabs
          onValueChange={setChipValue}
          tabs={TABS}
          value={chipValue}
          variant="chip"
        />
      </section>
    </div>
  );
}

export default function TabsPage() {
  return (
    <ComponentDocsLayout
      codeSample={TABS_CODE}
      componentName="tabs"
      description="Animated tabs with a spring-based sliding indicator. Three variants: spotlight, underline, and chip. Use the variant prop to choose the style. Built with Framer Motion."
      previewChildren={<TabsPreview />}
      previewDescription="Each variant is shown in its own section. Click tabs to see the indicator animate. Use variant='spotlight', variant='underline', or variant='chip' in your code."
      propsRows={TABS_PROPS}
      propsTag="tabs"
      title="Tabs"
    />
  );
}
