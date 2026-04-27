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
    label: "Components",
    children: [
      { label: "Accordion", href: "/components/motion-accordion" },
      { label: "Alert", href: "/components/alert" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
      { label: "Breadcrumbs", href: "/components/breadcrumbs" },
      { label: "Button", href: "/components/button" },
      { label: "Calendar", href: "/components/calendar" },
      { label: "Carousel", href: "/components/carousels" },
      { label: "Collapsible", href: "/components/collapsible" },
      { label: "Combobox", href: "/components/combobox" },
      { label: "Context menu", href: "/components/context-menu" },
      { label: "Drawer", href: "/components/drawer" },
      { label: "Dialog", href: "/components/dialog" },
      { label: "Dropdown", href: "/components/dropdown" },
      { label: "File upload", href: "/components/file-upload" },
      { label: "Hover card", href: "/components/hover-card" },
      { label: "Input", href: "/components/input" },
      { label: "Popover", href: "/components/popover" },
      { label: "Checkbox group", href: "/components/checkbox-group" },
      { label: "Radio group", href: "/components/radiogroup" },
      { label: "Select", href: "/components/select" },
      { label: "Slider", href: "/components/slider" },
      { label: "Spinner", href: "/components/spinner" },
      { label: "Switch", href: "/components/switch" },
      { label: "Table", href: "/components/table" },
      { label: "Tabs", href: "/components/tabs" },
      { label: "Tooltip", href: "/components/tooltip" },
    ],
  },
] as const;

/** Section headings (h2/h3) per page for "On this page" anchor links. */
export const PAGE_SECTIONS: Record<string, { label: string; id: string }[]> =
  {};
