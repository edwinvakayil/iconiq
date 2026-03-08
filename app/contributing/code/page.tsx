import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { LINK } from "@/constants";

const ICON_TEMPLATE = `'use client';

import { useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface [YourIconName]IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface [YourIconName]IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const [YourIconName]Icon = forwardRef<[YourIconName]IconHandle, [YourIconName]IconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('animate');
        } else {
          onMouseEnter?.(e);
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('normal');
        } else {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* your svg code here */}
        </svg>
      </div>
    );
  }
);

[YourIconName]Icon.displayName = '[YourIconName]Icon';

export { [YourIconName]Icon };`;

const ICON_LIST_SNIPPET = `import { [YourIconName]Icon } from './[icon-name]';

// Add at the top of ICON_LIST:
{
  name: '[icon-name]',
  icon: [YourIconName]Icon,
  keywords: ['keyword1', 'keyword2', 'keyword3'],
},`;

export default function ContributingCodePage() {
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
              <li>
                <Link
                  className="transition-colors hover:text-neutral-900"
                  href="/contributing/introduction"
                >
                  Contributing
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>
              <li aria-current="page" className="text-neutral-900">
                Contributing Code
              </li>
            </ol>
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl">
            Contributing Code
          </h1>
          <p className="mt-2 font-sans text-lg text-neutral-600">
            To contribute to the Iconiq library, follow the steps below.
          </p>

          <div className="mt-10 space-y-8 font-sans text-neutral-600 text-sm leading-relaxed">
            <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-4">
              <p className="font-semibold text-amber-900">Important</p>
              <p className="mt-1 text-amber-800">
                Iconiq only accepts contributions based on{" "}
                <a
                  className="font-medium underline underline-offset-4 hover:no-underline"
                  href="https://lucide.dev/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Lucide icons
                </a>
                . Pull requests containing custom icons or icons from other
                packs will be closed.
              </p>
              <p className="mt-2 text-amber-800">
                Animation quality: PRs with simple path length animations (
                <code className="rounded bg-amber-200/60 px-1 font-mono text-xs dark:bg-amber-900/40 dark:text-amber-100">
                  strokeDasharray
                </code>
                /
                <code className="rounded bg-amber-200/60 px-1 font-mono text-xs dark:bg-amber-900/40 dark:text-amber-100">
                  strokeDashoffset
                </code>{" "}
                &quot;drawing&quot; effect) will likely be rejected. We want
                creative, purposeful animations that enhance the icon.
              </p>
            </div>

            <p>We welcome contributions. Please follow these steps:</p>

            <section>
              <h2 className="mb-3 font-sans font-semibold text-base text-neutral-900">
                1. Fork and clone
              </h2>
              <p className="mb-2">
                Fork the repository on GitHub, then clone your fork:
              </p>
              <CodeBlock>
                git clone https://github.com/edwinvakayil/iconiq.git
              </CodeBlock>
              <p className="mt-2">
                Navigate to the project and create a branch:
              </p>
              <CodeBlock className="mt-2">{`cd iconiq
git checkout -b your-branch-name`}</CodeBlock>
            </section>

            <section>
              <h2 className="mb-3 font-sans font-semibold text-base text-neutral-900">
                2. Install dependencies
              </h2>
              <p className="mb-2">Iconiq uses pnpm:</p>
              <CodeBlock>pnpm install</CodeBlock>
            </section>

            <section>
              <h2 className="mb-3 font-sans font-semibold text-base text-neutral-900">
                3. Create your animated icon
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  In{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    /icons/
                  </code>
                  , create a new file with the icon name in lowercase and
                  hyphens (e.g.{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    heart-icon.tsx
                  </code>
                  ,{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    arrow-up.tsx
                  </code>
                  ).
                </li>
                <li>
                  Use the template below. Replace{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    [YourIconName]
                  </code>{" "}
                  with your icon name in PascalCase, and replace the SVG comment
                  with the path from{" "}
                  <a
                    className="font-medium text-neutral-900 underline underline-offset-4 hover:no-underline"
                    href="https://lucide.dev"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    lucide.dev
                  </a>
                  .
                </li>
                <li>
                  Add your animation logic using Framer Motion&apos;s{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    motion
                  </code>{" "}
                  components and the{" "}
                  <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                    controls
                  </code>{" "}
                  object.
                </li>
              </ul>
              <CodeBlock className="mt-3 text-xs">{ICON_TEMPLATE}</CodeBlock>
            </section>

            <section>
              <h2 className="mb-3 font-sans font-semibold text-base text-neutral-900">
                4. Add your icon to the icon list
              </h2>
              <p className="mb-2">
                Open{" "}
                <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                  icons/index.ts
                </code>
                . Import your icon and add it to the top of{" "}
                <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                  ICON_LIST
                </code>
                :
              </p>
              <CodeBlock className="mt-2 text-xs">
                {ICON_LIST_SNIPPET}
              </CodeBlock>
              <p className="mt-2">
                Use the exact name and keywords from lucide.dev for your icon.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-sans font-semibold text-base text-neutral-900">
                5. Update the registry
              </h2>
              <p className="mb-2">For new icons, run:</p>
              <CodeBlock>pnpm run gen-cli</CodeBlock>
              <p className="mt-2">
                This syncs your icon to the registry for the shadcn CLI.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-sans font-semibold text-base text-neutral-900">
                6. Build and test
              </h2>
              <CodeBlock>{`pnpm build
pnpm lint`}</CodeBlock>
            </section>

            <section>
              <h2 className="mb-3 font-sans font-semibold text-base text-neutral-900">
                7. Commit and open a pull request
              </h2>
              <CodeBlock>{`git commit -m "Add [icon-name] animated icon"
git push origin your-branch-name`}</CodeBlock>
              <p className="mt-2">
                Open a pull request on the original repository with a clear
                description of the icon and animation.
              </p>
            </section>

            <p className="pt-2 font-medium text-neutral-900">
              Thank you for contributing to Iconiq!
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-6">
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900"
              href="/contributing/introduction"
            >
              <span aria-hidden="true">←</span>
              Introduction
            </Link>
            <a
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900"
              href={LINK.GITHUB}
              rel="noopener noreferrer"
              target="_blank"
            >
              View on GitHub
              <span aria-hidden="true"> →</span>
            </a>
          </div>
        </div>
      </main>
      <OnThisPage />
    </div>
  );
}
