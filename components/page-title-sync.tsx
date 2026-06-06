"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { getRouteDocumentTitle } from "@/lib/seo-routes";

export function PageTitleSync() {
  const pathname = usePathname();

  useEffect(() => {
    const nextTitle = getRouteDocumentTitle(pathname);
    const frame = window.requestAnimationFrame(() => {
      document.title = nextTitle;
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
