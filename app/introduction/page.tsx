import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";

export default function IntroductionPage() {
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
                Introduction
              </li>
            </ol>
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl">
            Introduction
          </h1>
          <p className="mt-2 font-sans text-lg text-neutral-600">
            Iconiq brings motion to interface icons while keeping the simplicity
            of Lucide.
          </p>

          <div className="mt-10 space-y-4 font-sans text-neutral-600 text-sm leading-relaxed">
            <p>
              Instead of shipping a heavy icon package, Iconiq provides
              copy-paste React components that live directly in your project.
            </p>
            <p>
              This gives you full control over styling, animation, and behavior.
            </p>
            <div>
              <h2 className="mb-2 font-sans font-semibold text-neutral-900 text-sm">
                Principles
              </h2>
              <ul className="list-disc space-y-1 pl-5 font-sans text-neutral-600 text-sm">
                <li>Minimal and consistent design</li>
                <li>Subtle, purposeful motion</li>
                <li>Easy developer integration</li>
              </ul>
            </div>
            <p>
              Works with any React framework including Next.js, Vite, and Remix.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-end border-neutral-200 border-t pt-6">
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900"
              href="/installation"
            >
              Installation
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </main>
      <OnThisPage />
    </div>
  );
}
