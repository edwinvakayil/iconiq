"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useLayoutEffect, useState } from "react";

/**
 * Client-only visibility gate. Gradients are server-rendered as children.
 *
 * The footer uses a motion spring (`whileInView`); IntersectionObserver can
 * fire rapid intersect / not-intersect toggles during that animation. We hide
 * fog as soon as the footer enters the viewport, but only show fog again after
 * intersection stays false briefly (debounced) so the fog does not flicker.
 */
export function ViewportFogVisibility({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [footerInView, setFooterInView] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: footer mounts/unmounts by route (e.g. /sponsorship); re-bind observer after navigation.
  useLayoutEffect(() => {
    const el = document.getElementById("site-footer");
    if (!el) {
      setFooterInView(false);
      return;
    }

    let showFogTimer: ReturnType<typeof setTimeout> | undefined;

    const applyIntersection = (
      isIntersecting: boolean,
      opts?: { immediate: boolean }
    ) => {
      if (isIntersecting) {
        if (showFogTimer !== undefined) {
          clearTimeout(showFogTimer);
          showFogTimer = undefined;
        }
        setFooterInView(true);
        return;
      }

      if (opts?.immediate) {
        if (showFogTimer !== undefined) {
          clearTimeout(showFogTimer);
          showFogTimer = undefined;
        }
        setFooterInView(false);
        return;
      }

      if (showFogTimer !== undefined) {
        clearTimeout(showFogTimer);
      }

      showFogTimer = setTimeout(() => {
        showFogTimer = undefined;
        setFooterInView(false);
      }, 140);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          applyIntersection(entry.isIntersecting);
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);

    for (const record of observer.takeRecords()) {
      applyIntersection(record.isIntersecting, { immediate: true });
    }

    return () => {
      if (showFogTimer !== undefined) {
        clearTimeout(showFogTimer);
      }
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[min(36vh,260px)] motion-reduce:h-[min(24vh,150px)] ${footerInView ? "opacity-0" : "opacity-100"}`}
    >
      {children}
    </div>
  );
}
