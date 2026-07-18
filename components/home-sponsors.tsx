import Image from "next/image";
import Link from "next/link";

import { hatchCornerClass } from "@/components/design/design-section-rulers";
import { GridCornerDots } from "@/components/design/line-grid";
import {
  HomeShowcaseGrid,
  HomeShowcaseRow,
} from "@/components/home-showcase-grid";
import {
  getSponsor,
  SPONSOR_GRID_ROWS,
  SPONSOR_SLOT_HREF,
  type Sponsor,
  type SponsorGridCell,
} from "@/lib/sponsors";
import { cn } from "@/lib/utils";

function sponsorColSpanClass(colSpan: number) {
  return cn(
    "col-span-full min-w-0",
    colSpan === 2 && "md:col-span-2",
    colSpan === 3 && "md:col-span-3",
    colSpan === 4 && "md:col-span-4",
    colSpan === 5 && "md:col-span-5",
    colSpan === 6 && "md:col-span-6",
    colSpan === 7 && "md:col-span-7",
    colSpan === 8 && "md:col-span-8",
    colSpan === 9 && "md:col-span-9",
    colSpan === 10 && "md:col-span-10",
    colSpan === 11 && "md:col-span-11",
    colSpan === 12 && "md:col-span-12"
  );
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  const logoSizeClass =
    "h-auto max-h-10 w-auto max-w-[min(100%,180px)] object-contain";
  const monochromeClass = !sponsor.preserveColor && "brightness-0";

  return (
    <>
      <Image
        alt={sponsor.name}
        className={cn(logoSizeClass, "dark:hidden", monochromeClass)}
        height={40}
        src={sponsor.logo.light}
        width={160}
      />
      {sponsor.logo.dark ? (
        <Image
          alt={sponsor.name}
          className={cn(logoSizeClass, "hidden dark:block")}
          height={40}
          src={sponsor.logo.dark}
          width={160}
        />
      ) : (
        <Image
          alt={sponsor.name}
          className={cn(
            logoSizeClass,
            "hidden dark:block",
            monochromeClass && "brightness-0 invert"
          )}
          height={40}
          src={sponsor.logo.light}
          width={160}
        />
      )}
    </>
  );
}

const sponsorTileHeightClass = "h-[120px] md:h-[140px]";

function SponsorTile({
  cell,
}: {
  cell: Extract<SponsorGridCell, { kind: "sponsor" }>;
}) {
  const sponsor = getSponsor(cell.sponsorId);

  if (!sponsor) {
    return null;
  }

  const tileClassName = cn(
    "relative flex items-center justify-center border-border border-r border-b bg-background p-6 md:p-8",
    sponsorColSpanClass(cell.colSpan),
    sponsorTileHeightClass
  );

  const logo = (
    <>
      <GridCornerDots className="z-3 md:hidden" columns={1} rows={1} />
      <SponsorLogo sponsor={sponsor} />
    </>
  );

  if (sponsor.href) {
    return (
      <Link
        className={cn(
          "group/sponsor focus-visible:outline-none",
          tileClassName
        )}
        href={sponsor.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {logo}
        <span className="sr-only">Visit {sponsor.name}</span>
      </Link>
    );
  }

  return <div className={tileClassName}>{logo}</div>;
}

function PlaceholderTile({
  cell,
}: {
  cell: Extract<SponsorGridCell, { kind: "placeholder" }>;
}) {
  return (
    <Link
      className={cn(
        "group/sponsor-slot relative block border-border border-r border-b bg-background focus-visible:outline-none",
        hatchCornerClass,
        sponsorColSpanClass(cell.colSpan),
        sponsorTileHeightClass
      )}
      href={SPONSOR_SLOT_HREF}
      rel="noopener noreferrer"
      target="_blank"
    >
      <GridCornerDots className="z-3 md:hidden" columns={1} rows={1} />
      <span className="sr-only">Become a sponsor on GitHub</span>
    </Link>
  );
}

function SponsorGridCellView({ cell }: { cell: SponsorGridCell }) {
  if (cell.kind === "sponsor") {
    return <SponsorTile cell={cell} />;
  }

  return <PlaceholderTile cell={cell} />;
}

export function HomeSponsors({ className }: { className?: string }) {
  if (SPONSOR_GRID_ROWS.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="home-sponsors-heading"
      className={cn("isolate mt-24 overflow-visible sm:mt-32", className)}
    >
      <h3
        className="max-w-[18ch] font-light text-[clamp(0.9rem,3.4vw,1.85rem)] text-foreground tracking-[-0.07em] sm:max-w-none sm:whitespace-nowrap"
        id="home-sponsors-heading"
      >
        Sponsors
      </h3>

      <HomeShowcaseGrid className="mt-8 sm:mt-10">
        {SPONSOR_GRID_ROWS.map((row, rowIndex) => (
          <HomeShowcaseRow
            columnWeights={row.map((cell) => cell.colSpan)}
            key={`sponsor-row-${rowIndex}`}
          >
            {row.map((cell, cellIndex) => (
              <SponsorGridCellView
                cell={cell}
                key={`sponsor-cell-${rowIndex}-${cellIndex}`}
              />
            ))}
          </HomeShowcaseRow>
        ))}
      </HomeShowcaseGrid>
    </section>
  );
}
