import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE } from "../constants";
import { components } from "./registry-components";
import type { Schema } from "./registry-schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const registryComponents = path.join(__dirname, "../public/r");
const scopedRegistryComponents = path.join(registryComponents, "iconiq");
const registryIndexPath = path.join(__dirname, "../public/r/registry.json");
const registryRootPath = path.join(__dirname, "../registry.json");

if (!fs.existsSync(registryComponents)) {
  fs.mkdirSync(registryComponents, { recursive: true });
}

if (!fs.existsSync(scopedRegistryComponents)) {
  fs.mkdirSync(scopedRegistryComponents, { recursive: true });
}

console.log("\n🔨 Building registry components...\n");

const registryItems: Schema[] = [];

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
  if (component.author) schema.author = component.author;
  if (component.tailwind) schema.tailwind = component.tailwind;
  if (component.cssVars) schema.cssVars = component.cssVars;
  if (component.css) schema.css = component.css;
  if (component.envVars) schema.envVars = component.envVars;
  if (component.docs) schema.docs = component.docs;
  if (component.categories) schema.categories = component.categories;
  if (component.meta) schema.meta = component.meta;

  const itemJson = JSON.stringify(schema, null, 2);

  // Unscoped path: /r/{name}.json (backwards compatibility, direct URL usage)
  fs.writeFileSync(
    path.join(registryComponents, `${component.name}.json`),
    itemJson
  );

  // Scoped path: /r/iconiq/{name}.json so that
  // npx shadcn add iconiq/{name} works when registry URL is .../r/{name}.json
  fs.writeFileSync(
    path.join(scopedRegistryComponents, `${component.name}.json`),
    itemJson
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
