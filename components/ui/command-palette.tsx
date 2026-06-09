"use client";

import { CommandPalette as RegistryCommandPalette } from "@/registry/command-palette";

type CommandMenuGroupDef =
  import("@/registry/command-palette").CommandMenuGroupDef;
type CommandPaletteProps =
  import("@/registry/command-palette").CommandPaletteProps;

function CommandPalette(props: CommandPaletteProps) {
  return <RegistryCommandPalette {...props} />;
}

function CommandMenu(props: CommandPaletteProps) {
  return <RegistryCommandPalette {...props} />;
}

export { CommandPalette, CommandMenu };
export type { CommandMenuGroupDef, CommandPaletteProps };
