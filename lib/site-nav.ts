/**
 * Single source of truth for site navigation.
 * Used by sidebar and "On this page" TOC.
 */
export const BASE_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Introduction", href: "/introduction" },
  { label: "Installation", href: "/installation" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "MCP", href: "/mcp" },
] as const;

/**
 * Hrefs to keep out of the rendered nav surfaces (desktop sidebar, mobile
 * nav, navigation.json) while leaving them in SITE_SECTIONS so the pages
 * still work as component doc pages (breadcrumbs, footer, prev/next, etc).
 */
export const HIDDEN_NAV_HREFS: readonly string[] = [
  "/blocks/setup-checklist",
  "/blocks/team-invitation",
];

export const SITE_SECTIONS = [
  {
    label: "Blocks",
    children: [
      { label: "AI Input", href: "/blocks/ai-input" },
      { label: "Banner", href: "/blocks/banner" },
      { label: "Code Block", href: "/blocks/code-block" },
      { label: "Feedback Form", href: "/blocks/feedback-form" },
      { label: "Logo Carousel", href: "/blocks/logo-carousel" },
      { label: "Reasoning Steps", href: "/blocks/reasoning-steps" },
      { label: "Scroll Progress", href: "/blocks/scroll-progress" },
      { label: "Setup Checklist", href: "/blocks/setup-checklist" },
      { label: "Streaming Text", href: "/blocks/streaming-text" },
      { label: "Team Invitation", href: "/blocks/team-invitation" },
      { label: "Testimonials", href: "/blocks/testimonials" },
      { label: "Thinking Indicator", href: "/blocks/thinking-indicator" },
    ],
  },
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
    label: "Display & Content",
    children: [
      { label: "Avatar", href: "/display-and-content/avatar" },
      { label: "Badge", href: "/display-and-content/badge" },
      { label: "Calendar", href: "/display-and-content/calendar" },
      { label: "Card", href: "/display-and-content/card" },
      { label: "Carousel", href: "/display-and-content/carousel" },
      { label: "Charts", href: "/display-and-content/charts" },
      { label: "Date Picker", href: "/display-and-content/date-picker" },
      { label: "Favicon Badge", href: "/display-and-content/favicon-badge" },
      { label: "Progress", href: "/display-and-content/progress" },
      { label: "Rolling Digits", href: "/display-and-content/rolling-digits" },
      { label: "Skeleton", href: "/display-and-content/skeleton" },
      { label: "Spinner", href: "/display-and-content/spinner" },
      { label: "Status Dot", href: "/display-and-content/status-dot" },
      { label: "Table", href: "/display-and-content/table" },
      { label: "Timezone", href: "/display-and-content/timezone" },
      { label: "Verified Badge", href: "/display-and-content/verified-badge" },
    ],
  },
  {
    label: "Feedback & Alerts",
    children: [{ label: "Alert", href: "/feedback-and-alerts/alert" }],
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
      { label: "Input", href: "/inputs-and-forms/input" },
      { label: "Input OTP", href: "/inputs-and-forms/input-otp" },
      { label: "Radio Group", href: "/inputs-and-forms/radio-group" },
      { label: "Select", href: "/inputs-and-forms/select" },
      { label: "Slider", href: "/inputs-and-forms/slider" },
      { label: "Switch", href: "/inputs-and-forms/switch" },
      { label: "Theme Toggle", href: "/inputs-and-forms/theme-toggle" },
    ],
  },
  {
    label: "Layout & Toolbars",
    children: [
      { label: "Collapsible", href: "/layout-and-toolbars/collapsible" },
      { label: "Infinite Ribbon", href: "/layout-and-toolbars/infiniteribbon" },
      {
        label: "Selection Toolbar",
        href: "/layout-and-toolbars/selection-toolbar",
      },
      { label: "Separator", href: "/layout-and-toolbars/separator" },
    ],
  },
  {
    label: "Navigation",
    children: [
      { label: "Accordion", href: "/navigation/accordion" },
      { label: "Breadcrumbs", href: "/navigation/breadcrumbs" },
      { label: "Command Palette", href: "/navigation/command-palette" },
      { label: "FAQ Pro", href: "/navigation/faq-pro" },
      { label: "File Tree", href: "/navigation/file-tree" },
      { label: "Tabs", href: "/navigation/tabs" },
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
    label: "Special One",
    children: [{ label: "Radial Button", href: "/special-one/radial-button" }],
  },
  {
    label: "Texts",
    children: [
      { label: "Dia Text", href: "/texts/dia-text" },
      { label: "Morph Text", href: "/texts/morph-texts" },
      { label: "Reveal Text", href: "/texts/reveal-text" },
      { label: "Shimmer Text", href: "/texts/shimmer-text" },
      { label: "Text Loop", href: "/texts/text-loop" },
    ],
  },
] as const;

export const HOME_NAV_SECTION_LABELS = [
  "Display & Content",
  "Inputs & Forms",
  "Texts",
] as const;

export function getHomeNavSectionLinks() {
  return HOME_NAV_SECTION_LABELS.map((label) => {
    const section = SITE_SECTIONS.find((entry) => entry.label === label);
    const firstChild = section?.children[0];

    return {
      label,
      href: firstChild?.href ?? "/",
      featuredName: firstChild?.label ?? label,
    };
  });
}

/** Section headings (h2/h3) per page for "On this page" anchor links. */
export const PAGE_SECTIONS: Record<string, { label: string; id: string }[]> =
  {};
