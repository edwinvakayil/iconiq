/**
 * Single source of truth for the home page "Sponsors" section.
 * Add, remove, or edit sponsor entries here — logos live in
 * `public/sponsors/`. The grid layout is defined in SPONSOR_GRID_ROWS.
 */
export type Sponsor = {
  id: string;
  name: string;
  logo: {
    light: string;
    dark?: string;
  };
  /** When true, skip monochrome filter so brand colors show through. */
  preserveColor?: boolean;
  href?: string;
};

export type SponsorGridCell =
  | { kind: "sponsor"; sponsorId: string; colSpan: number }
  | { kind: "placeholder"; colSpan: number };

/** Empty sponsor slots link here — GitHub Sponsors profile. */
export const SPONSOR_SLOT_HREF = "https://github.com/sponsors/edwinvakayil";

export const SPONSORS: Sponsor[] = [
  {
    id: "vercel",
    name: "Vercel",
    logo: {
      light: "/sponsors/vercel-light.svg",
      dark: "/sponsors/vercel-dark.svg",
    },
    href: "https://vercel.com",
  },
  {
    id: "mintlify",
    name: "Mintlify",
    logo: {
      light: "/sponsors/Mintlify-light.svg",
    },
    href: "https://mintlify.com",
  },
  {
    id: "greptile",
    name: "Greptile",
    logo: {
      light: "/sponsors/wordmark-logo-green.svg",
    },
    href: "https://greptile.com",
  },
  {
    id: "sentry",
    name: "Sentry",
    logo: {
      light: "/sponsors/sentry-wordmark-dark-400x119.svg",
      dark: "/sponsors/sentry-wordmark-light-400x119.svg",
    },
    href: "https://sentry.io",
  },
];

/** Each row has 3 equal columns. Row 1: three sponsors. Row 2: greptile + placeholders. */
export const SPONSOR_GRID_ROWS: SponsorGridCell[][] = [
  [
    { kind: "sponsor", sponsorId: "vercel", colSpan: 4 },
    { kind: "sponsor", sponsorId: "mintlify", colSpan: 4 },
    { kind: "sponsor", sponsorId: "sentry", colSpan: 4 },
  ],
  [
    { kind: "sponsor", sponsorId: "greptile", colSpan: 4 },
    { kind: "placeholder", colSpan: 4 },
    { kind: "placeholder", colSpan: 4 },
  ],
];

const sponsorById = new Map(SPONSORS.map((sponsor) => [sponsor.id, sponsor]));

export function getSponsor(id: string) {
  return sponsorById.get(id);
}
