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
    label: "Radix UI + Base UI",
    children: [
      { label: "Accordion", href: "/radix-base-ui/accordion" },
      { label: "Alert Dialog", href: "/radix-base-ui/alert-dialog" },
      { label: "Avatar", href: "/radix-base-ui/avatar" },
      { label: "Button", href: "/radix-base-ui/button" },
      { label: "Checkbox", href: "/radix-base-ui/checkbox" },
      { label: "Checkbox Group", href: "/radix-base-ui/checkbox-group" },
      { label: "Collapsible", href: "/radix-base-ui/collapsible" },
      { label: "Combobox", href: "/radix-base-ui/combobox" },
      { label: "Context Menu", href: "/radix-base-ui/context-menu" },
      { label: "Dialog", href: "/radix-base-ui/dialog" },
      { label: "Drawer", href: "/radix-base-ui/drawer" },
      { label: "Hover Card", href: "/radix-base-ui/hover-card" },
      { label: "Popover", href: "/radix-base-ui/popover" },
      { label: "Radio Group", href: "/radix-base-ui/radio-group" },
      { label: "Select", href: "/radix-base-ui/select" },
      { label: "Slider", href: "/radix-base-ui/slider" },
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
    label: "Components",
    children: [
      { label: "Accordion", href: "/components/accordion" },
      { label: "Alert", href: "/components/alert" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
      { label: "Breadcrumbs", href: "/components/breadcrumbs" },
      { label: "Button", href: "/components/button" },
      { label: "Button group", href: "/components/button-group" },
      { label: "Calendar", href: "/components/calendar" },
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "Checkbox group", href: "/components/checkbox-group" },
      { label: "Combobox", href: "/components/combobox" },
      { label: "Context menu", href: "/components/context-menu" },
      { label: "Dialog", href: "/components/dialog" },
      { label: "Drawer", href: "/components/drawer" },
      { label: "Dropdown", href: "/components/dropdown" },
      { label: "File upload", href: "/components/file-upload" },
      { label: "Hover card", href: "/components/hover-card" },
      { label: "Input group", href: "/components/input-group" },
      { label: "Popover", href: "/components/popover" },
      { label: "Radio group", href: "/components/radiogroup" },
      { label: "Select", href: "/components/select" },
      { label: "Selection Toolbar", href: "/components/selectiontoolbar" },
      { label: "Skeleton", href: "/components/skeleton" },
      { label: "Slider", href: "/components/slider" },
      { label: "Spinner", href: "/components/spinner" },
      { label: "Switch", href: "/components/switch" },
      { label: "Table", href: "/components/table" },
      { label: "Tabs", href: "/components/tabs" },
      { label: "Toggle", href: "/components/toggle" },
      { label: "Tooltip", href: "/components/tooltip" },
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
