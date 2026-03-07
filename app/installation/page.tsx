import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { getIcons } from "@/actions/get-icons";
import { CliBlock, CliBlockUrl } from "@/components/cli-block";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";

export default function InstallationPage() {
  const icons = getIcons();

  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 font-sans text-sm text-neutral-500">
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
              <li className="text-neutral-900" aria-current="page">
                Installation
              </li>
            </ol>
          </nav>

          <h1 className="font-sans text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Installation
          </h1>
          <p className="mt-2 font-sans text-lg text-neutral-600">
            How to install Iconiq shadcn components in your project.
          </p>

          <p className="font-medium text-neutral-900 mt-4 font-sans text-sm">
          Framework and package manager don’t matter.
          </p>
          <p className="font-sans text-sm text-neutral-600 mt-2">Installing Iconiq icons works the same way as installing any other shadcn component.</p>
          <p className="font-sans text-sm text-neutral-600 mt-2">
          Simply run the command below and replace <code className="font-mono text-sm text-neutral-900 bg-neutral-200 px-1 py-0.5 rounded-md">iconiq-icon-name</code> with the icon you want to add.
          </p>

          <div className="mt-6">
            <CliBlock
              icons={icons.filter((icon) => icon.name.length <= 20)}
            />
          </div>

          <p className="font-medium text-neutral-900 mt-4 font-sans text-sm">
            If above command doesn’t work you can use the full URL to the component’s JSON file instead.
          </p>

          <div className="mt-2">
            <CliBlockUrl
              icons={icons.filter((icon) => icon.name.length <= 20)}
            />
          </div>

          <p className="font-sans text-sm text-neutral-600 mt-6">
            The entire process is handled by the shadcn CLI, which fetches the icon from the Iconiq registry and adds it directly to your project as a ready-to-use React component.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6">
            <Link
              className="inline-flex items-center gap-1 font-sans text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900"
              href="/introduction"
            >
              <span aria-hidden="true">←</span>
              Introduction
            </Link>
            <Link
              className="inline-flex items-center gap-1 font-sans text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900"
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
