import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { ComponentPager } from "@/components/component-pager";
import { HighlighterPreviewBlock } from "@/components/highlighter-preview-block";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";

export default function HighlighterPage() {
  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center justify-between gap-3"
          >
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
            <ComponentPager />
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

          {/* GET COMPONENT SECTION */}

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="get-code"
          >
            Get the Component
          </h2>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Copy the Highlighter component directly into your project or open it
            in{" "}
            <span className="inline-flex align-baseline">
              <svg
                aria-hidden
                className="mr-0.5 inline-block h-[0.95em] w-auto align-[0.1em]"
                fill="currentColor"
                viewBox="0 0 40 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z" />
                <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z" />
              </svg>
              <span className="sr-only">v0</span>
            </span>{" "}
            to customize and generate variations. This makes it easy to adapt
            the component to your UI and workflow.
          </p>

          <div className="mt-6">
            <ComponentActions name="highlighter" />
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
      </main>

      <OnThisPage />
    </div>
  );
}
