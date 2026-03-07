import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CodeBlockInstall } from "@/components/code-block-install";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { CodeBlock as RegistryCodeBlock } from "@/registry/code-block";

export default function CodeBlockPage() {
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
                Code Block
              </li>
            </ol>
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl">
            Code Block
          </h1>
          <p className="mt-2 font-sans text-lg text-neutral-600">
            A minimal code block component featuring a language indicator and
            copy-to-clipboard action.
          </p>
          <p className="mt-6 font-sans text-neutral-600 text-sm">
            Install via the shadcn CLI and use it to present code snippets with
            a clean, developer-friendly interface.
          </p>

          <div className="mt-10">
            <CodeBlockInstall />
          </div>

          <h2 className="mt-12 font-sans font-semibold text-lg text-neutral-900">
            Preview
          </h2>
          <p className="mt-1 font-sans text-neutral-600 text-sm">
            The component supports a{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs">
              code
            </code>{" "}
            string, optional{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs">
              language
            </code>{" "}
            label, and dark mode.
          </p>
          <div className="mt-4">
            <RegistryCodeBlock
              code={`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

greet("World");`}
              language="ts"
            />
          </div>

          <h2 className="mt-12 font-sans font-semibold text-lg text-neutral-900">
            Usage
          </h2>
          <p className="mt-1 font-sans text-neutral-600 text-sm">
            Import the component and pass a{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs">
              code
            </code>{" "}
            string and optional{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs">
              language
            </code>{" "}
            label. Use it in docs, README sections, or any place you need to
            display snippets with a copy button.
          </p>
          <div className="mt-4">
            <RegistryCodeBlock
              code={
                'import { CodeBlock } from "@/components/ui/code-block";\n\n<CodeBlock\n  code={`const x = 42;`}\n  language="ts"\n/>'
              }
              language="tsx"
            />
          </div>
        </div>

        <div className="mx-auto max-w-[720px] px-4 pb-12 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-neutral-200 border-t pt-6">
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900"
              href="/icons"
            >
              <span aria-hidden="true">←</span>
              Icon Library
            </Link>
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900"
              href="/icons/button-svg"
            >
              Button + Icon
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </main>
      <OnThisPage />
    </div>
  );
}
