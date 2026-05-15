import Link from "next/link";

import { NotFoundInteractiveGrid } from "@/components/not-found/interactive-grid";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background">
      <NotFoundInteractiveGrid />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-6 rounded-full bg-muted px-3 py-1 font-sans text-muted-foreground text-xs tracking-wide">
          Error 404
        </p>

        <h1 className="font-sans font-semibold text-[clamp(1.875rem,5vw,2.75rem)] text-foreground leading-[1.08] tracking-tight">
          <span className="block">Nothing lives at this URL,</span>
          <span className="block">but the rest of Iconiq does.</span>
        </h1>

        <p className="mt-5 max-w-120 font-sans text-[0.95rem] text-muted-foreground leading-relaxed">
          Double-check the link or head home—this path isn’t part of the docs
          right now.
        </p>

        <Link
          className="mt-10 inline-flex min-h-11 min-w-44 items-center justify-center rounded-full bg-primary px-10 font-medium font-sans text-[0.95rem] text-background transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
          href="/"
        >
          Take me Back
        </Link>
      </main>
    </div>
  );
}
