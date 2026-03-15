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
  "animated-badges": {
    title: "Badges (Animated)",
    description:
      "Status badges with shimmer, pulsing dot, and spring animations. Uses Framer Motion for enter/exit and hover effects.",
    dependencies: ["framer-motion"],
  },
  "input-group-01": {
    title: "Input Group",
    description:
      "Password field input with label, visibility toggle, and strength indicator. Uses Input, Label, and Button from shadcn.",
    dependencies: [],
  },
  "file-tree": {
    title: "File Tree",
    description:
      "A file tree component that displays a tree of files and folders. Uses Accordion from shadcn.",
    dependencies: ["@radix-ui/react-accordion"],
  },
  breadcrumbs: {
    title: "Breadcrumb",
    description:
      "Animated breadcrumb navigation with spring transitions, hover feedback, and shimmer on the current item. Uses Framer Motion.",
    dependencies: ["framer-motion"],
  },
  radiogroup: {
    title: "Radio Group",
    description:
      "An animated radio group with staggered entrance, hover/tap feedback, and shimmer on the selected option. Uses Radix UI and Framer Motion.",
    dependencies: ["@radix-ui/react-radio-group", "framer-motion"],
  },
  alert: {
    title: "Alert",
    description:
      "Dismissible system alerts with success, error, warning, and info variants. Uses Framer Motion for enter/exit and optional auto-dismiss bar.",
    dependencies: ["framer-motion", "lucide-react"],
  },
  chart: {
    title: "Chart",
    description:
      "Animated Bar, Line, and Area chart with variant dropdown. Uses Recharts and Framer Motion. Colors defined in component.",
    dependencies: ["framer-motion", "recharts"],
  },
  select: {
    title: "Select",
    description:
      "Animated dropdown select with spring open/close and optional label. Uses Framer Motion and Lucide icons.",
    dependencies: ["framer-motion", "lucide-react"],
  },
  slider: {
    title: "Slider",
    description:
      "An animated range slider with shimmer, hover/drag feedback, and optional floating value tooltip. Uses Radix UI and Framer Motion.",
    dependencies: ["@radix-ui/react-slider", "framer-motion"],
  },
  tooltip: {
    title: "Tooltip",
    description:
      "An animated tooltip with spring enter/exit, optional delay, and placement (top, bottom, left, right). Uses Framer Motion.",
    dependencies: ["framer-motion"],
  },
  tabs: {
    title: "Tabs",
    description:
      "Animated tabs with a sliding indicator. Variants: spotlight, underline, chip. Uses Framer Motion LayoutGroup.",
    dependencies: ["framer-motion"],
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
