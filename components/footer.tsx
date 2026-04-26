import Link from "next/link";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { LINK, SITE } from "@/constants";

type FooterLink = {
  href: string;
  internal?: boolean;
  label: string;
};

const productLinks = [
  { label: "Introduction", href: "/introduction" },
  { label: "Installation", href: "/installation" },
  { label: "Components", href: "/components/button" },
  { label: "Sponsorship", href: "/sponsorship" },
] as const;

const resourceLinks: readonly FooterLink[] = [
  { label: "GitHub", href: LINK.GITHUB },
  { label: "X", href: LINK.TWITTER },
  { label: "Sponsor", href: "/sponsorship", internal: true },
];

const Footer = () => {
  return (
    <footer className="mt-auto w-full shrink-0 border-neutral-200/80 border-t bg-background dark:border-neutral-800/80 dark:bg-background">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 sm:py-9 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.75fr)_minmax(220px,0.75fr)] lg:gap-10">
          <div className="space-y-4">
            <Logo
              className="gap-3 text-[18px] tracking-[-0.03em]"
              iconSize={18}
            />
            <p className="max-w-md text-[15px] text-secondary leading-6">
              Motion-powered, registry-ready components for teams that want
              source-first UI instead of locked packages.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
              <span>React</span>
              <span>Motion</span>
              <span>Open Source</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
              Explore
            </p>
            <Separator />
            <nav className="space-y-2.5">
              {productLinks.map((item) => (
                <Link
                  className="block text-[15px] text-foreground tracking-[-0.02em] transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
              Elsewhere
            </p>
            <Separator />
            <div className="space-y-2.5">
              {resourceLinks.map((item) =>
                item.internal ? (
                  <Link
                    className="block text-[15px] text-foreground tracking-[-0.02em] transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    className="block text-[15px] text-foreground tracking-[-0.02em] transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                    href={item.href}
                    key={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-7 space-y-3">
          <Separator />
          <div className="flex flex-col gap-3 font-mono text-[11px] text-muted-foreground tracking-[0.14em] sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} {SITE.NAME}. Built by{" "}
              <a
                className="text-foreground transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                href="https://www.edwinvakayil.info"
                rel="noopener noreferrer"
                target="_blank"
              >
                Edwin Vakayil
              </a>
              .
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                className="transition-colors hover:text-foreground"
                href={LINK.GITHUB}
                rel="noopener noreferrer"
                target="_blank"
              >
                Open source project
              </a>
              <span>{SITE.URL.replace("https://", "")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
