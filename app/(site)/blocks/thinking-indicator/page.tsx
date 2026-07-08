"use client";

import { thinkingIndicatorApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { ThinkingIndicator } from "@/registry/thinking-indicator";

const usageCode = `import { ThinkingIndicator } from "@/components/ui/thinking-indicator";

export function ChatPending() {
  return (
    <ThinkingIndicator
      className="font-medium text-sm"
      words={["Thinking", "Reasoning", "Planning", "Refining"]}
    />
  );
}`;

function ThinkingIndicatorPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 py-10">
      {/* A user message for context, so the indicator reads as a pending
          AI reply the way it would in a real chat interface. */}
      <div className="self-end rounded-2xl rounded-br-md bg-muted px-4 py-2.5 text-[13px] text-foreground">
        Explain how the event loop works
      </div>
      <ThinkingIndicator
        className="self-start px-1 font-medium text-[13px]"
        words={["Thinking", "Reasoning", "Planning", "Refining"]}
      />
    </div>
  );
}

export default function ThinkingIndicatorPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Thinking Indicator" },
      ]}
      componentName="thinking-indicator"
      description="AI loading state with a fluid morphing sparkle glyph and cycling status words that slide through a soft blur with a shimmer sweep."
      details={thinkingIndicatorApiDetails}
      detailsDescription="ThinkingIndicator is the pending state for an AI reply. The glyph is an SVG path whose keyframes — a four-point sparkle, two asymmetric blobs, a circle — share the same command structure, so the shape wobbles and melts continuously between them like a droplet while spinning on a linear rotation, instead of stepping between frames. A companion twinkle rides the same timeline: it blooms exactly when the main glyph has condensed into the circle, then fades as the sparkle re-forms. Beside it, status words cycle on an interval: each word springs in through a soft blur while the previous one slides out, and a shimmer band sweeps across the visible word on a linear loop, sized to the word's length. An invisible sizer reserves the width of the longest word so the row never shifts. The wrapper announces once via role=status with an sr-only label, and everything — morph, shimmer, cycling — drops to a static glyph and label under prefers-reduced-motion."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/thinking-indicator/page.tsx`}
      itemSlug="thinking-indicator"
      pageUrl="/blocks/thinking-indicator"
      preview={<ThinkingIndicatorPreview />}
      previewClassName="min-h-[16rem]"
      previewDescription="The indicator is shown here as a pending AI reply beneath a sent message. Watch the sparkle wobble and condense into a dot while a small twinkle blooms beside it, then flow back into shape — all while the status words trade places through a soft blur with a shimmer sweeping across each one."
      railNotes={[
        "The glyph, word cycle, and shimmer are all self-contained — the component needs only Motion and your `cn` helper.",
        "Pass your own `words` to match the product's voice, or a single word to pin the label.",
        "Set `showIcon={false}` for a text-only indicator inline before a streamed reply.",
        "Reduced motion swaps everything for a static glyph and label automatically.",
      ]}
      title="Thinking Indicator"
      usageCode={usageCode}
      usageDescription="Render it wherever the assistant's reply will appear and swap it out when the first token streams in. The component ships no copy of its own — pass the status `words` that match your product's voice. Slow the rotation down or speed it up with `interval`, and drop the glyph with `showIcon={false}` when the indicator sits inline with other chrome."
    />
  );
}
