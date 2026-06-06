export const COPIED_CLI_GATE = "copied-cli";

export const COPY_GATE_SOURCES = ["cli", "manual"] as const;

export type DocsCopySource = (typeof COPY_GATE_SOURCES)[number];

export function getDocsCopyGateName(
  componentName: string,
  source: DocsCopySource
) {
  if (source === "cli") {
    return COPIED_CLI_GATE;
  }

  return `copied-${componentName.trim().toLowerCase()}-manual`;
}
