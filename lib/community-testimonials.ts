/**
 * Single source of truth for the home page "Community Voices" section.
 * Add, remove, or edit entries here — the section renders whatever is
 * in this list, three cards per row.
 */
export type CommunityTestimonial = {
  id: string;
  name: string;
  handle: string;
  /**
   * Avatar image: a direct image URL, or an X/Twitter profile link like
   * "https://x.com/evilrabbit_/photo" (resolved to the profile picture).
   * Falls back to initials when missing or broken.
   */
  avatar?: string;
  verified?: boolean;
  /** Where the quote came from — controls the source icon in the corner. */
  source?: "x";
  /**
   * Where the source icon links to (e.g. the original post). When omitted,
   * it falls back to the author's profile: https://x.com/<handle>.
   */
  sourceLink?: string;
  text: string;
};

export const COMMUNITY_TESTIMONIALS: CommunityTestimonial[] = [
  {
    id: "quote-1",
    name: "Evil Rabbit",
    handle: "evilrabbit_",
    avatar: "https://x.com/evilrabbit_/photo",
    verified: true,
    source: "x",
    sourceLink: "https://x.com/evilrabbit_/status/2074236477832085807",
    text: "🔥",
  },
  {
    id: "quote-2",
    name: "Amy Egan",
    handle: "AmyAEgan",
    avatar: "https://x.com/AmyAEgan/photo",
    source: "x",
    verified: true,
    sourceLink: "https://x.com/AmyAEgan/status/2074241145991819408",
    text: "Your project is awesome! Privilege to support it",
  },
  {
    id: "quote-3",
    name: "Terry Carson",
    handle: "mrterrycarson",
    avatar: "https://x.com/mrterrycarson/photo",
    verified: true,
    source: "x",
    sourceLink: "https://x.com/mrterrycarson/status/2074280511942312335",
    text: "Huge win, congrats to the Iconiq UI team. Well deserved recognition.",
  },
];
