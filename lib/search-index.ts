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
  "/changelog":
    "A file-driven changelog page that renders local release notes as a timeline.",
};

const componentSummaries: Record<string, string> = {
  "/components/alert":
    "Dismissible alert banner with motion-aware entrance and close behavior.",
  "/components/avatar":
    "Motion-aware avatar with immediate fallback initials, image crossfade, and a 44px circular frame.",
  "/components/badge":
    "Compact badge component with animated accent treatment.",
  "/components/breadcrumbs":
    "Breadcrumb navigation with smooth separators and current-page treatment.",
  "/components/button":
    "Button primitives with variants, sizes, and motion-aware interaction states.",
  "/components/button-group":
    "Grouped action buttons, segmented button rows, and a string-based segmented control with motion-driven selection.",
  "/components/calendar":
    "Compact animated calendar for date selection and month navigation.",
  "/components/checkbox-group":
    "Checkbox group for multiple selections with animated row states.",
  "/components/combobox":
    "Searchable combobox with inline filtering and keyboard navigation.",
  "/components/context-menu":
    "Context menu with right-click actions, shortcuts, and smooth hover behavior.",
  "/components/dialog":
    "Modal dialog surface with overlay, content animation, and close controls.",
  "/components/drawer":
    "Side or bottom drawer for layered workflows and compact task flows.",
  "/components/dropdown":
    "Dropdown primitives for select-style choices or immediate action menus.",
  "/components/file-upload":
    "File upload surface with drag and drop, previews, and queued item states.",
  "/components/hover-card":
    "Hover card for richer inline profile or detail previews.",
  "/components/input-group":
    "Floating-label input group with prefix and suffix slots, inline errors, and stacked form-field layouts.",
  "/components/pagination":
    "Pagination control with animated page transitions, compact ellipsis handling, and previous or next navigation.",
  "/components/accordion":
    "Accordion component with spring-driven expansion and structured content sections.",
  "/components/popover":
    "Popover surface for compact floating content and contextual details.",
  "/components/radiogroup":
    "Radio group for single-choice options with animated selection treatment.",
  "/components/select": "Animated select control for single-choice selections.",
  "/components/skeleton":
    "Shimmer skeleton placeholder for loading states, lines, avatars, and content blocks.",
  "/components/slider":
    "Slider control for range selection with motion-aware thumb and track states.",
  "/components/spinner":
    "Loading spinner for pending states and background actions.",
  "/components/switch":
    "Animated switch control for binary settings with thumb travel and track-fill motion.",
  "/components/table":
    "Composable table primitives with aligned rows, sort helpers, and empty states.",
  "/components/tabs":
    "Tabs primitives with a measured underline, spring-smoothed panel resizing, and softened content transitions.",
  "/components/toggle":
    "Pressed-state toggle built on Radix with pointer-origin ripple, icon motion, larger hit targets, and text or icon-only formats.",
  "/components/tooltip":
    "Tooltip component for compact hover or focus explanations.",
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

    if (slug === "radiogroup") {
      labelKeywords.push("radio group");
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
