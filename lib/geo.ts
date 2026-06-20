import "server-only";

import fs from "node:fs";

import {
  accordionApiDetails,
  alertApiDetails,
  autocompleteApiDetails,
  avatarApiDetails,
  badgeApiDetails,
  breadcrumbsApiDetails,
  buttonApiDetails,
  buttonGroupApiDetails,
  calendarApiDetails,
  chartsApiDetails,
  checkboxApiDetails,
  checkboxGroupApiDetails,
  colorPickerApiDetails,
  comboboxApiDetails,
  commandPaletteApiDetails,
  contextMenuApiDetails,
  datePickerApiDetails,
  dialogApiDetails,
  drawerApiDetails,
  dropdownApiDetails,
  faqProApiDetails,
  faviconBadgeApiDetails,
  fileTreeApiDetails,
  fileUploadApiDetails,
  fluxButtonApiDetails,
  hoverCardApiDetails,
  iconBarApiDetails,
  inputOtpApiDetails,
  liquidMarqueeApiDetails,
  morphTextsApiDetails,
  popoverApiDetails,
  promptBoxApiDetails,
  radialButtonApiDetails,
  radioGroupApiDetails,
  revealTextApiDetails,
  rollingDigitsApiDetails,
  selectApiDetails,
  selectionToolbarApiDetails,
  skeletonApiDetails,
  sliderApiDetails,
  spinnerApiDetails,
  statusDotApiDetails,
  switchApiDetails,
  tableApiDetails,
  tabsApiDetails,
  textInertiaApiDetails,
  themeToggleApiDetails,
  toggleApiDetails,
  toggleGroupApiDetails,
  tooltipApiDetails,
  typewriterApiDetails,
  typographyApiDetails,
  verifiedBadgeApiDetails,
} from "@/components/docs/component-api";
import type { DetailItem } from "@/components/docs/page-shell";
import { SITE } from "@/constants";
import { compactWhitespace, nodeToText } from "@/lib/node-to-text";
import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

type GeoGuide = {
  href: string;
  summary: string;
  title: string;
  url: string;
};

type GeoApiField = {
  defaultValue?: string;
  description: string;
  name: string;
  required: boolean;
  type?: string;
};

type GeoApiSection = {
  fields: GeoApiField[];
  id: string;
  notes: string[];
  registryPath?: string;
  summary?: string;
  title: string;
};

type GeoComponent = {
  apiSections: GeoApiSection[];
  dependencies: string[];
  href: string;
  installCommand: string;
  installPackage: string;
  name: string;
  registryPath: string;
  registryUrl: string;
  slug: string;
  summary: string;
  url: string;
};

const TRAILING_PERIOD_PATTERN = /\.$/;
const REGISTRY_JSON_SUFFIX_PATTERN = /\.json$/;
const REGISTRY_DIRECTORY = `${process.cwd()}/public/r`;

const DOCS_COMPONENT_NAME_BY_HREF: Record<string, string> = {
  "/navigation/accordion": "b-accordion",
  "/overlay-and-popups/alert-dialog": "b-alert-dialog",
  "/display-and-content/avatar": "avatar",
  "/buttons-and-actions/button": "b-button",
  "/inputs-and-forms/checkbox": "b-checkbox",
  "/inputs-and-forms/checkbox-group": "b-checkbox-group",
  "/layout-and-toolbars/collapsible": "b-collapsible",
  "/inputs-and-forms/autocomplete": "b-autocomplete",
  "/inputs-and-forms/combobox": "b-combobox",
  "/overlay-and-popups/context-menu": "b-context-menu",
  "/overlay-and-popups/dialog": "b-dialog",
  "/overlay-and-popups/drawer": "drawer",
  "/overlay-and-popups/dropdown": "r-dropdown",
  "/overlay-and-popups/hover-card": "b-hover-card",
  "/overlay-and-popups/popover": "b-popover",
  "/inputs-and-forms/radio-group": "b-radio-group",
  "/inputs-and-forms/select": "b-select",
  "/layout-and-toolbars/selection-toolbar": "b-selection-toolbar",
  "/inputs-and-forms/slider": "b-slider",
  "/inputs-and-forms/switch": "b-switch",
  "/navigation/tabs": "tabs",
  "/overlay-and-popups/tooltip": "b-tooltip",
};

const DETAILS_KEY_BY_SLUG: Record<string, string> = {
  "radio-group": "radiogroup",
  "selection-toolbar": "selectiontoolbar",
};

type RegistryCatalogItem = {
  dependencies?: string[];
  description?: string;
};

const GUIDE_SUMMARIES: Record<string, string> = {
  "/": "Homepage with the full live component playground and the primary installation path for the registry.",
  "/introduction":
    "Product overview, design principles, and the delivery model behind the Iconiq component library.",
  "/installation":
    "Installation guide for the shadcn registry flow, direct registry JSON URLs, and sample component entries.",
  "/marketplace":
    "VS Code Marketplace install page for the Iconiq UI extension, with links to the extension README and registry guides.",
  "/mcp":
    "MCP setup guide for connecting Iconiq to AI coding tools through the shadcn registry workflow.",
};

const COMPONENT_API_DETAILS: Record<string, DetailItem[]> = {
  accordion: accordionApiDetails,
  alert: alertApiDetails,
  avatar: avatarApiDetails,
  badge: badgeApiDetails,
  breadcrumbs: breadcrumbsApiDetails,
  button: buttonApiDetails,
  "button-group": buttonGroupApiDetails,
  calendar: calendarApiDetails,
  "date-picker": datePickerApiDetails,
  charts: chartsApiDetails,
  checkbox: checkboxApiDetails,
  "checkbox-group": checkboxGroupApiDetails,
  "color-picker": colorPickerApiDetails,
  autocomplete: autocompleteApiDetails,
  combobox: comboboxApiDetails,
  "command-palette": commandPaletteApiDetails,
  "context-menu": contextMenuApiDetails,
  dialog: dialogApiDetails,
  drawer: drawerApiDetails,
  dropdown: dropdownApiDetails,
  "file-upload": fileUploadApiDetails,
  "input-otp": inputOtpApiDetails,
  "liquid-marquee": liquidMarqueeApiDetails,
  "prompt-box": promptBoxApiDetails,
  "hover-card": hoverCardApiDetails,
  "icon-bar": iconBarApiDetails,
  "flux-button": fluxButtonApiDetails,
  "radial-button": radialButtonApiDetails,
  "theme-toggle": themeToggleApiDetails,
  "favicon-badge": faviconBadgeApiDetails,
  "verified-badge": verifiedBadgeApiDetails,
  "faq-pro": faqProApiDetails,
  "file-tree": fileTreeApiDetails,
  popover: popoverApiDetails,
  radiogroup: radioGroupApiDetails,
  select: selectApiDetails,
  selectiontoolbar: selectionToolbarApiDetails,
  skeleton: skeletonApiDetails,
  slider: sliderApiDetails,
  spinner: spinnerApiDetails,
  "status-dot": statusDotApiDetails,
  switch: switchApiDetails,
  table: tableApiDetails,
  tabs: tabsApiDetails,
  toggle: toggleApiDetails,
  "toggle-group": toggleGroupApiDetails,
  "morph-texts": morphTextsApiDetails,
  "reveal-text": revealTextApiDetails,
  "rolling-digits": rollingDigitsApiDetails,
  "text-inertia": textInertiaApiDetails,
  typography: typographyApiDetails,
  typewriter: typewriterApiDetails,
  tooltip: tooltipApiDetails,
};

function serializeDetailItem(item: DetailItem): GeoApiSection {
  return {
    id: item.id,
    title: compactWhitespace(nodeToText(item.title)),
    summary: compactWhitespace(nodeToText(item.summary ?? item.content)),
    registryPath: item.registryPath,
    notes: (item.notes ?? [])
      .map((note) => compactWhitespace(nodeToText(note)))
      .filter(Boolean),
    fields: (item.fields ?? []).map((field) => ({
      name: compactWhitespace(nodeToText(field.name)),
      type: compactWhitespace(nodeToText(field.type)),
      defaultValue: compactWhitespace(nodeToText(field.defaultValue)),
      required: Boolean(field.required),
      description: compactWhitespace(nodeToText(field.description)),
    })),
  };
}

function readRegistryDependencies(sections: GeoApiSection[]) {
  const registryNotes =
    sections.find((section) => section.registryPath)?.notes ?? [];
  const dependencyLine = registryNotes.find((note) =>
    note.startsWith("Dependencies:")
  );

  if (!dependencyLine) {
    return [] as string[];
  }

  return dependencyLine
    .replace("Dependencies:", "")
    .split(",")
    .map((part) => part.trim().replace(TRAILING_PERIOD_PATTERN, ""))
    .filter(Boolean);
}

function readRegistryCatalogItem(componentName: string): RegistryCatalogItem {
  const registryFilePath = `${REGISTRY_DIRECTORY}/${componentName}.json`;

  try {
    return JSON.parse(fs.readFileSync(registryFilePath, "utf8")) as {
      dependencies?: string[];
      description?: string;
    };
  } catch {
    return {};
  }
}

function buildComponentCatalog(): GeoComponent[] {
  return SITE_SECTIONS.flatMap((section) =>
    section.children.map((item) => {
      const routeSlug = item.href.split("/").pop() ?? item.href;
      const componentName = DOCS_COMPONENT_NAME_BY_HREF[item.href] ?? routeSlug;
      const detailsKey = DETAILS_KEY_BY_SLUG[routeSlug] ?? routeSlug;
      const sections = (COMPONENT_API_DETAILS[detailsKey] ?? []).map(
        serializeDetailItem
      );
      const documentedSections = sections.filter(
        (sectionEntry) => sectionEntry.id !== "registry"
      );
      const registryData = readRegistryCatalogItem(componentName);
      const registryPath = `${componentName}.json`;
      const summary =
        documentedSections.find((sectionEntry) => sectionEntry.summary)
          ?.summary ??
        registryData.description ??
        `${item.label} component documentation.`;
      const installPackage = `@iconiq/${registryPath.replace(
        REGISTRY_JSON_SUFFIX_PATTERN,
        ""
      )}`;
      const dependencies =
        registryData.dependencies?.filter(Boolean) ??
        readRegistryDependencies(sections);

      return {
        slug: componentName,
        name: item.label,
        href: item.href,
        url: `${SITE.URL}${item.href}`,
        installPackage,
        installCommand: `npx shadcn@latest add ${installPackage}`,
        registryPath,
        registryUrl: `${SITE.URL}/r/${registryPath}`,
        summary,
        apiSections: documentedSections,
        dependencies,
      };
    })
  );
}

const GUIDE_CATALOG: GeoGuide[] = BASE_LINKS.map((link) => ({
  title: link.label,
  href: link.href,
  url: link.href === "/" ? SITE.URL : `${SITE.URL}${link.href}`,
  summary: GUIDE_SUMMARIES[link.href] ?? `${link.label} documentation.`,
}));

const COMPONENT_CATALOG = buildComponentCatalog();

export { COMPONENT_CATALOG, GUIDE_CATALOG };
