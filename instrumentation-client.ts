import posthog from "posthog-js";

import { isPostHogEnabled } from "@/lib/posthog";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (isPostHogEnabled() && projectToken) {
  posthog.init(projectToken, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: false,
  });
}

// IMPORTANT: Never combine this approach with other client-side PostHog initialization approaches,
// especially components like a PostHogProvider. instrumentation-client.ts is the correct solution
// for initializing client-side PostHog in Next.js 15.3+ apps.
