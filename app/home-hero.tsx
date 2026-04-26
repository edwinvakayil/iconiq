import Link from "next/link";

import { DocsSection } from "@/components/docs/page-shell";
import { Separator } from "@/components/ui/separator";
import { SITE_SECTIONS } from "@/lib/site-nav";

const componentCount =
  SITE_SECTIONS.find((section) => section.label === "Components")?.children
    .length ?? 0;

export function HomeHero() {
  return (
    <section className="bg-background py-10 sm:py-12 lg:py-16">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-10 px-4 sm:px-6 lg:px-10">
        <div className="space-y-8 pt-8">
          <Separator />
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-5 lg:col-span-4">
              <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.32em]">
                Component registry for product teams
              </p>
              <Separator />
              <dl className="space-y-3">
                <div className="space-y-1">
                  <dt className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    Library
                  </dt>
                  <dd className="text-[15px] text-foreground">
                    {componentCount} documented primitives
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    Delivery
                  </dt>
                  <dd className="text-[15px] text-foreground">
                    shadcn registry install
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    Ownership
                  </dt>
                  <dd className="text-[15px] text-foreground">
                    Source files in your app
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-6 lg:col-span-8">
              <h1 className="max-w-5xl text-4xl text-foreground tracking-[-0.08em] sm:text-5xl lg:text-[4.6rem]">
                A more disciplined way to build polished React interfaces.
              </h1>
              <p className="max-w-3xl text-[16px] text-secondary leading-7 sm:text-[18px] sm:leading-8">
                Iconiq offers a focused library of motion-aware components for
                teams that value clarity, implementation control, and
                production-grade execution. Review each component in context,
                install it as source, and adapt it directly within your own
                system.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  className="border border-foreground bg-foreground px-5 py-3 font-mono text-[10px] text-background uppercase tracking-[0.18em] transition-colors hover:bg-foreground/90"
                  href="/introduction"
                >
                  Review overview
                </Link>
                <Link
                  className="border border-border/85 bg-muted/20 px-5 py-3 font-mono text-[10px] text-foreground uppercase tracking-[0.18em] transition-colors hover:bg-muted/45"
                  href="/components/motion-accordion"
                >
                  Open library
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <DocsSection
            className="lg:col-span-8"
            description="The library is structured for teams that need to evaluate components quickly, adopt them confidently, and maintain full control after installation."
            index="01"
            title="What Sets Iconiq Apart"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Components are delivered as editable source files, making customization, review, and long-term maintenance far more practical.",
                "Documentation combines previews, installation steps, and implementation notes so teams can assess behavior before adopting it.",
                "Motion is applied with restraint to support state changes and interaction clarity rather than visual excess.",
                "The registry workflow keeps adoption lightweight while preserving the engineering ownership expected in mature product teams.",
              ].map((note) => (
                <div
                  className="border border-border/80 bg-muted/[0.18] px-4 py-4 text-[14px] text-secondary leading-6"
                  key={note}
                >
                  {note}
                </div>
              ))}
            </div>
          </DocsSection>

          <DocsSection
            className="lg:col-span-4"
            description="Use these entry points to review the system, understand the install flow, and inspect representative component patterns."
            index="02"
            title="Suggested Starting Points"
          >
            <div className="space-y-3">
              {[
                {
                  href: "/installation",
                  label: "Installation guide",
                  note: "Understand the source-first registry workflow",
                },
                {
                  href: "/components/button",
                  label: "Documentation",
                  note: "See previews, usage examples, and API reference together",
                },
                {
                  href: "/components/motion-accordion",
                  label: "Reference component",
                  note: "Review a representative interaction pattern in detail",
                },
              ].map((item) => (
                <Link
                  className="block border border-border/80 bg-muted/[0.14] px-4 py-4 transition-colors hover:bg-muted/45"
                  href={item.href}
                  key={item.href}
                >
                  <p className="font-medium text-[15px] text-foreground tracking-[-0.03em]">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-[13px] text-secondary leading-5 tracking-[-0.01em]">
                    {item.note}
                  </p>
                </Link>
              ))}
            </div>
          </DocsSection>
        </div>
      </div>
    </section>
  );
}
