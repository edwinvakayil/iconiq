import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE } from "../constants";
import { components } from "./registry-components";
import type { Schema } from "./registry-schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const registryComponents = path.join(__dirname, "../public/r");
const registryIndexPath = path.join(__dirname, "../public/r/registry.json");
const registryRootPath = path.join(__dirname, "../registry.json");
const registryThemeHelperPath = path.join(
  __dirname,
  "../lib/registry-theme.ts"
);
const registryThemeImport = 'from "@/lib/registry-theme"';
const iconiqThemeDependency = "@iconiq/iconiq-theme";
function buildIconiqThemeSchema(): Schema {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "iconiq-theme",
    type: "registry:lib",
    title: "Iconiq theme tokens",
    description:
      "Shared Tailwind arbitrary property tokens used by Iconiq registry components.",
    registryDependencies: [],
    dependencies: [],
    devDependencies: [],
    categories: ["lib"],
    files: [
      {
        path: "lib/registry-theme.ts",
        content: fs.readFileSync(registryThemeHelperPath, "utf8"),
        type: "registry:lib",
      },
    ],
  };
}

/** Optional title, description, and dependencies for registry UI components. */
const REGISTRY_UI_META: Record<
  string,
  {
    title: string;
    description: string;
    dependencies?: string[];
    registryDependencies?: string[];
  }
> = {
  badge: {
    title: "Badge",
    description:
      "Preset-color badge with an animated default fill, a quieter dot variant, and compact size controls. Motion + CVA.",
    dependencies: ["motion", "class-variance-authority"],
  },
  combobox: {
    title: "Combobox",
    description:
      "Searchable single-select input with inline filtering, arrow-key navigation, animated dropdown motion, and an optional clear action.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "context-menu": {
    title: "Context Menu",
    description:
      "Native-feeling context menu with fixed-position viewport-aware placement, per-item icons and shortcuts, and spring entrance motion.",
    dependencies: ["@radix-ui/react-slot", "motion"],
  },
  "dia-text": {
    title: "Dia Text",
    description:
      "Animated inline text reveal with a sweeping gradient band, repeat controls, and optional fixed-width rotation for motion-driven typography.",
    dependencies: ["motion"],
  },
  "morph-texts": {
    title: "Morph Text",
    description:
      "Cycling headline words with a goo-filter morph transition powered by Motion.",
    dependencies: ["motion"],
  },
  "reveal-text": {
    title: "Reveal Text",
    description:
      "Staggered word or character reveal with spring lift, blur fade, and optional scroll-triggered playback.",
    dependencies: ["motion"],
  },
  "shimmer-text": {
    title: "Shimmer Text",
    description:
      "Animated shimmer text with a sweeping highlight band, adjustable spread, and configurable loop speed for emphasis-heavy copy.",
    dependencies: ["motion"],
  },
  "text-loop": {
    title: "Text Loop",
    description:
      "Cycling text with vertical slide transitions—pass your own items and interval for rotating headlines or status copy.",
    dependencies: ["motion"],
  },
  "text-inertia": {
    title: "Text Inertia",
    description:
      "Pointer-reactive word treatment that maps cursor velocity into Motion-powered spring movement.",
    dependencies: ["motion"],
  },
  typewriter: {
    title: "Typewriter",
    description:
      "Looping typewriter text effect with brief glitch substitutions and a blinking cursor.",
    dependencies: ["motion"],
  },
  "rolling-digits": {
    title: "Rolling Digits",
    description: "Spring-animated digit counter with blur and scale.",
    dependencies: ["motion"],
  },
  drawer: {
    title: "Drawer",
    description:
      "Compound Vaul drawer primitives with a soft overlay fade, direction-aware layout classes, drag gestures, and tuned fluid slide motion.",
    dependencies: ["vaul"],
  },
  dropdown: {
    title: "Dropdown",
    description:
      "Animated dropdown with a selectable value mode and an action-menu mode, plus chevron rotation and spring-driven menu entry.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "file-upload": {
    title: "File Upload",
    description:
      "Drag-and-drop file uploader with click-to-browse fallback, queued file rows, image previews, built-in progress states, and optional change callbacks.",
    dependencies: ["motion", "lucide-react"],
  },
  accordion: {
    title: "Accordion",
    description:
      "Accordion with spring height, staggered text, default or quiet disclosure styles, and optional multi-open behavior. Built with Motion.",
    dependencies: ["@radix-ui/react-accordion", "motion"],
  },
  "b-accordion": {
    title: "Accordion (Base UI)",
    description:
      "Compound Accordion, AccordionItem, AccordionTrigger, and AccordionContent parts layered over Base UI primitives with default and quiet variants.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-alert-dialog": {
    title: "Alert Dialog (Base UI)",
    description:
      "Alert dialog with a shared Iconiq trigger, content, cancel, and action API layered over Base UI primitives, plus Motion-backed confirm-state transitions.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-avatar": {
    title: "Avatar (Base UI)",
    description:
      "Avatar with the same single Iconiq API layered over Base UI primitives, keeping immediate fallback initials and a quiet image crossfade.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-button": {
    title: "Button (Base UI)",
    description:
      "Button with the same Iconiq API layered over the Base UI button primitive, preserving the original ripple, press spring, hover lift, and intrinsic-width animation.",
    dependencies: ["@base-ui/react", "motion", "class-variance-authority"],
  },
  "b-collapsible": {
    title: "Collapsible (Base UI)",
    description:
      "Collapsible with the same Iconiq API layered over Base UI primitives, preserving the same height, icon, and content transitions as the Radix version.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "b-autocomplete": {
    title: "Autocomplete (Base UI)",
    description:
      "Base UI autocomplete with list filtering, suggestion highlight motion, and the same Iconiq input shell as the combobox install.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "b-combobox": {
    title: "Combobox (Base UI)",
    description:
      "Compound Combobox parts layered over Base UI primitives, preserving the original input shell, clear action, item highlight, checkmark, and dropdown motion.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "b-context-menu": {
    title: "Context Menu (Base UI)",
    description:
      "Composable context menu layered over Base UI primitives, preserving the original panel spring, row entrance, active highlight, and shortcut layout.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "b-dialog": {
    title: "Dialog (Base UI)",
    description:
      "Dialog with the same exported Iconiq parts layered over Base UI primitives, preserving the original dialog springs while using the softer alert-dialog card styling and overlay treatment.",
    dependencies: [
      "@base-ui/react",
      "@radix-ui/react-slot",
      "motion",
      "lucide-react",
    ],
  },
  "b-hover-card": {
    title: "Hover Card (Base UI)",
    description:
      "Hover card with the same Iconiq API layered over Base UI popover primitives, preserving delayed hover reveal, instant focus open, collision-aware placement, and spring-driven content motion.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-popover": {
    title: "Popover (Base UI)",
    description:
      "Popover with the same Iconiq API layered over Base UI popover primitives, preserving side-aware panel motion, optional anchor support, and size-aware content transitions.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-progress": {
    title: "Progress (Base UI)",
    description:
      "Progress bar with the same Iconiq API layered over Base UI primitives, preserving the spring-smoothed fill, restrained inline readout, and quiet indeterminate motion.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-checkbox": {
    title: "Checkbox (Base UI)",
    description:
      "Checkbox with the same Iconiq API layered over Base UI primitives, preserving the original fill spring, press scale, checkmark draw, and label fade.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-checkbox-group": {
    title: "Checkbox Group (Base UI)",
    description:
      "Checkbox group with the same Iconiq API layered over Base UI primitives, preserving the original row hover, tap spring, check icon entrance, and disclosure behavior.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "b-radio-group": {
    title: "Radio Group (Base UI)",
    description:
      "Radio group with the same Iconiq API layered over Base UI primitives, preserving the original shared highlight, spring-loaded ring and dot, and staggered row entrance.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-select": {
    title: "Select (Base UI)",
    description:
      "Compound Select parts layered over Base UI primitives, preserving the original trigger press, chevron rotation, grouped rows, and panel motion.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "b-separator": {
    title: "Separator (Base UI)",
    description:
      "Separator with line, dashed, and dotted variants layered over the Base UI primitive, supporting horizontal and vertical orientation with a decorative default.",
    dependencies: ["@base-ui/react"],
  },
  "b-selection-toolbar": {
    title: "Selection Toolbar (Base UI)",
    description:
      "Floating selection toolbar with the same Iconiq API layered over Base UI toolbar primitives, preserving the original inline formatting shell, fixed-position reveal, and editable-surface selection tracking.",
    dependencies: ["@base-ui/react", "lucide-react"],
  },
  "b-slider": {
    title: "Slider (Base UI)",
    description:
      "Slider with the same Iconiq API layered over Base UI primitives, preserving the original spring-settled fill, active track height, and thumb scale motion.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-switch": {
    title: "Switch (Base UI)",
    description:
      "Switch with the same Iconiq API layered over Base UI primitives, preserving the original spring thumb travel, pressure-like squash, and foreground fill sweep.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-tabs": {
    title: "Tabs (Base UI)",
    description:
      "Tabs with the same Iconiq API layered over Base UI primitives, preserving the measured underline, keyboard flow, and motion-smoothed panel shell from the core tabs component.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-toggle": {
    title: "Toggle (Base UI)",
    description:
      "Two-state button with spring press feedback, a muted fill that bounces in when pressed, and a subtle content lift layered over Base UI toggle primitives.",
    dependencies: ["@base-ui/react", "class-variance-authority", "motion"],
  },
  "b-togglegroup": {
    title: "Toggle Group (Base UI)",
    description:
      "Segmented toggle group with the same fluid wipe fill, sheen sweep, and icon press feedback as the standalone toggle, over Base UI toggle-group primitives.",
    dependencies: ["@base-ui/react", "class-variance-authority", "motion"],
  },
  "b-tooltip": {
    title: "Tooltip (Base UI)",
    description:
      "Tooltip with the same Iconiq API layered over Base UI primitives, preserving the original controlled delay timing, bubble shell, rotated-square arrow, and spring entrance motion.",
    dependencies: ["@base-ui/react", "motion"],
  },
  alert: {
    title: "Alert",
    description:
      "Compound Alert, AlertTitle, and AlertDescription parts with optional icons, legacy prop support, polite live announcements, and inline or toast behavior.",
    dependencies: ["motion", "class-variance-authority"],
  },
  "command-palette": {
    title: "Command Palette",
    description:
      "Radix dialog command menu with grouped search, keyboard shortcuts, navigation items, custom triggers, and optional theme switching.",
    dependencies: [
      "@radix-ui/react-dialog",
      "lucide-react",
      "motion",
      "next-themes",
    ],
  },
  breadcrumbs: {
    title: "Breadcrumbs",
    description:
      "Compound breadcrumb trail with Base UI render composition, subtle Motion transitions, and dedicated current-page and separator parts.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  button: {
    title: "Button",
    description:
      "Primary action control with larger default hit targets, spring press feedback, optional intrinsic width animation, and Motion ripples. Forwards ref and native button props.",
    dependencies: ["motion", "class-variance-authority"],
  },
  "button-group": {
    title: "Button Group",
    description:
      "Grouped action buttons, text segments, separators, segmented button rows, and a selectable segmented control with spring-driven hover and active motion.",
    dependencies: ["@base-ui/react", "motion", "class-variance-authority"],
  },
  calendar: {
    title: "Calendar",
    description:
      "shadcn-style monthly calendar with animated month/year transitions, selectable days, and date-fns-powered grid generation.",
    dependencies: ["motion", "lucide-react", "date-fns"],
  },
  "date-picker": {
    title: "Date Picker",
    description:
      "Collapsible date picker trigger with the shared Iconiq Calendar panel, spring open motion, and month-aware selection.",
    dependencies: ["motion", "lucide-react", "date-fns"],
    registryDependencies: ["calendar"],
  },
  card: {
    title: "Card",
    description:
      "Compound card surface with optional interactive lift, Motion-smoothed layout transitions, and shared header, action, content, and footer slots.",
    dependencies: ["motion"],
  },
  "color-picker": {
    title: "Color Picker",
    description:
      "HSV panel with saturation field, hue/alpha sliders, multi-format readouts, hex input, and EyeDropper.",
    dependencies: ["lucide-react", "motion"],
  },
  charts: {
    title: "Charts",
    description:
      "Recharts shell with registry chart tokens, ease-out bar growth, and spring-smoothed tooltip and legend transitions.",
    dependencies: ["recharts", "motion"],
  },
  checkbox: {
    title: "Checkbox",
    description:
      "Single checkbox with spring-pressed feedback, a line-drawn checkmark, and an optional inline label. Motion only.",
    dependencies: ["motion"],
  },
  "checkbox-group": {
    title: "Checkbox group",
    description:
      "Multi-select option list with bordered empty state and a primary tick only when checked, plus hover/tap motion on each row. Motion + Lucide.",
    dependencies: ["motion", "lucide-react"],
  },
  dialog: {
    title: "Dialog",
    description:
      "Modal dialog on Radix Dialog with Motion overlay and content springs, staggered children, and an animated close control. Pass the same open boolean to DialogContent as the Dialog root for AnimatePresence.",
    dependencies: ["@radix-ui/react-dialog", "motion", "lucide-react"],
  },
  "hover-card": {
    title: "Hover Card",
    description:
      "Inline hover card with hover-only timing delays, instant focus reveal, collision-aware Popover positioning, Slot-based custom triggers, and a spring-driven content panel.",
    dependencies: ["@radix-ui/react-popover", "@radix-ui/react-slot", "motion"],
  },
  "icon-bar": {
    title: "Icon Bar",
    description:
      "Row of compact icon chips that expand on hover or focus and stay open when selected. Built with Base UI Toggle Group, Motion, and Lucide.",
    dependencies: [
      "@base-ui/react/toggle",
      "@base-ui/react/toggle-group",
      "motion",
      "lucide-react",
    ],
  },
  "input-otp": {
    title: "Input OTP",
    description:
      "Animated one-time password field built on Base UI OTP Field with focus border motion, character entrance, caret pulse, and OTPSlots auto-layout.",
    dependencies: ["@base-ui/react", "motion"],
  },
  infiniteribbon: {
    title: "Infinite Ribbon",
    description:
      "Full-width looping announcement ribbon with repeated content, optional reverse direction, and diagonal rotation controls.",
  },
  "liquid-marquee": {
    title: "Liquid Marquee",
    description: "Marquee with liquid distortion and edge fades.",
  },
  "radial-button": {
    title: "Radial Button",
    description:
      "Rounded action button with a radial foreground fill that spreads on hover or focus-visible. Built with Motion.",
    dependencies: ["motion"],
  },
  "flux-button": {
    title: "Flux Button",
    description: "Async button with idle, loading, and success states.",
    dependencies: [
      "@base-ui/react/button",
      "class-variance-authority",
      "lucide-react",
      "motion",
    ],
  },
  "theme-toggle": {
    title: "Theme Toggle",
    description:
      "Animated light/dark switch with a sliding knob, sun and moon icons, and bouncy track transitions. Built with Base UI Toggle; toggles the document dark class.",
    dependencies: ["@base-ui/react/toggle", "lucide-react"],
  },
  carousel: {
    title: "Carousel",
    description:
      "Embla-powered carousel with aspect-ratio presets and horizontal or vertical slides. Built with embla-carousel-react and Lucide.",
    dependencies: ["embla-carousel-react", "lucide-react"],
  },
  "verified-badge": {
    title: "Verified Badge",
    description: "X-style verified badge with shimmer or static variants.",
    dependencies: ["motion"],
  },
  "r-accordion": {
    title: "Accordion (Radix UI)",
    description:
      "Compound Accordion, AccordionItem, AccordionTrigger, and AccordionContent parts layered over Radix UI primitives with Motion-heavy panel choreography.",
    dependencies: ["@radix-ui/react-accordion", "motion"],
  },
  "r-alert-dialog": {
    title: "Alert Dialog (Radix UI)",
    description:
      "Alert dialog with a shared Iconiq trigger, content, cancel, and action API layered over Radix UI primitives, plus Motion-backed confirm-state transitions.",
    dependencies: ["@radix-ui/react-alert-dialog", "motion"],
  },
  "r-avatar": {
    title: "Avatar (Radix UI)",
    description:
      "Avatar with the same single Iconiq API layered over Radix UI primitives, preserving immediate fallback initials and the quiet image reveal.",
    dependencies: ["@radix-ui/react-avatar", "motion"],
  },
  "r-collapsible": {
    title: "Collapsible (Radix UI)",
    description:
      "Collapsible with the same Iconiq API layered over Radix UI primitives, preserving the same height, icon, and content transitions as the Base UI version.",
    dependencies: ["@radix-ui/react-collapsible", "motion", "lucide-react"],
  },
  "r-checkbox": {
    title: "Checkbox (Radix UI)",
    description:
      "Checkbox with the same Iconiq API layered over Radix UI primitives, preserving the original fill spring, press scale, checkmark draw, and label fade.",
    dependencies: ["@radix-ui/react-checkbox", "motion"],
  },
  "r-context-menu": {
    title: "Context Menu (Radix UI)",
    description:
      "Composable context menu layered over Radix UI primitives, preserving the original panel spring, row entrance, active highlight, and shortcut layout.",
    dependencies: [
      "@radix-ui/react-context-menu",
      "@radix-ui/react-scroll-area",
      "motion",
      "lucide-react",
    ],
  },
  "r-dialog": {
    title: "Dialog (Radix UI)",
    description:
      "Dialog with the same exported Iconiq parts layered over Radix UI primitives, preserving the original dialog springs while using the softer alert-dialog card styling and overlay treatment.",
    dependencies: ["@radix-ui/react-dialog", "motion", "lucide-react"],
  },
  "r-hover-card": {
    title: "Hover Card (Radix UI)",
    description:
      "Hover card with the same Iconiq API layered over the dedicated Radix Hover Card primitive, preserving delayed hover reveal, instant focus open, collision-aware placement, and spring-driven content motion.",
    dependencies: [
      "@radix-ui/react-hover-card",
      "@radix-ui/react-slot",
      "motion",
    ],
  },
  "r-popover": {
    title: "Popover (Radix UI)",
    description:
      "Popover with the same Iconiq API layered over Radix UI popover primitives, preserving side-aware panel motion, optional anchor support, and size-aware content transitions.",
    dependencies: ["@radix-ui/react-popover", "motion"],
  },
  "r-progress": {
    title: "Progress (Radix UI)",
    description:
      "Progress bar with the same Iconiq API layered over Radix UI primitives, preserving the spring-smoothed fill, restrained inline readout, and quiet indeterminate motion.",
    dependencies: ["@radix-ui/react-progress", "motion"],
  },
  "r-radio-group": {
    title: "Radio Group (Radix UI)",
    description:
      "Radio group with the same Iconiq API layered over Radix UI primitives, preserving the original shared highlight, spring-loaded ring and dot, and staggered row entrance.",
    dependencies: ["@radix-ui/react-radio-group", "motion"],
  },
  "r-dropdown": {
    title: "Dropdown (Radix UI)",
    description:
      "Dropdown with the same Iconiq trigger, grouped rows, action and select variants, and exact panel motion layered over Radix Dropdown Menu primitives.",
    dependencies: [
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-scroll-area",
      "motion",
      "lucide-react",
    ],
  },
  "r-select": {
    title: "Select (Radix UI)",
    description:
      "Compound Select parts layered over Radix UI primitives, preserving the original trigger press, chevron rotation, grouped rows, and panel motion.",
    dependencies: [
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "motion",
      "lucide-react",
    ],
  },
  "r-separator": {
    title: "Separator (Radix UI)",
    description:
      "Separator with line, dashed, and dotted variants layered over the Radix UI primitive, supporting horizontal and vertical orientation with a decorative default.",
    dependencies: ["@radix-ui/react-separator"],
  },
  "r-selection-toolbar": {
    title: "Selection Toolbar (Radix UI)",
    description:
      "Floating selection toolbar with the same Iconiq API layered over Radix UI toolbar primitives, preserving the original inline formatting shell, fixed-position reveal, and editable-surface selection tracking.",
    dependencies: ["@radix-ui/react-toolbar", "lucide-react"],
  },
  "r-slider": {
    title: "Slider (Radix UI)",
    description:
      "Slider with the same Iconiq API layered over Radix UI primitives, preserving the original spring-settled fill, active track height, and thumb scale motion.",
    dependencies: ["@radix-ui/react-slider", "motion"],
  },
  "r-switch": {
    title: "Switch (Radix UI)",
    description:
      "Switch with the same Iconiq API layered over Radix UI primitives, preserving the original spring thumb travel, pressure-like squash, and foreground fill sweep.",
    dependencies: ["@radix-ui/react-switch", "motion"],
  },
  "r-tabs": {
    title: "Tabs (Radix UI)",
    description:
      "Tabs with the same Iconiq API layered over Radix UI primitives, preserving the measured underline, keyboard flow, and motion-smoothed panel shell from the core tabs component.",
    dependencies: ["@radix-ui/react-tabs", "motion"],
  },
  "r-toggle": {
    title: "Toggle (Radix UI)",
    description:
      "Two-state button with spring press feedback, a muted fill that bounces in when pressed, and a subtle content lift layered over Radix UI toggle primitives.",
    dependencies: ["radix-ui", "class-variance-authority", "motion"],
  },
  "r-togglegroup": {
    title: "Toggle Group (Radix UI)",
    description:
      "Segmented toggle group with the same fluid wipe fill, sheen sweep, and icon press feedback as the standalone toggle, over Radix UI toggle-group primitives.",
    dependencies: ["radix-ui", "class-variance-authority", "motion"],
  },
  "r-tooltip": {
    title: "Tooltip (Radix UI)",
    description:
      "Tooltip with the same Iconiq API layered over Radix Tooltip primitives, preserving the original controlled delay timing, bubble shell, rotated-square arrow, and spring entrance motion.",
    dependencies: ["@radix-ui/react-tooltip", "@radix-ui/react-slot", "motion"],
  },
  "faq-pro": {
    title: "FAQ Pro",
    description:
      "Searchable FAQ accordion with rounded cards, animated panels, automatic match expansion, and inline query highlighting. Built with Base UI Accordion, Motion, and Lucide.",
    dependencies: ["@base-ui/react/accordion", "motion", "lucide-react"],
  },
  "file-tree": {
    title: "File Tree",
    description:
      "Compound file tree with nested FileTreeItem rows, Base UI Button folder toggles, extension-aware icons, hover highlight tracking, and optional blue emphasis for new files.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "prompt-box": {
    title: "Prompt Box",
    description:
      "Spring-animated AI prompt with model controls and voice or send.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  popover: {
    title: "Popover",
    description:
      "Popover built on Radix with portal-based positioning, optional anchor support, side-aware motion, and smooth size changes while content updates.",
    dependencies: ["@radix-ui/react-popover", "motion"],
  },
  tooltip: {
    title: "Tooltip",
    description:
      "Animated hover/focus tooltip with collision-aware portaled positioning, Slot-based triggers, short-string content, and optional delay and side placement. Built with Motion and Radix Popover.",
    dependencies: ["@radix-ui/react-popover", "@radix-ui/react-slot", "motion"],
  },
  select: {
    title: "Select",
    description:
      "Animated single-select dropdown with staggered options, chevron rotation, scaleY panel, row hover slide, and check mark on the active item. Motion + Lucide.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  selectiontoolbar: {
    title: "Selection Toolbar",
    description:
      "Floating inline formatting toolbar for editable text selections with bold, italic, and underline actions.",
    dependencies: ["lucide-react"],
  },
  skeleton: {
    title: "Skeleton",
    description:
      "Shimmer loading placeholder with configurable radius, optional animation, and zero runtime dependencies.",
  },
  slider: {
    title: "Slider",
    description:
      "Range control with spring-animated track and thumb, full-width pointer drag, and optional label and live value. Motion.",
    dependencies: ["motion"],
  },
  radiogroup: {
    title: "Radio group",
    description:
      "Single-select option list with shared layoutId highlight, spring ring/dot on the control, staggered row entrance, and optional descriptions. Motion only — native button radios with role=radiogroup.",
    dependencies: ["motion"],
  },
  tabs: {
    title: "Tabs",
    description:
      "Segmented tabs with a sliding active pill, mix-blend label treatment, and Radix keyboard navigation.",
    dependencies: ["@radix-ui/react-tabs", "motion"],
  },
  typography: {
    title: "Typography",
    description:
      "Single typography primitive that maps the full heading, label, paragraph, subheading, and documentation scale through one variant prop.",
    dependencies: ["class-variance-authority"],
  },
  table: {
    title: "Table",
    description:
      "Composable table primitives with grid-aligned rows, optional animated sort buttons, and layout-preserving row transitions.",
    dependencies: ["motion", "lucide-react"],
  },
  spinner: {
    title: "Spinner",
    description:
      "Loading indicator with an animated ring or bouncing dots. Motion; uses primary and muted theme tokens.",
    dependencies: ["motion"],
  },
  "status-dot": {
    title: "Status Dot",
    description:
      "Rippling status dot with deployment states and optional label.",
  },
  switch: {
    title: "Switch",
    description:
      "Animated Radix switch with spring thumb travel, pressure-like thumb squash, foreground track fill, and optional inline label.",
    dependencies: ["@radix-ui/react-switch", "motion"],
  },
  avatar: {
    title: "Avatar",
    description:
      "Compound Base UI avatar with image, fallback, green tooltip-enabled badge, grouped stack, overflow count, and responsive sizes.",
    dependencies: ["@base-ui/react", "motion"],
  },
};

if (!fs.existsSync(registryComponents)) {
  fs.mkdirSync(registryComponents, { recursive: true });
}

console.log("\n🔨 Building registry components...\n");

const registryItems: Schema[] = [];

function inlineRegistryHelpers(content: string) {
  return content;
}

function getRegistryDependencies(
  sourceContent: string,
  baseDependencies: string[]
) {
  const registryDependencies = [...baseDependencies];

  if (
    sourceContent.includes(registryThemeImport) &&
    !registryDependencies.includes(iconiqThemeDependency)
  ) {
    registryDependencies.push(iconiqThemeDependency);
  }

  return registryDependencies;
}

function buildAndWrite(schema: Schema) {
  fs.writeFileSync(
    path.join(registryComponents, `${schema.name}.json`),
    JSON.stringify(schema, null, 2)
  );
  const { files, $schema: _itemSchema, ...schemaWithoutContent } = schema;
  registryItems.push({
    ...schemaWithoutContent,
    files: files.map((file) => {
      const { content, ...fileWithoutContent } = file;
      return fileWithoutContent;
    }),
  });
}

for (const component of components) {
  const sourceContent = fs.readFileSync(component.path, "utf8");
  const content = inlineRegistryHelpers(sourceContent);
  const files: Schema["files"] = [
    {
      path: `${component.name}.tsx`,
      content,
      type: "registry:ui",
    },
  ];

  const schema: Schema = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: component.name,
    type: "registry:ui",
    registryDependencies: getRegistryDependencies(
      sourceContent,
      component.registryDependencies || []
    ),
    dependencies: component.dependencies || [],
    devDependencies: component.devDependencies || [],
    files,
  };

  if (component.title) schema.title = component.title;
  if (component.description) schema.description = component.description;
  const uiMeta = REGISTRY_UI_META[component.name];
  if (uiMeta) {
    if (!schema.title) schema.title = uiMeta.title;
    if (!schema.description) schema.description = uiMeta.description;
    if (uiMeta.dependencies?.length) schema.dependencies = uiMeta.dependencies;
    if (uiMeta.registryDependencies?.length) {
      schema.registryDependencies = getRegistryDependencies(
        sourceContent,
        uiMeta.registryDependencies
      );
    }
  }
  if (component.author) schema.author = component.author;
  if (component.tailwind) schema.tailwind = component.tailwind;
  if (component.cssVars) schema.cssVars = component.cssVars;
  if (component.css) schema.css = component.css;
  if (component.envVars) schema.envVars = component.envVars;
  if (component.docs) schema.docs = component.docs;
  if (component.categories) schema.categories = component.categories;
  if (component.meta) schema.meta = component.meta;

  buildAndWrite(schema);
}

buildAndWrite(buildIconiqThemeSchema());

const registryIndex = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: SITE.NAME,
  homepage: SITE.URL,
  items: registryItems,
};

const registryIndexJson = JSON.stringify(registryIndex, null, 2);
fs.writeFileSync(registryIndexPath, registryIndexJson);
fs.writeFileSync(registryRootPath, registryIndexJson);

console.log(
  `✅ Built ${components.length} registry components and iconiq-theme`
);
console.log("✅ Updated registry.json\n");
