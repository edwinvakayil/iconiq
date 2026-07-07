"use client";

import { codeBlockApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { CodeBlock } from "@/registry/code-block";

const previewCode = `export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`;

const usageCode = `import { CodeBlock } from "@/components/ui/code-block";

const snippet = \`export async function getUser(id: string) {
  const res = await fetch(\\\`/api/users/\\\${id}\\\`);
  return res.json();
}\`;

export function Example() {
  return (
    <CodeBlock
      code={snippet}
      filename="get-user.ts"
      language="ts"
      highlightLines={[2]}
      onCopy={(code) => console.log("copied", code.length)}
    />
  );
}`;

function CodeBlockPreview() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-12 pb-2">
      <CodeBlock
        code={previewCode}
        filename="use-debounce.ts"
        highlightLines={[5]}
        language="ts"
      />
    </div>
  );
}

export default function CodeBlockPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Blocks" },
        { label: "Code Block" },
      ]}
      componentName="code-block"
      description="Editor-style code block with a filename tab, a top-right copy button, a bottom status bar with language and line count, line numbers, built-in syntax highlighting, and a smooth copy-to-copied swap. White in light mode, dark in dark mode."
      details={codeBlockApiDetails}
      detailsDescription="CodeBlock looks like a real editor pane: the filename sits in a tab that joins the code area below it, the copy button is pinned to the top-right corner, and a slim status bar along the bottom shows the language and the line count. Without a filename the tab strip disappears and the copy button floats over the code as a glass chip, still top right. The whole surface follows the site theme — white in light mode, near-black in dark mode — including the token palette. The body is highlighted by a small built-in tokenizer, so there is no highlighter dependency to install. Clicking copy writes the code to the clipboard and crossfades the clipboard icon into a check with a transform-only spring while the label swaps from Copy to Copied in a fixed-width slot, so nothing shifts or stutters, then swaps back two seconds later."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/blocks/code-block/page.tsx`}
      itemSlug="code-block"
      pageUrl="/blocks/code-block"
      preview={<CodeBlockPreview />}
      previewDescription="Click Copy in the top-right corner — the clipboard icon springs into an emerald check while the label crossfades from Copy to Copied, and the status bar echoes a Copied to clipboard confirmation, all without shifting layout. Line 5 shows the highlightLines gradient wash, and rows glow softly on hover. Toggle the theme to see the surface switch between white and dark."
      title="Code Block"
      usageCode={usageCode}
      usageDescription="Pass the source as a plain string via `code`. Add `filename` for the tab — its accent dot picks up a per-language color from `language`, which also appears in the status bar with the line count. Use `highlightLines` to emphasize rows and `maxHeight` to cap the body before it scrolls. The `onCopy` callback fires after the code lands on the clipboard."
    />
  );
}
