import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { PageStagger, PageStaggerItem } from "@/components/page-reveal";
import { SITE } from "@/constants";

export function HomeHero() {
  return (
    <section className="bg-background pt-12 pb-18 sm:pt-16 sm:pb-24">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <PageStagger
          className="mx-auto max-w-[1120px] text-left sm:text-center"
          delayChildren={0.04}
        >
          <PageStaggerItem>
            <div className="flex justify-start sm:justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-4 py-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                <Sparkles className="size-3.5" />
                Open-source React registry
              </span>
            </div>
          </PageStaggerItem>

          <PageStaggerItem>
            <h1 className="mt-6 max-w-[13ch] font-medium text-[2.52rem] text-foreground leading-[1.02] tracking-[-0.08em] sm:mx-auto sm:max-w-[24ch] sm:text-[4.35rem] sm:leading-[0.98] lg:text-[5.2rem]">
              <span className="block sm:whitespace-nowrap">
                Build UI that{" "}
                <span className="text-sky-500 dark:text-sky-400">
                  stands out.
                </span>
              </span>
              <span className="block sm:whitespace-nowrap">
                Without giving up the source.
              </span>
            </h1>
          </PageStaggerItem>

          <PageStaggerItem>
            <p className="mt-5 max-w-[640px] text-[15px] text-secondary leading-6 sm:mx-auto sm:mt-6 sm:max-w-[760px] sm:text-[18px] sm:leading-8">
              {SITE.NAME} gives product teams production-ready, fluid
              motion-powered React components they can install into the app,
              study in context, and adapt without fighting a black-box library.
            </p>
          </PageStaggerItem>

          <PageStaggerItem>
            <div className="mt-8 flex flex-wrap justify-start gap-3 sm:justify-center">
              <Link
                className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 font-medium text-background text-sm transition-colors hover:bg-foreground/92"
                href="/components"
              >
                Browse components
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className="inline-flex h-11 items-center rounded-full border border-border/80 bg-background px-5 font-medium text-foreground text-sm transition-colors hover:bg-muted/[0.22]"
                href="/installation"
              >
                View installation
              </Link>
            </div>
          </PageStaggerItem>
        </PageStagger>
      </div>
    </section>
  );
}
