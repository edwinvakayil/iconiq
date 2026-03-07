import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { components } from "./registry-components";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function updateRegistryComponents() {
  const iconsDir = path.join(process.cwd(), "icons");
  const registryDir = path.join(__dirname, "..", "registry");
  const existingIcons = new Map(
    components
      .filter((c) => c.path.includes("icons"))
      .map((c) => [path.basename(c.path), c])
  );
  const existingRegistryNames = new Set(
    components
      .filter((c) => c.path.includes("registry"))
      .map((c) => path.basename(c.path, ".tsx"))
  );

  const newComponents: {
    name: string;
    path: string;
    registryDependencies: string[];
    dependencies: string[];
  }[] = [];

  const iconFiles = fs
    .readdirSync(iconsDir)
    .filter((file) => file.endsWith(".tsx") && file !== "index.ts")
    .sort();

  for (const file of iconFiles) {
    if (!existingIcons.has(file)) {
      const name = path.basename(file, ".tsx");
      newComponents.push({
        name,
        path: path.join(__dirname, "../icons", file),
        registryDependencies: [],
        dependencies: ["motion"],
      });
    }
  }

  if (fs.existsSync(registryDir)) {
    const registryFiles = fs
      .readdirSync(registryDir)
      .filter((file) => file.endsWith(".tsx"))
      .sort();

    for (const file of registryFiles) {
      const name = path.basename(file, ".tsx");
      if (!existingRegistryNames.has(name)) {
        newComponents.push({
          name,
          path: path.join(__dirname, "../registry", file),
          registryDependencies: [],
          dependencies: [],
        });
      }
    }
  }

  if (newComponents.length === 0) {
    console.log("\n✅ Registry is up to date. No new components to add.\n");
    return;
  }

  const registryPath = path.join(__dirname, "registry-components.ts");
  const content = fs.readFileSync(registryPath, "utf8");

  const lastComponentIndex = content.lastIndexOf("}");

  const newComponentsString = newComponents
    .map((comp) => {
      const basename = path.basename(comp.path);
      const isRegistry = comp.path.includes("registry");
      const pathJoin = isRegistry
        ? `path.join(__dirname, "../registry", "${basename}")`
        : `path.join(__dirname, "../icons", "${basename}")`;
      const deps = isRegistry ? "[]" : '["motion"]';
      return `  {
    name: "${comp.name}",
    path: ${pathJoin},
    registryDependencies: [],
    dependencies: ${deps},
  }`;
    })
    .join(",\n");

  const updatedContent =
    content.slice(0, lastComponentIndex + 1) +
    ",\n" +
    newComponentsString +
    ",\n];";

  fs.writeFileSync(registryPath, updatedContent);

  console.log(
    `\n✅ Added ${newComponents.length} new component${newComponents.length > 1 ? "s" : ""}:`
  );
  // biome-ignore lint/suspicious/useIterableCallbackReturn: ignore
  newComponents.forEach((c) => console.log(`   • ${c.name}`));
  console.log("");
}

updateRegistryComponents();
