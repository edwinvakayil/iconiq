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
    label: "Buttons & Actions",
    children: [
      { label: "Button", href: "/buttons-and-actions/button" },
      { label: "Button Group", href: "/buttons-and-actions/button-group" },
      { label: "Flux Button", href: "/buttons-and-actions/flux-button" },
      { label: "Icon Bar", href: "/buttons-and-actions/icon-bar" },
      { label: "Toggle", href: "/buttons-and-actions/toggle" },
      { label: "Toggle Group", href: "/buttons-and-actions/toggle-group" },
    ],
  },
  {
    label: "Inputs & Forms",
    children: [
      { label: "Autocomplete", href: "/inputs-and-forms/autocomplete" },
      { label: "Checkbox", href: "/inputs-and-forms/checkbox" },
      { label: "Checkbox Group", href: "/inputs-and-forms/checkbox-group" },
      { label: "Color Picker", href: "/inputs-and-forms/color-picker" },
      { label: "Combobox", href: "/inputs-and-forms/combobox" },
      { label: "File Upload", href: "/inputs-and-forms/file-upload" },
      { label: "Radio Group", href: "/inputs-and-forms/radio-group" },
      { label: "Select", href: "/inputs-and-forms/select" },
      { label: "Slider", href: "/inputs-and-forms/slider" },
      { label: "Switch", href: "/inputs-and-forms/switch" },
      { label: "Theme Toggle", href: "/inputs-and-forms/theme-toggle" },
    ],
  },
  {
    label: "Overlay & Popups",
    children: [
      { label: "Alert Dialog", href: "/overlay-and-popups/alert-dialog" },
      { label: "Context Menu", href: "/overlay-and-popups/context-menu" },
      { label: "Dialog", href: "/overlay-and-popups/dialog" },
      { label: "Drawer", href: "/overlay-and-popups/drawer" },
      { label: "Dropdown", href: "/overlay-and-popups/dropdown" },
      { label: "Hover Card", href: "/overlay-and-popups/hover-card" },
      { label: "Popover", href: "/overlay-and-popups/popover" },
      { label: "Tooltip", href: "/overlay-and-popups/tooltip" },
    ],
  },
  {
    label: "Navigation",
    children: [
      { label: "Accordion", href: "/navigation/accordion" },
      { label: "Breadcrumbs", href: "/navigation/breadcrumbs" },
      { label: "FAQ Pro", href: "/navigation/faq-pro" },
      { label: "Tabs", href: "/navigation/tabs" },
    ],
  },
  {
    label: "Display & Content",
    children: [
      { label: "Avatar", href: "/display-and-content/avatar" },
      { label: "Badge", href: "/display-and-content/badge" },
      { label: "Calendar", href: "/display-and-content/calendar" },
      { label: "Card", href: "/display-and-content/card" },
      { label: "Carousel", href: "/display-and-content/carousel" },
      { label: "Charts", href: "/display-and-content/charts" },
      { label: "Progress", href: "/display-and-content/progress" },
      { label: "Skeleton", href: "/display-and-content/skeleton" },
      { label: "Spinner", href: "/display-and-content/spinner" },
      { label: "Table", href: "/display-and-content/table" },
      { label: "Verified Badge", href: "/display-and-content/verified-badge" },
    ],
  },
  {
    label: "Feedback & Alerts",
    children: [{ label: "Alert", href: "/feedback-and-alerts/alert" }],
  },
  {
    label: "Layout & Toolbars",
    children: [
      { label: "Collapsible", href: "/layout-and-toolbars/collapsible" },
      {
        label: "Selection Toolbar",
        href: "/layout-and-toolbars/selection-toolbar",
      },
      { label: "Separator", href: "/layout-and-toolbars/separator" },
      { label: "Infinite Ribbon", href: "/layout-and-toolbars/infiniteribbon" },
    ],
  },
  {
    label: "Special One",
    children: [{ label: "Radial Button", href: "/special-one/radial-button" }],
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
      { label: "Text Inertia", href: "/texts/text-inertia" },
      { label: "Typewriter", href: "/texts/typewriter" },
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
