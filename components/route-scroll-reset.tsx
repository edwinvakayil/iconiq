"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

import { scrollToTop } from "@/lib/scroll-to-top";

export function RouteScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    if (pathname && !window.location.hash) {
      scrollToTop();

      const frame = requestAnimationFrame(scrollToTop);

      return () => {
        cancelAnimationFrame(frame);
        window.history.scrollRestoration = previous;
      };
    }

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, [pathname]);

  return null;
}
