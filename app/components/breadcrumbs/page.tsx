import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { BreadcrumbsPreview } from "@/components/breadcrumbs-preview";
import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { ComponentPager } from "@/components/component-pager";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BreadcrumbItem } from "@/registry/breadcrumbs";

const demoItems: BreadcrumbItem[] = [
  { label: "Home", href: "/", icon: <Home className="h-3.5 w-3.5" /> },
  { label: "Docs", href: "/" },
  { label: "Components", href: "/components/smart-tooltip" },
  { label: "Breadcrumb" },
];

export default function BreadcrumbPage() {
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

              <li
                aria-current="page"
                className="w-[90px] truncate text-neutral-900 sm:w-auto"
              >
                Components
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>

              <li
                aria-current="page"
                className="w-[90px] truncate text-neutral-900 sm:w-auto"
              >
                Breadcrumb
              </li>
            </ol>
            <ComponentPager />
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-white">
            Breadcrumb
          </h1>

          <p className="mt-2 font-sans text-lg text-neutral-600 leading-relaxed dark:text-neutral-300">
            Animated breadcrumb navigation with spring transitions, hover
            feedback, and a subtle shimmer on the current item. Built with
            Framer Motion.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm leading-relaxed dark:text-neutral-300">
            Use it for page hierarchy and back-navigation. Pass an array of
            items with label and optional href and icon. The last item is
            rendered as the current page with a shimmer and dot indicator.
          </p>

          <div className="mt-10">
            <CodeBlockInstall componentName="breadcrumbs" />
          </div>

          <h2 className="sr-only" id="preview">
            Preview
          </h2>

          <div className="mt-10 rounded-sm border border-neutral-200 bg-neutral-50/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-[0_18px_45px_rgba(15,23,42,0.7)]">
            <Tabs
              aria-label="Breadcrumb preview, code, and get the component"
              className="w-full"
              defaultValue="preview"
            >
              <TabsList className="border-neutral-200 border-b pb-1 font-medium text-neutral-500 text-sm dark:border-neutral-800 dark:text-neutral-400">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="get-component">
                  Build with{" "}
                  <span className="inline-flex align-baseline">
                    <svg
                      aria-hidden
                      className="ml-1 inline-block h-[0.95em] w-auto align-[0.1em]"
                      fill="currentColor"
                      viewBox="0 0 40 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z" />
                      <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z" />
                    </svg>
                    <span className="sr-only">v0</span>
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                className="space-y-4 pt-4 focus-visible:outline-none"
                value="preview"
              >
                <p className="font-sans text-neutral-600 text-sm dark:text-neutral-400">
                  Hover links to see the background highlight. The current item
                  shows a shimmer and pulsing dot. Click Replay to run the
                  entrance animation again.
                </p>

                <BreadcrumbsPreview items={demoItems} />
              </TabsContent>

              <TabsContent
                className="space-y-4 pt-4 focus-visible:outline-none"
                value="code"
              >
                <h2 className="sr-only" id="usage">
                  Usage
                </h2>

                <p className="font-sans text-neutral-600 text-sm dark:text-neutral-400">
                  Import{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    AnimatedBreadcrumbs
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    BreadcrumbItem
                  </code>{" "}
                  from{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    @/components/ui/breadcrumbs
                  </code>
                  . Pass an array of items with label and optional href and
                  icon.
                </p>

                <div className="mt-4">
                  <CodeBlock
                    code={`import { AnimatedBreadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Home } from "lucide-react";

const items: BreadcrumbItem[] = [
  { label: "Home", href: "/", icon: <Home className="h-3.5 w-3.5" /> },
  { label: "Docs", href: "/" },
  { label: "Components", href: "/components/smart-tooltip" },
  { label: "Breadcrumb" },
];

export function Example() {
  return <AnimatedBreadcrumbs items={items} />;
}`}
                    language="tsx"
                  />
                </div>
              </TabsContent>

              <TabsContent
                className="space-y-4 pt-4 focus-visible:outline-none"
                value="get-component"
              >
                <h2 className="sr-only" id="get-code">
                  Get the Component
                </h2>

                <p className="font-sans text-neutral-600 text-sm dark:text-neutral-400">
                  Build with{" "}
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
                  to customize and generate variations.
                </p>

                <div className="mt-6">
                  <ComponentActions name="breadcrumbs" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <h3 className="sr-only" id="props">
            Props
          </h3>

          <div className="mt-6 border-neutral-200 border-t pt-4 text-sm dark:border-neutral-800">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-2.5 py-0.5 font-mono text-[11px] text-neutral-500 uppercase tracking-[0.16em] dark:border-neutral-800 dark:text-neutral-400">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-semibold text-[10px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                breadcrumbs
              </span>
              <span>Props</span>
            </div>

            <dl className="mt-3 divide-y divide-neutral-200 border border-neutral-200 text-[13px] dark:divide-neutral-800 dark:border-neutral-800">
              <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  items
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Array of{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    BreadcrumbItem
                  </code>
                  . Each has{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    label
                  </code>
                  , optional{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    href
                  </code>
                  , and optional{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-[11px] dark:bg-neutral-700 dark:text-neutral-200">
                    icon
                  </code>
                  . The last item is the current page (no link).
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  className
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Optional class applied to the nav wrapper.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      <OnThisPage />
    </div>
  );
}
