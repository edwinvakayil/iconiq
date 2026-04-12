/**
 * Single source of truth for site navigation.
 * Used by sidebar and "On this page" TOC.
 */
export const BASE_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Introduction", href: "/introduction" },
  { label: "Installation", href: "/installation" },
] as const;

export const SITE_SECTIONS = [
  {
    label: "Icons",
    children: [
      { label: "Icon Library", href: "/icons" },
      { label: "Button + Icon", href: "/icons/button-svg" },
    ],
  },
  {
    label: "Components",
    children: [
      { label: "Accordion", href: "/components/motion-accordion" },
      { label: "Breadcrumbs", href: "/components/breadcrumbs" },
      { label: "Button", href: "/components/button" },
      { label: "Card", href: "/components/card" },
      { label: "Checkbox group", href: "/components/checkbox-group" },
    ],
  },
] as const;

/** Section headings (h2/h3) per page for "On this page" anchor links. */
export const PAGE_SECTIONS: Record<string, { label: string; id: string }[]> = {
  "/animated-components/animated-badges": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
};
