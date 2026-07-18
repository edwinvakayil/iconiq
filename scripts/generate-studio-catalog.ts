/**
 * Generates lib/studio/catalog.ts from SITE_SECTIONS.
 * Run: pnpm tsx scripts/generate-studio-catalog.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { HIDDEN_NAV_HREFS, SITE_SECTIONS } from "../lib/site-nav";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../lib/studio/catalog.ts");

/** Short palette descriptions (first sentence of registry meta when available). */
const DESCRIPTIONS: Record<string, string> = {
  "ai-input":
    "Chat-style AI composer with agent chips and sent-message bubbles.",
  banner:
    "Top-of-screen announcement bar with gradient tones and dismiss action.",
  "code-block":
    "Editor-style code surface with syntax highlighting and copy button.",
  "contribution-graph":
    "GitHub-style activity calendar with springy block entrance.",
  "feedback-form":
    "Collapsed pill that morphs into an expanded feedback panel.",
  "logo-carousel": "Multi-column logo grid with staggered wave animation.",
  message: "Composable chat message primitives with spring entrance.",
  "reasoning-steps": "Collapsible AI reasoning trace with step timeline.",
  "scroll-progress": "Ruler-style scroll indicator with live percentage.",
  "streaming-text": "Word-by-word AI text streaming with gradient settle.",
  testimonials: "Quote wall that blurs siblings on hover.",
  "thinking-indicator": "AI loading state with morphing sparkle glyph.",
  "button-group": "Grouped buttons with shared borders and motion.",
  "flux-button": "Async button with idle, loading, and success states.",
  "icon-bar": "Horizontal icon chips that expand on hover.",
  toggle: "Pressable toggle with spring feedback.",
  "toggle-group": "Segmented toolbar toggle group.",
  calendar: "Date calendar with single and range selection.",
  carousel: "Embla-powered carousel with aspect-ratio presets.",
  charts: "Recharts shell with theme-aware chart styling.",
  "date-picker": "Collapsible date picker with spring open motion.",
  "favicon-badge": "Circular favicon badge with optional label.",
  progress: "Animated progress bar with inline readout.",
  "rolling-digits": "Spring-animated digit counter.",
  skeleton: "Shimmer or fade loading placeholders.",
  "status-dot": "Rippling deployment state indicator.",
  table: "Data table with sortable columns and motion.",
  timezone: "Inline live clock with IANA timezone support.",
  "verified-badge": "X-style verified badge with shimmer variant.",
  autocomplete: "Searchable autocomplete with suggestion panel.",
  "checkbox-group": "Checkbox rows with disclosure motion.",
  "color-picker": "HSV color panel with format switching.",
  combobox: "Searchable single-select with dropdown motion.",
  "file-upload": "Drag-and-drop uploader with queued file rows.",
  "input-otp": "OTP field with spring focus and caret motion.",
  "radio-group": "Radio options with spring selection feedback.",
  select: "Animated single-select dropdown with checkmarks.",
  slider: "Range slider with spring thumb and track fill.",
  "theme-toggle": "Animated light/dark pill switch.",
  "wheel-picker": "iOS-style 3D barrel picker with inertia.",
  collapsible: "Height-animated disclosure with icon rotation.",
  infiniteribbon: "Looping announcement marquee ribbon.",
  "selection-toolbar": "Floating toolbar for text selection.",
  separator: "Hairline separator with dashed and dotted variants.",
  "command-palette": "Searchable command menu with shortcuts.",
  "faq-pro": "Searchable FAQ accordion with query highlight.",
  "file-tree": "Nested file tree with folder toggles.",
  "alert-dialog": "Modal alert dialog with action variants.",
  "context-menu": "Viewport-aware context menu with shortcuts.",
  dialog: "Modal dialog with spring overlay entrance.",
  drawer: "Vaul drawer with drag gestures and snap points.",
  dropdown: "Animated dropdown menu with chevron rotation.",
  "hover-card": "Hover-triggered preview card with spring motion.",
  popover: "Anchored popover panel with spring entrance.",
  tooltip: "Spring tooltip with placement-aware motion.",
  "radial-button": "Rounded button with radial hover fill.",
  "dia-text": "Animated text reveal with sweeping gradient.",
  "morph-texts": "Cycling headline words with goo morph.",
  "reveal-text": "Staggered word reveal with blur fade.",
  "shimmer-text": "Shimmer highlight band across text.",
  "text-loop": "Cycling text with vertical slide transitions.",
};

/** Preferred registry + CLI install name per docs slug. */
const REGISTRY_BY_SLUG: Record<string, { registry: string; cli: string }> = {
  button: { registry: "button", cli: "button" },
  checkbox: { registry: "checkbox", cli: "checkbox" },
  input: { registry: "input", cli: "input" },
  switch: { registry: "switch", cli: "switch" },
  tabs: { registry: "tabs", cli: "tabs" },
  breadcrumbs: { registry: "breadcrumbs", cli: "breadcrumbs" },
  accordion: { registry: "accordion", cli: "accordion" },
  alert: { registry: "alert", cli: "alert" },
  badge: { registry: "badge", cli: "badge" },
  spinner: { registry: "spinner", cli: "spinner" },
  card: { registry: "card", cli: "card" },
  avatar: { registry: "avatar", cli: "avatar" },
  separator: { registry: "b-separator", cli: "b-separator" },
  toggle: { registry: "b-toggle", cli: "b-toggle" },
  "toggle-group": { registry: "b-togglegroup", cli: "b-togglegroup" },
  progress: { registry: "b-progress", cli: "b-progress" },
  select: { registry: "b-select", cli: "b-select" },
  slider: { registry: "b-slider", cli: "b-slider" },
  "radio-group": { registry: "b-radio-group", cli: "b-radio-group" },
  collapsible: { registry: "b-collapsible", cli: "b-collapsible" },
  "selection-toolbar": {
    registry: "b-selection-toolbar",
    cli: "b-selection-toolbar",
  },
  autocomplete: { registry: "b-autocomplete", cli: "b-autocomplete" },
  combobox: { registry: "b-combobox", cli: "b-combobox" },
  "context-menu": { registry: "b-context-menu", cli: "b-context-menu" },
  "alert-dialog": { registry: "b-alert-dialog", cli: "b-alert-dialog" },
  dialog: { registry: "b-dialog", cli: "b-dialog" },
  "hover-card": { registry: "b-hover-card", cli: "b-hover-card" },
  popover: { registry: "b-popover", cli: "b-popover" },
  tooltip: { registry: "b-tooltip", cli: "b-tooltip" },
  dropdown: { registry: "r-dropdown", cli: "r-dropdown" },
  "feedback-form": { registry: "feedback", cli: "feedback" },
  "logo-carousel": { registry: "logo-carousal", cli: "logo-carousal" },
  "morph-texts": { registry: "morph-texts", cli: "morph-texts" },
};

function registryForSlug(slug: string) {
  return (
    REGISTRY_BY_SLUG[slug] ?? {
      registry: slug,
      cli: slug,
    }
  );
}

function shortDescription(slug: string, label: string) {
  return DESCRIPTIONS[slug] ?? `${label} from the Iconiq UI registry.`;
}

const categories = SITE_SECTIONS.map((section) => section.label);

const entries = SITE_SECTIONS.flatMap((section) =>
  section.children
    .filter((child) => !HIDDEN_NAV_HREFS.includes(child.href))
    .map((child) => {
      const slug = child.href.split("/").pop() ?? child.label;
      const { registry, cli } = registryForSlug(slug);
      return {
        type: slug === "separator" ? "divider" : slug,
        slug,
        label: child.label,
        category: section.label,
        description: shortDescription(slug, child.label),
        registry,
        cli,
        href: child.href,
      };
    })
);

const file = `/**
 * Studio component catalog — mirrors SITE_SECTIONS from lib/site-nav.ts.
 * Generated by scripts/generate-studio-catalog.ts — do not edit by hand.
 */

export type StudioCatalogEntry = {
  /** Node type stored in the studio tree. */
  type: string;
  /** Docs URL slug. */
  slug: string;
  label: string;
  category: string;
  description: string;
  /** Registry demo module under @/registry/*. */
  registry: string;
  /** \`npx iconiq add\` name. */
  cli: string;
  href: string;
};

/** Sidebar section order (matches docs nav). */
export const STUDIO_PALETTE_CATEGORIES = [
  "Structure",
  ${categories.map((c) => JSON.stringify(c)).join(",\n  ")},
] as const;

export type StudioPaletteCategory =
  (typeof STUDIO_PALETTE_CATEGORIES)[number];

export const STUDIO_CATALOG: StudioCatalogEntry[] = ${JSON.stringify(entries, null, 2)};

export const STUDIO_CATALOG_BY_TYPE: Record<string, StudioCatalogEntry> =
  Object.fromEntries(STUDIO_CATALOG.map((entry) => [entry.type, entry]));
`;

fs.writeFileSync(outPath, file);
console.log(`Wrote ${entries.length} catalog entries to ${outPath}`);
