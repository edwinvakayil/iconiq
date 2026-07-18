/**
 * Shared item-list coercion for multi-value component props (testimonials,
 * logos, slides…). Leaf module: imported by catalog-defs, catalog-preview and
 * the inspector without creating import cycles.
 */

const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

/** Coerce an unknown prop value into a list of string records. */
export function recordList(value: unknown): Record<string, string>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => {
    if (!item || typeof item !== "object") {
      return {};
    }
    const record: Record<string, string> = {};
    for (const [key, raw] of Object.entries(item as Record<string, unknown>)) {
      if (typeof raw === "string") {
        record[key] = raw;
      }
    }
    return record;
  });
}

export const DEFAULT_TESTIMONIAL_ITEMS: Record<string, string>[] = [
  {
    quote: "Iconiq UI changed our workflow.",
    name: "Alex Chen",
    title: "Design Lead",
    avatar: "/assets/av1.png",
  },
  {
    quote: "The exported code looks handwritten. We ship faster.",
    name: "Priya Sharma",
    title: "Frontend Engineer",
    avatar: "/assets/av2.png",
  },
  {
    quote: "Finally motion that doesn't fight our design system.",
    name: "Marcus Webb",
    title: "Product Designer",
    avatar: "/assets/av3.png",
  },
];

/**
 * Items for the Testimonials def. Falls back to the legacy single-item props
 * (quote/name/title) so projects saved before the fieldList upgrade keep
 * rendering.
 */
export function testimonialItems(
  props: Record<string, unknown>
): Record<string, string>[] {
  // An items array — even an emptied one — is the source of truth.
  if (Array.isArray(props.items)) {
    return recordList(props.items);
  }
  // Legacy single-item shape from before the fieldList upgrade.
  if (typeof props.quote === "string" || typeof props.name === "string") {
    return [
      {
        quote: text(props.quote, "Iconiq UI changed our workflow."),
        name: text(props.name, "Alex Chen"),
        title: text(props.title, "Design Lead"),
        avatar: "",
      },
    ];
  }
  return DEFAULT_TESTIMONIAL_ITEMS;
}

/** Logos for the Logo Carousel def, with the pre-upgrade text fallback. */
export function logoItems(
  props: Record<string, unknown>
): Record<string, string>[] {
  if (Array.isArray(props.logos)) {
    return recordList(props.logos);
  }
  return ["Acme", "Globex", "Initech", "Umbrella"].map((alt) => ({
    src: "",
    alt,
  }));
}

/** Slides for the Carousel def, with the pre-upgrade caption fallback. */
export function slideItems(
  props: Record<string, unknown>
): Record<string, string>[] {
  if (Array.isArray(props.slides)) {
    return recordList(props.slides);
  }
  return ["Slide 1", "Slide 2", "Slide 3"].map((caption) => ({
    src: "",
    caption,
  }));
}
