"use client";

import { useState } from "react";
import { streamingTextApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { StreamingText } from "@/registry/streaming-text";

const usageCode = `import { StreamingText } from "@/components/ui/streaming-text";

export function AssistantReply() {
  return (
    <StreamingText
      className="text-sm leading-relaxed"
      text="Design is not just what it looks like — design is how it works."
    />
  );
}`;

const previewText =
  "Great interfaces feel alive because every word earns its place — arriving softly, settling quietly, and leaving the reader with nothing but the message.";

function StreamingTextPreview() {
  const [run, setRun] = useState(0);

  return (
    <div className="flex w-full max-w-md flex-col gap-6 py-10">
      {/* A user message for context, so the streamed text reads as an AI
          reply the way it would in a real chat interface. */}
      <div className="self-end rounded-2xl rounded-br-md bg-muted px-4 py-2.5 text-[13px] text-foreground">
        What makes a great interface feel alive?
      </div>
      <StreamingText
        className="self-start px-1 text-[13px] leading-relaxed"
        key={run}
        text={previewText}
      />
      <button
        className="self-start px-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
        onClick={() => setRun((r) => r + 1)}
        type="button"
      >
        Replay ↺
      </button>
    </div>
  );
}

export default function StreamingTextPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Streaming Text" },
      ]}
      componentName="streaming-text"
      description="Minimal AI text streaming with a magic-ink effect: each word fades in wearing a blue gradient, then settles into the theme's foreground once it lands."
      details={streamingTextApiDetails}
      detailsDescription="StreamingText reveals its text one word at a time on a fixed cadence. Each arriving word is stacked twice in an inline grid: a blue gradient copy on top and a theme-foreground copy underneath. The word fades in with a plain opacity tween — no movement or blur, so the glyphs stay crisp and the baseline never wobbles; after the settle delay the gradient copy crossfades out and the foreground copy fades in — black in light mode, white in dark — so the trail of blue always marks what just arrived. A small gradient dot pulses at the stream head while words are still landing and pops away when the stream completes. Screen readers get the full text once via an sr-only span while the animated display stays decorative, and under prefers-reduced-motion the whole stream is skipped in favor of static text."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/streaming-text/page.tsx`}
      itemSlug="streaming-text"
      pageUrl="/blocks/streaming-text"
      preview={<StreamingTextPreview />}
      previewClassName="min-h-[20rem]"
      previewDescription="The stream plays as an AI reply beneath a sent message. Watch each word fade in blue, glow for a beat, then quietly settle into plain text behind the moving stream head — hit Replay to run it again."
      railNotes={[
        "Self-contained — the component needs only Motion and your `cn` helper.",
        "Typography is fully inherited: size, weight, and line-height come from `className` or the parent.",
        "Change the `text` prop (or remount with a `key`) to restart the stream.",
        "Reduced motion renders the full text statically with no gradient or cursor.",
      ]}
      title="Streaming Text"
      usageCode={usageCode}
      usageDescription="Drop it wherever an AI reply lands and pass the full text — the component paces the reveal itself. Tune the cadence with `speed`, hold the blue gradient longer with `settleDelay`, and hide the stream-head dot with `showCursor={false}`. Use `onComplete` to chain follow-up UI once the last word has settled."
    />
  );
}
