export const COPY_GATE_SOURCES = ["cli", "manual"] as const;

export type DocsCopySource = (typeof COPY_GATE_SOURCES)[number];

export function getDocsCopyGateName(
  componentName: string,
  source: DocsCopySource
) {
  return `copied-${componentName.trim().toLowerCase()}-${source}`;
}
