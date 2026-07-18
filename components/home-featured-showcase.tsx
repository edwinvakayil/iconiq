"use client";

import { Camera, Paperclip, Plug } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { InlinePreviewSelect } from "@/app/(site)/components/_components/inline-preview-select";
import {
  HomeShowcasePanel,
  homeShowcaseColSpan,
} from "@/components/design/home-showcase-panel";
import { FaviconBadgeLivePreview } from "@/components/favicon-badge-live-preview";
import {
  HomeShowcaseGrid,
  HomeShowcaseRow,
} from "@/components/home-showcase-grid";
import { cn } from "@/lib/utils";
import {
  AIInput,
  type AIInputMenuItem,
  type PromptSettingGroup,
} from "@/registry/ai-input";
import { DiaText } from "@/registry/dia-text";
import { LogosCarousel } from "@/registry/logo-carousal";
import {
  Message,
  MessageBubble,
  MessageContent,
  MessageGroup,
} from "@/registry/message";
import {
  ReasoningStep,
  type ReasoningStepStatus,
  ReasoningSteps,
  ReasoningStepsContent,
  ReasoningStepsTrigger,
} from "@/registry/reasoning-steps";
import { StreamingText } from "@/registry/streaming-text";
import { ThinkingIndicator } from "@/registry/thinking-indicator";
import { Timezone } from "@/registry/timezone";

const featuredCarouselLogos = [
  { id: "vercel", src: "/sponsors/vercel-light.svg", alt: "Vercel" },
  { id: "mintlify", src: "/sponsors/Mintlify-light.svg", alt: "Mintlify" },
  { id: "wordmark", src: "/sponsors/wordmark-logo-green.svg", alt: "Wordmark" },
  { id: "vercel-2", src: "/sponsors/vercel-light.svg", alt: "Vercel" },
  { id: "mintlify-2", src: "/sponsors/Mintlify-light.svg", alt: "Mintlify" },
  {
    id: "wordmark-2",
    src: "/sponsors/wordmark-logo-green.svg",
    alt: "Wordmark",
  },
  { id: "vercel-3", src: "/sponsors/vercel-light.svg", alt: "Vercel" },
  { id: "mintlify-3", src: "/sponsors/Mintlify-light.svg", alt: "Mintlify" },
];

const timezoneZoneOptions = [
  { value: "San Francisco", label: "San Francisco" },
  { value: "New York", label: "New York" },
  { value: "London", label: "London" },
  { value: "India", label: "India" },
  { value: "Tokyo", label: "Tokyo" },
  { value: "Sydney", label: "Sydney" },
] as const;

type HomeTimezoneZone = (typeof timezoneZoneOptions)[number]["value"];

const timezoneZoneIana: Record<HomeTimezoneZone, string> = {
  "San Francisco": "America/Los_Angeles",
  "New York": "America/New_York",
  London: "Europe/London",
  India: "Asia/Kolkata",
  Tokyo: "Asia/Tokyo",
  Sydney: "Australia/Sydney",
};

function getZoneOffsetMinutes(timeZone: string, at: Date) {
  const zoned = new Date(at.toLocaleString("en-US", { timeZone }));
  return (zoned.getTime() - at.getTime()) / 60_000;
}

/** Pick the option city whose UTC offset is closest to the viewer's own
 *  timezone, so the clock opens on their local time (or the nearest city). */
function detectViewerZone(): HomeTimezoneZone {
  const fallback: HomeTimezoneZone = "San Francisco";

  try {
    const viewerZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!viewerZone) {
      return fallback;
    }

    const now = new Date();
    const viewerOffset = getZoneOffsetMinutes(viewerZone, now);

    let closest: HomeTimezoneZone = fallback;
    let closestDiff = Number.POSITIVE_INFINITY;

    for (const option of timezoneZoneOptions) {
      const diff = Math.abs(
        getZoneOffsetMinutes(timezoneZoneIana[option.value], now) - viewerOffset
      );
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = option.value;
      }
    }

    return closest;
  } catch {
    return fallback;
  }
}

const aiInputSettingGroups: PromptSettingGroup[] = [
  {
    id: "model",
    label: "Model",
    display: "featured",
    moreMenuLabel: "More models",
    options: [
      {
        value: "fable",
        label: "Fable",
        description: "Balanced for creative and everyday tasks",
      },
      {
        value: "sonnet-4.6",
        label: "Sonnet 4.6",
        description: "Most efficient for everyday tasks",
      },
      {
        value: "opus-4",
        label: "Opus 4",
        description: "Stronger reasoning for complex work",
      },
    ],
  },
  {
    id: "effort",
    label: "Effort",
    display: "submenu",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
    ],
  },
];

const aiInputDefaultSettings = { effort: "high" };

const aiInputMenuItems: AIInputMenuItem[] = [
  {
    value: "add-files",
    label: "Add files or photos",
    icon: Paperclip,
    shortcut: "⌘U",
  },
  { value: "screenshot", label: "Take a screenshot", icon: Camera },
  { value: "sep-1", type: "separator" },
  { value: "add-connector", label: "Add connector", icon: Plug },
];

function HomeAIInputShowcase() {
  return (
    <div className="flex w-full max-w-2xl flex-col justify-end px-4">
      <AIInput
        defaultSettings={aiInputDefaultSettings}
        menuItems={aiInputMenuItems}
        placeholder="Ask for follow-up changes"
        settingGroups={aiInputSettingGroups}
      />
    </div>
  );
}

function HomeThinkingIndicatorShowcase() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 p-4">
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

const messageScript = [
  {
    id: "deploy",
    align: "end",
    variant: "primary",
    text: "Deploying to prod real quick.",
  },
  {
    id: "friday",
    align: "start",
    variant: "default",
    text: "It's 4:55 PM. On a Friday.",
  },
] as const;

function HomeMessageShowcase() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleCount((current) => (current + 1) % (messageScript.length + 1));
    }, 1100);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[200px] w-full max-w-[360px] flex-col justify-end p-4">
      <MessageGroup>
        {messageScript.slice(0, visibleCount).map((message) => (
          <Message align={message.align} key={message.id}>
            <MessageContent>
              <MessageBubble variant={message.variant}>
                {message.text}
              </MessageBubble>
            </MessageContent>
          </Message>
        ))}
      </MessageGroup>
    </div>
  );
}

const reasoningSteps = [
  {
    id: "read",
    label: "Reading the request",
    description: "Parsing the question and pulling out the actual constraints.",
  },
  {
    id: "recall",
    label: "Recalling relevant context",
    description: "Checking the deploy config mentioned earlier in the thread.",
  },
  {
    id: "draft",
    label: "Drafting the answer",
    description: "Writing the fix as a short, ordered checklist.",
  },
] as const;

function HomeReasoningStepsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % (reasoningSteps.length + 1));
    }, 1500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[260px] w-full max-w-md flex-col justify-start p-4">
      <ReasoningSteps defaultOpen>
        <ReasoningStepsTrigger>Reasoning</ReasoningStepsTrigger>
        <ReasoningStepsContent>
          {reasoningSteps.map((step, index) => {
            const status: ReasoningStepStatus =
              index < activeIndex
                ? "done"
                : index === activeIndex
                  ? "active"
                  : "pending";

            return (
              <ReasoningStep
                description={step.description}
                key={step.id}
                label={step.label}
                status={status}
              />
            );
          })}
        </ReasoningStepsContent>
      </ReasoningSteps>
    </div>
  );
}

function HomeFaviconBadgeShowcase() {
  const [website, setWebsite] = useState("vercel.com");

  return (
    <FaviconBadgeLivePreview onWebsiteChange={setWebsite} website={website} />
  );
}

const streamingTextCopy =
  "Great interfaces feel alive because every word earns its place — arriving softly, settling quietly, and leaving the reader with nothing but the message.";

function HomeStreamingTextShowcase() {
  const [run, setRun] = useState(0);
  const replayTimeout = useRef(0);

  useEffect(() => {
    return () => window.clearTimeout(replayTimeout.current);
  }, []);

  return (
    <div className="flex min-h-[200px] w-full max-w-md flex-col gap-6 p-4">
      <div className="self-end rounded-2xl rounded-br-md bg-muted px-4 py-2.5 text-[13px] text-foreground">
        What makes a great interface feel alive?
      </div>
      <StreamingText
        className="self-start px-1 text-[13px] leading-relaxed"
        key={run}
        onComplete={() => {
          replayTimeout.current = window.setTimeout(() => {
            setRun((current) => current + 1);
          }, 2600);
        }}
        text={streamingTextCopy}
      />
    </div>
  );
}

function HomeTimezoneShowcase() {
  const [zone, setZone] = useState<HomeTimezoneZone>(detectViewerZone);

  return (
    <div className="flex min-h-[150px] w-full items-center justify-center px-4">
      <div className="flex max-w-2xl flex-wrap items-baseline justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-foreground text-sm leading-snug tracking-tight sm:text-base">
        <span>Right now in</span>
        <InlinePreviewSelect
          ariaLabel="Timezone city"
          menuKey="home-timezone-zone-menu"
          onChange={setZone}
          options={timezoneZoneOptions}
          value={zone}
        />
        <span>it is</span>
        <Timezone live zone={zone} />
        <span>for the distributed team.</span>
      </div>
    </div>
  );
}

export function HomeFeaturedShowcase() {
  return (
    <section
      aria-labelledby="home-featured-showcase-heading"
      className="mt-24 overflow-visible sm:mt-32"
    >
      <div>
        <h3
          className="whitespace-nowrap font-light text-[clamp(0.9rem,3.4vw,1.85rem)] text-foreground tracking-[-0.07em]"
          id="home-featured-showcase-heading"
        >
          Every component, live and ready to explore.
        </h3>
      </div>

      <HomeShowcaseGrid className="mt-8 sm:mt-10">
        <HomeShowcaseRow columnWeights={[7, 5]}>
          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[7],
              "min-h-[220px] md:min-h-[280px]"
            )}
            href="/texts/dia-text"
            title="Dia Text"
          >
            <div className="w-full text-center">
              <p className="max-w-4xl font-light text-4xl text-foreground tracking-tight">
                Make interfaces feel{" "}
                <DiaText
                  repeat
                  repeatDelay={1.1}
                  text={["smooth.", "focused.", "refined."]}
                />
              </p>
            </div>
          </HomeShowcasePanel>

          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[5],
              "min-h-[240px] md:min-h-[280px]"
            )}
            href="/display-and-content/favicon-badge"
            title="Favicon Badge"
          >
            <HomeFaviconBadgeShowcase />
          </HomeShowcasePanel>
        </HomeShowcaseRow>

        <HomeShowcaseRow columnWeights={[7, 5]}>
          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[7],
              "min-h-[260px] md:min-h-[360px]"
            )}
            href="/blocks/logo-carousel"
            title="Logo Carousel"
          >
            <div className="flex w-full items-center justify-center px-4">
              <LogosCarousel className="w-full max-w-xl gap-8" columnCount={4}>
                {featuredCarouselLogos.map((logo) => (
                  <Image
                    alt={logo.alt}
                    className="brightness-0 dark:invert"
                    height={40}
                    key={logo.id}
                    src={logo.src}
                    width={120}
                  />
                ))}
              </LogosCarousel>
            </div>
          </HomeShowcasePanel>

          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[5],
              "min-h-[340px] md:min-h-[400px]"
            )}
            href="/blocks/message"
            title="Message"
          >
            <HomeMessageShowcase />
          </HomeShowcasePanel>
        </HomeShowcaseRow>

        <HomeShowcaseRow columnWeights={[7, 5]}>
          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[7],
              "min-h-[260px] md:min-h-[360px]"
            )}
            href="/blocks/reasoning-steps"
            title="Reasoning Steps"
          >
            <HomeReasoningStepsShowcase />
          </HomeShowcasePanel>

          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[5],
              "min-h-[340px] md:min-h-[380px]"
            )}
            href="/blocks/thinking-indicator"
            title="Thinking Indicator"
          >
            <HomeThinkingIndicatorShowcase />
          </HomeShowcasePanel>
        </HomeShowcaseRow>

        <HomeShowcaseRow columnWeights={[7, 5]}>
          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[7],
              "min-h-[340px] md:min-h-[380px]"
            )}
            href="/blocks/ai-input"
            title="AI Input"
          >
            <HomeAIInputShowcase />
          </HomeShowcasePanel>

          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[5],
              "min-h-[260px] md:min-h-[380px]"
            )}
            href="/blocks/streaming-text"
            title="Streaming Text"
          >
            <HomeStreamingTextShowcase />
          </HomeShowcasePanel>
        </HomeShowcaseRow>

        <HomeShowcaseRow columnWeights={[12]}>
          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[12],
              "min-h-[260px] md:min-h-[320px]"
            )}
            href="/display-and-content/timezone"
            title="Timezone"
          >
            <HomeTimezoneShowcase />
          </HomeShowcasePanel>
        </HomeShowcaseRow>
      </HomeShowcaseGrid>
    </section>
  );
}
