const REACT_HOOK_USAGE = /\buse(State|Effect|Reducer|Ref|Memo|Callback)\b/;
const EXPORT_NAMED_FUNCTION = /export function \w+\s*\(/g;
const EXPORT_DEFAULT_NOT_PAGE = /export default function (?!Page)\w+\s*\(/g;
const USE_CLIENT_DIRECTIVE = /^["']use client["'];\s*/;
const IMPORT_BLOCK =
  /^((?:["']use client["'];\s*)?(?:import\s[\s\S]*?;[\r\n]*)*)/;
const PAGE_FUNCTION_START = /export default function Page\s*\(/;
const PAGE_FUNCTION_BODY =
  /export default function Page\(\)\s*\{([\s\S]*)\}\s*$/;
const TOP_LEVEL_DECLARATION = /^(?:const|let)\s/;
const USES_REACT_HOOKS = /\buse(?:Effect|Memo|Callback|LayoutEffect)\s*\(/;
const JSX_RETURN_PATTERN = /return\s*\(\s*(?:\n\s*)?</g;

function splitModulePreamble(body: string): {
  preamble: string;
  pageFunction: string;
} {
  const pageStart = body.search(PAGE_FUNCTION_START);

  if (pageStart === -1) {
    return { preamble: "", pageFunction: body };
  }

  return {
    preamble: body.slice(0, pageStart).trim(),
    pageFunction: body.slice(pageStart).trim(),
  };
}

function indentForFunctionBody(block: string): string {
  if (!block.trim()) {
    return "";
  }

  return block
    .split("\n")
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join("\n");
}

function extractTopLevelDeclarations(fnBody: string): {
  declarations: string;
  remainder: string;
} {
  const lines = fnBody.split("\n");
  const declarationLines: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      if (declarationLines.length > 0) {
        break;
      }
      index += 1;
      continue;
    }

    if (!TOP_LEVEL_DECLARATION.test(trimmed)) {
      break;
    }

    let statement = line;
    index += 1;

    while (index < lines.length && !statement.includes(";")) {
      statement += `\n${lines[index]}`;
      index += 1;
    }

    declarationLines.push(statement);
  }

  return {
    declarations: declarationLines.join("\n").trim(),
    remainder: lines.slice(index).join("\n").trim(),
  };
}

function skipQuotedLiteral(
  source: string,
  start: number,
  quote: string
): number {
  let index = start + 1;

  while (index < source.length) {
    const char = source[index];

    if (char === "\\") {
      index += 2;
      continue;
    }

    if (char === quote) {
      return index + 1;
    }

    index += 1;
  }

  return source.length;
}

function skipLineComment(source: string, start: number): number {
  let index = start + 2;

  while (index < source.length && source[index] !== "\n") {
    index += 1;
  }

  return index;
}

function skipBlockComment(source: string, start: number): number {
  let index = start + 2;

  while (index < source.length - 1) {
    if (source[index] === "*" && source[index + 1] === "/") {
      return index + 2;
    }

    index += 1;
  }

  return source.length;
}

function balanceParentheses(source: string, openIndex: number): number {
  let depth = 0;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (char === "'" || char === '"' || char === "`") {
      index = skipQuotedLiteral(source, index, char) - 1;
      continue;
    }

    if (char === "/" && next === "/") {
      index = skipLineComment(source, index) - 1;
      continue;
    }

    if (char === "/" && next === "*") {
      index = skipBlockComment(source, index) - 1;
      continue;
    }

    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function findLastJsxReturnOpenParen(fnBody: string): number {
  let lastOpenParen = -1;

  for (const match of fnBody.matchAll(JSX_RETURN_PATTERN)) {
    lastOpenParen = match.index + match[0].lastIndexOf("(");
  }

  return lastOpenParen;
}

function wrapJsxReturnInCanvas(fnBody: string, skipCanvas: boolean): string {
  if (skipCanvas) {
    return fnBody;
  }

  const openParen = findLastJsxReturnOpenParen(fnBody);

  if (openParen === -1) {
    return fnBody;
  }

  const closeIndex = balanceParentheses(fnBody, openParen);

  if (closeIndex === -1) {
    return fnBody;
  }

  const inner = fnBody.slice(openParen + 1, closeIndex).trim();

  return `${fnBody.slice(0, openParen + 1)}
${V0_CANVAS_SHELL}        ${inner}
${V0_CANVAS_SHELL_CLOSE}${fnBody.slice(closeIndex)}`;
}

function extractMainReturn(fnBody: string): {
  hookBody: string;
  returnInner: string | null;
} {
  const openParen = findLastJsxReturnOpenParen(fnBody);

  if (openParen === -1) {
    return { hookBody: fnBody.trim(), returnInner: null };
  }

  const returnStart = fnBody.lastIndexOf("return", openParen);
  const closeIndex = balanceParentheses(fnBody, openParen);

  if (returnStart === -1 || closeIndex === -1) {
    return { hookBody: fnBody.trim(), returnInner: null };
  }

  return {
    hookBody: fnBody.slice(0, returnStart).trim(),
    returnInner: fnBody.slice(openParen + 1, closeIndex).trim(),
  };
}

function unwrapJsxReturnParens(inner: string): string {
  const trimmed = inner.trim();

  if (!(trimmed.startsWith("(") && trimmed.endsWith(")"))) {
    return trimmed;
  }

  const unwrapped = trimmed.slice(1, -1).trim();

  if (unwrapped.startsWith("<") || unwrapped.startsWith("<>")) {
    return unwrapped;
  }

  return trimmed;
}

function mergePageDeclarations(
  modulePreamble: string,
  functionDeclarations: string
): string {
  return [modulePreamble, functionDeclarations].filter(Boolean).join("\n\n");
}

const V0_CANVAS_SHELL = `    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-4xl flex-col items-center justify-center">
`;

const V0_CANVAS_SHELL_CLOSE = `      </div>
    </div>`;

/**
 * Converts a docs preview/usage snippet into a self-contained v0 `app/page.tsx`.
 */
export function buildV0Page(source: string): string {
  let code = source.trim();

  if (!USE_CLIENT_DIRECTIVE.test(code) && REACT_HOOK_USAGE.test(code)) {
    code = `"use client";\n\n${code}`;
  }

  const importMatch = code.match(IMPORT_BLOCK);
  const imports = importMatch?.[1]?.trim() ?? "";
  let body = importMatch ? code.slice(importMatch[1].length).trim() : code;

  body = body
    .replace(EXPORT_NAMED_FUNCTION, "export default function Page(")
    .replace(EXPORT_DEFAULT_NOT_PAGE, "export default function Page(");

  const { preamble, pageFunction } = splitModulePreamble(body);
  const fnBodyMatch = pageFunction.match(PAGE_FUNCTION_BODY);

  if (!fnBodyMatch) {
    const sections = [imports, preamble, pageFunction].filter(Boolean);
    return `${sections.join("\n\n")}\n`;
  }

  const fnBody = fnBodyMatch[1].trim();
  const skipCanvas = code.includes("min-h-svh");

  if (USES_REACT_HOOKS.test(fnBody)) {
    const wrappedBody = wrapJsxReturnInCanvas(fnBody, skipCanvas);
    const sections = [
      imports,
      preamble,
      `export default function Page() {
${indentForFunctionBody(wrappedBody)}
}`,
    ].filter(Boolean);

    return `${sections.join("\n\n")}\n`;
  }

  const { declarations: inFunctionDeclarations, remainder } =
    extractTopLevelDeclarations(fnBody);
  const { hookBody, returnInner } = extractMainReturn(remainder);

  if (!returnInner) {
    const sections = [imports, preamble, pageFunction].filter(Boolean);
    return `${sections.join("\n\n")}\n`;
  }

  const inner = unwrapJsxReturnParens(returnInner);

  const wrappedInner = skipCanvas
    ? inner
    : `${V0_CANVAS_SHELL}        ${inner}\n${V0_CANVAS_SHELL_CLOSE}`;

  const pageDeclarations = mergePageDeclarations(
    preamble,
    inFunctionDeclarations
  );
  const inlinedDeclarations = indentForFunctionBody(pageDeclarations);
  const inlinedHookBody = indentForFunctionBody(hookBody);
  const pageBodyPrefix = [inlinedDeclarations, inlinedHookBody]
    .filter(Boolean)
    .join("\n\n");

  const sections = [
    imports,
    `export default function Page() {
${pageBodyPrefix}${pageBodyPrefix ? "\n\n" : ""}  return (
${wrappedInner}
  );
}`,
  ].filter(Boolean);

  return `${sections.join("\n\n")}\n`;
}

/** Avatar docs preview — matches usageCode with shadcn image + link. */
export const avatarPreviewCode = `import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";

const imageSrc = "/assets/shadcn.jpg";

export function AvatarPreview() {
  return (
    <div className="flex flex-col items-center gap-6 px-2 py-4">
      <Link
        aria-label="Open shadcn/ui"
        className="inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        href="https://ui.shadcn.com/"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Avatar alt="shadcn/ui" name="shadcn/ui" src={imageSrc} />
      </Link>

      <p className="max-w-md text-center text-[13px] leading-relaxed">
        <span className="text-emerald-600 dark:text-emerald-400">44px frame</span>
        <span className="text-neutral-400 dark:text-neutral-500"> · </span>
        <span className="text-sky-600 dark:text-sky-400">Fallback appears first</span>
        <span className="text-neutral-400 dark:text-neutral-500"> · </span>
        <span className="text-violet-600 dark:text-violet-400">Image crossfades in</span>
      </p>
    </div>
  );
}`;

/** Badge docs preview uses custom tone objects (not in usageCode). */
export const badgePreviewCode = `import { Badge } from "@/components/ui/badge";

const launchBadgeTone = {
  className:
    "[--badge-bg:#ccfbf1] [--badge-fg:#115e59] dark:[--badge-bg:#99f6e4] dark:[--badge-fg:#134e4a]",
  style: {
    backgroundColor: "var(--badge-bg)",
    color: "var(--badge-fg)",
  },
};

const betaBadgeTone = {
  className:
    "[--badge-bg:#ffedd5] [--badge-fg:#9a3412] dark:[--badge-bg:#fed7aa] dark:[--badge-fg:#7c2d12]",
  style: {
    backgroundColor: "var(--badge-bg)",
    color: "var(--badge-fg)",
  },
};

const shippingBadgeTone = {
  className:
    "[--badge-bg:#fce7f3] [--badge-fg:#9d174d] dark:[--badge-bg:#fbcfe8] dark:[--badge-fg:#831843]",
  style: {
    backgroundColor: "var(--badge-bg)",
    color: "var(--badge-fg)",
  },
};

export function BadgePreview() {
  return (
    <div className="flex min-h-[260px] flex-1 items-center justify-center px-4 py-8">
      <p className="max-w-2xl text-center font-medium text-lg leading-relaxed text-neutral-800 dark:text-neutral-100 sm:text-xl">
        Mark the beat with a{" "}
        <Badge {...launchBadgeTone} color="teal">
          Fresh Launch
        </Badge>{" "}
        tag for releases,{" "}
        <Badge {...betaBadgeTone} color="orange">
          Private Beta
        </Badge>{" "}
        while you are still tuning,{" "}
        <Badge {...shippingBadgeTone} color="pink">
          Now Shipping
        </Badge>{" "}
        once it is out the door, and a quieter{" "}
        <Badge color="blue" variant="dot">
          Status Monitoring
        </Badge>{" "}
        pulse when the release just needs a status check.
      </p>
    </div>
  );
}`;

/** Skeleton docs preview uses ShimmerSkeleton (registry export name). */
export const skeletonPreviewCode = `"use client";

import { ShimmerSkeleton } from "@/components/ui/skeleton";

export function SkeletonPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border border-border/80 bg-card p-4">
        <div className="flex items-center gap-3">
          <ShimmerSkeleton className="h-11 w-11" rounded="full" />
          <div className="flex-1 space-y-2">
            <ShimmerSkeleton className="h-4 w-32" />
            <ShimmerSkeleton className="h-3 w-24" rounded="sm" />
          </div>
        </div>
        <div className="mt-5 space-y-2.5">
          <ShimmerSkeleton className="h-3 w-full" />
          <ShimmerSkeleton className="h-3 w-[92%]" />
          <ShimmerSkeleton className="h-3 w-[78%]" />
        </div>
      </div>
    </div>
  );
}`;

const COMPONENT_PREVIEW_OVERRIDES: Record<string, string> = {
  avatar: avatarPreviewCode,
  badge: badgePreviewCode,
  skeleton: skeletonPreviewCode,
};

export function getComponentV0Page(
  componentName: string,
  previewSource?: string
): string {
  const source =
    previewSource ?? COMPONENT_PREVIEW_OVERRIDES[componentName] ?? "";

  if (!source) {
    return "";
  }

  return buildV0Page(source);
}

/** @deprecated Use buildV0Page */
export const usageToV0Page = buildV0Page;

/** @deprecated Use skeletonPreviewCode */
export const skeletonV0Page = buildV0Page(skeletonPreviewCode);
