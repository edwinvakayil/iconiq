import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

type SearchItem = {
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
  "/components/accordion":
    "Accordion docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/alert":
    "Alert docs in the Components section, using the shared Iconiq alert install with provider options visible but disabled.",
  "/components/alert-dialog":
    "Alert dialog docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/avatar":
    "Avatar docs for the compound Base UI avatar with image, fallback, badge, group, and count parts.",
  "/components/badge":
    "Badge docs in the Components section, using the shared Iconiq badge install with provider options visible but disabled.",
  "/components/breadcrumbs":
    "Breadcrumbs docs for the compound Base UI render-compatible trail with animated items, separators, current page, and ellipsis parts.",
  "/components/button":
    "Base UI button docs in the Components section, preserving the same Iconiq motion and API as the core button.",
  "/components/button-group":
    "Button group docs in the Components section, using the shared Iconiq button group install with provider options visible but disabled.",
  "/components/calendar":
    "Calendar docs in the Components section, using the shared Iconiq calendar install with month/year picking, fluid date-grid motion, and provider options visible but disabled.",
  "/components/charts":
    "Charts docs in the Components section, using the shared Iconiq Recharts shell with provider options visible but disabled because there is no Radix UI or Base UI variant.",
  "/components/card":
    "Card docs in the Components section, using the shared Iconiq card install with provider options visible but disabled because there is no Radix UI or Base UI variant.",
  "/components/checkbox":
    "Checkbox docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/checkbox-group":
    "Base UI checkbox group docs in the Components section, preserving the same Iconiq row motion and disclosure behavior as the core checkbox group.",
  "/components/collapsible":
    "Collapsible docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/color-picker":
    "Color picker docs with Iconiq HSV panel, format switching, alpha control, and EyeDropper.",
  "/components/autocomplete":
    "Autocomplete docs with a Base UI country search example, list filtering, and minimal spring motion on the suggestion panel.",
  "/components/combobox":
    "Base UI combobox docs in the Components section, preserving the same Iconiq filtering, keyboard navigation, and dropdown motion as the core combobox.",
  "/components/context-menu":
    "Composable context menu docs with a provider switch between Base UI and Radix UI registry installs.",
  "/components/dialog":
    "Dialog docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/drawer":
    "Drawer docs in the Components section, using the Vaul-backed drawer registry entry with Base UI and Radix UI options visible but disabled.",
  "/components/dropdown":
    "Dropdown docs in the Components section, using a Radix Dropdown Menu implementation that preserves the exact Iconiq dropdown shell and motion.",
  "/components/file-upload":
    "File upload docs in the Components section, using the shared Iconiq file upload install with provider options visible but disabled.",
  "/components/hover-card":
    "Hover card docs with a provider switch that swaps between a Base UI popover-backed install and a Radix Hover Card primitive install.",
  "/components/popover":
    "Popover docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/progress":
    "Progress docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/radio-group":
    "Radio group docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/select":
    "Select docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/separator":
    "Separator docs with a provider switch that swaps between Base UI and Radix UI registry entries, plus line, dashed, and dotted variants.",
  "/components/selection-toolbar":
    "Selection toolbar docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/skeleton":
    "Skeleton docs in the Components section, using the shared Iconiq skeleton install with provider options visible but disabled.",
  "/components/slider":
    "Slider docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/spinner":
    "Spinner docs in the Components section, using the shared Iconiq spinner install with provider options visible but disabled.",
  "/components/switch":
    "Switch docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/table":
    "Table docs in the Components section, using the shared Iconiq table install with the provider options visible but disabled.",
  "/components/tabs":
    "Tabs docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/tooltip":
    "Tooltip docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/components/toggle":
    "Compare the same pressed-state toggle API on Radix UI and Base UI, with the same ripple, icon motion, and pressed styling layered over different primitives.",
  "/components/toggle-group":
    "Toggle group docs with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/special-one/icon-bar":
    "Horizontal icon chips that expand on hover to reveal short labels with spring motion.",
  "/special-one/infiniteribbon":
    "Looping announcement ribbon that repeats text into a full-width marquee with optional reverse direction and rotation.",
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
  "/texts/text-inertia":
    "Pointer-reactive word effect that maps cursor velocity into Motion-powered x, y, and rotation spring movement.",
  "/texts/typewriter":
    "Animated typewriter text with glitch substitutions, a blinking cursor, looping playback, and reduced-motion fallback.",
};

const extraComponentKeywordsBySlug: Record<string, string[]> = {
  card: ["panel", "surface", "container"],
  charts: ["chart", "recharts", "bar chart", "data visualization", "graph"],
  "color-picker": [
    "color picker",
    "colorpicker",
    "eyedropper",
    "hex",
    "hsv",
    "swatch",
  ],
  "dia-text": ["text", "text reveal", "animated text"],
  "file-upload": ["upload"],
  infiniteribbon: [
    "infinite ribbon",
    "marquee",
    "ticker",
    "scrolling text",
    "announcement bar",
  ],
  progress: ["progress bar", "loading bar", "meter"],
  "radio-group": ["radio group", "radiogroup"],
  radiogroup: ["radio group", "radiogroup"],
  separator: [
    "divider",
    "rule",
    "line",
    "dashed",
    "dotted",
    "horizontal",
    "vertical",
  ],
  "shimmer-text": ["text", "shimmer", "text shimmer", "animated text"],
  skeleton: ["loading", "placeholder", "shimmer"],
  "text-inertia": [
    "text",
    "inertia",
    "pointer reactive text",
    "cursor velocity",
    "animated words",
    "motion text",
  ],
  "toggle-group": [
    "toggle group",
    "togglegroup",
    "segmented control",
    "segmented",
    "view switch",
  ],
  typography: [
    "type scale",
    "heading",
    "label",
    "paragraph",
    "subheading",
    "foundation",
  ],
  typewriter: [
    "text",
    "typewriter",
    "typing animation",
    "glitch text",
    "animated text",
  ],
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
    const labelKeywords = [
      item.label,
      slug,
      section.label,
      ...(extraComponentKeywordsBySlug[slug] ?? []),
    ];

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
