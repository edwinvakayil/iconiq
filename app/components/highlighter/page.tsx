import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { HighlighterPreviewBlock } from "@/components/highlighter-preview-block";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";

export default function HighlighterPage() {
  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 font-sans text-neutral-500 text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-neutral-900"
                  href="/"
                >
                  Docs
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>
              <li aria-current="page" className="text-neutral-900">
                Components
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>
              <li aria-current="page" className="text-neutral-900">
                Highlighter
              </li>
            </ol>
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-white">
            Highlighter
          </h1>
          <p className="mt-2 font-sans text-lg text-neutral-600 dark:text-neutral-400">
            A highlighter component that draws a border and pointer around text
            with a subtle animation. Uses Motion for the reveal effect.
          </p>
          <p className="mt-6 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Built with Motion to animate a rectangle growing around the content
            and a pointer icon appearing at the bottom-right. ResizeObserver
            keeps the highlight in sync with the wrapped element. Ideal for
            callouts, labels, or drawing attention to key phrases in copy.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Install using the shadcn CLI to add the highlighter component to
            your application.
          </p>

          <div className="mt-10">
            <CodeBlockInstall componentName="highlighter" />
          </div>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="preview"
          >
            Preview
          </h2>
          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            The highlight draws around the wrapped content when it enters the
            viewport; the pointer appears at the corner. Use Replay to see the
            animation again.
          </p>
          <HighlighterPreviewBlock className="mt-6" />

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="usage"
          >
            Usage
          </h2>
          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Import from{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              @/components/ui/highlighter
            </code>{" "}
            and wrap any content. Use{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              containerClassName
            </code>{" "}
            for inline use (e.g.{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              inline-block align-baseline
            </code>
            ).
          </p>
          <div className="mt-4">
            <CodeBlock
              code={`import { Highlighter } from "@/components/ui/highlighter";

<div>
  Your text here{" "}
  <Highlighter containerClassName="inline-block align-baseline">
    <span className="relative z-10">highlighted phrase</span>
  </Highlighter>
</div>`}
              language="tsx"
            />
          </div>

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900 dark:text-white"
            id="props"
          >
            Props
          </h3>
          <ul className="mt-2 list-inside list-disc font-sans text-neutral-600 text-sm dark:text-neutral-400">
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                children
              </code>{" "}
              — content to highlight (wrap in a span with{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                relative z-10
              </code>{" "}
              so text sits above the border)
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                containerClassName
              </code>{" "}
              — optional class for the wrapper (e.g. inline alignment)
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                rectangleClassName
              </code>{" "}
              — optional class for the border rectangle
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                pointerColor
              </code>{" "}
              — optional CSS color for the pointer (e.g.{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                #22c55e
              </code>
              ). Defaults to blue.
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                pointerClassName
              </code>{" "}
              — optional class for the pointer icon (size, etc.)
            </li>
          </ul>
        </div>

        <div className="mx-auto max-w-[720px] px-4 pb-12 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              href="/components/animated-tooltip"
            >
              <span aria-hidden="true">←</span>
              Animated Tooltip
            </Link>
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              href="/icons"
            >
              Icon Library
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </main>
      <OnThisPage />
    </div>
  );
}
