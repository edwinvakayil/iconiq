import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { ComponentPager } from "@/components/component-pager";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertPreview } from "./alert-preview";

export default function AlertPage() {
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
                Alert
              </li>
            </ol>
            <ComponentPager />
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-white">
            Alert
          </h1>

          <p className="mt-2 font-sans text-lg text-neutral-600 leading-relaxed dark:text-neutral-300">
            Dismissible system alerts with success, error, warning, and info
            variants. Built with Framer Motion for enter/exit animations and an
            optional auto-dismiss progress bar.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm leading-relaxed dark:text-neutral-300">
            Use for notifications, form feedback, or system messages. Each
            variant has distinct colors and icons. Supports optional
            description, close button, and configurable auto-dismiss duration.
          </p>

          <div className="mt-10">
            <CodeBlockInstall componentName="alert" />
          </div>

          <h2 className="sr-only" id="preview">
            Preview
          </h2>

          <div className="mt-10 rounded-sm border border-neutral-200 bg-neutral-50/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/70 dark:shadow-[0_18px_45px_rgba(15,23,42,0.7)]">
            <Tabs
              aria-label="Alert preview, code, and get the component"
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
                  Dismiss alerts with the close button or wait for auto-dismiss.
                  Use &quot;Show again&quot; to reset.
                </p>

                <AlertPreview />
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
                    SystemAlert
                  </code>{" "}
                  from{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    @/components/ui/alert
                  </code>
                  . Control visibility with{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    isVisible
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    onClose
                  </code>
                  . Pass{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    variant
                  </code>{" "}
                  (success | error | warning | info),{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    title
                  </code>
                  , optional{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    description
                  </code>
                  , and{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    autoDismiss
                  </code>{" "}
                  (seconds).
                </p>

                <div className="mt-4">
                  <CodeBlock
                    code={`"use client";

import { useState } from "react";
import { SystemAlert } from "@/components/ui/alert";

export function Example() {
  const [visible, setVisible] = useState(true);

  return (
    <SystemAlert
      id="one"
      variant="success"
      title="Success"
      description="Your changes have been saved."
      isVisible={visible}
      onClose={() => setVisible(false)}
      autoDismiss={5}
    />
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
                  <ComponentActions name="alert" />
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
                alert
              </span>
              <span>SystemAlertProps</span>
            </div>

            <dl className="mt-3 divide-y divide-neutral-200 border border-neutral-200 text-[13px] dark:divide-neutral-800 dark:border-neutral-800">
              <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  id
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  string — Unique id for the alert (used by onClose).
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  variant
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  &quot;success&quot; | &quot;error&quot; | &quot;warning&quot;
                  | &quot;info&quot; — Visual style and icon.
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  title
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  string — Alert heading.
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  description
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  string (optional) — Secondary text below the title.
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  isVisible
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  boolean — When false, the alert is removed (animated out).
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  onClose
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  (id: string) =&gt; void — Called when the user closes the
                  alert or auto-dismiss ends (caller should set isVisible to
                  false).
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-x-4 px-3 py-2.5">
                <dt className="font-mono text-neutral-900 text-xs dark:text-neutral-100">
                  autoDismiss
                </dt>
                <dd className="text-neutral-600 dark:text-neutral-300">
                  number (optional) — Seconds until the progress bar completes
                  (default 5). The bar is visual only; pair with a timer if you
                  want actual auto-dismiss.
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
