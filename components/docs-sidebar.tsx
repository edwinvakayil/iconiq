"use client";

import { usePathname } from "next/navigation";

import { SidebarNav } from "@/components/sidebar-nav";
import { SECTION_PATH_PREFIX } from "@/lib/section-paths";

const DOCS_PREFIXES = [
  "/introduction",
  "/installation",
  "/mcp",
  "/components",
  "/radix-base-ui",
  ...Object.values(SECTION_PATH_PREFIX),
];

export function DocsSidebar() {
  const pathname = usePathname();
  const isDocsPage = DOCS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isDocsPage) return null;
  return <SidebarNav />;
}
