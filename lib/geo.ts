import {
  accordionApiDetails,
  alertApiDetails,
  avatarApiDetails,
  badgeApiDetails,
  breadcrumbsApiDetails,
  buttonApiDetails,
  buttonGroupApiDetails,
  calendarApiDetails,
  checkboxGroupApiDetails,
  comboboxApiDetails,
  contextMenuApiDetails,
  dialogApiDetails,
  drawerApiDetails,
  dropdownApiDetails,
  fileUploadApiDetails,
  hoverCardApiDetails,
  inputGroupApiDetails,
  paginationApiDetails,
  popoverApiDetails,
  radioGroupApiDetails,
  selectApiDetails,
  skeletonApiDetails,
  sliderApiDetails,
  spinnerApiDetails,
  switchApiDetails,
  tableApiDetails,
  tabsApiDetails,
  toggleApiDetails,
  tooltipApiDetails,
  typographyApiDetails,
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

const GUIDE_SUMMARIES: Record<string, string> = {
  "/": "Homepage with the full live component playground and the primary installation path for the registry.",
  "/introduction":
    "Product overview, design principles, and the delivery model behind the Iconiq component library.",
  "/installation":
    "Installation guide for the shadcn registry flow, direct registry JSON URLs, and sample component entries.",
  "/mcp":
    "MCP setup guide for connecting Iconiq to AI coding tools through the shadcn registry workflow.",
  "/changelog":
    "Release notes rendered from the local changelog source file, covering added, updated, and fixed work.",
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
  "checkbox-group": checkboxGroupApiDetails,
  combobox: comboboxApiDetails,
  "context-menu": contextMenuApiDetails,
  dialog: dialogApiDetails,
  drawer: drawerApiDetails,
  dropdown: dropdownApiDetails,
  "file-upload": fileUploadApiDetails,
  "hover-card": hoverCardApiDetails,
  "input-group": inputGroupApiDetails,
  pagination: paginationApiDetails,
  popover: popoverApiDetails,
  radiogroup: radioGroupApiDetails,
  select: selectApiDetails,
  skeleton: skeletonApiDetails,
  slider: sliderApiDetails,
  spinner: spinnerApiDetails,
  switch: switchApiDetails,
  table: tableApiDetails,
  tabs: tabsApiDetails,
  typography: typographyApiDetails,
  toggle: toggleApiDetails,
  tooltip: tooltipApiDetails,
};

const AI_DISCOVERY_LINKS = {
  indexJson: `${SITE.URL}/ai-index.json`,
  llmsFull: `${SITE.URL}/llms-full.txt`,
  llmsOverview: `${SITE.URL}/llms.txt`,
} as const;

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

function buildComponentCatalog(): GeoComponent[] {
  return SITE_SECTIONS.flatMap((section) =>
    section.children.map((item) => {
      const slug = item.href.split("/").pop() ?? item.href;
      const sections = (COMPONENT_API_DETAILS[slug] ?? []).map(
        serializeDetailItem
      );
      const documentedSections = sections.filter(
        (sectionEntry) => sectionEntry.id !== "registry"
      );
      const registryPath =
        sections.find((sectionEntry) => sectionEntry.registryPath)
          ?.registryPath ?? `${slug}.json`;
      const summary =
        documentedSections.find((sectionEntry) => sectionEntry.summary)
          ?.summary ?? `${item.label} component documentation.`;

      return {
        slug,
        name: item.label,
        href: item.href,
        url: `${SITE.URL}${item.href}`,
        installPackage: `@iconiq/${slug}`,
        installCommand: `npx shadcn@latest add @iconiq/${slug}`,
        registryPath,
        registryUrl: `${SITE.URL}/r/${registryPath}`,
        summary,
        apiSections: documentedSections,
        dependencies: readRegistryDependencies(sections),
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

export {
  AI_DISCOVERY_LINKS,
  COMPONENT_API_DETAILS,
  COMPONENT_CATALOG,
  GUIDE_CATALOG,
  serializeDetailItem,
};
export type { GeoApiField, GeoApiSection, GeoComponent, GeoGuide };
