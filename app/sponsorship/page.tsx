import type { Metadata } from "next";
import Link from "next/link";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { BeatingHeartTitle } from "@/components/sponsorship/beating-heart-title";
import { BuyMeACoffeeEmbed } from "@/components/sponsorship/buy-me-a-coffee-embed";
import { LINK, SITE } from "@/constants";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: `Sponsor ${SITE.NAME}`,
  description: `Support the development of ${SITE.NAME} — a free open-source library of motion-powered React components. Your support helps keep the project growing.`,
  canonical: "/sponsorship",
  ogTitle: `Sponsor ${SITE.NAME} | Support Open Source`,
});

const supportAreas = [
  "Documentation, guides, and examples that match how people actually build.",
  "Bug fixes, accessibility passes, and interaction polish across components.",
  "Room to prototype new primitives and keep the registry workflow smooth.",
];

export default function SponsorshipPage() {
  return (
    <main className="min-w-0 flex-1">
      <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <article className="w-full min-w-0 max-w-none">
          <PageStagger delayChildren={0.04}>
            <PageStaggerItem>
              <header className="space-y-3">
                <div className="max-w-3xl space-y-2">
                  <h1 className="scroll-m-20 font-semibold text-3xl text-foreground tracking-tighter">
                    Sponsor {SITE.NAME}
                  </h1>
                  <p className="max-w-3xl text-base text-muted-foreground">
                    {SITE.NAME} is free and open source—motion-aware React
                    components you install through the shadcn registry as local
                    files. Sponsorship and community signals help keep that work
                    sustainable.
                  </p>
                </div>
              </header>
            </PageStaggerItem>
          </PageStagger>

          <div className="mt-10 max-w-3xl space-y-8 text-[15px] text-secondary leading-7">
            <PageReveal inView>
              <div className="space-y-4">
                <p>
                  The goal is simple: ship interfaces that feel trustworthy and
                  editable, without hiding the implementation behind a package
                  wall. That takes ongoing time—writing, reviewing, and refining
                  the same details you would care about inside your own product.
                </p>
                <p>
                  If {SITE.NAME} saves you a sprint here or there, or makes UI
                  work a little more enjoyable, you are already part of the
                  story. Optional support just makes it easier to keep the
                  library honest and up to date for everyone else who discovers
                  it next.
                </p>
              </div>
            </PageReveal>

            <PageReveal inView>
              <section className="space-y-4">
                <h2 className="text-2xl text-foreground tracking-tight">
                  What support helps cover
                </h2>
                <ul className="list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
                  {supportAreas.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </PageReveal>

            <PageReveal inView>
              <BeatingHeartTitle />
            </PageReveal>

            <PageReveal inView>
              <section className="space-y-4">
                <h2 className="text-2xl text-foreground tracking-tight">
                  Ways to support
                </h2>
                <p>
                  None of this requires a big gesture. Stars improve
                  discoverability, social posts help teams find the project, and
                  a coffee-sized tip occasionally buys a focused evening of
                  implementation work.
                </p>
                <ul className="space-y-3">
                  <li>
                    <a
                      className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                      href={LINK.GITHUB}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Star on GitHub
                    </a>{" "}
                    — helps others find the repo.
                  </li>
                  <li>
                    <a
                      className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                      href={LINK.TWITTER}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Follow on X
                    </a>{" "}
                    for release notes and previews.
                  </li>
                  <li>
                    <Link
                      className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                      href="/installation"
                    >
                      Share the installation guide
                    </Link>{" "}
                    when {SITE.NAME} fits someone&apos;s stack.
                  </li>
                </ul>
                <p className="text-muted-foreground text-sm leading-6">
                  You can also leave a one-off tip on Buy Me a Coffee. The
                  widget script loads in the background after you open this
                  page.
                </p>
                <BuyMeACoffeeEmbed />
              </section>
            </PageReveal>
          </div>
        </article>
      </div>
    </main>
  );
}
