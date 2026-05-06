import type { ReactNode } from "react";
import * as React from "react";

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return compactWhitespace(node.map(nodeToText).join(" "));
  }

  if (React.isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return nodeToText(props.children);
  }

  return "";
}

export { compactWhitespace, nodeToText };
