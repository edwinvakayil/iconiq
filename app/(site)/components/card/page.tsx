"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { cardApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { cardPreviewCode } from "@/lib/component-v0-pages";
import { Avatar } from "@/registry/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/registry/card";

const details = cardApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: motion.",
      "This page lives in the Components section, but the install itself is the shared Iconiq card primitive rather than a Radix UI or Base UI wrapper.",
      "The provider switch is shown for section consistency, but both Radix UI and Base UI options are disabled because Card does not ship primitive-specific variants here.",
      "The generated registry file is /r/card.json.",
    ],
    registryPath: "card.json",
  };
});

const artworkSrc = "/assets/gradient.png";
const currentDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
const tagClassName =
  "inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-medium text-[12px] text-foreground";

function formatCurrentDate() {
  return currentDateFormatter.format(new Date());
}

function CardPreview() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(formatCurrentDate());
    };

    updateDate();
    const intervalId = window.setInterval(updateDate, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex w-full items-center justify-center px-0 py-4 sm:py-5">
      <Card
        className="w-full max-w-[21rem] overflow-hidden rounded-[1.1rem] border border-border/80 bg-background pt-0 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.24)] sm:max-w-[23rem]"
        interactive
      >
        <div className="px-[1.5px] pt-[1.5px]">
          <Image
            alt="Red and purple gradient artwork"
            className="aspect-[4/2.2] w-full rounded-[0.85rem] object-cover"
            height={4000}
            sizes="(max-width: 640px) 100vw, 23rem"
            src={artworkSrc}
            width={6000}
          />
        </div>

        <CardContent className="space-y-3 px-3.5 pt-3 pb-0 sm:px-4 sm:pt-3.5">
          <div className="flex items-center justify-between gap-3">
            <Avatar
              alt=""
              className="size-8 shrink-0 ring-1 ring-black/5"
              loading="lazy"
              src={artworkSrc}
            />
            <p className="text-right text-[12px] text-muted-foreground sm:text-[13px]">
              {currentDate}
            </p>
          </div>

          <div className="space-y-2.5">
            <CardTitle className="whitespace-nowrap font-normal text-[1rem] leading-[1.08] tracking-[-0.05em] sm:text-[1.08rem]">
              Design Systems That Age Gracefully
            </CardTitle>
            <CardDescription className="w-full text-pretty text-[12px] text-muted-foreground leading-5 sm:text-[13px] sm:leading-6">
              Lasting interfaces come from steady patterns, resilient
              foundations, and decisions that remain coherent as products grow.
            </CardDescription>
          </div>

          <button
            className="inline-flex h-8 w-fit items-center justify-center rounded-md border border-border px-3.5 font-medium text-[12px] text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            type="button"
          >
            Read more
          </button>
        </CardContent>

        <CardFooter className="items-center justify-between gap-2.5 border-t-0 bg-transparent px-3.5 pt-4 pb-3.5 sm:px-4 sm:pb-4">
          <span className="text-[12px] text-muted-foreground sm:text-[13px]">
            Categories
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            <span className={tagClassName}>Marketing</span>
            <span className={tagClassName}>UI Design</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function CardPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Card" },
      ]}
      componentName="card"
      description="Motion-smoothed surface for grouped content, metrics, and supporting actions."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/card/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/components/card"
      preview={<CardPreview />}
      previewClassName="min-h-0 !p-0"
      previewCode={cardPreviewCode}
      previewDescription="A simpler editorial card layout that reuses the same gradient artwork for the hero surface and the round avatar accent."
      title="Card"
      usageCode={cardPreviewCode}
      usageDescription="Use the shared slots for a clean article or marketing card, and reuse the same visual asset across the media block and avatar accent when you want a tighter visual system."
    />
  );
}
