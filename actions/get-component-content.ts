"use server";

import { promises as fs } from "node:fs";
import path from "node:path";

export async function getComponentContent(name: string): Promise<string> {
  const registryDir = path.join(process.cwd(), "registry");
  const content = await fs.readFile(
    path.join(registryDir, `${name}.tsx`),
    "utf-8"
  );
  return content;
}
