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
      "Accordion with spring height, staggered text, default or editorial disclosure styles, and optional multi-open behavior. Built with Motion.",
    dependencies: ["@radix-ui/react-accordion", "motion", "lucide-react"],
  },
  alert: {
    title: "Alert",
    description:
      "Dismissible alert with an optional leading icon, action slot, polite live announcements, paused auto-dismiss on interaction, and inline or toast layout behavior.",
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
  carousels: {
    title: "Carousel",
    description:
      "Swipeable testimonial carousel with spring-driven slide transitions and previous/next arrow controls.",
    dependencies: ["motion", "lucide-react"],
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
  popover: {
    title: "Popover",
    description:
      "Popover built on Radix with portal-based positioning, optional anchor support, side-aware motion, and smooth size changes while content updates.",
    dependencies: ["@radix-ui/react-popover", "motion"],
  },
  tooltip: {
    title: "Tooltip",
    description:
      "Animated hover/focus tooltip with spring entrance, blur fade, directional offset, and optional delay and side placement. Built with Motion.",
    dependencies: ["motion"],
  },
  select: {
    title: "Select",
    description:
      "Animated single-select dropdown with staggered options, chevron rotation, scaleY panel, row hover slide, and check mark on the active item. Motion + Lucide.",
    dependencies: ["motion", "lucide-react"],
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
  pagination: {
    title: "Pagination",
    description:
      "Animated pagination control with previous and next actions, compressed ellipsis handling, and a sliding active underline.",
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
  toggle: {
    title: "Toggle",
    description:
      "Pressed-state toggle built on Radix with button squash, icon motion, center ripple, and shadcn-style size and outline variants.",
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
      "Circular avatar with spring entrance, image fade-in, fallback initials, hover glow and pulse ring. Fixed 42×42. Motion.",
    dependencies: ["motion"],
  },
};

if (!fs.existsSync(registryComponents)) {
  fs.mkdirSync(registryComponents, { recursive: true });
}

console.log("\n🔨 Building registry components...\n");

const registryItems: Schema[] = [];

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
  const content = fs.readFileSync(component.path, "utf8");

  const schema: Schema = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: component.name,
    type: "registry:ui",
    registryDependencies: component.registryDependencies || [],
    dependencies: component.dependencies || [],
    devDependencies: component.devDependencies || [],
    files: [
      {
        path: `${component.name}.tsx`,
        content,
        type: "registry:ui",
      },
    ],
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

const registryIndex = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: SITE.NAME,
  homepage: SITE.URL,
  items: registryItems,
};

const registryIndexJson = JSON.stringify(registryIndex, null, 2);
fs.writeFileSync(registryIndexPath, registryIndexJson);
fs.writeFileSync(registryRootPath, registryIndexJson);

console.log(`✅ Built ${components.length} registry components`);
console.log("✅ Updated registry.json\n");
