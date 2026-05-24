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
      { label: "Accordion", href: "/radix-base-ui/accordion" },
      { label: "Alert", href: "/radix-base-ui/alert" },
      { label: "Alert Dialog", href: "/radix-base-ui/alert-dialog" },
      { label: "Avatar", href: "/radix-base-ui/avatar" },
      { label: "Breadcrumbs", href: "/radix-base-ui/breadcrumbs" },
      { label: "Button", href: "/radix-base-ui/button" },
      { label: "Button Group", href: "/radix-base-ui/button-group" },
      { label: "Calendar", href: "/radix-base-ui/calendar" },
      { label: "Checkbox", href: "/radix-base-ui/checkbox" },
      { label: "Checkbox Group", href: "/radix-base-ui/checkbox-group" },
      { label: "Collapsible", href: "/radix-base-ui/collapsible" },
      { label: "Combobox", href: "/radix-base-ui/combobox" },
      { label: "Context Menu", href: "/radix-base-ui/context-menu" },
      { label: "Dialog", href: "/radix-base-ui/dialog" },
      { label: "Drawer", href: "/radix-base-ui/drawer" },
      { label: "Dropdown", href: "/radix-base-ui/dropdown" },
      { label: "File Upload", href: "/radix-base-ui/file-upload" },
      { label: "Hover Card", href: "/radix-base-ui/hover-card" },
      { label: "Input Group", href: "/radix-base-ui/input-group" },
      { label: "Popover", href: "/radix-base-ui/popover" },
      { label: "Radio Group", href: "/radix-base-ui/radio-group" },
      { label: "Select", href: "/radix-base-ui/select" },
      {
        label: "Selection Toolbar",
        href: "/radix-base-ui/selection-toolbar",
      },
      { label: "Skeleton", href: "/radix-base-ui/skeleton" },
      { label: "Slider", href: "/radix-base-ui/slider" },
      { label: "Spinner", href: "/radix-base-ui/spinner" },
      { label: "Switch", href: "/radix-base-ui/switch" },
      { label: "Table", href: "/radix-base-ui/table" },
      { label: "Tabs", href: "/radix-base-ui/tabs" },
      { label: "Toggle", href: "/radix-base-ui/toggle" },
      { label: "Tooltip", href: "/radix-base-ui/tooltip" },
    ],
  },
  {
    label: "Special One",
    children: [
      { label: "Icon Bar", href: "/special-one/icon-bar" },
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
