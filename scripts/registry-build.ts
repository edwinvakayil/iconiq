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
      "Animated badge with a looping shimmer wave. Spring entrance, optional bg/text/wave color overrides. Framer Motion.",
    dependencies: ["framer-motion"],
  },
  "animated-badges": {
    title: "Badges (Animated)",
    description:
      "Status badges with shimmer, pulsing dot, and spring animations. Uses Framer Motion for enter/exit and hover effects.",
    dependencies: ["framer-motion"],
  },
  "motion-accordion": {
    title: "Accordion",
    description:
      "Single-select accordion with spring height, staggered text, and rotating plus control. Built with Framer Motion.",
    dependencies: ["framer-motion", "lucide-react"],
  },
  alert: {
    title: "Alert",
    description:
      "Dismissible banner with user-provided leading icon, spring enter/exit, blur, and optional fixed viewport positions. Framer Motion.",
    dependencies: ["framer-motion"],
  },
  breadcrumbs: {
    title: "Breadcrumbs",
    description:
      "Breadcrumb trail with spring separators, hover lift, and a subtle shimmer on the current page. Built with Framer Motion.",
    dependencies: ["framer-motion", "lucide-react"],
  },
  button: {
    title: "Button",
    description:
      'Primary action control with CVA variants, pointer ripples via Framer Motion, and default type="button". Forwards ref and native button props.',
    dependencies: ["framer-motion", "class-variance-authority"],
  },
  "checkbox-group": {
    title: "Checkbox group",
    description:
      "Multi-select option list with bordered empty state and a primary tick only when checked, plus hover/tap motion on each row. Framer Motion + Lucide.",
    dependencies: ["framer-motion", "lucide-react"],
  },
  collapsible: {
    title: "Collapsible",
    description:
      "Accessible collapsible primitive built on Radix UI. Exports Collapsible, CollapsibleTrigger, and CollapsibleContent for building expandable sections, FAQs, and disclosure patterns.",
    dependencies: [
      "@radix-ui/react-collapsible",
      "framer-motion",
      "lucide-react",
    ],
  },
  tooltip: {
    title: "Tooltip",
    description:
      "Animated hover/focus tooltip with spring entrance, blur fade, directional offset, and optional delay and side placement. Built with Framer Motion.",
    dependencies: ["framer-motion"],
  },
  select: {
    title: "Select",
    description:
      "Animated single-select dropdown with staggered options, chevron rotation, scaleY panel, row hover slide, and check mark on the active item. Framer Motion + Lucide.",
    dependencies: ["framer-motion", "lucide-react"],
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
