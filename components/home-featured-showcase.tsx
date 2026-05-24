"use client";

import { Building2, Cloud, GraduationCap, Sun } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type ReactNode, startTransition, useEffect, useState } from "react";

import { Accordion, type AccordionItem } from "@/registry/accordion";
import type { CheckboxGroupOption } from "@/registry/checkbox-group";
import { DiaText } from "@/registry/dia-text";
import { IconBar, IconBarItem } from "@/registry/icon-bar";
import type { RadioOption } from "@/registry/radiogroup";
import { ShimmerSkeleton } from "@/registry/skeleton";

const HomeFeaturedShowcaseExtended = dynamic(
  () =>
    import("@/components/home-featured-showcase-extended").then(
      (mod) => mod.HomeFeaturedShowcaseExtended
    ),
  { ssr: false }
);

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
          href="/special-one/icon-bar"
          title="Icon Bar"
        >
          <div className="flex w-full items-center justify-center px-4">
            <IconBar>
              <IconBarItem icon={Building2} label="Office" />
              <IconBarItem icon={GraduationCap} label="School" />
              <IconBarItem icon={Sun} label="Sunny" />
              <IconBarItem icon={Cloud} label="Cloudy" />
            </IconBar>
          </div>
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-7"
          href="/radix-base-ui/accordion"
          title="Accordion"
        >
          <Accordion
            className="w-full max-w-none"
            items={featuredAccordionItems}
          />
        </ShowcaseCard>

        <ShowcaseCard
          className="lg:col-span-5"
          href="/radix-base-ui/skeleton"
          title="Skeleton"
        >
          <div className="w-full max-w-[360px] p-4">
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
          <HomeFeaturedShowcaseExtended
            checkboxOptions={homeCheckboxOptions}
            onCheckboxChange={setSelectedCheckboxes}
            onRadioChange={setSelectedRadio}
            radioOptions={homeRadioOptions}
            selectedCheckboxes={selectedCheckboxes}
            selectedRadio={selectedRadio}
          />
        ) : null}
      </div>
    </section>
  );
}
