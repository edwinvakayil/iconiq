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
                Motion-first component library
              </p>
              <Separator />
              <dl className="space-y-3">
                <div className="space-y-1">
                  <dt className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    Components
                  </dt>
                  <dd className="text-[15px] text-foreground">
                    {componentCount} registry pages
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    Workflow
                  </dt>
                  <dd className="text-[15px] text-foreground">
                    shadcn installable
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    Format
                  </dt>
                  <dd className="text-[15px] text-foreground">
                    Copy-paste React source
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-6 lg:col-span-8">
              <h1 className="max-w-5xl text-4xl text-foreground tracking-[-0.08em] sm:text-5xl lg:text-[4.6rem]">
                A sharper way to ship animated UI components.
              </h1>
              <p className="max-w-3xl text-[16px] text-secondary leading-7 sm:text-[18px] sm:leading-8">
                Iconiq packages motion-aware components into a cleaner
                source-first workflow. White-first surfaces, quiet details, and
                docs that make it easy to install, inspect, and adapt each
                primitive.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  className="border border-foreground bg-foreground px-5 py-3 font-mono text-[10px] text-background uppercase tracking-[0.18em] transition-colors hover:bg-foreground/90"
                  href="/introduction"
                >
                  Read the intro
                </Link>
                <Link
                  className="border border-border/85 bg-muted/20 px-5 py-3 font-mono text-[10px] text-foreground uppercase tracking-[0.18em] transition-colors hover:bg-muted/45"
                  href="/components/motion-accordion"
                >
                  Browse components
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <DocsSection
            className="lg:col-span-8"
            description="Iconiq is built around motion-aware components, editable registry files, and docs that help teams install faster without giving up source ownership."
            index="01"
            title="Why Teams Pick Iconiq"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Each component lands directly in your codebase, so motion, spacing, and states stay fully editable.",
                "Live playgrounds, install commands, and API details sit together on the same page so implementation moves faster.",
                "The visual language stays restrained and modern instead of burying components under heavy chrome or generic docs patterns.",
                "Registry delivery keeps the workflow lightweight while still feeling production-ready from the first paste.",
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
            description="Jump straight into the parts of the library you need."
            index="02"
            title="Start Here"
          >
            <div className="space-y-3">
              {[
                {
                  href: "/installation",
                  label: "Installation",
                  note: "Set up the registry workflow",
                },
                {
                  href: "/components/button",
                  label: "Component docs",
                  note: "Live previews with real API details",
                },
                {
                  href: "/components/motion-accordion",
                  label: "Motion accordion",
                  note: "Open a spring-driven interaction demo",
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
