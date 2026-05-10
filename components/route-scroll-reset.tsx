"use client";

import { useLayoutEffect } from "react";

export function RouteScrollReset() {
  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const frame = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });

      return () => {
        cancelAnimationFrame(frame);
        window.history.scrollRestoration = previous;
      };
    }

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  return null;
}
