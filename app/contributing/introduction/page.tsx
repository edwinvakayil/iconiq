import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import { LINK } from "@/constants";

export default function ContributingIntroductionPage() {
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
                Introduction
              </li>
            </ol>
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl">
            Contributing
          </h1>
          <p className="mt-2 font-sans text-lg text-neutral-600">
            Iconiq is open source. We welcome contributions from the community.
          </p>

          <div className="mt-10 space-y-4 font-sans text-neutral-600 text-sm leading-relaxed">
            <p>
              Whether you want to report a bug, suggest a new icon or component,
              improve the docs, or submit a pull request, your help makes the
              project better for everyone.
            </p>
            <div>
              <h2 className="mb-2 font-sans font-semibold text-neutral-900 text-sm">
                How you can contribute
              </h2>
              <ul className="list-disc space-y-1 pl-5 font-sans text-neutral-600 text-sm">
                <li>
                  Report issues or request new icons or components on GitHub
                </li>
                <li>
                  Submit pull requests for new icons or components or fixes
                </li>
                <li>Improve documentation and examples</li>
                <li>Share feedback and ideas in discussions</li>
              </ul>
            </div>
            <p>
              The project lives on GitHub. For detailed guidelines, code of
              conduct, and step-by-step instructions for contributing code, see
              the{" "}
              <a
                className="font-medium text-neutral-900 underline underline-offset-4 hover:no-underline"
                href={`${LINK.GITHUB}#readme`}
                rel="noopener noreferrer"
                target="_blank"
              >
                README
              </a>{" "}
              and{" "}
              <a
                className="font-medium text-neutral-900 underline underline-offset-4 hover:no-underline"
                href={`${LINK.GITHUB}/blob/main/CONTRIBUTING.md`}
                rel="noopener noreferrer"
                target="_blank"
              >
                CONTRIBUTING
              </a>{" "}
              guide on the repository.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-end pt-6">
            <Link
              className="inline-flex items-center gap-1 font-medium font-sans text-neutral-700 text-sm transition-colors hover:text-neutral-900"
              href="/contributing/code"
            >
              Contributing Code
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </main>
      <OnThisPage />
    </div>
  );
}
