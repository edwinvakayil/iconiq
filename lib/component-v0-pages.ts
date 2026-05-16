const REACT_HOOK_USAGE = /\buse(State|Effect|Reducer|Ref|Memo|Callback)\b/;
const EXPORT_NAMED_FUNCTION = /export function \w+\s*\(/g;
const EXPORT_DEFAULT_NOT_PAGE = /export default function (?!Page)\w+\s*\(/g;
const PAGE_RETURN_OPENING =
  /(export default function Page\(\)\s*\{[\s\S]*?return\s*\()\s*\n/;

/**
 * Converts a docs usage snippet into a self-contained v0 `app/page.tsx`.
 * Used so "Open in v0" matches the live preview on component/text pages.
 */
export function usageToV0Page(usageCode: string): string {
  let code = usageCode.trim();

  if (
    !(code.startsWith('"use client"') || code.startsWith("'use client'")) &&
    REACT_HOOK_USAGE.test(code)
  ) {
    code = `"use client";\n\n${code}`;
  }

  code = code.replace(EXPORT_NAMED_FUNCTION, "export default function Page(");
  code = code.replace(EXPORT_DEFAULT_NOT_PAGE, "export default function Page(");

  if (!code.includes("min-h-svh")) {
    code = code.replace(
      PAGE_RETURN_OPENING,
      '$1\n    <div className="flex min-h-svh w-full items-center justify-center p-8">\n'
    );

    const closingReturn = code.lastIndexOf("\n  )");
    if (closingReturn !== -1) {
      code = `${code.slice(0, closingReturn)}\n    </div>${code.slice(closingReturn)}`;
    }
  }

  return code.endsWith("\n") ? code : `${code}\n`;
}

/** Skeleton docs preview uses ShimmerSkeleton (registry export name). */
export const skeletonV0Page = `"use client";

import { ShimmerSkeleton } from "@/components/ui/skeleton"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-8">
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
  )
}
`;
