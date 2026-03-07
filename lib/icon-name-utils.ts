/**
 * Convert kebab-case icon name to PascalCase + "Icon".
 * e.g. "arrow-down" -> "ArrowDownIcon"
 */
export function kebabToPascalIcon(kebab: string): string {
  const pascal = kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
  return `${pascal}Icon`;
}
