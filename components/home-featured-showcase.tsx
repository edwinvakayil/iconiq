"use client";

import { useEffect, useState } from "react";
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
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/avatar";
import { Badge } from "@/registry/badge";
import { Calendar } from "@/registry/calendar";
import { DiaText } from "@/registry/dia-text";
import { Accordion, type AccordionItem } from "@/registry/r-accordion";
import { Progress } from "@/registry/r-progress";
import { RollingDigits } from "@/registry/rolling-digits";
import { Skeleton } from "@/registry/skeleton";
import { Timezone } from "@/registry/timezone";

const featuredAccordionItems: AccordionItem[] = [
  {
    id: "source-first",
    title: "Open, edit, and ship the source",
    content:
      "Install components as local files so you can inspect every decision and adapt them to your own product.",
  },
  {
    id: "motion-built-in",
    title: "Motion that feels built in",
    content:
      "Transitions and interaction details are part of the component design, not something you have to bolt on later.",
  },
  {
    id: "real-product-ui",
    title: "Built for real product interfaces",
    content:
      "Use the docs as a starting point, then shape the implementation around your own app and workflow.",
  },
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

const progressFrames = [
  8, 14, 22, 31, 42, 55, 68, 80, 90, 96, 88, 76, 63, 49, 36, 25, 16, 10,
];

function HomeProgressShowcase() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % progressFrames.length);
    }, 340);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[320px] space-y-4">
      <Progress label="Upload" value={progressFrames[frameIndex]} />
      <Progress
        label="Sync"
        value={progressFrames[(frameIndex + 8) % progressFrames.length]}
      />
    </div>
  );
}

function HomeFaviconBadgeShowcase() {
  const [website, setWebsite] = useState("vercel.com");

  return (
    <FaviconBadgeLivePreview onWebsiteChange={setWebsite} website={website} />
  );
}

function HomeRollingDigitsShowcase() {
  const [days, setDays] = useState(12);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDays((current) => (current <= 0 ? 12 : current - 1));
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[150px] w-full items-center justify-center px-4">
      <div className="flex max-w-sm flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-balance text-center font-medium text-foreground text-lg leading-snug tracking-tight">
        <span>Early access opens in</span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <RollingDigits pad={2} startOnView={false} value={days} />
        </span>
        <span>days.</span>
      </div>
    </div>
  );
}

function HomeTimezoneShowcase() {
  const [zone, setZone] = useState<HomeTimezoneZone>("San Francisco");

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
          className="max-w-[18ch] font-light text-[clamp(0.9rem,3.4vw,1.85rem)] text-foreground tracking-[-0.07em] sm:max-w-none sm:whitespace-nowrap"
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
            href="/navigation/accordion"
            title="Accordion"
          >
            <Accordion
              className="w-full max-w-none"
              items={featuredAccordionItems}
            />
          </HomeShowcasePanel>

          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[5],
              "min-h-[340px] md:min-h-[400px]"
            )}
            href="/display-and-content/skeleton"
            title="Skeleton"
          >
            <div className="w-full max-w-[360px] p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-11" rounded="full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" rounded="full" />
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-[88%]" />
                <Skeleton className="h-3.5 w-[68%]" />
              </div>
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-9 flex-1" rounded="lg" />
                <Skeleton className="h-9 w-24" rounded="lg" />
              </div>
            </div>
          </HomeShowcasePanel>
        </HomeShowcaseRow>

        <HomeShowcaseRow columnWeights={[7, 5]}>
          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[7],
              "min-h-[260px] md:min-h-[360px]"
            )}
            href="/display-and-content/avatar"
            title="Avatar"
          >
            <div className="flex w-full items-center justify-center gap-12 px-4 sm:gap-16">
              <Avatar size="lg" tooltip="online">
                <AvatarImage alt="shadcn/ui" src="/assets/shadcn.jpg" />
                <AvatarFallback>SU</AvatarFallback>
                <AvatarBadge />
              </Avatar>

              <AvatarGroup>
                <Avatar size="lg" tooltip="Alex">
                  <AvatarImage alt="Avatar 1" src="/assets/av1.png" />
                  <AvatarFallback>A1</AvatarFallback>
                </Avatar>
                <Avatar size="lg" tooltip="Jordan">
                  <AvatarImage alt="Avatar 2" src="/assets/av2.png" />
                  <AvatarFallback>A2</AvatarFallback>
                </Avatar>
                <Avatar size="lg" tooltip="Sam">
                  <AvatarImage alt="Avatar 3" src="/assets/av3.png" />
                  <AvatarFallback>A3</AvatarFallback>
                </Avatar>
              </AvatarGroup>
            </div>
          </HomeShowcasePanel>

          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[5],
              "min-h-[340px] md:min-h-[380px]"
            )}
            href="/display-and-content/progress"
            title="Progress"
          >
            <HomeProgressShowcase />
          </HomeShowcasePanel>
        </HomeShowcaseRow>

        <HomeShowcaseRow columnWeights={[4, 4, 4]}>
          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[4],
              "min-h-[340px] md:min-h-[380px]"
            )}
            href="/display-and-content/calendar"
            title="Calendar"
          >
            <div className="flex w-full justify-center">
              <Calendar
                defaultMonth={new Date("2026-05-10")}
                defaultSelected={new Date("2026-05-10")}
              />
            </div>
          </HomeShowcasePanel>

          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[4],
              "min-h-[260px] md:min-h-[400px]"
            )}
            href="/display-and-content/rolling-digits"
            title="Rolling Digits"
          >
            <HomeRollingDigitsShowcase />
          </HomeShowcasePanel>

          <HomeShowcasePanel
            className={cn(
              homeShowcaseColSpan[4],
              "min-h-[340px] md:min-h-[380px]"
            )}
            href="/display-and-content/badge"
            title="Badge"
          >
            <Badge color="indigo">Early Access</Badge>
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
