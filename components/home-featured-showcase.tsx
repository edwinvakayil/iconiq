"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { FaviconBadgeLivePreview } from "@/components/favicon-badge-live-preview";
import { HomeFeaturedShowcaseExtended } from "@/components/home-featured-showcase-extended";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/avatar";
import type { CheckboxGroupOption } from "@/registry/b-checkbox-group";
import { DiaText } from "@/registry/dia-text";
import { Accordion, type AccordionItem } from "@/registry/r-accordion";
import { Progress } from "@/registry/r-progress";
import type { RadioOption } from "@/registry/r-radio-group";
import { Skeleton } from "@/registry/skeleton";

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

const homeRadioOptions: RadioOption[] = [
  {
    value: "source",
    label: "Install as source",
    description: "Bring the files into your app and shape every detail.",
  },
  {
    value: "preview",
    label: "Preview first",
    description: "Open the live example and inspect the motion before copying.",
  },
  {
    value: "adapt",
    label: "Adapt for product",
    description: "Rename parts, tweak pacing, and make it feel native.",
  },
];

const homeCheckboxOptions: CheckboxGroupOption[] = [
  {
    label: "Keep motion details",
    value: "motion",
    description: "Carry over easing, timing, and small interaction polish",
  },
  {
    label: "Use theme tokens",
    value: "tokens",
    description: "Match surfaces, borders, and text to your design system",
  },
  {
    label: "Ship docs examples",
    value: "docs",
    description: "Disabled until the component fits your product language",
    disabled: true,
  },
];

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

function ShowcaseCard({
  title,
  href,
  className,
  children,
}: {
  title: string;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={`flex flex-col rounded-[22px] border border-border/70 bg-muted/32 p-5 text-left sm:p-6 ${className ?? ""}`}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl px-4 py-6">
        {children}
      </div>

      <div className="mt-4 min-w-0">
        <Link
          className="inline-block font-medium text-[1.05rem] text-foreground tracking-[-0.04em] decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:underline hover:decoration-foreground"
          href={href}
        >
          {title}
        </Link>
      </div>
    </article>
  );
}

function HomeFaviconBadgeShowcase() {
  const [website, setWebsite] = useState("vercel.com");

  return (
    <FaviconBadgeLivePreview onWebsiteChange={setWebsite} website={website} />
  );
}

export function HomeFeaturedShowcase() {
  const [selectedRadio, setSelectedRadio] = useState("source");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([
    "motion",
  ]);

  return (
    <section
      aria-labelledby="home-featured-showcase-heading"
      className="mt-24 sm:mt-32"
    >
      <div>
        <h3
          className="whitespace-nowrap font-light text-[clamp(0.9rem,3.4vw,1.85rem)] text-foreground tracking-[-0.07em]"
          id="home-featured-showcase-heading"
        >
          Every component, live and ready to explore.
        </h3>
      </div>

      <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 lg:grid-cols-12">
        <ShowcaseCard
          className="lg:col-span-6"
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
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-6"
          href="/display-and-content/favicon-badge"
          title="Favicon Badge"
        >
          <HomeFaviconBadgeShowcase />
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-6"
          href="/navigation/accordion"
          title="Accordion"
        >
          <Accordion
            className="w-full max-w-none"
            items={featuredAccordionItems}
          />
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-6"
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
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-6"
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
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-6"
          href="/display-and-content/progress"
          title="Progress"
        >
          <HomeProgressShowcase />
        </ShowcaseCard>

        <HomeFeaturedShowcaseExtended
          checkboxOptions={homeCheckboxOptions}
          onCheckboxChange={setSelectedCheckboxes}
          onRadioChange={setSelectedRadio}
          radioOptions={homeRadioOptions}
          selectedCheckboxes={selectedCheckboxes}
          selectedRadio={selectedRadio}
        />
      </div>
    </section>
  );
}
