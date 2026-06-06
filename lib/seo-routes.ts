import type { Metadata } from "next";

import { SITE } from "@/constants";
import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";
import { createMetadata } from "@/seo/metadata";

type RouteSeo = {
  title: string;
  description: string;
  keywords?: string[];
};

const GUIDE_SEO: Record<string, RouteSeo> = {
  "/": {
    title: `${SITE.NAME} | Open Source React Component Library`,
    description:
      "Iconiq UI is an open-source React component library with motion-powered primitives, shadcn registry installs, and editable source files for modern interfaces.",
    keywords: [
      "iconiq ui",
      "open source react component library",
      "shadcn registry components",
      "motion react components",
    ],
  },
  "/introduction": {
    title: "Introduction",
    description:
      "Learn how Iconiq UI works, why the registry workflow keeps components editable, and how minimal motion supports clear product interfaces.",
    keywords: [
      "iconiq ui introduction",
      "registry workflow",
      "editable react components",
    ],
  },
  "/installation": {
    title: "Installation",
    description:
      "Install Iconiq UI components with shadcn CLI commands, registry JSON files, and provider-specific Base UI or Radix entries.",
    keywords: [
      "iconiq ui installation",
      "shadcn add command",
      "registry install",
    ],
  },
  "/mcp": {
    title: "MCP",
    description:
      "Connect Iconiq UI to MCP-aware tools so agents can browse components, install commands, and registry files from the docs site.",
    keywords: ["iconiq ui mcp", "component registry mcp", "ai tooling"],
  },
  "/sponsorship": {
    title: "Sponsorship",
    description:
      "Support Iconiq UI development and help keep the open-source component library maintained.",
    keywords: ["sponsor iconiq ui", "open source sponsorship"],
  },
  "/foundation/typography": {
    title: "Typography",
    description:
      "Typography scales, semantic text styles, and foundation tokens used across Iconiq UI documentation and components.",
    keywords: ["iconiq ui typography", "design tokens", "type scale"],
  },
};

const SECTION_FALLBACK_SEO: Record<string, RouteSeo> = {
  Components: {
    title: "Components",
    description:
      "Browse Iconiq UI React components with live previews, shadcn install commands, and matching Base UI or Radix registry entries.",
    keywords: [
      "iconiq ui components",
      "react ui primitives",
      "shadcn registry",
    ],
  },
  "Special One": {
    title: "Special Components",
    description:
      "Signature Iconiq UI components with distinctive motion, layout, and interaction patterns beyond standard primitives.",
    keywords: ["iconiq ui special components", "motion ui patterns"],
  },
  Foundation: {
    title: "Foundation",
    description:
      "Foundation scales and shared design primitives that shape Iconiq UI interfaces and documentation.",
    keywords: ["iconiq ui foundation", "design system foundation"],
  },
  Texts: {
    title: "Text Effects",
    description:
      "Animated and expressive text components from Iconiq UI, including shimmer, typewriter, and inertia-driven copy.",
    keywords: ["iconiq ui text components", "animated text react"],
  },
};

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function buildComponentSeo(label: string): RouteSeo {
  return {
    title: `${label} React Component`,
    description: `Install and customize the Iconiq UI ${label} with shadcn registry commands, live previews, provider variants, and editable source files.`,
    keywords: [
      "iconiq ui",
      `${label.toLowerCase()} react component`,
      `${label.toLowerCase()} shadcn`,
      "motion react component",
    ],
  };
}

const ROUTE_SEO = new Map<string, RouteSeo>();

for (const [path, seo] of Object.entries(GUIDE_SEO)) {
  ROUTE_SEO.set(path, seo);
}

for (const section of SITE_SECTIONS) {
  const fallback = SECTION_FALLBACK_SEO[section.label];

  for (const child of section.children) {
    ROUTE_SEO.set(
      child.href,
      section.label === "Components" || section.label === "Special One"
        ? buildComponentSeo(child.label)
        : {
            title: `${child.label} | ${section.label}`,
            description:
              fallback?.description ??
              `Explore ${child.label} in Iconiq UI ${section.label.toLowerCase()} documentation.`,
            keywords: fallback?.keywords,
          }
    );
  }
}

/** High-value pages Google often surfaces as sitelinks. */
export const SITELINK_ROUTES = [
  { name: SITE.NAME, href: "/" },
  { name: "Introduction", href: "/introduction" },
  { name: "Installation", href: "/installation" },
  { name: "Button", href: "/components/button" },
  { name: "Dialog", href: "/components/dialog" },
  { name: "Accordion", href: "/components/accordion" },
  { name: "MCP", href: "/mcp" },
] as const;

export function getRouteSeo(pathname: string): RouteSeo {
  const normalized = normalizePathname(pathname);
  const matched = ROUTE_SEO.get(normalized);

  if (matched) {
    return matched;
  }

  return {
    title: SITE.NAME,
    description: SITE.DESCRIPTION.SHORT,
    keywords: [...SITE.KEYWORDS],
  };
}

export function getRouteMetadata(pathname: string): Metadata {
  const normalized = normalizePathname(pathname);
  const seo = getRouteSeo(normalized);
  const isHome = normalized === "/";

  return {
    ...createMetadata({
      title: isHome ? seo.title : seo.title,
      description: seo.description,
      canonical: normalized,
      ogTitle: isHome ? seo.title : `${seo.title} | ${SITE.NAME}`,
      keywords: seo.keywords,
    }),
    ...(isHome && {
      verification: {
        google: SITE.GOOGLE_SITE_VERIFICATION,
      },
    }),
  };
}

export function getRouteDocumentTitle(pathname: string) {
  const normalized = normalizePathname(pathname);
  const seo = getRouteSeo(normalized);

  if (normalized === "/") {
    return seo.title;
  }

  if (seo.title.includes(SITE.NAME)) {
    return seo.title;
  }

  return `${seo.title} | ${SITE.NAME}`;
}

export function getSitelinkEntries() {
  const seen = new Set<string>();

  return SITELINK_ROUTES.flatMap(({ name, href }) => {
    if (seen.has(href)) {
      return [];
    }

    seen.add(href);
    const seo = ROUTE_SEO.get(href);

    return [
      {
        name,
        url: `${SITE.URL}${href}`,
        description: seo?.description ?? SITE.DESCRIPTION.SHORT,
      },
    ];
  });
}

export function getPrimaryNavEntries() {
  return [
    ...BASE_LINKS.map(({ href, label }) => ({
      name: label,
      url: `${SITE.URL}${href}`,
    })),
    ...SITE_SECTIONS.flatMap((section) =>
      section.children.slice(0, 3).map(({ href, label }) => ({
        name: `${section.label}: ${label}`,
        url: `${SITE.URL}${href}`,
      }))
    ),
  ];
}
