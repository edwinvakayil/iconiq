import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Schema } from "./registry-schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type ComponentDefinition = Partial<
  Pick<
    Schema,
    | "dependencies"
    | "devDependencies"
    | "registryDependencies"
    | "cssVars"
    | "tailwind"
    | "title"
    | "description"
    | "author"
    | "css"
    | "envVars"
    | "docs"
    | "categories"
    | "meta"
  >
> & {
  name: string;
  path: string;
};

const registryDir = path.join(__dirname, "../registry");

export const components: ComponentDefinition[] = fs
  .readdirSync(registryDir)
  .filter((file) => file.endsWith(".tsx"))
  .sort()
  .map((file) => ({
    name: path.basename(file, ".tsx"),
    path: path.join(registryDir, file),
    registryDependencies: [],
  }));
