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
      { label: "Alert", href: "/components/alert" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
      { label: "Breadcrumbs", href: "/components/breadcrumbs" },
      { label: "Button", href: "/components/button" },
      { label: "Collapsible", href: "/components/collapsible" },
      { label: "Dialog", href: "/components/dialog" },
      { label: "Input", href: "/components/input" },
      { label: "Checkbox group", href: "/components/checkbox-group" },
      { label: "Radio group", href: "/components/radiogroup" },
      { label: "Select", href: "/components/select" },
      { label: "Slider", href: "/components/slider" },
      { label: "Spinner", href: "/components/spinner" },
      { label: "Switch", href: "/components/switch" },
      { label: "Tooltip", href: "/components/tooltip" },
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
