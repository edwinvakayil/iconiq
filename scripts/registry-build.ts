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
  "hover-flip-card": {
    title: "Hover Flip Card",
    description:
      "A card that flips when hovered. Uses Motion for the flip effect.",
    dependencies: [],
  },
  "accordion-animated": {
    title: "Accordion (Animated)",
    description:
      "An accordion component that animates the icons when opened. Uses Motion for the animation.",
    dependencies: ["@radix-ui/react-accordion"],
  },
  "input-group-01": {
    title: "Input Group",
    description:
      "Password field input with label, visibility toggle, and strength indicator. Uses Input, Label, and Button from shadcn.",
    dependencies: [],
  },
  "input-group-02": {
    title: "Input Group",
    description:
      "Floating label input that keeps the label visible while the user types. Uses Input from shadcn.",
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
  slider: {
    title: "Slider",
    description:
      "An animated range slider with shimmer, hover/drag feedback, and optional floating value tooltip. Uses Radix UI and Framer Motion.",
    dependencies: ["@radix-ui/react-slider", "framer-motion"],
  },
  "smart-tooltip": {
    title: "Smart Tooltip",
    description:
      "A tooltip button that tracks hover and copy interactions to show contextual labels like hover prompts and copy status. Uses the Button component from shadcn.",
    dependencies: [],
  },
  "magic-pen": {
    title: "Magic Pen",
    description:
      "A wrapper component that reveals any children under a cursor-following circular mask, with optional click-to-reveal. Uses GSAP for smooth pointer tracking.",
    dependencies: ["gsap"],
  },
  "drag-task": {
    title: "Drag Task",
    description:
      "A task list component that allows you to drag and drop tasks to reorder them. Uses Framer Motion for the drag and drop effect.",
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
