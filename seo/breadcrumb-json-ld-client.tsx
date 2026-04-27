"use client";

import { usePathname } from "next/navigation";

import { SITE } from "@/constants";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbListItem = {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
};

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE.URL}${path}`;
}

export function BreadcrumbJsonLdClient({ items }: { items: BreadcrumbItem[] }) {
  const pathname = usePathname();
  const visibleItems = items.filter(
    (item) => item.label.toLowerCase() !== "docs"
  );

  const itemListElement = visibleItems
    .map((item, index) => {
      const isLast = index === visibleItems.length - 1;
      const url = item.href
        ? toAbsoluteUrl(item.href)
        : isLast
          ? toAbsoluteUrl(pathname || "/")
          : null;

      if (!url) {
        return null;
      }

      return {
        "@type": "ListItem",
        position: index + 1,
        name:
          item.href === "/" && item.label.toLowerCase() === "overview"
            ? SITE.NAME
            : item.label,
        item: url,
      };
    })
    .filter((item): item is BreadcrumbListItem => item !== null);

  if (itemListElement.length < 2) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
}
