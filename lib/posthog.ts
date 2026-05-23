import posthog from "posthog-js";

import { SITE } from "@/constants";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

function getProductionHostname(): string {
  try {
    return new URL(SITE.URL).hostname;
  } catch {
    return "iconiqui.com";
  }
}

/** True only on the deployed site (e.g. iconiqui.com), not localhost. */
export function isPostHogEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const { hostname } = window.location;

  if (LOCAL_HOSTNAMES.has(hostname)) {
    return false;
  }

  const productionHostname = getProductionHostname();
  return (
    hostname === productionHostname || hostname === `www.${productionHostname}`
  );
}

export function capturePostHogEvent(
  event: string,
  properties?: Record<string, unknown>
): void {
  if (!isPostHogEnabled()) {
    return;
  }

  posthog.capture(event, properties);
}
