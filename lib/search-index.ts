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
  "/navigation/accordion":
    "Accordion docs in the Navigation section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/feedback-and-alerts/alert":
    "Alert docs in the Feedback & Alerts section, using the shared Iconiq alert install with provider options visible but disabled.",
  "/overlay-and-popups/alert-dialog":
    "Alert dialog docs in the Overlay & Popups section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/display-and-content/avatar":
    "Avatar docs in the Display & Content section for the compound Base UI avatar with image, fallback, badge, group, and count parts.",
  "/display-and-content/badge":
    "Badge docs in the Display & Content section, using the shared Iconiq badge install with provider options visible but disabled.",
  "/navigation/command-palette":
    "Radix dialog command menu with grouped search, keyboard shortcuts, navigation items, and optional theme switching.",
  "/navigation/breadcrumbs":
    "Breadcrumbs docs in the Navigation section for the compound Base UI render-compatible trail with animated items, separators, current page, and ellipsis parts.",
  "/buttons-and-actions/button":
    "Base UI button docs in the Buttons & Actions section, preserving the same Iconiq motion and API as the core button.",
  "/buttons-and-actions/button-group":
    "Button group docs in the Buttons & Actions section, using the shared Iconiq button group install with provider options visible but disabled.",
  "/display-and-content/calendar":
    "Calendar docs in the Display & Content section, using the shared Iconiq calendar install with month/year picking, fluid date-grid motion, and provider options visible but disabled.",
  "/display-and-content/date-picker":
    "Date picker docs in the Display & Content section with a collapsible trigger and the shared Iconiq Calendar panel, spring open motion, and close-on-select behavior.",
  "/display-and-content/charts":
    "Charts docs in the Display & Content section, using the shared Iconiq Recharts shell with provider options visible but disabled because there is no Radix UI or Base UI variant.",
  "/display-and-content/rolling-digits":
    "Rolling digits docs in the Display & Content section for a spring-animated digit counter with blur and scale.",
  "/display-and-content/card":
    "Card docs in the Display & Content section, using the shared Iconiq card install with provider options visible but disabled because there is no Radix UI or Base UI variant.",
  "/inputs-and-forms/checkbox":
    "Checkbox docs in the Inputs & Forms section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/inputs-and-forms/checkbox-group":
    "Base UI checkbox group docs in the Inputs & Forms section, preserving the same Iconiq row motion and disclosure behavior as the core checkbox group.",
  "/layout-and-toolbars/collapsible":
    "Collapsible docs in the Layout & Toolbars section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/inputs-and-forms/color-picker":
    "Color picker docs in the Inputs & Forms section with Iconiq HSV panel, format switching, alpha control, and EyeDropper.",
  "/inputs-and-forms/autocomplete":
    "Autocomplete docs in the Inputs & Forms section with a Base UI country search example, list filtering, and minimal spring motion on the suggestion panel.",
  "/inputs-and-forms/combobox":
    "Base UI combobox docs in the Inputs & Forms section, preserving the same Iconiq filtering, keyboard navigation, and dropdown motion as the core combobox.",
  "/overlay-and-popups/context-menu":
    "Composable context menu docs in the Overlay & Popups section with a provider switch between Base UI and Radix UI registry installs.",
  "/overlay-and-popups/dialog":
    "Dialog docs in the Overlay & Popups section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/overlay-and-popups/drawer":
    "Drawer docs in the Overlay & Popups section, using the Vaul-backed drawer registry entry with Base UI and Radix UI options visible but disabled.",
  "/overlay-and-popups/dropdown":
    "Dropdown docs in the Overlay & Popups section, using a Radix Dropdown Menu implementation that preserves the exact Iconiq dropdown shell and motion.",
  "/inputs-and-forms/file-upload":
    "File upload docs in the Inputs & Forms section, using the shared Iconiq file upload install with provider options visible but disabled.",
  "/inputs-and-forms/input-otp":
    "Input OTP docs in the Inputs & Forms section with Base UI OTP Field slots, spring focus motion, character entrance, and a blinking caret on the active cell.",
  "/blocks/prompt-box":
    "Prompt box docs in the Blocks section with a compact-to-expanded AI prompt field, spring resize, model footer controls, and send or voice actions.",
  "/overlay-and-popups/hover-card":
    "Hover card docs in the Overlay & Popups section with a provider switch that swaps between a Base UI popover-backed install and a Radix Hover Card primitive install.",
  "/overlay-and-popups/popover":
    "Popover docs in the Overlay & Popups section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/display-and-content/progress":
    "Progress docs in the Display & Content section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/inputs-and-forms/radio-group":
    "Radio group docs in the Inputs & Forms section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/inputs-and-forms/select":
    "Select docs in the Inputs & Forms section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/layout-and-toolbars/separator":
    "Separator docs in the Layout & Toolbars section with a provider switch that swaps between Base UI and Radix UI registry entries, plus line, dashed, and dotted variants.",
  "/layout-and-toolbars/selection-toolbar":
    "Selection toolbar docs in the Layout & Toolbars section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/display-and-content/skeleton":
    "Skeleton docs in the Display & Content section, using the shared Iconiq skeleton install with provider options visible but disabled.",
  "/inputs-and-forms/slider":
    "Slider docs in the Inputs & Forms section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/display-and-content/spinner":
    "Spinner docs in the Display & Content section, using the shared Iconiq spinner install with provider options visible but disabled.",
  "/inputs-and-forms/switch":
    "Switch docs in the Inputs & Forms section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/display-and-content/table":
    "Table docs in the Display & Content section, using the shared Iconiq table install with the provider options visible but disabled.",
  "/navigation/tabs":
    "Tabs docs in the Navigation section for segmented Radix tabs with a sliding active pill and controlled state.",
  "/overlay-and-popups/tooltip":
    "Tooltip docs in the Overlay & Popups section with a provider switch that swaps between Base UI and Radix UI registry entries.",
  "/buttons-and-actions/icon-bar":
    "Horizontal icon chips in the Buttons & Actions section that expand on hover to reveal short labels with spring motion.",
  "/buttons-and-actions/toggle":
    "Toggle docs in the Buttons & Actions section with a provider switch that swaps between Base UI and Radix UI registry entries and spring press feedback.",
  "/buttons-and-actions/toggle-group":
    "Toggle group docs in the Buttons & Actions section with a provider switch that swaps between Base UI and Radix UI registry entries for segmented toolbar controls.",
  "/layout-and-toolbars/infiniteribbon":
    "Looping announcement ribbon in the Layout & Toolbars section that repeats text into a full-width marquee with optional reverse direction and rotation.",
  "/special-one/radial-button":
    "Rounded action button with a radial fill that spreads on hover and inverts the label.",
  "/navigation/faq-pro":
    "Searchable FAQ accordion in the Navigation section that filters items, auto-expands matches, and highlights query text.",
  "/navigation/file-tree":
    "Compound file tree in the Navigation section with nested FileTreeItem rows, Base UI Button folder toggles, hover highlight tracking, and optional emphasis for new files. Base UI install only.",
  "/buttons-and-actions/flux-button":
    "Async button in the Buttons & Actions section with idle, loading, and success states.",
  "/inputs-and-forms/theme-toggle":
    "Animated light/dark pill switch with sun and moon icons.",
  "/display-and-content/verified-badge":
    "X-style verified badge in the Display & Content section with shimmer or static variants.",
  "/display-and-content/carousel":
    "Embla-powered carousel in the Display & Content section with aspect-ratio presets and horizontal or vertical slides.",
  "/foundation/typography":
    "Single typography primitive for headings, labels, paragraphs, subheadings, and documentation copy.",
  "/texts/dia-text":
    "Animated text reveal with a sweeping gradient band, repeat controls, and optional fixed-width rotation.",
  "/texts/reveal-text":
    "Staggered word or character reveal with spring lift, blur fade, and optional scroll-triggered playback.",
  "/texts/morph-texts":
    "Cycling headline words with a goo-filter morph transition powered by Motion.",
  "/texts/shimmer-text":
    "Animated shimmer text with a moving highlight band, adjustable speed, and spread-based emphasis.",
  "/texts/text-inertia":
    "Pointer-reactive word effect that maps cursor velocity into Motion-powered x, y, and rotation spring movement.",
  "/texts/typewriter":
    "Animated typewriter text with glitch substitutions, a blinking cursor, and looping playback.",
};

const extraComponentKeywordsBySlug: Record<string, string[]> = {
  card: ["panel", "surface", "container"],
  "command-palette": [
    "command menu",
    "command palette",
    "search",
    "keyboard shortcut",
    "cmd k",
    "navigation",
  ],
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
  "reveal-text": [
    "text",
    "reveal text",
    "text reveal",
    "staggered text",
    "scroll reveal",
    "animated text",
  ],
  "morph-texts": [
    "text",
    "morph text",
    "animated headline",
    "goo filter",
    "animated text",
  ],
  "file-upload": ["upload"],
  "input-otp": [
    "otp",
    "one-time password",
    "verification code",
    "pin",
    "2fa",
    "auth code",
  ],
  "prompt-box": [
    "prompt",
    "chat input",
    "ai input",
    "message box",
    "composer",
    "textarea",
    "ask anything",
  ],
  infiniteribbon: [
    "infinite ribbon",
    "marquee",
    "ticker",
    "scrolling text",
    "announcement bar",
  ],
  "rolling-digits": [
    "rolling digits",
    "animated number",
    "counter",
    "odometer",
    "count up",
    "stat",
    "metric",
  ],
  carousel: ["slider", "slideshow", "embla", "slides", "gallery"],
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
