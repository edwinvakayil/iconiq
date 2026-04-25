"use client";

import { usePathname } from "next/navigation";

import { SidebarNav } from "@/components/sidebar-nav";

const DOCS_PREFIXES = ["/introduction", "/installation", "/components"];

export function DocsSidebar() {
  const pathname = usePathname();
  const isDocsPage = DOCS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isDocsPage) return null;
  return <SidebarNav />;
}
