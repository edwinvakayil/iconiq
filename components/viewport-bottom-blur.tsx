"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Soft “fog” at the bottom of the viewport — layered translucent gradients only,
 * no backdrop blur, so text underneath stays sharp and readable.
 * Hidden while the site footer is in view so the footer stays clear.
 */
export function ViewportBottomBlur() {
  const pathname = usePathname();
  const [footerInView, setFooterInView] = useState(false);

  const mask =
    "[mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)]";

  // biome-ignore lint/correctness/useExhaustiveDependencies: footer mounts/unmounts by route (e.g. /sponsorship); re-bind observer after navigation.
  useEffect(() => {
    const el = document.getElementById("site-footer");
    if (!el) {
      setFooterInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setFooterInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[min(36vh,260px)] transition-opacity duration-300 ease-out motion-reduce:h-[min(24vh,150px)] ${footerInView ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-t from-background/78 via-background/32 to-transparent dark:from-background/88 dark:via-background/38 ${mask}`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t from-white/42 via-white/12 to-transparent dark:hidden ${mask}`}
      />
    </div>
  );
}
