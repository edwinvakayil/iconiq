"use client";

import { ContributionGraphPlaygroundProvider } from "@/app/(site)/blocks/contribution-graph/_components/contribution-graph-playground";
import { DocsCodeSnippet } from "@/components/docs/code-snippet";
import { contributionGraphApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";

const usageCode = `import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/ui/contribution-graph";

export function GitHubActivity() {
  return (
    <ContributionGraph username="edwinvakayil">
      <ContributionGraphCalendar>
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </ContributionGraphCalendar>
      <ContributionGraphFooter>
        <ContributionGraphTotalCount />
        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>
  );
}`;

const serverUsageCode = `import { unstable_cache } from "next/cache";
import {
  type Activity,
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/ui/contribution-graph";

type Response = {
  total: Record<string, number>;
  contributions: Activity[];
};

const username = "edwinvakayil";

const getCachedContributions = unstable_cache(
  async () => {
    const url = new URL(
      \`/v4/\${username}\`,
      "https://github-contributions-api.jogruber.de"
    );
    const response = await fetch(url);
    const data = (await response.json()) as Response;
    const total = data.total[new Date().getFullYear()];
    return { contributions: data.contributions, total };
  },
  ["github-contributions"],
  { revalidate: 60 * 60 * 24 }
);

export async function GitHubActivity() {
  const { contributions, total } = await getCachedContributions();

  return (
    <ContributionGraph data={contributions} totalCount={total}>
      <ContributionGraphCalendar>
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </ContributionGraphCalendar>
      <ContributionGraphFooter>
        <ContributionGraphTotalCount />
        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>
  );
}`;

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Blocks" },
  { label: "Contribution Graph" },
];

export default function ContributionGraphPage() {
  return (
    <ContributionGraphPlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="contribution-graph"
          description="GitHub-style contribution calendar that turns a year of activity into a wall of green — pass a username and it fetches, caches, and animates the data itself."
          details={contributionGraphApiDetails}
          detailsDescription="ContributionGraph is the provider: give it raw Activity data or just a GitHub username and it resolves the weeks grid, total count, and year that every other part reads from context. ContributionGraphCalendar draws the SVG grid and hands each day to your render prop, ContributionGraphBlock is one animated day cell with a styled commit-count tooltip, and the footer parts carry the total count and the Less→More legend. While a username fetch is in flight the same grid renders as a shimmering skeleton, and when the data lands the muted grid fades in and the greens light up level by level, lightest to darkest."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/contribution-graph/page.tsx`}
          extraSections={[
            {
              id: "server-side-data",
              title: "Server-side data",
              content: (
                <div className="space-y-4">
                  <p className="text-[15px] text-secondary leading-6">
                    The <code>username</code> prop fetches on the client and
                    keeps an in-memory cache per username. If you would rather
                    fetch once on the server — and cache across visitors — fetch
                    the same API inside <code>unstable_cache</code> in a server
                    component and pass the result through <code>data</code> and{" "}
                    <code>totalCount</code> instead.
                  </p>
                  <DocsCodeSnippet
                    code={serverUsageCode}
                    maxHeightClassName="max-h-[28rem]"
                  />
                </div>
              ),
            },
          ]}
          itemSlug="contribution-graph"
          pageUrl="/blocks/contribution-graph"
          preview={preview}
          previewClassName="min-h-[24rem]"
          previewDescription="The graph fetches live contributions for the username, shimmers while loading, then charges up: the muted grid fades in and the greens pop in level by level, lightest to darkest — hover any square for its exact count, and hit Replay to run the entrance again. Open the floating sliders control in the bottom-right to point it at any GitHub username, resize the blocks, swap the color ramp, and toggle the month labels, footer, and animation."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Contribution Graph"
          railNotes={[
            "Use the floating sliders button in the bottom-right of the preview to open settings.",
            "Type any GitHub username in settings and the graph refetches and replays the entrance.",
            "Pass `username` for zero-setup client fetching, or `data` when you already have activities.",
            "The blocks' green ramp comes from `data-level` classes — override them via className on ContributionGraphBlock.",
            "Reduced motion drops the entrance — blocks simply appear in place.",
          ]}
          title="Contribution Graph"
          usageCode={usageCode}
          usageDescription={
            "Compose the graph from its parts: ContributionGraphCalendar renders the grid and hands each day to your render prop, so you decide exactly what a block is. Pass a GitHub `username` and the component fetches the last year of contributions itself — or pass `data` with your own Activity array for full control."
          }
        />
      )}
    </ContributionGraphPlaygroundProvider>
  );
}
