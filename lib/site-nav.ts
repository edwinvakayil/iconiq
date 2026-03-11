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
    label: "Animated Components",
    children: [
      {
        label: "Animated Tooltip",
        href: "/animated-components/animated-tooltip",
      },
      { label: "Highlighter", href: "/animated-components/highlighter" },
      {
        label: "Accordion (Animated)",
        href: "/animated-components/accordion-animated",
      },
      {
        label: "Hover Flip Card",
        href: "/animated-components/hover-flip-card",
      },
    ],
  },
  {
    label: "Components",
    children: [
      { label: "Input Groups", href: "/components/input-groups" },
      { label: "File Tree", href: "/components/file-tree" },
    ],
  },
] as const;

/** Section headings (h2/h3) per page for "On this page" anchor links. */
export const PAGE_SECTIONS: Record<string, { label: string; id: string }[]> = {
  "/animated-components/animated-tooltip": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/animated-components/highlighter": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/animated-components/accordion-animated": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/animated-components/hover-flip-card": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/input-groups": [
    { label: "Password field", id: "password-field" },
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
    { label: "Input Label", id: "input-label" },
    { label: "Preview", id: "input-label-preview" },
    { label: "Usage", id: "input-label-usage" },
    { label: "Props", id: "input-label-props" },
  ],
  "/components/file-tree": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
};
