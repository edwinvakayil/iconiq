import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { ComponentPager } from "@/components/component-pager";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, FileTree, FileTreeSearch, Folder } from "@/registry/file-tree";

export default function FileTreePage() {
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
                File Tree
              </li>
            </ol>
            <ComponentPager />
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-white">
            File Tree
          </h1>

          <p className="mt-2 font-sans text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            A composable file tree with search, nested folders, and keyboard
            focus styles built on top of Radix Accordion.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm leading-relaxed dark:text-neutral-400">
            Use it to render project structures, navigation sidebars, or any
            hierarchical data where folders and files need to be browsed and
            filtered.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm leading-relaxed dark:text-neutral-400">
            Install using the shadcn CLI to add the file tree component to your
            application.
          </p>

          <div className="mt-10">
            <CodeBlockInstall componentName="file-tree" />
          </div>

          <h2 className="sr-only" id="preview">
            Preview
          </h2>

          <div className="mt-10 rounded-sm border border-neutral-200 bg-neutral-50/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-[0_18px_45px_rgba(15,23,42,0.7)]">
            <Tabs
              aria-label="File Tree preview, code, and build with v0"
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
                  Search for a file or folder to auto-expand matching branches.
                  Click folders to toggle them and select a file to highlight
                  it.
                </p>

                <div className="mt-4 rounded-sm border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
                  <FileTree
                    aria-label="Project files"
                    className="max-h-[320px] w-full overflow-auto"
                    defaultExpanded={["src", "components"]}
                    defaultSelected="FileTree.tsx"
                  >
                    <FileTreeSearch placeholder="Search files..." />
                    <Folder id="src" label="src">
                      <Folder id="components" label="components">
                        <File label="FileTree.tsx" />
                        <File label="Sidebar.tsx" />
                        <File label="Button.tsx" />
                      </Folder>
                      <Folder id="app" label="app">
                        <File label="layout.tsx" />
                        <File label="page.tsx" />
                      </Folder>
                    </Folder>
                    <Folder id="public" label="public">
                      <File label="favicon.ico" />
                    </Folder>
                    <File label="package.json" />
                    <File label="tsconfig.json" />
                  </FileTree>
                </div>
              </TabsContent>

              <TabsContent
                className="space-y-4 pt-4 focus-visible:outline-none"
                value="code"
              >
                <h2 className="sr-only" id="usage">
                  Usage
                </h2>

                <p className="font-sans text-neutral-600 text-sm dark:text-neutral-400">
                  Import the primitives from{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    @/components/ui/file-tree
                  </code>{" "}
                  and compose them into your own tree structure.
                </p>

                <div className="mt-4">
                  <CodeBlock
                    code={`import {
  FileTree,
  FileTreeSearch,
  Folder,
  File,
} from "@/components/ui/file-tree";

export function ExampleFileTree() {
  return (
    <FileTree
      aria-label="Project files"
      defaultExpanded={["src", "components"]}
      defaultSelected="FileTree.tsx"
    >
      <FileTreeSearch placeholder="Search files..." />
      <Folder id="src" label="src">
        <Folder id="components" label="components">
          <File label="FileTree.tsx" />
          <File label="Sidebar.tsx" />
        </Folder>
        <Folder id="app" label="app">
          <File label="layout.tsx" />
          <File label="page.tsx" />
        </Folder>
      </Folder>
      <Folder id="public" label="public">
        <File label="favicon.ico" />
      </Folder>
      <File label="package.json" />
    </FileTree>
  );
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
                  Build with v0
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
                  to customize and generate variations. This lets you quickly
                  adapt the file tree to your own routes and data.
                </p>

                <div className="mt-6">
                  <ComponentActions name="file-tree" />
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
                file-tree
              </span>
              <span>Props</span>
            </div>

            <dl className="mt-3 divide-y divide-neutral-200 border border-neutral-200 text-[13px] dark:divide-neutral-800 dark:border-neutral-800">
              <div className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  defaultExpanded
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Optional array of folder ids that should start expanded.
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  defaultSelected
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Optional id or label of the file that should start selected.
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  className
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  Optional class name applied to the outer tree container.
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
