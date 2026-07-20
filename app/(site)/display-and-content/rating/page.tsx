"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { RatingPlaygroundProvider } from "@/app/(site)/display-and-content/rating/_components/rating-playground";
import { ratingApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as RatingModule from "@/registry/rating";

const usageCode = `import { Rating, RatingButton } from "@/components/ui/rating";

export function RatingPreview() {
  return (
    <Rating defaultValue={3}>
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
    </Rating>
  );
}`;

const ratingExamples: VariantItem[] = [
  {
    title: "Controlled",
    code: `import { useState } from "react";
import { Rating, RatingButton } from "@/components/ui/rating";

export function RatingControlled() {
  const [value, setValue] = useState(0);

  return (
    <Rating onValueChange={setValue} value={value}>
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
    </Rating>
  );
}`,
  },
  {
    title: "Read only",
    code: `import { Rating, RatingButton } from "@/components/ui/rating";

export function RatingReadOnly() {
  return (
    <Rating defaultValue={4} readOnly>
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
    </Rating>
  );
}`,
  },
  {
    title: "Small",
    code: `import { Rating, RatingButton } from "@/components/ui/rating";

export function RatingSmall() {
  return (
    <Rating defaultValue={4} size={16}>
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
    </Rating>
  );
}`,
  },
  {
    title: "Seven stars, large",
    code: `import { Rating, RatingButton } from "@/components/ui/rating";

export function RatingLarge() {
  return (
    <Rating defaultValue={5} size={28}>
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
      <RatingButton />
    </Rating>
  );
}`,
  },
  {
    title: "Custom icon",
    code: `import { HeartIcon } from "lucide-react";
import { Rating, RatingButton } from "@/components/ui/rating";

export function RatingCustomIcon() {
  return (
    <Rating defaultValue={3} size={20}>
      <RatingButton icon={<HeartIcon />} />
      <RatingButton icon={<HeartIcon />} />
      <RatingButton icon={<HeartIcon />} />
      <RatingButton icon={<HeartIcon />} />
      <RatingButton icon={<HeartIcon />} />
    </Rating>
  );
}`,
  },
];

export default function RatingPage() {
  return (
    <RatingPlaygroundProvider
      importPath="@/components/ui/rating"
      RatingModule={RatingModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Rating" },
          ]}
          componentName="rating"
          description="A compound star rating control. Rating manages the value and size; RatingButton renders each star, so you control how many stars appear and can swap in any icon."
          details={ratingApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/rating/page.tsx`}
          examples={ratingExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="rating"
          pageUrl="/display-and-content/rating"
          preview={preview}
          previewClassName="min-h-[22rem]"
          previewDescription="Hover to preview a value, click a star to set it, or use the Arrow keys once a star is focused."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Rating"
          railNotes={[
            "Render one RatingButton per star — the number of children is the rating scale, so five children means a 1-5 scale.",
            "Pass size on Rating to set the icon size for every star at once — individual RatingButton children can override when needed.",
            "Hovering previews a value without committing it; moving the pointer off the group falls back to the committed value.",
            "Arrow Left/Right step the value by one once a star has focus; Shift or Cmd/Ctrl plus Arrow jumps straight to the first or last star.",
            "Clicking the already-selected star again clears the rating back to zero.",
            "Pass value and onValueChange for controlled usage, or defaultValue for uncontrolled.",
            "Set readOnly to display an existing rating without interaction — it renders native disabled buttons.",
            "Override icon on any RatingButton to render something other than a star, such as a heart or a custom SVG.",
          ]}
          title="Rating"
          usageCode={usageCode}
          usageDescription="Render a RatingButton for each star. Pass size on Rating to scale every icon, and wire value and onValueChange to read the selected rating."
          v0PageCode={usageCode}
        />
      )}
    </RatingPlaygroundProvider>
  );
}
