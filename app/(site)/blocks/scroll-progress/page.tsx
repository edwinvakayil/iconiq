"use client";

import { useRef } from "react";

import { scrollProgressApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { ScrollProgress } from "@/registry/scroll-progress";

const usageCode = `"use client";

import { ScrollProgress } from "@/components/ui/scroll-progress";

export function ScrollProgressPreview() {
  return <ScrollProgress position="right" />;
}`;

const SECTIONS = [
  {
    heading: "The Nature of Design",
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi alias similique eveniet corrupti cupiditate, saepe magni, distinctio at dolor dignissimos consequatur rerum quasi expedita soluta amet, fugiat quaerat commodi accusamus enim necessitatibus facere cumque dolores quisquam. Vero harum repellendus labore. Aut voluptates reiciendis odit rem quibusdam beatae, tenetur eveniet nisi consectetur nam sapiente dolorem explicabo nesciunt numquam quaerat temporibus illo laboriosam aliquam et perferendis.",
      "Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt.",
    ],
  },
  {
    heading: "Motion and Perception",
    paragraphs: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt, neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt.",
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident. Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    ],
  },
  {
    heading: "Rhythm and Hierarchy",
    paragraphs: [
      "Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum dolorem eum fugiat quo voluptas nulla pariatur. Excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi id est laborum et dolorum fuga et harum rerum facilis est expedita distinctio.",
    ],
  },
  {
    heading: "Simplicity as Intention",
    paragraphs: [
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem sit aspernatur.",
      "Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum dolorem eum fugiat. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint molestiae non recusandae itaque earum.",
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem totam aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo.",
    ],
  },
];

function ScrollProgressPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-[44rem] w-full overflow-hidden rounded-lg bg-card">
      <ScrollProgress container={containerRef} position="right" />

      <div
        className="h-full overflow-y-auto px-8 py-10 [&::-webkit-scrollbar]:hidden"
        ref={containerRef}
        style={{ scrollbarWidth: "none" }}
      >
        <div className="mx-auto max-w-lg space-y-8 pr-20 text-sm leading-relaxed">
          {SECTIONS.map((section) => (
            <div className="space-y-4" key={section.heading}>
              <h3 className="font-semibold text-base text-foreground tracking-tight">
                {section.heading}
              </h3>
              {section.paragraphs.map((text, i) => (
                <p className="text-justify text-muted-foreground" key={i}>
                  {text}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScrollProgressPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Scroll Progress" },
      ]}
      componentName="scroll-progress"
      description="Ruler-style scroll indicator with tick marks that fill in as the page scrolls and a live percentage readout."
      details={scrollProgressApiDetails}
      detailsDescription="ScrollProgress renders a fixed ruler of evenly spaced ticks. A solid overlay of the same ticks is clipped to the current scroll percentage and layered over a muted base set, so the fill reads as one continuous ruler rather than per-tick toggles. A small label tracks the fill boundary with the live percentage. Both the fill height and the label position transition with a short, fixed-duration ease so rapid scroll updates settle into one fluid motion instead of visibly stepping between frames."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/scroll-progress/page.tsx`}
      itemSlug="scroll-progress"
      pageUrl="/blocks/scroll-progress"
      preview={<ScrollProgressPreview />}
      previewClassName="min-h-[32rem]"
      previewDescription="Scroll inside the box below — the ruler fills from the top down and the number tracks your position as a percentage. This demo passes a `container` ref so the indicator tracks the scrollable box instead of the page; drop the prop on a real page and it tracks window scroll instead."
      title="Scroll Progress"
      usageCode={usageCode}
      usageDescription="Drop `ScrollProgress` anywhere in your layout — it's fixed-positioned, so placement in the tree doesn't matter. Pick a corner or side with `position`, or pass a `container` ref to track a scrollable element instead of the whole page."
    />
  );
}
