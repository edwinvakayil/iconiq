import { ViewportFogVisibility } from "@/components/viewport-fog-visibility";

const mask =
  "[mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)]";

/**
 * Bottom viewport fog: server-rendered gradient layers inside a thin client
 * visibility wrapper so paint isn’t gated on hydration.
 */
export function ViewportBottomFog() {
  return (
    <ViewportFogVisibility>
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-t from-background/78 via-background/32 to-transparent dark:from-background/88 dark:via-background/38 ${mask}`}
      />
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-t from-white/42 via-white/12 to-transparent dark:hidden ${mask}`}
      />
    </ViewportFogVisibility>
  );
}
