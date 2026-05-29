/**
 * Single source of truth for site navigation.
 * Used by sidebar and "On this page" TOC.
 */
export const BASE_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Introduction", href: "/introduction" },
  { label: "Installation", href: "/installation" },
  { label: "MCP", href: "/mcp" },
] as const;

export const SITE_SECTIONS = [
  {
    label: "Components",
    children: [
      { label: "Accordion", href: "/components/accordion" },
      { label: "Alert", href: "/components/alert" },
      { label: "Alert Dialog", href: "/components/alert-dialog" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
      { label: "Breadcrumbs", href: "/components/breadcrumbs" },
      { label: "Button", href: "/components/button" },
      { label: "Button Group", href: "/components/button-group" },
      { label: "Card", href: "/components/card" },
      { label: "Calendar", href: "/components/calendar" },
      { label: "Charts", href: "/components/charts" },
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "Checkbox Group", href: "/components/checkbox-group" },
      { label: "Collapsible", href: "/components/collapsible" },
      { label: "Combobox", href: "/components/combobox" },
      { label: "Context Menu", href: "/components/context-menu" },
      { label: "Dialog", href: "/components/dialog" },
      { label: "Drawer", href: "/components/drawer" },
      { label: "Dropdown", href: "/components/dropdown" },
      { label: "File Upload", href: "/components/file-upload" },
      { label: "Hover Card", href: "/components/hover-card" },
      { label: "Input Group", href: "/components/input-group" },
      { label: "Popover", href: "/components/popover" },
      { label: "Progress", href: "/components/progress" },
      { label: "Radio Group", href: "/components/radio-group" },
      { label: "Select", href: "/components/select" },
      {
        label: "Selection Toolbar",
        href: "/components/selection-toolbar",
      },
      { label: "Skeleton", href: "/components/skeleton" },
      { label: "Slider", href: "/components/slider" },
      { label: "Spinner", href: "/components/spinner" },
      { label: "Switch", href: "/components/switch" },
      { label: "Table", href: "/components/table" },
      { label: "Tabs", href: "/components/tabs" },
      { label: "Toggle", href: "/components/toggle" },
      { label: "Toggle Group", href: "/components/toggle-group" },
      { label: "Tooltip", href: "/components/tooltip" },
    ],
  },
  {
    label: "Special One",
    children: [
      { label: "Icon Bar", href: "/special-one/icon-bar" },
      { label: "Infinite Ribbon", href: "/special-one/infiniteribbon" },
      { label: "Origin Button", href: "/special-one/origin-button" },
      { label: "FAQ Pro", href: "/special-one/faq-pro" },
    ],
  },
  {
    label: "Foundation",
    children: [{ label: "Typography", href: "/foundation/typography" }],
  },
  {
    label: "Texts",
    children: [
      { label: "Dia Text", href: "/texts/dia-text" },
      { label: "Shimmer Text", href: "/texts/shimmer-text" },
    ],
  },
] as const;

/** Section headings (h2/h3) per page for "On this page" anchor links. */
export const PAGE_SECTIONS: Record<string, { label: string; id: string }[]> = {
  "/foundation/typography": [
    { label: "Installation", id: "installation" },
    { label: "Scale", id: "scale" },
    { label: "Props", id: "props" },
  ],
};
