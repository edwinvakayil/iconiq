import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { getIcons } from "@/actions/get-icons";
import { ButtonSvgBuilder } from "@/components/button-svg-builder";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";

export default function ButtonSvgPage() {
  const icons = getIcons();

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
                  href="/icons"
                >
                  Icons
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>
              <li aria-current="page" className="text-neutral-900">
                Button + Icon
              </li>
            </ol>
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl">
            Button + Icon
          </h1>
          <p className="mt-2 font-sans text-lg text-neutral-600">
            Use any Iconiq icon inside a shadcn Button.
          </p>
          <p className="mt-6 font-sans text-neutral-600 text-sm">
            Select an icon below to preview it inside a button. You can then
            copy the complete example (Button + Icon) or run the CLI command to
            add the icon to your project.
          </p>

          <div className="mt-10">
            <ButtonSvgBuilder icons={icons} />
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
          </div>
        </div>
      </main>
      <OnThisPage />
    </div>
  );
}
