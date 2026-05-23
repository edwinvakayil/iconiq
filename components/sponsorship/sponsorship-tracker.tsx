"use client";

import { useEffect } from "react";

import { capturePostHogEvent } from "@/lib/posthog";
import { POSTHOG_EVENTS } from "@/lib/posthog-events";

export function SponsorshipTracker() {
  useEffect(() => {
    capturePostHogEvent(POSTHOG_EVENTS.SPONSOR_PAGE_VIEWED);
  }, []);

  return null;
}
