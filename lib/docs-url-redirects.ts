/** Permanent redirects from legacy docs URLs to section-based paths. */
export const DOCS_URL_REDIRECTS: { source: string; destination: string }[] = [
  { source: "/components/button", destination: "/buttons-and-actions/button" },
  {
    source: "/components/button-group",
    destination: "/buttons-and-actions/button-group",
  },
  {
    source: "/special-one/flux-button",
    destination: "/buttons-and-actions/flux-button",
  },
  {
    source: "/special-one/icon-bar",
    destination: "/buttons-and-actions/icon-bar",
  },
  { source: "/components/toggle", destination: "/buttons-and-actions/toggle" },
  {
    source: "/components/autocomplete",
    destination: "/inputs-and-forms/autocomplete",
  },
  {
    source: "/components/checkbox",
    destination: "/inputs-and-forms/checkbox",
  },
  {
    source: "/components/checkbox-group",
    destination: "/inputs-and-forms/checkbox-group",
  },
  {
    source: "/components/color-picker",
    destination: "/inputs-and-forms/color-picker",
  },
  {
    source: "/components/combobox",
    destination: "/inputs-and-forms/combobox",
  },
  {
    source: "/components/file-upload",
    destination: "/inputs-and-forms/file-upload",
  },
  {
    source: "/components/radio-group",
    destination: "/inputs-and-forms/radio-group",
  },
  { source: "/components/select", destination: "/inputs-and-forms/select" },
  { source: "/components/slider", destination: "/inputs-and-forms/slider" },
  { source: "/components/switch", destination: "/inputs-and-forms/switch" },
  {
    source: "/special-one/theme-toggle",
    destination: "/inputs-and-forms/theme-toggle",
  },
  {
    source: "/components/alert-dialog",
    destination: "/overlay-and-popups/alert-dialog",
  },
  {
    source: "/components/context-menu",
    destination: "/overlay-and-popups/context-menu",
  },
  { source: "/components/dialog", destination: "/overlay-and-popups/dialog" },
  { source: "/components/drawer", destination: "/overlay-and-popups/drawer" },
  {
    source: "/components/dropdown",
    destination: "/overlay-and-popups/dropdown",
  },
  {
    source: "/components/hover-card",
    destination: "/overlay-and-popups/hover-card",
  },
  { source: "/components/popover", destination: "/overlay-and-popups/popover" },
  { source: "/components/tooltip", destination: "/overlay-and-popups/tooltip" },
  {
    source: "/components/accordion",
    destination: "/navigation/accordion",
  },
  {
    source: "/components/breadcrumbs",
    destination: "/navigation/breadcrumbs",
  },
  { source: "/special-one/faq-pro", destination: "/navigation/faq-pro" },
  { source: "/components/tabs", destination: "/navigation/tabs" },
  {
    source: "/components/avatar",
    destination: "/display-and-content/avatar",
  },
  { source: "/components/badge", destination: "/display-and-content/badge" },
  {
    source: "/components/calendar",
    destination: "/display-and-content/calendar",
  },
  { source: "/components/card", destination: "/display-and-content/card" },
  {
    source: "/components/carousel",
    destination: "/display-and-content/carousel",
  },
  { source: "/components/charts", destination: "/display-and-content/charts" },
  {
    source: "/components/progress",
    destination: "/display-and-content/progress",
  },
  {
    source: "/components/skeleton",
    destination: "/display-and-content/skeleton",
  },
  {
    source: "/components/spinner",
    destination: "/display-and-content/spinner",
  },
  { source: "/components/table", destination: "/display-and-content/table" },
  {
    source: "/special-one/verified-badge",
    destination: "/display-and-content/verified-badge",
  },
  { source: "/components/alert", destination: "/feedback-and-alerts/alert" },
  {
    source: "/components/collapsible",
    destination: "/layout-and-toolbars/collapsible",
  },
  {
    source: "/components/selection-toolbar",
    destination: "/layout-and-toolbars/selection-toolbar",
  },
  {
    source: "/components/separator",
    destination: "/layout-and-toolbars/separator",
  },
  { source: "/components", destination: "/buttons-and-actions/button" },
  {
    source: "/special-one/origin-button",
    destination: "/special-one/radial-button",
  },
  {
    source: "/special-one/infiniteribbon",
    destination: "/layout-and-toolbars/infiniteribbon",
  },
];

const LEGACY_DOCS_PATH_REDIRECTS = Object.fromEntries(
  DOCS_URL_REDIRECTS.map(({ source, destination }) => [source, destination])
);

export function resolveLegacyDocsPath(path: string) {
  return LEGACY_DOCS_PATH_REDIRECTS[path] ?? path;
}
