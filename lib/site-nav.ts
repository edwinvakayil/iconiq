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
      { label: "Badges", href: "/components/badges" },
      { label: "Input Groups", href: "/components/input-groups" },
      { label: "Breadcrumb", href: "/components/breadcrumbs" },
      { label: "Radio Group", href: "/components/radiogroup" },
      { label: "Alert", href: "/components/alert" },
      { label: "Chart", href: "/components/chart" },
      { label: "Select", href: "/components/select" },
      { label: "Slider", href: "/components/slider" },
      { label: "Smart Tooltip", href: "/components/smart-tooltip" },
      { label: "File Tree", href: "/components/file-tree" },
      { label: "Magic Pen", href: "/components/magic-pen" },
      { label: "Drag Task List", href: "/components/drag-task" },
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
  "/components/badges": [
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
  "/components/breadcrumbs": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/radiogroup": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/alert": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/chart": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/select": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/slider": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/smart-tooltip": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/file-tree": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/magic-pen": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
  "/components/drag-task": [
    { label: "Preview", id: "preview" },
    { label: "Usage", id: "usage" },
    { label: "Props", id: "props" },
  ],
};
