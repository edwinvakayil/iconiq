import Link from "next/link";

import { NotFoundInteractiveGrid } from "@/components/not-found/interactive-grid";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-220 flex items-center justify-center overflow-y-auto overscroll-none bg-[#f9f9f9] px-6 py-20 dark:bg-neutral-950">
      <NotFoundInteractiveGrid />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-1 h-28 bg-gradient-to-b from-[#f9f9f9]/95 via-[#f9f9f9]/50 to-transparent backdrop-blur-md dark:from-neutral-950/95 dark:via-neutral-950/50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-28 bg-gradient-to-t from-[#f9f9f9]/95 via-[#f9f9f9]/50 to-transparent backdrop-blur-md dark:from-neutral-950/95 dark:via-neutral-950/50"
      />

      <main className="pointer-events-none relative z-2 mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <p className="mb-6 rounded-full bg-neutral-200/90 px-3 py-1 font-sans text-muted-foreground text-xs tracking-wide dark:bg-neutral-800/80 dark:text-neutral-400">
          Error 404
        </p>

        <h1 className="font-sans font-semibold text-[#1a1a1a] text-[clamp(1.875rem,5vw,2.75rem)] leading-[1.08] tracking-tight dark:text-neutral-100">
          <span className="block">Nothing lives at this URL,</span>
          <span className="block">but the rest of Iconiq does.</span>
        </h1>

        <p className="mt-5 max-w-120 font-sans text-[0.95rem] text-muted-foreground leading-relaxed dark:text-neutral-400">
          Double-check the link or head home—this path isn’t part of the docs
          right now.
        </p>

        <Link
          className="pointer-events-auto mt-10 inline-flex min-h-11 min-w-44 items-center justify-center rounded-full bg-[#262626] px-10 font-medium font-sans text-[0.95rem] text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-neutral-950 focus-visible:outline-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:focus-visible:outline-neutral-100 dark:hover:bg-white"
          href="/"
        >
          Take me Back
        </Link>
      </main>
    </div>
  );
}
