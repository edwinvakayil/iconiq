"use client";

import { Github, HeartHandshake, PencilLine } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { LINK } from "@/constants";
import { cn } from "@/lib/utils";

type RailSection = {
  id: string;
  label: string;
};

type RailAction = {
  external?: boolean;
  href: string;
  icon: ReactNode;
  label: string;
};

function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function OnThisPageIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  );
}

function RailActionLink({ action }: { action: RailAction }) {
  const className =
    "flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3";

  if (action.external) {
    return (
      <a
        className={className}
        href={action.href}
        rel="noreferrer"
        target="_blank"
      >
        {action.icon}
        <span>{action.label}</span>
      </a>
    );
  }

  return (
    <Link className={className} href={action.href}>
      {action.icon}
      <span>{action.label}</span>
    </Link>
  );
}

function buildDefaultRailActions() {
  return [
    {
      external: true,
      href: LINK.TWITTER,
      icon: <XLogoIcon className="size-3.5" />,
      label: "Follow @edwinvakayil",
    },
    {
      external: true,
      href: LINK.GITHUB,
      icon: <Github className="size-3.5" />,
      label: "Star on GitHub",
    },
    {
      href: "/sponsorship",
      icon: <HeartHandshake className="size-3.5" />,
      label: "Support Iconiq",
    },
  ] satisfies RailAction[];
}

export function DocsPageRail({
  actionLinks = buildDefaultRailActions(),
  editHref,
  sections,
}: {
  actionLinks?: RailAction[];
  editHref: string;
  sections: RailSection[];
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top
          );

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "0% 0% -70% 0%",
        threshold: 0.15,
      }
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  return (
    <motion.aside
      animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
      className="hidden xl:block xl:w-[248px]"
      initial={prefersReducedMotion ? false : { opacity: 0, x: 14 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              duration: 0.54,
              ease: [0.22, 1, 0.36, 1],
            }
      }
    >
      <div className="sticky top-[calc(var(--nav-stack-height-desktop)+24px)] space-y-6 pl-8">
        <div className="space-y-3">
          <p className="flex h-6 items-center gap-1.5 bg-background text-[0.85rem] text-foreground [&_svg]:pointer-events-none [&_svg]:size-4">
            <OnThisPageIcon className="size-4" />
            <span>On This Page</span>
          </p>
          <nav aria-label="On this page">
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    className={cn(
                      "block text-[0.9rem] text-muted-foreground transition-colors hover:text-foreground",
                      activeId === section.id
                        ? "font-medium text-foreground"
                        : undefined
                    )}
                    href={`#${section.id}`}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="h-px bg-border/80" />

        <div className="space-y-2 text-sm">
          <a
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3"
            href={editHref}
            rel="noreferrer"
            target="_blank"
          >
            <PencilLine className="size-3.5" />
            <span>Edit this page</span>
          </a>
          {actionLinks.map((action) => (
            <RailActionLink action={action} key={action.label} />
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

export function ComponentPageRail({
  componentName,
  sections,
}: {
  componentName: string;
  sections: RailSection[];
}) {
  return (
    <DocsPageRail
      editHref={`${LINK.GITHUB}/edit/main/app/components/${componentName}/page.tsx`}
      sections={sections}
    />
  );
}
