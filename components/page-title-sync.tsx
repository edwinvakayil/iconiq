"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { SITE } from "@/constants";

export function PageTitleSync() {
  const pathname = usePathname();

  useEffect(() => {
    const nextTitle = pathname ? SITE.LOGO : SITE.LOGO;
    const frame = window.requestAnimationFrame(() => {
      document.title = nextTitle;
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
