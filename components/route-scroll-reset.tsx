"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { scrollToTop } from "@/lib/scroll-to-top";

export function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    if (!pathname || window.location.hash) {
      return () => {
        window.history.scrollRestoration = previous;
      };
    }

    const runScroll = () => scrollToTop();

    if (typeof document.startViewTransition === "function") {
      const onTransitionEnd = () => runScroll();

      document.addEventListener("viewtransitionend", onTransitionEnd, {
        once: true,
      });

      const fallbackTimer = window.setTimeout(runScroll, 180);

      return () => {
        document.removeEventListener("viewtransitionend", onTransitionEnd);
        window.clearTimeout(fallbackTimer);
        window.history.scrollRestoration = previous;
      };
    }

    const frame = requestAnimationFrame(runScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.history.scrollRestoration = previous;
    };
  }, [pathname]);

  return null;
}
