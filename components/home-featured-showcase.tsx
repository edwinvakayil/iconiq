"use client";

import Link from "next/link";
import { type ReactNode, startTransition, useEffect, useState } from "react";

import { Accordion, type AccordionItem } from "@/registry/accordion";
import { Badge } from "@/registry/badge";
import { Button } from "@/registry/button";
import { Calendar } from "@/registry/calendar";
import {
  CheckboxGroup,
  type CheckboxGroupOption,
} from "@/registry/checkbox-group";
import { DiaText } from "@/registry/dia-text";
import { RadioGroup, type RadioOption } from "@/registry/radiogroup";
import { TextShimmer } from "@/registry/shimmer-text";
import { ShimmerSkeleton } from "@/registry/skeleton";
import { Slider } from "@/registry/slider";
import { Switch } from "@/registry/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/tabs";
import { Tooltip } from "@/registry/tooltip";

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

export function HomeFeaturedShowcase() {
  const [selectedRadio, setSelectedRadio] = useState("source");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([
    "motion",
  ]);
  const [showExtendedShowcase, setShowExtendedShowcase] = useState(false);

  useEffect(() => {
    const reveal = () => {
      startTransition(() => setShowExtendedShowcase(true));
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(reveal, { timeout: 250 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = setTimeout(reveal, 120);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      aria-labelledby="home-featured-showcase-heading"
      className="mt-24 sm:mt-32"
    >
      <div className="sm:text-center">
        <h2
          className="font-medium text-[1.95rem] text-foreground tracking-[-0.07em] sm:text-[2.9rem]"
          id="home-featured-showcase-heading"
        >
          Built to be explored, not just documented.
        </h2>
      </div>

      <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-12">
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
          href="/texts/shimmer-text"
          title="Shimmer Text"
        >
          <div className="w-full text-center">
            <TextShimmer
              as="p"
              className="font-light text-4xl tracking-tight"
              duration={2.7}
              spread={3}
            >
              Details in motion
            </TextShimmer>
          </div>
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-7"
          href="/components/accordion"
          title="Accordion"
        >
          <Accordion
            className="w-full max-w-none"
            items={featuredAccordionItems}
          />
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-5"
          href="/components/skeleton"
          title="Skeleton"
        >
          <div className="w-full max-w-[360px] rounded-2xl border border-border/65 p-4">
            <div className="flex items-center gap-3">
              <ShimmerSkeleton className="size-11" rounded="full" />
              <div className="min-w-0 flex-1 space-y-2">
                <ShimmerSkeleton className="h-3.5 w-28" />
                <ShimmerSkeleton className="h-3 w-20" rounded="full" />
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              <ShimmerSkeleton className="h-3.5 w-full" />
              <ShimmerSkeleton className="h-3.5 w-[88%]" />
              <ShimmerSkeleton className="h-3.5 w-[68%]" />
            </div>
            <div className="mt-4 flex gap-2">
              <ShimmerSkeleton className="h-9 flex-1" rounded="lg" />
              <ShimmerSkeleton className="h-9 w-24" rounded="lg" />
            </div>
          </div>
        </ShowcaseCard>

        {showExtendedShowcase ? (
          <>
            <ShowcaseCard
              className="lg:col-span-4"
              href="/components/calendar"
              title="Calendar"
            >
              <div className="flex w-full justify-center">
                <Calendar
                  defaultMonth={new Date("2026-05-10")}
                  defaultSelected={new Date("2026-05-10")}
                />
              </div>
            </ShowcaseCard>

            <div className="grid gap-4 lg:col-span-8 lg:grid-cols-2">
              <ShowcaseCard href="/components/tooltip" title="Tooltip">
                <div className="flex min-h-[150px] w-full items-center justify-center px-4">
                  <p className="max-w-sm text-center font-sans text-[15px] text-foreground leading-relaxed">
                    Hover the{" "}
                    <Tooltip
                      content="Quick context on hover."
                      delay={0.12}
                      side="top"
                    >
                      <button
                        className="rounded-lg px-0.5 font-medium text-sky-700 underline decoration-sky-500/40 decoration-dotted underline-offset-[5px] transition-colors hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
                        type="button"
                      >
                        trigger
                      </button>
                    </Tooltip>{" "}
                    to preview the floating label.
                  </p>
                </div>
              </ShowcaseCard>

              <ShowcaseCard href="/components/badge" title="Badge">
                <div className="flex min-h-[150px] w-full items-center justify-center px-4">
                  <Badge color="indigo">Early Access</Badge>
                </div>
              </ShowcaseCard>

              <ShowcaseCard
                className="lg:col-span-2"
                href="/components/button"
                title="Button"
              >
                <div className="flex w-full max-w-[360px] flex-wrap items-center justify-center gap-2.5">
                  <Button size="sm">Default</Button>
                  <Button size="sm" variant="outline">
                    Outline
                  </Button>
                  <Button size="sm" variant="secondary">
                    Secondary
                  </Button>
                  <Button size="sm" variant="ghost">
                    Ghost
                  </Button>
                </div>
              </ShowcaseCard>
            </div>

            <ShowcaseCard
              className="lg:col-span-6"
              href="/components/switch"
              title="Switch"
            >
              <div className="w-full max-w-[320px] space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[14px] text-foreground tracking-[-0.02em]">
                    Motion
                  </p>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[14px] text-foreground tracking-[-0.02em]">
                    Previews
                  </p>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[14px] text-foreground tracking-[-0.02em]">
                    Reduced UI
                  </p>
                  <Switch />
                </div>
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              className="lg:col-span-6"
              href="/components/slider"
              title="Slider"
            >
              <div className="w-full max-w-[320px] space-y-4">
                <Slider defaultValue={42} label="Volume" />
                <Slider defaultValue={68} label="Brightness" />
                <Slider defaultValue={55} label="Opacity" />
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              className="lg:col-span-6"
              href="/components/radiogroup"
              title="Radio Group"
            >
              <div className="w-full max-w-md">
                <RadioGroup
                  aria-label="Install workflow"
                  className="w-full"
                  onChange={setSelectedRadio}
                  options={homeRadioOptions}
                  value={selectedRadio}
                />
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              className="lg:col-span-6"
              href="/components/checkbox-group"
              title="Checkbox Group"
            >
              <div className="w-full max-w-md">
                <CheckboxGroup
                  className="w-full"
                  onChange={setSelectedCheckboxes}
                  options={homeCheckboxOptions}
                  value={selectedCheckboxes}
                />
              </div>
            </ShowcaseCard>

            <ShowcaseCard
              className="lg:col-span-12"
              href="/components/tabs"
              title="Tabs"
            >
              <div className="flex w-full justify-start">
                <Tabs
                  className="[&>div.relative]:!mt-3 w-full max-w-[640px]"
                  defaultValue="browse"
                >
                  <TabsList>
                    <TabsTrigger value="browse">Browse</TabsTrigger>
                    <TabsTrigger value="ship">Ship</TabsTrigger>
                    <TabsTrigger value="adapt">Adapt</TabsTrigger>
                  </TabsList>

                  <TabsContent
                    className="max-w-lg rounded-2xl p-5 text-left"
                    value="browse"
                  >
                    <div className="space-y-1 text-left">
                      <p className="font-medium text-[1rem] text-foreground tracking-[-0.03em]">
                        Browse the interaction first
                      </p>
                      <p className="text-[13px] text-secondary leading-5">
                        Open the live example, test the motion, and understand
                        the behavior before you copy anything into your app.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent
                    className="max-w-lg rounded-2xl p-5 text-left"
                    value="ship"
                  >
                    <div className="space-y-1 text-left">
                      <p className="font-medium text-[1rem] text-foreground tracking-[-0.03em]">
                        Ship from a stronger starting point
                      </p>
                      <p className="text-[13px] text-secondary leading-5">
                        Install the component as source, review the structure,
                        and move into production with less setup work.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent
                    className="max-w-lg rounded-2xl p-5 text-left"
                    value="adapt"
                  >
                    <div className="space-y-1 text-left">
                      <p className="font-medium text-[1rem] text-foreground tracking-[-0.03em]">
                        Adapt it to your product
                      </p>
                      <p className="text-[13px] text-secondary leading-5">
                        Rename parts, tweak motion, and reshape the UI around
                        your own workflow without fighting a black-box
                        dependency.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ShowcaseCard>
          </>
        ) : null}
      </div>
    </section>
  );
}
