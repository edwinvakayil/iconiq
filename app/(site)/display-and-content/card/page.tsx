"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { cardApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { cardPreviewCode } from "@/lib/component-v0-pages";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardMedia,
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
const previewSentenceClassName =
  "max-w-xs text-balance text-center text-[15px] text-muted-foreground leading-relaxed sm:max-w-sm sm:text-base";
const previewContentClassName =
  "flex w-full flex-col items-center gap-4 text-center";
const cardClassName =
  "w-full max-w-[16rem] border border-border/80 bg-background pt-0 text-left shadow-[0_18px_48px_-36px_rgba(15,23,42,0.22)] sm:max-w-[17.5rem]";
const tagClassName =
  "inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-medium text-[11px] text-foreground";

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
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className={previewContentClassName}>
        <Card className={cardClassName} interactive>
          <CardMedia>
            <Image
              alt="Red and purple gradient artwork"
              className="aspect-[4/2.25] w-full object-cover"
              height={4000}
              sizes="(max-width: 640px) 100vw, 17.5rem"
              src={artworkSrc}
              width={6000}
            />
          </CardMedia>

          <CardContent className="space-y-3 px-3.5 pt-3 pb-0 text-left">
            <div className="flex items-center justify-between gap-2">
              <Avatar className="size-7 shrink-0 ring-1 ring-black/5">
                <AvatarImage alt="" loading="lazy" src={artworkSrc} />
                <AvatarFallback className="text-[10px]">DS</AvatarFallback>
              </Avatar>
              <p className="text-right text-[11px] text-muted-foreground">
                {currentDate}
              </p>
            </div>

            <div className="space-y-2 text-left">
              <CardTitle className="text-balance text-left font-normal text-[0.95rem] leading-[1.15] tracking-[-0.04em]">
                Design Systems That Last
              </CardTitle>
              <CardDescription className="w-full text-pretty text-left text-[12px] text-muted-foreground leading-[1.35]">
                Steady patterns keep interfaces coherent as products grow.
              </CardDescription>
            </div>

            <button
              className="inline-flex h-8 w-fit items-center justify-center self-start rounded-md border border-border px-3 font-medium text-[12px] text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              type="button"
            >
              Read more
            </button>
          </CardContent>

          <CardFooter className="items-center justify-between gap-2 border-t-0 bg-transparent px-3.5 pt-3.5 pb-3.5">
            <span className="text-[11px] text-muted-foreground">
              Categories
            </span>
            <div className="flex flex-wrap justify-end gap-1">
              <span className={tagClassName}>Marketing</span>
              <span className={tagClassName}>UI Design</span>
            </div>
          </CardFooter>
        </Card>

        <p className={previewSentenceClassName}>
          Headline, excerpt, and next step—kept in one compact card.
        </p>
      </div>
    </div>
  );
}

export default function CardPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Display & Content" },
        { label: "Card" },
      ]}
      componentName="card"
      description="Cards for content, metrics, and actions—with subtle motion."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/card/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/card"
      preview={<CardPreview />}
      previewCode={cardPreviewCode}
      previewDescription="A compact editorial card with a centered caption below."
      title="Card"
      usageCode={cardPreviewCode}
      usageDescription="Use the shared slots for a clean article or marketing card, and reuse the same visual asset across the media block and avatar accent when you want a tighter visual system."
    />
  );
}
