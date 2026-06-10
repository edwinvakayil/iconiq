import type { Metadata } from "next";
import Link from "next/link";

import { DocsPageRail } from "@/components/docs/component-page-rail";
import {
  docsPageArticleClassName,
  docsPageBodyClassName,
  docsPageDescriptionClassName,
  docsPageGridClassName,
  docsPageLinkListClassName,
  docsPageListClassName,
  docsPageSectionClassName,
  docsPageSectionTitleClassName,
  docsPageShellClassName,
  docsPageTitleClassName,
} from "@/components/docs/docs-page-layout";
import {
  PageReveal,
  PageStagger,
  PageStaggerItem,
} from "@/components/page-reveal";
import { BeatingHeartTitle } from "@/components/sponsorship/beating-heart-title";
import { LINK, SITE } from "@/constants";
import { createMetadata } from "@/seo/metadata";

const sponsorshipTagline =
  "Built to give something back to the community—not to get paid for it.";

export const metadata: Metadata = createMetadata({
  title: `Sponsor ${SITE.NAME}`,
  description: `${SITE.NAME} is a free, open-source UI library built to give back to the community. Optional support helps keep the project maintained.`,
  canonical: "/sponsorship",
  ogTitle: `Sponsor ${SITE.NAME} | Support Open Source`,
});

const sections = [
  { id: "intention", label: "The intention" },
  { id: "community", label: "Community" },
];

const projectFocus = [
  "Documentation, guides, and examples that match how people actually build.",
  "Bug fixes, accessibility passes, and interaction polish across components.",
  "Room to prototype new primitives and keep the registry workflow smooth.",
];

export default function SponsorshipPage() {
  return (
    <main className="min-w-0 flex-1">
      <div className={docsPageShellClassName}>
        <div className={docsPageGridClassName}>
          <div className="min-w-0">
            <article className={docsPageArticleClassName}>
              <PageStagger delayChildren={0.04}>
                <PageStaggerItem>
                  <header className="space-y-3">
                    <div className="max-w-3xl space-y-2">
                      <h1 className={docsPageTitleClassName}>
                        Sponsor {SITE.NAME}
                      </h1>
                      <p className={docsPageDescriptionClassName}>
                        {sponsorshipTagline}
                      </p>
                    </div>
                  </header>
                </PageStaggerItem>
              </PageStagger>

              <div className={docsPageBodyClassName}>
                <PageReveal inView>
                  <p>
                    I did not start {SITE.NAME} to get paid for what I am doing.
                    The only intention behind it is to put something useful back
                    into the open-source community—the same way other projects
                    helped me when I was learning to build interfaces.
                  </p>
                </PageReveal>

                <PageReveal inView>
                  <p>
                    {SITE.NAME} is free and open source—UI with minimal motion,
                    built for people who prefer calm, standard interfaces. You
                    install them through the shadcn registry as local files. If
                    it saves you a sprint or makes UI work a little more
                    enjoyable, that is already enough. Anything beyond that is
                    just a way to keep giving to the people who find it next.
                  </p>
                </PageReveal>

                <PageReveal inView>
                  <section className={docsPageSectionClassName} id="intention">
                    <h2 className={docsPageSectionTitleClassName}>
                      The intention
                    </h2>
                    <p>
                      This is volunteer work for the community. Time goes into
                      the same details you would care about inside your own
                      product—nothing is held back behind a paywall.
                    </p>
                    <ul className={docsPageListClassName}>
                      {projectFocus.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                </PageReveal>

                <PageReveal inView>
                  <BeatingHeartTitle />
                </PageReveal>

                <PageReveal inView>
                  <section className={docsPageSectionClassName} id="community">
                    <h2 className={docsPageSectionTitleClassName}>Community</h2>
                    <p>
                      There is no expectation of payment. If you want to help
                      the project reach more builders, these are the simplest
                      ways to show up.
                    </p>
                    <ul className={docsPageLinkListClassName}>
                      <li>
                        <a
                          className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                          href={LINK.GITHUB}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Star on GitHub
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                          href={LINK.TWITTER}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Follow on X
                        </a>
                      </li>
                      <li>
                        <Link
                          className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
                          href="/installation"
                        >
                          Share the installation guide
                        </Link>
                      </li>
                    </ul>
                  </section>
                </PageReveal>
              </div>
            </article>
          </div>

          <DocsPageRail
            editHref={`${LINK.GITHUB}/edit/main/app/(site)/sponsorship/page.tsx`}
            sections={sections}
          />
        </div>
      </div>
    </main>
  );
}
