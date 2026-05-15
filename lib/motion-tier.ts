export type MotionTier = "full" | "lite" | "none";

/** Detect how much motion the device can handle without jank. */
export function getMotionTier(): MotionTier {
  if (typeof window === "undefined") {
    return "full";
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "none";
  }

  const connection = (
    navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    }
  ).connection;
  const saveData = connection?.saveData === true;
  const slowConnection =
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g";

  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;

  const lowPowerCpu = cores <= 4;
  const lowMemory = memory !== undefined && memory < 4;

  if (saveData || slowConnection || lowPowerCpu || lowMemory) {
    return "lite";
  }

  return "full";
}

export function supportsViewTransitions(tier: MotionTier) {
  return (
    tier === "full" &&
    typeof CSS !== "undefined" &&
    CSS.supports("view-transition-name", "none")
  );
}
