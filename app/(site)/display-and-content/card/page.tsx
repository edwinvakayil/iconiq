"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { CardPlaygroundProvider } from "@/app/(site)/display-and-content/card/_components/card-playground";
import { cardApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as CardModule from "@/registry/card";

const usageCode = `import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardUsage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Release checklist</CardTitle>
        <CardDescription>
          Track the final items before shipping the next docs refresh.
        </CardDescription>
        <CardAction>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">
            In review
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Accessibility pass on interactive cards.</p>
        <p>Registry docs for media slots.</p>
      </CardContent>
    </Card>
  );
}`;

const cardExamples: VariantItem[] = [
  {
    title: "Header and action",
    code: usageCode,
  },
  {
    title: "Stat card",
    code: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardStat() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardDescription>Active subscribers</CardDescription>
        <CardTitle className="text-3xl tracking-tight">12,480</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Up 8.4% from last month.
      </CardContent>
    </Card>
  );
}`,
  },
  {
    title: "Link card",
    code: `import {
  Card,
  CardContent,
  CardDescription,
  CardImage,
  CardTitle,
} from "@/components/ui/card";

export function CardLink() {
  return (
    <Card asChild interactive>
      <a className="block w-full max-w-sm no-underline text-inherit" href="/posts/design-systems">
        <CardImage
          alt="Gradient artwork"
          className="aspect-[4/2.25] w-full object-cover"
          height={900}
          src="/assets/gradient.png"
          width={1600}
        />
        <CardContent className="space-y-2">
          <CardTitle>Design Systems That Last</CardTitle>
          <CardDescription>
            Whole-card navigation with asChild and interactive lift.
          </CardDescription>
        </CardContent>
      </a>
    </Card>
  );
}`,
  },
  {
    title: "Flush media",
    code: `import {
  Card,
  CardContent,
  CardDescription,
  CardImage,
  CardTitle,
} from "@/components/ui/card";

export function CardFlushMedia() {
  return (
    <Card className="w-full max-w-sm pt-0" interactive>
      <CardImage
        alt="Gradient artwork"
        className="aspect-[4/2.25] w-full object-cover"
        height={900}
        inset={false}
        src="/assets/gradient.png"
        width={1600}
      />
      <CardContent className="space-y-2">
        <CardTitle>Edge-to-edge media</CardTitle>
        <CardDescription>
          Use inset={false} when the media should align with the card width.
        </CardDescription>
      </CardContent>
    </Card>
  );
}`,
  },
];

const details = cardApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: motion, @radix-ui/react-slot.",
      "CardImage requires a Next.js project because it always renders next/image.",
      "Use CardMedia only for non-image media such as video, charts, or embeds.",
      "This page lives in the Components section, but the install itself is the shared Iconiq card primitive rather than a Radix UI or Base UI wrapper.",
      "The provider switch is shown for section consistency, but both Radix UI and Base UI options are disabled because Card does not ship primitive-specific variants here.",
      "The generated registry file is /r/card.json.",
    ],
    registryPath: "card.json",
  };
});

export default function CardPage() {
  return (
    <CardPlaygroundProvider
      CardModule={CardModule}
      importPath="@/components/ui/card"
    >
      {({ preview, renderSettings }) => (
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
          examples={cardExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="card"
          pageUrl="/display-and-content/card"
          preview={preview}
          previewClassName="min-h-[40rem] overflow-visible"
          previewDescription="Use the playground to tune interactive lift and inset media on the live preview."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Card"
          railNotes={[
            "Use CardHeader + CardAction for title rows with trailing status or menus.",
            "Use CardImage for card artwork and photos. It always renders next/image.",
            "Use CardMedia only for non-image media such as video, charts, or embeds.",
            "Use asChild with a single anchor or button child for whole-card navigation.",
            "Keep nested buttons or links inside a normal Card shell instead of wrapping the whole card again.",
          ]}
          title="Card"
          usageCode={usageCode}
          usageDescription="Start with the header grid for title, description, and action slots, then add CardContent, optional CardFooter, and CardImage for leading artwork."
        />
      )}
    </CardPlaygroundProvider>
  );
}
