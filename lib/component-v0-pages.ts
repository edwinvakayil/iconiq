const REACT_HOOK_USAGE = /\buse(State|Effect|Reducer|Ref|Memo|Callback)\b/;
const EXPORT_NAMED_FUNCTION = /export function \w+\s*\(/g;
const EXPORT_DEFAULT_NOT_PAGE = /export default function (?!Page)\w+\s*\(/g;
const USE_CLIENT_DIRECTIVE = /^["']use client["'];\s*/;
const IMPORT_BLOCK =
  /^((?:["']use client["'];\s*)?(?:import\s[\s\S]*?;[\r\n]*)*)/;
const PAGE_FUNCTION_BODY =
  /export default function Page\(\)\s*\{([\s\S]*)\}\s*$/;
const RETURN_STATEMENT = /^return\s+([\s\S]+?);?\s*$/;

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

  const fnBodyMatch = body.match(PAGE_FUNCTION_BODY);
  if (!fnBodyMatch) {
    return `${`${imports}\n\n${body}\n`.trimEnd()}\n`;
  }

  const fnBody = fnBodyMatch[1].trim();
  const returnMatch = fnBody.match(RETURN_STATEMENT);

  if (!returnMatch) {
    return `${`${imports}\n\n${body}\n`.trimEnd()}\n`;
  }

  let inner = returnMatch[1].trim();
  if (inner.startsWith("(") && inner.endsWith(")")) {
    inner = inner.slice(1, -1).trim();
  }

  const wrappedInner = code.includes("min-h-svh")
    ? inner
    : `${V0_CANVAS_SHELL}        ${inner}\n${V0_CANVAS_SHELL_CLOSE}`;

  return `${imports}

export default function Page() {
  return (
${wrappedInner}
  );
}
`;
}

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
