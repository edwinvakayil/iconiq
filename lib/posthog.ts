import posthog from "posthog-js";

import { SITE } from "@/constants";
import type { PostHogEventName } from "@/lib/posthog-events";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

const POSTHOG_INIT_OPTIONS = {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
} as const;

function getProductionHostname(): string {
  try {
    return new URL(SITE.URL).hostname;
  } catch {
    return "iconiqui.com";
  }
}

function isProductionHostname(hostname: string): boolean {
  const productionHostname = getProductionHostname();
  return (
    hostname === productionHostname || hostname === `www.${productionHostname}`
  );
}

/** True when custom events should be sent (production, or localhost in dev). */
export function isPostHogCaptureEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const { hostname } = window.location;

  if (LOCAL_HOSTNAMES.has(hostname)) {
    return process.env.NODE_ENV === "development";
  }

  return isProductionHostname(hostname);
}

/** @deprecated Use `isPostHogCaptureEnabled`. */
export function isPostHogEnabled(): boolean {
  return isPostHogCaptureEnabled();
}

let hasInitialized = false;

/** Initialize PostHog on the client when a project token is configured. */
export function initPostHogIfNeeded(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!projectToken) {
    return false;
  }

  if (!hasInitialized) {
    posthog.init(projectToken, POSTHOG_INIT_OPTIONS);
    hasInitialized = true;
  }

  return true;
}

export function getPostHogBaseContext(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  return {
    page_path: window.location.pathname,
  };
}

export function capturePostHogEvent(
  event: PostHogEventName,
  properties?: Record<string, unknown>
): void {
  if (!isPostHogCaptureEnabled()) {
    return;
  }

  if (!initPostHogIfNeeded()) {
    return;
  }

  posthog.capture(event, {
    ...getPostHogBaseContext(),
    ...properties,
  });
}
