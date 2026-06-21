const SIDE_EFFECT_IMPORT_PATTERN = /^import\s+["'][^"']+["']\s*;?\s*$/;
const FROM_IMPORT_PATTERN = /from\s+["'][^"']+["']\s*;?\s*$/;

function isCompleteImportBlock(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.startsWith("import")) {
    return false;
  }

  if (SIDE_EFFECT_IMPORT_PATTERN.test(trimmed)) {
    return true;
  }

  return FROM_IMPORT_PATTERN.test(trimmed);
}

function skipBlankLines(lines: string[], startIndex: number) {
  let index = startIndex;

  while (index < lines.length && lines[index]?.trim() === "") {
    index += 1;
  }

  return index;
}

function appendImportContinuation(
  lines: string[],
  importLines: string[],
  startIndex: number
) {
  let index = startIndex;

  while (index < lines.length) {
    const next = lines[index]?.trim() ?? "";

    if (next === "") {
      return index + 1;
    }

    if (!next.startsWith("import ")) {
      return index;
    }

    importLines.push(lines[index] ?? "");
    index += 1;
  }

  return index;
}

function collectImportBlock(lines: string[], startIndex: number) {
  const importLines: string[] = [];
  let index = skipBlankLines(lines, startIndex);

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const trimmedLine = line.trim();

    if (trimmedLine === "") {
      if (
        importLines.length > 0 &&
        isCompleteImportBlock(importLines.join("\n"))
      ) {
        index += 1;
        break;
      }

      index += 1;
      continue;
    }

    if (trimmedLine.startsWith("import ")) {
      importLines.push(line);
      index += 1;

      if (isCompleteImportBlock(importLines.join("\n"))) {
        index = appendImportContinuation(lines, importLines, index);
        break;
      }

      continue;
    }

    if (
      importLines.length > 0 &&
      !isCompleteImportBlock(importLines.join("\n"))
    ) {
      importLines.push(line);
      index += 1;
      continue;
    }

    break;
  }

  return {
    importLines,
    nextIndex: skipBlankLines(lines, index),
  };
}

export function splitImportAndUsage(code: string): {
  importCode: string;
  usageCode: string;
} {
  const trimmed = code.trim();
  if (!trimmed) {
    return { importCode: "", usageCode: "" };
  }

  const lines = trimmed.split("\n");
  const { importLines, nextIndex } = collectImportBlock(lines, 0);

  return {
    importCode: importLines.join("\n").trim(),
    usageCode: lines.slice(nextIndex).join("\n").trim(),
  };
}

export function stripImportFromCode(code: string): string {
  const { usageCode } = splitImportAndUsage(code);
  return usageCode || code.trim();
}
