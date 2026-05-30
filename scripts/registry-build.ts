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
const reducedMotionImport = 'from "@/lib/reduced-motion"';
const registryThemeImport = 'from "@/lib/registry-theme"';
const reducedMotionModulePath = "@/lib/reduced-motion";
const iconiqThemeDependency = "@iconiq/iconiq-theme";
const reactContextImport = 'import { createContext, useContext } from "react";';
const motionReducedMotionImport =
  'import { MotionConfig, useReducedMotion } from "motion/react";';
const reducedMotionInlineSource = `interface ReducedMotionProp {
  reducedMotion?: boolean;
}

const ReducedMotionOverrideContext = createContext(false);

function useResolvedReducedMotion(reducedMotion?: boolean) {
  const reducedMotionOverride = useContext(ReducedMotionOverrideContext);
  const prefersReducedMotion = useReducedMotion() ?? false;

  return Boolean(
    reducedMotion || reducedMotionOverride || prefersReducedMotion
  );
}

function ReducedMotionConfig({
  children,
  reducedMotion,
}: ReducedMotionProp & {
  children: import("react").ReactNode;
}) {
  const resolvedReducedMotion = useResolvedReducedMotion(reducedMotion);

  return (
    <MotionConfig reducedMotion={resolvedReducedMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}`;
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
  { title: string; description: string; dependencies?: string[] }
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
    dependencies: ["motion", "lucide-react"],
  },
  "context-menu": {
    title: "Context Menu",
    description:
      "Native-feeling context menu with fixed-position viewport-aware placement, per-item icons and shortcuts, and spring entrance motion.",
    dependencies: ["motion"],
  },
  "dia-text": {
    title: "Dia Text",
    description:
      "Animated inline text reveal with a sweeping gradient band, repeat controls, and optional fixed-width rotation for motion-driven typography.",
    dependencies: ["motion"],
  },
  "shimmer-text": {
    title: "Shimmer Text",
    description:
      "Animated shimmer text with a sweeping highlight band, adjustable spread, and configurable loop speed for emphasis-heavy copy.",
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
      "Looping typewriter text effect with brief glitch substitutions, a blinking cursor, and reduced-motion fallback.",
    dependencies: ["motion"],
  },
  drawer: {
    title: "Drawer",
    description:
      "Controlled overlay drawer with faster slide timing, focus-trapped dialog behavior, safe-area-aware mobile ergonomics, and an optional sticky footer.",
    dependencies: ["motion", "lucide-react"],
  },
  dropdown: {
    title: "Dropdown",
    description:
      "Animated dropdown with a selectable value mode and an action-menu mode, plus chevron rotation and spring-driven menu entry.",
    dependencies: ["motion", "lucide-react"],
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
    dependencies: ["@radix-ui/react-accordion", "motion", "lucide-react"],
  },
  "b-accordion": {
    title: "Accordion (Base UI)",
    description:
      "Compound Accordion, AccordionItem, AccordionTrigger, and AccordionContent parts layered over Base UI primitives with default and quiet variants.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
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
  "b-combobox": {
    title: "Combobox (Base UI)",
    description:
      "Combobox with the same Iconiq API layered over Base UI primitives, preserving the original filtering rules, keyboard search, clear action, and dropdown motion.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
  },
  "b-context-menu": {
    title: "Context Menu (Base UI)",
    description:
      "Context menu with the same Iconiq API layered over Base UI primitives, preserving the original panel spring, row entrance, active highlight, and shortcut layout.",
    dependencies: ["@base-ui/react", "motion"],
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
  "b-drawer": {
    title: "Drawer (Base UI)",
    description:
      "Drawer in the Base section that keeps the Iconiq motion shell while layering it over Base UI drawer primitives for controlled state and close actions.",
    dependencies: ["@base-ui/react", "motion", "lucide-react"],
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
      "Select with the same Iconiq API layered over Base UI primitives, preserving the original trigger press, chevron rotation, grouped rows, and panel motion.",
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
  "b-tooltip": {
    title: "Tooltip (Base UI)",
    description:
      "Tooltip with the same Iconiq API layered over Base UI primitives, preserving the original controlled delay timing, bubble shell, rotated-square arrow, and spring entrance motion.",
    dependencies: ["@base-ui/react", "motion"],
  },
  "b-toggle": {
    title: "Toggle (Base UI)",
    description:
      "Pressed-state toggle with the same Iconiq ripple, icon motion, and size and variant shell layered over the Base UI toggle primitive.",
    dependencies: ["@base-ui/react", "class-variance-authority", "motion"],
  },
  "b-togglegroup": {
    title: "Toggle Group (Base UI)",
    description:
      "Minimal toggle group with the same Iconiq API layered over Base UI primitives, preserving the animated underline, stable multi-select ordering, and soft press motion.",
    dependencies: ["@base-ui/react", "motion"],
  },
  alert: {
    title: "Alert",
    description:
      "Compound Alert, AlertTitle, and AlertDescription parts with optional icons, legacy prop support, polite live announcements, and inline or toast behavior.",
    dependencies: ["motion"],
  },
  breadcrumbs: {
    title: "Breadcrumbs",
    description:
      "Breadcrumb trail with subtle easing, stronger focus states, and a dedicated current-page treatment. Built with Motion.",
    dependencies: ["motion", "lucide-react"],
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
      "Grouped action buttons, segmented button rows, and a selectable segmented control with spring-driven hover and active motion.",
    dependencies: ["motion"],
  },
  calendar: {
    title: "Calendar",
    description:
      "Compact monthly calendar with animated month transitions, selectable days, and date-fns-powered grid generation.",
    dependencies: ["motion", "lucide-react", "date-fns"],
  },
  card: {
    title: "Card",
    description:
      "Compound card surface with optional interactive lift, Motion-smoothed layout transitions, and shared header, action, content, and footer slots.",
    dependencies: ["motion"],
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
      "Row of compact icon chips that expand on hover or focus and stay open when selected. Built with Motion and Lucide.",
    dependencies: ["motion", "lucide-react"],
  },
  infiniteribbon: {
    title: "Infinite Ribbon",
    description:
      "Full-width looping announcement ribbon with repeated content, optional reverse direction, and diagonal rotation controls.",
  },
  "origin-button": {
    title: "Origin Button",
    description:
      "Rounded action button with a pointer-origin foreground fill that spreads on hover or focus-visible. Built with Motion.",
    dependencies: ["motion"],
  },
  "r-accordion": {
    title: "Accordion (Radix UI)",
    description:
      "Compound Accordion, AccordionItem, AccordionTrigger, and AccordionContent parts layered over Radix UI primitives with Motion-heavy panel choreography.",
    dependencies: ["@radix-ui/react-accordion", "motion", "lucide-react"],
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
      "Context menu with the same Iconiq API layered over Radix UI primitives, preserving the original panel spring, row entrance, active highlight, and shortcut layout.",
    dependencies: ["@radix-ui/react-context-menu", "motion"],
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
    dependencies: ["@radix-ui/react-dropdown-menu", "motion", "lucide-react"],
  },
  "r-select": {
    title: "Select (Radix UI)",
    description:
      "Select with the same Iconiq API layered over Radix UI primitives, preserving the original trigger press, chevron rotation, grouped rows, and panel motion.",
    dependencies: ["@radix-ui/react-select", "motion", "lucide-react"],
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
  "r-tooltip": {
    title: "Tooltip (Radix UI)",
    description:
      "Tooltip with the same Iconiq API layered over Radix Tooltip primitives, preserving the original controlled delay timing, bubble shell, rotated-square arrow, and spring entrance motion.",
    dependencies: ["@radix-ui/react-tooltip", "@radix-ui/react-slot", "motion"],
  },
  "r-toggle": {
    title: "Toggle (Radix UI)",
    description:
      "Pressed-state toggle with the same Iconiq ripple, icon motion, and size and variant shell layered over the Radix toggle primitive.",
    dependencies: [
      "@radix-ui/react-toggle",
      "class-variance-authority",
      "motion",
    ],
  },
  "r-togglegroup": {
    title: "Toggle Group (Radix UI)",
    description:
      "Minimal toggle group with the same Iconiq API layered over Radix UI primitives, preserving the animated underline, stable multi-select ordering, and soft press motion.",
    dependencies: ["@radix-ui/react-toggle-group", "motion"],
  },
  "faq-pro": {
    title: "FAQ Pro",
    description:
      "Searchable FAQ accordion with rounded cards, animated panels, automatic match expansion, and inline query highlighting. Built with Motion and Lucide.",
    dependencies: ["motion", "lucide-react"],
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
    dependencies: ["motion", "lucide-react"],
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
  "input-group": {
    title: "Input Group",
    description:
      "Floating-label input field with optional prefix and suffix slots, inline error copy, and a matching vertical stack wrapper for grouped forms.",
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
      "Clean segmented tabs with active-state surfaces, keyboard navigation, and straightforward panel switching.",
    dependencies: ["@base-ui/react"],
  },
  typography: {
    title: "Typography",
    description:
      "Single typography primitive that maps the full heading, label, paragraph, subheading, and documentation scale through one variant prop.",
    dependencies: ["class-variance-authority"],
  },
  toggle: {
    title: "Toggle",
    description:
      "Pressed-state toggle built on Radix with button squash, icon motion, pointer-origin ripple, and larger shadcn-style size and outline variants.",
    dependencies: [
      "@radix-ui/react-toggle",
      "class-variance-authority",
      "motion",
    ],
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

function removeImportStatement(content: string, modulePath: string) {
  const lines = content.split("\n");
  const targetLineIndex = lines.findIndex(
    (line) =>
      line.includes(`from "${modulePath}"`) ||
      line.includes(`from '${modulePath}'`)
  );

  if (targetLineIndex === -1) {
    return content;
  }

  let importStartIndex = targetLineIndex;

  while (
    importStartIndex >= 0 &&
    !lines[importStartIndex].trimStart().startsWith("import ")
  ) {
    importStartIndex -= 1;
  }

  if (importStartIndex === -1) {
    return content;
  }

  lines.splice(importStartIndex, targetLineIndex - importStartIndex + 1);

  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

function insertAfterImports(content: string, snippet: string) {
  const importMatches = [...content.matchAll(/^import[\s\S]*?;\n?/gm)];
  const lastImport = importMatches.at(-1);

  if (!lastImport || lastImport.index === undefined) {
    return `${snippet}\n\n${content}`;
  }

  const insertionIndex = lastImport.index + lastImport[0].length;

  return `${content.slice(0, insertionIndex)}\n${snippet}\n${content.slice(
    insertionIndex
  )}`;
}

function inlineRegistryHelpers(content: string) {
  const needsReducedMotion = content.includes(reducedMotionImport);

  if (!needsReducedMotion) {
    return content;
  }

  const nextContent = removeImportStatement(content, reducedMotionModulePath);

  return insertAfterImports(
    nextContent,
    `${motionReducedMotionImport}\n${reactContextImport}\n\n${reducedMotionInlineSource}`.trim()
  );
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
