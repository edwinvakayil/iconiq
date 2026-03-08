import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { getIcons } from "@/actions/get-icons";
import { IconsList } from "@/components/list";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";

export default function IconLibraryPage() {
  const icons = getIcons();

  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 font-sans text-neutral-500 text-sm dark:text-neutral-400">
              <li>
                <Link
                  className="transition-colors hover:text-neutral-900 dark:hover:text-white"
                  href="/"
                >
                  Docs
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400 dark:text-neutral-500" />
              </li>
              <li
                aria-current="page"
                className="text-neutral-900 dark:text-white"
              >
                Icon Library
              </li>
            </ol>
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-white">
            Icon Library
          </h1>
          <p className="mt-2 font-sans text-lg text-neutral-600 dark:text-neutral-300">
            Browse all available Iconiq icons.
          </p>
          <p className="mt-6 font-sans text-neutral-600 text-sm dark:text-neutral-300">
            Each icon is built with Motion and follows the Lucide design system,
            ensuring consistency across modern interfaces.
          </p>
          <p className="mt-6 font-sans text-neutral-600 text-sm dark:text-neutral-300">
            All icons are copy-paste React components and can be customized
            directly in your project.
          </p>
        </div>

        <div className="w-full px-4 pb-12 sm:px-6">
          <IconsList icons={icons} />
        </div>

        <div className="mx-auto max-w-[720px] px-4 pb-12 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              href="/installation"
            >
              <span aria-hidden="true">←</span>
              Installation
            </Link>
          </div>
        </div>
      </main>
      <OnThisPage />
    </div>
  );
}
