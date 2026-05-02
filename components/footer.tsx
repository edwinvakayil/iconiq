import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";

import { BrandLink } from "@/components/brand-wordmark";
import { Separator } from "@/components/ui/separator";
import { SITE } from "@/constants";

type FooterLink = {
  href: string;
  internal?: boolean;
  label: string;
};

const productLinks: readonly FooterLink[] = [
  { label: "Introduction", href: "/introduction", internal: true },
  { label: "Installation", href: "/installation", internal: true },
  { label: "Components", href: "/components/button", internal: true },
];

const resourceLinks: readonly FooterLink[] = [
  { label: "Sponsor", href: "/sponsorship", internal: true },
];

function FooterLinkRow({ item }: { item: FooterLink }) {
  const content = (
    <>
      <span>{item.label}</span>
      {item.internal ? (
        <ChevronRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      ) : (
        <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  const className =
    "group flex items-center justify-between gap-4 py-2 text-[14px] text-foreground tracking-[-0.02em] transition-colors hover:text-neutral-600 dark:hover:text-neutral-300";

  return item.internal ? (
    <Link className={className} href={item.href}>
      {content}
    </Link>
  ) : (
    <a
      className={className}
      href={item.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {content}
    </a>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly FooterLink[];
}) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
        {title}
      </p>
      <Separator />
      <nav className="space-y-0.5">
        {links.map((item) => (
          <FooterLinkRow item={item} key={`${title}-${item.href}`} />
        ))}
      </nav>
    </div>
  );
}

const Footer = () => {
  return (
    <footer className="mt-auto w-full shrink-0 border-neutral-200/80 border-t bg-background dark:border-neutral-800/80 dark:bg-background">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-7 sm:px-6 sm:py-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)] lg:gap-12">
          <div className="space-y-5">
            <BrandLink size="footer" />
            <div className="max-w-xl space-y-3">
              <p className="text-[16px] text-foreground leading-7 tracking-[-0.03em]">
                Open-source React components, polished documentation, and a
                registry workflow built for straightforward implementation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
              <Link
                className="group inline-flex items-center gap-2 text-[14px] text-foreground tracking-[-0.02em] transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                href="/components/button"
              >
                <span>Browse components</span>
                <ChevronRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                className="group inline-flex items-center gap-2 text-[14px] text-foreground tracking-[-0.02em] transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                href="/changelog"
              >
                <span>View changelog</span>
                <ChevronRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <FooterColumn links={productLinks} title="Explore" />
            <FooterColumn links={resourceLinks} title="Support" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Separator />
          <div className="flex flex-col gap-2.5 font-mono text-[11px] text-muted-foreground tracking-[0.14em] sm:flex-row sm:items-center sm:justify-between">
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
            <span>{SITE.URL.replace("https://", "")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
