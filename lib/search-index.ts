import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

export type SearchItem = {
  href: string;
  keywords: string[];
  label: string;
  section: string;
  summary: string;
  type: "component" | "page";
};

const pageSummaries: Record<string, string> = {
  "/": "Overview of the React component library, registry workflow, and implementation model.",
  "/introduction":
    "What Iconiq is, how the library works, and why teams adopt editable component files.",
  "/installation":
    "Installation steps for adding components through the shadcn registry workflow.",
  "/mcp":
    "MCP setup guide for connecting Iconiq to shadcn-compatible AI coding tools and registry installs.",
};

const componentSummaries: Record<string, string> = {
  "/radix-base-ui/accordion":
    "Accordion docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/alert":
    "Alert docs in the Components section, using the shared Iconiq alert install with provider options visible but disabled.",
  "/radix-base-ui/alert-dialog":
    "Alert dialog docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/avatar":
    "Avatar docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/breadcrumbs":
    "Breadcrumbs docs in the Components section, using the shared Iconiq breadcrumbs install with provider options visible but disabled.",
  "/radix-base-ui/button":
    "Base UI button docs in the Components section, preserving the same Iconiq motion and API as the core button.",
  "/radix-base-ui/button-group":
    "Button group docs in the Components section, using the shared Iconiq button group install with provider options visible but disabled.",
  "/radix-base-ui/calendar":
    "Calendar docs in the Components section, using the shared Iconiq calendar install with provider options visible but disabled.",
  "/radix-base-ui/checkbox":
    "Checkbox docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/checkbox-group":
    "Base UI checkbox group docs in the Components section, preserving the same Iconiq row motion and disclosure behavior as the core checkbox group.",
  "/radix-base-ui/collapsible":
    "Collapsible docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/combobox":
    "Base UI combobox docs in the Components section, preserving the same Iconiq filtering, keyboard navigation, and dropdown motion as the core combobox.",
  "/radix-base-ui/context-menu":
    "Context menu docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/dialog":
    "Dialog docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/drawer":
    "Drawer docs in the Components section, using the core Iconiq drawer implementation to preserve the original controlled API and motion behavior.",
  "/radix-base-ui/dropdown":
    "Dropdown docs in the Components section, using a Radix Dropdown Menu implementation that preserves the exact Iconiq dropdown shell and motion.",
  "/radix-base-ui/file-upload":
    "File upload docs in the Components section, using the shared Iconiq file upload install with provider options visible but disabled.",
  "/radix-base-ui/hover-card":
    "Hover card docs with a provider switch that swaps between a Base UI popover-backed install and a Radix Hover Card primitive install.",
  "/radix-base-ui/input-group":
    "Input group docs in the Components section, using the shared Iconiq input group install with provider options visible but disabled.",
  "/radix-base-ui/popover":
    "Popover docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/radio-group":
    "Radio group docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/select":
    "Select docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/selection-toolbar":
    "Selection toolbar docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/skeleton":
    "Skeleton docs in the Components section, using the shared Iconiq skeleton install with provider options visible but disabled.",
  "/radix-base-ui/slider":
    "Slider docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/spinner":
    "Spinner docs in the Components section, using the shared Iconiq spinner install with provider options visible but disabled.",
  "/radix-base-ui/switch":
    "Switch docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/table":
    "Table docs in the Components section, using the shared Iconiq table install with the provider options visible but disabled.",
  "/radix-base-ui/tabs":
    "Tabs docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/tooltip":
    "Tooltip docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/radix-base-ui/toggle":
    "Compare the same pressed-state toggle API on Radix UI and Base UI, with the same ripple, icon motion, and pressed styling layered over different primitives.",
  "/special-one/icon-bar":
    "Horizontal icon chips that expand on hover to reveal short labels with spring motion.",
  "/special-one/origin-button":
    "Rounded action button with a pointer-origin fill that spreads on hover and inverts the label.",
  "/special-one/faq-pro":
    "Searchable FAQ accordion that filters items, auto-expands matches, and highlights query text.",
  "/foundation/typography":
    "Single typography primitive for headings, labels, paragraphs, subheadings, and documentation copy.",
  "/texts/dia-text":
    "Animated text reveal with a sweeping gradient band, repeat controls, and optional fixed-width rotation.",
  "/texts/shimmer-text":
    "Animated shimmer text with a moving highlight band, adjustable speed, and spread-based emphasis.",
};

const TOKEN_SPLIT_REGEX = /[\s/-]+/;

function tokenize(value: string) {
  return value.toLowerCase().split(TOKEN_SPLIT_REGEX).filter(Boolean);
}

function createKeywords(...values: string[]) {
  return Array.from(
    new Set(
      values.flatMap((value) => {
        const normalized = value.toLowerCase();
        return [normalized, ...tokenize(normalized)];
      })
    )
  );
}

const pageItems: SearchItem[] = BASE_LINKS.map((item) => ({
  href: item.href,
  keywords: createKeywords(
    item.label,
    item.href,
    "overview",
    "getting started"
  ),
  label: item.label,
  section: "Getting Started",
  summary:
    pageSummaries[item.href] ??
    "Documentation page in the Iconiq getting started section.",
  type: "page",
}));

const componentItems: SearchItem[] = SITE_SECTIONS.flatMap((section) =>
  section.children.map((item) => {
    const slug = item.href.split("/").pop() ?? item.href;
    const labelKeywords = [item.label, slug, section.label];

    if (slug === "radiogroup" || slug === "radio-group") {
      labelKeywords.push("radio group");
      labelKeywords.push("radiogroup");
    }
    if (slug === "file-upload") {
      labelKeywords.push("upload");
    }
    if (slug === "dia-text") {
      labelKeywords.push("text", "text reveal", "animated text");
    }
    if (slug === "shimmer-text") {
      labelKeywords.push("text", "shimmer", "text shimmer", "animated text");
    }
    if (slug === "skeleton") {
      labelKeywords.push("loading", "placeholder", "shimmer");
    }
    if (slug === "typography") {
      labelKeywords.push(
        "type scale",
        "heading",
        "label",
        "paragraph",
        "subheading",
        "foundation"
      );
    }

    return {
      href: item.href,
      keywords: createKeywords(...labelKeywords),
      label: item.label,
      section: section.label,
      summary:
        componentSummaries[item.href] ??
        "Component documentation with preview, installation, usage, and API details.",
      type: "component" as const,
    };
  })
);

export const SEARCH_ITEMS: SearchItem[] = [...pageItems, ...componentItems];
